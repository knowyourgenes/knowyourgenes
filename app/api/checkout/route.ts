import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { fail, handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { checkoutCreate } from '@/lib/validators';
import { readAttributionCookie, attributionToOrderFields } from '@/lib/attribution';
import { applyCoupon, nextOrderNumber, resolveCampaignId } from '@/lib/orders';
import { createRazorpayOrder, RAZORPAY_KEY_ID_PUBLIC, RAZORPAY_MOCK } from '@/lib/razorpay';

/**
 * POST /api/checkout
 *
 * Creates a BOOKED order + a Razorpay order, ready for the client-side
 * Razorpay Checkout modal to take payment. The attribution cookie (kyg_attr)
 * is verified and denormalised onto the Order row at this moment — so even if
 * the user clears cookies later, we keep a record of where they came from.
 *
 * Flow:
 *   1. Auth — require any logged-in user (USER, AGENT, ADMIN, etc.).
 *   2. Validate body (package, address, slot, coupon).
 *   3. Compute pricing (subtotal + kit shipping if KIT_BY_POST − coupon discount).
 *   4. Read + verify attribution cookie; resolve to a Campaign FK if slug matches.
 *   5. Generate order number; create Order + Payment row in one transaction.
 *   6. Call Razorpay to mint an order_id.
 *   7. Persist the razorpay order_id on Order + Payment.
 *   8. Return the params the client needs to open Razorpay Checkout.
 *
 * Verification is a separate endpoint: POST /api/checkout/verify.
 */
export async function POST(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['USER', 'ADMIN', 'AGENT', 'COUNSELLOR', 'PARTNER']);
    if (isResponse(guard)) return guard;

    const body = await req.json();
    const input = checkoutCreate.parse(body);

    const [pkg, address] = await Promise.all([
      prisma.package.findUnique({ where: { id: input.packageId } }),
      prisma.address.findUnique({ where: { id: input.addressId } }),
    ]);
    if (!pkg || !pkg.active) return fail('Package not found or inactive', 404);
    if (!address || address.userId !== guard.id) return fail('Address not found', 404);

    // Decide fulfillment. Honour the requested mode if the package supports it.
    const fulfillmentMode =
      input.fulfillmentMode ?? (pkg.fulfillmentType === 'EITHER' ? 'KIT_BY_POST' : pkg.fulfillmentType);

    if (pkg.fulfillmentType !== 'EITHER' && pkg.fulfillmentType !== fulfillmentMode) {
      return fail(`This package only supports ${pkg.fulfillmentType}`, 400);
    }

    // Pricing — subtotal is the package price; add kit shipping for KIT_BY_POST.
    const subtotal = pkg.price;
    const kitFee = fulfillmentMode === 'KIT_BY_POST' ? pkg.kitShippingFee : 0;
    const coupon = await applyCoupon({ code: input.couponCode ?? null, subtotalPaise: subtotal });
    if (coupon.error) return fail(coupon.error, 400);
    const total = subtotal + kitFee - coupon.discount;
    if (total < 0) return fail('Total cannot be negative', 400);

    // Attribution — read the signed cookie, resolve campaign FK by slug.
    const cookieStore = await cookies();
    const attrPayload = readAttributionCookie(cookieStore);
    const attr = attributionToOrderFields(attrPayload);
    const campaignId = await resolveCampaignId(attrPayload);

    const orderNumber = await nextOrderNumber();

    // Create order + initial payment row in one transaction. Razorpay order
    // is minted *after* DB insert so a failed Razorpay call doesn't leave us
    // with an orphan row — we update with the razorpay id on success.
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          userId: guard.id,
          packageId: pkg.id,
          addressId: address.id,
          couponCode: coupon.couponCode,
          subtotal,
          discount: coupon.discount,
          collectionFee: kitFee,
          total,
          slotDate: new Date(input.slotDate),
          slotWindow: input.slotWindow,
          status: 'BOOKED',
          fulfillmentMode,
          campaignId,
          attrSource: attr.attrSource,
          attrMedium: attr.attrMedium,
          attrCampaign: attr.attrCampaign,
          attrTerm: attr.attrTerm,
          attrContent: attr.attrContent,
          attrReferrer: attr.attrReferrer,
          attrLandingPath: attr.attrLandingPath,
          attrFirstSeenAt: attr.attrFirstSeenAt,
          attrPayload: (attr.attrPayload ?? undefined) as object | undefined,
          events: {
            create: {
              label: 'Order booked, awaiting payment',
              actorId: guard.id,
              meta: attr.attrSource ? { attribution: { source: attr.attrSource, medium: attr.attrMedium } } : undefined,
            },
          },
          payments: {
            create: {
              amount: total,
              currency: 'INR',
              status: 'PENDING',
            },
          },
        },
        include: { payments: true },
      });
      return created;
    });

    // Razorpay order. If this fails the KYG order still exists (status BOOKED,
    // payment PENDING). The user can retry payment from /my orders without
    // duplicating the order.
    let razorpayOrder;
    try {
      razorpayOrder = await createRazorpayOrder({
        amountPaise: total,
        receipt: orderNumber,
        notes: {
          kyg_order_id: order.id,
          package_slug: pkg.slug,
          fulfillment: fulfillmentMode,
          user_id: guard.id,
        },
      });
    } catch (err) {
      // Surface the error but leave the KYG order intact for retry.
      return fail(err instanceof Error ? err.message : 'Razorpay order creation failed', 502, {
        orderId: order.id,
        orderNumber,
      });
    }

    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: razorpayOrder.id },
      }),
      prisma.payment.update({
        where: { id: order.payments[0].id },
        data: { razorpayOrderId: razorpayOrder.id },
      }),
    ]);

    return ok({
      orderId: order.id,
      orderNumber,
      total,
      currency: 'INR',
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
