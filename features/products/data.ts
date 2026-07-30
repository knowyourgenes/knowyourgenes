import type { ProductKit } from './types';

// =============================================================================
// Product-kit content. One entry per kit; the PDP layout is identical for all,
// so scaling to the ~129 tests is purely additive here. When this list grows
// large, split into `data/<slug>.ts` files and re-export them from this array —
// the getProductKit() API stays the same.
// =============================================================================

const wellnessComprehensive: ProductKit = {
  slug: 'wellness-comprehensive',

  seo: {
    title: 'Wellness Comprehensive Test — 53 traits from one saliva kit | KnowYourGenes',
    description:
      'Nutrition, Weight Management, Fitness and Detox — 53 genetic traits from a single at-home saliva kit. NABL-accredited lab, results in 7 days, free counselling.',
  },

  utilityBar: {
    text: 'Need help choosing the right test? Talk to our genetics team at',
    phone: '1800-XXX-XXXX',
  },

  breadcrumb: ['Home', 'Genetic Testing Kit', 'Genetic Testing Kits with Reports'],

  gallery: {
    brandLabel: 'KNOW YOUR GENES',
    title: 'Wellness Comprehensive Genetic Test',
    subtitle: 'Detox · Weight Management · Fitness · Nutrition · 53 traits',
    thumbCount: 4,
  },

  pills: [{ label: '4 reports' }, { label: '53 traits' }, { label: '1 saliva kit' }],
  title: 'Wellness Comprehensive Test',
  rating: 5.0,
  reviewCount: 5,
  price: '₹____',
  variantLabel: 'SELECT REPORT',
  variants: [
    { value: 'essential', label: 'Essential Pack · Wellness Comprehensive' },
    { value: 'complete', label: 'Complete Pack · + Men’s & Women’s Health' },
    { value: 'total', label: 'Total Pack · Every KYG test' },
  ],
  upsellLinkLabel: 'Want more from one sample? See Complete & Total Pack options',
  trustChips: [
    { icon: 'saliva', line1: 'Saliva kit', line2: 'no needles' },
    { icon: 'clock', line1: 'Results in 7 days', line2: '' },
    { icon: 'shield', line1: 'NABL-accredited lab', line2: '' },
    { icon: 'chat', line1: 'Free counselling', line2: '' },
  ],
  categoryLine: 'Category: Genetic Testing Kit · Wellness Comprehensive Test',

  included: {
    title: "WHAT'S INCLUDED",
    items: [
      {
        name: 'Nutrition',
        traits: '20 traits',
        desc: 'Micronutrient response (Vitamins A, B6, B9, B12, C, D, E, K, Calcium, Magnesium, Iron, Omega-3), macronutrient handling (carbs, saturated/mono/polyunsaturated fat), and food sensitivities (lactose, caffeine, salt, gluten).',
      },
      {
        name: 'Weight Management',
        traits: '17 traits',
        desc: 'Predisposition to obesity, response to dieting, fat storage, insulin sensitivity, eating behaviour (binge eating, sweet/bitter perception, satiety), and genetic lipid profile (LDL, HDL, triglycerides).',
      },
      {
        name: 'Fitness',
        traits: '13 traits',
        desc: 'Response to exercise (power, endurance, aerobic and anaerobic capacity), plus injury and recovery risk (muscle injury, tendinopathy, ligament rupture risk).',
      },
      {
        name: 'Detox',
        traits: '3 traits',
        desc: 'Fat-soluble and water-soluble toxin clearance, and oxidative stress handling.',
      },
    ],
  },
  specs: [
    {
      title: 'SAMPLE TYPE',
      body: 'A simple saliva sample, collected at home with the included kit — no needles and no clinic visit. Seal it in the prepaid pouch and we arrange the pickup.',
    },
    {
      title: 'TESTING TECHNIQUE',
      body: 'Your DNA is analysed on a clinically validated genotyping array at our NABL-accredited partner lab, then interpreted against peer-reviewed research relevant to Indian biology.',
    },
    {
      title: "WHAT YOU'LL RECEIVE",
      body: 'A personalised PDF report across all trait groups with clear, actionable guidance — plus a free one-on-one counselling session to walk you through your results.',
    },
  ],

  features: {
    eyebrow: 'WHY KYG',
    heading: 'Features',
    cards: [
      { icon: 'spark', title: 'Personalized and Actionable' },
      { icon: 'ship', title: 'Pan India Shipping' },
      { icon: 'report', title: 'Digital Reports' },
      { icon: 'lock', title: 'Secure Personal Data' },
    ],
  },

  upgrade: {
    eyebrow: 'ONE SAMPLE, MORE ANSWERS',
    heading: 'Already ordering?',
    headingAccent: 'Get more from the same sample.',
    sub: 'Upgrade before checkout and answer more of your biology from one saliva kit, no second sample, no second visit.',
    cards: [
      {
        kicker: 'UPGRADE TO COMPLETE PACK',
        badge: 'MOST VALUE',
        title: "+ Men's Wellness & Women's Health",
        desc: 'Adds Hormones, Hair Fall & Fertility and PCOS, Pregnancy Loss, Mood, Bones & Joints to your Wellness Comprehensive results.',
        totalLabel: 'Complete Pack total: ₹____',
        ctaLabel: 'Upgrade My Order',
        highlighted: true,
      },
      {
        kicker: 'UPGRADE TO TOTAL PACK',
        title: 'Every test Know Your Genes offers',
        desc: 'Adds Skin, Sleep, Eye, Kidney, Immunity, Auto Immune, Diabetes, Cardio Met, CAD-PRS, Epic Age & Feline Year, on top of Complete Pack.',
        totalLabel: 'Total Pack total: ₹____',
        ctaLabel: 'Upgrade My Order',
      },
    ],
  },

  faq: {
    eyebrow: 'BEFORE YOU ORDER',
    heading: 'FAQs',
    items: [
      {
        q: 'Who can benefit from this test?',
        a: 'Anyone who wants to make nutrition, weight, fitness and detox decisions based on their own genetics rather than generic advice. It is designed for healthy adults planning long-term wellness.',
      },
      {
        q: 'Is this one test or four?',
        a: 'It is one kit and one saliva sample that produces four connected reports — Nutrition, Weight Management, Fitness and Detox — for a combined 53 traits.',
      },
      {
        q: "Can I add other tests, like Men's Wellness or Skin, to this kit?",
        a: 'Yes. Before checkout you can upgrade to the Complete or Total Pack and answer far more of your biology from the same saliva sample — no second kit required.',
      },
      {
        q: 'How long does it take to get the report?',
        a: 'Reports are ready in about 7 days from the day your sample reaches the lab. You are notified by email and can download the PDF from your account.',
      },
      {
        q: 'Is this a medical or diagnostic test?',
        a: 'No. This is a wellness and predisposition test meant to guide lifestyle choices. It does not diagnose disease and is not a substitute for medical advice.',
      },
      {
        q: 'Will my genetic data be safe and private?',
        a: 'Your data is encrypted, stored securely, and never sold. You stay in control and can request deletion at any time.',
      },
    ],
  },

  reviews: {
    eyebrow: 'REVIEWS',
    heading: '5 reviews for Genetic Testing Kits with Reports',
    disclaimer:
      'Placeholder reviews shown for layout purposes only. Replace with verified quotes once collected, with consent to use name and date.',
    items: [
      {
        initials: 'C',
        name: '[Customer name]',
        date: '[Date]',
        stars: 5,
        quote: '[Insert a real quote about a specific result from the Wellness Comprehensive report.]',
      },
      {
        initials: 'C',
        name: '[Customer name]',
        date: '[Date]',
        stars: 5,
        quote: '[Insert a real quote about recommending this to a client or family member.]',
      },
      {
        initials: 'C',
        name: '[Customer name]',
        date: '[Date]',
        stars: 5,
        quote: '[Insert a real quote about the at-home collection experience.]',
      },
      {
        initials: 'C',
        name: '[Customer name]',
        date: '[Date]',
        stars: 5,
        quote: '[Insert a real quote about the counselling session after results arrived.]',
      },
      {
        initials: 'C',
        name: '[Customer name]',
        date: '[Date]',
        stars: 5,
        quote: '[Insert a real quote about upgrading to a bigger pack after trying this kit.]',
      },
    ],
  },
};

export const PRODUCT_KITS: ProductKit[] = [wellnessComprehensive];

export function getProductKit(slug: string): ProductKit | undefined {
  return PRODUCT_KITS.find((k) => k.slug === slug);
}

export const PRODUCT_KIT_SLUGS = PRODUCT_KITS.map((k) => k.slug);
