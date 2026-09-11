// =============================================================================
// lib/testsdata.ts - test-detail page content
// -----------------------------------------------------------------------------
// One `TestPage` object per test (see features/tests/types.ts). A page is an
// ORDERED ARRAY OF SECTIONS: reorder the array to reorder the page, drop an
// entry to remove that block, add an entry to add one. No component changes.
//
// Copy fields are `Html` and rendered with dangerouslySetInnerHTML so the
// design's serif-italic accents can be inlined:
//   <em class="tst-em">…</em>        crimson serif italic
//   <em class="tst-em-teal">…</em>   teal serif italic
//   <b class="tst-strong">…</b>      bold sans inside a serif line
// This is TRUSTED, hand-authored input - never populate it from a CMS or an API.
//
// `womensHealth` is a 1:1 rebuild of the Figma "Women's Health" frame and is the
// reference implementation every future test page should be modelled on. It
// stays in this file; every page built ON it lives in `lib/tests/<slug>.ts` and
// is registered in TEST_PAGES at the bottom.
// =============================================================================

import { withBuyStructure, type ListingFacts } from '@/features/tests/structure';
import type { TestPage } from '@/features/tests/types';
import { CATEGORIES } from '@/lib/categoriesdata';
import { ancestry } from '@/lib/tests/ancestry';
import { eyeHealth } from '@/lib/tests/eye-health';
import { immunityHealth } from '@/lib/tests/immunity-health';
import { kidneyHealth } from '@/lib/tests/kidney-health';
import { mensHealth } from '@/lib/tests/mens-health';
import { myWellness } from '@/lib/tests/my-wellness';
import { skinHealth } from '@/lib/tests/skin-health';
import { sleep } from '@/lib/tests/sleep';

const IMG = '/tests/womens-health';

// The five panels and their sample result. The buy surface's "Key insights"
// card reads from this, so the number a buyer sees in the hero and the one the
// report preview shows further down can never drift apart.
const PANEL_RESULTS = [
  { label: 'PCOS', value: 'Good', tone: 'good' as const },
  { label: 'Pregnancy Loss', value: 'Good', tone: 'good' as const },
  { label: 'Mood', value: 'Poor', tone: 'poor' as const },
  { label: 'Bones', value: 'Poor', tone: 'poor' as const },
  { label: 'Joints', value: 'Good', tone: 'good' as const },
];

/** The glyph the buy surface draws beside each panel. */
const PANEL_GLYPH: Record<string, string> = {
  PCOS: 'venus',
  'Pregnancy Loss': 'leaf',
  Mood: 'smile',
  Bones: 'bone',
  Joints: 'joint',
};

export const womensHealth: TestPage = {
  slug: 'womens-health',
  categorySlug: 'wellness',

  seo: {
    title: "Women's Health DNA Test - 5 answers from one saliva sample",
    description:
      'PCOS, pregnancy loss, peripartum mood, bone density and joint risk - five genetic answers from a single at-home saliva kit. NABL-accredited lab, results in 3 weeks, free GENEous Care counselling.',
  },

  sections: [
    // --------------------------------------------------------- buy · pdp ----
    {
      type: 'buyPdp',
      ground: 'cream',
      breadcrumb: [
        { label: 'Home', href: '/' },
        { label: 'Tests', href: '/categories' },
        { label: "Women's Health Genetic Test" },
      ],
      gallery: {
        badge: 'MOST POPULAR',
        slides: [
          { src: `${IMG}/hero-woman.jpg`, alt: 'A woman sitting at home, looking out of a window' },
          {
            src: `${IMG}/bodymap-figure.png`,
            alt: 'The five areas this test reads, mapped on a body',
            fit: 'contain',
          },
          { src: `${IMG}/worth-mother.jpg`, alt: 'A mother holding her daughter' },
          { src: `${IMG}/whofor-pregnant.jpg`, alt: 'A pregnant woman resting at home' },
        ],
        insights: {
          title: 'Key insights',
          rows: PANEL_RESULTS.map((r) => ({
            glyph: PANEL_GLYPH[r.label] ?? 'smile',
            label: r.label,
            // The card speaks in risk, not in grades - the grade is what the
            // report itself uses, and it is shown in full further down.
            value: r.tone === 'good' ? 'Low risk' : 'Higher risk',
            tone: r.tone,
          })),
        },
        overlay: ['Understand your genes.', 'Make informed choices.'],
        video: { label: 'See how the kit works' },
      },
      pills: [
        { glyph: 'file', label: '5 reports' },
        { glyph: 'flask', label: '1 saliva kit' },
        { glyph: 'truck', label: 'Results in 3 weeks' },
      ],
      title: "Women's Health Genetic Test",
      rating: { value: 5, count: 5, href: '#reviews' },
      taxNote: 'Inclusive of all taxes',
      blurb: 'A simple saliva test to understand your genetic risk for PCOS, pregnancy loss, mood, bones and joints.',
      features: [
        { tile: 'tile0', lines: ['5 reports'] },
        { tile: 'tile1', lines: ['At-home kit'] },
        { tile: 'tile2', lines: ['Free shipping'] },
        { tile: 'tile3', lines: ['Results in', '3 weeks'] },
      ],
      cta: { addToCart: 'Add to cart', buyNow: 'Buy now', href: '#kit' },
      assurances: [
        { glyph: 'shield', lines: ['Secure checkout', 'via Razorpay'] },
        { glyph: 'geneleaf', lines: ['Free GENEous', 'care call'] },
      ],
      included: {
        title: "What's included",
        items: [
          {
            name: 'PCOS',
            genes: 'THADA',
            question: 'Do my genes put me at risk of PCOS?',
            answer:
              'PCOS happens when your hormones go out of balance. It affects your periods, your weight and your skin.',
          },
          {
            name: 'Pregnancy Loss',
            genes: 'MTHFR, FOXP3',
            question: 'Could I have trouble having a baby?',
            answer: 'Two genes affect folate and how your immune system reacts in pregnancy.',
          },
          {
            name: 'Mood',
            genes: 'COMT',
            question: 'Could pregnancy affect my mental health?',
            answer: 'The COMT gene shows how well your body handles stress hormones.',
          },
          {
            name: 'Bones',
            genes: 'AKAP11, LRP5, ZBTB40',
            question: 'Will my bones get weak as I get older?',
            answer: 'Three genes show how fast yours may weaken after 30.',
          },
          {
            name: 'Joints',
            genes: 'HLA-DRB1',
            question: 'Could my immune system damage my joints?',
            answer: 'The HLA-DRB1 gene is the clearest warning sign for rheumatoid arthritis.',
          },
        ],
      },
      // The frame draws these three collapsed, so it carries no body copy for
      // them. What follows is the page's own facts, stated once more in the
      // place a buyer goes looking for them.
      specs: [
        {
          title: 'Sample type',
          body: 'Saliva. You spit into the tube in the kit at home - no blood, no needle, no clinic visit, and nothing to fast for.',
        },
        {
          title: 'Testing technique',
          body: 'Illumina genotyping at a NABL-accredited lab, with every report reviewed by a scientist before it reaches you.',
        },
        {
          title: "What you'll receive",
          body: 'Five results - PCOS, pregnancy loss, mood, bones and joints - each marked Good, Average or Poor, in plain language, with what to do next. Ready in 3 weeks.',
        },
      ],
    },

    // ----------------------------------------------------- what we check ----
    {
      type: 'riskCards',
      ground: 'cream',
      head: {
        eyebrow: { label: 'What we check', icon: 'activity' },
        titleHtml: 'Five risks that stay silent <em class="tst-em-teal">until it is too late.</em>',
        leadHtml: 'Each one gets a risk level: Good, Average or Poor.',
      },
      allLabel: 'All five',
      cards: [
        {
          key: 'pcos',
          tabLabel: 'PCOS',
          image: { src: `${IMG}/risk-pcos.jpg`, alt: 'Illustration of an ovary with cystic follicles' },
          imageCaption: 'Cystic follicles · "string of pearls"',
          geneLabel: 'PCOS · Gene THADA',
          question: 'Do my genes put me at risk of PCOS?',
          bodyHtml:
            'PCOS happens when your hormones go out of balance. It affects your periods, your weight and your skin. <b>The THADA gene tells you how likely you are to get it.</b>',
          warningHtml: 'Left alone, it can lead to diabetes.',
          sample: { label: 'Sample result', valueHtml: 'Good · Low', tone: 'good', percent: 22 },
        },
        {
          key: 'pregnancy',
          tabLabel: 'Pregnancy',
          image: { src: `${IMG}/risk-pregnancy.jpg`, alt: 'Cupped hands around a soft glow' },
          imageCaption: 'Folate & immune balance in pregnancy',
          geneLabel: 'Pregnancy Loss · MTHFR, FOXP3',
          question: 'Could I have trouble having a baby?',
          bodyHtml:
            'Some women cannot conceive even after years of trying, and no one can tell them why. <b>Two genes affect folate and how your immune system reacts in pregnancy.</b>',
          warningHtml: 'Most women never get an answer.',
          sample: { label: 'Sample result', valueHtml: 'Good · Low', tone: 'good', percent: 22 },
        },
        {
          key: 'mood',
          tabLabel: 'Mood',
          image: { src: `${IMG}/risk-mood.jpg`, alt: 'Profile illustration highlighting the brain' },
          imageCaption: 'Peripartum mood & stress hormones',
          geneLabel: 'Mood · Gene COMT',
          question: 'Could pregnancy affect my mental health?',
          bodyHtml:
            'Some women feel very low and anxious while pregnant, or after the baby comes. <b>The COMT gene shows how well your body handles stress hormones.</b>',
          warningHtml: 'Half of it begins before the baby is born.',
          sample: { label: 'Sample result', valueHtml: 'Poor · High', tone: 'poor', percent: 85.2 },
        },
        {
          key: 'bones',
          tabLabel: 'Bones',
          image: { src: `${IMG}/risk-bones.jpg`, alt: 'Cross-section of bone losing density' },
          imageCaption: 'Losing density · porous & brittle',
          geneLabel: 'Bones · AKAP11, LRP5, ZBTB40',
          question: 'Will my bones get weak as I get older?',
          bodyHtml:
            'After the age of 30, your bones slowly begin to lose strength. There is no pain, and no warning sign. <b>Three genes show how fast yours may weaken.</b>',
          warningHtml: 'Most women find out when a bone breaks.',
          sample: { label: 'Sample result', valueHtml: 'Poor · High', tone: 'poor', percent: 85.2 },
        },
        {
          key: 'joints',
          tabLabel: 'Joints',
          image: { src: `${IMG}/risk-joints.jpg`, alt: 'Illustration of an inflamed joint' },
          imageCaption: 'Inflamed joint · immune attack',
          geneLabel: 'Joints · Gene HLA-DRB1',
          question: 'Could my immune system damage my joints?',
          bodyHtml:
            'In rheumatoid arthritis, your immune system attacks your joints and slowly damages them. <b>The HLA-DRB1 gene is the clearest warning sign.</b>',
          warningHtml: 'Joint damage cannot be undone.',
          sample: { label: 'Sample result', valueHtml: 'Good · Low', tone: 'good', percent: 22 },
        },
      ],
      cta: { label: 'Check My Risk', href: '#kit' },
      ctaNoteHtml: '5 tests · 1 saliva sample · <b>results in 3 weeks</b>',
    },

    // ------------------------------------------------ inside your report ----
    {
      type: 'bodyMap',
      ground: 'sage',
      head: {
        eyebrow: { label: "Inside your Women's Health report", icon: 'target' },
        titleHtml: 'Five answers, <em class="tst-em-teal">from one saliva sample.</em>',
        leadHtml: 'Tap any part of the body to see what we check there.',
      },
      image: { src: `${IMG}/bodymap-figure.png`, alt: 'Anatomical figure marking the five tested areas' },
      hotspots: [
        {
          key: 'mood',
          label: 'Mood',
          caption: 'Depression around pregnancy',
          tipTitle: 'Mood · Peripartum depression',
          tipBody:
            'Could pregnancy affect my mental health? The COMT gene shows how well your body handles stress hormones, and half of it begins before the baby is born.',
          x: 49.7,
          y: 5.6,
          side: 'left',
        },
        {
          key: 'bones',
          label: 'Bones',
          caption: 'Osteoporosis',
          tipTitle: 'Bones · Osteoporosis',
          tipBody:
            'Will my bones get weak as I get older? Three genes show how fast yours may weaken. Most women only find out when a bone breaks.',
          x: 69.3,
          y: 21.0,
          side: 'right',
        },
        {
          key: 'pcos',
          label: 'PCOS',
          caption: 'Hormones and your cycle',
          tipTitle: 'PCOS · Gene THADA',
          tipBody:
            'Do my genes put me at risk of PCOS? The THADA gene tells you how likely you are to get it. Left alone, it can lead to diabetes.',
          x: 42.4,
          y: 43.9,
          side: 'left',
        },
        {
          key: 'pregnancy',
          label: 'Pregnancy',
          caption: 'Trouble having a baby',
          tipTitle: 'Pregnancy Loss · MTHFR, FOXP3',
          tipBody:
            'Could I have trouble having a baby? Two genes affect folate and how your immune system reacts in pregnancy. Most women never get an answer.',
          x: 58.1,
          y: 46.3,
          side: 'right',
        },
        {
          key: 'joints',
          label: 'Joints',
          caption: 'Rheumatoid arthritis',
          tipTitle: 'Joints · Gene HLA-DRB1',
          tipBody:
            'Could my immune system damage my joints? In rheumatoid arthritis the HLA-DRB1 gene is the clearest warning sign, and joint damage cannot be undone.',
          x: 41.3,
          y: 73.4,
          side: 'left',
        },
      ],
    },

    // ----------------------------------------- who should take this test ----
    {
      type: 'whoFor',
      ground: 'sage',
      head: {
        eyebrow: { label: 'Who should take this test', icon: 'users' },
        titleHtml: 'This test is for every woman. <em class="tst-em">But it might be for you most of all.</em>',
      },
      image: {
        src: `${IMG}/whofor-pregnant.jpg`,
        alt: 'A pregnant woman resting by a window with a cup of tea',
      },
      introTitleHtml: 'This test is for you if&hellip;',
      introBodyHtml:
        'Your genes never change, so testing once protects you for life. Some women, though, have every reason to know sooner rather than later. If even one of the signs below sounds like you, knowing now gives you years to act.',
      chips: [
        { label: 'Test once, for life', icon: 'clock' },
        { label: 'Preventive, not reactive', icon: 'chart' },
      ],
      signs: [
        {
          icon: 'calendar',
          accent: 'crimson',
          textHtml: 'Your periods have never been regular, and no one has ever really explained why.',
        },
        {
          icon: 'baby',
          accent: 'teal',
          textHtml: '<b>You are thinking about a baby - now, or somewhere down the line.</b>',
        },
        {
          icon: 'pregnancy-loss',
          accent: 'crimson',
          textHtml: 'You have lost a pregnancy, and were never given a real reason why.',
        },
        {
          icon: 'family',
          accent: 'teal',
          // Figtree 600 in the frame, unlike its neighbours at 400 - the <b> is
          // what WhoFor maps to font-semibold.
          textHtml: '<b>PCOS, thyroid, weak bones or arthritis runs in your family.</b>',
        },
        {
          icon: 'frown',
          accent: 'crimson',
          textHtml: 'You often feel low, anxious, or not quite yourself - around your cycle, or after a baby.',
        },
        {
          icon: 'person',
          accent: 'teal',
          textHtml: 'Your joints ache or stiffen more than they should for your age.',
        },
        {
          icon: 'shield',
          accent: 'teal',
          textHtml:
            '<b>You are in your 20s or 30s and feel perfectly fine - which is exactly when acting early works best.</b>',
        },
        {
          icon: 'file',
          accent: 'crimson',
          textHtml: 'You are simply tired of guessing, and want clear answers about your own body.',
        },
      ],
      closingHtml: 'If even one of these is you, knowing now gives you years to act instead of regret.',
      ctas: [
        { label: 'Book a Test', href: '#kit' },
        { label: 'Learn More', href: '#the-five-tests', variant: 'ghost' },
      ],
    },

    // ------------------------------------------------------- the numbers ----
    {
      type: 'stats',
      ground: 'ink',
      head: {
        eyebrow: { label: 'The numbers', icon: 'chart', accent: 'teal' },
        titleHtml: 'These five problems are <em class="tst-em-teal">common in Indian women.</em>',
        leadHtml: 'Most only find out once the damage is done.',
      },
      stats: [
        { kicker: 'PCOS', value: '1 in 5', tone: 'java2', barPercent: 20.0581, bodyHtml: 'Indian women have PCOS.' },
        {
          kicker: 'Diagnosis',
          value: '2 to 3',
          tone: 'java',
          barPercent: 55.1163,
          bodyHtml: 'years is the average wait for a PCOS diagnosis.',
        },
        {
          kicker: 'Depression',
          value: '50%',
          tone: 'ice',
          barPercent: 50.1163,
          bodyHtml: 'of it begins before the baby is born, not after.',
        },
        {
          kicker: 'Bones',
          value: '30',
          tone: 'pink',
          barPercent: 70.1744,
          bodyHtml: 'is the age your bones start losing strength.',
        },
        {
          kicker: 'Joint problems',
          value: '3x',
          tone: 'java2',
          barPercent: 80.1744,
          bodyHtml: 'more women than men get rheumatoid arthritis, which slowly damages the joints.',
        },
      ],
      closingHtml: 'All five can be managed. But only if you find out in time.',
      cta: { label: 'Check My Risk', href: '#kit' },
    },

    // -------------------------------------------- how gene testing works ----
    {
      type: 'explainer',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'How gene testing works', icon: 'microscope' },
        titleHtml: 'Gene testing sounds complicated. <em class="tst-em">It is not.</em>',
      },
      cards: [
        {
          image: { src: `${IMG}/explainer-1.jpg`, alt: 'A newborn held close, with a DNA helix motif' },
          bodyHtml: 'Genes are the instructions you were born with.',
        },
        {
          image: { src: `${IMG}/explainer-2.jpg`, alt: 'A woman at home in thought' },
          bodyHtml: 'Some of them can cause health problems later in life.',
        },
        {
          image: { src: `${IMG}/explainer-3.jpg`, alt: 'A woman holding a saliva collection tube' },
          bodyHtml: 'We check yours, so you can prevent them instead of curing them later.',
        },
      ],
      closingHtml: 'One saliva sample. That is all it takes.',
    },

    // ------------------------------------------------------- your report ----
    {
      type: 'reportPreview',
      ground: 'sage',
      head: {
        eyebrow: { label: 'Your report', icon: 'file' },
        titleHtml: 'No gene codes. <em class="tst-em-teal">No jargon.</em>',
      },
      bullets: [
        'Five results, from one test.',
        'Each one marked Good, Average or Poor.',
        'You are told exactly what to do next.',
        'Your genes never change, so you only need to test once.',
      ],
      cta: { label: 'Get My Report', href: '#kit' },
      sample: {
        badge: 'Sample',
        title: "Women's Health Report",
        rows: [
          { label: 'PCOS', value: 'Good · Low', tone: 'good' },
          { label: 'Pregnancy Loss', value: 'Good · Low', tone: 'good' },
          { label: 'Mood', value: 'Poor · High', tone: 'poor' },
          { label: 'Bones', value: 'Poor · High', tone: 'poor' },
          { label: 'Joints', value: 'Good · Low', tone: 'good' },
        ],
        legendHtml: '<b>Good</b> = normal · <b>Average</b> = some risk · <b>Poor</b> = higher risk',
      },
    },

    // ------------------------------------------------------ how it works ----
    {
      type: 'steps',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'How it works', icon: 'box' },
        titleHtml: 'From your door to five answers, <em class="tst-em-teal">in 5 simple steps.</em>',
        leadHtml: 'No clinic. No needle. No fasting. About five minutes of your time.',
      },
      steps: [
        { icon: 'box', title: 'Order', bodyHtml: 'Kit reaches your door in 2 to 3 days.' },
        { icon: 'droplet', title: 'Collect', bodyHtml: 'Spit into the tube at home. 5 minutes, no needles.' },
        { icon: 'truck', title: 'Return', bodyHtml: 'Pre-paid envelope. Free courier pickup.' },
        { icon: 'microscope', title: 'NABL lab', bodyHtml: 'A scientist reviews every result.' },
        { icon: 'file', title: 'Report', bodyHtml: 'Ready in 3 weeks, easy to understand.', accent: 'crimson' },
      ],
      cta: { label: 'Order My Kit', href: '#kit' },
      ctaNoteHtml: 'Ships in 2 to 3 days · <b>Free GENEous Care call after</b>',
    },

    // ----------------------------------------------------------- the kit ----
    {
      type: 'kit',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'One test. Answers you keep for life.', icon: 'box' },
        titleHtml: 'Everything you need, <em class="tst-em">in one box.</em>',
      },
      contents: {
        kicker: "Women's Health Genetic Kit",
        title: 'Everything in one box',
        items: [
          'All 5 tests: PCOS, Pregnancy Loss, Mood, Bones &amp; Joints',
          'At-home saliva kit, delivered &amp; picked up free',
          'Easy-to-read report in 3 weeks',
          'Free GENEous Care counselling session',
          'NABL-certified processing · your data is never sold',
        ],
      },
      order: {
        kicker: 'Ready when you are',
        lines: [
          'Kit at your door in <b>2 to 3 days</b>.',
          'Sample takes <b>5 minutes</b>.',
          'Report in <b>3 weeks</b>.',
        ],
        cta: { label: 'Order My Kit', href: '#kit' },
        noteHtml:
          'Certified NABL lab. Your data is never sold or shared, and your sample is destroyed after processing.',
      },
    },

    // ------------------------------------------------------ geneous care ----
    {
      type: 'counsellor',
      ground: 'cream',
      head: {
        eyebrow: { label: 'GENEous Care · Not Google, a real expert', icon: 'users', accent: 'teal' },
        titleHtml: 'Our GENEous Care expert <em class="tst-em-teal">explains it to you.</em>',
      },
      image: {
        src: `${IMG}/counsellor-placeholder.jpg`,
        alt: 'GENEous Care genetic counsellor',
      },
      points: [
        'Every single report is checked by a scientist before it reaches you.',
        'Want your report explained? Book a free GENEous Care session with us.',
        'Our experts tell you what it means, and what to do next.',
      ],
      floatCard: {
        icon: 'users',
        title: 'GENEous Care',
        subtitle: 'Genetic counselling, on call',
        noteHtml: 'Free with every report',
      },
      expert: {
        initials: 'VS',
        name: 'Dr. Varun Sharma, Ph.D',
        role: 'Scientist, Human Genetics',
        reviewedByLabel: 'Every report reviewed by',
      },
    },

    // --------------------------------------------- certified and trusted ----
    {
      type: 'trust',
      ground: 'sand',
      head: {
        eyebrow: { label: 'Certified and trusted', icon: 'badge-check', accent: 'teal' },
        titleHtml: 'Real lab. <em class="tst-em-teal">Real science.</em>',
      },
      badges: [
        { line1: 'NABL', line2: 'MC-6400' },
        { icon: 'award', line1: 'ISO 9001:2015' },
        { line1: 'ISO', line2: '9001 · 27001' },
        { icon: 'flask', line1: 'Illumina Genotyping' },
        { line1: 'HIPAA', line2: 'Compliant' },
        { icon: 'badge-check', line1: 'ISO 27001:2013' },
        { icon: 'shield', line1: 'HIPAA · FDA' },
      ],
      tiles: [
        {
          statHtml: '99%+',
          title: 'Accuracy on testing',
          bodyHtml: 'Tested at Neotech Worldlab, MG Road, Gurugram.',
        },
        {
          icon: 'badge-check',
          title: 'NABL-accredited lab',
          bodyHtml: "India's highest lab standard, plus studies on Indian women.",
        },
        {
          icon: 'lock',
          accent: 'crimson',
          title: 'Your data, protected',
          bodyHtml: 'Never sold or shared. Kept for future tests only if you allow.',
        },
      ],
    },

    // ------------------------------------------------------- testimonial ----
    {
      type: 'testimonial',
      ground: 'cream',
      quoteHtml: 'Finally&hellip; my <em class="tst-em-teal">dream body</em> doesn\'t feel impossible anymore.',
      bodyHtml:
        'For years you may have blamed yourself for the weight that would not move. When you finally see what your genes are doing, everything changes: you can stop fighting your own body and start working with it, and feel <b>strong, confident, and at home in your own skin again.</b>',
      closingHtml:
        'You are not paying for a test. You are buying back the years, and the moments, you would have lost.',
      cta: { label: 'Book a Test', href: '#kit' },
    },

    // -------------------------------------------------------------- faqs ----
    {
      type: 'faqs',
      ground: 'cream',
      head: {
        eyebrow: { label: 'Before you decide', icon: 'file' },
        titleHtml: 'Your questions, <em class="tst-em-teal">answered.</em>',
      },
      items: [
        {
          q: 'I feel perfectly healthy. Why should I still test?',
          a: 'That is exactly when this test is most useful. All five of these conditions stay silent for years before the first symptom, and your genes already carry the answer from birth. Testing while you feel well is what gives you the years to act.',
        },
        {
          q: 'I am only 25. Is this too early for me?',
          a: 'No. Your genes never change, so a test at 25 stays true for life, and it is early enough to change what happens next. Bone density, for example, starts declining around 30 - knowing before then is the point.',
        },
        {
          q: 'I do not plan to have children. Is this test still for me?',
          a: 'Yes. Two of the five panels are about pregnancy, but PCOS, bone density and rheumatoid arthritis affect you regardless. You still get those three answers, and the hormone results matter for your cycle and metabolism either way.',
        },
        {
          q: 'Do I have to visit a lab or a hospital?',
          a: 'No. The kit is delivered to your door in 2 to 3 days, you give a saliva sample at home in about five minutes, and a free courier collects it in a pre-paid envelope. No clinic, no needle, no fasting.',
        },
        {
          q: 'What happens if my result comes back as Poor?',
          a: 'A Poor result means higher genetic risk, not a diagnosis. Every report is reviewed by a scientist, and you get a free GENEous Care session where a genetic counsellor explains what it means and what to do next.',
        },
        {
          q: 'Who will be able to see my genetic information?',
          a: 'Only you and the accredited lab processing your sample. Your data is never sold or shared, your sample is destroyed after processing, and results are kept for future tests only if you explicitly allow it.',
        },
      ],
    },

    // --------------------------------------------------------- final cta ----
    {
      type: 'finalCta',
      ground: 'ink',
      eyebrow: { label: 'Know now, not later', icon: 'zap', accent: 'teal' },
      titleHtml: 'Health Without <em class="tst-em-teal">Guesswork.</em>',
      chips: [{ label: '5 tests, 1 saliva kit' }, { label: 'Results in 3 weeks' }, { label: 'Expert guidance' }],
      cta: { label: 'Buy Now', href: '#kit' },
      noteHtml: 'At-home saliva kit · NABL certified lab · Results in 3 weeks',
    },

    // -------------------------------------------------------- disclaimer ----
    {
      type: 'disclaimer',
      bodyHtml:
        'This is general educational information, not medical advice. Talk to a doctor about your own case. If you are struggling with your mental health, please reach out to a doctor or someone you trust.',
    },
  ],
};

/** The category card's facts for a test - its name, count chip, vetted photo
 *  and tone tile - which the derived buy surface takes rather than re-deciding. */
function listingFor(slug: string): ListingFacts | undefined {
  for (const category of CATEGORIES) {
    const p = category.products.find((x) => x.slug === slug);
    if (p) return { name: p.name, meta: p.meta, image: p.image, icon: p.icon, tone: p.tone };
  }
  return undefined;
}

/** All test pages served by the /categories/[category_slug]/[test_slug] route.
 *  Order here is the order they prerender in; it does not affect the listing,
 *  which is driven by lib/categoriesdata.ts.
 *
 *  EVERY PAGE GOES THROUGH `withBuyStructure` - that is what makes the buy
 *  frame the default rather than a Women's Health special case. A page file
 *  lists what it contains; the order, the buy surface at the top and the
 *  retirement of the old editorial blocks all happen here, so a tenth test
 *  added to this list is born with the same layout as the other nine. */
export const TEST_PAGES: TestPage[] = [
  womensHealth,
  mensHealth,
  myWellness,
  immunityHealth,
  skinHealth,
  eyeHealth,
  kidneyHealth,
  ancestry,
  sleep,
].map((page) => withBuyStructure(page, listingFor(page.slug)));

export function getTestPage(slug: string): TestPage | undefined {
  return TEST_PAGES.find((t) => t.slug === slug);
}
