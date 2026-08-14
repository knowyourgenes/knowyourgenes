// =============================================================================
// lib/tests/skin-health.ts - Skin Health test-detail page
// -----------------------------------------------------------------------------
// From health/skin-health.html. Same spine as Eye and Kidney, plus the deck's
// "food & nutrients" band: ten of its twenty markers are not conditions, so they
// go through `markerGrid` (six compact sensitivity tiles, then four nutrient
// cards) rather than riskCards, which is built around photography and a gene
// story per panel.
// =============================================================================

import type { TestPage } from '@/features/tests/types';

const IMG = '/tests/skin-health';

export const skinHealth: TestPage = {
  slug: 'skin-health',
  categorySlug: 'wellness',

  seo: {
    title: 'Skin Health DNA Test - 20 markers from one saliva sample',
    description:
      'Ten skin conditions, six food sensitivities and four nutrients - twenty genetic markers from a single at-home saliva kit. Oxidative stress, glycation, collagen, acne, sun and pollution, graded and explained.',
  },

  sections: [
    // --------------------------------------------------------------- hero ----
    {
      type: 'hero',
      eyebrow: { label: 'Genetic Testing · Not A Skin Test', icon: 'sparkles' },
      titleHtml: 'A mirror shows you today\'s skin. <em class="tst-em">Your genes show what&rsquo;s coming.</em>',
      kickerHtml: '20 markers. 1 saliva sample.',
      subHtml: 'Ten conditions, six food sensitivities and four nutrients, in 3 weeks.',
      ctas: [
        { label: "See What's Under Mine", href: '#kit' },
        { label: 'Browse The Panel', href: '#what-we-check', variant: 'ghost', icon: 'arrow-down' },
      ],
      chips: [
        { label: 'No needles', icon: 'droplet' },
        { label: 'NABL lab', icon: 'badge-check' },
        { label: 'Results in 3 weeks', icon: 'clock' },
      ],
      footnoteHtml: 'A mirror only tells you what already happened.',
      image: { src: `${IMG}/hero-skin.webp`, alt: 'A close-up of skin, clear and calm' },
      resultCard: {
        title: 'Your findings',
        icon: 'flask',
        rows: [
          { label: 'Skin Texture', value: 'Poor', tone: 'poor' },
          { label: 'Glycation', value: 'Average', tone: 'avg' },
          { label: 'Oxidative Stress', value: 'Good', tone: 'good' },
          { label: 'Acne', value: 'Average', tone: 'avg' },
          { label: 'Sun Sensitivity', value: 'Good', tone: 'good' },
        ],
      },
    },

    // --------------------------------------------------------- aspiration ----
    {
      type: 'aspiration',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'Reactive vs Preventive', icon: 'scale' },
        titleHtml:
          'A mirror only tells you what already happened. <em class="tst-em-teal">Your genes tell you what is next.</em>',
      },
      image: { src: `${IMG}/why-reactive.png`, alt: 'Skin in daylight beside skin under a UV light' },
      badgeTop: { label: 'See it early', icon: 'sun' },
      badgeBottom: { label: 'Ten years ahead', icon: 'zap' },
      rows: [
        { icon: 'flame', title: 'The redness', subtitle: 'that flared up this week.' },
        { icon: 'acne', title: 'The breakout', subtitle: 'you can&rsquo;t explain.' },
        { icon: 'wrinkle', title: 'The fine lines', subtitle: 'that seemed to appear overnight.' },
      ],
      bodyHtml:
        'By the time oxidative stress, glycation or sun damage actually show up on your face, your genes have been quietly running that program for years. The mirror only ever shows you the result, never the reason.',
      quoteHtml:
        '<em class="tst-em">Dermatologists use a UV blacklight to see what daylight hides.</em> <b class="tst-strong">This works the same way, except it looks at your genes instead of your surface, and the picture doesn&rsquo;t fade when the light turns off.</b>',
    },

    // ------------------------------------------------------------ then/now ----
    {
      type: 'thenNow',
      ground: 'ivory',
      then: {
        icon: 'eye-off',
        kicker: 'What the mirror shows',
        title: "Today's skin",
        items: [
          'Redness that flared up this week, and a breakout you can&rsquo;t explain.',
          'Fine lines that seemed to appear overnight, after years of building.',
          'The result, never the reason, and never what&rsquo;s coming next.',
        ],
      },
      now: {
        icon: 'dna',
        kicker: 'What your genes show',
        title: 'Ten years of skin',
        items: [
          'How fast your collagen breaks down, and how reactive your skin runs.',
          '<b>How sensitive you are to sugar, sun and stress, years before it shows.</b>',
          'No clinic. No needles. Only preventive care.',
        ],
      },
      closingHtml:
        'Reactive or preventive: it is your choice either way. Most people just don&rsquo;t realise they are already making it.',
      cta: { label: "See What's Under Mine", href: '#kit' },
    },

    // --------------------------------------------------------- risk cards ----
    {
      type: 'riskCards',
      ground: 'cream',
      head: {
        eyebrow: { label: 'The 10 skin conditions', icon: 'activity' },
        titleHtml: 'Ten conditions that build quietly <em class="tst-em-teal">before the mirror ever shows them.</em>',
        leadHtml: 'Twenty genetic markers. Each condition gets a clear reading: Good, Average or Poor.',
      },
      allLabel: 'All ten',
      cards: [
        {
          key: 'oxidative',
          tabLabel: 'Oxidative',
          icon: 'shield',
          image: { src: `${IMG}/risk-oxidative.webp`, alt: 'Free radicals breaking down collagen' },
          imageCaption: 'Free radicals against collagen',
          geneLabel: 'Oxidative Stress · SOD2, CAT',
          question: 'How well do I fight off free radicals?',
          bodyHtml:
            'Free radicals from sun, pollution and stress break down the proteins holding your skin together. <b>SOD2 and CAT set your natural defence.</b>',
          warningHtml: 'It runs silently, every single day.',
          sample: { label: 'Sample reading', valueHtml: 'Good · Low', tone: 'good', percent: 20 },
        },
        {
          key: 'inflam',
          tabLabel: 'Inflammation',
          icon: 'flame',
          image: { src: `${IMG}/risk-inflammation.webp`, alt: 'Redness that keeps returning' },
          imageCaption: 'Redness that keeps returning',
          geneLabel: 'Inflammation Response · IL-6, TNFA',
          question: 'Why does my skin react to everything?',
          bodyHtml:
            'How reactive your skin runs, from occasional redness to chronic flare-ups like eczema or rosacea. <b>IL-6 and TNFA set your inflammatory baseline.</b>',
          warningHtml: 'Chronic flare-ups compound over years.',
          sample: { label: 'Sample reading', valueHtml: 'Average · Medium', tone: 'avg', percent: 54 },
        },
        {
          key: 'glycation',
          tabLabel: 'Glycation',
          icon: 'sugar',
          image: { src: `${IMG}/risk-glycation.png`, alt: 'Sugar stiffening collagen fibres' },
          imageCaption: 'Sugar stiffening collagen',
          geneLabel: 'Sugar Effect / Glycation · AGER, GLO1',
          question: 'Is sugar quietly stiffening my skin?',
          bodyHtml:
            'Sugar in your bloodstream binds to collagen and elastin, slowly stiffening the very fibres that keep skin supple. <b>AGER and GLO1 govern how fast that happens.</b>',
          warningHtml: 'It builds silently over years.',
          sample: { label: 'Sample reading', valueHtml: 'Average · Medium', tone: 'avg', percent: 54 },
        },
        {
          key: 'age',
          tabLabel: 'Biological Age',
          icon: 'hourglass',
          image: { src: `${IMG}/risk-age.png`, alt: 'Cell age running ahead of birthday age' },
          imageCaption: 'Cell age, not birthday age',
          geneLabel: 'Biological Age · TERT, PPARG',
          question: 'How fast is my skin actually ageing?',
          bodyHtml:
            'How quickly your skin cells are ageing, entirely independently of the number on your birthday. <b>TERT and PPARG set the pace.</b>',
          warningHtml: 'Cell age can run well ahead of your years.',
          sample: { label: 'Sample reading', valueHtml: 'Good · Low', tone: 'good', percent: 20 },
        },
        {
          key: 'texture',
          tabLabel: 'Texture',
          icon: 'texture',
          image: { src: `${IMG}/risk-texture.webp`, alt: 'Collagen losing its structure' },
          imageCaption: 'Collagen losing its structure',
          geneLabel: 'Skin Texture · MMP1, COL1A1, ELN',
          question: 'Will my collagen hold its structure?',
          bodyHtml:
            'How well your collagen and elastin hold their structure against everyday wear, sun and time. <b>Three genes decide how fast that scaffolding gives.</b>',
          warningHtml: 'Collagen breakdown is hard to reverse late.',
          sample: { label: 'Sample reading', valueHtml: 'Poor · High', tone: 'poor', percent: 85 },
        },
        {
          key: 'cellulite',
          tabLabel: 'Cellulite',
          icon: 'cellulite',
          image: { src: `${IMG}/risk-cellulite.png`, alt: 'Uneven, dimpled skin texture' },
          imageCaption: 'Uneven, dimpled texture',
          geneLabel: 'Cellulite Pre-disposition · HIF1A, ACE',
          question: 'Am I genetically prone to cellulite?',
          bodyHtml:
            'A genetic tendency toward the uneven, dimpled texture of cellulite, largely independent of weight. <b>HIF1A and ACE shape circulation and connective tissue.</b>',
          warningHtml: 'Diet alone rarely explains it.',
          sample: { label: 'Sample reading', valueHtml: 'Average · Medium', tone: 'avg', percent: 54 },
        },
        {
          key: 'stretch',
          tabLabel: 'Stretch Marks',
          icon: 'stretch',
          image: { src: `${IMG}/risk-stretch.png`, alt: 'Skin tearing under rapid stretch' },
          imageCaption: 'Skin tearing under stretch',
          geneLabel: 'Stretch Marks · Gene TMEM18',
          question: 'How easily does my skin tear under stretch?',
          bodyHtml:
            'How prone your skin is to tearing under rapid stretching, whether from weight change, growth or pregnancy. <b>TMEM18 carries the clearest signal.</b>',
          warningHtml: 'Prevention works far better than treatment.',
          sample: { label: 'Sample reading', valueHtml: 'Poor · High', tone: 'poor', percent: 85 },
        },
        {
          key: 'acne',
          tabLabel: 'Acne',
          icon: 'acne',
          image: { src: `${IMG}/risk-acne.png`, alt: 'Oil production and immune signalling in skin' },
          imageCaption: 'Oil and immune signalling',
          geneLabel: 'Skin Problems: Acne · TGFB2, SELL',
          question: 'Why does my skin break out under stress?',
          bodyHtml:
            'How your skin&rsquo;s oil production and immune signalling respond under stress. Estimated to affect up to 80% of people at some stage of life. <b>TGFB2 and SELL shape the response.</b>',
          warningHtml: 'Scarring is far harder to undo than to prevent.',
          sample: { label: 'Sample reading', valueHtml: 'Average · Medium', tone: 'avg', percent: 54 },
        },
        {
          key: 'sun',
          tabLabel: 'Sun',
          icon: 'sun',
          image: { src: `${IMG}/risk-sun.webp`, alt: 'A lifetime of UV exposure adding up' },
          imageCaption: 'A lifetime of UV, adding up',
          geneLabel: 'Sun Sensitivity &amp; Photoageing · MC1R, ASIP + 4 more',
          question: 'How much does sun age my skin?',
          bodyHtml:
            'How much UV exposure over your lifetime turns into visible ageing and pigmentation rather than just tan. <b>Six markers, led by MC1R and ASIP.</b>',
          warningHtml: 'UV damage accumulates and does not reset.',
          sample: { label: 'Sample reading', valueHtml: 'Good · Low', tone: 'good', percent: 20 },
        },
        {
          key: 'pollution',
          tabLabel: 'Pollution',
          icon: 'air',
          image: { src: `${IMG}/risk-pollution.png`, alt: 'City air settling on skin' },
          imageCaption: 'City air, on your face',
          geneLabel: 'Pollution Effect · Gene NQO1',
          question: 'How well does my skin clear city air?',
          bodyHtml:
            'How well your skin detoxifies airborne pollutants before they trigger ageing and inflammation. <b>NQO1 governs that clearance.</b>',
          warningHtml: 'In Indian cities, this is a daily exposure.',
          sample: { label: 'Sample reading', valueHtml: 'Good · Low', tone: 'good', percent: 20 },
        },
      ],
      cta: { label: "See What's Under Mine", href: '#kit' },
      ctaNoteHtml: '20 markers · 1 saliva sample · <b>results in 3 weeks</b>',
    },

    // --------------------------------------------------------- food & nutrients ----
    {
      type: 'markerGrid',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'What you eat, on your face', icon: 'salad', accent: 'teal' },
        titleHtml: 'Six everyday foods, and four nutrients <em class="tst-em-teal">your skin depends on.</em>',
        leadHtml: 'The same saliva sample also reads how your skin actually handles them.',
      },
      groups: [
        {
          kicker: 'Six food sensitivities',
          variant: 'compact',
          items: [
            { icon: 'caffeine', title: 'Caffeine', meta: 'CYP1A2', tone: 'good', toneLabel: 'Good' },
            { icon: 'dairy', title: 'Dairy', meta: 'LCT', tone: 'good', toneLabel: 'Good' },
            {
              icon: 'cigarette',
              accent: 'crimson',
              title: 'Nicotine',
              meta: 'COMT',
              tone: 'poor',
              toneLabel: 'Poor',
            },
            { icon: 'alcohol', title: 'Alcohol', meta: 'ADH1B', tone: 'good', toneLabel: 'Good' },
            { icon: 'gluten', title: 'Gluten', meta: 'HLA-DQ2.2 / 2.5', tone: 'avg', toneLabel: 'Average' },
            { icon: 'salt', accent: 'crimson', title: 'Salt', meta: 'ACE · AGT', tone: 'poor', toneLabel: 'Poor' },
          ],
        },
        {
          kicker: 'Four key nutrients',
          variant: 'detail',
          items: [
            {
              icon: 'apple',
              title: 'Vitamin A',
              meta: 'Gene BCO1',
              tone: 'good',
              toneLabel: 'Good',
              bodyHtml: 'Critical for skin repair. Deficiency shows up as flaky, dry skin.',
            },
            {
              icon: 'leaf',
              title: 'Vitamin C',
              meta: 'Gene SLC23A1',
              tone: 'good',
              toneLabel: 'Good',
              bodyHtml: 'A powerful antioxidant, and essential for collagen synthesis.',
            },
            {
              icon: 'shield',
              accent: 'crimson',
              title: 'Vitamin E',
              meta: 'Intergenic marker',
              tone: 'poor',
              toneLabel: 'Poor',
              bodyHtml: 'Fights free radicals from pollution and sun. Your genotype shows higher deficiency risk here.',
            },
            {
              icon: 'fish',
              title: 'Omega-3',
              meta: 'Gene FADS1',
              tone: 'avg',
              toneLabel: 'Average',
              bodyHtml: 'Manages cortisol and inflammation, keeps skin supple and guards against wrinkling.',
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
        eyebrow: { label: 'The numbers', icon: 'chart', accent: 'teal' },
        titleHtml: 'What one saliva sample actually reads.',
        leadHtml: 'Most of it builds for years before the mirror ever shows it.',
      },
      stats: [
        {
          kicker: 'Acne',
          value: '80%',
          tone: 'java2',
          barPercent: 80,
          bodyHtml: 'of people are estimated to be affected by acne at some stage of life.',
        },
        {
          kicker: 'The panel',
          value: '20',
          tone: 'java',
          barPercent: 70,
          bodyHtml: 'genetic markers read from one saliva sample, across skin, food and nutrients.',
        },
        {
          kicker: 'Conditions graded',
          value: '10',
          tone: 'pink',
          barPercent: 55,
          bodyHtml: 'skin conditions graded, from oxidative stress right through to photoageing.',
        },
      ],
      closingHtml: 'Every one of these can be worked with. But only if you know which ones are yours.',
      cta: { label: "See What's Under Mine", href: '#kit', variant: 'light' },
    },

    // ----------------------------------------------------- report preview ----
    {
      type: 'reportPreview',
      ground: 'sage',
      head: {
        eyebrow: { label: 'Your report', icon: 'file' },
        titleHtml: 'No jargon. <em class="tst-em-teal">Just what to do differently.</em>',
      },
      bullets: [
        'Twenty markers, from one test.',
        'Your genotype for each, and what the science behind that gene says.',
        'Nutrition, lifestyle and skincare recommendations to match.',
        'Built to be read by you, and handed to your own dermatologist.',
      ],
      cta: { label: 'See My Findings', href: '#kit' },
      sample: {
        badge: 'Sample',
        title: 'Skin Health · Findings',
        rows: [
          { label: 'Skin Texture', value: 'Poor · High', tone: 'poor' },
          { label: 'Glycation', value: 'Average · Med', tone: 'avg' },
          { label: 'Oxidative Stress', value: 'Good · Low', tone: 'good' },
          { label: 'Acne', value: 'Average · Med', tone: 'avg' },
          { label: 'Sun Sensitivity', value: 'Good · Low', tone: 'good' },
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
        titleHtml: 'From your door to twenty markers, <em class="tst-em-teal">in 5 simple steps.</em>',
        leadHtml: 'No clinic. No needle. No fasting. About five minutes of your time.',
      },
      steps: [
        { icon: 'box', title: 'Order', bodyHtml: 'Kit reaches your door in 2 to 3 days.' },
        { icon: 'droplet', title: 'Collect', bodyHtml: 'A saliva sample at home. 5 minutes, no needles, no fasting.' },
        { icon: 'truck', title: 'Return', bodyHtml: 'Pre-paid envelope. Free courier pickup.' },
        { icon: 'microscope', title: 'NABL lab', bodyHtml: 'A scientist reviews every result.' },
        {
          icon: 'file',
          title: 'Findings',
          bodyHtml: 'Ready in 3 weeks, easy to understand on your own.',
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
        titleHtml: 'A genotype on its own is just letters. <em class="tst-em-teal">We help you read it.</em>',
      },
      image: { src: `${IMG}/counsellor.webp`, alt: 'A KYG genetics expert reviewing a skin finding' },
      points: [
        'Every single report is checked by our genetics team before it reaches you.',
        'Want a finding explained? Book a free Second Opinion session with us.',
        'Easy to understand, and easy to hand to your own dermatologist.',
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
        kicker: 'Skin Health Genetic Kit',
        title: '20 Markers. One Panel.',
        items: [
          '10 skin conditions: oxidative stress, inflammation, glycation, biological age, texture, cellulite, stretch marks, acne, sun sensitivity &amp; pollution',
          '6 food sensitivities: caffeine, dairy, nicotine, alcohol, gluten &amp; salt',
          '4 key nutrients: Vitamin A, C, E &amp; Omega-3',
          'At-home saliva kit, delivered &amp; picked up free · findings in 3 weeks',
          'NABL-certified processing · your data is never sold',
        ],
      },
      order: {
        kicker: 'One test · once in your life',
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
        eyebrow: { label: 'Before you decide', icon: 'file' },
        titleHtml: 'Your questions, <em class="tst-em-teal">answered.</em>',
      },
      items: [
        {
          q: 'My skin looks fine. Why should I still test?',
          a: 'Glycation, oxidative stress and collagen breakdown build quietly for years before showing in the mirror. Testing while your skin looks fine is exactly when the results are most useful.',
        },
        {
          q: 'How is the sample collected?',
          a: 'A simple saliva swab at home. No blood draw, no fasting, and no clinic visit required.',
        },
        {
          q: 'How long do results take?',
          a: 'At least 3 weeks. That covers processing, genetic testing, and a full review by our genetics team before your report is sent out.',
        },
        {
          q: 'Does a "Poor" finding mean I already have the condition?',
          a: 'No. A Poor reading means higher genetic risk, not that the condition is present. Results are probabilistic and are best discussed with a dermatologist or nutritionist.',
        },
        {
          q: 'Can this replace my dermatologist?',
          a: 'No. It tells you what to watch for, and what to adjust in diet and lifestyle. It works alongside professional skincare advice, not instead of it.',
        },
        {
          q: 'Who reviews my report?',
          a: 'Our genetics team, led by Dr. Varun Sharma, Ph.D. Every single report is reviewed before it reaches you.',
        },
        {
          q: 'Who can see my genetic data?',
          a: 'Only you, and the expert who reviews your report. It is never sold or shared, and kept only for future tests if you choose to allow it.',
        },
      ],
    },

    // ---------------------------------------------------------- final cta ----
    {
      type: 'finalCta',
      ground: 'ink',
      eyebrow: { label: 'Know now, not later', icon: 'zap', accent: 'teal' },
      titleHtml: 'The mirror only shows you today. <em class="tst-em-teal">This shows you what&rsquo;s coming.</em>',
      chips: [{ label: '20 markers, 1 saliva kit' }, { label: 'Results in 3 weeks' }, { label: 'Expert guidance' }],
      cta: { label: "See What's Under Mine", href: '#kit' },
      noteHtml: 'At-home saliva kit · NABL certified lab · Results in 3 weeks',
    },

    // --------------------------------------------------------- disclaimer ----
    {
      type: 'disclaimer',
      bodyHtml:
        "This test is intended for general wellness and informational purposes. It is not a diagnostic tool and does not replace a dermatologist's evaluation. Please consult a qualified skincare or medical professional to interpret your results and to guide any decisions about your skin health.",
    },
  ],
};
