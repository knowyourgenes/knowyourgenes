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
      await tx.coupon.updateMany({
        where: { code: order.couponCode },
        data: { usageCount: { increment: 1 } },
      });
    }

    return true;
  });

  return { claimed, oversold };
}
