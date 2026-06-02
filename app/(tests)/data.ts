// =============================================================================
// (tests) route data layer
// -----------------------------------------------------------------------------
// Every test-detail page at /[category_slug]/[test_slug] is rendered purely from
// the data declared here. To publish a new page you only add a `Category` and/or
// a `Test` object to the arrays at the bottom — no JSX changes required.
//
// Design tokens, layout and animation live in the components under
// ./_components; this file is data only (no React, no styling).
// =============================================================================

/** Risk grade used by result cards and the grading legend. */
export type RiskStatus = 'good' | 'avg' | 'risk';

/** Accent palette for a category, injected as CSS variables on the page root so
 *  each category can be themed (Men's Health = teal, Women's = rose, …). */
export interface AccentPalette {
  /** lightest tint — chips, soft backgrounds */
  c50: string;
  /** light tint — hover borders */
  c100: string;
  /** mid — solid accents, icons */
  c500: string;
  /** dark — text on tint, emphasis */
  c700: string;
}

/** Sidebar "Pair With" cross-sell link. */
export interface PairLink {
  dot: string;
  name: string;
  meta: string;
  href: string;
}

/** Bundle, reused by the sidebar mini-cards and the Bundles section. */
export interface Bundle {
  dot: string;
  tag: string;
  name: string;
  desc: string;
  /** which themed palette to paint the card with */
  theme: 'wellness' | 'couple' | 'matri' | 'ultimate';
}

export interface HeroStat {
  num: string;
  label: string;
}

/** A discovery panel: drives both the sidebar entry and the big result card. */
export interface Panel {
  /** in-page anchor id, e.g. "panel-hormonal" */
  id: string;
  sidebar: { dot: string; name: string; meta: string };
  number: string;
  title: string;
  text: string;
  explainer?: { head?: string; text: string };
  indiaNote?: { label: string; text: string };
  symptomsTitle?: string;
  symptoms: string[];
  result: {
    name: string;
    status: RiskStatus;
    statusLabel: string;
    genes: string;
    interpretation: string;
    recommendation: string;
  };
  /** when true the result card sits on the left (alternating layout) */
  flip?: boolean;
}

export interface PanelGroup {
  name: string;
  countLabel: string;
  items: { label: string; isGene?: boolean }[];
}

export interface GradingRow {
  status: RiskStatus;
  label: string;
  text: string;
}

/** Credibility expert. Avatar is either initials or a registered icon key. */
export interface Expert {
  avatar: { type: 'initials'; value: string } | { type: 'icon'; value: string };
  name: string;
  role: string;
  text: string;
  lab: string;
}

export interface ActionItem {
  icon: string;
  title: string;
  text: string;
}

export interface Step {
  num: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
}

export interface Faq {
  q: string;
  a: string;
}

/** A section heading (eyebrow + title + optional sub). */
export interface SectionHead {
  eyebrow: string;
  title: string;
  sub?: string;
}

/** A category groups tests and provides the accent + sidebar group title. */
export interface Category {
  slug: string;
  /** human name, e.g. "Men's Health DNA" — used as the sidebar group title */
  name: string;
  accent: AccentPalette;
}

/** A test = one rendered page. All copy and imagery for the page lives here. */
export interface Test {
  slug: string;
  categorySlug: string;

  seo: { title: string; description: string };

  sidebar: {
    eyebrow: string;
    pairWith: PairLink[];
    bundles: Bundle[];
  };

  hero: {
    badge: string;
    titleLead: string;
    titleHighlight: string;
    titleTail: string;
    sub: string;
    ctaLabel: string;
    trustHtml: string;
    image: string;
    imageAlt: string;
    imageTag: string;
    stats: HeroStat[];
  };

  myth: {
    label: string;
    quoteLead: string;
    quoteEmphasis: string;
    quoteTail: string;
    body: string;
    image: string;
    imageAlt: string;
  };

  discover: SectionHead & { panels: Panel[] };

  midCta1: { text: string; ctaLabel: string };

  report: SectionHead & { groups: PanelGroup[]; gradingTitle: string; grading: GradingRow[] };

  expertise: SectionHead & {
    bullets: string[];
    certifications: { src: string; alt: string }[];
    experts: Expert[];
  };

  actionPlan: SectionHead & {
    banner: { eyebrow: string; text: string; image: string; imageAlt: string };
    actions: ActionItem[];
  };

  midCta2: { text: string; ctaLabel: string };

  howItWorks: { eyebrow: string; title: string; steps: Step[] };

  faq: { eyebrow: string; title: string; items: Faq[] };

  bundlesSection: { items: Bundle[] };

  bottomCta: {
    title: string;
    sub: string;
    ctaLabel: string;
    nudge: string;
    trust: string;
  };
}

// Image CDN base used by the seed data below. (Site nav/footer chrome lives in
// components/site — see KygHeader / KygFooter.)
const U = 'https://images.unsplash.com';

// -----------------------------------------------------------------------------
// Categories
// -----------------------------------------------------------------------------
export const CATEGORIES: Category[] = [
  {
    slug: 'mens-health',
    name: "Men's Health DNA",
    accent: { c50: '#E6F4F1', c100: '#CDE9E4', c500: '#15605D', c700: '#0E4D4B' },
  },
];

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------
const mensHealth: Test = {
  slug: 'mens-health-dna',
  categorySlug: 'mens-health',

  seo: {
    title: "Men's Health DNA · KYG · Know Your Genes",
    description:
      'Fertility, hormones, hair loss. Three areas of men’s health with a strong genetic component. Know your risk before it becomes your reality.',
  },

  sidebar: {
    eyebrow: 'Your Reports',
    pairWith: [
      { dot: 'S', name: "Women's Health DNA", meta: 'For your partner', href: '#' },
      { dot: 'My', name: 'My Wellness', meta: 'Diet · Weight · Fitness · Detox', href: '#' },
    ],
    bundles: [
      { dot: 'M', tag: 'Pre-Matrimonial', name: 'Know Before You Begin', desc: 'He + She + Counselling', theme: 'matri' },
      { dot: 'C', tag: 'For Couples', name: "Couple's Blueprint", desc: 'Wellness + She + He', theme: 'couple' },
      { dot: 'U', tag: 'Ultimate', name: 'The Complete You', desc: 'All reports + Ancestry', theme: 'ultimate' },
    ],
  },

  hero: {
    badge: "Men's Health DNA",
    titleLead: 'Men rarely get tested ',
    titleHighlight: 'until something goes wrong.',
    titleTail: ' Change that.',
    sub: "Fertility. Hormones. Hair loss. Three areas of men's health that are rarely discussed until they become a problem, and all three have a strong genetic component. Know your risk before it becomes your reality.",
    ctaLabel: "Get My Men's Health Report",
    trustHtml:
      'At-home saliva kit &nbsp;·&nbsp; No needles &nbsp;·&nbsp; Data private &nbsp;·&nbsp; <b>30 min free counselling session</b>',
    image: `${U}/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1100&q=80`,
    imageAlt: 'A confident man',
    imageTag: 'Know your risk early',
    stats: [
      { num: '3', label: 'Clinical panels' },
      { num: 'NABL', label: 'Accredited lab' },
      { num: '99%+', label: 'Accuracy' },
      { num: '7 days', label: 'Turnaround' },
    ],
  },

  myth: {
    label: "What most Indian men don't know about their own health",
    quoteLead:
      '"1 in 8 couples struggle to conceive. In nearly half of those cases, the issue is on the man’s side. ',
    quoteEmphasis: 'Most men never find out why.',
    quoteTail: '"',
    body: "Men are statistically less likely to get health tests, less likely to visit a doctor for preventive care, and far less likely to discuss reproductive or hormonal health. Yet male fertility, testicular function, and hair loss are all significantly influenced by genetics. This test gives you the information you need, before a problem becomes a crisis.",
    image: `${U}/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=900&q=80`,
    imageAlt: 'A man in a thoughtful moment',
  },

  discover: {
    eyebrow: "What you'll discover",
    title: 'Three things most men never think to check',
    sub: 'Each panel covers a specific area of men’s health, with your genetic result, a plain-language interpretation, and personalised action steps.',
    panels: [
      {
        id: 'panel-hormonal',
        sidebar: { dot: 'H', name: 'Hormonal health', meta: 'Testicular function · HFE' },
        number: '01',
        title: 'Your hormonal health, testicular function & endocrine risk',
        text: 'Your pituitary-testicular axis controls testosterone production and reproductive hormone balance. Disruptions to this system, including testicular atrophy, can affect muscle mass, sex drive, fertility, and long-term health. This panel analyses your genetic risk and gives you targeted dietary and lifestyle recommendations to support your hormonal health proactively.',
        explainer: {
          head: 'What is testicular atrophy?',
          text: 'Testicular atrophy refers to a reduction in testicular size and function. It can affect testosterone levels, sperm production, and overall reproductive health. Causes can include genetic predisposition, injury, certain chemicals, or underlying conditions. Most men are unaware of their genetic risk.',
        },
        symptomsTitle: 'Symptoms to watch for',
        symptoms: [
          'Decreased sex drive',
          'Reduced muscle mass',
          'Absent or reduced facial/pubic hair growth',
          'Softer testicles',
          'Infertility',
        ],
        result: {
          name: 'Pituitary-Testicular Endocrine Function Risk',
          status: 'good',
          statusLabel: 'Good',
          genes: 'Gene: LOC108783645, HFE',
          interpretation: 'Your genotype is associated with normal risk to testicular atrophy.',
          recommendation:
            'Maintain good health by including antioxidants in the diet. Incorporating fruits and vegetables in your daily diet is good in maintaining testicular health.',
        },
      },
      {
        id: 'panel-fertility',
        sidebar: { dot: 'F', name: 'Fertility & reproduction', meta: 'Azoospermia risk · ART3' },
        number: '02',
        title: 'Your fertility risk, reproductive function & sperm health',
        text: 'Azoospermia, the absence of sperm in ejaculate, is one of the leading causes of male infertility, affecting an estimated 1% of men and 10-15% of infertile males. Unlike low sperm count, azoospermia often has no visible symptoms. Your genetic profile can indicate predisposition to abnormal reproductive function, giving couples critical information before they begin trying to conceive.',
        indiaNote: {
          label: 'India context',
          text: 'India has one of the highest rates of infertility globally. With IVF costs running ₹1.5-2.5 lakh per cycle and emotional strain on couples significant, knowing your genetic fertility risk early changes the conversation entirely.',
        },
        symptomsTitle: 'Symptoms to watch for',
        symptoms: [
          'Low sex drive',
          'Erectile dysfunction',
          'Lump, swelling, or discomfort around the testicles',
          'Decreased body or facial hair',
          'Difficulty conceiving after 12 months of trying',
        ],
        result: {
          name: 'Abnormal Reproductive Function Risk / Male Infertility',
          status: 'good',
          statusLabel: 'Good',
          genes: 'Gene: ART3',
          interpretation: 'Your genotype is associated with normal risk of azoospermia in males.',
          recommendation:
            'Eat a healthy and balanced diet. Maintain ideal body weight. Exercise regularly.',
        },
        flip: true,
      },
      {
        id: 'panel-hairloss',
        sidebar: { dot: 'Hl', name: 'Hair loss risk', meta: 'Alopecia areata · AR gene' },
        number: '03',
        title: 'Your hair loss risk, alopecia areata genetic predisposition',
        text: 'Alopecia areata is an autoimmune condition that causes patchy hair loss, on the scalp, eyebrows, eyelashes, and body. The Androgen Receptor (AR) gene is one of the strongest known genetic predictors of alopecia risk in males. Knowing your predisposition early means you can speak to a dermatologist proactively, make dietary adjustments, and start protective interventions before significant hair loss occurs.',
        explainer: {
          head: 'What is alopecia areata?',
          text: 'Alopecia areata develops when the immune system attacks hair follicles, resulting in sudden patchy hair loss. It can progress to complete scalp hair loss (alopecia totalis) or full-body hair loss (alopecia universalis). While there is currently no cure, early detection and intervention can significantly slow progression.',
        },
        symptomsTitle: 'Symptoms to watch for',
        symptoms: [
          'Gradual thinning on top of head',
          'Circular or patchy bald spots',
          'Sudden loosening of hair',
          'Patches of scaling spreading over the scalp',
        ],
        result: {
          name: 'Risk of Spot Baldness (Alopecia Areata)',
          status: 'risk',
          statusLabel: 'Poor / High Risk',
          genes: 'Genes: AR (Androgen Receptor), LINC01432, C1orf127',
          interpretation: 'Your genotype is associated with increased risk of alopecia.',
          recommendation:
            'Consult a dermatologist if you see symptoms. Increase protein intake, fish, eggs, tofu, beans, sprouts, nuts, seeds. Biotin and Omega-3 fatty acids (flax seeds, walnuts, chia seeds) may also be beneficial.',
        },
      },
    ],
  },

  midCta1: {
    text: 'See your own results across all three panels. It starts with one saliva kit.',
    ctaLabel: "Get My Men's Health Report",
  },

  report: {
    eyebrow: 'Full report contents',
    title: 'Every panel covered',
    sub: '3 clinical panels. Each with your genotype result, risk grading (Good / Average / Poor), interpretation, and personalised recommendations.',
    groups: [
      {
        name: 'Panel 1 · Hormonal health',
        countLabel: '1 panel',
        items: [
          { label: 'Pituitary-Testicular Endocrine Function Risk / Testicular Atrophy' },
          { label: 'Genes tested: LOC108783645, HFE', isGene: true },
        ],
      },
      {
        name: 'Panel 2 · Fertility',
        countLabel: '1 panel',
        items: [
          { label: 'Abnormal Reproductive Function Risk / Male Infertility (Azoospermia)' },
          { label: 'Gene tested: ART3', isGene: true },
        ],
      },
      {
        name: 'Panel 3 · Hair loss',
        countLabel: '1 panel',
        items: [
          { label: 'Risk of Spot Baldness in Males (Alopecia Areata)' },
          { label: 'Genes tested: AR (Androgen Receptor), LINC01432, C1orf127', isGene: true },
        ],
      },
    ],
    gradingTitle: 'Risk grading system',
    grading: [
      { status: 'good', label: 'Low/Normal risk', text: 'Your genetic predisposition is normal or low.' },
      { status: 'avg', label: 'Medium risk', text: 'Your genetic predisposition is average. Act as per recommendations.' },
      { status: 'risk', label: 'High risk', text: 'Your genetic predisposition is high. Act as per recommendations or consult your healthcare practitioner.' },
    ],
  },

  expertise: {
    eyebrow: 'Science & expertise',
    title: 'Backed by world-class genetic science',
    sub: 'Neotech World Lab follows the highest international standards for genetic testing, from sample collection to reporting.',
    bullets: [
      'Tests conducted on world-class infrastructure including Illumina NGS & iScan systems',
      'NABL accredited (ISO 15189) and ISO 9001:2015 and ISO 27001:2013 certified',
      'Follows Good Laboratory Practices (GLP) with chain-of-custody sample tracking',
      'Reporting as per FDA, CPIC, and ACMG guidelines',
    ],
    certifications: [
      { src: '/tests/certs/nabl.png', alt: 'NABL Accredited' },
      { src: '/tests/certs/iso-15189.png', alt: 'ISO 15189' },
      { src: '/tests/certs/iso-9001.png', alt: 'ISO 9001:2015' },
      { src: '/tests/certs/iso-27001.png', alt: 'ISO 27001:2013' },
      { src: '/tests/certs/illumina.png', alt: 'Illumina' },
      { src: '/tests/certs/glp.png', alt: 'Good Laboratory Practices' },
    ],
    experts: [
      {
        avatar: { type: 'initials', value: 'VS' },
        name: 'Dr. Varun Sharma, Ph.D',
        role: 'Scientist, Human Genetics',
        text: 'Every report manually reviewed before release. Illumina Infinium SNP array. Reproducibility >99%, call rate >98%.',
        lab: 'Neotech World Lab Pvt. Ltd., MG Road, Gurugram',
      },
      {
        avatar: { type: 'icon', value: 'lab' },
        name: 'NABL-Accredited Lab',
        role: 'Neotech World Lab Pvt. Ltd.',
        text: 'National Accreditation Board for Testing & Calibration Laboratories · Illumina Infinium SNP array platform · Call rate >98% · All results validated in-house.',
        lab: 'Gurugram, India',
      },
      {
        avatar: { type: 'icon', value: 'calendar-check' },
        name: '30-Min Free Counselling Session',
        role: 'Included with every report',
        text: 'One complimentary 30-minute session included with every report. Helps you understand your results and what to do next.',
        lab: 'Booked after report delivery',
      },
    ],
  },

  actionPlan: {
    eyebrow: 'After your results',
    title: 'Your results become your prevention plan',
    sub: "Results are not the end, they're the beginning. Here's what you can do with your Men's Health DNA report.",
    banner: {
      eyebrow: 'Know before you begin',
      text: 'The genetic context that matters most, before marriage, before family planning, before the conversations that count.',
      image: `${U}/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1400&q=80`,
      imageAlt: 'A couple planning their future together',
    },
    actions: [
      {
        icon: 'calendar-tasks',
        title: 'Get ahead, not behind',
        text: 'If your hormonal or fertility panel shows elevated risk, speak to a urologist or andrologist now, while you still have time to act preventively. Early consultation changes outcomes.',
      },
      {
        icon: 'partners',
        title: 'Plan with your partner',
        text: 'If you and your partner are planning to start a family, your fertility risk profile is one of the most valuable pieces of information you can have. Pair it with the Women’s Health report for a complete picture.',
      },
      {
        icon: 'nutrition',
        title: 'Eat for your hormonal health',
        text: 'Antioxidant-rich foods, fruits, vegetables, nuts, seeds, support testicular health. Biotin and Omega-3 sources, flax seeds, walnuts, chia seeds, support hair and reproductive function. Your report gives specific guidance.',
      },
      {
        icon: 'shield',
        title: 'The smart pre-matrimonial step',
        text: "Before marriage, before family planning, this report gives you and your future partner the genetic context that matters most. Pair with the Women's Health report for the complete 'Know Before You Begin' bundle.",
      },
    ],
  },

  midCta2: {
    text: "Getting married or planning a family? Consider the 'Know Before You Begin' bundle, Men's Health + Women's Health.",
    ctaLabel: "Get My Men's Health Report",
  },

  howItWorks: {
    eyebrow: 'How it works',
    title: "3 steps. That's it.",
    steps: [
      {
        num: '01',
        title: 'Order your kit online',
        text: 'Your at-home saliva collection kit is delivered to your door. Includes a pre-labelled sample tube, instructions, and a prepaid return courier. No hospital. No needle. Takes 2 minutes at home.',
        image: `${U}/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80`,
        imageAlt: 'An at-home test kit being opened',
      },
      {
        num: '02',
        title: 'Send it to the lab',
        text: "Drop the sealed kit with the prepaid courier pickup. NABL-accredited lab processes your sample using Illumina SNP genotyping. 99%+ reproducibility, >98% call rate. Every report reviewed by Dr. Varun Sharma's team before release.",
        image: `${U}/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80`,
        imageAlt: 'A genetics lab processing samples',
      },
      {
        num: '03',
        title: 'Get your results',
        text: 'Your Men’s Health DNA report is ready in 7 days and delivered digitally. Your complimentary 30-minute counselling session is booked after delivery, to walk you through every panel result in plain language, with clear next steps.',
        image: `${U}/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80`,
        imageAlt: 'A personalised report on a screen',
      },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Common questions',
    items: [
      {
        q: 'Do I need to be trying to have children to take this test?',
        a: "Not at all. This test is relevant for any man who wants to understand his hormonal health, fertility risk, and hair loss predisposition, whether he's planning a family now, in the future, or simply wants to know his genetic picture. Many men take it as part of a general health check or pre-marriage health screening.",
      },
      {
        q: 'What if my result shows high risk for infertility?',
        a: 'A high-risk result does not mean you are infertile, it means your genetic profile is associated with a higher statistical likelihood of certain reproductive challenges. A urologist or andrologist can confirm clinical status and advise on next steps, which may include a semen analysis or hormonal panel. Knowing early gives you the most options.',
      },
      {
        q: 'Is this test relevant for young men in their 20s?',
        a: "Yes, especially if you are planning to get married, start a family, or simply want to know your health risks early. Genetic predispositions don't have an age minimum. The earlier you know, the more you can do.",
      },
      {
        q: 'Is this a medical or diagnostic test?',
        a: 'No. This is a wellness report identifying genetic tendencies and predispositions. It does not diagnose any medical condition and is not a substitute for professional medical advice. Results should be discussed with a qualified healthcare professional before making clinical decisions.',
      },
      {
        q: "Can I take this alongside the Women's Health report for my partner?",
        a: "Yes, and we strongly recommend it for couples planning to start a family or preparing for marriage. The Men's Health + Women's Health combination is the core of our 'Know Before You Begin' pre-matrimonial bundle. One saliva kit each, one counselling session together.",
      },
      {
        q: 'How is my genetic data kept private?',
        a: 'Your data belongs only to you. KYG never sells, shares, or uses your genetic data for any purpose beyond generating your report. Your sample is destroyed after processing. Data is stored on encrypted servers with strict access controls.',
      },
    ],
  },

  bundlesSection: {
    items: [
      { dot: 'M', tag: 'Pre-Matrimonial', name: 'Know Before You Begin', desc: 'He + She + Counselling', theme: 'matri' },
      { dot: 'C', tag: 'Couples', name: "Couple's Blueprint", desc: 'Wellness + She + He', theme: 'couple' },
      { dot: 'W', tag: 'Lifestyle', name: 'Add Wellness', desc: 'Diet + Weight + Fitness + Detox', theme: 'wellness' },
      { dot: 'U', tag: 'Ultimate', name: 'The Complete You', desc: 'All reports', theme: 'ultimate' },
    ],
  },

  bottomCta: {
    title: 'Know your health before it becomes a headline.',
    sub: ' 3 clinical panels. One saliva kit. The genetic picture every man should have before the conversations that matter most.',
    ctaLabel: "Get My Men's Health Report",
    nudge:
      "Getting married or planning a family? Consider the 'Know Before You Begin' bundle, Men's Health + Women's Health. →",
    trust:
      'At-home saliva kit &nbsp;·&nbsp; Neotech World Lab &nbsp;·&nbsp; Results in 7 days &nbsp;·&nbsp; 30-min free counselling included',
  },
};

export const TESTS: Test[] = [mensHealth];

// -----------------------------------------------------------------------------
// Lookup helpers (used by the route segment)
// -----------------------------------------------------------------------------
export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getTest(categorySlug: string, testSlug: string): Test | undefined {
  return TESTS.find((t) => t.categorySlug === categorySlug && t.slug === testSlug);
}

/** Every valid /[category_slug]/[test_slug] combination, for static generation. */
export function allTestParams(): { category_slug: string; test_slug: string }[] {
  return TESTS.map((t) => ({ category_slug: t.categorySlug, test_slug: t.slug }));
}
