// =============================================================================
// lib/catalog.ts - the bridge between marketing content and commerce
// -----------------------------------------------------------------------------
// A Package row and a content page are joined by ONE thing: a shared slug.
//
//   lib/categoriesdata.ts      → /categories/wellness/<slug>
//   features/products/data.ts  → /pr/<slug>
//   Package.slug (Postgres)    → price, stock, shipping fee
//
// Everything commerce-facing resolves through here so nothing has to know which
// of the two content files a slug came from. Kept in lib/ rather than inside a
// feature because cart, checkout, orders and the PDP all need it.
//
// A Package with no matching content page is INVISIBLE to the storefront - that
// is how the five legacy demo rows from prisma/seed.ts (wellness-starter,
// nutrition-deep-dive, …) stay out of the shop without being deleted.
// =============================================================================

import { CATEGORIES } from './categoriesdata';
// Leaf modules, not the feature barrel: this file ends up in the client bundle
// via the cart, so it must not reach anything that could pull in server code.
import { PRODUCT_KIT_SLUGS } from '@/features/products/data';
import { productKitHref } from '@/features/products/routes';

/** slug → the page that sells it. */
const HREF_BY_SLUG: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const category of CATEGORIES) {
    for (const product of category.products) map[product.slug] = product.href;
  }
  for (const slug of PRODUCT_KIT_SLUGS) map[slug] = productKitHref(slug);
  return map;
})();

/** Every slug the storefront is allowed to sell. */
export const CATALOG_SLUGS: string[] = Object.keys(HREF_BY_SLUG);

/** The page a buyer should land on for this slug, or null if it sells nowhere. */
export function catalogHref(slug: string): string | null {
  return HREF_BY_SLUG[slug] ?? null;
}

/** True when a Package slug has a content page behind it. */
export function isSellable(slug: string): boolean {
  return slug in HREF_BY_SLUG;
}

// ---------------------------------------------------------------------------
// Money. Everything in the DB is paise; everything on screen is rupees.
// ---------------------------------------------------------------------------

/**
 * 799900 → "₹7,999". Indian digit grouping (7,99,999 for lakhs), no decimals -
 * every price in the catalogue is a whole rupee, and "₹7,999.00" reads wrong on
 * an Indian storefront.
 */
export function formatPaise(paise: number): string {
  return `₹${Math.round(paise / 100).toLocaleString('en-IN')}`;
}

/** Percentage off, for the strike-through badge. 999900 → 799900 = 20. */
export function discountPercent(price: number, compareAtPrice: number | null | undefined): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
