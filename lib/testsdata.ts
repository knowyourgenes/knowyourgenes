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

// =============================================================================
// ancestry - 1:1 rebuild of the Figma "Ancestory - Desktop" design.
// Ancestry is structurally different from the health tests, so it uses the
// OPTIONAL sections added to TestPage: `discoveryLayers` (in place of `pains`),
// `regionsTable` (in place of `sampleReport`), `giftSection`, and the trust
// `traceNote`. The shared sections (hero, stat, howItWorks, care, faq, bundles,
// finalCta) map as usual. Only the hero map image is ancestry-specific (ABASE).
// =============================================================================

const ABASE = '/tests/ancestry';

const ANCESTRY_BUNDLES: Bundle[] = [
  {
    key: 'complete',
    theme: 'recommended',
    icon: `${SIC}/bundle-complete.svg`,
    badge: 'Most complete',
    title: 'The Complete You',
    subtitle: 'All 5 reports + Ancestry',
    desc: 'The most complete genetic picture of yourself available in India. Where you came from, and how your genes shape your health.',
    bestFor: '<b>Best for:</b> the person who wants everything.',
    ctaLabel: 'View bundle',
    href: '#',
  },
  {
    key: 'roots-wellness',
    theme: 'complete',
    icon: `${SIC}/bundle-kbyb.svg`,
    title: 'Know Your Roots + Wellness',
    subtitle: 'Ancestry + My Wellness',
    desc: 'Your heritage story paired with personalised diet, weight, fitness, and detox insights.',
    bestFor: '<b>Best for:</b> wellness-curious users who also want to know their origins.',
    ctaLabel: 'View bundle',
    href: '#',
  },
  {
    key: 'family-heritage',
    theme: 'couple',
    icon: `${SIC}/bundle-couple.svg`,
    title: 'Family Heritage Pack',
    subtitle: 'Ancestry kits for two or more',
    desc: 'Compare ancestry breakdowns across generations. See which traits came from which side of the family.',
    bestFor: '<b>Best for:</b> parents and adult children. Siblings. Multi-generational families.',
    ctaLabel: 'View bundle',
    href: '#',
  },
];

export const ancestry: TestPage = {
  slug: 'ancestry',
  categorySlug: 'wellness',

  seo: {
    title: 'Ancestors In Me · Ancestry DNA · KYG · Know Your Genes',
    description:
      'Your DNA carries a story that goes back 50,000 years. 42,000+ genetic markers across up to 10 global regions, plus a written Gene Journey narrative. One at-home saliva sample reads all of it.',
  },

  sidebar: {
    eyebrow: 'Bundles',
    introHtml: 'Want the complete picture? Ancestry and health together.',
    bundles: ANCESTRY_BUNDLES,
    noteHtml:
      'The most thoughtful thing you can give someone is their story. <b>Ancestors In Me</b> makes a genuinely meaningful gift.',
  },

  hero: {
    badges: [
      { label: 'Ancestors In Me' },
      { label: '42,000+ markers analysed' },
      { label: '10 global regions' },
    ],
    titleHtml: 'KYC toh kar liya.<br /><span class="hl">Ab apni asli identity jaano.</span>',
    anchorWord: 'The story no family tree can tell.',
    bodyHtml:
      'You have proved who you are on paper. But your DNA carries a story that goes back 50,000 years, across continents and civilisations you have never heard of. <b>One saliva sample reads all of it.</b>',
    ctaLabel: 'Discover my ancestors',
    ctaHref: '#order',
    ctaNoteHtml: 'At-home saliva kit · No needles · 42,000+ markers · Results in 7 days',
    trust: [
      { icon: 'saliva', line1: 'At-home saliva kit', line2: 'No clinic visit' },
      { icon: 'needle', line1: 'No needles', line2: '5-min collection' },
      { icon: 'clock', line1: '42,000+ markers', line2: 'High resolution' },
      { icon: 'chat', line1: 'Results in 7 days', line2: 'Delivered digitally' },
    ],
    image: `${ABASE}/hero-map.png`,
    imageAlt: 'A world map tracing ancient migrations across continents',
    imageCaption: 'The migrations, trade routes, and civilisations in your DNA',
    stats: [
      { num: '42,000+', label: 'Markers' },
      { num: '10', label: 'Global regions' },
      { num: 'NABL', label: 'Certified lab' },
      { num: '7 days', label: 'Results' },
    ],
  },

  discoveryLayers: {
    eyebrow: 'The discovery layers',
    titleHtml: 'Your ancestry story has four chapters. Here is what each one reveals.',
    items: [
      {
        key: 'primary',
        accent: 'primary',
        label: 'Layer 1 · Primary ancestry',
        question: 'What is my largest ancestral origin?',
        bodyHtml: [
          'Your primary ancestry is the largest percentage in your result — the population group your genetic lineage is most strongly connected to. For most Indians this will be South Asian, but the specific breakdown within that can still be surprising, because South Asian itself is a layered history going back to the Indus Valley civilisation and beyond.',
          'This is not just a number. It is the main chapter of a story your family has been carrying in its cells for thousands of years.',
        ],
        cardTitle: 'What your report shows',
        shows: [
          'Your largest ancestry percentage and the population group it connects to',
          'A full-colour pie chart showing how your total ancestry breaks down across all regions',
          'Plain-language context explaining what that primary origin means historically',
        ],
        noteHtml:
          "Sample result: '72.91% South Asian — your roots are firmly established in the subcontinent, with lineages that trace to some of the oldest known human settlements in the region'",
      },
      {
        key: 'secondary',
        accent: 'secondary',
        label: 'Layer 2 · Secondary origins',
        question: 'What other parts of the world are in my DNA?',
        bodyHtml: [
          'Beyond your primary origin, your DNA carries chapters from other parts of the world. These are not errors. They are evidence of the ancient migrations, trade routes, and population movements that made India one of the most genetically diverse countries on earth.',
          'A Malayan connection speaks to ancient sea trade routes between India and Southeast Asia that existed thousands of years before recorded history. A South Central Asian thread echoes the migrations of people from the Central Asian steppes that shaped the entire Indian subcontinent. A West Caucasian trace connects to populations that moved through what is now Iran, Afghanistan, and the Caucasus mountains.',
        ],
        cardTitle: 'What your report shows',
        shows: [
          'All secondary ancestry percentages above approximately 1%, each with a region label',
          'Plain-language context for each connection — what migration or historical event it likely reflects',
        ],
        chips: ['Malayan 7.79%', 'South Central Asian 7.13%', 'West Caucasian 6.21%'],
        noteHtml:
          'Most Indian users are genuinely surprised by their secondary results. This is the section people talk about at family dinners.',
      },
      {
        key: 'trace',
        accent: 'trace',
        label: 'Layer 3 · Trace origins',
        question: 'What are the smallest, most unexpected ancestry traces in my result?',
        bodyHtml: [
          'Even in percentages below 2%, sometimes below 1%, your DNA carries genetic signals from populations you would never expect. These tiny traces are not noise in the data. They are the oldest stories in human history, encoded in your cells and passed down through hundreds of generations to land, quietly, in you.',
          "An East African trace connects you to humanity's oldest known ancestral populations, the people who first walked out of Africa 50,000 to 70,000 years ago. An Amerindian fragment hints at connections that predate any modern understanding of cross-continental contact. A Pygmy trace carries some of the oldest genetic lineages that exist in humans anywhere on earth.",
        ],
        cardTitle: 'What your report shows',
        shows: [
          'All trace ancestry percentages, even those below 1%, clearly labelled by region',
          'An explanation of what each trace connection represents in human migration history',
        ],
        chips: [
          'East African 1.59%',
          'Armenian 1.49%',
          'Amerindian 1.47%',
          'Near Eastern 0.82%',
          'Oceanian 0.33%',
          'Pygmy 0.26%',
        ],
        noteHtml: 'These are the results most people screenshot and send to their families immediately.',
      },
      {
        key: 'journey',
        accent: 'journey',
        label: 'Layer 4 · Gene Journey narrative',
        question: 'Do I get a written story of my ancestry, not just numbers?',
        bodyHtml: [
          '<b>Yes.</b> The Ancestors In Me report includes a written Gene Journey narrative — a personalised story written in flowing language that explains your ancestry results as a human journey across time and continents, not as a table of percentages.',
          'This is the part of the report most people share with their families. It reads like a story, because it is one.',
        ],
        cardTitle: 'Sample Gene Journey narrative excerpt',
        quoteHtml:
          '"Your ancestry story unfolds like a fascinating journey through time and across continents. The largest part of your genetic heritage is deeply rooted in South Asia, painting the primary narrative of your lineage. However, your story does not end there. A significant chapter traces back to the Malayan region, connecting you to the vibrant cultures of Southeast Asia. Further threads reach into Central Asia, the Caucasus, and beyond, each one a chapter of a journey that began long before history was written down."',
        noteHtml:
          'This is an excerpt from an actual sample report. Your Gene Journey will be unique to your ancestry breakdown.',
      },
    ],
  },

  stat: {
    quoteHtml: 'Most Indians can trace their family back two or three generations.',
    subQuoteHtml: 'Your DNA can trace it back <b>50,000 years.</b>',
    emphasisHtml: 'Across continents. Through civilisations. All the way back to the first humans who walked out of Africa.',
    bodyHtml:
      'Your family name, your gotra, your village — these tell one chapter of your story. Your DNA tells all of them. India is one of the most genetically diverse countries on earth, shaped by migrations, trade routes, and cross-cultural contact over thousands of years. Your ancestry is almost certainly more layered and more surprising than you have been told.',
    bigNum: '50,000',
    bigNumLabel: 'years of your story, in one saliva sample',
    ctaLabel: 'Discover my ancestors',
    ctaHref: '#order',
    fineprint: 'Kit delivers in 2-3 days · Results in 7 days · Tap to order',
  },

  regionsTable: {
    eyebrow: 'The 10 global regions',
    titleHtml: 'Up to 10 global regions. Your DNA mapped across human history.',
    introHtml:
      'Your ancestry result is expressed as a percentage across these population groups, based on 42,000+ genetic markers. Most people appear in 6 to 8 of these regions. Every result is unique.',
    headers: ['Region', 'Sample %', 'What it connects to'],
    rows: [
      {
        region: 'South Asian',
        pct: '~73%',
        connectsHtml:
          'The primary ancestry for most Indians. Encompasses the ancient Indus Valley civilisation, Dravidian populations, and Indo-Aryan lineages. The oldest continuous human settlements in the region.',
      },
      {
        region: 'Malayan',
        pct: '~8%',
        connectsHtml:
          'Connections to Southeast Asia. Reflects ancient sea trade routes between the Indian coast and the Malay Peninsula that existed thousands of years before recorded history.',
      },
      {
        region: 'South Central Asian',
        pct: '~7%',
        connectsHtml:
          'People from the ancient Central Asian steppes who migrated south through modern-day Afghanistan and Iran into the Indian subcontinent. A major chapter in South Asian genetic history.',
      },
      {
        region: 'West Caucasian',
        pct: '~6%',
        connectsHtml:
          'Populations from the Caucasus mountain region — the area between the Black Sea and Caspian Sea, covering modern-day Georgia, Armenia, and Azerbaijan. Connected to ancient Indo-European migration routes.',
      },
      {
        region: 'East African',
        pct: '~1.6%',
        connectsHtml:
          "Some of humanity's oldest known genetic lineages. The direct ancestral populations of the people who first walked out of Africa 50,000 to 70,000 years ago. All humans carry this connection — yours is just a little more visible.",
      },
      {
        region: 'Armenian',
        pct: '~1.5%',
        connectsHtml:
          "An ancient Near Eastern population with deep connections to early Indo-European migrations and some of the world's earliest settled civilisations. Historically connected to trade routes through Persia and the Levant.",
      },
      {
        region: 'Amerindian',
        pct: '~1.5%',
        connectsHtml:
          'Indigenous American genetic traces. Among the most surprising findings for Indian users. Likely reflects ancient migration patterns that connected populations across continents long before European contact.',
      },
      {
        region: 'Near Eastern',
        pct: '~0.8%',
        connectsHtml:
          'Populations from the Fertile Crescent region — modern-day Iraq, Syria, Lebanon, and Israel. The birthplace of agriculture and some of the earliest urban civilisations in human history.',
      },
      {
        region: 'Oceanian',
        pct: '~0.3%',
        connectsHtml:
          'Connections to Pacific island populations. Reflects ancient maritime movement patterns across the Indian Ocean and beyond, carried by some of the most adventurous navigators in early human history.',
      },
      {
        region: 'Pygmy',
        pct: '~0.3%',
        connectsHtml:
          "Carries some of the oldest genetic lineages that exist in any human population. Forest-dwelling peoples of Central Africa whose genetic lineage branched from the main human tree very early in our species' history.",
      },
    ],
    footnote:
      "Percentages shown are illustrative sample results. Your actual ancestry breakdown will be unique to your genetic profile. Not all regions appear in every individual's result.",
  },

  howItWorks: {
    eyebrow: 'How it works',
    titleHtml: 'From your door to your Gene Journey.',
    introHtml: 'No clinic, no needle, no hassle.',
    image: `${SHARED}/how-it-works-physician.png`,
    imageAlt: 'A scientist reviewing genetic analysis',
    steps: [
      {
        num: '01',
        icon: `${SIC}/icon-step-1.svg`,
        title: 'Order online',
        subHtml: 'Your kit arrives in 2 to 3 days.',
        bodyHtml:
          'We send the kit straight to your address. Inside: a saliva collection tube, a simple step-by-step instruction card, and a pre-paid return envelope already addressed to the lab. Everything is included. Nothing to arrange. Any family member aged 18 or above can take this test.',
      },
      {
        num: '02',
        icon: `${SIC}/icon-step-2.svg`,
        title: 'Collect your sample at home in 5 minutes',
        subHtml: 'No needles. No appointments. No preparation.',
        bodyHtml:
          'Open the tube. Spit into it. Seal it. That is the entire collection. No fasting, no clinic visits, no changing your routine. The instruction card inside walks you through every step. Most people do it at their kitchen table on a Sunday morning.',
      },
      {
        num: '03',
        icon: `${SIC}/icon-step-3.svg`,
        title: 'Drop it with the courier',
        subHtml: 'Pre-paid envelope. Pre-labelled. You just hand it over.',
        bodyHtml:
          'Place the sealed tube in the pre-paid return envelope included in your kit. A courier picks it up from your address at a time you choose. You can track it in the KYG portal from the moment it leaves your door. No post office, no queue.',
      },
      {
        num: '04',
        icon: `${SIC}/icon-step-4.svg`,
        title: 'Our lab analyses your DNA',
        subHtml: "42,000+ markers. India's highest certified lab. Every result checked.",
        bodyHtml:
          "Your sample goes to Neotech World Lab, which holds India's highest official lab certification (NABL). They use the Illumina iScan genotyping platform — the same technology used in major global ancestry research — to read 42,000+ genetic markers in your sample. A qualified scientist reviews your results before your report is released.",
      },
      {
        num: '05',
        icon: `${SIC}/icon-step-5.svg`,
        title: 'Your Gene Journey arrives in 7 days',
        subHtml: 'Delivered to your account. A story, not just a spreadsheet.',
        bodyHtml:
          'Your Ancestors In Me report is delivered to your KYG account. It includes your full ancestry percentage breakdown across all regions, a full-colour ancestry chart, and your personalised Gene Journey narrative — the written story of where your lineage has been. Within 2 days of your report arriving, a GENEous Care counsellor reaches out to book your free 30-minute session.',
        dark: true,
      },
    ],
    ctaLabel: 'Order my kit',
    ctaHref: '#order',
    fineprint: 'Delivered in 2-3 days · Takes 5 minutes to collect · Gene Journey ready in 7 days',
  },

  care: {
    eyebrow: 'Included free with every report',
    titleHtml: 'Your Gene Journey is more interesting with someone who can explain it.',
    leadHtml:
      "GENEous Care is KYG's free counselling service. A real expert reaches out after your results and walks you through your ancestry breakdown — what each region means, what surprised other people with similar results, and how to explore further.",
    bodyHtml:
      'The Ancestors In Me report has a lot inside it. A counsellor who has seen hundreds of Indian ancestry results can put yours in context in a way the report alone cannot. They have watched people discover connections that changed how they thought about their family, their region, and their history.',
    minis: [
      {
        title: 'What it is',
        bodyHtml:
          'A free 30-minute session with a trained genetic counsellor. Included with every Ancestors In Me report. No extra charge.',
      },
      {
        title: 'How it works',
        bodyHtml:
          'Your report arrives. Within 2 days, your counsellor gets in touch to fix a time. The session happens over WhatsApp call or video, at a time that works for you.',
      },
      {
        title: 'What you get',
        bodyHtml:
          'A plain-language walkthrough of your ancestry breakdown. Context for each region. Answers to questions your family will ask. Help with any trace results that surprised you.',
      },
    ],
    pullQuoteHtml: '"Genetic care, done the GENEous way."',
    chatTitle: 'GENEous Care',
    chatStatus: 'Genetic counsellor · online',
    chat: [
      {
        from: 'them',
        textHtml:
          'Just read your Gene Journey — you have a 1.47% Amerindian trace, which is genuinely fascinating! 🌍',
      },
      { from: 'me', textHtml: 'Wait, how do Indians end up with that?' },
      {
        from: 'them',
        textHtml:
          "It points to very ancient migration patterns across continents. I'll walk you and your family through the whole story on the call 👍",
      },
    ],
    coversTitle: 'What your counsellor covers in your session',
    covers: [
      '<b>Your primary result:</b> what your dominant ancestry means historically and geographically.',
      '<b>Your secondary results:</b> the migration events and historical moments that likely explain each connection.',
      '<b>Your trace results:</b> what the smallest percentages reveal about ancient human movement.',
      '<b>Your Gene Journey narrative:</b> helping you understand and share the written story of your ancestry.',
      '<b>Next steps:</b> whether you want to pair your ancestry result with a health report for a more complete picture.',
      '<b>Family context:</b> how to share and discuss your results with older family members who may hold pieces of the story.',
    ],
  },

  trust: {
    eyebrow: '42,000+ markers. The highest resolution ancestry panel available in India.',
    titleHtml: 'The science behind your Gene Journey.',
    certs: [
      { img: `${SHARED}/cert-nabl.png`, alt: 'NABL', label: 'NABL MC-6400' },
      { img: `${SHARED}/cert-iso-9001.png`, alt: 'ISO 9001:2015', label: 'ISO 9001:2015' },
      { img: `${SHARED}/cert-iso-27001.png`, alt: 'ISO 27001:2013', label: 'ISO 27001:2013' },
    ],
    rows: [
      {
        label: 'Illumina iScan Infinium SNP Genotyping',
        descHtml:
          'The gold standard technology for ancestry analysis worldwide. The same platform used in major global population genetics research. 42,000+ markers means your result has significantly higher resolution than most ancestry tests available in India.',
      },
      {
        label: 'NABL Accredited (ISO 15189) — MC-6400',
        descHtml:
          "India's highest official certification for testing labs. Your sample is processed under independently verified, audited conditions.",
      },
      {
        label: '99%+ Reproducibility, 98%+ Call Rate',
        descHtml:
          'If the same sample was tested again, it would produce the same result more than 99% of the time. Fewer than 2% of markers in any sample ever need re-reading. This is a scientific accuracy benchmark, not a marketing claim.',
      },
      {
        label: 'ADMIXTURE Algorithm',
        descHtml:
          'The ancestry percentages are calculated using ADMIXTURE, a well-established scientific method for estimating ancestral origins from genetic data. It compares your DNA to reference populations from around the world to estimate where your lineage came from.',
      },
      {
        label: 'ISO 27001:2013 Data Security',
        descHtml:
          'Your genetic data is protected at every step. KYG never sells or shares your information with anyone. Your sample is destroyed after processing.',
      },
    ],
    traceNote: {
      title: 'A note on trace percentages',
      items: [
        'Trace results (those below 2%) are real genetic signals, not errors.',
        'They reflect ancient human migrations that happened long before recorded history.',
        'However, they should be interpreted as indicative rather than definitive, because at very small percentages, the signal is real but the precision of the regional assignment is broader.',
        'Your GENEous Care counsellor will help you understand what your trace results mean and which ones to explore further.',
      ],
    },
    expert: {
      initials: 'VS',
      name: 'Dr. Varun Sharma, Ph.D',
      role: '· Genetic Scientist, Neotech World Lab',
      lab: 'Based at: Neotech World Lab Pvt. Ltd., MG Road, Gurugram',
      bodyHtml:
        "Ancestry analysis performed using custom Illumina iScan Infinium array platform. Every Ancestors In Me report is reviewed by Dr. Sharma's team before it reaches you.",
      accuracyHtml:
        'Accuracy: 99%+ reproducibility. Reference population databases updated continuously as the science evolves.',
    },
  },

  faq: {
    eyebrow: 'Before you discover your ancestors',
    titleHtml: 'Questions people ask before they discover their ancestors.',
    items: [
      {
        q: 'How accurate is the ancestry result?',
        aHtml:
          'Very. Your sample is read on the Illumina iScan platform across 42,000+ genetic markers, with 99%+ reproducibility and a 98%+ call rate, and the percentages are calculated using the well-established ADMIXTURE algorithm. Primary and secondary origins are highly reliable; the smallest trace percentages are real signals but should be read as indicative rather than exact.',
      },
      {
        q: 'Will my result only show Indian ancestry?',
        aHtml:
          'Almost never. For most Indians, South Asian is the largest share, but India is one of the most genetically diverse countries on earth. Thousands of years of migration and trade mean most people appear in 6 to 8 regions, often with surprising secondary and trace connections across Asia, the Caucasus, Africa, and beyond.',
      },
      {
        q: 'Is this test the same as the health reports?',
        aHtml:
          'No. Ancestors In Me analyses your genetic heritage — where your lineage comes from — not your health risks. It does not report on any medical or wellness conditions. If you want both, the "The Complete You" bundle pairs your ancestry result with all five health reports.',
      },
      {
        q: 'Can this test confirm my caste, gotra, or regional identity?',
        aHtml:
          'No. Ancestry testing estimates the broad population groups your DNA connects to across human history. It cannot confirm caste, gotra, sub-community, or a specific village or family. It tells you about deep genetic origins and ancient migrations, not social or administrative identity.',
      },
      {
        q: 'Can I gift this to a family member?',
        aHtml:
          'Yes, and it is one of the most meaningful gifts you can give. Any family member aged 18 or above can take the test at home. The written Gene Journey narrative in particular is something people love to share with parents and grandparents. The Family Heritage Pack lets two or more people compare their breakdowns.',
      },
      {
        q: 'Will my ancestry result change over time?',
        aHtml:
          'Your DNA never changes, so your core result stays the same. The regional percentages can be refined over time as the reference population databases grow and the science improves. If your report is meaningfully updated, the more accurate breakdown replaces the earlier one in your KYG account.',
      },
      {
        q: 'Do I need to fast or prepare before collecting my sample?',
        aHtml:
          'No. There is no fasting and no preparation. Just avoid eating, drinking, or smoking for about 30 minutes before you collect your saliva. The instruction card inside the kit walks you through the simple steps.',
      },
      {
        q: 'What if I have questions after reading my report?',
        aHtml:
          'Every report includes a free 30-minute GENEous Care session on WhatsApp. A trained genetic counsellor who has read your specific ancestry breakdown explains what each region means, puts your trace results in context, and helps you share the story with your family. You can ask anything.',
      },
    ],
  },

  giftSection: {
    eyebrow: 'The most thoughtful thing you can give someone is their story',
    titleHtml: 'Ancestors In Me makes a genuinely meaningful gift.',
    introHtml:
      "For parents who have always wondered about the family's real origins. For grandparents who carry stories of migrations they never fully understood. For NRI family members in the UK, US, Canada, or the Middle East who feel the question of 'where do we really come from' more keenly than anyone.",
    cards: [
      {
        title: 'For parents',
        bodyHtml:
          'A discovery they would never think to give themselves. The Gene Journey narrative in particular is something most parents want to share with their own parents.',
        bestForHtml: '<b>Best for:</b> Mother’s Day, Father’s Day, birthdays, anniversaries.',
      },
      {
        title: 'For NRI family',
        bodyHtml:
          'For Indians living abroad, the question of heritage often feels more urgent, not less. The Ancestors In Me report gives it a real, scientific answer.',
        bestForHtml: '<b>Best for:</b> gifting to family members in UK, US, Canada, Australia, UAE.',
      },
      {
        title: 'For the curious',
        bodyHtml:
          'For anyone who has ever looked at the diversity of India and wondered what their own specific thread in that story is.',
        bestForHtml: '<b>Best for:</b> anyone who has already done their KYC and is ready to do their KYG.',
      },
    ],
    ctaLabel: 'Gift this test',
    ctaHref: '#order',
  },

  bundlesSection: {
    eyebrow: 'Or bundle & save',
    titleHtml: 'Want the complete picture? Ancestry and health together.',
    items: ANCESTRY_BUNDLES,
  },

  finalCta: {
    titleHtml: 'Your story is older than your surname.<br />Find out how old.',
    subHtml:
      '42,000+ genetic markers. Up to 10 global regions. One saliva kit. The ancestry story you have been carrying your entire life, finally told.',
    ctaLabel: 'Discover my ancestors',
    ctaHref: '#order',
    fineprint1: 'At-home saliva kit · NABL Certified Lab · Gene Journey in 7 days · Free counselling included',
    fineprint2:
      'Certified lab · 42,000+ markers · 99%+ accuracy · Your data stays private · Free GENEous Care session included',
  },
};

// =============================================================================
// myWellness - 1:1 rebuild of the Figma "My Wellness - Desktop" design.
// One kit, four sub-reports (Diet / Weight / Fitness / Detox), 52 traits. Uses
// the optional `traitReports` (in place of `pains`) and `traitsCatalog` (in
// place of `sampleReport`) sections. Everything else maps to shared sections.
// Only the hero image is My-Wellness-specific (WLBASE).
// =============================================================================

const WLBASE = '/tests/my-wellness';

// Sidebar shows the first three; the bundles section shows all four.
const WELLNESS_BUNDLES: Bundle[] = [
  {
    key: 'complete',
    theme: 'recommended',
    icon: `${SIC}/bundle-complete.svg`,
    badge: 'Most complete',
    title: 'The Complete You',
    subtitle: 'All 5 KYG reports',
    desc: "My Wellness + Women's or Men's Health + Ancestry. The most complete genetic picture of yourself.",
    ctaLabel: 'View bundle',
    href: '#',
  },
  {
    key: 'wellness-womens',
    theme: 'complete',
    icon: `${SIC}/bundle-kbyb.svg`,
    title: "My Wellness + Women's Health",
    subtitle: 'For women who want wellness + health',
    desc: 'Diet, Weight, Fitness, Detox, plus PCOS, pregnancy, bone, joint, and depression risk.',
    bestFor: '<b>Best for:</b> health-conscious women 25-45.',
    ctaLabel: 'View bundle',
    href: '#',
  },
  {
    key: 'wellness-mens',
    theme: 'couple',
    icon: `${SIC}/bundle-couple.svg`,
    title: "My Wellness + Men's Health",
    subtitle: 'For men who want wellness + health',
    desc: 'Diet, Weight, Fitness, Detox, plus hormones, fertility, and hair loss risk.',
    bestFor: '<b>Best for:</b> health-conscious men 25-45.',
    ctaLabel: 'View bundle',
    href: '#',
  },
  {
    key: 'kbyb',
    theme: 'complete',
    icon: `${SIC}/bundle-kbyb.svg`,
    title: 'Know Before You Begin',
    subtitle: 'For couples',
    desc: "My Wellness + Women's Health + Men's Health + joint counselling.",
    bestFor: '<b>Best for:</b> couples planning a family.',
    ctaLabel: 'View bundle',
    href: '#',
  },
];

export const myWellness: TestPage = {
  slug: 'my-wellness',
  categorySlug: 'wellness',

  seo: {
    title: 'My Wellness DNA · KYG · Know Your Genes',
    description:
      'Diet, weight, fitness, and detox — 52 genetic traits across four reports from a single saliva kit. Understand why the same diet, effort, and training give you different results.',
  },

  sidebar: {
    eyebrow: 'Bundles',
    introHtml: 'Want to go even further? These bundles take My Wellness further.',
    bundles: WELLNESS_BUNDLES.slice(0, 3),
    noteHtml:
      'Every kit includes a <b>free 30-minute GENEous Care</b> session across all four reports.',
  },

  hero: {
    badges: [
      { label: 'My Wellness' },
      { label: '4 reports' },
      { label: '52 traits' },
      { label: '1 saliva kit' },
    ],
    titleHtml: 'Same diet. Same effort. Different results.<br /><span class="hl">Your genes explain why.</span>',
    anchorWord: 'How well your body handles what it is exposed to.',
    bodyHtml:
      'Four questions your body has been answering in its own way for years. My Wellness reads the genetic instructions behind each one. One saliva kit. Four reports. <b>52 traits that finally explain your body to you.</b>',
    ctaLabel: 'Get my Wellness report',
    ctaHref: '#order',
    ctaNoteHtml: 'At-home saliva kit · No needles · 4 reports · Results in 7 days · Free counselling',
    trust: [
      { icon: 'saliva', line1: 'At-home saliva kit', line2: 'No clinic visit' },
      { icon: 'needle', line1: '4 reports in 1 kit', line2: '52 traits' },
      { icon: 'clock', line1: 'Results in 7 days', line2: 'Delivered digitally' },
      { icon: 'chat', line1: 'Free counselling', line2: 'On WhatsApp' },
    ],
    image: `${WLBASE}/hero-wellness.png`,
    imageAlt: 'Diet, weight, fitness and detox lifestyle',
    imageCaption: 'Diet, weight, fitness & detox — the instructions your body came with',
    stats: [
      { num: '52', label: 'Traits tested' },
      { num: '4', label: 'Reports in 1 kit' },
      { num: 'NABL', label: 'Certified lab' },
      { num: '7 days', label: 'Results' },
    ],
  },

  traitReports: {
    eyebrow: 'The four tests',
    titleHtml: 'One kit unlocks four reports. Each one answers a question your body has been asking.',
    items: [
      {
        key: 'diet',
        accent: 'diet',
        label: 'Report 1 · My Diet DNA',
        question: 'Why does the same diet work for some people and not others?',
        bodyHtml: [
          'Because how you absorb vitamins, process carbohydrates and fat, and react to foods like milk, gluten, and caffeine is partly written in your genes. The diet your friend swears by may genuinely not work for your body, and vice versa. My Diet DNA tells you which foods work with your biology.',
        ],
        calloutHtml:
          "<b>India-specific insight:</b> Over 60% of South Asians carry a gene variant linked to lactose intolerance. India's high-carb diet of rice, roti, and potatoes actively works against people who carry the FTO risk variant. Most people eating the same meals their families have eaten for generations have no idea whether those foods are helping or fighting their metabolism.",
        testsLabel: 'What My Diet DNA tests',
        count: '20 traits',
        groups: [
          '<b>12 micronutrients:</b> How well your body absorbs Vitamin A, B6, B9, B12, C, D, E, K, Calcium, Magnesium, Iron, and Omega-3',
          '<b>4 macronutrient responses:</b> How your body handles carbohydrates, saturated fat, monounsaturated fat, and polyunsaturated fat',
          '<b>4 food sensitivities:</b> Lactose intolerance, caffeine sensitivity, salt sensitivity, gluten intolerance',
        ],
        sampleHtml:
          "Sample result: 'Carbohydrate sensitivity — High. Your genes suggest your body converts carbs to fat more readily than average. A lower-carb, higher-protein diet is recommended.'",
        signsTitle: 'Signs your diet is not working for your genes',
        signs: [
          'You eat well but still feel low on energy most days',
          'You bloat or feel heavy after meals that seem perfectly healthy',
          'The diet that worked for your friend or partner does not move the needle for you',
          'You take vitamins but are not sure they are doing anything',
          'Tea or coffee affects you differently than it seems to affect other people',
        ],
      },
      {
        key: 'weight',
        accent: 'weight',
        label: 'Report 2 · My Weight DNA',
        question: 'Why do some people gain weight easily even when they eat the same as others?',
        bodyHtml: [
          'Because weight gain, fat storage, hunger signals, and cravings are all influenced by your genes. Research suggests that weight regain after dieting has a genetic component of around 60%. If you have lost weight and regained it, or struggled to lose it despite genuine effort, your DNA is part of that story.',
          "My Weight DNA tells you your body's tendency to store fat, how sensitive you are to insulin, how quickly you feel full and how long that feeling lasts, and how your lipid levels, including cholesterol, are likely to behave based on your genes.",
        ],
        testsLabel: 'What My Weight DNA tests',
        count: '17 traits',
        groups: [
          '<b>8 weight management traits:</b> Obesity predisposition, fat storage tendency, insulin sensitivity, response to dieting, weight regain risk, waist circumference response, adiponectin levels, cellulite disposition',
          '<b>5 eating behaviour traits:</b> How quickly you feel full, sweet cravings, bitter taste perception, snacking tendency, binge eating tendency',
          '<b>4 genetic lipid traits:</b> LDL cholesterol tendency, triglyceride tendency, HDL cholesterol level, fasting serum triacylglycerol',
        ],
        sampleHtml:
          "Sample result: 'Fat storage — High risk. Your genes are linked to a higher tendency to store fat, particularly around the midsection. A fibre-rich, lower glycaemic diet is recommended.'",
        signsTitle: 'Signs your weight struggles may be genetic',
        signs: [
          'You gain weight more easily than people around you who eat similarly',
          'You lose weight but it keeps coming back despite staying on the same plan',
          'You feel hungry again very quickly after a full meal',
          'You have strong sweet or snack cravings that are hard to control',
          'Your cholesterol or triglycerides have come up in a blood test with no obvious dietary cause',
        ],
      },
      {
        key: 'fitness',
        accent: 'fitness',
        label: 'Report 3 · My Fitness DNA',
        question: 'Why do two people do the same workout and get different results?',
        bodyHtml: [
          'Because your aerobic capacity, the type of exercise your body is best built for, your muscle recovery speed, and your injury risk are all partly genetic. Most people do not know whether they are built more for power or endurance, which means they often spend years doing the type of training that gives them the least return for the effort they put in.',
        ],
        calloutHtml:
          '<b>Sprinter ya marathon runner?</b> My Fitness DNA tells you. And if your injury risk is high for specific areas like the Achilles or ligaments, knowing that before you get hurt is worth considerably more than any training plan.',
        testsLabel: 'What My Fitness DNA tests',
        count: '12 traits',
        groups: [
          '<b>7 exercise response traits:</b> Aerobic capacity, anaerobic capacity, response to strength training, fat metabolism during exercise, HDL cholesterol response to exercise, adrenaline response, BMI and waist circumference response to exercise',
          '<b>5 injury and recovery traits:</b> Overall injury risk, muscle recovery speed, Achilles tendinopathy risk, ligament rupture risk, oxidative stress response',
        ],
        sampleHtml:
          "Sample result: 'Aerobic capacity — Good. Anaerobic capacity — Average. You are better built for endurance than power. Allow 48-72 hours between intense sessions.'",
        signsTitle: 'Signs your training may not match your genes',
        signs: [
          'You train consistently but results plateau faster than expected',
          'Your recovery between sessions takes longer than it seems to for others',
          'You keep picking up the same injuries or niggles in the same body areas',
          'You do not know whether your body is better suited to strength training or cardio',
          'High-intensity sessions leave you more drained than they should',
        ],
      },
      {
        key: 'detox',
        accent: 'detox',
        label: 'Report 4 · My Detox DNA',
        question: 'Do genes affect how well your body clears toxins from food, air, and water?',
        bodyHtml: [
          '<b>Yes.</b> How efficiently your liver neutralises and removes toxins, including pesticide residues in food, pollutants in the air, and chemicals in water, is largely genetic. Two people living in the same city, eating the same food, can have very different detox capacities. In India, where pollution and pesticide residue levels are among the highest in the world, this is not a luxury insight.',
        ],
        calloutHtml:
          '<b>Delhi ki hawa plus aapke genes.</b> If your fat-soluble toxin clearance is poor and your oxidative stress response is high, the environment you live in is having a compounding effect on your body. My Detox DNA tells you where you stand.',
        testsLabel: 'What My Detox DNA tests',
        count: '3 traits',
        groups: [
          '<b>Fat-soluble toxin clearance:</b> How well your liver eliminates toxins stored in fat tissue, including pesticides and heavy metals',
          '<b>Water-soluble toxin clearance:</b> How well your body processes and removes toxins through kidney and liver pathways',
          '<b>Oxidative stress response:</b> How well your body neutralises free radicals, which accelerate inflammation and ageing',
        ],
        sampleHtml:
          "Sample result (HIGH RISK): 'Oxidative stress — High risk. Your genes suggest a lower ability to neutralise free radicals. Increase antioxidant-rich foods, consider glutathione, and reduce processed food exposure.'",
        signsTitle: 'Signs your detox capacity may need support',
        signs: [
          'You feel sluggish or foggy even on days when you have slept and eaten well',
          'You react more strongly to alcohol or certain medications than others seem to',
          'You live or work in a high-pollution area and want to understand the genetic side of your exposure',
          'You have a family history of conditions linked to environmental exposure',
        ],
      },
    ],
  },

  stat: {
    quoteHtml: 'Indians with the FTO gene risk variant on a high-carb diet had 2.46 times the obesity risk.',
    subQuoteHtml: 'We eat rice and roti every single day.',
    emphasisHtml: 'Most of us have no idea which side of that statistic we are on.',
    bodyHtml:
      "Your diet, your weight, your training, and your body's ability to handle what India's environment throws at it — all of it has a genetic layer. My Wellness reads that layer. One saliva kit. Four reports. The instruction manual your body came with but never gave you.",
    bigNum: '2.46×',
    bigNumLabel: 'the obesity risk on a high-carb diet',
    ctaLabel: 'Get my Wellness report',
    ctaHref: '#order',
    fineprint: '4 reports in 1 kit · 52 traits · Results in 7 days · Tap to order',
  },

  traitsCatalog: {
    eyebrow: 'What you get — all 52 traits',
    titleHtml: 'One kit. Four reports. Every trait listed below is included.',
    introHtml:
      'Each trait gives you your genotype result, a risk level (Good, Average, or Poor), a plain-language interpretation, and specific recommendations. You do not need to buy anything separately. One sample. Results in 7 days.',
    categories: [
      {
        name: 'My Diet',
        count: '20 traits',
        accent: 'diet',
        groups: [
          '<b>Micronutrients (12):</b> Vitamin A, B6, B9, B12, C, D, E, K, Calcium, Magnesium, Iron, Omega-3',
          '<b>Macronutrient response (4):</b> Carbohydrate, saturated fat, monounsaturated fat, polyunsaturated fat response',
          '<b>Food sensitivities (4):</b> Lactose intolerance, caffeine sensitivity, salt sensitivity, gluten intolerance',
        ],
      },
      {
        name: 'My Weight',
        count: '17 traits',
        accent: 'weight',
        groups: [
          '<b>Weight management (8):</b> Obesity predisposition, fat storage, insulin sensitivity, response to dieting, weight regain risk, waist circumference response, adiponectin levels, cellulite disposition',
          '<b>Eating behaviour (5):</b> Satiety response, sweet and bitter perception, snacking tendency, binge eating tendency',
          '<b>Genetic lipid profile (4):</b> LDL, triglycerides, HDL cholesterol, fasting serum triacylglycerol',
        ],
      },
      {
        name: 'My Fitness',
        count: '12 traits',
        accent: 'fitness',
        groups: [
          '<b>Exercise response (7):</b> Aerobic capacity, anaerobic capacity, strength training response, fat metabolism during exercise, HDL response to exercise, adrenaline response, BMI response to exercise',
          '<b>Injury and recovery (5):</b> Overall injury risk, muscle recovery speed, Achilles tendinopathy risk, ligament rupture risk, oxidative stress response',
        ],
      },
      {
        name: 'My Detox',
        count: '3 traits',
        accent: 'detox',
        groups: [
          '<b>Detox profile (3):</b> Fat-soluble toxin clearance, water-soluble toxin clearance, oxidative stress response',
        ],
      },
    ],
    totalNum: '52',
    totalLabel: 'Total',
    totalSub: 'Traits, from one saliva kit, in 7 days.',
    legendTitle: 'How results are shown',
    legend: [
      {
        label: 'Good',
        sub: 'Low risk',
        tone: 'good',
        descHtml: 'Your genes are in the normal range for this trait.',
      },
      {
        label: 'Average',
        sub: 'Medium risk',
        tone: 'avg',
        descHtml: 'Your genes show some tendency. Follow the report recommendations.',
      },
      {
        label: 'Poor',
        sub: 'High risk',
        tone: 'poor',
        descHtml: 'Your genes suggest elevated tendency. Act on recommendations and speak to a specialist.',
      },
    ],
  },

  howItWorks: {
    eyebrow: 'How it works',
    titleHtml: 'From your door to four reports.',
    introHtml: 'No clinic, no needle, no hassle.',
    image: `${SHARED}/how-it-works-physician.png`,
    imageAlt: 'A scientist reviewing genetic analysis',
    steps: [
      {
        num: '01',
        icon: `${SIC}/icon-step-1.svg`,
        title: 'Order online',
        subHtml: 'Your kit arrives in 2 to 3 days.',
        bodyHtml:
          'We send the kit straight to your address. Inside: a saliva collection tube, a simple instruction card, and a pre-paid return envelope addressed to the lab. One kit. Four reports. Everything is included.',
      },
      {
        num: '02',
        icon: `${SIC}/icon-step-2.svg`,
        title: 'Collect your sample at home in 5 minutes',
        subHtml: 'No needles. No fasting. No appointments.',
        bodyHtml:
          'Open the tube. Spit into it. Seal it. That is the whole collection. You do not need to change your routine or go anywhere. The instruction card inside the kit walks you through it step by step. Most people do it first thing in the morning.',
      },
      {
        num: '03',
        icon: `${SIC}/icon-step-3.svg`,
        title: 'Drop it with the courier',
        subHtml: 'Pre-paid envelope. Pre-labelled. You just hand it over.',
        bodyHtml:
          'Place the sealed tube in the pre-paid return envelope inside your kit. A courier picks it up from your address at a time you choose. You can track it in the KYG portal from the moment it leaves your door.',
      },
      {
        num: '04',
        icon: `${SIC}/icon-step-4.svg`,
        title: 'Our lab processes your sample',
        subHtml: "India's highest certified lab. 52 traits analysed from one sample.",
        bodyHtml:
          "Your sample goes to Neotech World Lab, which holds India's highest official lab certification (NABL). They use Illumina genotyping technology to read all 52 traits from your single sample. A qualified scientist reviews your results before any report is released.",
      },
      {
        num: '05',
        icon: `${SIC}/icon-step-5.svg`,
        title: 'Four reports unlock in 7 days',
        subHtml: 'Delivered to your account. Explained by a real person.',
        bodyHtml:
          'My Diet DNA, My Weight DNA, My Fitness DNA, and My Detox DNA all unlock in your KYG account within 7 days. Each report has its results, risk levels, and plain-language recommendations. Within 2 days of your reports arriving, a GENEous Care counsellor reaches out to book your free 30-minute session.',
        dark: true,
      },
    ],
    ctaLabel: 'Order my kit',
    ctaHref: '#order',
    fineprint: '1 kit · 4 reports · 52 traits · Takes 5 minutes to collect · Results in 7 days',
  },

  care: {
    eyebrow: 'Included free with every report',
    titleHtml: '52 insights are a lot. A real expert helps you know where to start.',
    leadHtml:
      "GENEous Care is KYG's free counselling service. A qualified counsellor reaches out after your four reports are ready and gives you a 30-minute session that turns 52 data points into a clear, prioritised action plan. On WhatsApp. In plain language.",
    bodyHtml:
      'Other wellness tests give you a dashboard and leave you to figure it out. KYG gives you a person who has looked at your four reports before your session and knows exactly which results need your attention first and which ones you can relax about.',
    minis: [
      {
        title: 'What it is',
        bodyHtml:
          'A free 30-minute session with a trained genetic counsellor. Included with every My Wellness kit. No extra charge.',
      },
      {
        title: 'How it works',
        bodyHtml:
          'Your four reports unlock. Within 2 days, your counsellor gets in touch to fix a time. Session over WhatsApp call or video.',
      },
      {
        title: 'What you get',
        bodyHtml:
          'A plain-language walkthrough of your most important results across all four reports. A clear priority list of what to act on first.',
      },
    ],
    pullQuoteHtml: '"Genetic care, done the GENEous way."',
    chatTitle: 'GENEous Care',
    chatStatus: 'Genetic counsellor · online',
    chat: [
      {
        from: 'them',
        textHtml: "All four reports are in! 52 traits total — but don't worry, only a handful need your attention. 🙂",
      },
      { from: 'me', textHtml: 'Where should I even start?' },
      {
        from: 'them',
        textHtml:
          "I've made you a priority list — top 3 are your carb response, Vitamin D, and detox. I'll walk you through all of it on the call 👍",
      },
    ],
    coversTitle: 'What your counsellor covers in your session',
    covers: [
      '<b>My Diet DNA:</b> which food sensitivities and micronutrient gaps to act on first.',
      '<b>My Weight DNA:</b> what your fat storage and insulin profile mean for how you eat and exercise.',
      '<b>My Fitness DNA:</b> whether your training type matches your genetic profile and what to change.',
      '<b>My Detox DNA:</b> how serious your detox risk is and which dietary changes make the most difference.',
      '<b>Your overall priority list:</b> across all 52 traits, which 5 to 10 things deserve your attention first.',
      '<b>Practical next steps:</b> specific food, supplement, and lifestyle changes you can start immediately.',
    ],
  },

  trust: {
    eyebrow: "One lab. India's highest certification. 52 traits read from your single sample.",
    titleHtml: 'The science behind your four reports.',
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
        label: 'NABL Accredited (ISO 15189) — MC-6400',
        descHtml:
          "India's highest official certification for testing labs. Your single sample is handled under strict, independently verified standards across all 52 traits.",
      },
      {
        label: 'ISO 9001:2015 + ISO 27001:2013',
        descHtml:
          'Quality management and data security certified. Your personal and genetic information is protected at every step of the process.',
      },
      {
        label: 'ACMG + CPIC Guidelines',
        descHtml:
          "Your reports follow the guidelines of two of the world's leading bodies in genetic science, the same standards used by leading hospitals internationally.",
      },
      {
        label: 'Illumina Genotyping Technology',
        descHtml:
          "The same gene-reading technology used by the world's largest genetic testing companies. 99%+ accuracy across all traits in your Wellness report.",
      },
      {
        label: 'HIPAA + FDA Standards',
        descHtml:
          'Your genetic data is handled under international privacy rules. KYG never sells or shares your information. Your sample is destroyed after processing.',
      },
    ],
    expert: {
      initials: 'VS',
      name: 'Dr. Varun Sharma, Ph.D',
      role: '· Genetic Scientist, Neotech World Lab',
      lab: 'Based at: Neotech World Lab Pvt. Ltd., MG Road, Gurugram',
      bodyHtml:
        "Every My Wellness report is personally reviewed by Dr. Sharma's team before it reaches you. All four sub-reports are checked before release.",
      accuracyHtml: 'Accuracy: 99%+ reproducibility. Fewer than 2% of samples ever need rechecking.',
    },
  },

  faq: {
    eyebrow: 'Before you order',
    titleHtml: 'Questions people ask before they order.',
    items: [
      {
        q: 'Is this one test or four separate tests?',
        aHtml:
          'One test. A single saliva kit is analysed for all 52 traits, and the results are delivered as four reports — My Diet DNA, My Weight DNA, My Fitness DNA, and My Detox DNA — inside your KYG account. You collect one sample, once.',
      },
      {
        q: 'Do I need to have a health problem to take this test?',
        aHtml:
          'No. My Wellness is for anyone who wants to understand how their body is genetically wired around food, weight, exercise, and toxin clearance. Most people take it simply to stop guessing — to know which diet, training, and lifestyle choices actually work with their biology.',
      },
      {
        q: 'I am vegetarian. Will the Diet report still work for me?',
        aHtml:
          'Yes. My Diet DNA reads how your genes handle nutrients and foods, not what you currently eat. It is just as useful for vegetarians — for example, it flags how well you absorb Vitamin B12, iron, and Omega-3, which are common gaps on a vegetarian diet, so you know exactly what to prioritise.',
      },
      {
        q: 'Can I just buy one of the four reports instead of all of them?',
        aHtml:
          'My Wellness is sold as one kit that unlocks all four reports together, because a single sample is analysed for all 52 traits at once. You get Diet, Weight, Fitness, and Detox as a set — there is no cheaper single-report version, and no extra cost for the full four.',
      },
      {
        q: 'What does a Poor or High Risk result actually mean?',
        aHtml:
          'It means your genes are linked to a higher-than-average tendency for that trait, not that you have a condition or definitely will. It is a signal to act sooner. Your report explains exactly what to do, and your free GENEous Care session helps you prioritise which results matter most.',
      },
      {
        q: 'Do I need to fast or prepare before collecting my sample?',
        aHtml:
          'No. There is no fasting and no preparation. Just avoid eating, drinking, or smoking for about 30 minutes before you collect your saliva. The instruction card inside the kit walks you through the simple steps.',
      },
      {
        q: 'My genes do not change, so why take this test now?',
        aHtml:
          'Exactly because they do not change — the sooner you know your genetic tendencies, the more years you have to act on them. Knowing your carb response, fat storage, injury risk, or detox capacity in your 20s or 30s lets you shape your diet, training, and lifestyle before problems build up, instead of after.',
      },
      {
        q: 'Is this a medical or diagnostic test?',
        aHtml:
          'This is a wellness and risk-screening test, not a diagnostic one. It identifies genetic tendencies and predispositions across diet, weight, fitness, and detox. It does not diagnose any condition and is not a substitute for professional medical advice. Discuss results with a qualified doctor before making clinical decisions.',
      },
      {
        q: 'What if I have questions after reading my reports?',
        aHtml:
          'Every kit includes a free 30-minute GENEous Care session on WhatsApp. A trained genetic counsellor who has read all four of your reports explains your most important results, gives you a prioritised action plan, and answers anything you want to ask.',
      },
    ],
  },

  bundlesSection: {
    eyebrow: 'Want to go even further?',
    titleHtml:
      'My Wellness gives you the full picture of diet, weight, fitness, and detox. These bundles take it further.',
    items: WELLNESS_BUNDLES,
  },

  finalCta: {
    titleHtml: 'Your body has been running on guesswork.<br />It is time to give it the right instructions.',
    subHtml:
      '4 reports. 52 traits. One saliva kit. Everything your body has been trying to tell you, finally decoded.',
    ctaLabel: 'Get my Wellness report',
    ctaHref: '#order',
    fineprint1: '1 kit · 4 reports · 52 traits · NABL Certified Lab · Free counselling included',
    fineprint2:
      'Certified lab · 99%+ accuracy · Results in 7 days · Your data stays private · Free GENEous Care session included',
  },
};

/** All test pages served by the (tests) routes. */
export const TEST_PAGES: TestPage[] = [mensHealth, womensHealth, ancestry, myWellness];

export function getTestPage(slug: string): TestPage | undefined {
  return TEST_PAGES.find((t) => t.slug === slug);
}
