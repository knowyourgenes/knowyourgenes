/**
 * Order helpers — number generation, pricing calc, attribution → campaign FK
 * resolution.
 */
import { prisma } from '@/lib/prisma';
import type { AttributionPayload } from '@/lib/attribution';

/**
 * Generates the human-facing order number: KYG-<YYYY>-<6-digit sequence>.
 * The sequence is per-year and derived from a count of existing orders in
 * that year, padded to 6. Collision-safe enough for current launch volume;
 * if we hit concurrent inserts > 10/sec we'll need a Postgres sequence.
 */
export async function nextOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const start = new Date(`${year}-01-01T00:00:00.000Z`);
  const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);
  const countThisYear = await prisma.order.count({
    where: { createdAt: { gte: start, lt: end } },
  });
  const seq = String(countThisYear + 1).padStart(6, '0');
  return `KYG-${year}-${seq}`;
}

/**
 * Resolves the captured utm_campaign string to a Campaign FK, if a matching
 * Campaign row exists. Returns null when no match — historical Order rows
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
  const coupon = await prisma.coupon.findUnique({ where: { code: opts.code } });
  if (!coupon) return { discount: 0, couponCode: null, error: 'Coupon not found' };
  if (!coupon.active) return { discount: 0, couponCode: null, error: 'Coupon inactive' };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { discount: 0, couponCode: null, error: 'Coupon expired' };
  }
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { discount: 0, couponCode: null, error: 'Coupon usage limit reached' };
  }
  if (coupon.minOrder && opts.subtotalPaise < coupon.minOrder) {
    return { discount: 0, couponCode: null, error: 'Order below coupon minimum' };
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
