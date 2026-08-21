import 'server-only';

// =============================================================================
// features/cart - the single pricing calculation
// -----------------------------------------------------------------------------
// Every rupee the customer is shown or charged comes out of priceCart(). The
// cart page, the checkout summary and POST /api/checkout all call it with the
// same input, so a price can never differ between what was displayed and what
// was billed - checkout re-prices from the database at the moment of payment
// and ignores whatever the browser thought the total was.
//
// Inputs are slugs + quantities. Outputs are paise. Nothing here trusts the
// client with a number other than a quantity.
// =============================================================================

import { prisma } from '@/server/prisma';
import { applyCoupon } from '@/features/orders';
import { isSellable } from '@/lib/catalog';
import { catalogHref } from '@/lib/catalog';
import type { AdjustedLine, CartLineInput, PricedCart, PricedLine, RejectedLine } from '../types';

/** Sanity cap per line. Nobody legitimately buys 50 of one saliva kit. */
export const MAX_QUANTITY_PER_LINE = 10;

/**
 * Kit shipping is charged ONCE per order, not once per line.
 *
 * BUSINESS RULE: every report is read from the SAME saliva kit. Three tests
 * bought together are one box out, one sample, one reverse pickup back to the
 * lab - so billing the ₹199 three times would be charging for couriers we never
 * book. We take the highest fee among the posted lines, which is also the safest
 * if fees ever differ per package.
 *
 * Change this function (not the call sites) if ops decides to bill per report.
 */
export function computeShipping(lines: { kitShippingFee: number; fulfillmentType: string }[]): number {
  const posted = lines.filter((l) => l.fulfillmentType === 'KIT_BY_POST');
  if (posted.length === 0) return 0;
  return Math.max(...posted.map((l) => l.kitShippingFee));
}

/**
 * Prices a cart against live Package rows.
 *
 * Never throws for bad input: an unknown slug, a de-listed product or an
 * out-of-stock kit comes back in `rejected` and the rest of the cart still
 * prices. That matters because the browser can hold a cart for weeks, and a
 * stale line must not blank the page.
 */
export async function priceCart(opts: { lines: CartLineInput[]; couponCode?: string | null }): Promise<PricedCart> {
  const rejected: RejectedLine[] = [];
  const adjusted: AdjustedLine[] = [];

  // Collapse duplicate slugs first - two "add to cart" clicks on the same kit
  // are one line of quantity 2, not two lines.
  const wanted = new Map<string, number>();
  for (const line of opts.lines) {
    const qty = Math.floor(line.quantity);
    if (!Number.isFinite(qty) || qty < 1) continue;
    wanted.set(line.slug, (wanted.get(line.slug) ?? 0) + qty);
  }

  const slugs = [...wanted.keys()];
  const packages = slugs.length ? await prisma.package.findMany({ where: { slug: { in: slugs } } }) : [];
  const bySlug = new Map(packages.map((p) => [p.slug, p]));

  const priced: PricedLine[] = [];

  // Iterate the requested slugs, not the DB rows, so a slug that resolved to
  // nothing still produces a rejection the UI can render.
  for (const [slug, requestedQty] of wanted) {
    const pkg = bySlug.get(slug);
    if (!pkg) {
      rejected.push({ slug, reason: 'UNKNOWN', message: 'This test is no longer available.' });
      continue;
    }
    if (!pkg.active) {
      rejected.push({ slug, reason: 'INACTIVE', message: `${pkg.name} is not on sale right now.` });
      continue;
    }
    // A Package with no content page cannot be bought - see lib/catalog.ts.
    const href = catalogHref(slug);
    if (!href || !isSellable(slug)) {
      rejected.push({ slug, reason: 'NOT_SELLABLE', message: `${pkg.name} has no product page.` });
      continue;
    }
    if (pkg.stockQuantity < 1) {
      rejected.push({ slug, reason: 'OUT_OF_STOCK', message: `${pkg.name} is out of stock.` });
      continue;
    }

    const cap = Math.min(pkg.stockQuantity, MAX_QUANTITY_PER_LINE);
    let quantity = requestedQty;
    if (quantity > cap) {
      adjusted.push({
        slug,
        from: quantity,
        to: cap,
        message:
          cap === pkg.stockQuantity
            ? `Only ${cap} left of ${pkg.name}.`
            : `Limit ${MAX_QUANTITY_PER_LINE} per order for ${pkg.name}.`,
      });
      quantity = cap;
    }

    priced.push({
      packageId: pkg.id,
      slug: pkg.slug,
      name: pkg.name,
      tagline: pkg.tagline,
      coverImageUrl: pkg.coverImageUrl,
      href,
      unitPrice: pkg.price,
      compareAtPrice: pkg.compareAtPrice,
      quantity,
      lineTotal: pkg.price * quantity,
      kitShippingFee: pkg.kitShippingFee,
      fulfillmentType: pkg.fulfillmentType,
      maxQuantity: cap,
    });
  }

  // Stable order so the cart doesn't reshuffle between renders.
  priced.sort((a, b) => a.name.localeCompare(b.name));

  const subtotal = priced.reduce((sum, l) => sum + l.lineTotal, 0);
  const shipping = computeShipping(priced);

  // Coupons discount goods, never shipping.
  const couponResult = priced.length
    ? await applyCoupon({ code: opts.couponCode ?? null, subtotalPaise: subtotal })
    : { discount: 0, couponCode: null, error: undefined };

  const discount = couponResult.discount;
  const total = Math.max(0, subtotal + shipping - discount);

  return {
    lines: priced,
    rejected,
    adjusted,
    subtotal,
    shipping,
    discount,
    total,
    coupon: opts.couponCode
      ? {
          code: opts.couponCode,
          applied: !couponResult.error && discount > 0,
          error: couponResult.error,
        }
      : null,
    itemCount: priced.reduce((sum, l) => sum + l.quantity, 0),
    requiresSlot: priced.some((l) => l.fulfillmentType === 'AT_HOME_PHLEBOTOMIST'),
  };
}
