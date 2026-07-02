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

/** All test pages served by the (tests) routes. */
export const TEST_PAGES: TestPage[] = [mensHealth];

export function getTestPage(slug: string): TestPage | undefined {
  return TEST_PAGES.find((t) => t.slug === slug);
}
