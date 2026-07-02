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
      // The 4 old wellness reports are being merged into this single combined
      // report - hidden until it is built.
      {
        slug: 'my-wellness',
        name: 'My Wellness',
        meta: 'Combined report',
        blurb: 'Diet, Weight, Fitness and Detox insights combined into one report.',
        href: '/categories/wellness/my-wellness',
        hidden: true,
      },
      {
        slug: 'mens-health',
        name: "Men's Health DNA",
        meta: '3 health checks',
        blurb:
          'Fertility (ART3), hormones (HFE) and hair-loss (AR) risk in one saliva test. Know where you stand before anything goes wrong.',
        href: '/categories/wellness/mens-health',
      },
      {
        slug: 'womens-health',
        name: "Women's Health DNA",
        meta: 'Coming soon',
        blurb: "Clinical panels focused on women's genetic health.",
        href: '/categories/wellness/womens-health',
        hidden: true,
      },
      {
        slug: 'ancestry',
        name: 'Ancestry DNA',
        meta: 'Coming soon',
        blurb: 'Trace your heritage and genetic origins.',
        href: '/categories/wellness/ancestry',
        hidden: true,
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
