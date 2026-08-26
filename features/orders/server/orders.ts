/**
 * Order helpers - number generation, pricing calc, attribution → campaign FK
 * resolution.
 */
import type { Order, OrderStatus } from '@prisma/client';
import { prisma } from '@/server/prisma';
import { ApiError } from '@/server/api';
import type { AttributionPayload } from '@/features/attribution/server/attribution';

/**
 * Generates the human-facing order number: KYG-<YYYY>-<6-digit sequence>.
 *
 * DERIVED FROM THE HIGHEST NUMBER ISSUED, NOT FROM A COUNT. It used to be
 * `count(orders this year) + 1`, and a count is not a sequence: delete any order
 * below the maximum and the next number collides with one that still exists.
 * Because the insert then fails, no row is created, so the count does not move -
 * and every subsequent checkout mints the same colliding number. That is not a
 * degraded checkout, it is a stopped one, and it needed no concurrency at all;
 * one tidy-up in Prisma Studio was enough.
 *
 * Taking max+1 makes holes irrelevant: a deleted row simply leaves a gap in the
 * series, which is what an order number is allowed to do.
 *
 * The scan is keyed on the number's own `KYG-<year>-` prefix rather than on a
 * createdAt window. That is also what fixes the year-boundary bug the window
 * had: the year came from server-local time while the bounds were UTC instants,
 * so under IST every order placed between midnight and 05:30 on 1 January fell
 * outside its own year's window. The prefix cannot disagree with itself.
 *
 * Sorting lexicographically is sound only because the suffix is zero-padded to a
 * fixed width - "000010" > "000009" as strings. It stops being sound at
 * 1,000,000 orders in one year, which is also where the 6-digit format runs out.
 *
 * STILL NOT ATOMIC. Two overlapping checkouts can read the same maximum. That
 * race is handled where it belongs, at the insert: the caller retries on a
 * unique-constraint violation (see app/api/checkout/route.ts). Unlike the count
 * bug, that failure is self-healing - one insert wins and the maximum advances.
 */
export async function nextOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `KYG-${year}-`;

  const highest = await prisma.order.findFirst({
    where: { orderNumber: { startsWith: prefix } },
    orderBy: { orderNumber: 'desc' },
    select: { orderNumber: true },
  });

  const lastSeq = highest ? Number.parseInt(highest.orderNumber.slice(prefix.length), 10) : 0;
  // A malformed legacy number would make this NaN; fall back rather than emit "KYG-2026-NaN".
  const next = Number.isFinite(lastSeq) ? lastSeq + 1 : 1;
  return `${prefix}${String(next).padStart(6, '0')}`;
}

/**
 * Resolves the captured utm_campaign string to a Campaign FK, if a matching
 * Campaign row exists. Returns null when no match - historical Order rows
 * still carry the raw attrCampaign string in that case.
 */
export async function resolveCampaignId(payload: AttributionPayload | null): Promise<string | null> {
  if (!payload?.c) return null;
  const c = await prisma.campaign.findUnique({
    where: { slug: payload.c.toLowerCase() },
    select: { id: true },
  });
  return c?.id ?? null;
}

/**
 * Coupon evaluation. Returns the discount amount (in paise) and any error.
 * Caller is responsible for incrementing usageCount after the order is paid,
 * not at booking time, so unpaid abandoned cart drafts don't burn coupon use.
 */
export async function applyCoupon(opts: {
  code: string | null | undefined;
  subtotalPaise: number;
}): Promise<{ discount: number; couponCode: string | null; error?: string }> {
  if (!opts.code) return { discount: 0, couponCode: null };

  /**
   * ONE MESSAGE FOR EVERY WAY A CODE CAN FAIL, except the minimum.
   *
   * These used to be five distinguishable strings - not found, inactive,
   * expired, limit reached, below minimum - returned verbatim to an
   * unauthenticated caller on an unthrottled endpoint. That separates "no such
   * code" from "real code, wrong conditions", which is a coupon-existence
   * oracle: enough to walk a dictionary of plausible codes and learn which ones
   * are real. Checkout reasons carefully about not being an account-existence
   * oracle one route away from this.
   *
   * The order minimum stays specific because it is the one failure the shopper
   * can actually act on, and it reveals nothing they did not already type.
   */
  const UNUSABLE = 'That code is not valid for this order';

  const coupon = await prisma.coupon.findUnique({ where: { code: opts.code } });
  if (!coupon) return { discount: 0, couponCode: null, error: UNUSABLE };
  if (!coupon.active) return { discount: 0, couponCode: null, error: UNUSABLE };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { discount: 0, couponCode: null, error: UNUSABLE };
  }
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { discount: 0, couponCode: null, error: UNUSABLE };
  }
  if (coupon.minOrder && opts.subtotalPaise < coupon.minOrder) {
    return {
      discount: 0,
      couponCode: null,
      error: `This code needs an order of at least ₹${Math.floor(coupon.minOrder / 100).toLocaleString('en-IN')}`,
    };
  }
  let discount = 0;
  if (coupon.type === 'FLAT') {
    discount = coupon.value; // paise
  } else {
    discount = Math.floor((opts.subtotalPaise * coupon.value) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
  }
  // Never let discount exceed subtotal.
  if (discount > opts.subtotalPaise) discount = opts.subtotalPaise;
  return { discount, couponCode: coupon.code };
}

/**
 * Loads an order and refuses to hand it back unless the money arrived.
 *
 * THE ONE PRECONDITION EVERY FULFILMENT ACTION SHARES, and until now the only
 * one none of them checked. Routing to a lab, dispatching a kit, assigning a
 * collector and advancing the pipeline each commit real cost - a courier leg,
 * lab capacity, a contractor's time - and each used to run on an order it had
 * never asked about. Four of the first eight orders on this system were never
 * paid for; all four were routed to a lab, and the lab was emailed a message
 * that says in plain words "A new sample has been booked and paid for."
 *
 * `paidAt` is the only truth here. `status` cannot stand in for it: capture
 * writes `paidAt` and deliberately leaves `status` alone, so a fully paid order
 * still reads BOOKED and an unpaid one reads BOOKED too. Anything that branches
 * on status to infer payment is reading a field that does not carry it.
 *
 * Throws rather than returning a union so call sites stay one line, and 409
 * rather than 403 because nothing is forbidden - the order is simply not ready.
 */
export async function requirePaidOrder(orderId: string): Promise<Order> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) throw new ApiError('Order not found', 404);
  if (!order.paidAt) {
    throw new ApiError(
      `${order.orderNumber} has not been paid for yet. It cannot be routed or dispatched until payment is captured.`,
      409
    );
  }

  return order;
}

/**
 * Statuses from which an order is finished, one way or another.
 *
 * Kept beside the payment guard because they answer the same question - is it
 * legitimate to do more work on this order - and separating them is how a
 * cancelled order stayed dispatchable.
 */
export const TERMINAL_STATUSES = ['CANCELLED', 'REFUNDED'] as const;

export function isTerminal(status: OrderStatus): boolean {
  return (TERMINAL_STATUSES as readonly string[]).includes(status);
}
