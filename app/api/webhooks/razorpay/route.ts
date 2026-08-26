import { prisma } from '@/server/prisma';
import { verifyWebhookSignature } from '@/features/payments';
import { captureOrderPayment } from '@/features/orders';
import { linkLabAndNotify } from '@/features/lab';

/**
 * POST /api/webhooks/razorpay
 *
 * Razorpay server-to-server payment notifications. Authoritative source for
 * payment state - runs even if the user closes the browser before the
 * client-side /api/checkout/verify call lands.
 *
 * Events we care about:
 *   - payment.captured   → mark order paid (idempotent - verify route may
 *                          have already done it; we no-op if so).
 *   - payment.failed     → mark Payment FAILED with the error code.
 *   - refund.processed   → mark Payment REFUNDED, Order REFUNDED if full.
 *
 * Auth: HMAC-SHA256(rawBody, RAZORPAY_WEBHOOK_SECRET) compared to header
 * X-Razorpay-Signature. Configure the same secret in dashboard → Webhooks.
 */
export async function POST(req: Request) {
  // We need the raw body bytes for signature verification - once we parse it
  // through .json(), whitespace and key order get lost.
  const rawBody = await req.text();
  const headerSig = req.headers.get('x-razorpay-signature') ?? '';

  if (!verifyWebhookSignature(rawBody, headerSig)) {
    return new Response('forbidden', { status: 403 });
  }

  let body: {
    event?: string;
    payload?: {
      payment?: { entity?: Record<string, unknown> };
      refund?: { entity?: Record<string, unknown> };
    };
  };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new Response('invalid json', { status: 400 });
  }

  const event = body.event ?? '';
  const payment = body.payload?.payment?.entity as
    | {
        id?: string;
        order_id?: string;
        amount?: number;
        method?: string;
        status?: string;
        error_code?: string;
        error_description?: string;
      }
    | undefined;
  const refund = body.payload?.refund?.entity as
    | { id?: string; payment_id?: string; amount?: number; status?: string }
    | undefined;

  if (event === 'payment.captured' && payment?.order_id && payment.id) {
    await handlePaymentCaptured(payment);
  } else if (event === 'payment.failed' && payment?.order_id && payment.id) {
    await handlePaymentFailed(payment);
  } else if (event.startsWith('refund.') && refund?.payment_id) {
    await handleRefund(refund);
  }

  // Always 200 - Razorpay retries on non-2xx and we don't want to thrash on
  // unrecognised events.
  return Response.json({ ok: true });
}

async function handlePaymentCaptured(p: { id?: string; order_id?: string; amount?: number; method?: string }) {
  const order = await prisma.order.findFirst({ where: { razorpayOrderId: p.order_id } });
  if (!order) return;

  // Claims the capture atomically. If /api/checkout/verify already ran, this
  // returns claimed:false and writes nothing - which is what makes the coupon
  // redemption count exactly once across both paths.
  await captureOrderPayment({
    orderId: order.id,
    razorpayPaymentId: p.id!,
    method: p.method,
    amount: p.amount,
    source: 'webhook',
  });

  // Always (re)run lab notification, claimed or not: it is independently
  // idempotent via its labId:null claim, so this covers the case where verify
  // captured the payment but its lab-notify step hadn't completed yet.
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
}

async function handlePaymentFailed(p: {
  id?: string;
  order_id?: string;
  error_code?: string;
  error_description?: string;
}) {
  const order = await prisma.order.findFirst({ where: { razorpayOrderId: p.order_id } });
  if (!order) return;

  const existing = await prisma.payment.findFirst({
    where: { orderId: order.id, razorpayOrderId: p.order_id },
  });
  if (existing) {
    await prisma.payment.update({
      where: { id: existing.id },
      data: {
        status: 'FAILED',
        razorpayPaymentId: p.id,
        errorCode: p.error_code,
        errorDescription: p.error_description,
      },
    });
  }
  await prisma.orderEvent.create({
    data: {
      orderId: order.id,
      label: `Payment failed: ${p.error_code ?? 'unknown'}`,
      meta: { errorDescription: p.error_description },
    },
  });
}

async function handleRefund(r: { id?: string; payment_id?: string; amount?: number; status?: string }) {
  const payment = await prisma.payment.findFirst({
    where: { razorpayPaymentId: r.payment_id },
    include: { order: true },
  });
  if (!payment) return;

  const fullRefund = r.amount && r.amount >= payment.amount;
  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: { status: fullRefund ? 'REFUNDED' : 'PARTIALLY_REFUNDED' },
    }),
    prisma.order.update({
      where: { id: payment.orderId },
      data: {
        status: fullRefund ? 'REFUNDED' : payment.order.status,
        events: {
          create: { label: `Refund processed: ₹${((r.amount ?? 0) / 100).toFixed(2)}` },
        },
      },
    }),
  ]);
}
