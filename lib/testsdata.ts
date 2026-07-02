// =============================================================================
// lib/testsdata.ts - test-detail page content
// -----------------------------------------------------------------------------
// The array of test pages served to the (tests) routes. Each entry is a fully
// self-describing `TestPage` (see features/tests/types.ts). Copy fields are HTML
// strings, so a page can style individual bits inline (highlight spans, <b>,
// <br/>, per-page heading colours) without touching any component.
//
// `mensHealth` is a 1:1 rebuild of the Figma "Men's Health Test" design and
// replaces the previous Men's Health data.
// =============================================================================

import type { Bundle, TestPage } from '@/features/tests/types';

const BASE = '/tests/mens-health';
const IC = `${BASE}/icons`;

// The three bundles appear in both the sidebar and the bundles section.
const BUNDLES: Bundle[] = [
  {
    key: 'kbyb',
    theme: 'recommended',
    icon: `${IC}/bundle-kbyb.svg`,
    badge: 'Most popular',
    title: 'Know Before You Begin',
    subtitle: 'Pre-matrimonial bundle',
    desc: "Men's Health + Women's Health + one joint counselling session.",
    bestFor: '<b>Best for:</b> couples getting married or planning a family.',
    ctaLabel: 'View bundle',
    href: '#',
  },
  {
    key: 'complete',
    theme: 'complete',
    icon: `${IC}/bundle-complete.svg`,
    title: 'The Complete You',
    subtitle: 'Full picture bundle',
    desc: 'All 5 reports + Ancestry. Your complete genetic health and heritage.',
    bestFor: '<b>Best for:</b> anyone who wants to understand their complete genetic health and heritage in one go.',
    ctaLabel: 'View bundle',
    href: '#',
  },
  {
    key: 'couple',
    theme: 'couple',
    icon: `${IC}/bundle-couple.svg`,
    title: "Couple's Blueprint",
    subtitle: 'Couples wellness bundle',
    desc: "My Wellness + Women's Health + Men's Health.",
    bestFor: '<b>Best for:</b> couples who want everyday health insights, not just family-planning data.',
    ctaLabel: 'View bundle',
    href: '#',
  },
];

export const mensHealth: TestPage = {
  slug: 'mens-health',
  categorySlug: 'wellness',

  seo: {
    title: "Men's Health DNA · KYG · Know Your Genes",
    description:
      "Fertility, hormones, hair loss. Three areas of men's health with a strong genetic component. A simple at-home saliva test tells you where you stand, before anything goes wrong.",
  },

  sidebar: {
    eyebrow: 'Bundles',
    introHtml: 'Getting married or planning a family? These go further together.',
    bundles: BUNDLES,
    noteHtml: 'Every report includes a <b>free 30-minute GENEous Care</b> session on WhatsApp.',
  },

  hero: {
    badges: [
      { label: "Men's Health DNA", img: `${BASE}/hero-badge-dna.png`, imgAlt: 'DNA' },
      { label: '3 health tests' },
      { label: 'NABL certified lab', img: `${BASE}/hero-badge-nabl.png`, imgAlt: 'NABL' },
    ],
    titleHtml: 'Men rarely get tested until something goes wrong.<br /><span class="hl">Change that.</span>',
    anchorWord: 'Fertility.',
    bodyHtml:
      "Three areas of men's health that are rarely talked about until a problem forces the conversation. All three are shaped by your genes. A simple saliva test tells you where you stand, <b>before anything goes wrong.</b>",
    ctaLabel: 'Check my risk',
    ctaHref: '#order',
    trust: [
      { icon: 'saliva', line1: 'At-home saliva kit', line2: 'No clinic visit' },
      { icon: 'needle', line1: 'No needles', line2: '2-min collection' },
      { icon: 'clock', line1: 'Results in 7 days', line2: 'Delivered digitally' },
      { icon: 'chat', line1: '30-min counsellor chat', line2: 'Free, on WhatsApp' },
    ],
    image: `${BASE}/hero-man.png`,
    imageAlt: 'A composed man',
    imageCaption: 'Know your risk early',
    stats: [
      { num: '3', label: 'Health tests' },
      { num: 'NABL', label: 'Certified lab' },
      { num: '99%+', label: 'Accuracy' },
      { num: '7 days', label: 'Results' },
    ],
  },

  pains: {
    eyebrow: "What you'll discover",
    titleHtml: 'Three things most Indian men never think to check.',
    items: [
      {
        key: 'fertility',
        accent: 'fertility',
        icon: `${IC}/icon-pain-fertility.svg`,
        label: 'Fertility · Gene ART3',
        question: 'Can genes cause problems with having children?',
        answerHtml:
          '<b>Yes.</b> A man can have healthy habits, a normal lifestyle, and still carry a genetic tendency that makes it harder to have children. Many men only discover this after months of trying to conceive with their partner.',
        calloutHtml:
          '<b>India fact:</b> Fertility treatment can cost Rs 1.5 to 2.5 lakh per round. Most couples only find out there is a problem after a year of trying. Knowing earlier means more options.',
        badge: 'Good · Low risk',
        badgeTone: 'good',
        checksLabel: 'What this test checks',
        checksBodyHtml:
          'Whether your genes are linked to a condition where little or no sperm is present in semen, a common hidden cause of male infertility.',
        sampleHtml: 'Sample result: "Your genes suggest a normal risk for this condition."',
        signsTitle: 'Signs to watch for',
        signs: [
          'Lower than usual interest in sex',
          'Not been able to conceive after trying for 12 months',
          'Swelling or discomfort in the testicle area',
          'Less body or facial hair than usual',
        ],
      },
      {
        key: 'hormones',
        accent: 'hormones',
        icon: `${IC}/icon-pain-hormones.svg`,
        label: 'Hormones · LOC108783645, HFE',
        question: 'Can genes affect testosterone and male hormones?',
        answerHtml:
          '<b>Yes.</b> Your body has a system that controls how much testosterone it makes and how well it works. Some men carry a gene variant that puts this system under strain, which can affect energy levels, muscle, sex drive, and the ability to have children, even in their 20s and 30s.',
        calloutHtml:
          'Most men think low energy or reduced drive is just stress or age. Sometimes it starts with a gene.',
        badge: 'Good · Low risk',
        badgeTone: 'good',
        checksLabel: 'What this test checks',
        checksBodyHtml:
          'How well your testosterone-production system is likely to function based on your genes, and whether you carry a tendency for the testicles to reduce in size and function over time.',
        sampleHtml: 'Sample result: "Your genes suggest a normal risk for this condition."',
        signsTitle: 'Signs to watch for',
        signs: [
          'Feeling tired even after a full night of sleep',
          'Losing muscle even though you are still working out',
          'Lower interest in sex than usual',
          'Less facial or body hair growth',
        ],
      },
      {
        key: 'hairloss',
        accent: 'hairloss',
        icon: `${IC}/icon-pain-hairloss.svg`,
        label: 'Hair loss · AR, LINC01432, C1orf127',
        question: 'Is early hair loss in men linked to genes?',
        answerHtml:
          "<b>Yes.</b> There is a type of hair loss called alopecia areata where the body's own immune system attacks the hair roots. It starts in patches, and the Androgen Receptor gene (AR) is one of the clearest markers of risk for this. Knowing your risk early means you can act before the loss becomes hard to reverse.",
        calloutHtml:
          '<b>1 in 2</b> Indian men with hair loss are under 25. Most find out at a stage where options are already limited. <i>Source: Traya Health, 2025 study of 5 lakh Indian men.</i>',
        badge: 'Poor · High risk',
        badgeTone: 'poor',
        resultTinted: true,
        checksLabel: 'What this test checks',
        checksBodyHtml:
          'Your genetic tendency for immune-linked hair loss (alopecia areata), which causes patchy hair loss on the scalp, eyebrows, and body.',
        sampleHtml:
          'Sample result (high-risk example): "Your genes suggest an increased risk of hair loss. See a skin doctor if you notice symptoms. Increase protein in your diet and consider Biotin and Omega-3 sources such as walnuts and flax seeds."',
        signsTitle: 'Signs to watch for',
        signs: [
          'Hair thinning at the top of the head',
          'Round or patchy bald spots appearing',
          'Hair coming out easily when you run your fingers through it',
          'Scaling or redness spreading across the scalp',
        ],
      },
    ],
  },

  stat: {
    quoteHtml: '1 in 8 couples find it hard to have a baby.',
    subQuoteHtml: 'In almost half of those cases, the reason is with <b>the man.</b>',
    emphasisHtml: 'Most men never find out why.',
    bodyHtml:
      'Men are far less likely to get health tests done, less likely to see a doctor before something goes wrong, and least likely to talk about issues like low hormones or fertility. But these things are shaped by your genes. One saliva test at home can tell you where you stand, before a problem becomes harder to solve.',
    bigNum: '~50%',
    bigNumLabel: "of couples' fertility issues involve the man's side",
    ctaLabel: 'Know my risk',
    ctaHref: '#order',
    fineprint: 'Kit delivers in 2-3 days · Results in 7 days · Tap to order',
  },

  sampleReport: {
    eyebrow: 'Your report, before you pay',
    titleHtml: 'This is what your report looks like.',
    introHtml:
      'Three health checks. Each one gives you your result in plain language, a risk level, and a clear step to take. Here is exactly what you will see.',
    cards: [
      {
        title: 'Hormones',
        icon: `${IC}/report-hormones.svg`,
        whatLabel: 'What it checks',
        desc: 'How well your body makes and manages testosterone and male hormones.',
        result: 'GOOD',
        resultLabel: 'Low risk',
        tone: 'good',
        noteHtml:
          '"Your genes suggest a normal risk for this condition. Eat plenty of antioxidant-rich foods like fruits, vegetables, and nuts."',
      },
      {
        title: 'Fertility',
        icon: `${IC}/icon-pain-fertility.svg`,
        whatLabel: 'What it checks',
        desc: 'Whether your genes raise your risk of not being able to produce sperm.',
        result: 'GOOD',
        resultLabel: 'Low risk',
        tone: 'good',
        noteHtml:
          '"Your genes suggest a normal risk for this condition. Stay active, keep a healthy weight, and eat a balanced diet."',
      },
      {
        title: 'Hair loss',
        icon: `${IC}/icon-pain-hairloss.svg`,
        whatLabel: 'What it checks',
        desc: 'Whether your genes raise your risk of patchy hair loss driven by your immune system.',
        result: 'POOR',
        resultLabel: 'High risk',
        tone: 'poor',
        noteHtml:
          '"Your genes suggest a higher risk of hair loss. See a skin doctor early. Eat more protein and consider Biotin and Omega-3 sources."',
      },
    ],
    legendTitle: 'How the risk levels work',
    legend: [
      {
        label: 'Good',
        sub: 'Low risk',
        tone: 'good',
        descHtml: 'Your genes are in the normal range for this condition.',
      },
      {
        label: 'Average',
        sub: 'Medium risk',
        tone: 'avg',
        descHtml: 'Your genes suggest some risk. Follow the recommendations in your report.',
      },
      {
        label: 'Poor',
        sub: 'High risk',
        tone: 'poor',
        descHtml: 'Your genes suggest an elevated risk. Act on the recommendations and speak to a doctor.',
      },
    ],
  },

  howItWorks: {
    eyebrow: 'How it works',
    titleHtml: 'From your door to your report.',
    introHtml: 'No clinic, no needle, no hassle.',
    image: `${BASE}/how-it-works-physician.png`,
    imageAlt: "A physician noting down a patient's symptoms",
    steps: [
      {
        num: '01',
        icon: `${IC}/icon-step-1.svg`,
        title: 'Order online',
        subHtml: 'Your kit arrives in 2 to 3 days.',
        bodyHtml:
          'We send your kit straight to your address. Inside the box is everything you need: a saliva collection tube, a simple instruction card, and a pre-paid return envelope for the lab. You do not need to arrange anything else.',
      },
      {
        num: '02',
        icon: `${IC}/icon-step-2.svg`,
        title: 'Collect your sample at home in 5 minutes',
        subHtml: 'No needles. No appointments. No fasting.',
        bodyHtml:
          'Open the tube. Spit into it. Seal it. That is all. You do not need to change your routine or go anywhere. Do it at home, whenever you have 5 minutes. The instruction card inside the kit walks you through it step by step.',
      },
      {
        num: '03',
        icon: `${IC}/icon-step-3.svg`,
        title: 'Drop it with the courier',
        subHtml: 'Pre-paid envelope. Pre-labelled. You just hand it over.',
        bodyHtml:
          'Put the sealed tube into the pre-paid return envelope included in the kit. A courier picks it up from your address. You can track it in the KYG portal the moment it is collected. No post office run. No queue.',
      },
      {
        num: '04',
        icon: `${IC}/icon-step-4.svg`,
        title: 'Our lab processes your sample',
        subHtml: "India's top certified lab. Real scientists check your results.",
        bodyHtml:
          "Your sample goes to Neotech World Lab, which holds India's highest laboratory certification (NABL). They use professional gene-testing technology to process your sample. A qualified scientist reviews your results personally before your report is released. It is not automated.",
      },
      {
        num: '05',
        icon: `${IC}/icon-step-5.svg`,
        title: 'Your report is ready in 7 days',
        subHtml: 'Delivered to your account. Explained by a real person.',
        bodyHtml:
          "Your Men's Health report is sent to your KYG account. Three health checks, each with a clear result, a risk level, and a plain-language explanation of what to do. Within 2 days of receiving your report, a GENEous Care counsellor reaches out to book your free 30-minute session.",
        dark: true,
      },
    ],
    ctaLabel: 'Order my kit',
    ctaHref: '#order',
    fineprint: 'Delivered in 2-3 days · Takes 5 minutes to collect · Results in 7 days',
  },

  care: {
    eyebrow: 'Included free with every report',
    titleHtml: 'You will not read this report alone.',
    leadHtml:
      "GENEous Care is KYG's free counselling service. A real expert reaches out after your results and walks you through everything, on WhatsApp, in plain language.",
    bodyHtml:
      'Other gene testing brands send you a report and a link to a help page. KYG gives you a 30-minute conversation with a qualified counsellor who has read your specific results and can tell you exactly what to do next.',
    minis: [
      {
        title: 'What it is',
        bodyHtml: 'A free 30-minute session with a trained genetic counsellor. No extra charge.',
      },
      {
        title: 'How it works',
        bodyHtml: 'Within 2 days of your report, your counsellor gets in touch over WhatsApp call or video.',
      },
      {
        title: 'What you get',
        bodyHtml: 'A clear explanation of each result and specific steps to take, no medical jargon.',
      },
    ],
    pullQuoteHtml: '"Genetic care, done the GENEous way."',
    chatTitle: 'GENEous Care',
    chatStatus: 'Genetic counsellor · online',
    chat: [
      {
        from: 'them',
        textHtml: "Hi! I've read through your Men's Health report. Free to chat for 30 mins this week?",
      },
      { from: 'me', textHtml: 'Yes, what does my hair-loss result mean?' },
      {
        from: 'them',
        textHtml:
          "It's an early-stage flag, not a verdict. Here's exactly what to do now, and when to see a dermatologist. I'll explain it all on the call 👍",
      },
    ],
    coversTitle: 'What your counsellor covers',
    covers: [
      '<b>Hormones:</b> what your result means for your daily energy, training, and when to see a doctor.',
      '<b>Fertility:</b> whether your result means you should get a semen analysis done, and what that involves.',
      '<b>Hair loss:</b> what you can do right now at the early stage, and when professional treatment is worth considering.',
      'Your next steps as a couple, if you are planning to get married or start a family.',
    ],
  },

  trust: {
    eyebrow: 'Backed by science people stake their careers on',
    titleHtml: 'Every result is verified. Every report is checked by a scientist.',
    certs: [
      { img: `${BASE}/cert-nabl.png`, alt: 'NABL', label: 'NABL MC-6400' },
      { img: `${BASE}/cert-iso-9001.png`, alt: 'ISO 9001:2015', label: 'ISO 9001:2015' },
      { img: `${BASE}/cert-iso-27001.png`, alt: 'ISO 27001:2013', label: 'ISO 27001:2013' },
      { img: `${BASE}/cert-acmg.png`, alt: 'ACMG', label: 'ACMG' },
      { svg: `${BASE}/icons/cert-cpic.svg`, alt: 'CPIC', label: 'CPIC' },
      { img: `${BASE}/cert-hipaa.png`, alt: 'HIPAA', label: 'HIPAA' },
      { img: `${BASE}/cert-fda.png`, alt: 'FDA', label: 'FDA' },
    ],
    rows: [
      {
        label: 'NABL Accredited (ISO 15189) · MC-6400',
        descHtml:
          "India's highest official certification for testing labs. Your sample is handled under strict, independently checked standards.",
      },
      {
        label: 'ISO 9001:2015 + ISO 27001:2013',
        descHtml:
          'Two international certifications: one for quality, one for data security. Your personal and genetic information is protected at every step.',
      },
      {
        label: 'ACMG + CPIC Guidelines',
        descHtml:
          "Your report follows guidelines from two of the world's leading bodies in genetic science, the same standards used by leading hospitals internationally.",
      },
      {
        label: 'Illumina Genotyping Technology',
        descHtml:
          "The same gene-reading technology used by the world's largest genetic testing companies. 99%+ accuracy on every sample.",
      },
      {
        label: 'HIPAA + FDA Standards',
        descHtml:
          'Your data is handled according to international privacy rules. KYG never sells your information or shares it with anyone.',
      },
    ],
    expert: {
      initials: 'VS',
      name: 'Dr. Varun Sharma, Ph.D',
      role: '· Genetic Scientist',
      lab: 'Neotech World Lab Pvt. Ltd., MG Road, Gurugram',
      bodyHtml:
        "Every Men's Health report is personally reviewed by Dr. Sharma's team before it reaches you. Not a machine alone. A scientist checks your results.",
      accuracyHtml: 'Accuracy: 99%+ reproducibility. Less than 2% of samples ever need rechecking.',
    },
  },

  faq: {
    eyebrow: 'Questions people ask before they test',
    titleHtml: 'Common questions.',
    items: [
      {
        q: 'Do I need to be trying for a baby to take this test?',
        aHtml:
          'No. This test is useful for any man who wants to understand his hormonal health, fertility, and hair-loss risk, whether you are planning a family now, later, or not at all. Many men take it simply as an early health check or before marriage.',
      },
      {
        q: 'Do I need to fast or prepare before collecting my saliva?',
        aHtml:
          'No. There is no fasting and no preparation. Just avoid eating, drinking, or smoking for about 30 minutes before you collect your sample. The instruction card inside the kit walks you through the simple steps.',
      },
      {
        q: 'What does a Poor or High Risk result actually mean?',
        aHtml:
          'It means your genes are linked to a higher-than-average risk for that condition, not that you have it or definitely will. It is an early flag that lets you act sooner. Your report tells you exactly what to do, and your free counselling session explains it in plain language.',
      },
      {
        q: 'How is my personal and genetic information kept safe?',
        aHtml:
          'Your data belongs to you. KYG never sells or shares your genetic information. Handling follows ISO 27001, HIPAA, and FDA privacy standards, your sample is destroyed after processing, and data is stored on encrypted servers with strict access controls.',
      },
      {
        q: 'Is this a medical test or a diagnostic test?',
        aHtml:
          'This is a wellness and risk-screening test, not a diagnostic one. It identifies genetic tendencies and predispositions. It does not diagnose any condition and is not a substitute for professional medical advice. Discuss results with a qualified doctor before making clinical decisions.',
      },
      {
        q: "Can my partner take the Women's Health test at the same time?",
        aHtml:
          "Yes, and we recommend it for couples planning marriage or a family. The Men's + Women's Health combination is the core of our 'Know Before You Begin' bundle, one saliva kit each and a joint counselling session.",
      },
      {
        q: 'When does the kit arrive and how long until I get my results?',
        aHtml:
          'Your kit is delivered in 2 to 3 days. Collection takes about 5 minutes at home. Once the lab receives your sample, your report is ready in 7 days and delivered digitally to your KYG account.',
      },
      {
        q: 'What if I have questions after I read my report?',
        aHtml:
          'Every report includes a free 30-minute GENEous Care session on WhatsApp. A trained genetic counsellor who has read your specific results explains each one and the exact steps to take. You can ask anything.',
      },
    ],
  },

  bundlesSection: {
    eyebrow: 'Or bundle & save',
    titleHtml: 'Getting married or planning a family? These go further together.',
    items: BUNDLES,
  },

  finalCta: {
    titleHtml: 'Know your health before it becomes a headline.',
    subHtml:
      '3 health checks. One saliva kit. The information every man should have before the conversations that matter most.',
    ctaLabel: "Get my Men's Health report",
    ctaHref: '#order',
    fineprint1: 'At-home saliva kit · NABL Certified Lab · Results in 7 days · Free counselling included',
    fineprint2: 'Certified lab · 99%+ accuracy · Your data stays private · Free GENEous Care session with every report',
  },
};

// =============================================================================
// womensHealth - 1:1 rebuild of the Figma "Women's Health - Desktop" design.
// Same TestPage shape as mensHealth, but five pains (PCOS, pregnancy loss,
// post-pregnancy depression, bone weakness, joint pain) instead of three.
// Product imagery lives under /public/tests/womens-health/ (see WBASE); the
// brand certification logos are shared and reused from mens-health.
// =============================================================================

// Women's-specific imagery (hero photo + the five pain icons) lives under WBASE.
const WBASE = '/tests/womens-health';
const WIC = `${WBASE}/icons`;
// Non-gendered assets (bundle/step icons, hero badges, the physician photo, and
// the brand certification logos) are identical across products, so reuse the
// existing mens-health pack rather than duplicating files.
const SHARED = '/tests/mens-health';
const SIC = `${SHARED}/icons`;

const WOMENS_BUNDLES: Bundle[] = [
  {
    key: 'kbyb',
    theme: 'recommended',
    icon: `${SIC}/bundle-kbyb.svg`,
    badge: 'Most popular',
    title: 'Know Before You Begin',
    subtitle: 'Pre-matrimonial bundle',
    desc: "Women's + Men's Health + one joint counselling session.",
    bestFor: '<b>Best for:</b> couples getting married or planning a family.',
    ctaLabel: 'View bundle',
    href: '#',
  },
  {
    key: 'complete',
    theme: 'complete',
    icon: `${SIC}/bundle-complete.svg`,
    title: 'The Complete You',
    subtitle: 'Full picture bundle',
    desc: 'All 5 reports + Ancestry. Your complete genetic health and heritage.',
    bestFor: '<b>Best for:</b> anyone who wants to understand their complete genetic health and heritage in one go.',
    ctaLabel: 'View bundle',
    href: '#',
  },
  {
    key: 'couple',
    theme: 'couple',
    icon: `${SIC}/bundle-couple.svg`,
    title: "Couple's Blueprint",
    subtitle: 'Couples wellness bundle',
    desc: "My Wellness + Women's Health + Men's Health.",
    bestFor: '<b>Best for:</b> couples who want everyday health insights alongside family-planning data.',
    ctaLabel: 'View bundle',
    href: '#',
  },
];

export const womensHealth: TestPage = {
  slug: 'womens-health',
  categorySlug: 'wellness',

  seo: {
    title: "Women's Health DNA · KYG · Know Your Genes",
    description:
      'PCOS, pregnancy loss, post-pregnancy depression, bone weakness and joint pain. Five areas of women’s health with a strong genetic link. A simple at-home saliva test tells you where you stand, before symptoms do.',
  },

  sidebar: {
    eyebrow: 'Bundles',
    introHtml: 'Planning a family or getting married? These go further together.',
    bundles: WOMENS_BUNDLES,
    noteHtml: 'Every report includes a <b>free 30-minute GENEous Care</b> session on WhatsApp.',
  },

  hero: {
    badges: [
      { label: "Women's Health DNA", img: `${SHARED}/hero-badge-dna.png`, imgAlt: 'DNA' },
      { label: '5 health tests' },
      { label: 'NABL certified lab', img: `${SHARED}/hero-badge-nabl.png`, imgAlt: 'NABL' },
    ],
    titleHtml:
      'Every 1 out of 5 Indian women has PCOS.<br /><span class="hl">Most never learn why. But you can.</span>',
    anchorWord: 'Bone weakness.',
    bodyHtml:
      'Five conditions that affect Indian women more than most people know, and all five have a strong link to your genes. A single saliva test tells you where you stand, <b>before symptoms do.</b>',
    ctaLabel: 'Check my risk',
    ctaHref: '#order',
    trust: [
      { icon: 'saliva', line1: 'At-home saliva kit', line2: 'No clinic visit' },
      { icon: 'needle', line1: 'No needles', line2: '2-min collection' },
      { icon: 'clock', line1: 'Results in 7 days', line2: 'Delivered digitally' },
      { icon: 'chat', line1: '30-min counsellor chat', line2: 'Free, on WhatsApp' },
    ],
    image: `${WBASE}/hero-woman.png`,
    imageAlt: 'A composed woman',
    imageCaption: 'Know your risk before symptoms do',
    stats: [
      { num: '5', label: 'Health tests' },
      { num: 'NABL', label: 'Certified lab' },
      { num: '99%+', label: 'Accuracy' },
      { num: '7 days', label: 'Results' },
    ],
  },

  pains: {
    eyebrow: "What you'll discover",
    titleHtml: 'Five things most Indian women are never told about their own health.',
    items: [
      {
        key: 'pcos',
        accent: 'pcos',
        icon: `${WIC}/icon-pain-pcos.svg`,
        label: 'PCOS · Gene THADA',
        question: 'Can genes cause irregular periods and PCOS?',
        answerHtml:
          '<b>Yes.</b> PCOS, or Polycystic Ovary Syndrome, has a clear genetic link. It is one of the most common hormonal conditions in women of reproductive age, affecting up to 1 in 5 Indian women, yet most women spend years not understanding why their periods are irregular, why their weight keeps shifting, or why their skin keeps breaking out.',
        calloutHtml:
          'PCOS is not just a reproductive issue. Left unmanaged, it can increase the risk of type 2 diabetes, heart disease, and difficulty conceiving. The earlier you know your genetic tendency, the earlier you can act on it.',
        badge: 'Good · Low risk',
        badgeTone: 'good',
        checksLabel: 'What this test checks',
        checksBodyHtml:
          'Your genetic tendency for PCOS, including hormonal imbalance, irregular cycles, and a connected risk for type 2 diabetes.',
        sampleHtml:
          'Sample result: "Your genes suggest a normal risk for this condition. Keep a healthy weight and stay active."',
        signsTitle: 'Signs to watch for',
        signs: [
          'Irregular or missed periods',
          'Heavier or more painful periods than usual',
          'Unexpected hair growth on face, chest, or back',
          'Acne that keeps coming back around the chin and jaw',
          'Weight gain around the waist that is hard to shift',
          'Thinning hair on the scalp',
          'Dark patches of skin in body creases like the neck or underarms',
        ],
      },
      {
        key: 'pregnancy-loss',
        accent: 'pregnancy',
        icon: `${WIC}/icon-pain-pregnancy.svg`,
        label: 'Pregnancy loss · MTHFR, FOXP3',
        question: 'Can genes increase the risk of miscarriage?',
        answerHtml:
          '<b>Yes.</b> Some women carry gene variants that affect how the body supports a pregnancy, either in how it processes a key nutrient called folate or in how the immune system behaves during pregnancy. Both can raise the risk of miscarriage, especially recurring loss.',
        calloutHtml:
          '<b>India fact:</b> Pregnancy loss affects roughly 1 in 8 known pregnancies. In many cases it happens more than once, and couples are left without a clear explanation. Genetic testing before pregnancy is not yet standard in India, but it should be.',
        badge: 'Good · Low risk',
        badgeTone: 'good',
        checksLabel: 'What this test checks',
        checksBodyHtml:
          'MTHFR: how well your body processes folate, a nutrient critical for a healthy pregnancy and the baby’s early development. FOXP3: how your immune system behaves during pregnancy, as immune reactions that go wrong are a significant cause of repeated miscarriage.',
        sampleHtml:
          'Sample result: "Your genes suggest a normal risk for pregnancy loss. Eat a healthy diet and take folate supplements before and during pregnancy."',
        signsTitle: 'Signs to watch for',
        signs: [
          'Heavy spotting or bleeding during pregnancy',
          'Severe stomach pain or cramping',
          'History of two or more miscarriages without a clear reason',
          'Discharge of tissue or fluid during pregnancy',
          'Severe back pain during early pregnancy',
        ],
      },
      {
        key: 'post-pregnancy-depression',
        accent: 'depression',
        icon: `${WIC}/icon-pain-depression.svg`,
        label: 'Post-pregnancy depression · COMT',
        question: 'Can genes raise the risk of depression during or after pregnancy?',
        answerHtml:
          '<b>Yes.</b> Some women carry a gene variant that makes them more sensitive to stress, particularly during the hormonal shifts of pregnancy and childbirth. This is not a personality weakness or a sign of being a bad mother. It is a genetic profile that shows up in how the brain manages certain chemicals.',
        calloutHtml:
          'In India, this is very rarely talked about. New mothers are expected to feel happy and grateful, so women who feel the opposite often suffer in silence for months. Knowing your tendency means the people around you can watch for the signs early.',
        badge: 'Poor · High risk',
        badgeTone: 'poor',
        resultTinted: true,
        checksLabel: 'What this test checks',
        checksBodyHtml:
          'How your brain handles certain chemicals including dopamine. A particular variant means the brain holds onto these chemicals longer, which makes you more sensitive to pain and stress, especially during major hormonal changes like pregnancy.',
        sampleHtml:
          'Sample result (high-risk example): "Your genes suggest a higher sensitivity to stress during pregnancy. Eat well, avoid caffeine and processed foods, take rest seriously, and speak to your doctor early."',
        signsTitle: 'Signs to watch for',
        signs: [
          'Anxiety or panic that feels hard to control during pregnancy',
          'Not feeling hungry or interested in food',
          'Sleep problems beyond normal newborn disruption',
          'Feeling like you are not good enough as a mother',
          'Pulling away from family and friends',
          'Dark or distressing thoughts that will not go away',
          'Feeling unable to bond with your baby',
        ],
      },
      {
        key: 'bone-weakness',
        accent: 'bones',
        icon: `${WIC}/icon-pain-bones.svg`,
        label: 'Bone weakness · AKAP11, LRP5, ZBTB40',
        question: 'Can genes tell me if my bones are at risk as I age?',
        answerHtml:
          '<b>Yes.</b> Osteoporosis, where bones become fragile and break easily, is often called a silent condition because there are no symptoms until a bone actually fractures. Women lose bone density faster than men, especially after menopause when certain hormones drop. But your genes can tell you if you are at higher risk, decades before it becomes a problem.',
        calloutHtml:
          '<b>India fact:</b> India has some of the highest rates of bone weakness in Asia. Most Indian women are only checked after menopause, by which point significant bone loss has already happened. Knowing your risk in your 20s or 30s gives you time to change that.',
        badge: 'Poor · High risk',
        badgeTone: 'poor',
        resultTinted: true,
        checksLabel: 'What this test checks',
        checksBodyHtml:
          'AKAP11: active in bone tissue, influences bone density. LRP5: controls how the skeleton builds and maintains itself. ZBTB40: involved in how well minerals are deposited into bones.',
        sampleHtml:
          'Sample result (high-risk example): "Your genes suggest a higher risk of weakening bones. Eat foods rich in calcium and Vitamin D, do weight-bearing exercise regularly, and avoid smoking and alcohol."',
        signsTitle: 'Signs to watch for',
        signs: [
          'No visible symptoms in the early stages, which is exactly why genetic testing matters',
          'Receding gums',
          'Weaker grip than before',
          'Brittle nails that break easily',
          'A bone fracture from a minor bump or fall',
          'Gradual back or neck pain, or slowly getting shorter in height',
        ],
      },
      {
        key: 'joint-pain',
        accent: 'joints',
        icon: `${WIC}/icon-pain-joints.svg`,
        label: 'Joint pain · HLA-DRB1',
        question: 'Can genes cause joint pain and swelling in women?',
        answerHtml:
          '<b>Yes.</b> Rheumatoid Arthritis (RA) is a condition where the immune system mistakenly attacks the joints, causing pain, swelling, and stiffness. It affects women three times more than men, and in India, women are significantly more likely to put joint pain down to household work or getting older rather than getting it properly checked.',
        calloutHtml:
          '<b>India fact:</b> RA affects around 7 in 100 women, compared to around 2.5 in 100 men. Many women live with it undiagnosed for years because joint pain is so normalised. Knowing your tendency means you can act before joint damage becomes permanent.',
        badge: 'Good · Low risk',
        badgeTone: 'good',
        checksLabel: 'What this test checks',
        checksBodyHtml:
          'A gene that plays a key role in how your immune system works. Certain versions of this gene are among the strongest known genetic signals for Rheumatoid Arthritis.',
        sampleHtml:
          'Sample result: "Your genes suggest a normal risk for Rheumatoid Arthritis. Eat a balanced diet and stay active."',
        signsTitle: 'Signs to watch for',
        signs: [
          'Tender, warm, or swollen joints, especially fingers and wrists',
          'Morning stiffness in joints that lasts more than 30 minutes',
          'The same joints hurting on both sides of your body at once',
          'Unusual tiredness, mild fever, or loss of appetite with joint pain',
          'Weaker grip strength than usual',
        ],
      },
    ],
  },

  stat: {
    quoteHtml: '1 in 5 Indian women has PCOS.',
    subQuoteHtml: 'Most spend years not knowing why their body behaves the way it does.',
    emphasisHtml: 'Your genes have had the answer the whole time.',
    bodyHtml:
      'Women’s health in India is under-tested and under-discussed. PCOS is discovered late. Bone loss is found after a fracture. Post-pregnancy depression is mistaken for exhaustion. RA is blamed on age. All five of these conditions have a genetic signal that can be read years before a problem forces the conversation. This test reads that signal.',
    bigNum: '1 in 5',
    bigNumLabel: 'Indian women have PCOS',
    ctaLabel: 'Know my risk',
    ctaHref: '#order',
    fineprint: 'Kit delivers in 2-3 days · Results in 7 days · Tap to order',
  },

  sampleReport: {
    eyebrow: 'Your report, before you pay',
    titleHtml: 'This is what your report looks like.',
    introHtml:
      'Five health checks. Each gives you your result in plain language, a risk level, and a clear step to take. Here is exactly what you will see.',
    cards: [
      {
        title: 'PCOS',
        icon: `${WIC}/icon-pain-pcos.svg`,
        whatLabel: 'What it checks',
        desc: 'Hormonal balance and your risk of irregular cycles and fertility issues.',
        result: 'GOOD',
        resultLabel: 'Low risk',
        tone: 'good',
        noteHtml: '"Your genes suggest a normal risk. Keep a healthy weight and stay active."',
      },
      {
        title: 'Pregnancy',
        icon: `${WIC}/icon-pain-pregnancy.svg`,
        whatLabel: 'What it checks',
        desc: "How your genes affect the body's ability to carry a healthy pregnancy.",
        result: 'GOOD',
        resultLabel: 'Low risk',
        tone: 'good',
        noteHtml: '"Your genes suggest a normal risk. Take folate before and during pregnancy."',
      },
      {
        title: 'Depression',
        icon: `${WIC}/icon-pain-depression.svg`,
        whatLabel: 'What it checks',
        desc: 'How sensitive your brain chemistry makes you to stress during and after pregnancy.',
        result: 'POOR',
        resultLabel: 'High risk',
        tone: 'poor',
        noteHtml:
          '"Your genes suggest higher stress sensitivity. Eat well, rest, and talk to your doctor early."',
      },
      {
        title: 'Bones',
        icon: `${WIC}/icon-pain-bones.svg`,
        whatLabel: 'What it checks',
        desc: 'How likely your bones are to lose density and become fragile over time.',
        result: 'POOR',
        resultLabel: 'High risk',
        tone: 'poor',
        noteHtml:
          '"Your genes suggest a higher risk of bone loss. Prioritise calcium, Vitamin D, and weight-bearing exercise."',
      },
      {
        title: 'Joints',
        icon: `${WIC}/icon-pain-joints.svg`,
        whatLabel: 'What it checks',
        desc: 'Whether your immune system is genetically prone to attacking your own joints.',
        result: 'GOOD',
        resultLabel: 'Low risk',
        tone: 'good',
        noteHtml: '"Your genes suggest a normal risk for joint disease. Eat well and stay active."',
      },
    ],
    legendTitle: 'How the risk levels work',
    legend: [
      {
        label: 'Good',
        sub: 'Low risk',
        tone: 'good',
        descHtml: 'Your genes are in the normal range for this condition.',
      },
      {
        label: 'Average',
        sub: 'Medium risk',
        tone: 'avg',
        descHtml: 'Your genes suggest some risk. Follow the recommendations in your report.',
      },
      {
        label: 'Poor',
        sub: 'High risk',
        tone: 'poor',
        descHtml: 'Your genes suggest an elevated risk. Act on the recommendations and speak to a doctor.',
      },
    ],
  },

  howItWorks: {
    eyebrow: 'How it works',
    titleHtml: 'From your door to your report.',
    introHtml: 'No clinic, no needle, no hassle.',
    image: `${SHARED}/how-it-works-physician.png`,
    imageAlt: "A physician noting down a patient's symptoms",
    steps: [
      {
        num: '01',
        icon: `${SIC}/icon-step-1.svg`,
        title: 'Order online',
        subHtml: 'Your kit arrives in 2 to 3 days.',
        bodyHtml:
          'We send the kit straight to your address. Inside the box: a saliva collection tube, a simple step-by-step instruction card, and a pre-paid return envelope already addressed to the lab. Everything you need. Nothing to arrange.',
      },
      {
        num: '02',
        icon: `${SIC}/icon-step-2.svg`,
        title: 'Collect your sample at home in 5 minutes',
        subHtml: 'No needles. No appointments. No preparation.',
        bodyHtml:
          'Open the tube. Spit into it. Seal it. That is the entire collection process. You do not need to fast, visit a clinic, or change anything about your day. The instruction card inside the kit walks you through every step. Most women do it first thing in the morning before breakfast.',
      },
      {
        num: '03',
        icon: `${SIC}/icon-step-3.svg`,
        title: 'Drop it with the courier',
        subHtml: 'Pre-paid envelope. Pre-labelled. You just hand it over.',
        bodyHtml:
          'Seal the tube inside the pre-paid return envelope included in your kit. A courier picks it up from your address at a time you choose. You can track your sample from the moment it leaves your door in the KYG portal. No post office. No queue.',
      },
      {
        num: '04',
        icon: `${SIC}/icon-step-4.svg`,
        title: 'Our lab processes your sample',
        subHtml: "India's highest certified lab. Every result checked by a scientist.",
        bodyHtml:
          "Your sample goes to Neotech World Lab, which holds India's highest official lab certification (NABL). They use professional gene-reading technology to process your sample. A qualified scientist reviews your specific results before your report is released. It is not automated. A person checks your results.",
      },
      {
        num: '05',
        icon: `${SIC}/icon-step-5.svg`,
        title: 'Your report is ready in 7 days',
        subHtml: 'Delivered to your account. Explained by a real person.',
        bodyHtml:
          "Your Women's Health report arrives in your KYG account. Five health checks, each with a plain-language result, a risk level, and a clear action step. Within 2 days of your report being delivered, a GENEous Care counsellor reaches out to schedule your free 30-minute session.",
        dark: true,
      },
    ],
    ctaLabel: 'Order my kit',
    ctaHref: '#order',
    fineprint: 'Delivered in 2-3 days · Takes 5 minutes to collect · Results in 7 days',
  },

  care: {
    eyebrow: 'Included free with every report',
    titleHtml: 'You will not read this report alone.',
    leadHtml:
      "GENEous Care is KYG's free counselling service. A real expert reaches out after your results and walks you through everything, on WhatsApp, in plain language, without any medical jargon.",
    bodyHtml:
      'Most genetic testing brands send you a report and a link to a help page. KYG gives you a 30-minute conversation with a qualified counsellor who has read your specific results and can tell you what each one actually means for your life, your health decisions, and your next steps.',
    minis: [
      {
        title: 'What it is',
        bodyHtml:
          "A free 30-minute session with a trained genetic counsellor. Included with every Women's Health report.",
      },
      {
        title: 'How it works',
        bodyHtml: 'Within 2 days of your report, your counsellor gets in touch over WhatsApp call or video.',
      },
      {
        title: 'What you get',
        bodyHtml:
          'A plain-language explanation of all five results, what each means and when to see a doctor.',
      },
    ],
    pullQuoteHtml: '"Genetic care, done the GENEous way."',
    chatTitle: 'GENEous Care',
    chatStatus: 'Genetic counsellor · online',
    chat: [
      {
        from: 'them',
        textHtml: "Hi! I've read through your Women's Health report. Free to chat for 30 mins this week?",
      },
      { from: 'me', textHtml: 'Yes, what does my PCOS result mean for me?' },
      {
        from: 'them',
        textHtml:
          "It's a normal-risk result, that's good news. Here's exactly what to keep an eye on for your cycle and weight. I'll explain it all on the call 👍",
      },
    ],
    coversTitle: 'What your counsellor covers',
    covers: [
      '<b>PCOS:</b> what your result means for your cycle, weight management, and fertility planning.',
      '<b>Pregnancy:</b> whether your result means you should take any steps before trying to conceive, including specific supplements.',
      '<b>Depression:</b> how to prepare emotionally and medically if your result shows higher sensitivity, and what to tell your doctor.',
      '<b>Bones:</b> which foods, exercises, and supplements are most important given your specific result.',
      '<b>Joints:</b> whether your result warrants early monitoring and what early signs to watch for.',
      '<b>Your overall picture:</b> how your five results connect and what to prioritise first.',
    ],
  },

  trust: {
    eyebrow: 'Backed by science that holds up under the highest scrutiny',
    titleHtml: 'Every result is verified. Every report is checked by a scientist.',
    certs: [
      { img: `${SHARED}/cert-nabl.png`, alt: 'NABL', label: 'NABL MC-6400' },
      { img: `${SHARED}/cert-iso-9001.png`, alt: 'ISO 9001:2015', label: 'ISO 9001:2015' },
      { img: `${SHARED}/cert-iso-27001.png`, alt: 'ISO 27001:2013', label: 'ISO 27001:2013' },
      { img: `${SHARED}/cert-acmg.png`, alt: 'ACMG', label: 'ACMG' },
      { svg: `${SIC}/cert-cpic.svg`, alt: 'CPIC', label: 'CPIC' },
      { img: `${SHARED}/cert-hipaa.png`, alt: 'HIPAA', label: 'HIPAA' },
      { img: `${SHARED}/cert-fda.png`, alt: 'FDA', label: 'FDA' },
    ],
    rows: [
      {
        label: 'NABL Accredited (ISO 15189) · MC-6400',
        descHtml:
          "India's highest official certification for testing labs. Your sample is handled under strict, independently verified standards. Not all labs have this.",
      },
      {
        label: 'ISO 9001:2015 + ISO 27001:2013',
        descHtml:
          'Two international certifications: one for quality management, one for data security. Your personal and genetic data is protected at every step.',
      },
      {
        label: 'ACMG + CPIC Guidelines',
        descHtml:
          "Your report follows the guidelines of two of the world's leading bodies in genetic science. The same standards used by top hospitals internationally.",
      },
      {
        label: 'Illumina Genotyping Technology',
        descHtml:
          "The same gene-reading technology used by the world's largest genetic testing companies. Results are 99%+ accurate.",
      },
      {
        label: 'HIPAA + FDA Standards',
        descHtml:
          'Your data is handled under international privacy rules. KYG never sells or shares your information with anyone, ever.',
      },
    ],
    expert: {
      initials: 'VS',
      name: 'Dr. Varun Sharma, Ph.D',
      role: '· Genetic Scientist',
      lab: 'Neotech World Lab Pvt. Ltd., MG Road, Gurugram',
      bodyHtml:
        "Every Women's Health report is personally reviewed by Dr. Sharma's team before it reaches you. Not automated. A trained scientist reads your results.",
      accuracyHtml: 'Accuracy: 99%+ reproducibility. Fewer than 2% of samples ever need rechecking.',
    },
  },

  faq: {
    eyebrow: 'Questions women ask before they test',
    titleHtml: 'Common questions.',
    items: [
      {
        q: 'Do I need to be planning a pregnancy to take this test?',
        aHtml:
          'No. This test is useful for any woman who wants to understand her hormonal health, fertility, bone strength, and joint health, whether you are planning a family now, later, or not at all. Many women take it simply as an early health check, before marriage, or to understand conditions like PCOS that affect them right now.',
      },
      {
        q: 'I already have PCOS. Is this test still useful for me?',
        aHtml:
          "Yes. Knowing your genetic profile helps you and your doctor understand the drivers behind your PCOS and the connected risks it carries, such as type 2 diabetes. It also covers four other areas, pregnancy, post-pregnancy depression, bone strength, and joint health, so you get a fuller picture of your genetic health, not just PCOS.",
      },
      {
        q: 'What does a Poor or High Risk result actually mean?',
        aHtml:
          'It means your genes are linked to a higher-than-average risk for that condition, not that you have it or definitely will. It is an early flag that lets you act sooner. Your report tells you exactly what to do, and your free counselling session explains it in plain language.',
      },
      {
        q: 'Can I take this test while I am pregnant?',
        aHtml:
          'Yes. The test only needs a saliva sample and is completely safe during pregnancy. Your genes do not change, so the results are valid whenever you take it. If you are already pregnant, the pregnancy and post-pregnancy results can help you and your doctor plan the months ahead.',
      },
      {
        q: 'Is this a medical or diagnostic test?',
        aHtml:
          'This is a wellness and risk-screening test, not a diagnostic one. It identifies genetic tendencies and predispositions. It does not diagnose any condition and is not a substitute for professional medical advice. Discuss results with a qualified doctor before making clinical decisions.',
      },
      {
        q: 'Do I need to fast or prepare before collecting my sample?',
        aHtml:
          'No. There is no fasting and no preparation. Just avoid eating, drinking, or smoking for about 30 minutes before you collect your sample. The instruction card inside the kit walks you through the simple steps.',
      },
      {
        q: 'Can my partner take the Men’s Health test at the same time?',
        aHtml:
          "Yes, and we recommend it for couples planning marriage or a family. The Women's + Men's Health combination is the core of our 'Know Before You Begin' bundle, one saliva kit each and a joint counselling session.",
      },
      {
        q: 'When does the kit arrive and when do I get my results?',
        aHtml:
          'Your kit is delivered in 2 to 3 days. Collection takes about 5 minutes at home. Once the lab receives your sample, your report is ready in 7 days and delivered digitally to your KYG account.',
      },
      {
        q: 'What if I have questions after reading my report?',
        aHtml:
          'Every report includes a free 30-minute GENEous Care session on WhatsApp. A trained genetic counsellor who has read your specific results explains each one and the exact steps to take. You can ask anything.',
      },
    ],
  },

  bundlesSection: {
    eyebrow: 'Or bundle & save',
    titleHtml: 'Planning a family or getting married? These go further together.',
    items: WOMENS_BUNDLES,
  },

  finalCta: {
    titleHtml: 'Every 1 out of 5 Indian women has PCOS.<br />Most never learn why. But you can.',
    subHtml:
      'Five health checks. One saliva kit. The genetic picture every Indian woman deserves to have.',
    ctaLabel: "Get my Women's Health report",
    ctaHref: '#order',
    fineprint1: 'At-home saliva kit · NABL Certified Lab · Results in 7 days · Free counselling included',
    fineprint2:
      'Certified lab · 99%+ accuracy · Your data stays private · Free GENEous Care session with every report',
  },
};

/** All test pages served by the (tests) routes. */
export const TEST_PAGES: TestPage[] = [mensHealth, womensHealth];

export function getTestPage(slug: string): TestPage | undefined {
  return TEST_PAGES.find((t) => t.slug === slug);
}
