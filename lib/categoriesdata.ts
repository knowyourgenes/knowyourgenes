// =============================================================================
// lib/categoriesdata.ts - test categories + their products
// -----------------------------------------------------------------------------
// Drives the /categories listing and each /categories/[category_slug] page.
// Clicking a category card on the home page lands on /categories; clicking a
// category there opens its own page listing its (visible) products, each linking
// to /categories/[category_slug]/[test_slug].
//
// Currently there is ONE category, "Wellness". Its individual Diet/Weight/
// Fitness/Detox reports are being merged into a single combined report (not shown
// yet). For now only the Men's Health test page is visible; Women's Health, the
// combined Wellness report and a fourth report are declared but hidden.
// =============================================================================

export interface CategoryProduct {
  slug: string;
  name: string;
  /** short trait/panel count shown as a chip, e.g. "3 health checks" */
  meta?: string;
  blurb: string;
  href: string;
  /** hidden products are declared but not rendered on the category page yet */
  hidden?: boolean;
}

export interface TestCategory {
  slug: string;
  name: string;
  tagline: string;
  blurb: string;
  /** accent family used for the card + detail header */
  accent: 'wellness' | 'mens' | 'womens';
  products: CategoryProduct[];
}

export const CATEGORIES: TestCategory[] = [
  {
    slug: 'wellness',
    name: 'Wellness',
    tagline: 'Genetic health reports from one saliva kit',
    blurb:
      'Understand how your body is genetically wired, from everyday wellness to the health checks most people never think to make. One at-home saliva kit per report.',
    accent: 'wellness',
    products: [
      // Women's Health is the first test rebuilt on the section-array layout
      // (see lib/testsdata.ts). Men's Health, Ancestry and My Wellness were
      // removed with the old fixed-shape renderer and return here as they are
      // rebuilt on the new structure - one entry per rebuilt test.
      {
        slug: 'womens-health',
        name: "Women's Health DNA",
        meta: '5 health checks',
        blurb:
          'PCOS, pregnancy loss, peripartum mood, bone density and joint risk - five answers from one at-home saliva sample.',
        href: '/categories/wellness/womens-health',
      },
    ],
  },
];

/** Products that should actually render on a category page. */
export function visibleProducts(category: TestCategory): CategoryProduct[] {
  return category.products.filter((p) => !p.hidden);
}

export function getCategory(slug: string): TestCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
