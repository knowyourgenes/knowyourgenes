import { prisma } from '@/lib/prisma';
import { fail, handle, isResponse, ok, requireApiRole } from '@/lib/api';
import { checkoutVerify } from '@/lib/validators';
import { verifyPaymentSignature } from '@/lib/razorpay';

/**
 * POST /api/checkout/verify
 *
 * Called by the client right after the Razorpay Checkout modal returns success.
 * Verifies the signature, marks the Order as paid, and bumps the coupon's
 * usageCount (we only consume the coupon at payment success, not booking,
 * so abandoned carts don't burn redemptions).
 *
 * NOTE: This endpoint trusts the client to call it. The /api/webhooks/razorpay
 * route is the authoritative payment confirmation — it runs server-to-server
 * and reconciles missed verify calls (e.g., user closes the tab before the
 * client-side call lands).
 */
export async function POST(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['USER', 'ADMIN', 'AGENT', 'COUNSELLOR', 'PARTNER']);
    if (isResponse(guard)) return guard;

    const body = await req.json();
    const input = checkoutVerify.parse(body);

    const order = await prisma.order.findUnique({
      where: { id: input.orderId },
      include: { payments: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    if (!order) return fail('Order not found', 404);
    if (order.userId !== guard.id && guard.role !== 'ADMIN') return fail('Forbidden', 403);

    // The razorpay order id on file must match what the client claims succeeded.
    if (!order.razorpayOrderId || order.razorpayOrderId !== input.razorpayOrderId) {
      return fail('Razorpay order id mismatch', 400);
    }

    const valid = verifyPaymentSignature({
      razorpayOrderId: input.razorpayOrderId,
      razorpayPaymentId: input.razorpayPaymentId,
      razorpaySignature: input.razorpaySignature,
    });
    if (!valid) return fail('Invalid signature', 400);

    // Already paid — idempotent success.
    if (order.paidAt) {
      return ok({ orderId: order.id, status: order.status, alreadyPaid: true });
    }

    const payment = order.payments[0];

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          paidAt: new Date(),
          razorpayPaymentId: input.razorpayPaymentId,
          events: {
            create: { label: 'Payment captured', actorId: guard.id },
          },
        },
      });

      if (payment) {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'CAPTURED',
            razorpayPaymentId: input.razorpayPaymentId,
            razorpaySignature: input.razorpaySignature,
            capturedAt: new Date(),
          },
        });
      }

      // Consume coupon only after payment succeeds.
      if (order.couponCode) {
        await tx.coupon.update({
          where: { code: order.couponCode },
          data: { usageCount: { increment: 1 } },
        });
      }
    });

    return ok({
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paid: true,
    });
  });
}
