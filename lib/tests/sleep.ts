// =============================================================================
// lib/tests/sleep.ts - Sleep test-detail page
// -----------------------------------------------------------------------------
// From health/sleep-health.html. Mapping:
//
//   who it's for      -> markerGrid  (6 detail cards, no sub-heading)
//   why test          -> aspiration + thenNow
//   body map          -> bodyMap     (four hotspots)
//   the 28 readings   -> markerGrid  (22 cards in 5 labelled groups)
//   the numbers       -> stats
//   30-second version -> markerGrid  (3 `stat` cards)
//
// THREE markerGrid sections, so each carries its own `anchorId` - duplicate ids
// are invalid and every in-page link would resolve to the first one.
//
// TWO DELIBERATE DEVIATIONS from the deck, both flagged rather than silent:
//
//  1. The readings section ships filter pills in the deck (All 28 / Sleep
//     specific / Nerves & airway / Micronutrients / Food & alcohol / Weight &
//     lipids). markerGrid renders server-side with no state, so the same
//     taxonomy is expressed as five LABELLED GROUPS instead. Nothing is lost -
//     every card and its category is still on the page - and 22 items read
//     better grouped than behind a filter. Making it filterable means turning
//     MarkerGrid into a client component; say the word.
//  2. The deck headlines "28 readings" but draws 22 cards; several bundle extra
//     markers into their copy (B6, B12, Vitamin C, LDL, FTO). The 22 cards are
//     reproduced verbatim and the "28" copy is kept, exactly as the deck has it.
//
// This panel has NO riskCards section, so the hero's second CTA points at
// `#the-readings` (this page's own markerGrid) rather than `#what-we-check`.
// =============================================================================

import type { TestPage } from '@/features/tests/types';

const IMG = '/tests/sleep';

export const sleep: TestPage = {
  slug: 'sleep',
  categorySlug: 'wellness',

  seo: {
    title: 'Sleep DNA Test - 28 readings from one saliva sample',
    description:
      'Apnea, insomnia, sleep duration, teeth grinding, restless legs, narcolepsy, your airway and the eight nutrients sleep runs on - 28 genetic readings from a single at-home saliva kit, in 3 weeks.',
  },

  sections: [
    // --------------------------------------------------------------- hero ----
    {
      type: 'hero',
      eyebrow: { label: 'Genetic Testing · Sleep', icon: 'moon' },
      titleHtml: 'It&rsquo;s 3 AM. Still wide awake? <em class="tst-em">Your genes might explain why.</em>',
      kickerHtml: '28 readings. 1 saliva sample.',
      subHtml:
        'Apnea, insomnia, sleep duration, teeth grinding, restless legs, narcolepsy, your airway, and the eight nutrients sleep runs on.',
      ctas: [
        { label: 'Check My Sleep', href: '#kit' },
        { label: 'See All 28 Readings', href: '#the-readings', variant: 'ghost', icon: 'arrow-down' },
      ],
      chips: [
        { label: 'At-home kit', icon: 'box' },
        { label: 'No needles', icon: 'droplet' },
        { label: 'Results in 3 weeks', icon: 'clock' },
        { label: 'NABL-accredited lab', icon: 'badge-check' },
      ],
      footnoteHtml: 'You spend a third of your life asleep. This is what shapes it.',
      image: { src: `${IMG}/hero.webp`, alt: 'A person awake at 3am, phone face-down' },
      resultCard: {
        title: 'Test ID NMC-SL01',
        titleRight: 'KYG Lab',
        icon: 'flask',
        rows: [
          { label: 'Sleeplessness', value: 'Poor', tone: 'poor' },
          { label: 'Sleep Bruxism', value: 'Average', tone: 'avg' },
          { label: 'Sleep Apnea', value: 'Good', tone: 'good' },
        ],
        footNoteHtml: 'Sample report · 28 readings inside',
      },
    },

    // ------------------------------------------------------------- who for ----
    {
      type: 'markerGrid',
      ground: 'ivory',
      anchorId: 'who-its-for',
      head: {
        eyebrow: { label: 'No one is left out', icon: 'users' },
        titleHtml: 'Six reasons people finally <em class="tst-em">test their sleep.</em>',
      },
      groups: [
        {
          variant: 'detail',
          items: [
            {
              icon: 'bed-double',
              accent: 'crimson',
              title: 'You sleep eight hours and wake up tired',
              bodyHtml: 'Duration is one reading. Fragmentation, apnea and bruxism are four more.',
            },
            {
              icon: 'caffeine',
              accent: 'crimson',
              title: 'You are not sure if coffee is the problem',
              bodyHtml: 'ADORA2A tells you how sensitive you actually are to caffeine at night.',
            },
            {
              icon: 'air',
              accent: 'crimson',
              title: 'Someone has told you that you snore',
              bodyHtml: 'Seven genes are read for obstructive sleep apnea, plus your airway panel.',
            },
            {
              icon: 'footprints',
              accent: 'crimson',
              title: 'Your legs will not settle at night',
              bodyHtml: 'Restless legs is read through seven markers, and iron deficiency is linked to it.',
            },
            {
              icon: 'plane',
              accent: 'crimson',
              title: 'You work shifts or fly often',
              bodyHtml: 'CLOCK sits behind delayed sleep phase. Knowing yours changes how you plan recovery.',
            },
            {
              icon: 'pill',
              accent: 'crimson',
              title: 'You are considering sleep medication',
              bodyHtml: 'The panel includes a pharmacogenomic reading on how you metabolise modafinil.',
            },
          ],
        },
      ],
    },

    // --------------------------------------------------------- aspiration ----
    {
      type: 'aspiration',
      ground: 'cream',
      head: {
        eyebrow: { label: 'Why test', icon: 'scale' },
        titleHtml: '35% of adults sleep under seven hours. <em class="tst-em-teal">Almost none know why.</em>',
        leadHtml:
          'One in three people deal with a sleep disorder. Sleep advice is written for everyone, which means it is written for nobody. Your genes narrow it down.',
      },
      image: { src: `${IMG}/why.png`, alt: 'A bedroom at 3am, ceiling lit by a phone' },
      badgeTop: { label: 'Same advice for everyone', icon: 'clock' },
      badgeBottom: { label: '28 answers for you', icon: 'dna' },
      rows: [
        {
          icon: 'caffeine',
          title: 'Cut out coffee after 4pm',
          subtitle: 'Useful only if you are caffeine sensitive. Some people are not.',
        },
        {
          icon: 'bed',
          title: 'Just get eight hours',
          subtitle: "Doesn't help if the problem is fragmentation, apnea or grinding.",
        },
        {
          icon: 'pill',
          title: 'Try a supplement',
          subtitle: 'Which one? Magnesium, iron, Vitamin D and Vitamin E all affect sleep differently.',
        },
      ],
      bodyHtml:
        'Sleep advice is generic because nobody has read your side of it. This panel reads twenty-eight, including the eight nutrients that low sleep is repeatedly linked to.',
      quoteHtml:
        '<em class="tst-em">Monozygotic twins have almost identical sleep cycles, REM patterns and time to fall asleep.</em> <b class="tst-strong">Sleep is more inherited than most people assume.</b>',
    },

    // ------------------------------------------------------------ then/now ----
    {
      type: 'thenNow',
      ground: 'cream',
      then: {
        icon: 'eye-off',
        kicker: 'Without the test',
        title: 'You try everything, in order',
        items: [
          'New mattress. Blackout curtains. No screens. Still awake at 2am.',
          'You give up coffee for a month and nothing changes.',
          'You take a supplement because a friend said it worked for them.',
        ],
        footerHtml: 'Years of guessing, one variable at a time.',
      },
      now: {
        icon: 'eye',
        kicker: 'With the test',
        title: 'You start with the right variable',
        items: [
          'You know whether caffeine is actually your problem, or a red herring.',
          '<b>You know which of the eight nutrients to check first.</b>',
          'You know whether to raise apnea, restless legs or grinding with a doctor.',
        ],
        footerHtml: 'One saliva test. At home. This week.',
      },
      closingHtml: 'You have been treating the symptom. This reads the cause.',
      cta: { label: 'Check My Sleep', href: '#kit' },
    },

    // ----------------------------------------------------------- body map ----
    {
      type: 'bodyMap',
      ground: 'sage',
      head: {
        eyebrow: { label: 'Where sleep is decided', icon: 'target' },
        titleHtml: 'Four places your night <em class="tst-em-teal">is actually settled.</em>',
        leadHtml: 'Tap any part of the body to see what we read there.',
      },
      image: { src: `${IMG}/bodymap-figure.png`, alt: 'Anatomical figure marking the four sleep sites' },
      hotspots: [
        {
          key: 'brain',
          label: 'Brain & body clock',
          caption: 'Insomnia · Duration · Bruxism · Caffeine',
          tipTitle: 'Brain and body clock',
          tipBody:
            'CLOCK sets your circadian rhythm and is linked to delayed sleep phase disorder. DEC2 governs short sleep. FABP7 affects how often you surface during the night. ADORA2A decides how much caffeine costs you. DRD3 sits behind teeth grinding, COMT behind how you metabolise modafinil.',
          x: 50,
          y: 10.7,
          side: 'left',
          geom: {
            box: [26, 30, 340, 44],
            dot: [358, 65],
            line: [202, 51, 346, 63],
            text: { side: 'left', x: 191, y: 32 },
            ring: '#3d3a6e',
            core: '#3d3a6e',
          },
        },
        {
          key: 'airway',
          label: 'Airway & lungs',
          caption: 'Sleep apnea · Airway disease',
          tipTitle: 'Airway and lungs',
          tipBody:
            'Obstructive sleep apnea is read through TNF, CYBA, HTR2A, APOE, CRP, LEPR and IL-6. Chronic obstructive airway disease adds seventeen more markers including CHRNA3, ADRB2, IL13 and IREB2, because breathing trouble and sleep trouble compound each other.',
          x: 52.7,
          y: 27.1,
          side: 'right',
          geom: {
            box: [362, 118, 358, 60],
            dot: [379, 153],
            line: [525, 140, 392, 151],
            text: { side: 'right', x: 536, y: 120 },
            ring: '#15605d',
            core: '#15605d',
          },
        },
        {
          key: 'gut',
          label: 'Gut & nutrients',
          caption: '8 vitamins · Lactose · Gluten · Alcohol',
          tipTitle: 'Gut and nutrients',
          tipBody:
            'Eight micronutrients that low sleep is repeatedly linked to: B6, B9, B12, C, D and calcium, E, magnesium and iron. Plus lactose and gluten tolerance, because bloating at night is a sleep problem, and alcohol metabolism through ALDH2.',
          x: 48,
          y: 45.4,
          side: 'left',
          geom: {
            box: [26, 239, 340, 44],
            dot: [342, 251],
            line: [202, 262, 329, 253],
            text: { side: 'left', x: 191, y: 241 },
            ring: '#25b5ab',
            core: '#0e7c77',
          },
        },
        {
          key: 'legs',
          label: 'Legs & nerves',
          caption: 'Restless legs · Narcolepsy',
          tipTitle: 'Legs and nerves',
          tipBody:
            'Restless legs syndrome is read through PTPRD, MEIS1, BTBD9, GABRA4, TMPRSS6 and two intergenic loci. Narcolepsy adds ten more, mostly in the HLA region. Iron deficiency is directly linked to restless legs, which is why iron is on the same panel.',
          x: 46.3,
          y: 76.4,
          side: 'left',
          geom: {
            box: [26, 408, 340, 44],
            dot: [329, 418],
            line: [202, 431, 315, 420],
            text: { side: 'left', x: 191, y: 410 },
            ring: '#3d3a6e',
            core: '#3d3a6e',
          },
        },
      ],
    },

    // ------------------------------------------------------- the readings ----
    {
      type: 'markerGrid',
      ground: 'cream',
      anchorId: 'the-readings',
      head: {
        eyebrow: { label: 'One kit · eight panels', icon: 'activity' },
        titleHtml: 'Twenty-eight readings, <em class="tst-em-teal">each with its own grade and its own genes.</em>',
        leadHtml:
          'Every reading is graded Good, Average or Poor, with the named genes behind it and a recommendation underneath.',
      },
      groups: [
        {
          kicker: 'Sleep specific',
          variant: 'detail',
          items: [
            {
              icon: 'air',
              title: 'Obstructive Sleep Apnea',
              bodyHtml:
                'Breathing repeatedly stops and starts as throat muscles relax. If you snore loudly and still feel tired after a full night, this is the reading to look at.',
              meta: '7 genes · TNF, CYBA, HTR2A, APOE, CRP, LEPR, IL-6',
              tone: 'good',
              toneLabel: 'Good',
              percent: 22,
              noteHtml: 'Maintain ideal body weight, balanced diet, regular exercise.',
            },
            {
              icon: 'moon',
              accent: 'crimson',
              title: 'Sleeplessness',
              bodyHtml:
                'CLOCK regulates your circadian rhythm and is associated with delayed sleep phase disorder. A poor grade here is the difference between bad habits and bad timing.',
              meta: 'Gene read · CLOCK',
              tone: 'poor',
              toneLabel: 'Poor',
              percent: 85,
              noteHtml: 'Sleep and wake at the same time daily to rebalance your circadian rhythm.',
            },
            {
              icon: 'caffeine',
              title: 'Caffeine-Related Insomnia',
              bodyHtml:
                "How sensitive you are to caffeine's effect on sleep. A good grade means an evening coffee is genuinely fine for you. Not everyone gets that.",
              meta: 'Genes read · ADORA2A, ADORA2A-AS1',
              tone: 'good',
              toneLabel: 'Good',
              percent: 22,
              noteHtml: 'You may have coffee, tea or cocoa in the evening.',
            },
            {
              icon: 'clock',
              title: 'Duration of Sleep',
              bodyHtml:
                'How much sleep your body is built to need. Short sleep duration is linked in population studies to cerebrovascular, mental and metabolic disorders.',
              meta: 'Read · PATJ + intergenic ACTG1P22, AC073875.1',
              tone: 'good',
              toneLabel: 'Good',
              percent: 22,
              noteHtml: 'Regular exercise can improve sleep quality.',
            },
            {
              icon: 'timer',
              title: 'Short Sleep Syndrome',
              bodyHtml:
                "Some people function normally on under six hours. Most cannot. DEC2 tells you which one you are, so you stop copying someone else's schedule.",
              meta: 'Gene read · DEC2 (BHLHE41)',
              tone: 'good',
              toneLabel: 'Good',
              percent: 22,
              noteHtml: 'Take a full 7 to 8 hours of sleep daily.',
            },
            {
              icon: 'lamp',
              title: 'Sleep/Wake Fragmentation',
              bodyHtml:
                'Repeated short interruptions through the night. You fall asleep quickly, wake several times, and feel it the next day. Often a symptom of apnea or narcolepsy.',
              meta: 'Gene read · FABP7',
              tone: 'good',
              toneLabel: 'Good',
              percent: 22,
              noteHtml: 'Take adequate 7 to 8 hours of sound sleep daily.',
            },
            {
              icon: 'bone',
              title: 'Sleep Bruxism',
              bodyHtml:
                'Grinding or clenching teeth during sleep, classified as a movement disorder. Most people find out from a dentist, years after the enamel has gone.',
              meta: 'Gene read · DRD3',
              tone: 'avg',
              toneLabel: 'Average',
              percent: 55,
              noteHtml: 'Reduce stress, avoid nicotine and alcohol before bed, schedule dental exams.',
            },
            {
              icon: 'pill',
              accent: 'crimson',
              title: 'Modafinil Response (PGx)',
              bodyHtml:
                'A pharmacogenomic reading. Modafinil is prescribed for excessive sleepiness from apnea, narcolepsy or shift work. COMT tells you how you metabolise it before you take it.',
              meta: 'Gene read · COMT',
              tone: 'poor',
              toneLabel: 'Poor',
              percent: 85,
              noteHtml: 'Consult your practitioner about alternative medication or therapy.',
            },
          ],
        },
        {
          kicker: 'Nerves & airway',
          variant: 'detail',
          items: [
            {
              icon: 'footprints',
              title: 'Restless Legs Syndrome',
              bodyHtml:
                'An uncontrollable urge to move your legs, usually in the evening when you sit or lie down. Iron deficiency is directly linked to it, which is why iron is on this panel too.',
              meta: '7 markers · PTPRD, MEIS1, BTBD9, GABRA4, TMPRSS6 + 2 loci',
              tone: 'good',
              toneLabel: 'Good',
              percent: 22,
              noteHtml: 'Balanced diet, regular exercise, meditation to stay stress free.',
            },
            {
              icon: 'brain',
              title: 'Narcolepsy',
              bodyHtml:
                'Overwhelming daytime drowsiness and sudden sleep attacks, sometimes with cataplexy, hallucinations or sleep paralysis. Read across ten markers, mostly in the HLA region.',
              meta: '10 markers · UBXN2B, HLA-DQA1, HLA-DRB1, TRA, PPAN, P2RY11 + more',
              tone: 'avg',
              toneLabel: 'Average',
              percent: 55,
              noteHtml:
                'Fixed sleep and wake times, no caffeine or alcohol before bed, no strenuous exercise within three hours.',
            },
            {
              icon: 'stethoscope',
              title: 'Chronic Obstructive Airway Disease',
              bodyHtml:
                'Obstructed airflow from the lungs, most often from long-term smoke exposure. It compounds any sleep disorder you already have, which is why it sits on this panel.',
              meta: '17 markers · CHRNA3, ADRB2, IL13, FAM13A, EGLN2, IREB2 + more',
              tone: 'avg',
              toneLabel: 'Average',
              percent: 55,
              noteHtml: 'Quit smoking, keep your house dust free, avoid air pollution and exhaust fumes.',
            },
          ],
        },
        {
          kicker: 'Micronutrients',
          variant: 'detail',
          items: [
            {
              icon: 'shield',
              accent: 'crimson',
              title: 'Vitamin E',
              bodyHtml:
                'Low plasma Vitamin E is associated with poorer nighttime breathing and sleep quality. A poor grade here is one of the most directly actionable results on the panel.',
              meta: 'Gene read · BUD13',
              tone: 'poor',
              toneLabel: 'Poor',
              percent: 85,
              noteHtml: 'Almonds, sunflower seeds, wheatgerm oil. Avoid a very low-fat diet.',
            },
            {
              icon: 'sun',
              title: 'Vitamin D & Calcium',
              bodyHtml:
                'Sleep of seven hours or less is repeatedly linked to low Vitamin D, calcium, magnesium and niacin. Two genes are read here, VDR and GC.',
              meta: 'Genes read · VDR, GC',
              tone: 'avg',
              toneLabel: 'Average',
              percent: 55,
              noteHtml: '10 to 20 minutes of midmorning sun without sunscreen. Keep a check on your levels.',
            },
            {
              icon: 'droplet',
              title: 'Iron',
              bodyHtml:
                'Iron deficiency has been directly linked to restless legs syndrome. TMPRSS6 appears twice on this panel, once for iron and once for RLS, because they are the same story.',
              meta: 'Gene read · TMPRSS6',
              tone: 'avg',
              toneLabel: 'Average',
              percent: 55,
              noteHtml: 'Iron-rich foods with Vitamin C for absorption. Avoid tea and coffee with meals.',
            },
            {
              icon: 'nut',
              title: 'Magnesium',
              bodyHtml:
                "Low magnesium triggers insomnia, restless sleep and frequent waking. A good grade means you can stop buying magnesium supplements on someone else's advice.",
              meta: 'Genes read · MECOM, BRWD1P2',
              tone: 'good',
              toneLabel: 'Good',
              percent: 22,
              noteHtml: 'Pumpkin seeds, almonds, cashews, spinach, dark chocolate, avocado.',
            },
            {
              icon: 'leaf',
              title: 'Vitamin B9 (Folate)',
              bodyHtml:
                'MTHFR activity determines homocysteine levels in your blood, and with it your immune response. Also on the panel: B6, B12 and Vitamin C, each with its own grade.',
              meta: 'Gene read · MTHFR',
              tone: 'avg',
              toneLabel: 'Average',
              percent: 55,
              noteHtml: 'Spinach, fenugreek, mustard greens, broccoli, kale. Monitor homocysteine.',
            },
          ],
        },
        {
          kicker: 'Food & alcohol',
          variant: 'detail',
          items: [
            {
              icon: 'dairy',
              title: 'Lactose Intolerance',
              bodyHtml:
                'Insufficient lactase means bloating and gas, and bloating at night is a sleep problem. MCM6 carries the stop signal that reduces lactase production after infancy.',
              meta: 'Genes read · LCT, MCM6',
              tone: 'avg',
              toneLabel: 'Average',
              percent: 55,
              noteHtml: 'Almond, soya, coconut or lactose-free milk. Prefer a curd-based diet.',
            },
            {
              icon: 'bread',
              title: 'Gluten Intolerance',
              bodyHtml:
                'Gluten reaction can swell neck and throat tissue and narrow the airway, both major contributors to sleep apnea. Reflux and heartburn are common alongside.',
              meta: 'Read · HLA-DQ 2.2, HLA-DQ 2.5',
              tone: 'avg',
              toneLabel: 'Average',
              percent: 55,
              noteHtml: 'Rice, maize, legumes, and millets like bajra, ragi and jowar.',
            },
            {
              icon: 'alcohol',
              title: 'Alcohol Sensitivity',
              bodyHtml:
                'ALDH2 is the second enzyme in alcohol metabolism. Roughly half of East Asians lack the active mitochondrial form, which is why flushing and poor sleep follow a drink.',
              meta: 'Gene read · ALDH2',
              tone: 'good',
              toneLabel: 'Good',
              percent: 22,
              noteHtml: 'Normal metabolism, but keep quantity limited.',
            },
          ],
        },
        {
          kicker: 'Weight & lipids',
          variant: 'detail',
          items: [
            {
              icon: 'scale',
              accent: 'crimson',
              title: 'Fat Storage',
              bodyHtml:
                'PPARG converts excess food into stored fat. Fat around the airway and at the base of the tongue is the single most recognised route from weight gain to sleep apnea.',
              meta: 'Gene read · PPARG',
              tone: 'poor',
              toneLabel: 'Poor',
              percent: 85,
              noteHtml: 'Fibre-rich foods, avoid refined flour and sugary drinks, monitor HbA1c.',
            },
            {
              icon: 'flask',
              title: 'Adiponectin Levels',
              bodyHtml:
                'Decreased adiponectin correlates with increased severity in sleep apnea patients. Alongside it, obesity predisposition and satiety are both read through FTO.',
              meta: 'Gene read · ADIPOQ',
              tone: 'avg',
              toneLabel: 'Average',
              percent: 55,
              noteHtml: 'Maintain ideal BMI, fibre-rich diet, regular exercise.',
            },
            {
              icon: 'heart',
              title: 'HDL Cholesterol',
              bodyHtml:
                'Both too much and too little sleep affect lipid levels. Under five hours a night raises the risk of high triglycerides and low HDL. LDL is read separately through APOE and APOA5.',
              meta: 'Genes read · CETP, LIPC',
              tone: 'avg',
              toneLabel: 'Average',
              percent: 55,
              noteHtml: 'Fibre-rich foods and Omega-3 sources. Regular exercise.',
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
        eyebrow: { label: 'The numbers most people never check', icon: 'chart', accent: 'teal' },
        titleHtml: 'Bad sleep is not rare. It is the default.',
      },
      stats: [
        {
          kicker: 'Short nights',
          value: '35.3%',
          tone: 'java2',
          barPercent: 35,
          leadHtml: 'of adults report under 7 hours in a typical 24-hour period',
          bodyHtml: 'The National Sleep Foundation advises 7 to 9 hours for adults, and 8 to 10 for teenagers.',
        },
        {
          kicker: 'Sleep disorders',
          value: '1 in 3',
          tone: 'java',
          barPercent: 33,
          leadHtml: 'people deal with a sleep disorder',
          bodyHtml:
            'Most result from complex interactions between genes and environment. Only one half of that has ever been measured.',
        },
        {
          kicker: 'Poor sleep quality',
          value: '65%',
          tone: 'ice',
          barPercent: 65,
          leadHtml: 'of adults over 19 experience poor quality sleep',
          bodyHtml:
            'Seven hours or less is linked to low Vitamin D, calcium, magnesium and niacin. This panel reads all of those.',
        },
      ],
      closingHtml: 'You are not bad at sleeping. Nobody has read your side of it.',
      cta: { label: 'Check My Sleep', href: '#kit', variant: 'light' },
    },

    // -------------------------------------------------- 30-second version ----
    {
      type: 'markerGrid',
      ground: 'ivory',
      anchorId: 'how-genes-work',
      head: {
        eyebrow: { label: 'The 30-second version', icon: 'microscope', accent: 'teal' },
        titleHtml: 'How your genes shape your sleep, <em class="tst-em-teal">in three steps.</em>',
      },
      groups: [
        {
          variant: 'stat',
          items: [
            {
              statHtml: '1',
              title: 'Your body runs a clock',
              bodyHtml:
                'CLOCK and its partners switch other genes on and off across a 24-hour cycle. That cycle decides when you get sleepy, not your willpower.',
            },
            {
              statHtml: '2',
              title: 'Variants move the clock, and the airway',
              bodyHtml:
                'Some variants shift your timing. Others affect your airway, your legs, your jaw, or how much caffeine costs you. Identical twins share nearly identical sleep cycles, which is how we know.',
            },
            {
              statHtml: '3',
              title: 'We read yours, twenty-eight times',
              bodyHtml:
                "One saliva sample, eight panels, twenty-eight grades. Not a diagnosis, but the first sleep advice written for your body instead of everyone's.",
            },
          ],
        },
      ],
    },

    // ----------------------------------------------------- report preview ----
    {
      type: 'reportPreview',
      ground: 'sage',
      head: {
        eyebrow: { label: 'See a sample report', icon: 'file' },
        titleHtml: 'A report you can <em class="tst-em-teal">actually understand.</em>',
        leadHtml: 'No gene codes without explanation. No jargon. Just clear grades and clear next steps.',
      },
      bullets: [
        'All 28 readings, grouped into eight panel summaries.',
        'A simple Good, Average or Poor grade for each.',
        'Your genotype and the gene behind every grade.',
        'A specific recommendation per reading, down to named foods.',
        'Yours to keep for life. Genes don&rsquo;t change, so you test once.',
      ],
      cta: { label: 'Unlock My Report', href: '#kit' },
      sample: {
        badge: 'Confidential',
        title: 'Sleep · Sample summary',
        rows: [
          { label: 'Obstructive Sleep Apnea', value: 'Good', tone: 'good' },
          { label: 'Sleeplessness', value: 'Poor', tone: 'poor' },
          { label: 'Sleep Bruxism', value: 'Average', tone: 'avg' },
          { label: 'Vitamin E', value: 'Poor', tone: 'poor' },
          { label: 'Magnesium', value: 'Good', tone: 'good' },
        ],
        legendHtml:
          '+ 23 more readings · <b>Good</b> = normal or low risk · <b>Average</b> = medium risk · <b>Poor</b> = high risk',
      },
    },

    // -------------------------------------------------------------- steps ----
    {
      type: 'steps',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'How it works', icon: 'box' },
        titleHtml: 'Five steps, from kit to report. <em class="tst-em-teal">Three weeks, start to finish.</em>',
        leadHtml: 'No clinic. No needle. No sleep lab. About five minutes of your time.',
      },
      steps: [
        { icon: 'box', title: 'Order', bodyHtml: 'Kit reaches your door in 2 to 3 days with everything inside.' },
        { icon: 'droplet', title: 'Collect', bodyHtml: 'Spit into the tube at home. Five minutes, no fasting.' },
        { icon: 'truck', title: 'Return', bodyHtml: 'Pre-paid envelope. Courier pickup, trackable in-app.' },
        { icon: 'microscope', title: 'Lab', bodyHtml: 'Illumina Infinium array. A scientist reviews every result.' },
        {
          icon: 'file',
          title: 'Report',
          bodyHtml: 'Ready in 3 weeks, delivered to your KYG account.',
          accent: 'crimson',
        },
      ],
      cta: { label: 'Order My Kit', href: '#kit' },
      ctaNoteHtml: 'Ships in 2 to 3 days · <b>Expert guidance available after</b>',
    },

    // --------------------------------------------------------- counsellor ----
    {
      type: 'counsellor',
      ground: 'cream',
      head: {
        eyebrow: { label: 'Guidance from an expert, not Google', icon: 'users', accent: 'teal' },
        titleHtml: 'Every report is checked by a Ph.D scientist <em class="tst-em-teal">before it reaches you.</em>',
        leadHtml:
          'Twenty-eight grades is a lot to read alone. Book a session with Dr. Varun Sharma, Ph.D, our Human Genetics scientist, and go through yours in plain language.',
      },
      image: { src: `${IMG}/counsellor.webp`, alt: 'A KYG genetics expert reviewing a sleep report' },
      points: [
        '<b>Where to start:</b> which of your grades to act on first, and which to ignore.',
        '<b>Nutrients:</b> which of the eight to test in blood before you buy any supplement.',
        '<b>When to escalate:</b> whether apnea, restless legs or narcolepsy warrants a sleep physician.',
        '<b>Medication:</b> what your modafinil reading means, before anyone prescribes it.',
      ],
      floatCard: {
        icon: 'users',
        title: 'Expert guidance',
        subtitle: 'Genetic counselling, on call',
        noteHtml: 'Available with every report',
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
        kicker: 'Sleep Genetic Kit',
        title: 'Everything in one box',
        items: [
          'All 28 readings across 8 panels',
          'At-home saliva kit, delivered &amp; picked up free',
          'Easy-to-read report in 3 weeks',
          'Option to consult Dr. Varun Sharma, Ph.D, about your results',
          'NABL-accredited processing · data destroyed after',
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
          'Certified NABL lab. Your genetic data is never sold or shared, and your sample is destroyed after processing.',
      },
    },

    // -------------------------------------------------------------- trust ----
    {
      type: 'trust',
      ground: 'sand',
      head: {
        eyebrow: { label: 'Tested in a certified lab', icon: 'badge-check', accent: 'teal' },
        titleHtml: 'Every result verified. <em class="tst-em-teal">Every report checked by a scientist.</em>',
      },
      badges: [
        { line1: 'NABL', line2: 'ISO 15189' },
        { icon: 'award', line1: 'ISO 9001:2015' },
        { line1: 'ISO', line2: '27001:2013' },
        { icon: 'flask', line1: 'Illumina Infinium' },
        { line1: 'HIPAA', line2: '+ FDA' },
        { icon: 'badge-check', line1: 'ACMG · CPIC' },
      ],
      tiles: [
        {
          statHtml: '99%+',
          title: 'Reproducibility on repeat testing',
          bodyHtml: 'With call rates above 98%, validated in-house.',
        },
        {
          icon: 'badge-check',
          title: 'Manually reviewed before release',
          bodyHtml: 'Every report is checked by Dr. Varun Sharma, Ph.D, Scientist in Human Genetics.',
        },
        {
          icon: 'lock',
          accent: 'crimson',
          title: 'Your data, protected',
          bodyHtml: 'Never sold or shared. Your sample is destroyed after testing.',
        },
      ],
      noteHtml: 'Tested at Neotech Worldlab Pvt. Ltd, MG Road, Gurugram.',
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
          q: 'Can this diagnose sleep apnea instead of a sleep study?',
          a: 'No. This reads genetic predisposition, not what is happening in your airway tonight. A polysomnography study measures the event; this tells you whether to book one. The two answer different questions, and a high grade here is a good reason to have the study done.',
        },
        {
          q: 'Why are vitamins and cholesterol on a sleep test?',
          a: 'Because sleep runs on them. Seven hours or less is repeatedly linked to low Vitamin D, calcium, magnesium and niacin. Iron deficiency is directly linked to restless legs, low Vitamin E affects nighttime breathing, and under five hours a night raises the risk of high triglycerides and low HDL. Sleep and lipids move together.',
        },
        {
          q: 'I sleep fine. Is there any point?',
          a: 'Bruxism and apnea both run for years without you noticing - a partner or a dentist usually finds them first. The pharmacogenomic reading matters before you are ever prescribed anything, not after. And a Good grade is a result too: it tells you to stop chasing a problem you do not have.',
        },
        {
          q: 'What is the modafinil reading and why does it matter?',
          a: 'Modafinil is an approved medication for excessive sleepiness from apnea, narcolepsy or shift work. COMT determines how you metabolise it, and a poor metaboliser may see side effects rather than benefit. Knowing this before a prescription, rather than after, is the whole point of pharmacogenomics.',
        },
        {
          q: 'Do I have to visit a clinic or give blood?',
          a: 'No clinic, no needle, no sleep lab, no fasting. The kit comes to your home, you give a saliva sample in about five minutes, and a courier picks it up in a pre-paid envelope.',
        },
        {
          q: 'Will my genetic data be safe and private?',
          a: 'Your data is never sold or shared with anyone. Handling follows ISO 27001, HIPAA and FDA privacy standards, data is stored on encrypted servers, and your sample is destroyed after testing.',
        },
        {
          q: 'Do I need to test again later?',
          a: 'No. Your genes never change, so the grades hold for life - you test once and keep the report. Your blood nutrient levels do change, which is why the report tells you which ones to keep checking.',
        },
      ],
    },

    // ---------------------------------------------------------- final cta ----
    {
      type: 'finalCta',
      ground: 'ink',
      eyebrow: { label: 'Know now, not later', icon: 'zap', accent: 'teal' },
      titleHtml: 'Twenty-eight answers, <em class="tst-em-teal">from one saliva sample.</em>',
      chips: [{ label: '28 readings, 1 saliva kit' }, { label: 'Results in 3 weeks' }, { label: 'Expert guidance' }],
      cta: { label: 'Start My Report', href: '#kit' },
      noteHtml: 'At-home saliva kit · NABL-accredited lab · Results in 3 weeks · Expert guidance available',
    },

    // --------------------------------------------------------- disclaimer ----
    {
      type: 'disclaimer',
      bodyHtml:
        'This is general educational information, not medical advice. Genetic interpretation is probabilistic and is not predictive of any specific future disease. Talk to a doctor or genetic counsellor about your own case.',
    },
  ],
};
