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
  } else if (event === 'refund.processed' && refund?.payment_id) {
    // ONLY `refund.processed`. This used to match the whole `refund.` family,
    // and `refund.created` fires the moment a refund is INITIATED - before any
    // money moves - so it marked the payment and the order REFUNDED and posted
    // "Refund processed" to the customer-visible timeline. `refund.failed` did
    // the same. The refund's own `status` field was destructured and never read.
    await handleRefund(refund);
  } else if (event.startsWith('refund.')) {
    // Recorded, not acted on. Worth a timeline entry so support can see a refund
    // was attempted, but it changes no money-bearing column.
    await noteRefundEvent(event, refund);
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

  // A failed ATTEMPT must never overwrite a captured payment. Razorpay redelivers
  // for hours, so a `payment.failed` for an earlier attempt can land after the
  // successful capture - and this used to write FAILED plus the failed attempt's
  // razorpayPaymentId straight over the row, with no guard on current status.
  // Money and Order.paidAt stayed correct, but refunds resolve by
  // razorpayPaymentId: once the row carried the wrong id, a refund against the
  // payment that actually took the money matched nothing and silently no-opped.
  //
  // updateMany with the status in the WHERE clause, matching how capture claims
  // its own write.
  const { count } = await prisma.payment.updateMany({
    where: { orderId: order.id, razorpayOrderId: p.order_id, status: 'PENDING' },
    data: {
      status: 'FAILED',
      razorpayPaymentId: p.id,
      errorCode: p.error_code,
      errorDescription: p.error_description,
    },
  });

  if (count === 0) {
    // Either there was no pending row, or it had already been captured. Say so
    // in the timeline rather than silently dropping the event.
    await prisma.orderEvent.create({
      data: {
        orderId: order.id,
        label: `Ignored a late payment failure (${p.error_code ?? 'unknown'})`,
        meta: { reason: 'payment is not pending', razorpayPaymentId: p.id ?? null },
      },
    });
    return;
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

  const fullRefund = Boolean(r.amount && r.amount >= payment.amount);

  await prisma.$transaction(async (tx) => {
    // Claim the refund so a redelivery of the same event cannot apply it twice.
    // Without this one refund could render as three "Refund processed" rows and
    // oscillate the payment status depending on which event arrived last.
    const { count } = await tx.payment.updateMany({
      where: { id: payment.id, status: { in: ['CAPTURED', 'PARTIALLY_REFUNDED'] } },
      data: { status: fullRefund ? 'REFUNDED' : 'PARTIALLY_REFUNDED' },
    });
    if (count === 0) return;

    await tx.order.update({
      where: { id: payment.orderId },
      data: {
        status: fullRefund ? 'REFUNDED' : payment.order.status,
        events: {
          create: {
            label: `Refund processed: ₹${((r.amount ?? 0) / 100).toFixed(2)}`,
            meta: { refundId: r.id ?? null, full: fullRefund },
          },
        },
      },
    });

    // REVERSE WHAT CAPTURE DID. Nothing used to: stock stayed decremented, the
    // coupon redemption stayed burnt, and a refunded order kept its full total
    // in every revenue report forever because paidAt was never cleared. Only a
    // FULL refund reverses - a partial one is still a completed sale.
    if (!fullRefund) return;

    const order = await tx.order.findUnique({
      where: { id: payment.orderId },
      select: { couponCode: true, items: { select: { packageId: true, quantity: true } } },
    });
    if (!order) return;

    for (const item of order.items) {
      await tx.package.update({
        where: { id: item.packageId },
        data: { stockQuantity: { increment: item.quantity } },
      });
    }

    if (order.couponCode) {
      // Guarded so a double-reversal cannot drive the counter below zero.
      await tx.coupon.updateMany({
        where: { code: order.couponCode, usageCount: { gt: 0 } },
        data: { usageCount: { decrement: 1 } },
      });
    }

    // paidAt is left in place deliberately: it records that money did arrive,
    // and clearing it would make a refunded order look abandoned and re-open it
    // to fulfilment. Revenue reporting excludes REFUNDED by status instead -
    // see app/admin/attribution and the campaign API.
  });
}

/**
 * Records a non-terminal refund event without touching money-bearing columns.
 */
async function noteRefundEvent(
  event: string,
  r: { id?: string; payment_id?: string; amount?: number; status?: string } | undefined
) {
  if (!r?.payment_id) return;
  const payment = await prisma.payment.findFirst({
    where: { razorpayPaymentId: r.payment_id },
    select: { orderId: true },
  });
  if (!payment) return;

  await prisma.orderEvent.create({
    data: {
      orderId: payment.orderId,
      label: `Refund ${event.replace('refund.', '')}: ₹${((r.amount ?? 0) / 100).toFixed(2)}`,
      meta: { refundId: r.id ?? null, refundStatus: r.status ?? null, applied: false },
    },
  });
}
