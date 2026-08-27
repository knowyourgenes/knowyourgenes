import { cookies } from 'next/headers';
import { prisma } from '@/server/prisma';
import { fail, handle, ok } from '@/server/api';
import { auth } from '@/features/auth';
import { RECENT_ORDER_COOKIE, RECENT_ORDER_MAX_AGE } from '@/features/orders/recent-order';
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
 *
 * GUESTS REACH THIS WITHOUT A SESSION, and that is safe because the session was
 * never what secured it. The real proof is `verifyPaymentSignature`: an
 * HMAC over (razorpay_order_id | razorpay_payment_id) using our key secret.
 * Only Razorpay can produce it, and it is checked against the razorpayOrderId
 * already stored on the order. A caller who guesses an order id but cannot
 * forge that signature gets a 400 and nothing else. For a signed-in caller the
 * ownership check is still enforced on top, so nothing is loosened for them.
 */
export async function POST(req: Request) {
  return handle(async () => {
    const session = await auth();

    const body = await req.json();
    const input = checkoutVerify.parse(body);

    const order = await prisma.order.findUnique({ where: { id: input.orderId } });
    if (!order) return fail('Order not found', 404);
    // Only meaningful when there IS a session. A guest has no identity to check
    // against, which is why the signature below carries the whole proof.
    if (session?.user?.id && order.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return fail('Forbidden', 403);
    }

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
      // The order's own user, not the caller: a guest is not signed in, so there
      // is no actor id to record, and attributing the capture to the buyer is
      // what the order timeline wants to show anyway.
      actorId: order.userId,
      source: 'verify',
    });

    // Lets THIS browser - and only this browser - see the confirmation page for
    // an order it has no session to prove it owns. httpOnly so script cannot
    // read it, lax so it survives the return trip from Razorpay, and short
    // lived because it is a receipt stub, not a credential.
    const jar = await cookies();
    jar.set(RECENT_ORDER_COOKIE, order.orderNumber, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: RECENT_ORDER_MAX_AGE,
    });

    if (!claimed) {
      // The webhook got there first. Still a success from the buyer's side.
      return ok({ orderId: order.id, orderNumber: order.orderNumber, status: order.status, alreadyPaid: true });
    }

    // Now that the order is paid, link the processing lab and notify it. Runs
    // outside the transaction (it sends email) and never throws - a lab/email
    // failure must not undo a captured payment. Idempotent + race-safe with
    // the razorpay webhook, which calls the same helper.
    // LAB ROUTING IS MANUAL. Assignment used to happen right here, the instant a
    // payment captured: default active lab, else the first one, then an email.
    // With more than one lab that is a routing decision nobody made, so it now
    // waits for an admin - POST /api/admin/orders/[id]/assign-lab - and the lab
    // is emailed at the moment someone decides the work is theirs.
    //
    // The old behaviour is kept behind LAB_AUTO_ASSIGN=true so a single-lab
    // deployment can opt back in without a code change. Left off, an order
    // simply carries no lab until assigned, which the admin orders list shows.
    if (process.env.LAB_AUTO_ASSIGN === 'true') {
      await linkLabAndNotify(order.id);
    }

    return ok({
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paid: true,
    });
  });
}
