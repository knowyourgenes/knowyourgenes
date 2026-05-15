/**
 * Razorpay client — thin wrapper around their REST API.
 *
 * We talk to Razorpay over plain fetch rather than the official SDK so we
 * avoid pulling in a sizeable dep for two endpoint calls. The official Node
 * SDK is also CommonJS-only which is awkward on edge runtimes.
 *
 * Two modes:
 *   - Real:  RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET → live calls.
 *   - Mock:  auto-enabled when the key is empty; returns deterministic fake
 *            order_id / payment_id so the rest of the system is testable.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

const BASE_URL = 'https://api.razorpay.com/v1';
const KEY_ID = process.env.RAZORPAY_KEY_ID ?? '';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? '';
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET ?? '';
export const RAZORPAY_MOCK = !KEY_ID || !KEY_SECRET;

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
  if (RAZORPAY_MOCK) {
    // In mock mode, accept any non-empty signature so e2e tests can pass.
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
 * Pass the *raw* request body string — JSON.stringify'd parsed JSON won't
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
