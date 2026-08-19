import 'server-only';

// =============================================================================
// features/products — live pricing for a PDP
// -----------------------------------------------------------------------------
// The PDP's content (features/products/data.ts) carries a placeholder price
// string; the real number lives on the Package row that shares its slug. This
// reads it.
//
// Returns null when no Package matches, and the BuyBox then falls back to the
// content placeholder rather than rendering "₹0" - a kit whose commerce row is
// missing must look unpriced, not free.
// =============================================================================

import { prisma } from '@/server/prisma';
import { MAX_QUANTITY_PER_LINE } from '@/features/cart';
import type { KitPricing } from '../types';

/**
 * Prices for many slugs at once - one query for a whole category grid.
 * Slugs with no active Package are simply absent from the result, and the card
 * then renders without a price or a buy button.
 */
export async function getCatalogPrices(slugs: string[]): Promise<Record<string, KitPricing>> {
  if (slugs.length === 0) return {};

  const rows = await prisma.package
    .findMany({
      where: { slug: { in: slugs }, active: true },
      select: { slug: true, price: true, compareAtPrice: true, stockQuantity: true, kitShippingFee: true },
    })
    .catch(() => []);

  return Object.fromEntries(
    rows.map((p) => [
      p.slug,
      {
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        inStock: p.stockQuantity > 0,
        maxQuantity: Math.min(p.stockQuantity, MAX_QUANTITY_PER_LINE),
        kitShippingFee: p.kitShippingFee,
      } satisfies KitPricing,
    ])
  );
}

export async function getKitPricing(slug: string): Promise<KitPricing | null> {
  const pkg = await prisma.package
    .findUnique({
      where: { slug },
      select: { price: true, compareAtPrice: true, active: true, stockQuantity: true, kitShippingFee: true },
    })
    // A database blip must not 500 a marketing page - fall back to unpriced.
    .catch(() => null);

  if (!pkg || !pkg.active) return null;

  return {
    price: pkg.price,
    compareAtPrice: pkg.compareAtPrice,
    inStock: pkg.stockQuantity > 0,
    maxQuantity: Math.min(pkg.stockQuantity, MAX_QUANTITY_PER_LINE),
    kitShippingFee: pkg.kitShippingFee,
  };
}
