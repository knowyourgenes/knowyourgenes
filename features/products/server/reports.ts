import 'server-only';

// =============================================================================
// features/products — the reports a customer can put on one kit
// -----------------------------------------------------------------------------
// KYG sells ONE physical product: a saliva kit. What varies is which reports are
// read from the sample it brings back. So the kit page is a configurator, not a
// product with a price of its own - the price is whatever the customer ticks.
//
// This returns the tickable list: every report in the Wellness catalogue that
// has a live Package row, with the copy from lib/categoriesdata.ts and the money
// from Postgres.
// =============================================================================

import { prisma } from '@/server/prisma';
import { CATEGORIES, visibleProducts } from '@/lib/categoriesdata';

export interface SelectableReport {
  slug: string;
  name: string;
  /** "28 readings", "5 health checks" - the chip from the category card. */
  meta: string;
  blurb: string;
  price: number;
  compareAtPrice: number | null;
  inStock: boolean;
  /** The report's own page, for the "read more" link beside each row. */
  href: string;
}

/**
 * Every report that can go on a kit, in catalogue order.
 *
 * A report with no active Package is omitted rather than shown unbuyable - a
 * tick box that cannot be ticked is worse than an absent one.
 */
export async function getSelectableReports(): Promise<SelectableReport[]> {
  const products = CATEGORIES.flatMap((c) => visibleProducts(c));
  const slugs = products.map((p) => p.slug);

  const rows = await prisma.package
    .findMany({
      where: { slug: { in: slugs }, active: true },
      select: { slug: true, price: true, compareAtPrice: true, stockQuantity: true },
    })
    .catch(() => []);

  const bySlug = new Map(rows.map((r) => [r.slug, r]));

  return products.flatMap((p) => {
    const row = bySlug.get(p.slug);
    if (!row) return [];
    return [
      {
        slug: p.slug,
        name: p.name,
        meta: p.meta ?? '',
        blurb: p.blurb,
        price: row.price,
        compareAtPrice: row.compareAtPrice,
        inStock: row.stockQuantity > 0,
        href: p.href,
      } satisfies SelectableReport,
    ];
  });
}

/**
 * Shipping is charged once per order however many reports are on the kit, so
 * the configurator needs one number rather than a fee per line. Taken from the
 * catalogue rather than hard-coded so an ops change in admin flows through.
 */
export async function getKitShippingFee(): Promise<number> {
  const row = await prisma.package
    .findFirst({
      where: { active: true, fulfillmentType: 'KIT_BY_POST', kitShippingFee: { gt: 0 } },
      select: { kitShippingFee: true },
      orderBy: { kitShippingFee: 'desc' },
    })
    .catch(() => null);
  return row?.kitShippingFee ?? 0;
}
