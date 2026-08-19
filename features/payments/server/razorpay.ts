/**
 * Razorpay client - thin wrapper around their REST API.
 *
 * We talk to Razorpay over plain fetch rather than the official SDK so we
 * avoid pulling in a sizeable dep for two endpoint calls. The official Node
 * SDK is also CommonJS-only which is awkward on edge runtimes.
 *
 * Two modes:
 *   - Real:  RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET → live calls.
 *   - Mock:  DEV AND TEST ONLY. Returns deterministic fake order_id /
 *            payment_id so the whole buying journey stays runnable without
 *            credentials, including in CI.
 *
 * MOCK CANNOT ENGAGE IN PRODUCTION, and that is the point of the guard below.
 * It used to be a plain fallback - `!KEY_ID || !KEY_SECRET` - which made a
 * missing environment variable silently turn checkout into a giveaway:
 * /api/checkout answered `mock: true`, the browser skipped the Razorpay modal
 * entirely and posted the literal string 'mock_signature', this file accepted
 * any non-empty signature, and the order was captured, stock decremented, the
 * coupon consumed and the lab emailed to expect a sample. The order still
 * recorded the FULL amount as CAPTURED, so nothing internal disagreed with
 * anything else; only an empty Razorpay dashboard would ever have shown it.
 *
 * That is not hypothetical drift. RAZORPAY_WEBHOOK_SECRET is already missing
 * from this repo's .env, and the webhook - the one path that could have caught
 * it - is dead under exactly the same misconfiguration.
 *
 * So in production, absent keys are a HARD FAILURE at the point of use rather
 * than a quiet downgrade. A checkout that 502s is a bad afternoon; a checkout
 * that hands out genetic test kits for nothing is a bad quarter.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

const BASE_URL = 'https://api.razorpay.com/v1';
const KEY_ID = process.env.RAZORPAY_KEY_ID ?? '';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? '';
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET ?? '';

/**
 * Whether the fake payment path may be used at all.
 *
 * Keyed on NODE_ENV, which Next sets to 'production' for `next build` and
 * `next start` and cannot be flipped by an ordinary env var at runtime. A
 * deployment is therefore incapable of mocking a payment no matter what is or
 * is not configured.
 */
const MOCK_PERMITTED = process.env.NODE_ENV !== 'production';

/** True only when mocking is BOTH permitted and actually needed. */
export const RAZORPAY_MOCK = MOCK_PERMITTED && (!KEY_ID || !KEY_SECRET);

/** True when we are expected to talk to Razorpay for real but cannot. */
export const RAZORPAY_MISCONFIGURED = !RAZORPAY_MOCK && (!KEY_ID || !KEY_SECRET);

/**
 * Thrown rather than returned: every caller already handles a rejection from
 * createRazorpayOrder by leaving the order BOOKED and unpaid, which is exactly
 * the right outcome. Returning a falsy value instead would need each call site
 * to remember to check.
 */
function assertConfigured(): void {
  if (RAZORPAY_MISCONFIGURED) {
    throw new Error(
      'Razorpay is not configured: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must both be set. ' +
        'Refusing to process a payment.'
    );
  }
}

function authHeader(): string {
  const b64 = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
  return `Basic ${b64}`;
}

export interface RazorpayOrder {
  id: string;
  amount: number; // paise
  currency: string;
  status: 'created' | 'attempted' | 'paid' | string;
  receipt?: string;
  notes?: Record<string, string>;
}

/**
 * Creates a Razorpay order. `receipt` should be our internal order number
 * (KYG-2026-000412) so Razorpay's dashboard maps 1:1 to our orders.
 */
export async function createRazorpayOrder(opts: {
  amountPaise: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<RazorpayOrder> {
  assertConfigured();

  if (RAZORPAY_MOCK) {
    return {
      id: `order_MOCK${Date.now().toString().slice(-10)}`,
      amount: opts.amountPaise,
      currency: 'INR',
      status: 'created',
      receipt: opts.receipt,
      notes: opts.notes,
    };
  }

  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: opts.amountPaise,
      currency: 'INR',
      receipt: opts.receipt,
      notes: opts.notes ?? {},
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Razorpay createOrder failed: ${res.status} ${body}`);
  }
  return (await res.json()) as RazorpayOrder;
}

/**
 * Verifies the signature returned by Razorpay Checkout on the client.
 *
 * Razorpay docs:
 *   generated_signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret)
 *   compare generated_signature against razorpay_signature
 */
export function verifyPaymentSignature(opts: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  // Fail CLOSED before anything else. Without a secret there is no signature to
  // check against, so the only honest answer is "not verified" - never "sure,
  // looks fine". This mirrors verifyWebhookSignature below, which already did
  // the right thing; the two now agree.
  if (RAZORPAY_MISCONFIGURED) return false;

  if (RAZORPAY_MOCK) {
    // Dev and CI only - MOCK_PERMITTED makes this unreachable in production.
    // Accepts any non-empty signature so the e2e buying journey can run without
    // credentials.
    return opts.razorpaySignature.length > 0;
  }
  const expected = createHmac('sha256', KEY_SECRET)
    .update(`${opts.razorpayOrderId}|${opts.razorpayPaymentId}`)
    .digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(opts.razorpaySignature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Verifies a Razorpay webhook signature.
 *   Header: X-Razorpay-Signature: hex(hmac_sha256(rawBody, WEBHOOK_SECRET))
 *
 * Pass the *raw* request body string - JSON.stringify'd parsed JSON won't
 * match because of whitespace / key ordering.
 */
export function verifyWebhookSignature(rawBody: string, headerSignature: string): boolean {
  if (!WEBHOOK_SECRET) return false;
  const expected = createHmac('sha256', WEBHOOK_SECRET).update(rawBody).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(headerSignature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const RAZORPAY_KEY_ID_PUBLIC = KEY_ID; // safe to expose to client
