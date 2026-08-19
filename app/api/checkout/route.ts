import { cookies } from 'next/headers';
import { prisma } from '@/server/prisma';
import { fail, handle, ok } from '@/server/api';
import { auth } from '@/features/auth';
import { checkoutCreate, checkoutGuest } from '@/lib/validators';
import { readAttributionCookie, attributionToOrderFields } from '@/features/attribution/server/attribution';
import { nextOrderNumber, resolveCampaignId } from '@/features/orders';
import { priceCart } from '@/features/cart';
import { createRazorpayOrder, RAZORPAY_KEY_ID_PUBLIC, RAZORPAY_MOCK } from '@/features/payments';

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
    const session = await auth();
    // `body` is kept because checkoutCreate strips unknown keys, and the guest
    // payload is parsed separately against its own schema.
    const body = (await req.json()) as unknown;
    const input = checkoutCreate.parse(body);

    let userId: string;
    let addressId: string;

    if (session?.user?.id) {
      // ---- signed in: the address must already be theirs -----------------
      if (!input.addressId) return fail('Choose a delivery address', 400);
      const address = await prisma.address.findUnique({ where: { id: input.addressId } });
      if (!address || address.userId !== session.user.id) return fail('Address not found', 404);
      userId = session.user.id;
      addressId = address.id;
    } else {
      // ---- guest ---------------------------------------------------------
      const guest = checkoutGuest.parse((body as { guest?: unknown })?.guest);
      const email = guest.email.trim().toLowerCase();

      // upsert, not find-then-create: two tabs paying at once would otherwise
      // race and one would hit the unique constraint on User.email.
      //
      // `update: {}` is doing real work - it means an EXISTING account is left
      // completely untouched. A guest must not be able to rename someone, mark
      // their email verified, or change their role by typing their address into
      // a checkout form. All a guest can do is add an order to it.
      //
      // `phone` is deliberately NOT copied onto the User: that column is unique
      // site-wide, so a shared family number would make the second buyer's
      // account creation fail at the database.
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
          phone: guest.address.phone,
          line1: guest.address.line1,
          line2: guest.address.line2 || null,
          area: guest.address.area,
          city: guest.address.city,
          pincode: guest.address.pincode,
          landmark: guest.address.landmark || null,
        },
        select: { id: true },
      });

      userId = user.id;
      addressId = created.id;
    }

    // ---- authoritative pricing -------------------------------------------
    const cart = await priceCart({ lines: input.lines, couponCode: input.couponCode });

    if (cart.lines.length === 0) {
      return fail('Your cart is empty', 400, { cart });
    }
    if (cart.rejected.length > 0 || cart.adjusted.length > 0) {
      return fail('Your cart changed - please review it before paying', 409, { cart });
    }

    // ---- slot ------------------------------------------------------------
    // Only an at-home collection needs a human to turn up. A posted kit stores
    // no slot at all, and we drop one if the client sent it anyway.
    if (cart.requiresSlot && (!input.slotDate || !input.slotWindow)) {
      return fail('This cart needs a collection date and time slot', 400);
    }
    const slotDate = cart.requiresSlot && input.slotDate ? new Date(input.slotDate) : null;
    const slotWindow = cart.requiresSlot ? (input.slotWindow ?? null) : null;

    // ---- attribution -----------------------------------------------------
    const cookieStore = await cookies();
    const attrPayload = readAttributionCookie(cookieStore);
    const attr = attributionToOrderFields(attrPayload);
    const campaignId = await resolveCampaignId(attrPayload);

    const orderNumber = await nextOrderNumber();
    const primary = cart.lines[0]!;

    // Razorpay is called *after* the DB insert so a failed API call cannot leave
    // an orphan row; the order stays BOOKED/PENDING and is retryable.
    // Relations are written with `connect`, not scalar FKs. Once ANY nested
    // write is present (items/events/payments), Prisma resolves `data` to the
    // checked variant, which rejects bare `userId`/`addressId` with a confusing
    // "Argument `user` is missing".
    const order = await prisma.order.create({
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
        fulfillmentMode: input.fulfillmentMode ?? primary.fulfillmentType,
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
