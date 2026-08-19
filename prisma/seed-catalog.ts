/**
 * Catalogue seed - creates one Package row per thing the site actually sells.
 *
 *   pnpm db:seed:catalog
 *
 * WHY THIS IS SEPARATE FROM seed.ts
 * ---------------------------------
 * seed.ts creates demo packages (wellness-starter, nutrition-deep-dive, …) that
 * do not correspond to any page on the site. This script creates the REAL
 * catalogue: the nine Wellness tests in lib/categoriesdata.ts plus the Genetic
 * Testing Kit PDP, keyed by the SAME slug the content uses. That shared slug is
 * the join between marketing content and commerce:
 *
 *     lib/categoriesdata.ts  slug ─┐
 *     features/products/data.ts    ├─→ Package.slug ─→ price, stock, shipping
 *     /categories/wellness/<slug> ─┘
 *
 * Content (names, blurbs, FAQs) is read straight from those files, so this
 * script never duplicates copy - it only adds the commerce columns. Re-running
 * it is safe: every write is an upsert keyed on slug, and it deliberately does
 * NOT reset price/stock on rows that already exist, so ops edits made in admin
 * survive a re-seed.
 *
 * ⚠ PRICES BELOW ARE PLACEHOLDERS ⚠
 * docs/REQUIRED_FROM_MANAGEMENT.md §11.1 ("Final price per package") and §11.2
 * ("Kit shipping fee") are both still 🔴 open. The numbers here exist so the
 * cart, checkout and PDP have something real to compute with - they are NOT
 * approved retail prices. Change them in the admin package editor, or edit
 * PLACEHOLDER_PRICING and re-run with FORCE_PRICES=1.
 */
import 'dotenv/config';
import { PrismaClient, PackageCategory, SampleType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { CATEGORIES, visibleProducts } from '../lib/categoriesdata';
import { getTestPage } from '../lib/testsdata';
import { getFaqItems } from '../features/tests/selectors';
import { getProductKit } from '../features/products/data';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

/** Overwrite price/compareAtPrice on rows that already exist. */
const FORCE_PRICES = process.env.FORCE_PRICES === '1';

/** ₹199 - matches the fee already used by seed.ts. Also placeholder (§11.2). */
const KIT_SHIPPING_FEE = 19_900;

/** The saliva kit everything ships in. Not sold on its own - see `isVehicle`. */
const KIT_SLUG = 'genetic-testing-kit';

/** paise. ₹1 = 100. */
const PLACEHOLDER_PRICING: Record<string, { price: number; compareAtPrice: number }> = {
  'womens-health': { price: 799_900, compareAtPrice: 999_900 },
  'mens-health': { price: 699_900, compareAtPrice: 899_900 },
  'my-wellness': { price: 999_900, compareAtPrice: 1_299_900 },
  'immunity-health': { price: 699_900, compareAtPrice: 899_900 },
  'skin-health': { price: 649_900, compareAtPrice: 849_900 },
  'eye-health': { price: 649_900, compareAtPrice: 849_900 },
  sleep: { price: 599_900, compareAtPrice: 799_900 },
  ancestry: { price: 599_900, compareAtPrice: 799_900 },
  'kidney-health': { price: 649_900, compareAtPrice: 849_900 },
  'genetic-testing-kit': { price: 999_900, compareAtPrice: 1_299_900 },
};

/**
 * "5 health checks" → 5, "52 traits · 4 reports" → 52, "10 global regions" → 10.
 * The chip on the category card is the only place a count is authored, so it is
 * the honest source for biomarkerCount rather than a second hand-kept number.
 */
function countFromMeta(meta: string | undefined): number {
  const n = meta?.match(/\d+/)?.[0];
  return n ? Number(n) : 0;
}

type Row = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  biomarkerCount: number;
  highlights: string[];
  faq: { q: string; a: string }[];
  coverImageUrl: string | null;
  position: number;
  popular: boolean;
};

/** The nine Wellness tests, read out of the content files. */
function testRows(): Row[] {
  const wellness = CATEGORIES.find((c) => c.slug === 'wellness');
  if (!wellness) throw new Error('No "wellness" category in lib/categoriesdata.ts');

  return visibleProducts(wellness).map((p, i) => {
    const page = getTestPage(p.slug);
    return {
      slug: p.slug,
      name: p.name,
      tagline: p.meta ?? wellness.tagline,
      description: page?.seo.description ?? p.blurb,
      biomarkerCount: countFromMeta(p.meta),
      // The blurb is one sentence of comma-separated concerns - split it back
      // into the bullet list admin shows.
      highlights: p.blurb
        .split(/ - |, /)
        .map((s) => s.trim().replace(/\.$/, ''))
        .filter((s) => s.length > 2)
        .slice(0, 5),
      // Both fields are Html in the content files; the DB stores plain text.
      faq: page ? getFaqItems(page).map((f) => ({ q: stripHtml(f.q), a: stripHtml(f.a) })) : [],
      coverImageUrl: p.image?.src ?? null,
      position: i,
      popular: p.slug === 'womens-health',
    };
  });
}

/** The Genetic Testing Kit PDP at /pr/genetic-testing-kit. */
function kitRow(): Row {
  const kit = getProductKit('genetic-testing-kit');
  if (!kit) throw new Error('No "genetic-testing-kit" in features/products/data.ts');

  return {
    slug: kit.slug,
    name: kit.title,
    tagline: kit.gallery.subtitle,
    description: kit.seo.description,
    biomarkerCount: countFromMeta(kit.pills.find((p) => /trait/i.test(p.label))?.label),
    highlights: kit.included.items.map((it) => `${it.name} - ${it.traits}`),
    faq: kit.faq.items.map((f) => ({ q: f.q, a: f.a })),
    coverImageUrl: null,
    position: 100,
    popular: true,
  };
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  const rows = [...testRows(), kitRow()];
  let created = 0;
  let updated = 0;
  const missingPrice: string[] = [];

  for (const row of rows) {
    const pricing = PLACEHOLDER_PRICING[row.slug];
    if (!pricing) {
      missingPrice.push(row.slug);
      continue;
    }

    const existing = await prisma.package.findUnique({ where: { slug: row.slug } });

    // Content columns are always refreshed from the source files. Commerce
    // columns (price, stock) are only set on INSERT unless FORCE_PRICES=1, so a
    // re-seed never silently reverts an ops price change.
    // The kit is the VEHICLE, not a SKU. Customers buy reports; the saliva kit
    // is how the sample gets to the lab, and its page (/pr/genetic-testing-kit)
    // is a configurator with no price of its own. Keeping the row but inactive
    // means it cannot be added to a cart or priced, while its copy stays
    // available in admin.
    const isVehicle = row.slug === KIT_SLUG;

    const content = {
      name: row.name,
      category: PackageCategory.WELLNESS,
      tagline: row.tagline,
      description: row.description,
      sampleType: SampleType.SALIVA,
      biomarkerCount: row.biomarkerCount,
      highlights: row.highlights,
      biomarkerList: [],
      faq: row.faq,
      coverImageUrl: row.coverImageUrl,
      position: row.position,
      popular: row.popular,
      active: !isVehicle,
      fulfillmentType: 'KIT_BY_POST' as const,
    };

    if (existing) {
      await prisma.package.update({
        where: { slug: row.slug },
        data: { ...content, ...(FORCE_PRICES ? pricing : {}) },
      });
      updated++;
    } else {
      await prisma.package.create({
        data: {
          slug: row.slug,
          ...content,
          ...pricing,
          // Placeholder TAT - docs/REQUIRED_FROM_MANAGEMENT.md §11.3 is open.
          tatMinDays: 7,
          tatMaxDays: 14,
          kitShippingFee: KIT_SHIPPING_FEE,
          stockQuantity: 100,
          lowStockThreshold: 10,
        },
      });
      created++;
    }
  }

  console.log(`\ncatalogue seed: ${created} created, ${updated} updated`);
  if (missingPrice.length) {
    console.warn(`  ⚠ no PLACEHOLDER_PRICING entry, skipped: ${missingPrice.join(', ')}`);
  }
  console.log('  ⚠ prices are PLACEHOLDERS - see docs/REQUIRED_FROM_MANAGEMENT.md §11.1\n');

  const all = await prisma.package.findMany({
    where: { active: true },
    select: { slug: true, name: true, price: true, stockQuantity: true },
    orderBy: { position: 'asc' },
  });
  console.table(all.map((p) => ({ ...p, price: `₹${(p.price / 100).toLocaleString('en-IN')}` })));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
