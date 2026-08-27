import 'server-only';

// =============================================================================
// features/orders - payment capture, exactly once
// -----------------------------------------------------------------------------
// Two independent callers can capture the same payment:
//
//   POST /api/checkout/verify   the browser, right after the Razorpay modal
//   POST /api/webhooks/razorpay Razorpay's server, moments later
//
// Both used to read `order.paidAt`, see null, and then write - a check-then-act
// race that could double-count a coupon redemption. This helper CLAIMS the
// capture with a conditional update instead: whoever flips paidAt from null
// wins, and only the winner runs the side effects (stock, coupon, event).
// The loser gets `claimed: false` and does nothing.
//
// Everything downstream of the claim is therefore safe to call twice.
// =============================================================================

import { prisma } from '@/server/prisma';
import { notifyCustomer } from '@/features/notifications';

export interface CaptureResult {
  /** True if THIS call transitioned the order to paid. */
  claimed: boolean;
  /** Kits we could not decrement because stock had already run out. */
  oversold: { slug: string; wanted: number }[];
}

export async function captureOrderPayment(opts: {
  orderId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string;
  method?: string;
  amount?: number;
  actorId?: string;
  source: 'verify' | 'webhook';
}): Promise<CaptureResult> {
  const oversold: { slug: string; wanted: number }[] = [];

  const claimed = await prisma.$transaction(async (tx) => {
    // The claim. `paidAt: null` in the WHERE is the whole concurrency control:
    // Postgres serialises the row update, so exactly one caller sees count 1.
    const { count } = await tx.order.updateMany({
      where: { id: opts.orderId, paidAt: null },
      data: { paidAt: new Date(), razorpayPaymentId: opts.razorpayPaymentId },
    });
    if (count === 0) return false;

    const order = await tx.order.findUniqueOrThrow({
      where: { id: opts.orderId },
      include: { items: true },
    });

    await tx.orderEvent.create({
      data: {
        orderId: order.id,
        label: opts.source === 'webhook' ? 'Payment captured (webhook)' : 'Payment captured',
        actorId: opts.actorId,
      },
    });

    // Payment row: update the pending one, or create it if the webhook beat the
    // browser to an order whose Payment row never got written.
    const existing = await tx.payment.findFirst({
      where: { orderId: order.id },
      orderBy: { createdAt: 'desc' },
    });
    if (existing) {
      await tx.payment.update({
        where: { id: existing.id },
        data: {
          status: 'CAPTURED',
          // The amount the gateway actually reported, when it told us. This
          // branch is the one that runs in practice, and it used not to write
          // `amount` at all - the value was read from the webhook, passed all
          // the way in, and then only used by the create branch below, which
          // checkout makes unreachable. So nothing in the system compared money
          // received against money owed, and the refund handler's
          // full-versus-partial test was measuring against a figure no payment
          // path had ever written.
          amount: opts.amount ?? existing.amount,
          razorpayPaymentId: opts.razorpayPaymentId,
          razorpaySignature: opts.razorpaySignature,
          method: opts.method,
          capturedAt: new Date(),
        },
      });
    } else {
      await tx.payment.create({
        data: {
          orderId: order.id,
          amount: opts.amount ?? order.total,
          currency: 'INR',
          status: 'CAPTURED',
          method: opts.method,
          razorpayOrderId: order.razorpayOrderId,
          razorpayPaymentId: opts.razorpayPaymentId,
          capturedAt: new Date(),
        },
      });
    }

    // Money received must equal money owed. Nothing can currently produce a
    // mismatch - the Razorpay order is minted server-side at the computed total
    // with no partial payment allowed - but "cannot happen" is exactly the class
    // of assumption that stops holding when a second capture path is added, and
    // an underpayment that nobody notices is a refund nobody can reconcile.
    if (typeof opts.amount === 'number' && opts.amount !== order.total) {
      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          label:
            opts.amount < order.total
              ? 'UNDERPAID - captured less than the order total'
              : 'Overpaid - captured more than the order total',
          meta: { captured: opts.amount, expected: order.total, razorpayPaymentId: opts.razorpayPaymentId },
        },
      });
      console.error(
        `[capture] amount mismatch on ${order.orderNumber}: captured ${opts.amount}, expected ${order.total}`
      );
    }

    // Stock comes off at capture, never at booking - an abandoned cart must not
    // hold inventory. The `gte` guard means a race can undersell but never drive
    // stock negative; a paid order is NEVER failed over stock, we just record it
    // so ops can source the extra kit.
    for (const item of order.items) {
      const res = await tx.package.updateMany({
        where: { id: item.packageId, stockQuantity: { gte: item.quantity } },
        data: { stockQuantity: { decrement: item.quantity } },
      });
      if (res.count === 0) oversold.push({ slug: item.slugSnapshot, wanted: item.quantity });
    }

    if (oversold.length > 0) {
      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          label: 'Paid but out of stock - needs manual sourcing',
          meta: { oversold },
        },
      });
    }

    // Coupons are consumed at payment, not at booking, so abandoned carts don't
    // burn redemptions. Inside the claim, so it can only ever run once.
    if (order.couponCode) {
      // The predicate is the enforcement. The increment used to be keyed on the
      // code alone, so it could not refuse to push usageCount past usageLimit -
      // the admin coupons screen renders "{usageCount} / {usageLimit}" and could
      // show 2001/2000, a state that should be unreachable.
      //
      // This does not make the limit airtight on its own: the check at booking
      // reads a counter that only moves here, so a backlog of booked-but-unpaid
      // orders is still a pool of pending redemptions. It does guarantee the
      // counter never lies about how many were actually spent, and that the
      // limit is honoured at the moment money changes hands.
      const { count: redeemed } = await tx.coupon.updateMany({
        where: {
          code: order.couponCode,
          OR: [{ usageLimit: null }, { usageCount: { lt: prisma.coupon.fields.usageLimit } }],
        },
        data: { usageCount: { increment: 1 } },
      });

      if (redeemed === 0) {
        // The discount stands - it was quoted, and the Razorpay order was minted
        // at the discounted total - but the overspend is recorded rather than
        // absorbed silently.
        await tx.orderEvent.create({
          data: {
            orderId: order.id,
            label: `Coupon ${order.couponCode} was already at its usage limit`,
            meta: { couponCode: order.couponCode, discount: order.discount },
          },
        });
      }
    }

    return true;
  });

  // AFTER the transaction, never inside it. A mail server is a network call
  // with someone else's latency; holding a payment transaction open across one
  // is how a busy inbox becomes a database problem. And notifyCustomer cannot
  // throw, so a failed send can never roll back a capture that really happened.
  //
  // Only on the claim. Verify and the webhook both reach here for the same
  // payment, and exactly one of them wins the paidAt claim - which is what stops
  // the customer being emailed twice.
  if (claimed) {
    const order = await prisma.order.findUnique({
      where: { id: opts.orderId },
      select: {
        orderNumber: true,
        total: true,
        fulfillmentMode: true,
        user: { select: { id: true, name: true, email: true } },
        items: { select: { nameSnapshot: true, quantity: true } },
      },
    });

    if (order) {
      await notifyCustomer({
        template: 'ORDER_CONFIRMED',
        to: order.user.email,
        userId: order.user.id,
        data: {
          orderNumber: order.orderNumber,
          customerName: order.user.name,
          items: order.items.map((i) => ({ name: i.nameSnapshot, quantity: i.quantity })),
          total: order.total,
          byPost: order.fulfillmentMode === 'KIT_BY_POST',
        },
      });
    }
  }

  return { claimed, oversold };
}
