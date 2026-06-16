// =============================================================================
// (tests) route data layer
// -----------------------------------------------------------------------------
// Every test-detail page at /[category_slug]/[test_slug] is rendered purely from
// the data declared here. To publish a new page you add a `Test` (and, for a new
// group, a `Category`) — no JSX changes required.
//
// The shared chrome (header + sidebar + footer) lives in the category-level
// layout, so navigating between sibling reports only swaps the page content.
// The sidebar is driven by `Category.sidebar`; per-report accent by `Test.accent`.
// =============================================================================

/** Risk grade used by result cards, status rows and the grading legend. */
export type RiskStatus = 'good' | 'avg' | 'risk';

/** Accent palette for a report, injected as CSS variables on the shell so each
 *  report themes itself (Diet = teal, Weight = blue, Fitness = purple, …). */
export interface AccentPalette {
  c50: string;
  c100: string;
  c500: string;
  c700: string;
}

/** Bundle card, reused by the sidebar and the Bundles section. */
export interface Bundle {
  dot: string;
  tag: string;
  name: string;
  desc: string;
  theme: 'wellness' | 'couple' | 'matri' | 'ultimate';
}

/** A sidebar nav link — `href` starting with '#' is an in-page anchor
 *  (scroll-spy highlight); anything else is a route (active when it matches the
 *  current path). */
export interface SidebarLink {
  dot: string;
  name: string;
  meta?: string;
  href: string;
}

/** A sidebar group is either a list of links or a stack of bundle cards. */
export type SidebarGroup =
  | { kind: 'links'; title: string; links: SidebarLink[] }
  | { kind: 'cards'; title: string; cards: Bundle[] };

export interface HeroStat {
  num: string;
  label: string;
}

/** The mini "result"/"viz" panel that sits beside each discover card. */
export type PanelViz =
  | {
      kind: 'result';
      name: string;
      status: RiskStatus;
      statusLabel: string;
      genes: string;
      interpretation: string;
      recommendation: string;
    }
  | { kind: 'rows'; rows: { label: string; status: RiskStatus; statusLabel: string }[]; note?: string }
  | { kind: 'bars'; bars: { label: string; level: string; percent: number; status: RiskStatus }[] }
  | { kind: 'pills'; pills: { label: string; status: 'good' | 'avg' }[]; note: string };

/** A discovery card. Most fields are optional so the same component renders both
 *  the men's-health gene panels and the wellness trait cards. */
export interface Panel {
  /** in-page anchor id (men's health), e.g. "panel-hormonal" */
  id?: string;
  number: string;
  title: string;
  text: string;
  explainer?: { head?: string; text: string };
  indiaNote?: { label: string; text: string };
  symptomsTitle?: string;
  symptoms?: string[];
  viz: PanelViz;
  /** when true the viz sits on the left (alternating layout) */
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

export interface SectionHead {
  eyebrow: string;
  title: string;
  sub?: string;
}

/** A category groups sibling reports and owns the shared sidebar + default accent. */
export interface Category {
  slug: string;
  name: string;
  accent: AccentPalette;
  sidebarEyebrow: string;
  sidebar: SidebarGroup[];
}

/** A test = one rendered page. All copy + imagery for the page content lives here. */
export interface Test {
  slug: string;
  categorySlug: string;
  /** overrides the category's default accent for this report */
  accent?: AccentPalette;

  seo: { title: string; description: string };

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
    imageTag?: string;
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

  report: SectionHead & { groups: PanelGroup[]; gradingTitle?: string; grading?: GradingRow[] };

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

  bottomCta: { title: string; sub: string; ctaLabel: string; nudge?: string; trust: string };
}

// Image CDN base used by the men's-health seed images.
const U = 'https://images.unsplash.com';

// Shared accent palettes.
const TEAL: AccentPalette = { c50: '#E6F4F1', c100: '#CDE9E4', c500: '#15605D', c700: '#0E4D4B' };

// =============================================================================
// Categories (own the shared sidebar + default accent)
// =============================================================================
export const CATEGORIES: Category[] = [
  {
    slug: 'mens-health',
    name: "Men's Health DNA",
    accent: TEAL,
    sidebarEyebrow: 'Your Reports',
    sidebar: [
      {
        kind: 'links',
        title: "Men's Health DNA",
        links: [
          { dot: 'H', name: 'Hormonal health', meta: 'Testicular function · HFE', href: '#panel-hormonal' },
          { dot: 'F', name: 'Fertility & reproduction', meta: 'Azoospermia risk · ART3', href: '#panel-fertility' },
          { dot: 'Hl', name: 'Hair loss risk', meta: 'Alopecia areata · AR gene', href: '#panel-hairloss' },
        ],
      },
      {
        kind: 'links',
        title: 'Pair With',
        links: [
          { dot: 'S', name: "Women's Health DNA", meta: 'For your partner', href: '#' },
          { dot: 'My', name: 'My Wellness', meta: 'Diet · Weight · Fitness · Detox', href: '/wellness/my-diet' },
        ],
      },
      {
        kind: 'cards',
        title: 'Bundles',
        cards: [
          {
            dot: 'M',
            tag: 'Pre-Matrimonial',
            name: 'Know Before You Begin',
            desc: 'He + She + Counselling',
            theme: 'matri',
          },
          { dot: 'C', tag: 'For Couples', name: "Couple's Blueprint", desc: 'Wellness + She + He', theme: 'couple' },
          { dot: 'U', tag: 'Ultimate', name: 'The Complete You', desc: 'All reports + Ancestry', theme: 'ultimate' },
        ],
      },
    ],
  },
  {
    slug: 'wellness',
    name: 'My Wellness',
    accent: TEAL,
    sidebarEyebrow: 'Your Reports',
    sidebar: [
      {
        kind: 'links',
        title: 'My Wellness',
        links: [
          { dot: 'M', name: 'My Diet DNA', meta: '20 traits', href: '/wellness/my-diet' },
          { dot: 'W', name: 'My Weight DNA', meta: '17 traits', href: '/wellness/my-weight' },
          { dot: 'F', name: 'My Fitness DNA', meta: '12 traits', href: '/wellness/my-fitness' },
          { dot: 'D', name: 'My Detox DNA', meta: '3 traits', href: '/wellness/my-detox' },
        ],
      },
      {
        kind: 'cards',
        title: 'Wellness Bundles',
        cards: [
          {
            dot: 'W',
            tag: 'Best Value',
            name: 'All 4 Wellness reports',
            desc: 'Diet + Weight + Fitness + Detox',
            theme: 'wellness',
          },
        ],
      },
      {
        kind: 'links',
        title: 'Also Consider',
        links: [
          { dot: 'S', name: "Women's Health DNA", meta: '5 clinical panels', href: '#' },
          { dot: 'M', name: "Men's Health DNA", meta: '3 clinical panels', href: '/mens-health/mens-health-dna' },
        ],
      },
      {
        kind: 'cards',
        title: 'Complete Packages',
        cards: [
          { dot: 'C', tag: 'For Couples', name: "Couple's Blueprint", desc: 'Wellness + She + He', theme: 'couple' },
          {
            dot: 'M',
            tag: 'Pre-Matrimonial',
            name: 'Know Before You Begin',
            desc: 'She + He + Counselling',
            theme: 'matri',
          },
          { dot: 'U', tag: 'Ultimate', name: 'The Complete You', desc: 'All reports + Ancestry', theme: 'ultimate' },
        ],
      },
    ],
  },
];

// =============================================================================
// Tests
// =============================================================================
const mensHealth: Test = {
  slug: 'mens-health-dna',
  categorySlug: 'mens-health',

  seo: {
    title: "Men's Health DNA · KYG · Know Your Genes",
    description:
      'Fertility, hormones, hair loss. Three areas of men’s health with a strong genetic component. Know your risk before it becomes your reality.',
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
    quoteLead: '"1 in 8 couples struggle to conceive. In nearly half of those cases, the issue is on the man’s side. ',
    quoteEmphasis: 'Most men never find out why.',
    quoteTail: '"',
    body: 'Men are statistically less likely to get health tests, less likely to visit a doctor for preventive care, and far less likely to discuss reproductive or hormonal health. Yet male fertility, testicular function, and hair loss are all significantly influenced by genetics. This test gives you the information you need, before a problem becomes a crisis.',
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
        viz: {
          kind: 'result',
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
        viz: {
          kind: 'result',
          name: 'Abnormal Reproductive Function Risk / Male Infertility',
          status: 'good',
          statusLabel: 'Good',
          genes: 'Gene: ART3',
          interpretation: 'Your genotype is associated with normal risk of azoospermia in males.',
          recommendation: 'Eat a healthy and balanced diet. Maintain ideal body weight. Exercise regularly.',
        },
        flip: true,
      },
      {
        id: 'panel-hairloss',
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
        viz: {
          kind: 'result',
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
      {
        status: 'avg',
        label: 'Medium risk',
        text: 'Your genetic predisposition is average. Act as per recommendations.',
      },
      {
        status: 'risk',
        label: 'High risk',
        text: 'Your genetic predisposition is high. Act as per recommendations or consult your healthcare practitioner.',
      },
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
      {
        dot: 'M',
        tag: 'Pre-Matrimonial',
        name: 'Know Before You Begin',
        desc: 'He + She + Counselling',
        theme: 'matri',
      },
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

// Local image base for the wellness reports (downloaded from Figma).
const DIET = '/tests/wellness/my-diet';

const myDiet: Test = {
  slug: 'my-diet',
  categorySlug: 'wellness',

  seo: {
    title: 'My Diet DNA · KYG · Know Your Genes',
    description:
      'Your genes control how you absorb vitamins and respond to carbs, fat, lactose, gluten and caffeine. Stop following generic plans. Start eating for your DNA.',
  },

  hero: {
    badge: 'My Diet DNA',
    titleLead: 'Same diet. ',
    titleHighlight: 'Different bodies.',
    titleTail: " Here's why.",
    sub: 'Your genes control how you absorb vitamins, respond to carbs and fat, and react to lactose, gluten, and caffeine. Stop following generic plans. Start eating for your DNA.',
    ctaLabel: 'Get My Diet DNA',
    trustHtml:
      'At-home saliva kit &nbsp;·&nbsp; No needles &nbsp;·&nbsp; Data private &nbsp;·&nbsp; <b>30 min free counselling session</b>',
    image: `${DIET}/hero.png`,
    imageAlt: 'A vibrant bowl of fresh, colourful wholefoods',
    imageTag: 'Eat for your genotype',
    stats: [
      { num: '20', label: 'Traits tested' },
      { num: 'NABL', label: 'Accredited lab' },
      { num: '99%+', label: 'Accuracy' },
      { num: '7 days', label: 'Turnaround' },
    ],
  },

  myth: {
    label: 'The truth most diets ignore',
    quoteLead: '"Aapka diet fail nahi hua. ',
    quoteEmphasis: 'Aapka genotype tha.',
    quoteTail: '"',
    body: 'Generic diets are designed for a generic body. But your body is not generic. How you absorb Vitamin D, whether lactose slows you down, how your liver handles caffeine, and all of it is written in your DNA. This test reads it.',
    image: `${DIET}/myth.png`,
    imageAlt: 'Two different plates of food side by side',
  },

  discover: {
    eyebrow: "What you'll discover",
    title: 'Four things your diet plan is missing',
    sub: 'Each insight area comes with your genetic result, a plain-language interpretation, and actionable recommendations.',
    panels: [
      {
        number: '01',
        title: 'Your micronutrient blueprint',
        text: 'Covers 12 vitamins and minerals, from Vitamin A to Omega-3. Find out which nutrients your body genetically struggles to absorb, so you can supplement or eat accordingly. No more guessing which vitamins you actually need.',
        viz: {
          kind: 'rows',
          rows: [
            { label: 'Vitamin D', status: 'good', statusLabel: 'Good' },
            { label: 'Vitamin B12', status: 'avg', statusLabel: 'Average' },
            { label: 'Iron absorption', status: 'risk', statusLabel: 'High risk' },
            { label: 'Omega-3', status: 'good', statusLabel: 'Good' },
            { label: 'Calcium', status: 'avg', statusLabel: 'Average' },
          ],
        },
      },
      {
        number: '02',
        title: 'Roti, rice, or ghee: what actually works for you',
        text: "Your carbohydrate sensitivity gene determines whether India's high-carb diet works for or against your body. Your fat metabolism type tells you which oils and fats suit you. Real Indian food, decoded through your genetics.",
        viz: {
          kind: 'bars',
          bars: [
            { label: 'Carbohydrate sensitivity', level: 'High', percent: 82, status: 'risk' },
            { label: 'Saturated fat response', level: 'Moderate', percent: 52, status: 'avg' },
            { label: 'Polyunsaturated fat', level: 'Low', percent: 28, status: 'good' },
          ],
        },
        flip: true,
      },
      {
        number: '03',
        title: 'What your body is quietly rejecting',
        text: 'Over 60% of South Asians carry a lactose intolerance gene variant, yet most never find out. Salt sensitivity is a leading genetic risk factor for hypertension in India. Caffeine metabolism explains why chai affects different people differently. Now you’ll know your position on all four.',
        viz: {
          kind: 'rows',
          rows: [
            { label: 'Lactose intolerance', status: 'risk', statusLabel: 'High risk' },
            { label: 'Gluten sensitivity', status: 'good', statusLabel: 'Good' },
            { label: 'Caffeine sensitivity', status: 'avg', statusLabel: 'Average' },
            { label: 'Salt sensitivity', status: 'risk', statusLabel: 'High risk' },
          ],
        },
      },
      {
        number: '04',
        title: 'Your personalised diet action plan',
        text: 'Every insight comes with a specific recommendation: which foods to prioritise, which to limit, which supplements to consider. Not generic advice. Your plan, based on your genes.',
        viz: {
          kind: 'pills',
          pills: [
            { label: 'Low carb', status: 'good' },
            { label: 'High protein', status: 'avg' },
          ],
          note: 'Based on your carb sensitivity and fat response, a lower-carb, higher-protein diet is recommended. Limit dairy. Increase leafy greens for calcium.',
        },
        flip: true,
      },
    ],
  },

  midCta1: { text: 'Ready to see your own results? It starts with one saliva kit.', ctaLabel: 'Get My Diet DNA' },

  report: {
    eyebrow: 'Full report contents',
    title: 'Every trait covered',
    sub: '20 traits across 3 categories. Each with a genotype result, interpretation, and recommendations.',
    groups: [
      {
        name: 'Nutrition profile: Micronutrients',
        countLabel: '12 traits',
        items: [
          { label: 'Vitamin A' },
          { label: 'Vitamin B6' },
          { label: 'Vitamin B9' },
          { label: 'Vitamin B12' },
          { label: 'Vitamin C' },
          { label: 'Vitamin D' },
          { label: 'Vitamin E' },
          { label: 'Vitamin K' },
          { label: 'Calcium' },
          { label: 'Magnesium' },
          { label: 'Iron' },
          { label: 'Omega-3' },
        ],
      },
      {
        name: 'Macro nutrient response',
        countLabel: '4 traits',
        items: [
          { label: 'Carbohydrate response' },
          { label: 'Saturated fat response' },
          { label: 'Monounsaturated fat response' },
          { label: 'Polyunsaturated fat response' },
        ],
      },
      {
        name: 'Food sensitivity & intolerances',
        countLabel: '4 traits',
        items: [
          { label: 'Lactose intolerance' },
          { label: 'Caffeine sensitivity' },
          { label: 'Salt sensitivity' },
          { label: 'Gluten intolerance' },
        ],
      },
    ],
  },

  expertise: {
    eyebrow: 'Science & expertise',
    title: 'Backed by world-class genetic science',
    sub: 'KnowYourGenes follows the highest international standards for genetic testing, from sample collection to reporting.',
    bullets: [
      'Tests conducted on world-class infrastructure including Illumina NGS & iScan systems',
      'NABL accredited (ISO 15189) and ISO 9001:2015 and ISO 27001:2013 certified',
      'Follows Good Laboratory Practices (GLP) with chain-of-custody sample tracking',
      'Reporting as per FDA, CPIC, and ACMG guidelines',
    ],
    certifications: [
      { src: `${DIET}/certs/nabl.png`, alt: 'NABL India' },
      { src: `${DIET}/certs/fda.png`, alt: 'FDA' },
      { src: `${DIET}/certs/hipaa.png`, alt: 'HIPAA' },
      { src: `${DIET}/certs/iso-15189.png`, alt: 'ISO 15189' },
      { src: `${DIET}/certs/iso-9001.png`, alt: 'ISO 9001' },
    ],
    experts: [
      {
        avatar: { type: 'initials', value: 'VS' },
        name: 'Dr. Varun Sharma, Ph.D',
        role: 'Scientist, Human Genetics',
        text: "Every report is manually reviewed by Dr. Sharma's team before release. Illumina Infinium SNP array platform. Reproducibility >99%, call rate >98%.",
        lab: 'Neotech World Lab Pvt. Ltd., MG Road, Gurugram',
      },
      {
        avatar: { type: 'icon', value: 'lab' },
        name: 'NABL-Accredited Lab',
        role: 'Neotech World Lab Pvt. Ltd.',
        text: 'National Accreditation Board for Testing & Calibration Laboratories. Illumina Infinium SNP array platform. Call rate >98%. All results validated in-house.',
        lab: 'Gurugram, India',
      },
      {
        avatar: { type: 'icon', value: 'calendar-check' },
        name: '30-Min Free Counselling',
        role: 'Included with every report',
        text: 'One complimentary 30-minute session included with every report. Helps you understand your results and what to do next.',
        lab: 'Booked after report delivery',
      },
    ],
  },

  actionPlan: {
    eyebrow: 'After your results',
    title: 'Your DNA insights become your action plan',
    sub: "Results are not the end. They're the beginning. Here's what you can do with your Diet DNA report.",
    banner: {
      eyebrow: 'Your plan, your kitchen',
      text: 'Turn genetic insight into the food on your plate: supplements that fill real gaps, meals built around how your body actually responds.',
      image: `${DIET}/banner.png`,
      imageAlt: 'A person preparing a fresh, colourful home-cooked meal',
    },
    actions: [
      {
        icon: 'nutrition',
        title: 'Redesign your meals',
        text: 'Build a daily eating plan around what your genes say works, not what a generic app suggests.',
      },
      {
        icon: 'shield',
        title: 'Choose the right supplements',
        text: "Stop buying supplements you don't need. Your micronutrient profile tells you exactly where the gaps are.",
      },
      {
        icon: 'partners',
        title: 'Brief your dietitian',
        text: "Share your report with a nutritionist or doctor to build a plan that's medically and genetically aligned.",
      },
      {
        icon: 'calendar-check',
        title: 'Lifetime access',
        text: "Your genes don't change. Access your report anytime, share it with new health professionals, revisit as your goals evolve.",
      },
    ],
  },

  midCta2: { text: 'One test. A lifetime of eating right for your body.', ctaLabel: 'Get My Diet DNA' },

  howItWorks: {
    eyebrow: 'How it works',
    title: "3 steps. That's it.",
    steps: [
      {
        num: '01',
        title: 'Order your kit online',
        text: 'Your at-home saliva collection kit is delivered to your door. Includes a pre-labelled sample tube, instructions, and a prepaid return courier. No hospital. No doctor visit. Takes 2 minutes at home.',
        image: `${DIET}/step-1.png`,
        imageAlt: 'An at-home test kit being opened',
      },
      {
        num: '02',
        title: 'Send it to the lab',
        text: 'Drop the sealed kit with the prepaid courier pickup. Our NABL-accredited lab processes your sample using Illumina SNP genotyping. 99%+ reproducibility, >98% call rate.',
        image: `${DIET}/step-2.png`,
        imageAlt: 'A genetics lab processing samples',
      },
      {
        num: '03',
        title: 'Get your results',
        text: 'Your detailed Diet DNA report is ready in 7 days and delivered digitally. Your complimentary 30-minute counselling session is booked after delivery to walk you through every insight, in plain language, no jargon.',
        image: `${DIET}/step-3.png`,
        imageAlt: 'A personalised report on a screen',
      },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Common questions',
    items: [
      {
        q: 'Do I need to be unwell or have health problems to take this test?',
        a: 'Not at all. This is a preventive wellness test for anyone who wants to eat smarter. It reveals how your body is genetically wired to handle nutrients, carbs, fats, and common triggers like lactose and caffeine, so you can optimise your diet long before any problem appears.',
      },
      {
        q: 'Is this a medical or diagnostic test?',
        a: 'No. This is a wellness report that identifies genetic tendencies, not a diagnosis. It does not diagnose or treat any medical condition and is not a substitute for professional medical advice. Discuss any results with a qualified healthcare professional before making clinical decisions.',
      },
      {
        q: "I'm vegetarian. Will the recommendations work for me?",
        a: 'Yes. Your recommendations are based on your genetics, not a fixed meal plan, and can be applied to any diet, vegetarian, vegan, or non-vegetarian. The report flags which nutrients you may struggle to absorb so you can choose the right sources or supplements.',
      },
      {
        q: "My genes don't change, so why take this test now?",
        a: "Exactly because they don't change, the insights are useful for life. The sooner you know how your body responds to food, the sooner you can stop wasting effort on diets that don't suit you. One test informs every food decision you make from here on.",
      },
      {
        q: 'Can I buy just this one report, or do I need the full Wellness pack?',
        a: 'You can buy My Diet DNA on its own. If you also want your weight, fitness, and detox insights, the All-4 Wellness bundle covers every report from a single saliva sample and works out cheaper than buying them individually.',
      },
      {
        q: 'How is my genetic data kept private?',
        a: 'Your data belongs only to you. KYG never sells, shares, or uses your genetic data for any purpose beyond generating your report. Your sample is destroyed after processing, and data is stored on encrypted servers with strict access controls.',
      },
    ],
  },

  bundlesSection: {
    items: [
      { dot: 'W', tag: 'Wellness', name: 'All 4 Wellness', desc: 'Diet + Weight + Fitness + Detox', theme: 'wellness' },
      { dot: 'C', tag: 'Couples', name: "Couple's Blueprint", desc: 'Wellness + She + He', theme: 'couple' },
      {
        dot: 'M',
        tag: 'Pre-Matrimonial',
        name: 'Know Before You Begin',
        desc: 'She + He + Counselling',
        theme: 'matri',
      },
      { dot: 'U', tag: 'Ultimate', name: 'The Complete You', desc: 'All reports + Ancestry', theme: 'ultimate' },
    ],
  },

  bottomCta: {
    title: 'Ready to stop guessing?',
    sub: '20 dietary insights. One saliva kit. A lifetime of eating right for your body.',
    ctaLabel: 'Get My Diet DNA',
    trust:
      'At-home saliva kit &nbsp;·&nbsp; Neotech World Lab &nbsp;·&nbsp; Results in 7 days &nbsp;·&nbsp; <b>30-min free counselling included</b>',
  },
};

// Per-report accents (from the homepage wellness tokens).
const WEIGHT_ACCENT: AccentPalette = { c50: '#E5EFFA', c100: '#D0E2F7', c500: '#1F62B8', c700: '#154A8E' };
const FITNESS_ACCENT: AccentPalette = { c50: '#ECEAFC', c100: '#DCD8FB', c500: '#6F61E8', c700: '#4E40C2' };
const DETOX_ACCENT: AccentPalette = { c50: '#FAEBD9', c100: '#F5D7B0', c500: '#B66B16', c700: '#8B4F0E' };

const WEIGHT = '/tests/wellness/my-weight';
const FITNESS = '/tests/wellness/my-fitness';
const DETOX = '/tests/wellness/my-detox';

// Shared building blocks reused across the wellness reports.
const WELLNESS_BULLETS = [
  'Tests conducted on world-class infrastructure including Illumina NGS & iScan systems',
  'NABL accredited (ISO 15189) and ISO 9001:2015 and ISO 27001:2013 certified',
  'Follows Good Laboratory Practices (GLP) with chain-of-custody sample tracking',
  'Reporting as per FDA, CPIC, and ACMG guidelines',
];
const wellnessExperts = (): Expert[] => [
  {
    avatar: { type: 'initials', value: 'VS' },
    name: 'Dr. Varun Sharma, Ph.D',
    role: 'Scientist, Human Genetics',
    text: "Every report is manually reviewed by Dr. Sharma's team before release. Illumina Infinium SNP array platform. Reproducibility >99%, call rate >98%.",
    lab: 'Neotech World Lab Pvt. Ltd., MG Road, Gurugram',
  },
  {
    avatar: { type: 'icon', value: 'lab' },
    name: 'NABL-Accredited Lab',
    role: 'Neotech World Lab Pvt. Ltd.',
    text: 'National Accreditation Board for Testing & Calibration Laboratories. Illumina Infinium SNP array platform. Call rate >98%. All results validated in-house.',
    lab: 'Gurugram, India',
  },
  {
    avatar: { type: 'icon', value: 'calendar-check' },
    name: '30-Min Free Counselling',
    role: 'Included with every report',
    text: 'One complimentary 30-minute session included with every report. Helps you understand your results and what to do next.',
    lab: 'Booked after report delivery',
  },
];
const wellnessCerts = (dir: string) => [
  { src: `${dir}/certs/nabl.png`, alt: 'NABL India' },
  { src: `${dir}/certs/fda.png`, alt: 'FDA' },
  { src: `${dir}/certs/hipaa.png`, alt: 'HIPAA' },
  { src: `${dir}/certs/iso-15189.png`, alt: 'ISO 15189' },
  { src: `${dir}/certs/iso-9001.png`, alt: 'ISO 9001' },
];
const wellnessSteps = (dir: string): Step[] => [
  {
    num: '01',
    title: 'Order your kit online',
    text: 'Your at-home saliva collection kit is delivered to your door. Includes a pre-labelled sample tube, instructions, and a prepaid return courier. No hospital. No doctor visit. Takes 2 minutes at home.',
    image: `${dir}/step-1.png`,
    imageAlt: 'An at-home test kit being opened',
  },
  {
    num: '02',
    title: 'Send it to the lab',
    text: 'Drop the sealed kit with the prepaid courier pickup. Our NABL-accredited lab processes your sample using Illumina SNP genotyping. 99%+ reproducibility, >98% call rate.',
    image: `${dir}/step-2.png`,
    imageAlt: 'A genetics lab processing samples',
  },
  {
    num: '03',
    title: 'Get your results',
    text: 'Your report is ready in 7 days and delivered digitally. Your complimentary 30-minute counselling session is booked after delivery to walk you through every insight, in plain language, no jargon.',
    image: `${dir}/step-3.png`,
    imageAlt: 'A personalised report on a screen',
  },
];
const wellnessBundleCards: Bundle[] = [
  { dot: 'W', tag: 'Wellness', name: 'All 4 Wellness', desc: 'Diet + Weight + Fitness + Detox', theme: 'wellness' },
  { dot: 'C', tag: 'Couples', name: "Couple's Blueprint", desc: 'Wellness + She + He', theme: 'couple' },
  { dot: 'M', tag: 'Pre-Matrimonial', name: 'Know Before You Begin', desc: 'She + He + Counselling', theme: 'matri' },
  { dot: 'U', tag: 'Ultimate', name: 'The Complete You', desc: 'All reports + Ancestry', theme: 'ultimate' },
];

const myWeight: Test = {
  slug: 'my-weight',
  categorySlug: 'wellness',
  accent: WEIGHT_ACCENT,
  seo: {
    title: 'My Weight DNA · KYG · Know Your Genes',
    description:
      'Weight gain, fat storage, eating behaviour and insulin sensitivity are largely written in your DNA. Stop blaming willpower. Start understanding your biology.',
  },
  hero: {
    badge: 'My Weight DNA',
    titleLead: '',
    titleHighlight: "Your diet didn't fail. Your plan didn't match your genes.",
    titleTail: '',
    sub: 'Weight gain, fat storage, eating behaviour, and insulin sensitivity are largely written in your DNA. Stop blaming willpower. Start understanding your biology.',
    ctaLabel: 'Get My Weight DNA',
    trustHtml:
      'At-home saliva kit &nbsp;·&nbsp; No needles &nbsp;·&nbsp; Data private &nbsp;·&nbsp; <b>30 min free counselling session</b>',
    image: `${WEIGHT}/hero.png`,
    imageAlt: 'A vibrant bowl of fresh, colourful wholefoods',
    stats: [
      { num: '17', label: 'Traits tested' },
      { num: 'NABL', label: 'Accredited lab' },
      { num: '99%+', label: 'Accuracy' },
      { num: '7 days', label: 'Turnaround' },
    ],
  },
  myth: {
    label: 'The truth about weight most people miss',
    quoteLead: '"Weight regain after dieting is 60% genetic. It’s not weakness, ',
    quoteEmphasis: 'it’s biology.',
    quoteTail: '"',
    body: 'If you’ve lost weight and gained it back, your genes may be working against your plan. Insulin sensitivity, fat storage tendency, eating behaviour, satiety response, all of these are encoded in your DNA. Knowing yours changes everything about how you approach food and weight.',
    image: `${WEIGHT}/myth.png`,
    imageAlt: 'Two different plates of food side by side',
  },
  discover: {
    eyebrow: "What you'll discover",
    title: 'Four weight insights most plans ignore',
    sub: 'Each insight comes with your genetic result, a plain-language interpretation, and actionable recommendations.',
    panels: [
      {
        number: '01',
        title: 'Your weight management profile',
        text: 'Covers your genetic predisposition to obesity, how your body stores fat, your insulin sensitivity, and whether your body is likely to regain weight after dieting. This is the data that explains why some people gain weight easily even on controlled diets, and why others don’t.',
        viz: {
          kind: 'rows',
          rows: [
            { label: 'Obesity predisposition', status: 'avg', statusLabel: 'Average' },
            { label: 'Fat storage', status: 'risk', statusLabel: 'High risk' },
            { label: 'Insulin sensitivity', status: 'risk', statusLabel: 'High risk' },
            { label: 'Weight regain risk', status: 'avg', statusLabel: 'Average' },
          ],
        },
      },
      {
        number: '02',
        title: 'Why you eat the way you eat',
        text: 'Your satiety gene determines how quickly you feel full, and how long it lasts. Sweet perception explains why some people find sugar irresistible. Snacking behaviour and binge eating tendency are both influenced by specific gene variants. Understanding yours means you can build habits that work with your biology, not against it.',
        flip: true,
        viz: {
          kind: 'bars',
          bars: [
            { label: 'Binge eating tendency', level: 'Average', percent: 55, status: 'avg' },
            { label: 'Sweet perception', level: 'High', percent: 75, status: 'avg' },
            { label: 'Satiety response', level: 'Poor', percent: 35, status: 'risk' },
            { label: 'Snacking behaviour', level: 'High risk', percent: 82, status: 'risk' },
          ],
        },
      },
      {
        number: '03',
        title: 'Your cholesterol and lipid picture',
        text: 'India has one of the highest rates of cardiovascular disease globally, and Indian genetics carry specific lipid risk variants. Your genetic lipid profile tells you your predisposition to elevated LDL, triglycerides, and HDL levels, so you can take preventive action long before a blood test shows a problem.',
        viz: {
          kind: 'rows',
          rows: [
            { label: 'Elevated LDL', status: 'risk', statusLabel: 'High risk' },
            { label: 'Elevated triglycerides', status: 'avg', statusLabel: 'Average' },
            { label: 'HDL cholesterol level', status: 'good', statusLabel: 'Good' },
            { label: 'Fasting serum triacylglycerol', status: 'avg', statusLabel: 'Average' },
          ],
        },
      },
      {
        number: '04',
        title: 'Your personalised weight action plan',
        text: 'Every result comes with a specific recommendation, what to eat, what to avoid, which habits to build, which to break. Designed by genetic and nutrition experts. Not a generic calorie plan. A weight strategy built for your DNA.',
        flip: true,
        viz: {
          kind: 'pills',
          pills: [
            { label: 'Low carb', status: 'good' },
            { label: 'High protein', status: 'avg' },
          ],
          note: 'Based on your insulin sensitivity and fat-storage genetics, a lower-carb, higher-protein approach with structured meal timing is recommended. Build habits around your satiety response rather than fighting it.',
        },
      },
    ],
  },
  midCta1: { text: 'Ready to see your own results? It starts with one saliva kit.', ctaLabel: 'Get My Weight DNA' },
  report: {
    eyebrow: 'Full report contents',
    title: 'Every trait covered',
    sub: '17 traits across 3 categories. Each with a genotype result, interpretation, and recommendations.',
    groups: [
      {
        name: 'Weight management',
        countLabel: '8 traits',
        items: [
          { label: 'Obesity predisposition' },
          { label: 'Response to dieting' },
          { label: 'Adiponectin levels' },
          { label: 'Waist circumference response' },
          { label: 'Weight regain risk' },
          { label: 'Fat storage' },
          { label: 'Insulin sensitivity' },
          { label: 'Cellulite disposition' },
        ],
      },
      {
        name: 'Eating behaviour',
        countLabel: '5 traits',
        items: [
          { label: 'Binge eating tendency' },
          { label: 'Sweet perception' },
          { label: 'Bitter taste perception' },
          { label: 'Satiety response' },
          { label: 'Snacking behaviour' },
        ],
      },
      {
        name: 'Genetic lipid profile',
        countLabel: '4 traits',
        items: [
          { label: 'Elevated LDL' },
          { label: 'Elevated triglycerides' },
          { label: 'Fasting serum triacylglycerol' },
          { label: 'Higher HDL cholesterol' },
        ],
      },
    ],
  },
  expertise: {
    eyebrow: 'Science & expertise',
    title: 'Backed by world-class genetic science',
    sub: 'KnowYourGenes follows the highest international standards for genetic testing, from sample collection to reporting.',
    bullets: WELLNESS_BULLETS,
    certifications: wellnessCerts(WEIGHT),
    experts: wellnessExperts(),
  },
  actionPlan: {
    eyebrow: 'After your results',
    title: 'Your DNA insights become your weight action plan',
    sub: 'Results are not the end, they’re the beginning. Here’s what you can do with your Weight DNA report.',
    banner: {
      eyebrow: 'Your plan, your kitchen',
      text: 'Turn genetic insight into the food on your plate: supplements that fill real gaps, meals built around how your body actually responds.',
      image: `${WEIGHT}/banner.png`,
      imageAlt: 'A person preparing a fresh, colourful home-cooked meal',
    },
    actions: [
      {
        icon: 'calendar-tasks',
        title: 'Build a plan that matches your metabolism',
        text: 'Work with a nutritionist to design a caloric and macro plan that accounts for your insulin sensitivity and fat-storage genetics.',
      },
      {
        icon: 'nutrition',
        title: 'Understand your eating triggers',
        text: 'Knowing your satiety response and snacking tendency helps you plan meals and timing that reduce cravings rather than fight them.',
      },
      {
        icon: 'shield',
        title: 'Get ahead of cholesterol',
        text: 'Share your lipid profile results with your doctor to inform preventive testing and dietary choices before it shows up in a blood test.',
      },
      {
        icon: 'calendar-check',
        title: 'Lifetime access',
        text: "Your genes don't change. Access your report anytime, share with new health professionals, revisit as your goals evolve.",
      },
    ],
  },
  midCta2: { text: 'One test. A lifetime of understanding your body and your weight.', ctaLabel: 'Get My Weight DNA' },
  howItWorks: { eyebrow: 'How it works', title: "3 steps. That's it.", steps: wellnessSteps(WEIGHT) },
  faq: {
    eyebrow: 'Questions',
    title: 'Common questions',
    items: [
      {
        q: 'I’ve tried every diet and nothing works, will this help?',
        a: 'Almost certainly. If diets keep failing, it’s often because they ignore how your body is genetically wired to store fat, respond to insulin, and feel full. This report shows you which strategies actually fit your biology, so you can stop cycling through plans that were never going to work for you.',
      },
      {
        q: 'Will this tell me my ideal weight?',
        a: 'It won’t give you a number on a scale, genetics don’t work that way. What it tells you is how your body manages weight: your predisposition to gain, how you store fat, your eating behaviour, and your insulin sensitivity, so you can build a realistic, sustainable plan around your actual biology.',
      },
      {
        q: 'I have thyroid issues, is this relevant?',
        a: 'Yes. This is a wellness report on genetic weight tendencies and is not a substitute for medical care. It complements managing a thyroid condition by revealing the genetic factors behind your weight and eating behaviour. Always discuss results with your doctor alongside your existing treatment.',
      },
      {
        q: 'Is this a diagnostic or medical test?',
        a: 'No. This is a wellness report identifying genetic tendencies, not a diagnosis. It does not diagnose or treat any medical condition and is not a substitute for professional medical advice. Discuss results with a qualified healthcare professional before making clinical decisions.',
      },
      {
        q: 'Can I buy just this report or do I need the full Wellness pack?',
        a: 'You can buy My Weight DNA on its own. If you also want your diet, fitness, and detox insights, the All-4 Wellness bundle covers every report from a single saliva sample and works out cheaper than buying them individually.',
      },
      {
        q: 'How is my genetic data kept private?',
        a: 'Your data belongs only to you. KYG never sells, shares, or uses your genetic data for any purpose beyond generating your report. Your sample is destroyed after processing, and data is stored on encrypted servers with strict access controls.',
      },
    ],
  },
  bundlesSection: { items: wellnessBundleCards },
  bottomCta: {
    title: 'Stop guessing. Start knowing.',
    sub: '17 weight insights. One saliva kit. A lifetime of understanding your body.',
    ctaLabel: 'Get My Weight DNA',
    trust:
      'At-home saliva kit &nbsp;·&nbsp; Neotech World Lab &nbsp;·&nbsp; Results in 7 days &nbsp;·&nbsp; <b>30-min free counselling included</b>',
  },
};

const myFitness: Test = {
  slug: 'my-fitness',
  categorySlug: 'wellness',
  accent: FITNESS_ACCENT,
  seo: {
    title: 'My Fitness DNA · KYG · Know Your Genes',
    description:
      'Your aerobic capacity, muscle recovery speed, injury risk, and response to strength vs cardio, all written in your DNA. Train smarter, not just harder.',
  },
  hero: {
    badge: 'My Fitness DNA',
    titleLead: '',
    titleHighlight: 'Sprinter ya marathon runner?',
    titleTail: ' Gym jaane se pehle, jaano.',
    sub: 'Your aerobic capacity, muscle recovery speed, injury risk, and response to strength vs cardio, all written in your DNA. Train smarter, not just harder.',
    ctaLabel: 'Get My Fitness DNA',
    trustHtml:
      'At-home saliva kit &nbsp;·&nbsp; No needles &nbsp;·&nbsp; Data private &nbsp;·&nbsp; <b>30 min free counselling session</b>',
    image: `${FITNESS}/hero.png`,
    imageAlt: 'An athlete training',
    stats: [
      { num: '12', label: 'Traits tested' },
      { num: 'NABL', label: 'Accredited lab' },
      { num: '99%+', label: 'Accuracy' },
      { num: '7 days', label: 'Turnaround' },
    ],
  },
  myth: {
    label: 'Why your gym routine might be working against you',
    quoteLead: '"Most people do the wrong kind of exercise for their genetic type, ',
    quoteEmphasis: 'and wonder why results don’t come.',
    quoteTail: '"',
    body: 'If you’re hitting the gym 5 days a week and still not seeing results, your training type may be the problem, not your effort. Your genes determine whether you respond better to endurance or power training, how fast your muscles recover, and how much your body is at risk of injury. This test tells you all of it.',
    image: `${FITNESS}/myth.png`,
    imageAlt: 'A person training in a gym',
  },
  discover: {
    eyebrow: "What you'll discover",
    title: 'Four fitness insights that change how you train',
    sub: 'Each insight comes with your genetic result, a plain-language interpretation, and actionable recommendations.',
    panels: [
      {
        number: '01',
        title: 'Your exercise response profile',
        text: 'Covers how your body responds to cardio, strength, aerobic, and anaerobic exercise. Includes your HDL cholesterol response to exercise and adrenaline response. Tells you which type of training your body is genetically primed for, and which you’ll always have to work harder at.',
        viz: {
          kind: 'rows',
          rows: [
            { label: 'Aerobic capacity', status: 'good', statusLabel: 'Good' },
            { label: 'Anaerobic capacity', status: 'avg', statusLabel: 'Average' },
            { label: 'Response to strength training', status: 'risk', statusLabel: 'Poor' },
            { label: 'Fat metabolism during exercise', status: 'good', statusLabel: 'Good' },
          ],
        },
      },
      {
        number: '02',
        title: 'Power vs endurance: what you’re built for',
        text: 'Your muscle fibre composition and aerobic vs anaerobic capacity determine whether you are genetically closer to a sprinter or a marathon runner. Most people spend years doing the wrong type of training. Knowing your profile means you stop fighting your biology and start working with it.',
        flip: true,
        viz: {
          kind: 'bars',
          bars: [
            { label: 'Aerobic (endurance)', level: 'High', percent: 80, status: 'good' },
            { label: 'Anaerobic (power)', level: 'Moderate', percent: 52, status: 'avg' },
            { label: 'Muscle recovery speed', level: 'Slow', percent: 35, status: 'risk' },
            { label: 'Strength training response', level: 'Low', percent: 30, status: 'risk' },
          ],
        },
      },
      {
        number: '03',
        title: 'Your injury and recovery risk',
        text: 'Certain gene variants increase susceptibility to specific injuries, Achilles tendon issues, ligament ruptures, and muscle tears are all partially genetic. Knowing your risk profile helps you warm up correctly, choose lower-risk exercises, and schedule recovery time that actually matches your body’s repair speed.',
        viz: {
          kind: 'rows',
          rows: [
            { label: 'Injury risk', status: 'avg', statusLabel: 'Average' },
            { label: 'Achilles tendinopathy risk', status: 'risk', statusLabel: 'High risk' },
            { label: 'Ligament rupture risk', status: 'avg', statusLabel: 'Average' },
            { label: 'Muscle injury recovery', status: 'good', statusLabel: 'Good' },
            { label: 'Oxidative stress', status: 'risk', statusLabel: 'High risk' },
          ],
        },
      },
      {
        number: '04',
        title: 'Your personalised training plan',
        text: 'Every result comes with a specific recommendation — which exercises suit your genetic type, how often to train, how to structure recovery, and what to watch out for. Designed by genetic and fitness experts. Not a generic plan. A training strategy built for your DNA.',
        flip: true,
        viz: {
          kind: 'pills',
          pills: [
            { label: 'Moderate weights', status: 'good' },
            { label: 'Endurance training', status: 'avg' },
          ],
          note: 'Your aerobic capacity is strong but recovery is slow. Prioritise steady-state cardio. Allow 48-72 hours between intense sessions. Avoid high-impact sports without proper Achilles warm-up.',
        },
      },
    ],
  },
  midCta1: { text: 'Ready to see your own results? It starts with one saliva kit.', ctaLabel: 'Get My Fitness DNA' },
  report: {
    eyebrow: 'Full report contents',
    title: 'Every trait covered',
    sub: '12 traits across 2 categories. Each with a genotype result, interpretation, and recommendations.',
    groups: [
      {
        name: 'Response to exercise',
        countLabel: '7 traits',
        items: [
          { label: 'BMI & waist circumference in response to exercise' },
          { label: 'Response to strength/resistance training' },
          { label: 'Adrenaline response' },
          { label: 'HDL cholesterol response to exercise' },
          { label: 'Fat metabolism during exercise' },
          { label: 'Aerobic capacity' },
          { label: 'Anaerobic capacity' },
        ],
      },
      {
        name: 'Injury & recovery',
        countLabel: '5 traits',
        items: [
          { label: 'Injury risk' },
          { label: 'Muscle injury recovery' },
          { label: 'Achilles tendinopathy risk' },
          { label: 'Oxidative stress' },
          { label: 'Ligament rupture risk' },
        ],
      },
    ],
  },
  expertise: {
    eyebrow: 'Science & expertise',
    title: 'Backed by world-class genetic science',
    sub: 'KnowYourGenes follows the highest international standards for genetic testing, from sample collection to reporting.',
    bullets: WELLNESS_BULLETS,
    certifications: wellnessCerts(FITNESS),
    experts: wellnessExperts(),
  },
  actionPlan: {
    eyebrow: 'After your results',
    title: 'Your DNA insights become your training plan',
    sub: 'Results are not the end, they’re the beginning. Here’s what you can do with your Fitness DNA report.',
    banner: {
      eyebrow: 'Your plan, your training',
      text: 'Turn genetic insight into the way you train: the right exercise type, the right intensity, and recovery timed to how your body actually repairs.',
      image: `${FITNESS}/banner.png`,
      imageAlt: 'A person preparing for a workout',
    },
    actions: [
      {
        icon: 'calendar-tasks',
        title: 'Choose the right training type',
        text: 'Build your workout programme around whether you’re genetically suited for endurance, power, or mixed training. Stop doing what doesn’t work for your body.',
      },
      {
        icon: 'shield',
        title: 'Train around your injury risks',
        text: 'If your Achilles or ligament risk is high, warm-up protocols and exercise selection become critical. Know before you get hurt.',
      },
      {
        icon: 'calendar-check',
        title: 'Schedule recovery correctly',
        text: 'Match rest days to your genetic recovery speed. Allowing the right gap between intense sessions is the difference between progress and burnout.',
      },
      {
        icon: 'partners',
        title: 'Brief your trainer',
        text: 'Share your report with a personal trainer or coach to build a programme designed specifically for your genetic fitness profile.',
      },
    ],
  },
  midCta2: { text: 'One test. A lifetime of training right for your body.', ctaLabel: 'Get My Fitness DNA' },
  howItWorks: { eyebrow: 'How it works', title: "3 steps. That's it.", steps: wellnessSteps(FITNESS) },
  faq: {
    eyebrow: 'Questions',
    title: 'Common questions',
    items: [
      {
        q: 'I don’t go to the gym, is this still useful?',
        a: 'Absolutely. The report tells you which kind of movement your body responds best to, endurance, strength, or a mix, and how quickly you recover. Whether you walk, cycle, do yoga, or play a sport, you’ll know how to train smarter and lower your injury risk.',
      },
      {
        q: 'Can a personal trainer use this report?',
        a: 'Yes, and many do. Share it with your trainer or coach and they can tailor your programme to your genetic exercise response, recovery speed, and injury risks, instead of using a one-size-fits-all plan.',
      },
      {
        q: 'What if my result says I’m not suited for a sport I love?',
        a: 'Genetics describe tendencies, not limits. A result simply tells you where you’ll have a natural advantage and where you’ll have to train smarter. You can absolutely keep doing what you love, you’ll just know how to train and recover for it more effectively.',
      },
      {
        q: 'Is this a medical or diagnostic test?',
        a: 'No. This is a wellness report identifying genetic tendencies, not a diagnosis. It does not diagnose or treat any medical condition and is not a substitute for professional medical advice. Discuss results with a qualified healthcare professional before making clinical decisions.',
      },
      {
        q: 'Can I buy just this report?',
        a: 'Yes. My Fitness DNA can be bought on its own. If you also want your diet, weight, and detox insights, the All-4 Wellness bundle covers every report from a single saliva sample and works out cheaper than buying them individually.',
      },
      {
        q: 'How is my genetic data kept private?',
        a: 'Your data belongs only to you. KYG never sells, shares, or uses your genetic data for any purpose beyond generating your report. Your sample is destroyed after processing, and data is stored on encrypted servers with strict access controls.',
      },
    ],
  },
  bundlesSection: { items: wellnessBundleCards },
  bottomCta: {
    title: 'Train smarter. Start today.',
    sub: '12 fitness insights. One saliva kit. A training plan that finally works for your body.',
    ctaLabel: 'Get My Fitness DNA',
    trust:
      'At-home saliva kit &nbsp;·&nbsp; Neotech World Lab &nbsp;·&nbsp; Results in 7 days &nbsp;·&nbsp; <b>30-min free counselling included</b>',
  },
};

const myDetox: Test = {
  slug: 'my-detox',
  categorySlug: 'wellness',
  accent: DETOX_ACCENT,
  seo: {
    title: 'My Detox DNA · KYG · Know Your Genes',
    description:
      "How well your liver eliminates toxins is largely genetic. In a country with India's pollution levels and food quality, this is not a luxury insight. It's essential.",
  },
  hero: {
    badge: 'My Detox DNA',
    titleLead: '',
    titleHighlight: 'Delhi ki hawa +',
    titleTail: ' aapke genes. Jaanna zaroori hai.',
    sub: "How well your liver eliminates fat-soluble and water-soluble toxins is largely genetic. In a country with India's pollution levels and food quality, this is not a luxury insight. It's essential.",
    ctaLabel: 'Get My Detox DNA',
    trustHtml:
      'At-home saliva kit &nbsp;·&nbsp; No needles &nbsp;·&nbsp; Data private &nbsp;·&nbsp; <b>30 min free counselling session</b>',
    image: `${DETOX}/hero.png`,
    imageAlt: 'A vibrant bowl of fresh, colourful wholefoods',
    stats: [
      { num: '3', label: 'Core traits tested' },
      { num: 'NABL', label: 'Accredited lab' },
      { num: '99%+', label: 'Accuracy' },
      { num: '7 days', label: 'Turnaround' },
    ],
  },
  myth: {
    label: 'What your body is dealing with, every single day',
    quoteLead: '"Poor detox genes + high pollution exposure = ',
    quoteEmphasis: 'compounding risk over time.',
    quoteTail: '"',
    body: 'Your body is exposed to hundreds of toxins daily, from the air you breathe, the food you eat, and the water you drink. How effectively your liver neutralises and eliminates these toxins is largely determined by your genetics. Two people in the same city, eating the same food, can have vastly different detox capacities. This test tells you yours.',
    image: `${DETOX}/myth.png`,
    imageAlt: 'A polluted city skyline',
  },
  discover: {
    eyebrow: "What you'll discover",
    title: 'Three things your body does, or struggles to do, every day',
    sub: 'Each insight comes with your genetic result, a plain-language interpretation, and actionable recommendations.',
    panels: [
      {
        number: '01',
        title: 'Fat-soluble toxin clearance',
        text: "Fat-soluble toxins, including pesticides, heavy metals, and many industrial chemicals, are stored in body fat and require specific liver pathways to eliminate. Your genetic variant determines how efficient this process is. India's high pesticide residue levels in food make this particularly relevant.",
        viz: {
          kind: 'rows',
          rows: [{ label: 'Fat-soluble toxin clearance', status: 'risk', statusLabel: 'High risk' }],
          note: 'Your gene variant is associated with reduced ability to eliminate fat-soluble toxins including pesticides, heavy metals, and environmental pollutants stored in fatty tissues.',
        },
      },
      {
        number: '02',
        title: 'Water-soluble toxin clearance',
        text: "Water-soluble toxins, including alcohol metabolites, certain medications, and environmental pollutants that enter through contaminated water, are eliminated through kidney and liver pathways. India's water quality challenges, especially in metros, make this a critical piece of personal health data.",
        flip: true,
        viz: {
          kind: 'rows',
          rows: [{ label: 'Water-soluble toxin clearance', status: 'avg', statusLabel: 'Average' }],
          note: 'Your gene variant shows moderate capacity to eliminate water-soluble toxins through the kidneys and liver. Hydration and certain foods can support this process.',
        },
      },
      {
        number: '03',
        title: 'Oxidative stress response',
        text: "Oxidative stress occurs when your body can't neutralise free radicals fast enough, and it accelerates ageing, inflammation, and disease risk. Your genetic susceptibility to oxidative stress determines how much antioxidant support your body needs. For Indians living in high-pollution cities, this is one of the most actionable genetic insights available.",
        viz: {
          kind: 'rows',
          rows: [{ label: 'Oxidative stress response', status: 'risk', statusLabel: 'High risk' }],
          note: 'Your gene variant is associated with a higher susceptibility to oxidative stress, meaning your body needs more antioxidant support to neutralise free radicals from pollution and daily metabolism.',
        },
      },
      {
        number: '04',
        title: 'Your personalised detox action plan',
        text: 'Every result comes with specific dietary and lifestyle recommendations, which foods support your detox pathways, which supplements may help, and which environmental exposures to limit. Designed by genetic and nutrition experts. Not a detox juice plan. A science-backed strategy for your specific detox genetics.',
        flip: true,
        viz: {
          kind: 'pills',
          pills: [
            { label: 'Antioxidant-rich foods', status: 'good' },
            { label: 'Limit processed', status: 'avg' },
          ],
          note: 'Increase antioxidant-rich foods, reduce processed-food and pollutant exposure, and consider glutathione or NAC supplementation to support your detox pathways.',
        },
      },
    ],
  },
  midCta1: { text: 'Ready to see your own results? It starts with one saliva kit.', ctaLabel: 'Get My Detox DNA' },
  report: {
    eyebrow: 'Full report contents',
    title: 'Every trait covered',
    sub: '3 core traits. Each with a genotype result, interpretation, and actionable recommendations. Simple number, deep science.',
    groups: [
      {
        name: 'Detoxification profile',
        countLabel: '3 traits',
        items: [
          { label: 'Fat-soluble toxin clearance' },
          { label: 'Water-soluble toxin clearance' },
          { label: 'Oxidative stress response' },
        ],
      },
    ],
  },
  expertise: {
    eyebrow: 'Science & expertise',
    title: 'Backed by world-class genetic science',
    sub: 'KnowYourGenes follows the highest international standards for genetic testing, from sample collection to reporting.',
    bullets: WELLNESS_BULLETS,
    certifications: wellnessCerts(DETOX),
    experts: wellnessExperts(),
  },
  actionPlan: {
    eyebrow: 'After your results',
    title: 'Your DNA insights become your detox strategy',
    sub: "Results are not the end, they're the beginning. Here's what you can do with your Detox DNA report.",
    banner: {
      eyebrow: 'Your plan, your kitchen',
      text: 'Turn genetic insight into the food on your plate: supplements that fill real gaps, meals built around how your body actually responds.',
      image: `${DETOX}/banner.png`,
      imageAlt: 'A person preparing a fresh, colourful home-cooked meal',
    },
    actions: [
      {
        icon: 'nutrition',
        title: 'Eat for your detox pathways',
        text: 'Add cruciferous vegetables, berries, turmeric, and garlic, all of which support specific liver detox pathways based on your genetic profile.',
      },
      {
        icon: 'shield',
        title: 'Choose the right supplements',
        text: 'Glutathione, N-acetyl cysteine, and antioxidant complexes can directly support your detox capacity. Your report tells you where you need them most.',
      },
      {
        icon: 'calendar-tasks',
        title: 'Reduce high-risk exposures',
        text: 'If your fat-soluble clearance is poor, reducing exposure to pesticide-heavy produce, processed foods, and indoor air pollutants becomes a health priority, not just a lifestyle choice.',
      },
      {
        icon: 'calendar-check',
        title: 'Lifetime access',
        text: "Your genes don't change. Access your report anytime, share with new health professionals, revisit as your health goals evolve.",
      },
    ],
  },
  midCta2: {
    text: 'One test. A lifetime of supporting how your body clears what it takes in.',
    ctaLabel: 'Get My Detox DNA',
  },
  howItWorks: { eyebrow: 'How it works', title: "3 steps. That's it.", steps: wellnessSteps(DETOX) },
  faq: {
    eyebrow: 'Questions',
    title: 'Common questions',
    items: [
      {
        q: 'Only 3 traits, is this enough?',
        a: 'These three traits, fat-soluble clearance, water-soluble clearance, and oxidative stress, are the core of how your body handles toxins. They’re chosen for being the most actionable: each one comes with clear dietary, supplement, and lifestyle recommendations you can apply immediately.',
      },
      {
        q: "Will this tell me if I need a 'detox diet'?",
        a: 'No, and that’s the point. This isn’t about juice cleanses. It tells you how your liver genetically processes toxins so you can support your real detox pathways with the right foods, supplements, and reduced exposures, backed by science, not a fad.',
      },
      {
        q: 'I live in a clean area, is this still relevant?',
        a: 'Yes. Toxins come from food, water, medications, and daily metabolism, not just air pollution. Your genetic detox capacity matters everywhere, and knowing it helps you make smarter choices about diet and supplements regardless of where you live.',
      },
      {
        q: 'Is this a medical or diagnostic test?',
        a: 'No. This is a wellness report identifying genetic tendencies, not a diagnosis. It does not diagnose or treat any medical condition and is not a substitute for professional medical advice. Discuss results with a qualified healthcare professional before making clinical decisions.',
      },
      {
        q: 'Can I buy just this report?',
        a: 'Yes. My Detox DNA can be bought on its own. If you also want your diet, weight, and fitness insights, the All-4 Wellness bundle covers every report from a single saliva sample and works out cheaper than buying them individually.',
      },
      {
        q: 'How is my genetic data kept private?',
        a: 'Your data belongs only to you. KYG never sells, shares, or uses your genetic data for any purpose beyond generating your report. Your sample is destroyed after processing, and data is stored on encrypted servers with strict access controls.',
      },
    ],
  },
  bundlesSection: { items: wellnessBundleCards },
  bottomCta: {
    title: 'Know what your body is up against.',
    sub: '3 detox insights. One saliva kit. A science-backed strategy for the environment you actually live in.',
    ctaLabel: 'Get My Detox DNA',
    trust:
      'At-home saliva kit &nbsp;·&nbsp; Neotech World Lab &nbsp;·&nbsp; Results in 7 days &nbsp;·&nbsp; <b>30-min free counselling included</b>',
  },
};

export const TESTS: Test[] = [mensHealth, myDiet, myWeight, myFitness, myDetox];

// -----------------------------------------------------------------------------
// Lookup helpers (used by the route segment + category layout)
// -----------------------------------------------------------------------------
export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getTest(categorySlug: string, testSlug: string): Test | undefined {
  return TESTS.find((t) => t.categorySlug === categorySlug && t.slug === testSlug);
}

export function getCategoryTests(categorySlug: string): Test[] {
  return TESTS.filter((t) => t.categorySlug === categorySlug);
}

/** Every valid /[category_slug]/[test_slug] combination, for static generation. */
export function allTestParams(): { category_slug: string; test_slug: string }[] {
  return TESTS.map((t) => ({ category_slug: t.categorySlug, test_slug: t.slug }));
}
