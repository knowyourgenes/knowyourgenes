// =============================================================================
// lib/tests/immunity-health.ts - Immunity test-detail page
// -----------------------------------------------------------------------------
// From health/immunity-health.html, the widest deck of the set: 24 markers split
// across 11 infection results, 11 micronutrients and 3 detox readings. Mapping:
//
//   who it's for      -> whoFor
//   reactive vs prev. -> aspiration + thenNow
//   body map          -> bodyMap        (six hotspots)
//   the 11 tests      -> riskCards
//   fuel and clean-up -> markerGrid     (11 compact tiles + 3 detail cards)
//   the numbers       -> stats
//   30-sec explainer  -> explainer
//   value             -> contrast
//
// The six hotspots are not the Women's Health panels, so each carries its own
// `geom`, rebased from the deck's 820x560 overlay onto the 720x492 figure box
// BodyMap draws in (scale 0.935, anatomy origin (208,34)) - same transform as
// lib/tests/mens-health.ts.
// =============================================================================

import type { TestPage } from '@/features/tests/types';

const IMG = '/tests/immunity-health';

export const immunityHealth: TestPage = {
  slug: 'immunity-health',
  categorySlug: 'wellness',

  seo: {
    title: 'Immunity DNA Test - 24 markers from one saliva sample',
    description:
      'Eleven infection results, eleven micronutrients and three detox readings - how quickly you catch something and how long it keeps you down, read from a single at-home saliva kit.',
  },

  sections: [
    // --------------------------------------------------------------- hero ----
    {
      type: 'hero',
      eyebrow: { label: 'Genetic Testing · Immunity', icon: 'shield' },
      titleHtml:
        "What's the most effective way to increase immunity? <em class='tst-em'>It starts with your genes, not your diet.</em>",
      kickerHtml: '24 markers. 1 saliva sample.',
      subHtml: 'Eleven readings on how your body handles infection, plus the nutrients and detox behind them.',
      ctas: [
        { label: 'Check My Immunity', href: '#kit' },
        { label: 'See What We Check', href: '#what-we-check', variant: 'ghost', icon: 'arrow-down' },
      ],
      chips: [
        { label: 'No needles', icon: 'droplet' },
        { label: 'NABL lab', icon: 'badge-check' },
        { label: 'Results in 3 weeks', icon: 'clock' },
      ],
      footnoteHtml: 'Built from your genes. Working since the day you were born.',
      image: { src: `${IMG}/hero.webp`, alt: 'A person healthy and getting on with an ordinary day' },
      resultCard: {
        title: 'Sample results',
        icon: 'flask',
        rows: [
          { label: 'Bacterial infection', value: 'Average', tone: 'avg' },
          { label: 'Respiratory viruses', value: 'Poor', tone: 'poor' },
          { label: 'Fungal infection', value: 'Good', tone: 'good' },
          { label: 'Vitamin D', value: 'Average', tone: 'avg' },
          { label: 'Detox', value: 'Good', tone: 'good' },
        ],
      },
    },

    // ------------------------------------------------------------- who for ----
    {
      type: 'whoFor',
      ground: 'sage',
      head: {
        eyebrow: { label: 'Who should take this test', icon: 'users' },
        titleHtml: 'Six reasons to test sooner <em class="tst-em">rather than later.</em>',
      },
      image: { src: `${IMG}/who.webp`, alt: 'A person going about a normal, healthy day' },
      introTitleHtml: 'This test is for you if&hellip;',
      introBodyHtml:
        'Your genes don&rsquo;t change, so you only ever need to do this once. The answers stay true for the rest of your life. Some people just have more reason to get them early, and one line below is usually enough to know if that&rsquo;s you.',
      chips: [
        { label: 'Test once, for life', icon: 'clock' },
        { label: 'Preventive, not reactive', icon: 'chart' },
      ],
      signs: [
        {
          icon: 'sick',
          accent: 'crimson',
          textHtml: 'You catch <b>every cold or flu</b> that goes around your home or office.',
        },
        {
          icon: 'tired',
          accent: 'teal',
          textHtml: 'You get <b>sick more often</b> than the people around you, or recover more slowly.',
        },
        {
          icon: 'users',
          accent: 'crimson',
          textHtml: 'Autoimmune conditions or <b>frequent infections run in your family.</b>',
        },
        {
          icon: 'leaf',
          accent: 'teal',
          textHtml: 'You eat mostly <b>plant-based</b>, which can affect Vitamin B12 and iron levels.',
        },
        {
          icon: 'heart',
          accent: 'crimson',
          textHtml: "You've had a <b>serious illness</b> and want to understand what left you vulnerable.",
        },
        {
          icon: 'badge-check',
          accent: 'teal',
          textHtml: 'You feel completely fine and simply want a <b>genetic baseline.</b>',
        },
      ],
      closingHtml: 'Find out now and you can prepare. Find out later and you are already recovering.',
      ctas: [
        { label: 'Check My Immunity', href: '#kit' },
        { label: 'Learn More', href: '#what-we-check', variant: 'ghost' },
      ],
    },

    // --------------------------------------------------------- aspiration ----
    {
      type: 'aspiration',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'Reactive vs Preventive', icon: 'scale' },
        titleHtml: 'You can be low on iron for years <em class="tst-em-teal">without ever knowing it.</em>',
      },
      image: { src: `${IMG}/why-reactive.png`, alt: 'A shield holding, and a shield with a gap' },
      badgeTop: { label: 'Know the weak points', icon: 'shield' },
      badgeBottom: { label: 'Reinforce, in advance', icon: 'zap' },
      rows: [
        { icon: 'sick', title: 'Every cold', subtitle: 'that goes around, you catch.' },
        { icon: 'tired', title: 'The tiredness', subtitle: 'you never connect to iron.' },
        { icon: 'hourglass', title: 'The slow recovery', subtitle: 'you just put down to bad luck.' },
      ],
      bodyHtml:
        'Most people find out where they are weak only after they have already been ill. Or years later, when a routine blood test happens to catch a deficiency that was there the whole time.',
      quoteHtml:
        '<em class="tst-em">Your immune system was built from your genes, and it has been working every day since you were born.</em> <b class="tst-strong">This test shows you which parts of it are strong, and which parts could use help.</b>',
    },

    // ------------------------------------------------------------ then/now ----
    {
      type: 'thenNow',
      ground: 'ivory',
      then: {
        icon: 'eye-off',
        kicker: 'Reactive',
        title: 'You wait to fall ill',
        items: [
          'An illness finds your weak spot before you do.',
          'You are low on iron or Vitamin D for years without ever knowing it.',
          'You put the tiredness, the slow recovery and the constant colds down to bad luck.',
        ],
      },
      now: {
        icon: 'shield',
        kicker: 'Preventive',
        title: 'You know your weak spots',
        items: [
          'You test once, and know which of the 11 results are weaker for you.',
          '<b>You fix the gaps, a low vitamin or a weak spot, before an illness finds them.</b>',
          'No clinic. No needles. Only preventive care.',
        ],
      },
      closingHtml: 'Your immune system is only as strong as its weakest part. This tells you which part that is.',
      cta: { label: 'Check My Immunity', href: '#kit' },
    },

    // ----------------------------------------------------------- body map ----
    {
      type: 'bodyMap',
      ground: 'sage',
      head: {
        eyebrow: { label: 'Where we look', icon: 'target' },
        titleHtml:
          'Your immune system isn\'t one organ. <em class="tst-em-teal">It\'s six places, working together.</em>',
        leadHtml: 'Tap any part of the body to see what we check there.',
      },
      image: { src: `${IMG}/bodymap-figure.png`, alt: 'Anatomical figure marking the six immune sites' },
      hotspots: [
        {
          key: 'barriers',
          label: 'Barriers',
          caption: 'Skin & mucous membranes',
          tipTitle: 'Barriers · Skin & mucous membranes',
          tipBody:
            'Your skin and mucous membranes are the first wall a pathogen has to get through, before your immune system is even involved.',
          x: 49.7,
          y: 14.8,
          side: 'left',
          geom: {
            box: [26, 52, 340, 44],
            dot: [358, 73],
            line: [206, 73, 346, 73],
            text: { side: 'left', x: 195, y: 54 },
            ring: '#0e4d4b',
            core: '#0e4d4b',
          },
        },
        {
          key: 'lymph',
          label: 'Lymph Nodes',
          caption: 'Bacterial & fungal response',
          tipTitle: 'Lymph Nodes · Bacterial & fungal response',
          tipBody:
            'Where immune cells coordinate their response to bacteria and fungi that make it past your barriers. Genes: MYD88, TLR4, CLEC7A.',
          x: 55.1,
          y: 29.3,
          side: 'right',
          geom: {
            box: [380, 108, 340, 60],
            dot: [397, 144],
            line: [520, 129, 410, 142],
            text: { side: 'right', x: 531, y: 110 },
            ring: '#15605d',
            core: '#15605d',
          },
        },
        {
          key: 'lungs',
          label: 'Lungs',
          caption: 'Colds, flu and COVID',
          tipTitle: 'Lungs · Respiratory & SARS-CoV',
          tipBody:
            'How your genes shape respiratory response to viral infection, including COVID-19 severity. Genes: IL6, CCL2, MBL, ACE2.',
          x: 47.6,
          y: 38.8,
          side: 'left',
          geom: {
            box: [26, 170, 340, 44],
            dot: [343, 191],
            line: [206, 182, 329, 189],
            text: { side: 'left', x: 195, y: 172 },
            ring: '#3a5fcd',
            core: '#3a5fcd',
          },
        },
        {
          key: 'liver',
          label: 'Liver',
          caption: 'Detox capacity',
          tipTitle: 'Liver · Detoxification',
          tipBody:
            'Phase 1 and Phase 2 detox: how efficiently your liver clears toxins that would otherwise burden your immune system. Genes: CYP1A1, CYP1B1, UGT1A1, GSTP1 and more.',
          x: 51.9,
          y: 51.4,
          side: 'right',
          geom: {
            box: [356, 252, 364, 60],
            dot: [373, 253],
            line: [520, 277, 386, 254],
            text: { side: 'right', x: 531, y: 258 },
            ring: '#25b5ab',
            core: '#0e7c77',
          },
        },
        {
          key: 'gut',
          label: 'Gut',
          caption: 'Inflammatory tendency',
          tipTitle: 'Gut · Inflammatory response',
          tipBody:
            'A large share of your immune tissue lives along your gut lining. Genes here shape your tendency toward inflammatory bowel conditions. Genes: NOD2, ATG16L1.',
          x: 48.0,
          y: 62.7,
          side: 'left',
          geom: {
            box: [26, 295, 340, 44],
            dot: [344, 309],
            line: [206, 318, 331, 310],
            text: { side: 'left', x: 195, y: 297 },
            ring: '#25b5ab',
            core: '#0e7c77',
          },
        },
        {
          key: 'marrow',
          label: 'Bone Marrow',
          caption: 'Where defenders are made',
          tipTitle: 'Bone Marrow · Where defenders are made',
          tipBody:
            'Where your immune cells and red blood cells are made. Shapes how you handle Iron, Vitamin B12 and Magnesium, all essential for immune cell production.',
          x: 51.9,
          y: 78.7,
          side: 'right',
          geom: {
            box: [356, 381, 364, 60],
            dot: [373, 387],
            line: [520, 402, 386, 389],
            text: { side: 'right', x: 531, y: 383 },
            ring: '#3a5fcd',
            core: '#2543a0',
          },
        },
      ],
    },

    // --------------------------------------------------------- risk cards ----
    {
      type: 'riskCards',
      ground: 'cream',
      head: {
        eyebrow: { label: 'What we check', icon: 'activity' },
        titleHtml: 'Eleven answers about how <em class="tst-em-teal">your body handles an infection.</em>',
        leadHtml: 'Each one is graded the same simple way: Good, Average or Poor.',
      },
      allLabel: 'All eleven',
      cards: [
        {
          key: 'bacterial',
          tabLabel: 'Bacterial',
          icon: 'virus',
          image: { src: `${IMG}/risk-bacterial.png`, alt: 'A fast-moving bacterial infection' },
          imageCaption: 'Malaria · TB · Bacteremia · Pneumococcal',
          geneLabel: 'Bacterial Infection · Gene MYD88',
          question: 'How fast do I respond to bacteria?',
          bodyHtml:
            'How quickly your immune system recognises and responds to fast-moving bacterial infections. <b>MYD88 sits at the centre of that alarm.</b>',
          warningHtml: 'These infections move fast. Hours matter.',
          sample: { label: 'Sample result', valueHtml: 'Average · Medium', tone: 'avg', percent: 54 },
        },
        {
          key: 'gramneg',
          tabLabel: 'Gram-negative',
          icon: 'microscope',
          image: { src: `${IMG}/risk-gramneg.png`, alt: 'Immune receptors recognising a pathogen' },
          imageCaption: 'Pathogen recognition',
          geneLabel: 'Gram-Negative Bacteria · Gene TLR4',
          question: 'Does my body spot gram-negative bacteria?',
          bodyHtml:
            'How well your innate immune system recognises and mounts a response to gram-negative bacteria. <b>TLR4 is the receptor that does the spotting.</b>',
          warningHtml: 'Your body cannot fight what it does not spot.',
          sample: { label: 'Sample result', valueHtml: 'Good · Low', tone: 'good', percent: 20 },
        },
        {
          key: 'parasitic',
          tabLabel: 'Parasitic',
          icon: 'droplet',
          image: { src: `${IMG}/risk-parasitic.png`, alt: 'Red blood cells and the malaria parasite' },
          imageCaption: 'Malaria resistance',
          geneLabel: 'Parasitic Infection · Gene HBB',
          question: 'Do my red blood cells resist malaria?',
          bodyHtml:
            'Genetic resistance in your red blood cells against the malaria parasite, one of the oldest selection pressures on human genes. <b>HBB carries that signal.</b>',
          warningHtml: 'Still a live risk across much of India.',
          sample: { label: 'Sample result', valueHtml: 'Good · Low', tone: 'good', percent: 20 },
        },
        {
          key: 'hiv',
          tabLabel: 'HIV',
          icon: 'shield-plus',
          image: { src: `${IMG}/risk-hiv.png`, alt: 'Viral load under immune control' },
          imageCaption: 'Viral load control',
          geneLabel: 'HIV · HCP5, HLA-C',
          question: 'How well would I control viral load?',
          bodyHtml:
            'How effectively your body controls viral load if exposed, which shapes how quickly illness could progress. <b>HCP5 and HLA-C set that control.</b>',
          warningHtml: 'How fast your body reacts changes how the illness unfolds.',
          sample: { label: 'Sample result', valueHtml: 'Poor · High', tone: 'poor', percent: 85 },
        },
        {
          key: 'respiratory',
          tabLabel: 'Respiratory',
          icon: 'stethoscope',
          image: { src: `${IMG}/risk-respiratory.webp`, alt: 'An inflamed respiratory response' },
          imageCaption: 'Including COVID-19',
          geneLabel: 'Respiratory Disease · Gene IL6',
          question: 'Could my immune system overreact?',
          bodyHtml:
            'How likely your immune system is to overreact to respiratory viruses, sometimes called a cytokine storm. <b>IL6 expression drives that response.</b>',
          warningHtml: 'Overreaction can be as damaging as the virus.',
          sample: { label: 'Sample result', valueHtml: 'Poor · High', tone: 'poor', percent: 85 },
        },
        {
          key: 'sars',
          tabLabel: 'SARS-CoV',
          icon: 'biohazard',
          image: { src: `${IMG}/risk-sars.png`, alt: 'Susceptibility to the SARS-CoV family' },
          imageCaption: 'Susceptibility',
          geneLabel: 'SARS-CoV Infection · CCL2, MBL',
          question: 'How susceptible am I to SARS-family viruses?',
          bodyHtml:
            "Genetic susceptibility to infection from the SARS-CoV family of viruses, separate from how severely you'd respond. <b>CCL2 and MBL set that exposure risk.</b>",
          warningHtml: 'Catching something and being badly affected are two different things.',
          sample: { label: 'Sample result', valueHtml: 'Poor · High', tone: 'poor', percent: 85 },
        },
        {
          key: 'fungal',
          tabLabel: 'Fungal',
          icon: 'sprout',
          image: { src: `${IMG}/risk-fungal.png`, alt: 'Immune pattern recognition of fungi' },
          imageCaption: 'Pattern recognition',
          geneLabel: 'Fungal Infection · Gene CLEC7A',
          question: 'How well do I recognise fungal invaders?',
          bodyHtml:
            'How well your body spots and clears fungal infections, which thrive in humid Indian conditions. <b>CLEC7A does that pattern recognition.</b>',
          warningHtml: 'Humidity and heat raise everyday exposure.',
          sample: { label: 'Sample result', valueHtml: 'Good · Low', tone: 'good', percent: 20 },
        },
        {
          key: 'ibd',
          tabLabel: 'Bowel',
          icon: 'bandage',
          image: { src: `${IMG}/risk-ibd.png`, alt: 'Inflammation along the gut lining' },
          imageCaption: 'Colon &amp; small intestine',
          geneLabel: 'Inflammatory Bowel Risk · NOD2, ATG16L1',
          question: 'Is my gut prone to inflammation?',
          bodyHtml:
            "Genetic tendency toward inflammatory conditions of the gut, similar to Crohn's disease. <b>NOD2 and ATG16L1 govern gut-lining immunity.</b>",
          warningHtml: 'A large share of immune tissue lives in your gut.',
          sample: { label: 'Sample result', valueHtml: 'Average · Medium', tone: 'avg', percent: 54 },
        },
        {
          key: 'asthma',
          tabLabel: 'Asthma',
          icon: 'air',
          image: { src: `${IMG}/risk-asthma.png`, alt: 'An elevated allergic airway response' },
          imageCaption: 'Allergic response',
          geneLabel: 'Asthma · Gene IL13',
          question: 'Do I run a high allergic response?',
          bodyHtml:
            'A genetic tendency toward elevated allergic response, which raises susceptibility to asthma. <b>IL13 sits behind that reaction.</b>',
          warningHtml: 'Air quality makes this a daily exposure.',
          sample: { label: 'Sample result', valueHtml: 'Average · Medium', tone: 'avg', percent: 54 },
        },
        {
          key: 'covid',
          tabLabel: 'COVID-19',
          icon: 'heart',
          image: { src: `${IMG}/risk-covid.png`, alt: 'How severely the body responds to COVID-19' },
          imageCaption: 'Disease severity',
          geneLabel: 'COVID-19 Severity · Gene ACE2',
          question: 'How severely might my body respond?',
          bodyHtml:
            'How severely your body may respond if infected with COVID-19, rather than how likely you are to catch it. <b>ACE2 is the receptor that matters most here.</b>',
          warningHtml: 'This is about how hard it hits, not whether you catch it.',
          sample: { label: 'Sample result', valueHtml: 'Poor · High', tone: 'poor', percent: 85 },
        },
        {
          key: 'inflammation',
          tabLabel: 'Inflammation',
          icon: 'flame',
          image: { src: `${IMG}/risk-inflammation.webp`, alt: 'Baseline inflammation across the body' },
          imageCaption: 'TNF expression',
          geneLabel: 'General Inflammation · Gene TNF-BETA',
          question: 'What is my baseline inflammation?',
          bodyHtml:
            'Your baseline tendency toward inflammatory responses across the whole body, not just one system. <b>TNF-BETA sets that resting level.</b>',
          warningHtml: 'Low-level inflammation does its damage slowly, over years.',
          sample: { label: 'Sample result', valueHtml: 'Average · Medium', tone: 'avg', percent: 54 },
        },
      ],
      cta: { label: 'Check My Immunity', href: '#kit' },
      ctaNoteHtml: '24 markers · 1 saliva sample · <b>results in 3 weeks</b>',
    },

    // ------------------------------------------------- fuel and clean-up ----
    {
      type: 'markerGrid',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'Fuel and clean-up', icon: 'salad', accent: 'teal' },
        titleHtml: 'Eleven nutrients your immune cells need, <em class="tst-em-teal">and three detox readings.</em>',
        leadHtml:
          'Eleven nutrients your immune cells need to do their job, and three results on how well your liver clears what gets in the way.',
      },
      groups: [
        {
          kicker: 'Eleven micronutrients',
          variant: 'compact',
          items: [
            { icon: 'apple', title: 'Vitamin A', meta: 'BCO1', tone: 'good', toneLabel: 'Good' },
            { icon: 'pill', title: 'Vitamin B6', meta: 'NBPF3', tone: 'good', toneLabel: 'Good' },
            { icon: 'sprout', title: 'Vitamin B9', meta: 'MTHFR', tone: 'avg', toneLabel: 'Average' },
            { icon: 'pill', title: 'Vitamin B12', meta: 'FUT2', tone: 'good', toneLabel: 'Good' },
            { icon: 'leaf', title: 'Vitamin C', meta: 'SLC23A1', tone: 'good', toneLabel: 'Good' },
            { icon: 'sun', title: 'Vitamin D & Calcium', meta: 'VDR · GC', tone: 'avg', toneLabel: 'Average' },
            { icon: 'shield', accent: 'crimson', title: 'Vitamin E', meta: 'BUD13', tone: 'poor', toneLabel: 'Poor' },
            { icon: 'salad', title: 'Vitamin K', meta: 'VKORC1', tone: 'avg', toneLabel: 'Average' },
            { icon: 'zap', title: 'Magnesium', meta: 'MECOM · BRWD1P2', tone: 'good', toneLabel: 'Good' },
            { icon: 'droplet', title: 'Iron', meta: 'TMPRSS6', tone: 'avg', toneLabel: 'Average' },
            { icon: 'fish', title: 'Omega-3', meta: 'FADS1 · FADS2', tone: 'avg', toneLabel: 'Average' },
          ],
        },
        {
          kicker: 'Three detox results',
          variant: 'detail',
          items: [
            {
              icon: 'flask',
              title: 'Detox Phase 1',
              meta: 'CYP1A1 · CYP1B1',
              tone: 'good',
              toneLabel: 'Good',
              bodyHtml: 'The first stage of clearing toxins, before they can burden your immune system.',
            },
            {
              icon: 'sparkles',
              title: 'Detox Phase 2',
              meta: 'UGT1A1 · GSTP1 + 5 more',
              tone: 'good',
              toneLabel: 'Good',
              bodyHtml: 'The second stage, where processed toxins are finally packaged for removal.',
            },
            {
              icon: 'shield',
              title: 'Oxidative Stress',
              meta: 'SOD2 · NQO1',
              tone: 'good',
              toneLabel: 'Good',
              bodyHtml: 'How well you neutralise the free radicals produced by an active immune response.',
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
        eyebrow: { label: 'The numbers, nationally', icon: 'chart', accent: 'teal' },
        titleHtml: '70% of Indians are short on Vitamin D. Half are short on iron.',
        leadHtml: 'Most people find out only after they have already been ill.',
      },
      stats: [
        {
          kicker: 'Vitamin D',
          value: '70%',
          tone: 'java2',
          barPercent: 70,
          bodyHtml: 'of people in India are estimated to have some degree of Vitamin D deficiency or insufficiency.',
        },
        {
          kicker: 'Iron',
          value: '1 in 2',
          tone: 'java',
          barPercent: 50,
          bodyHtml: 'people in India have some degree of iron deficiency, a mineral immune cells depend on.',
        },
        {
          kicker: 'This panel',
          value: '24',
          tone: 'ice',
          barPercent: 80,
          bodyHtml: 'genetic markers read from one saliva sample, across infection, nutrients and detox.',
        },
      ],
      closingHtml:
        'A low vitamin is one of the easiest things in medicine to fix. It is also one of the easiest to never notice.',
      cta: { label: 'Check My Immunity', href: '#kit', variant: 'light' },
    },

    // ---------------------------------------------------------- explainer ----
    {
      type: 'explainer',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'How genes shape immunity', icon: 'microscope' },
        titleHtml: 'How your genes shape your immune system, <em class="tst-em">in three steps.</em>',
      },
      cards: [
        {
          image: { src: `${IMG}/explainer-1.webp`, alt: 'Genes decide how your immune cells are built' },
          bodyHtml: 'Genes decide how your immune cells are built, and how they communicate.',
        },
        {
          image: { src: `${IMG}/explainer-2.webp`, alt: 'Some genes make you faster to respond, or slower to recover' },
          bodyHtml: 'Some of them make you faster to respond, or slower to recover.',
        },
        {
          image: { src: `${IMG}/explainer-3.webp`, alt: 'We check yours so you know where you need help' },
          bodyHtml: 'We check yours, so you know where you need help instead of guessing.',
        },
      ],
      closingHtml: 'One saliva sample. That is all it takes.',
    },

    // ----------------------------------------------------------- contrast ----
    {
      type: 'contrast',
      ground: 'cream',
      head: {
        eyebrow: { label: 'Why it is worth it', icon: 'scale', accent: 'teal' },
        titleHtml: 'Two women, the same age. <em class="tst-em-teal">One of them tested.</em>',
      },
      negative: {
        badge: { label: 'Regret', icon: 'frown' },
        image: { src: `${IMG}/contrast-never.png`, alt: 'Someone unwell again, still guessing' },
        kicker: 'She never tested',
        title: 'Still guessing, years later',
        items: [
          "She keeps catching every cold that goes around, and assumes it's just bad luck.",
          "She's mildly iron deficient for years and never connects it to her constant tiredness.",
          'She has no idea her genes carry a higher inflammatory tendency until symptoms show up.',
        ],
      },
      positive: {
        badge: { label: 'Peace of mind', icon: 'smile' },
        image: { src: `${IMG}/contrast-tested.png`, alt: 'Someone healthy years later, having acted early' },
        kicker: 'She tested early',
        title: 'Still ahead, years later',
        items: [
          'She knows her iron and B12 run low, so her diet already accounts for it.',
          "Her body handles respiratory viruses worse than average, so she doesn't skip her flu shot.",
          "She and her doctor already have a plan for the conditions she's genetically more likely to face.",
        ],
      },
      closingHtml: 'One test today can save you years of catching everything that goes around.',
      cta: { label: 'Check My Immunity', href: '#kit' },
    },

    // ----------------------------------------------------- report preview ----
    {
      type: 'reportPreview',
      ground: 'sage',
      head: {
        eyebrow: { label: 'Your report', icon: 'file' },
        titleHtml: 'A starting point, <em class="tst-em-teal">not a diagnosis.</em>',
      },
      bullets: [
        'Twenty-four markers, from one test.',
        'Your genotype at each marker, and what the science behind that gene says.',
        'Clear recommendations, so you know exactly what to do about each one.',
        'Built to be read by you, and handed to your own doctor.',
      ],
      cta: { label: 'See My Findings', href: '#kit' },
      sample: {
        badge: 'Sample',
        title: 'Immunity · Results',
        rows: [
          { label: 'Bacterial Defense', value: 'Average · Med', tone: 'avg' },
          { label: 'Respiratory Defense', value: 'Poor · High', tone: 'poor' },
          { label: 'Fungal Defense', value: 'Good · Low', tone: 'good' },
          { label: 'Vitamin D Supply', value: 'Average · Med', tone: 'avg' },
          { label: 'Detox Capacity', value: 'Good · Low', tone: 'good' },
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
        titleHtml: 'Five steps, from kit to report. <em class="tst-em-teal">Three weeks, start to finish.</em>',
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
        titleHtml: 'A free call with our genetics team, <em class="tst-em-teal">included with every report.</em>',
      },
      image: { src: `${IMG}/counsellor.webp`, alt: 'A KYG genetics expert reviewing an immunity result' },
      points: [
        'Every single report is checked by our genetics team before it reaches you.',
        'Want a result explained? Book a free Second Opinion session with us.',
        'Easy to understand, and easy to hand to your own doctor.',
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
        kicker: 'Immunity Genetic Kit',
        title: '24 Markers. One Report.',
        items: [
          '11 infection results: bacterial, viral, fungal and parasitic infection risk, plus inflammatory tendencies',
          '11 micronutrients: Vitamin A, B6, B9, B12, C, D, E, K, Magnesium, Iron &amp; Omega-3',
          '3 detoxification readings: Phase 1, Phase 2 &amp; Oxidative Stress',
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
          q: 'I feel completely healthy. Why should I still test?',
          a: "Most people only find out where their immune system runs weak after they've already been sick, or after a routine blood test flags a deficiency that has been quietly there for years. Feeling fine is exactly the best time to test, because you can fix a weak spot before an illness finds it.",
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
          q: 'Does a "Poor" result mean I will get sick?',
          a: 'No. A Poor result means your genetic tendency runs higher than average, not that illness is guaranteed. It is exactly the kind of thing worth building extra resilience around, through diet, sleep and vaccination.',
        },
        {
          q: 'Can this replace a blood test for deficiencies?',
          a: 'No. It tells you your genetic tendency, not your current level, and it works alongside routine blood tests rather than instead of them.',
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
      titleHtml: 'See what your immune system <em class="tst-em-teal">is actually made of.</em>',
      chips: [{ label: '24 markers, 1 saliva kit' }, { label: 'Results in 3 weeks' }, { label: 'Expert guidance' }],
      cta: { label: 'Check My Immunity', href: '#kit' },
      noteHtml: 'At-home saliva kit · NABL certified lab · Results in 3 weeks',
    },

    // --------------------------------------------------------- disclaimer ----
    {
      type: 'disclaimer',
      bodyHtml:
        'This test is intended for general wellness and informational purposes. It is not a diagnostic tool and does not replace blood testing or clinical evaluation. Please consult a qualified medical professional to interpret your results and to guide any decisions about your health.',
    },
  ],
};
