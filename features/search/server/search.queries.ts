import 'server-only';

// =============================================================================
// features/search - the catalogue behind /search
// -----------------------------------------------------------------------------
// Joins the marketing content (lib/categoriesdata) to the commerce row that
// shares its slug (Package in Postgres), because the results page filters and
// sorts on BOTH: text and category come from the content, price / stock /
// report size come from the database.
//
// Why a query of its own rather than features/products' getCatalogPrices():
// that one selects exactly what a PDP buy-box needs, and the PDP depends on its
// shape. /search additionally needs biomarkerCount for the report-size facet.
// Widening a query two screens share to suit one of them is how a select list
// quietly becomes "everything"; a second read for a second screen is the thing
// a .queries.ts file is for.
//
// This runs on the server, which is also what keeps the client honest about
// money: prices arrive already resolved and formatted-ready, so nothing in the
// browser ever computes a price. features/cart is explicit that it must not.
// =============================================================================

import { prisma } from '@/server/prisma';
import { CATEGORIES, visibleProducts } from '@/lib/categoriesdata';
import type { SearchProduct } from '../types';

/**
 * Every sellable test, priced.
 *
 * Content is the source of truth for WHICH rows exist: a Package with no
 * content page is invisible to the storefront (see lib/catalog.ts), so the five
 * legacy demo rows in prisma/seed.ts never appear here.
 */
export async function getSearchCatalog(): Promise<SearchProduct[]> {
  const content = CATEGORIES.flatMap((category) =>
    visibleProducts(category).map((product) => ({
      ...product,
      categorySlug: category.slug,
      categoryName: category.name,
    }))
  );

  const rows = await prisma.package
    .findMany({
      where: { slug: { in: content.map((p) => p.slug) }, active: true },
      select: { slug: true, price: true, compareAtPrice: true, stockQuantity: true, biomarkerCount: true },
    })
    // A database blip must not 500 the search page - every row falls back to
    // unpriced and the page still lists and filters on everything else.
    .catch(() => []);

  const bySlug = new Map(rows.map((r) => [r.slug, r]));

  return content.map((product) => {
    const row = bySlug.get(product.slug);
    return {
      ...product,
      price: row?.price ?? null,
      compareAtPrice: row?.compareAtPrice ?? null,
      inStock: row ? row.stockQuantity > 0 : false,
      biomarkerCount: row?.biomarkerCount ?? null,
    };
  });
}
