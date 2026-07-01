// =============================================================================
// lib/categoriesdata.ts - test categories + their products
// -----------------------------------------------------------------------------
// Drives the /categories listing and each /categories/[slug] page. Clicking a
// category card on the home page lands on /categories; clicking a category there
// opens its own page listing the products, each linking to its test page.
//
// Currently only "Wellness" is live (4 products). Men's Health is shown as a
// second category linking to the new self-contained /mens-health page.
// =============================================================================

export interface CategoryProduct {
  slug: string;
  name: string;
  /** short trait/panel count shown as a chip, e.g. "20 traits" */
  meta?: string;
  blurb: string;
  href: string;
}

export interface TestCategory {
  slug: string;
  name: string;
  tagline: string;
  blurb: string;
  /** accent family used for the card + detail header */
  accent: 'wellness' | 'mens' | 'womens';
  productCountLabel: string;
  products: CategoryProduct[];
}

export const CATEGORIES: TestCategory[] = [
  {
    slug: 'wellness',
    name: 'My Wellness',
    tagline: 'Everyday health, decoded from your DNA',
    blurb:
      'Four genetic reports that explain how your body actually responds to food, weight, exercise and toxins, so you can stop guessing and start acting on what works for you.',
    accent: 'wellness',
    productCountLabel: '4 reports',
    products: [
      {
        slug: 'my-diet',
        name: 'My Diet DNA',
        meta: '20 traits',
        blurb:
          'How you absorb vitamins and respond to carbs, fat, lactose, gluten and caffeine. Eat for your genotype.',
        href: '/wellness/my-diet',
      },
      {
        slug: 'my-weight',
        name: 'My Weight DNA',
        meta: '17 traits',
        blurb:
          'Fat storage, insulin sensitivity, eating behaviour and weight-regain risk, largely written in your DNA.',
        href: '/wellness/my-weight',
      },
      {
        slug: 'my-fitness',
        name: 'My Fitness DNA',
        meta: '12 traits',
        blurb:
          'Your genetic response to exercise: power vs endurance, recovery, injury risk and the training that suits you.',
        href: '/wellness/my-fitness',
      },
      {
        slug: 'my-detox',
        name: 'My Detox DNA',
        meta: '3 traits',
        blurb:
          'How well your body clears toxins and processes what you put into it, and where you may need extra support.',
        href: '/wellness/my-detox',
      },
    ],
  },
  {
    slug: 'mens-health',
    name: "Men's Health DNA",
    tagline: 'The checks most men never think to make',
    blurb:
      'Fertility, hormones and hair loss. Three areas of male health with a strong genetic component. A simple at-home saliva test tells you where you stand, before anything goes wrong.',
    accent: 'mens',
    productCountLabel: '3 health checks',
    products: [
      {
        slug: 'mens-health',
        name: "Men's Health DNA",
        meta: '3 health checks',
        blurb: 'Fertility (ART3), hormones (HFE) and hair-loss (AR) risk in one saliva test.',
        href: '/mens-health',
      },
    ],
  },
];

export function getCategory(slug: string): TestCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
