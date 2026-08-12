// =============================================================================
// lib/tests/my-wellness.ts - My Wellness test-detail page
// -----------------------------------------------------------------------------
// From health/my-wellness-health.html. Mapping:
//
//   guesswork vs genes -> aspiration + thenNow
//   the 4 reports      -> riskCards   (one card per report, not per condition)
//   all 52 traits      -> markerGrid  (4 `stat` cards + the 3-grade legend)
//   the numbers        -> stats
//
// SLUG: `my-wellness`, not `my-wellness-health`. The nav mega-menu, the
// homepage and the draft homepages all already link to
// /categories/wellness/my-wellness, and the kit art lives under
// public/tests/my-wellness + public/tests/wellness/my-*. Matching the deck's
// FILENAME instead would have left every one of those links pointing at the
// old redirect. That redirect is removed in next.config.ts.
//
// Photography: the hero and all four report cards use the existing art. Only
// the editorial and counsellor slots are placeholder tint.
// =============================================================================

import type { TestPage } from '@/features/tests/types';

const IMG = '/tests/my-wellness';
/** The four report heroes shipped with the old fixed-shape renderer. */
const REPORT = '/tests/wellness';

export const myWellness: TestPage = {
  slug: 'my-wellness',
  categorySlug: 'wellness',

  seo: {
    title: 'My Wellness DNA Test — 52 traits, 4 reports, one saliva sample',
    description:
      'Diet, weight, fitness and detox — 52 genetic traits read from a single at-home saliva kit and delivered as four reports in 7 days. NABL-accredited lab, free counselling session.',
  },

  sections: [
    // --------------------------------------------------------------- hero ----
    {
      type: 'hero',
      eyebrow: { label: 'Genetic Testing · Health Without Guesswork', icon: 'dna' },
      titleHtml: 'Your genes already know your body. <em class="tst-em">Now you can too.</em>',
      kickerHtml: '52 traits. 1 saliva sample.',
      subHtml: 'Four reports in 7 days: diet, weight, fitness and detox.',
      ctas: [
        { label: 'Get My Wellness Report', href: '#kit' },
        { label: 'See The 4 Reports', href: '#what-we-check', variant: 'ghost', icon: 'arrow-down' },
      ],
      chips: [
        { label: 'No needles', icon: 'droplet' },
        { label: 'NABL lab', icon: 'badge-check' },
        { label: 'Results in 7 days', icon: 'clock' },
      ],
      footnoteHtml: 'Same diet, same effort, different results. Your DNA explains why.',
      image: {
        src: `${IMG}/hero-wellness.png`,
        alt: 'Diet, weight, fitness and detox, decoded from one sample',
      },
      resultCard: {
        title: 'Your reports',
        icon: 'flask',
        rows: [
          { label: 'Carb sensitivity', value: 'Poor', tone: 'poor' },
          { label: 'Fat storage', value: 'Poor', tone: 'poor' },
          { label: 'Aerobic capacity', value: 'Good', tone: 'good' },
          { label: 'Vitamin D', value: 'Average', tone: 'avg' },
          { label: 'Oxidative stress', value: 'Poor', tone: 'poor' },
        ],
      },
    },

    // --------------------------------------------------------- aspiration ----
    {
      type: 'aspiration',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'Guesswork vs your genes', icon: 'scale' },
        titleHtml: 'Same diet, same effort, different results. <em class="tst-em-teal">Your DNA explains why.</em>',
      },
      image: { src: `${IMG}/why-reactive.png`, alt: 'Two people eating the same meal with different outcomes' },
      badgeTop: { label: 'Stop guessing', icon: 'chart' },
      badgeBottom: { label: 'Work with your body', icon: 'zap' },
      rows: [
        { icon: 'salad', title: 'The diet', subtitle: 'that worked for everyone but you.' },
        { icon: 'scale', title: 'The weight', subtitle: 'that will not move, however hard you try.' },
        { icon: 'dumbbell', title: 'The workout', subtitle: 'that leaves you flat, not stronger.' },
      ],
      bodyHtml:
        "Most people spend years cycling through plans built for someone else's biology. Your genes decide how you absorb nutrients, store fat, respond to training and clear toxins, and they never change.",
      quoteHtml:
        '<em class="tst-em">Every plan you have tried assumed your body works like everyone else\'s.</em> <b class="tst-strong">One saliva kit reads 52 traits across diet, weight, fitness and detox, so you can finally stop fighting your own body and start working with it.</b>',
    },

    // ------------------------------------------------------------ then/now ----
    {
      type: 'thenNow',
      ground: 'ivory',
      then: {
        icon: 'eye-off',
        kicker: 'Guesswork',
        title: 'You run on trial and error',
        items: [
          'You copy the diet that worked for a friend, and it does nothing for you.',
          'You blame willpower for what is actually carb sensitivity or fat storage.',
          'You train for endurance when your body is built for power, or the reverse.',
        ],
      },
      now: {
        icon: 'chart',
        kicker: 'Specificity',
        title: 'You run on your own data',
        items: [
          'You test once and know how your body handles carbs, fats and 12 vitamins.',
          '<b>You train the way your body actually responds, and recover the way it needs.</b>',
          'No clinic. No needles. One saliva kit, four reports.',
        ],
      },
      closingHtml: 'Your body ran on guesswork. Give it the right instructions.',
      cta: { label: 'Get My Wellness Report', href: '#kit' },
    },

    // --------------------------------------------------------- risk cards ----
    // One card per REPORT here, not per condition: the deck sells four bundled
    // reports, so the card body summarises the trait split and the sample
    // reading names the single trait it is quoting.
    {
      type: 'riskCards',
      ground: 'cream',
      head: {
        eyebrow: { label: 'One kit · four reports', icon: 'activity' },
        titleHtml: 'Four questions your body has been <em class="tst-em-teal">answering for years.</em>',
        leadHtml: '52 traits in total. Each one gets a clear reading: Good, Average or Poor.',
      },
      allLabel: 'All four',
      cards: [
        {
          key: 'diet',
          tabLabel: 'Diet',
          icon: 'salad',
          image: { src: `${REPORT}/my-diet/hero.png`, alt: 'My Diet DNA report' },
          imageCaption: 'Report 1 · 20 traits',
          geneLabel: 'My Diet DNA · 20 traits',
          question: 'Why does a diet work for some people, not others?',
          bodyHtml:
            'How you absorb 12 vitamins, handle carbs and fats, and react to lactose, caffeine, salt and gluten. <b>12 micronutrients, 4 macronutrient responses and 4 food sensitivities.</b>',
          warningHtml: 'Most plans assume everyone absorbs nutrients the same way.',
          sample: {
            label: 'Sample reading · Carbohydrate sensitivity',
            valueHtml: 'Poor · High',
            tone: 'poor',
            percent: 85,
          },
        },
        {
          key: 'weight',
          tabLabel: 'Weight',
          icon: 'scale',
          image: { src: `${REPORT}/my-weight/hero.png`, alt: 'My Weight DNA report' },
          imageCaption: 'Report 2 · 17 traits',
          geneLabel: 'My Weight DNA · 17 traits',
          question: 'Why do some people gain weight easily, eating the same?',
          bodyHtml:
            'Fat storage, insulin sensitivity, hunger and cravings, and your genetic cholesterol profile. <b>8 weight-management, 5 eating-behaviour and 4 genetic lipid traits.</b>',
          warningHtml: 'People blame willpower for what is often biology.',
          sample: { label: 'Sample reading · Fat storage', valueHtml: 'Poor · High', tone: 'poor', percent: 85 },
        },
        {
          key: 'fitness',
          tabLabel: 'Fitness',
          icon: 'dumbbell',
          image: { src: `${REPORT}/my-fitness/hero.png`, alt: 'My Fitness DNA report' },
          imageCaption: 'Report 3 · 12 traits',
          geneLabel: 'My Fitness DNA · 12 traits',
          question: 'Why do two people get different results from one workout?',
          bodyHtml:
            "Whether you're built for power or endurance, how fast you recover, and your injury risk. <b>7 exercise-response and 5 injury &amp; recovery traits.</b>",
          warningHtml: 'Training against your build wastes years of effort.',
          sample: { label: 'Sample reading · Aerobic capacity', valueHtml: 'Good · Low', tone: 'good', percent: 22 },
        },
        {
          key: 'detox',
          tabLabel: 'Detox',
          icon: 'flask',
          image: { src: `${REPORT}/my-detox/hero.png`, alt: 'My Detox DNA report' },
          imageCaption: 'Report 4 · 3 traits',
          geneLabel: 'My Detox DNA · 3 traits',
          question: 'How well does your body clear toxins from food, air and water?',
          bodyHtml:
            'Fat- and water-soluble toxin clearance, and how well you handle oxidative stress. <b>Delhi ki hawa, plus aapke genes.</b>',
          warningHtml: 'In Indian cities, this is a daily exposure.',
          sample: { label: 'Sample reading · Oxidative stress', valueHtml: 'Poor · High', tone: 'poor', percent: 85 },
        },
      ],
      cta: { label: 'Get My Wellness Report', href: '#kit' },
      ctaNoteHtml: '4 reports · 52 traits · 1 saliva sample · <b>results in 7 days</b>',
    },

    // ------------------------------------------------------ all 52 traits ----
    {
      type: 'markerGrid',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'What you get', icon: 'target', accent: 'teal' },
        titleHtml: 'All 52 traits. One kit. <em class="tst-em-teal">No add-ons.</em>',
        leadHtml: 'Each trait gives your result, a risk level, and a plain-language recommendation.',
      },
      groups: [
        {
          kicker: 'Traits by report',
          variant: 'stat',
          items: [
            {
              statHtml: '20',
              title: 'My Diet',
              bodyHtml: '12 micronutrients · 4 macronutrient responses · 4 food sensitivities',
            },
            {
              statHtml: '17',
              title: 'My Weight',
              bodyHtml: '8 weight-management · 5 eating-behaviour · 4 genetic lipids',
            },
            { statHtml: '12', title: 'My Fitness', bodyHtml: '7 exercise-response · 5 injury &amp; recovery' },
            {
              statHtml: '3',
              title: 'My Detox',
              bodyHtml: 'Fat- &amp; water-soluble clearance · oxidative stress',
            },
          ],
        },
        {
          kicker: 'How every trait is graded',
          variant: 'detail',
          items: [
            {
              tone: 'good',
              toneLabel: 'Good',
              title: 'Low risk',
              bodyHtml: 'Normal range. Nothing to change here.',
            },
            {
              tone: 'avg',
              toneLabel: 'Average',
              title: 'Some tendency',
              bodyHtml: 'Follow the tips in your report.',
            },
            {
              tone: 'poor',
              toneLabel: 'Poor',
              title: 'Elevated',
              bodyHtml: 'Worth acting on sooner rather than later.',
            },
          ],
        },
      ],
    },

    // -------------------------------------------------------------- stats ----
    {
      type: 'stats',
      ground: 'ink',
      head: {
        eyebrow: { label: 'The number worth knowing', icon: 'chart', accent: 'teal' },
        titleHtml: 'We eat rice and roti every day.',
        leadHtml: "Most of us don't know which side of that we're on.",
      },
      stats: [
        {
          kicker: 'FTO risk variant',
          value: '2.46&times;',
          tone: 'java2',
          barPercent: 85,
          bodyHtml: 'the obesity risk for Indians carrying the FTO risk variant on a high-carb diet.',
        },
        {
          kicker: 'One saliva kit',
          value: '52',
          tone: 'java',
          barPercent: 75,
          bodyHtml: 'genetic traits read across diet, weight, fitness and detox. No add-ons.',
        },
        {
          kicker: 'Delivered as',
          value: '4',
          tone: 'pink',
          barPercent: 40,
          bodyHtml: 'separate reports in your KYG account, ready in 7 days.',
        },
      ],
      closingHtml: 'Your body ran on guesswork. Give it the right instructions.',
      cta: { label: 'Get My Wellness Report', href: '#kit', variant: 'light' },
    },

    // ----------------------------------------------------- report preview ----
    {
      type: 'reportPreview',
      ground: 'sage',
      head: {
        eyebrow: { label: 'Your report', icon: 'file' },
        titleHtml: 'No gene codes. <em class="tst-em-teal">No jargon.</em>',
      },
      bullets: [
        'Four reports, 52 traits, from one saliva kit.',
        'Each trait marked Good, Average or Poor.',
        'A plain-language recommendation with every result.',
        'Your genes never change, so you only need to test once.',
      ],
      cta: { label: 'Get My Report', href: '#kit' },
      sample: {
        badge: 'Sample',
        title: 'My Wellness · Sample Results',
        rows: [
          { label: 'Carbohydrate sensitivity', value: 'Poor · High', tone: 'poor' },
          { label: 'Fat storage', value: 'Poor · High', tone: 'poor' },
          { label: 'Aerobic capacity', value: 'Good · Low', tone: 'good' },
          { label: 'Vitamin D', value: 'Average · Med', tone: 'avg' },
          { label: 'Oxidative stress', value: 'Poor · High', tone: 'poor' },
        ],
        legendHtml: '<b>Good</b> = normal · <b>Average</b> = some risk · <b>Poor</b> = higher risk',
      },
    },

    // -------------------------------------------------------------- steps ----
    {
      type: 'steps',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'How it works', icon: 'box' },
        titleHtml: 'From your door to four reports, <em class="tst-em-teal">in 5 simple steps.</em>',
        leadHtml: 'No clinic. No needle. No fasting. About five minutes of your time.',
      },
      steps: [
        { icon: 'box', title: 'Order', bodyHtml: 'Kit reaches your door in 2 to 3 days.' },
        { icon: 'droplet', title: 'Collect', bodyHtml: 'A saliva sample at home. 5 minutes, no needles, no fasting.' },
        { icon: 'truck', title: 'Return', bodyHtml: 'Pre-paid envelope. Free courier pickup.' },
        { icon: 'microscope', title: 'NABL lab', bodyHtml: 'A scientist reviews every result.' },
        {
          icon: 'file',
          title: 'Reports',
          bodyHtml: 'Four reports in 7 days, in your KYG account.',
          accent: 'crimson',
        },
      ],
      cta: { label: 'Order My Kit', href: '#kit' },
      ctaNoteHtml: 'Ships in 2 to 3 days · <b>Free Second Opinion call after</b>',
    },

    // --------------------------------------------------------- counsellor ----
    {
      type: 'counsellor',
      ground: 'cream',
      head: {
        eyebrow: { label: 'Second Opinion · Not Google, a real expert', icon: 'users', accent: 'teal' },
        titleHtml: '52 insights is a lot. <em class="tst-em-teal">A real person shows you where to start.</em>',
      },
      image: { src: `${IMG}/counsellor.png`, alt: 'A KYG genetics expert walking through a wellness report' },
      points: [
        'A qualified counsellor reads all four of your reports before the call.',
        'They reach out within 2 days, and the 30-minute session is free.',
        'You get a priority list: which of the 52 traits to act on first.',
      ],
      floatCard: {
        icon: 'users',
        title: 'Second Opinion',
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

    // ---------------------------------------------------------------- kit ----
    {
      type: 'kit',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'One test. Answers you keep for life.', icon: 'box' },
        titleHtml: 'Everything you need, <em class="tst-em">in one box.</em>',
      },
      contents: {
        kicker: 'My Wellness Genetic Kit',
        title: '4 Reports. 52 Traits.',
        items: [
          'All 4 reports: My Diet (20), My Weight (17), My Fitness (12) &amp; My Detox (3)',
          'At-home saliva kit, delivered &amp; picked up free',
          'Easy-to-read reports in 7 days, in your KYG account',
          'Free 30-minute Second Opinion counselling session',
          'NABL-certified processing · your data is never sold',
        ],
      },
      order: {
        kicker: 'One test · once in your life',
        lines: [
          'Kit at your door in <b>2 to 3 days</b>.',
          'Sample takes <b>5 minutes</b>.',
          'Reports in <b>7 days</b>.',
        ],
        cta: { label: 'Order My Kit', href: '#kit' },
        noteHtml:
          'Certified NABL lab. Your data is never sold or shared, and your sample is destroyed after processing.',
      },
    },

    // -------------------------------------------------------------- trust ----
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
        { statHtml: '99%+', title: 'Accuracy on testing', bodyHtml: 'Tested at Neotech Worldlab, MG Road, Gurugram.' },
        {
          icon: 'badge-check',
          title: 'NABL-accredited lab',
          bodyHtml: "India's highest lab standard, on Illumina technology.",
        },
        {
          icon: 'lock',
          accent: 'crimson',
          title: 'Your data, protected',
          bodyHtml: 'Never sold or shared. Kept for future tests only if you allow.',
        },
      ],
    },

    // --------------------------------------------------------------- faqs ----
    {
      type: 'faqs',
      ground: 'cream',
      head: {
        eyebrow: { label: 'Before you order', icon: 'file' },
        titleHtml: 'Your questions, <em class="tst-em-teal">answered.</em>',
      },
      items: [
        {
          q: 'Is this one test or four?',
          a: 'One test. A single saliva kit is analysed for all 52 traits, and it is then delivered as four reports in your KYG account.',
        },
        {
          q: 'Do I need a health problem to take it?',
          a: 'No. Most people take it simply to stop guessing. It tells you which diet, training and lifestyle choices actually work with your biology.',
        },
        {
          q: "I'm vegetarian. Will the Diet report help?",
          a: 'Yes. It reads how your genes handle nutrients, not what you eat, and it flags common vegetarian gaps like B12, iron and omega-3.',
        },
        {
          q: 'What does a "Poor" result mean?',
          a: "A higher-than-average genetic tendency for that trait, not a diagnosis. It's a signal to act sooner, and your report explains exactly how.",
        },
        {
          q: 'How long do results take?',
          a: '7 days from when your sample reaches the lab. That covers processing, genotyping, and a full review before your reports are released.',
        },
        {
          q: 'Is this a medical or diagnostic test?',
          a: "No. It's a wellness and risk-screening test, and it is not a substitute for professional medical advice.",
        },
        {
          q: 'Who can see my genetic data?',
          a: 'Only you, and the expert who reviews your reports. It is never sold or shared, and kept only for future tests if you choose to allow it.',
        },
      ],
    },

    // ---------------------------------------------------------- final cta ----
    {
      type: 'finalCta',
      ground: 'ink',
      eyebrow: { label: 'Health without guesswork', icon: 'zap', accent: 'teal' },
      titleHtml: 'Your body ran on guesswork. <em class="tst-em-teal">Give it the right instructions.</em>',
      chips: [
        { label: '4 reports, 52 traits, 1 saliva kit' },
        { label: 'Results in 7 days' },
        { label: 'Expert guidance' },
      ],
      cta: { label: 'Get My Wellness Report', href: '#kit' },
      noteHtml: 'At-home saliva kit · NABL certified lab · 99%+ accuracy · Results in 7 days',
    },

    // --------------------------------------------------------- disclaimer ----
    {
      type: 'disclaimer',
      bodyHtml:
        'This test is intended for general wellness and informational purposes. It is not a diagnostic tool and does not replace a clinical evaluation. Please consult a qualified medical or nutrition professional to interpret your results and to guide any decisions about your health.',
    },
  ],
};
