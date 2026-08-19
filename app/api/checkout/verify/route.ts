import { prisma } from '@/server/prisma';
import { fail, handle, isResponse, ok, requireApiRole } from '@/server/api';
import { checkoutVerify } from '@/lib/validators';
import { verifyPaymentSignature } from '@/features/payments';
import { captureOrderPayment } from '@/features/orders';
import { linkLabAndNotify } from '@/features/lab';

/**
 * POST /api/checkout/verify
 *
 * Called by the client right after the Razorpay Checkout modal returns success.
 * Verifies the signature, marks the Order as paid, and bumps the coupon's
 * usageCount (we only consume the coupon at payment success, not booking,
 * so abandoned carts don't burn redemptions).
 *
 * NOTE: This endpoint trusts the client to call it. The /api/webhooks/razorpay
 * route is the authoritative payment confirmation - it runs server-to-server
 * and reconciles missed verify calls (e.g., user closes the tab before the
 * client-side call lands).
 */
export async function POST(req: Request) {
  return handle(async () => {
    const guard = await requireApiRole(['USER', 'ADMIN', 'AGENT', 'COUNSELLOR', 'PARTNER']);
    if (isResponse(guard)) return guard;

    const body = await req.json();
    const input = checkoutVerify.parse(body);

    const order = await prisma.order.findUnique({ where: { id: input.orderId } });
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

    // Claims the capture and runs the side effects (stock, coupon, event) at
    // most once, even if the webhook is landing at the same moment.
    const { claimed } = await captureOrderPayment({
      orderId: order.id,
      razorpayPaymentId: input.razorpayPaymentId,
      razorpaySignature: input.razorpaySignature,
      actorId: guard.id,
      source: 'verify',
    });

    if (!claimed) {
      // The webhook got there first. Still a success from the buyer's side.
      return ok({ orderId: order.id, orderNumber: order.orderNumber, status: order.status, alreadyPaid: true });
    }

    // Now that the order is paid, link the processing lab and notify it. Runs
    // outside the transaction (it sends email) and never throws - a lab/email
    // failure must not undo a captured payment. Idempotent + race-safe with
    // the razorpay webhook, which calls the same helper.
    await linkLabAndNotify(order.id);

    return ok({
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paid: true,
    });
  });
}
