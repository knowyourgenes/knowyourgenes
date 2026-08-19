import { cookies } from 'next/headers';
import { prisma } from '@/server/prisma';
import { fail, handle, isResponse, ok, requireApiRole } from '@/server/api';
import { checkoutCreate } from '@/lib/validators';
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
 * Flow:
 *   1. Auth - require any logged-in user.
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
    const guard = await requireApiRole(['USER', 'ADMIN', 'AGENT', 'COUNSELLOR', 'PARTNER']);
    if (isResponse(guard)) return guard;

    const input = checkoutCreate.parse(await req.json());

    const address = await prisma.address.findUnique({ where: { id: input.addressId } });
    if (!address || address.userId !== guard.id) return fail('Address not found', 404);

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
        user: { connect: { id: guard.id } },
        // Denormalised primary line - see the comment on Order.packageId.
        package: { connect: { id: primary.packageId } },
        address: { connect: { id: address.id } },
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
            actorId: guard.id,
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
          user_id: guard.id,
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
