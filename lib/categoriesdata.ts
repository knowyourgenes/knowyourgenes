// =============================================================================
// lib/categoriesdata.ts - test categories + their products
// -----------------------------------------------------------------------------
// Drives the /categories listing and each /categories/[category_slug] page.
// Clicking a category card on the home page lands on /categories; clicking a
// category there opens its own page listing its (visible) products, each linking
// to /categories/[category_slug]/[test_slug].
//
// Currently there is ONE category, "Wellness", holding all nine test pages.
// Every product below is live - nothing is hidden - but see `image` on card
// artwork: only four of the nine have a real photograph shot for them yet.
// =============================================================================

import type { IconKey, Img } from '@/features/tests/types';

/**
 * Tint family for a product card's fallback tile. Muted on purpose - the grid
 * has to stay calm with nine cards in it, so these are the brand teal/crimson
 * with a few neighbours, not a rainbow.
 */
export type CardTone = 'teal' | 'moss' | 'rose' | 'amber' | 'indigo' | 'night';

export interface CategoryProduct {
  slug: string;
  name: string;
  /** short trait/panel count shown as a chip, e.g. "3 health checks" */
  meta?: string;
  /**
   * The concerns this report actually answers, for the chip row on the category
   * card (Figma 343:3047).
   *
   * AUTHORED, NOT DERIVED, and deliberately so. `keywords` below is lowercase,
   * generic-first and documented never-rendered; the `tabLabel`s on the detail
   * page match this list for only three of nine products and `sleep` has none
   * at all. Deriving would have printed "Women / Female / Pcos" on card one and
   * nothing on card seven. Each label is Title Case as it should read on screen,
   * and each `icon` is a key from features/tests/components/icons.tsx.
   *
   * The count here is the number of CONCERNS, which is not always `meta`'s
   * number: my-wellness is 52 traits delivered as 4 reports, so it carries 52
   * in `meta` and 4 concerns. That is the honest reading of both.
   */
  concerns?: { label: string; icon: IconKey }[];
  blurb: string;
  href: string;
  /** hidden products are declared but not rendered on the category page yet */
  hidden?: boolean;

  // ---- card artwork --------------------------------------------------------
  // The card renders `image` when it is set. It is deliberately OPTIONAL: five
  // of the nine tests only have 136-byte transparent placeholder stubs under
  // public/tests/<slug>/ (they were committed so the detail pages could be
  // built before the shoot), and pointing a card at one renders a blank box.
  // Those five carry no `image` and fall back to the `icon` + `tone` tile.
  //
  // WHEN A REAL PHOTO LANDS: drop the file in public/tests/<slug>/ and add the
  // `image` line here. Nothing else changes - the tile disappears on its own.
  /** Real photograph for the card band. Omit while the asset is still a stub. */
  image?: Img;
  /** Glyph - the fallback tile's mark, and the badge on cards that have a photo. */
  icon: IconKey;
  tone: CardTone;

  /**
   * Concern terms the search box matches on. Never rendered - this is the whole
   * reason search is worth having at nine products: people arrive typing
   * "hair fall" or "can't sleep", not "Men's Wellness DNA". Include the
   * layman's word AND the clinical one, plus common misspellings.
   */
  keywords: string[];
}

export interface TestCategory {
  slug: string;
  name: string;
  tagline: string;
  /**
   * The trailing clause of `tagline` that the category hero sets in cursive
   * (Figma 343:3047 renders "Genetic health reports / from one saliva kit." with
   * the second line in Cormorant italic).
   *
   * Authored rather than parsed. Splitting a tagline on a heuristic works for
   * this one string and breaks on the next category someone adds; if this is
   * absent the hero simply renders the tagline whole, which is a correct-looking
   * fallback rather than a wrong-looking guess.
   */
  heroTurn?: string;
  blurb: string;
  /** accent family used for the card + detail header */
  accent: 'wellness' | 'mens' | 'womens';
  /** Lead image for the category card on /categories. */
  image?: Img;
  /** Fallback tile mark + tint - same contract as `CategoryProduct`. */
  icon: IconKey;
  tone: CardTone;
  products: CategoryProduct[];
}

export const CATEGORIES: TestCategory[] = [
  {
    slug: 'wellness',
    name: 'Wellness',
    tagline: 'Genetic health reports from one saliva kit',
    heroTurn: 'from one saliva kit.',
    blurb:
      'Understand how your body is genetically wired, from everyday wellness to the health checks most people never think to make. One at-home saliva kit per report.',
    accent: 'wellness',
    image: {
      src: '/kyg/950448a92b6b.jpg',
      alt: 'An Indian family at home together in the kitchen',
    },
    icon: 'dna',
    tone: 'moss',
    products: [
      // Women's Health is the reference build of the section-array layout (see
      // lib/testsdata.ts); every other test here is built on it from the copy
      // decks in health/, one file each under lib/tests/. This is now the
      // complete set - nothing is left behind on the old fixed-shape renderer.
      {
        slug: 'womens-health',
        name: "Women's Health DNA",
        meta: '5 health checks',
        concerns: [
          { label: 'PCOS', icon: 'scan-heart' },
          { label: 'Pregnancy Loss', icon: 'pregnancy-loss' },
          { label: 'Peripartum Mood', icon: 'baby' },
          { label: 'Bone Density', icon: 'bone' },
          { label: 'Joint Risk', icon: 'activity' },
        ],
        blurb:
          'PCOS, pregnancy loss, peripartum mood, bone density and joint risk - five answers from one at-home saliva sample.',
        href: '/categories/wellness/womens-health',
        image: { src: '/tests/womens-health/hero-woman.jpg', alt: 'A woman looking into the middle distance' },
        icon: 'scan-heart',
        tone: 'rose',
        keywords: [
          'women',
          'female',
          'pcos',
          'polycystic ovary',
          'periods',
          'irregular periods',
          'miscarriage',
          'pregnancy loss',
          'fertility',
          'trying to conceive',
          'postpartum',
          'peripartum',
          'depression',
          'mood',
          'hormones',
          'bone density',
          'osteoporosis',
          'joints',
          'arthritis',
        ],
      },
      {
        slug: 'mens-health',
        name: "Men's Wellness DNA",
        meta: '3 health checks',
        concerns: [
          { label: 'Hair Fall', icon: 'scissors' },
          { label: 'Testosterone', icon: 'flask' },
          { label: 'Male Fertility', icon: 'baby' },
        ],
        blurb: 'Hair fall, testosterone and male fertility - three answers from one at-home saliva sample, in 7 days.',
        href: '/categories/wellness/mens-health',
        // No `image` on purpose. The only asset for this test is
        // public/tests/mens-health/hero-man.png, which is a masked clinician
        // drawing BLOOD from a man's arm - it contradicts the "no needles /
        // at-home saliva" promise this grid is selling, and it does not match
        // its own alt text on the detail page either ("a man in his late
        // twenties, healthy and in control"). Until a saliva-appropriate photo
        // is shot, the tone tile is the honest option.
        icon: 'person',
        tone: 'teal',
        keywords: [
          'men',
          'male',
          'hair fall',
          'hair loss',
          'balding',
          'baldness',
          'alopecia',
          'receding hairline',
          'testosterone',
          'low testosterone',
          'hormones',
          'male fertility',
          'sperm',
          'sperm count',
          'libido',
          'energy',
        ],
      },
      {
        slug: 'my-wellness',
        name: 'My Wellness DNA',
        meta: '52 traits · 4 reports',
        concerns: [
          { label: 'Diet', icon: 'salad' },
          { label: 'Weight', icon: 'scale' },
          { label: 'Fitness', icon: 'dumbbell' },
          { label: 'Detox', icon: 'droplet' },
        ],
        blurb: 'Diet, weight, fitness and detox - 52 traits from one saliva kit, delivered as four reports in 7 days.',
        href: '/categories/wellness/my-wellness',
        image: { src: '/tests/my-wellness/hero-wellness.png', alt: 'A person mid-stride on a morning walk' },
        icon: 'sprout',
        tone: 'moss',
        keywords: [
          'wellness',
          'diet',
          'nutrition',
          'food',
          'weight',
          'weight loss',
          'obesity',
          'belly fat',
          'metabolism',
          'fitness',
          'exercise',
          'gym',
          'workout',
          'stamina',
          'detox',
          'liver',
          'lifestyle',
          'vitamins',
        ],
      },
      {
        slug: 'immunity-health',
        name: 'Immunity DNA',
        meta: '24 markers',
        concerns: [
          { label: 'Infection', icon: 'virus' },
          { label: 'Micronutrients', icon: 'pill' },
          { label: 'Detox', icon: 'droplet' },
        ],
        blurb:
          'Eleven infection results, eleven micronutrients and three detox readings - why you catch it first, and why it keeps you down longer.',
        href: '/categories/wellness/immunity-health',
        image: { src: '/tests/immunity-health/hero.webp', alt: 'A person healthy and getting on with an ordinary day' },
        icon: 'shield',
        tone: 'amber',
        keywords: [
          'immunity',
          'immune system',
          'infection',
          'falling sick',
          'always sick',
          'cold',
          'cough',
          'flu',
          'fever',
          'covid',
          'viral',
          'bacterial',
          'fungal',
          'asthma',
          'allergy',
          'inflammation',
          'ibd',
          'micronutrients',
          'vitamin d',
          'recovery',
        ],
      },
      {
        slug: 'skin-health',
        name: 'Skin Health DNA',
        meta: '20 markers',
        concerns: [
          { label: 'Skin Conditions', icon: 'acne' },
          { label: 'Food Sensitivities', icon: 'gluten' },
          { label: 'Nutrients', icon: 'pill' },
        ],
        blurb:
          'Ten skin conditions, six food sensitivities and four nutrients - what your skin is doing years before the mirror shows it.',
        href: '/categories/wellness/skin-health',
        image: { src: '/tests/skin-health/hero-skin.webp', alt: 'A close-up of skin, clear and calm' },
        icon: 'sparkles',
        tone: 'rose',
        keywords: [
          'skin',
          'acne',
          'pimples',
          'breakouts',
          'wrinkles',
          'fine lines',
          'ageing',
          'aging',
          'anti-ageing',
          'pigmentation',
          'dark spots',
          'sun damage',
          'tanning',
          'collagen',
          'glow',
          'dryness',
          'cellulite',
          'stretch marks',
          'food sensitivity',
          'dairy',
          'gluten',
        ],
      },
      {
        slug: 'eye-health',
        name: 'Eye Health DNA',
        meta: '7 health checks',
        concerns: [
          { label: 'Glaucoma', icon: 'eye' },
          { label: 'Retinopathy', icon: 'eye-off' },
          { label: 'Cataract', icon: 'cataract' },
          { label: 'Myopia', icon: 'glasses' },
          { label: 'Eye Pressure', icon: 'pressure' },
          { label: 'Macular Degeneration', icon: 'target' },
          { label: 'Retinal Occlusion', icon: 'alert' },
        ],
        blurb:
          'Glaucoma, retinopathy, cataract, myopia, eye pressure, macular degeneration and retinal occlusion - seven findings from one saliva sample.',
        href: '/categories/wellness/eye-health',
        image: { src: '/tests/eye-health/hero-eye.webp', alt: 'A close-up of an eye, calm and clear' },
        icon: 'eye',
        tone: 'indigo',
        keywords: [
          'eye',
          'eyes',
          'eyesight',
          'vision',
          'sight',
          'blurry vision',
          'spectacles',
          'glasses',
          'power',
          'myopia',
          'short sight',
          'glaucoma',
          'cataract',
          'retina',
          'retinopathy',
          'diabetic eye',
          'macular degeneration',
          'eye pressure',
          'screen strain',
        ],
      },
      {
        slug: 'sleep',
        name: 'Sleep DNA',
        meta: '28 readings',
        concerns: [
          { label: 'Sleep Apnea', icon: 'air' },
          { label: 'Insomnia', icon: 'moon' },
          { label: 'Duration', icon: 'clock' },
          { label: 'Teeth Grinding', icon: 'stretch' },
          { label: 'Restless Legs', icon: 'footprints' },
          { label: 'Narcolepsy', icon: 'armchair' },
          { label: 'Airway', icon: 'stethoscope' },
          { label: 'Nutrients', icon: 'pill' },
        ],
        blurb:
          'Apnea, insomnia, duration, teeth grinding, restless legs, narcolepsy, your airway and the eight nutrients sleep runs on.',
        href: '/categories/wellness/sleep',
        image: { src: '/tests/sleep/hero.webp', alt: 'A person awake at 3am, phone face-down' },
        icon: 'moon',
        tone: 'night',
        keywords: [
          'sleep',
          'cant sleep',
          "can't sleep",
          'insomnia',
          'sleepless',
          'awake at night',
          'snoring',
          'sleep apnea',
          'apnoea',
          'tired',
          'fatigue',
          'exhausted',
          'teeth grinding',
          'bruxism',
          'restless legs',
          'narcolepsy',
          'caffeine',
          'coffee',
          'jet lag',
          'body clock',
        ],
      },
      {
        slug: 'ancestry',
        name: 'Ancestry DNA',
        meta: '10 global regions',
        concerns: [
          { label: 'Global Regions', icon: 'globe' },
          { label: '42,000+ Markers', icon: 'dna' },
          { label: 'Gene Journey', icon: 'compass' },
        ],
        blurb:
          'Ancestors In Me - where you come from, mapped across up to 10 global regions from 42,000+ markers, written up as a Gene Journey.',
        href: '/categories/wellness/ancestry',
        image: { src: '/tests/ancestry/hero-map.png', alt: 'A map tracing ancestral migration routes' },
        icon: 'compass',
        tone: 'moss',
        keywords: [
          'ancestry',
          'ancestors',
          'origin',
          'origins',
          'roots',
          'heritage',
          'lineage',
          'family tree',
          'ethnicity',
          'migration',
          'where i come from',
          'caste',
          'region',
          'genealogy',
        ],
      },
      {
        slug: 'kidney-health',
        name: 'Kidney Health DNA',
        meta: '7 health checks',
        concerns: [
          { label: 'Uric Acid', icon: 'droplet' },
          { label: 'Cysts', icon: 'cyst' },
          { label: 'Magnesium', icon: 'pill' },
          { label: 'Chronic Kidney Disease', icon: 'alert' },
          { label: 'Protein Loss', icon: 'flask' },
          { label: 'Stones', icon: 'gem' },
        ],
        blurb:
          'Uric acid, cysts, magnesium, chronic kidney disease, protein loss and stones - twelve genetic markers for an organ with no pain nerves.',
        href: '/categories/wellness/kidney-health',
        icon: 'droplet',
        tone: 'teal',
        keywords: [
          'kidney',
          'kidneys',
          'renal',
          'uric acid',
          'gout',
          'kidney stones',
          'stones',
          'ckd',
          'chronic kidney disease',
          'creatinine',
          'cysts',
          'polycystic kidney',
          'magnesium',
          'protein in urine',
          'proteinuria',
          'dialysis',
        ],
      },
    ],
  },
];

/** Products that should actually render on a category page. */
export function visibleProducts(category: TestCategory): CategoryProduct[] {
  return category.products.filter((p) => !p.hidden);
}

/**
 * Lowercase and drop apostrophes, so "Women's" / "womens" / "women" and
 * "can't sleep" / "cant sleep" all collapse onto the same text.
 *
 * Exported because the header's search overlay matches PAGES and keyword
 * suggestions too, not just products, and those must collapse text exactly the
 * way `searchProducts` does - otherwise "women's health" would find the product
 * but not the page, from the same box, in the same keystroke.
 */
export function normalizeSearchText(s: string): string {
  return s.toLowerCase().replace(/['‘’]/g, '');
}

/**
 * Everything a product can be matched on, flattened once. `blurb` is in here so
 * a search for "narcolepsy" still lands even though no keyword list will ever
 * be exhaustive.
 */
function haystack(p: CategoryProduct): string {
  return normalizeSearchText([p.name, p.meta ?? '', p.blurb, ...p.keywords].join(' '));
}

/**
 * Filter for the category page's search box.
 *
 * Tokens are ANDed, so "hair fall" narrows rather than widens, but each token
 * matches as a substring - typing "kidn" is enough, and a half-typed trailing
 * word never empties the grid mid-keystroke. An empty/whitespace query returns
 * the list untouched.
 */
export function searchProducts(products: CategoryProduct[], query: string): CategoryProduct[] {
  const tokens = normalizeSearchText(query)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  if (tokens.length === 0) return products;
  return products.filter((p) => {
    const hay = haystack(p);
    return tokens.every((t) => hay.includes(t));
  });
}

export function getCategory(slug: string): TestCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
