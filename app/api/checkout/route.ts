import { cookies } from 'next/headers';
import type { z } from 'zod';
import type { FulfillmentType } from '@prisma/client';
import { prisma } from '@/server/prisma';
import { ApiError, fail, handle, ok } from '@/server/api';
import { auth } from '@/features/auth';
import { checkoutCreate, checkoutGuest } from '@/lib/validators';
import { normalisePhone } from '@/lib/utils';
import { clientIp, rateLimited } from '@/lib/rate-limit';
import { readAttributionCookie, attributionToOrderFields } from '@/features/attribution/server/attribution';
import { nextOrderNumber, resolveCampaignId } from '@/features/orders';
import { priceCart } from '@/features/cart';
import {
  createRazorpayOrder,
  RAZORPAY_KEY_ID_PUBLIC,
  RAZORPAY_MISCONFIGURED,
  RAZORPAY_MOCK,
} from '@/features/payments';

/**
 * POST /api/checkout
 *
 * Turns a cart into a BOOKED order plus a Razorpay order, ready for the
 * client-side Checkout modal to take payment.
 *
 * PRICING IS RECOMPUTED HERE. The body carries slugs and quantities only - the
 * browser never sends a price - and priceCart() re-reads live Package rows, so
 * what we bill cannot drift from the catalogue no matter what the client sends.
 *
 * If the re-price disagrees with what the customer was shown (a kit sold out, a
 * quantity had to be clamped), we refuse with 409 and hand back the corrected
 * cart rather than charging a total they never saw.
 *
 * GUESTS CAN BUY. There is no login wall: an unauthenticated caller sends an
 * email plus an address inline and the order is attached to that email - to the
 * existing account if one has that address, otherwise to a freshly created one.
 * Nobody is signed in by this route. Creating a session from an email typed into
 * a form would hand any stranger the account - and its genetic reports - of
 * whoever owns that mailbox.
 *
 * The response is IDENTICAL either way, deliberately: a different message for
 * "email already registered" turns checkout into an account-existence oracle.
 *
 * Flow:
 *   1. Auth - a session if there is one, otherwise the guest branch.
 *   2. Validate body (lines, address, optional slot, coupon).
 *   3. Re-price the cart server-side; bail on any rejection/adjustment.
 *   4. Require a collection slot only if the cart contains an at-home line.
 *   5. Read + verify the attribution cookie; resolve to a Campaign FK.
 *   6. Create Order + OrderItem[] + Payment in one transaction.
 *   7. Mint the Razorpay order, persist its id.
 *
 * Stock is NOT decremented here - see /api/checkout/verify. An unpaid order
 * must not hold inventory hostage.
 */
export async function POST(req: Request) {
  return handle(async () => {
    // Refuse BEFORE touching the database. Without keys the payment cannot be
    // taken, so every row created past this point would be an orphan BOOKED
    // order that no one can pay. Fails loudly on the first attempt rather than
    // accumulating litter until someone reads the table.
    if (RAZORPAY_MISCONFIGURED) {
      return fail('Payments are temporarily unavailable. Please try again shortly.', 503);
    }

    // Unauthenticated on the guest path, and it both reads the Coupon table and
    // CREATES rows. Registration is throttled one directory over for exactly
    // this reason; checkout, which can mint a User for any email you name, was
    // not throttled at all.
    if (rateLimited('checkout', clientIp(req), { windowMs: 10 * 60_000, max: 20 })) {
      return fail('Too many checkout attempts from this address. Please try again shortly.', 429);
    }

    const session = await auth();
    // `body` is kept because checkoutCreate strips unknown keys, and the guest
    // payload is parsed separately against its own schema.
    const body = (await req.json()) as unknown;
    const input = checkoutCreate.parse(body);

    // A signed-out caller must carry a valid guest block. Parsed HERE, before
    // any write, so a malformed one is rejected without side effects - but the
    // rows it implies are not created until the cart itself has been accepted.
    const guest = session?.user?.id ? null : checkoutGuest.parse((body as { guest?: unknown })?.guest);
    if (session?.user?.id && !input.addressId) return fail('Choose a delivery address', 400);

    // ---- authoritative pricing -------------------------------------------
    // EVERYTHING THAT VALIDATES THE REQUEST RUNS BEFORE ANYTHING IS WRITTEN.
    // The guest branch below creates a User and an Address, and it used to run
    // first - so a request rejected moments later for an empty or stale cart had
    // already committed both rows, unauthenticated, against an email typed into
    // a form. `handle` wraps no transaction, so nothing rolled them back.
    const cart = await priceCart({ lines: input.lines, couponCode: input.couponCode });

    if (cart.lines.length === 0) {
      return fail('Your cart is empty', 400, { cart });
    }
    if (cart.rejected.length > 0 || cart.adjusted.length > 0) {
      return fail('Your cart changed - please review it before paying', 409, { cart });
    }

    // ---- the price they were shown is the price they pay -------------------
    // `rejected`/`adjusted` above only notice a changed LINE SET. A changed
    // package price, a changed kit fee, or a coupon that lapsed between the cart
    // screen and the Pay button all arrive as a different `total`, which used to
    // be written straight into the order and the Razorpay amount - with the
    // coupon silently dropped to null. The client now sends what it displayed
    // and we refuse to bill anything else.
    //
    // Optional, deliberately: an older client that does not send the field still
    // checks out. It is a confirmation of the quote, not an input to it - the
    // total is still computed here and a mismatch is always resolved in the
    // customer's favour by refusing, never by charging.
    if (typeof input.expectedTotal === 'number' && input.expectedTotal !== cart.total) {
      return fail('The price changed while you were checking out - please review your cart', 409, {
        cart,
        shownTotal: input.expectedTotal,
        actualTotal: cart.total,
      });
    }

    // A coupon that stopped applying is a price change even when the total is
    // not sent, and silently saving `couponCode: null` is how it went unnoticed.
    if (input.couponCode && !cart.coupon?.applied) {
      return fail(cart.coupon?.error ?? 'That coupon can no longer be applied', 409, { cart });
    }

    // ---- fulfilment mode --------------------------------------------------
    // The mode decides whether a human is sent to someone's house, and it used
    // to be taken from the request body with no reference to the catalogue: the
    // one field the browser could still dictate in a route that otherwise
    // refuses to trust it for anything. Worse, the slot gate below is computed
    // from the package rows, so a client-chosen mode and the slot requirement
    // protecting it could disagree - and when they did, the route deleted the
    // slot and stored an at-home visit with no appointment time.
    //
    // A choice is only honoured where the catalogue actually offers one, which
    // is what EITHER means. Anything else is the package's own mode.
    const fulfillmentMode = resolveFulfillmentMode(input.fulfillmentMode, primaryFulfillment(cart));
    if (!fulfillmentMode) {
      return fail('That fulfilment method is not available for these tests', 409, { cart });
    }

    // ---- slot ------------------------------------------------------------
    // Only an at-home collection needs a human to turn up. A posted kit stores
    // no slot at all, and we drop one if the client sent it anyway.
    //
    // Keyed on the RESOLVED mode, not on `cart.requiresSlot`. The two are the
    // same thing now that the mode is derived from the catalogue, and reading
    // the field we are about to store is what keeps them from drifting apart
    // again: whatever goes in the `fulfillmentMode` column is what decided
    // whether a slot was demanded.
    const needsSlot = fulfillmentMode === 'AT_HOME_PHLEBOTOMIST';
    if (needsSlot && (!input.slotDate || !input.slotWindow)) {
      return fail('This cart needs a collection date and time slot', 400);
    }
    const slotDate = needsSlot && input.slotDate ? new Date(input.slotDate) : null;
    const slotWindow = needsSlot ? (input.slotWindow ?? null) : null;

    // ---- identity ---------------------------------------------------------
    // Deliberately the LAST read/write before the order itself. Everything that
    // could reject this request has already run, so a guest's User and Address
    // rows are only created for a request that is going to become an order.
    const { userId, addressId } = guest
      ? await resolveGuest(guest)
      : await resolveSignedIn(session!.user!.id!, input.addressId!);
    if (!userId) return fail('Address not found', 404);

    // ---- attribution -----------------------------------------------------
    const cookieStore = await cookies();
    const attrPayload = readAttributionCookie(cookieStore);
    const attr = attributionToOrderFields(attrPayload);
    const campaignId = await resolveCampaignId(attrPayload);

    const primary = cart.lines[0]!;

    // Razorpay is called *after* the DB insert so a failed API call cannot leave
    // an orphan row; the order stays BOOKED/PENDING and is retryable.
    // Relations are written with `connect`, not scalar FKs. Once ANY nested
    // write is present (items/events/payments), Prisma resolves `data` to the
    // checked variant, which rejects bare `userId`/`addressId` with a confusing
    // "Argument `user` is missing".
    const buildOrder = (orderNumber: string) =>
      prisma.order.create({
        data: {
          orderNumber,
          user: { connect: { id: userId } },
          // Denormalised primary line - see the comment on Order.packageId.
          package: { connect: { id: primary.packageId } },
          address: { connect: { id: addressId } },
          couponCode: cart.coupon?.applied ? cart.coupon.code : null,
          subtotal: cart.subtotal,
          discount: cart.discount,
          collectionFee: cart.shipping,
          total: cart.total,
          slotDate,
          slotWindow,
          status: 'BOOKED',
          fulfillmentMode,
          ...(campaignId ? { campaign: { connect: { id: campaignId } } } : {}),
          attrSource: attr.attrSource,
          attrMedium: attr.attrMedium,
          attrCampaign: attr.attrCampaign,
          attrTerm: attr.attrTerm,
          attrContent: attr.attrContent,
          attrReferrer: attr.attrReferrer,
          attrLandingPath: attr.attrLandingPath,
          attrFirstSeenAt: attr.attrFirstSeenAt,
          attrPayload: (attr.attrPayload ?? undefined) as object | undefined,
          items: {
            create: cart.lines.map((line) => ({
              package: { connect: { id: line.packageId } },
              nameSnapshot: line.name,
              slugSnapshot: line.slug,
              unitPrice: line.unitPrice,
              quantity: line.quantity,
              lineTotal: line.lineTotal,
              kitShippingFee: line.kitShippingFee,
              fulfillmentMode: line.fulfillmentType,
            })),
          },
          events: {
            create: {
              label:
                cart.lines.length === 1
                  ? 'Order booked, awaiting payment'
                  : `Order booked (${cart.itemCount} reports), awaiting payment`,
              actorId: userId,
              meta: attr.attrSource ? { attribution: { source: attr.attrSource, medium: attr.attrMedium } } : undefined,
            },
          },
          payments: {
            create: { amount: cart.total, currency: 'INR', status: 'PENDING' },
          },
        },
        include: { payments: true, items: true },
      });

    // Mint the number and insert together, retrying the PAIR on collision.
    // `nextOrderNumber` reads the current maximum and is not atomic, so two
    // overlapping checkouts can read the same one. Re-reading inside the loop is
    // the point: retrying the same number would just collide again.
    let order: Awaited<ReturnType<typeof buildOrder>> | undefined;
    let orderNumber = '';
    for (let attempt = 1; attempt <= 5; attempt++) {
      orderNumber = await nextOrderNumber();
      try {
        order = await buildOrder(orderNumber);
        break;
      } catch (err) {
        if (isDuplicateOrderNumber(err) && attempt < 5) continue;
        throw err;
      }
    }
    if (!order) {
      // Five consecutive losses is not contention, it is something wrong.
      throw new ApiError('Could not place your order just now. Please try again.', 503);
    }

    let razorpayOrder;
    try {
      razorpayOrder = await createRazorpayOrder({
        amountPaise: cart.total,
        receipt: orderNumber,
        notes: {
          kyg_order_id: order.id,
          items: cart.lines.map((l) => `${l.slug}x${l.quantity}`).join(','),
          user_id: userId,
        },
      });
    } catch (err) {
      // Surface the error but leave the order intact for retry.
      return fail(err instanceof Error ? err.message : 'Razorpay order creation failed', 502, {
        orderId: order.id,
        orderNumber,
      });
    }

    await prisma.$transaction([
      prisma.order.update({ where: { id: order.id }, data: { razorpayOrderId: razorpayOrder.id } }),
      prisma.payment.update({
        where: { id: order.payments[0]!.id },
        data: { razorpayOrderId: razorpayOrder.id },
      }),
    ]);

    return ok({
      orderId: order.id,
      orderNumber,
      total: cart.total,
      currency: 'INR',
      items: order.items.map((i) => ({
        slug: i.slugSnapshot,
        name: i.nameSnapshot,
        quantity: i.quantity,
        lineTotal: i.lineTotal,
      })),
      razorpay: {
        keyId: RAZORPAY_KEY_ID_PUBLIC,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        mock: RAZORPAY_MOCK,
      },
      attribution: attr.attrSource
        ? { source: attr.attrSource, medium: attr.attrMedium, campaign: attr.attrCampaign }
        : null,
    });
  });
}

// ---------------------------------------------------------------------------
// Helpers. Local to this route on purpose - they encode checkout's rules, not
// general ones, and promoting them would invite a second caller with different
// expectations.
// ---------------------------------------------------------------------------

/**
 * The catalogue's own mode for the cart, or null when the lines disagree.
 *
 * The order-level column is a single value, so a cart whose lines want different
 * fulfilment cannot be represented and must be refused rather than silently
 * resolved. It used to be decided by `cart.lines[0]`, which - because pricing
 * sorts lines alphabetically - meant a mixed cart's fulfilment was chosen by
 * whichever package name sorted first.
 *
 * EITHER is not a disagreement: it means that line accepts whatever the rest of
 * the cart settles on.
 */
function primaryFulfillment(cart: { lines: { fulfillmentType: FulfillmentType }[] }): FulfillmentType | null {
  const decided = new Set(cart.lines.map((l) => l.fulfillmentType).filter((t) => t !== 'EITHER'));
  if (decided.size > 1) return null;
  return (decided.values().next().value as FulfillmentType | undefined) ?? 'EITHER';
}

/**
 * Reconciles a requested mode against what the catalogue permits.
 *
 * Returns the mode to store, or null if the request is not honourable. A client
 * may only choose where the catalogue says EITHER; anywhere else its opinion is
 * ignored rather than trusted, because this field decides whether a phlebotomist
 * is dispatched to a stranger's home.
 *
 * EITHER is never stored. It means "not yet decided", and an order is the point
 * at which it has to be - leaving it in the column is what let one order open
 * both the courier leg and the agent leg at once. With no client preference it
 * resolves to KIT_BY_POST, which is the only mode currently operating.
 */
function resolveFulfillmentMode(
  requested: FulfillmentType | undefined,
  catalogue: FulfillmentType | null
): FulfillmentType | null {
  if (catalogue === null) return null; // mixed cart - cannot be one order

  if (catalogue === 'EITHER') {
    if (!requested || requested === 'EITHER') return 'KIT_BY_POST';
    return requested;
  }

  // The catalogue has decided. Agreement is fine; anything else is refused
  // rather than quietly overridden, so a tampered request fails loudly.
  if (!requested || requested === 'EITHER' || requested === catalogue) return catalogue;
  return null;
}

/** True for the unique-constraint violation on Order.orderNumber. */
function isDuplicateOrderNumber(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  if ((err as { code?: unknown }).code !== 'P2002') return false;
  const target = (err as { meta?: { target?: unknown } }).meta?.target;
  const fields = Array.isArray(target) ? target.map(String) : [String(target ?? '')];
  return fields.some((f) => f.includes('orderNumber'));
}

/** Signed-in buyer: the address must already be theirs. */
async function resolveSignedIn(userId: string, addressId: string) {
  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== userId) return { userId: null, addressId: '' };
  return { userId, addressId: address.id };
}

/**
 * Guest buyer: attach the order to the account that owns this email, creating
 * one if there is none.
 *
 * `update: {}` is doing real work - an EXISTING account is left completely
 * untouched. A guest must not be able to rename someone, mark their email
 * verified, or change their role by typing their address into a checkout form.
 *
 * `phone` is deliberately NOT copied onto the User: that column is unique
 * site-wide, so a shared family number would make the second buyer's account
 * creation fail at the database.
 *
 * The upsert (rather than find-then-create) is what stops two tabs paying at
 * once from racing into the unique constraint on User.email.
 */
async function resolveGuest(guest: z.infer<typeof checkoutGuest>) {
  const email = guest.email.trim().toLowerCase();

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: guest.address.fullName },
    select: { id: true },
  });

  const created = await prisma.address.create({
    data: {
      userId: user.id,
      fullName: guest.address.fullName,
      // Normalised here as well as in /api/addresses. Storing the bare ten
      // digits is what the courier API and WhatsApp both expect, and this write
      // site used to be the one that skipped it - freezing "+91 98765 43210"
      // onto a Shipment's dropPhone where nothing could correct it later.
      phone: normalisePhone(guest.address.phone),
      line1: guest.address.line1,
      line2: guest.address.line2 || null,
      area: guest.address.area,
      city: guest.address.city,
      pincode: guest.address.pincode,
      landmark: guest.address.landmark || null,
    },
    select: { id: true },
  });

  return { userId: user.id, addressId: created.id };
}
