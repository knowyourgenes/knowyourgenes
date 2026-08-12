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
      // Women's Health is the reference build of the section-array layout (see
      // lib/testsdata.ts); Men's, Immunity, Skin, Eye and Kidney are built on it
      // from the copy decks in health/, one file each under lib/tests/. Ancestry
      // and My Wellness were removed with the old fixed-shape renderer and return
      // here as they are rebuilt - one entry per rebuilt test.
      {
        slug: 'womens-health',
        name: "Women's Health DNA",
        meta: '5 health checks',
        blurb:
          'PCOS, pregnancy loss, peripartum mood, bone density and joint risk - five answers from one at-home saliva sample.',
        href: '/categories/wellness/womens-health',
      },
      {
        slug: 'mens-health',
        name: "Men's Wellness DNA",
        meta: '3 health checks',
        blurb: 'Hair fall, testosterone and male fertility - three answers from one at-home saliva sample, in 7 days.',
        href: '/categories/wellness/mens-health',
      },
      {
        slug: 'immunity-health',
        name: 'Immunity DNA',
        meta: '24 markers',
        blurb:
          'Eleven infection results, eleven micronutrients and three detox readings - why you catch it first, and why it keeps you down longer.',
        href: '/categories/wellness/immunity-health',
      },
      {
        slug: 'skin-health',
        name: 'Skin Health DNA',
        meta: '20 markers',
        blurb:
          'Ten skin conditions, six food sensitivities and four nutrients - what your skin is doing years before the mirror shows it.',
        href: '/categories/wellness/skin-health',
      },
      {
        slug: 'eye-health',
        name: 'Eye Health DNA',
        meta: '7 health checks',
        blurb:
          'Glaucoma, retinopathy, cataract, myopia, eye pressure, macular degeneration and retinal occlusion - seven findings from one saliva sample.',
        href: '/categories/wellness/eye-health',
      },
      {
        slug: 'kidney-health',
        name: 'Kidney Health DNA',
        meta: '7 health checks',
        blurb:
          'Uric acid, cysts, magnesium, chronic kidney disease, protein loss and stones - twelve genetic markers for an organ with no pain nerves.',
        href: '/categories/wellness/kidney-health',
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
