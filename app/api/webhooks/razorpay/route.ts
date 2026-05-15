import { prisma } from '@/lib/prisma';
import { verifyWebhookSignature } from '@/lib/razorpay';

/**
 * POST /api/webhooks/razorpay
 *
 * Razorpay server-to-server payment notifications. Authoritative source for
 * payment state — runs even if the user closes the browser before the
 * client-side /api/checkout/verify call lands.
 *
 * Events we care about:
 *   - payment.captured   → mark order paid (idempotent — verify route may
 *                          have already done it; we no-op if so).
 *   - payment.failed     → mark Payment FAILED with the error code.
 *   - refund.processed   → mark Payment REFUNDED, Order REFUNDED if full.
 *
 * Auth: HMAC-SHA256(rawBody, RAZORPAY_WEBHOOK_SECRET) compared to header
 * X-Razorpay-Signature. Configure the same secret in dashboard → Webhooks.
 */
export async function POST(req: Request) {
  // We need the raw body bytes for signature verification — once we parse it
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

  // Always 200 — Razorpay retries on non-2xx and we don't want to thrash on
  // unrecognised events.
  return Response.json({ ok: true });
}

async function handlePaymentCaptured(p: { id?: string; order_id?: string; amount?: number; method?: string }) {
  const order = await prisma.order.findFirst({ where: { razorpayOrderId: p.order_id } });
  if (!order) return;

  // Already captured (verify route or earlier webhook ran) — idempotent.
  if (order.paidAt) return;

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        paidAt: new Date(),
        razorpayPaymentId: p.id,
        events: { create: { label: 'Payment captured (webhook)' } },
      },
    });

    // Find the matching pending Payment row, or create one if absent.
    const existing = await tx.payment.findFirst({
      where: { orderId: order.id, razorpayOrderId: p.order_id },
    });
    if (existing) {
      await tx.payment.update({
        where: { id: existing.id },
        data: {
          status: 'CAPTURED',
          razorpayPaymentId: p.id,
          method: p.method,
          capturedAt: new Date(),
        },
      });
    } else {
      await tx.payment.create({
        data: {
          orderId: order.id,
          amount: p.amount ?? order.total,
          status: 'CAPTURED',
          method: p.method,
          razorpayOrderId: p.order_id,
          razorpayPaymentId: p.id,
          capturedAt: new Date(),
        },
      });
    }

    // Consume coupon now if not already (verify endpoint may have done it).
    if (order.couponCode) {
      const coupon = await tx.coupon.findUnique({ where: { code: order.couponCode } });
      // Avoid double-increment: if verify route already bumped it, we'd over-count.
      // Cheap heuristic: only increment if we created the Payment row in this txn
      // (i.e., verify never ran). When existing was found and already CAPTURED,
      // verify already incremented.
      if (coupon && !existing) {
        await tx.coupon.update({
          where: { code: order.couponCode },
          data: { usageCount: { increment: 1 } },
        });
      }
    }
  });
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
