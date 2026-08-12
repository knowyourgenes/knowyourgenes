// =============================================================================
// lib/tests/kidney-health.ts - Kidney Health test-detail page
// -----------------------------------------------------------------------------
// Same section order as `eyeHealth` (the two decks are built from one template),
// with the copy from health/kidney-health.html. See lib/tests/eye-health.ts for
// the deck -> section mapping and the CTA-anchor rules.
// =============================================================================

import type { TestPage } from '@/features/tests/types';

const IMG = '/tests/kidney-health';

export const kidneyHealth: TestPage = {
  slug: 'kidney-health',
  categorySlug: 'wellness',

  seo: {
    title: 'Kidney Health DNA Test — 7 findings from one saliva sample',
    description:
      'Uric acid, polycystic kidney disease, magnesium retention, chronic kidney disease, nephrotic syndrome, membranous nephropathy and kidney stones — twelve genetic markers from a single at-home saliva kit.',
  },

  sections: [
    // --------------------------------------------------------------- hero ----
    {
      type: 'hero',
      eyebrow: { label: 'Genetic Testing · Not A Blood Test', icon: 'droplet' },
      titleHtml:
        'You&rsquo;ll never feel your kidneys working. <em class="tst-em">That&rsquo;s exactly the problem.</em>',
      kickerHtml: '7 conditions. 1 saliva sample.',
      subHtml: 'Twelve genetic markers, read in 3 weeks. Early enough to act.',
      ctas: [
        { label: 'Check My Filter', href: '#kit' },
        { label: 'See The 7 Findings', href: '#what-we-check', variant: 'ghost', icon: 'arrow-down' },
      ],
      chips: [
        { label: 'No needles', icon: 'droplet' },
        { label: 'NABL lab', icon: 'badge-check' },
        { label: 'Results in 3 weeks', icon: 'clock' },
      ],
      footnoteHtml: 'Your kidneys have no pain nerves. This test speaks for them.',
      image: { src: `${IMG}/hero-filter.png`, alt: 'Clean water passing through a filter, calm and clear' },
      resultCard: {
        title: 'Your findings',
        icon: 'flask',
        rows: [
          { label: 'Hyperuricemia', value: 'Poor', tone: 'poor' },
          { label: 'Chronic Kidney Disease', value: 'Average', tone: 'avg' },
          { label: 'Polycystic Kidney', value: 'Good', tone: 'good' },
          { label: 'Nephrotic Syndrome', value: 'Average', tone: 'avg' },
          { label: 'Kidney Stones', value: 'Good', tone: 'good' },
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
          'They filter 180 litres of your blood a day. <em class="tst-em-teal">And never once ask for attention.</em>',
      },
      image: { src: `${IMG}/why-reactive.png`, alt: 'Unfiltered water beside filtered water' },
      badgeTop: { label: 'Read the filter', icon: 'flask' },
      badgeBottom: { label: 'Years before symptoms', icon: 'zap' },
      rows: [
        { icon: 'tired', title: 'The tiredness', subtitle: 'you blame on work.' },
        { icon: 'droplet', title: 'The swelling', subtitle: 'you blame on salt.' },
        { icon: 'person', title: 'The back ache', subtitle: 'you blame on posture.' },
      ],
      bodyHtml:
        'So many people wait for one of these before ever testing. Most kidney function can be lost before a single symptom shows up, and by the time you feel it, the filter has usually been struggling for years.',
      quoteHtml:
        '<em class="tst-em">A blood test tells you how the filter is performing today.</em> <b class="tst-strong">This tells you how it was built, and what it is most likely to struggle with, long before any reading moves.</b>',
    },

    // ------------------------------------------------------------ then/now ----
    {
      type: 'thenNow',
      ground: 'ivory',
      then: {
        icon: 'eye-off',
        kicker: 'Unfiltered',
        title: 'You wait to feel it',
        items: [
          'You wait for swelling, fatigue or back pain before thinking about your kidneys at all.',
          'For an organ with no pain nerves, that usually means function is already well below half.',
          'Chronic kidney disease can progress for years with no symptoms at all.',
        ],
      },
      now: {
        icon: 'flask',
        kicker: 'Filtered',
        title: 'You know the reading',
        items: [
          'You test your genes once and know which of the 7 conditions you are more likely to face.',
          '<b>You and your doctor build a watch list, years before any symptom.</b>',
          'No clinic. No needles. Only preventive care.',
        ],
      },
      closingHtml:
        'Reactive or preventive: it is your choice either way. Most people just don&rsquo;t realise they are already making it.',
      cta: { label: 'Check My Filter', href: '#kit' },
    },

    // --------------------------------------------------------- risk cards ----
    {
      type: 'riskCards',
      ground: 'cream',
      head: {
        eyebrow: { label: 'The 7 kidney conditions', icon: 'activity' },
        titleHtml: 'Seven conditions that stay silent <em class="tst-em-teal">until it is too late.</em>',
        leadHtml: 'Twelve genetic markers. Each condition gets a clear reading: Good, Average or Poor.',
      },
      allLabel: 'All seven',
      cards: [
        {
          key: 'urate',
          tabLabel: 'Uric Acid',
          icon: 'flask',
          image: { src: `${IMG}/risk-hyperuricemia.png`, alt: 'Uric acid crystallising in a joint' },
          imageCaption: 'Uric acid crystallising',
          geneLabel: 'Hyperuricemia · Gene ABCG2',
          question: 'Is my body clearing uric acid properly?',
          bodyHtml:
            'Uric acid that isn&rsquo;t cleared efficiently crystallises, showing up as gout or as stones inside the kidney. <b>ABCG2 governs how well your body clears it.</b>',
          warningHtml: 'Watch for: gout, kidney stones.',
          sample: { label: 'Sample reading', valueHtml: 'Poor · High', tone: 'poor', percent: 85 },
        },
        {
          key: 'pkd',
          tabLabel: 'Polycystic',
          icon: 'cyst',
          image: { src: `${IMG}/risk-polycystic.png`, alt: 'Fluid-filled cysts crowding kidney tissue' },
          imageCaption: 'Fluid-filled cysts over time',
          geneLabel: 'Polycystic Kidney Disease · Gene PKHD1',
          question: 'Could cysts be forming in my kidneys?',
          bodyHtml:
            'An inherited tendency toward fluid-filled cysts forming in the kidneys and slowly crowding out working tissue. <b>PKHD1 flags your inherited risk.</b>',
          warningHtml: 'Watch for: side pain, blood in urine, repeat UTIs.',
          sample: { label: 'Sample reading', valueHtml: 'Good · Low', tone: 'good', percent: 20 },
        },
        {
          key: 'magnesium',
          tabLabel: 'Magnesium',
          icon: 'zap',
          image: { src: `${IMG}/risk-magnesium.png`, alt: 'Minerals held in balance, or lost' },
          imageCaption: 'Minerals held, or lost',
          geneLabel: 'Hypomagnesemia · MUC1, ATP2B1, DCDC5, SHROOM3, CNNM4',
          question: 'Are my kidneys holding on to magnesium?',
          bodyHtml:
            'Magnesium keeps muscles, nerves and heart rhythm steady, and your kidneys decide how much of it you keep. <b>Five genes shape how well yours hold on.</b>',
          warningHtml: 'Watch for: cramps, numbness, abnormal heart rhythm.',
          sample: { label: 'Sample reading', valueHtml: 'Good · Low', tone: 'good', percent: 20 },
        },
        {
          key: 'ckd',
          tabLabel: 'Chronic Disease',
          icon: 'heart',
          image: { src: `${IMG}/risk-ckd.png`, alt: 'Filtering capacity slipping over time' },
          imageCaption: 'Filtering capacity, slipping',
          geneLabel: 'Chronic Kidney Disease · NMT2, APOL1',
          question: 'Am I losing filtering capacity quietly?',
          bodyHtml:
            'The gradual loss of filtering capacity, often silent until it is already advanced and much harder to slow. <b>NMT2 and APOL1 shape your inherited risk.</b>',
          warningHtml: 'Watch for: fatigue, nausea, swollen feet, high blood pressure.',
          sample: { label: 'Sample reading', valueHtml: 'Average · Medium', tone: 'avg', percent: 54 },
        },
        {
          key: 'nephrotic',
          tabLabel: 'Nephrotic',
          icon: 'baby',
          image: { src: `${IMG}/risk-nephrotic.png`, alt: 'Protein leaking through damaged filtering units' },
          imageCaption: 'Protein leaking through',
          geneLabel: 'Childhood Nephrotic Syndrome · TNFSF15, HLA-DQA1',
          question: 'Could protein be leaking into my urine?',
          bodyHtml:
            'A tendency toward protein leaking out through damaged filtering units, most commonly seen in children. <b>TNFSF15 and HLA-DQA1 carry the signal.</b>',
          warningHtml: 'Watch for: protein in urine, puffy eyes, swollen ankles.',
          sample: { label: 'Sample reading', valueHtml: 'Average · Medium', tone: 'avg', percent: 54 },
        },
        {
          key: 'membranous',
          tabLabel: 'Membranous',
          icon: 'shield-plus',
          image: { src: `${IMG}/risk-membranous.png`, alt: "The kidney's filtering vessels thickening" },
          imageCaption: 'Filtering vessels thickening',
          geneLabel: 'Membranous Nephropathy · HLA-DQA1, PLA2R1',
          question: 'Could my immune system thicken the filter?',
          bodyHtml:
            'An immune-related thickening of the kidney&rsquo;s tiny filtering vessels, which slowly lets protein escape. <b>HLA-DQA1 and PLA2R1 are the clearest markers.</b>',
          warningHtml: 'Watch for: swollen legs, foamy urine, fatigue.',
          sample: { label: 'Sample reading', valueHtml: 'Good · Low', tone: 'good', percent: 20 },
        },
        {
          key: 'stones',
          tabLabel: 'Stones',
          icon: 'gem',
          image: { src: `${IMG}/risk-stones.png`, alt: 'Minerals hardening into a kidney stone' },
          imageCaption: 'Minerals hardening into stone',
          geneLabel: 'Renal Calculi · CLDN14, CASR',
          question: 'Am I prone to forming kidney stones?',
          bodyHtml:
            'How readily your kidneys turn dissolved minerals into hard deposits, and how much pain that eventually costs. <b>CLDN14 and CASR set the tendency.</b>',
          warningHtml: 'Watch for: blood in urine, severe pain, nausea.',
          sample: { label: 'Sample reading', valueHtml: 'Good · Low', tone: 'good', percent: 20 },
        },
      ],
      cta: { label: 'Check My Filter', href: '#kit' },
      ctaNoteHtml: '7 findings · 1 saliva sample · <b>results in 3 weeks</b>',
    },

    // -------------------------------------------------------------- stats ----
    {
      type: 'stats',
      ground: 'ink',
      head: {
        eyebrow: { label: 'The numbers, nationally', icon: 'chart', accent: 'teal' },
        titleHtml: 'These conditions are common across India.',
        leadHtml: 'Most people only find out once the damage is done.',
      },
      stats: [
        {
          kicker: 'Every single day',
          value: '180 L',
          tone: 'java2',
          barPercent: 90,
          bodyHtml: 'of blood your kidneys filter every single day, without you ever noticing.',
        },
        {
          kicker: 'Chronic kidney disease',
          value: '1 in 6',
          tone: 'java',
          barPercent: 17,
          bodyHtml: 'adults in recent Indian community studies showed signs of chronic kidney disease.',
        },
        {
          kicker: 'Pain nerves',
          value: '0',
          tone: 'ice',
          barPercent: 100,
          bodyHtml: 'pain nerves inside the kidney itself, which is why damage so often goes unfelt.',
        },
      ],
      closingHtml:
        'All seven conditions can be managed if you catch them early. Almost none of them announce themselves.',
      cta: { label: 'Check My Filter', href: '#kit', variant: 'light' },
    },

    // ----------------------------------------------------- report preview ----
    {
      type: 'reportPreview',
      ground: 'sage',
      head: {
        eyebrow: { label: 'Your report', icon: 'file' },
        titleHtml: 'A reading, <em class="tst-em-teal">not a diagnosis.</em>',
      },
      bullets: [
        'Seven findings, from one test.',
        'Your genotype at each marker, and what the science behind that gene says.',
        'Recommendations to match, so you know what to do next.',
        'Built to be read by you, and handed to your own doctor.',
      ],
      cta: { label: 'See My Findings', href: '#kit' },
      sample: {
        badge: 'Sample',
        title: 'Kidney Health · Findings',
        rows: [
          { label: 'Hyperuricemia', value: 'Poor · High', tone: 'poor' },
          { label: 'Chronic Kidney Disease', value: 'Average · Med', tone: 'avg' },
          { label: 'Polycystic Kidney Disease', value: 'Good · Low', tone: 'good' },
          { label: 'Nephrotic Syndrome', value: 'Average · Med', tone: 'avg' },
          { label: 'Renal Calculi', value: 'Good · Low', tone: 'good' },
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
        titleHtml: 'From your door to seven findings, <em class="tst-em-teal">in 5 simple steps.</em>',
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
        titleHtml: 'A genotype on its own is just letters. <em class="tst-em-teal">We help you make sense of it.</em>',
      },
      image: { src: `${IMG}/counsellor.png`, alt: 'A KYG genetics expert reviewing a kidney finding' },
      points: [
        'Every single report is checked by our genetics team before it reaches you.',
        'Want a finding explained? Book a free Second Opinion session with us.',
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
        kicker: 'Kidney Health Genetic Kit',
        title: '7 Conditions. One Panel.',
        items: [
          'All 7 conditions: hyperuricemia, polycystic kidney disease, hypomagnesemia, chronic kidney disease, nephrotic syndrome, membranous nephropathy &amp; renal calculi',
          'At-home saliva kit, delivered &amp; picked up free',
          'Easy-to-read findings in 3 weeks',
          'Every finding reviewed by our genetics team',
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
          q: 'I feel completely fine. Why should I still test?',
          a: 'Kidneys have no pain nerves of their own, so most of these conditions give no warning at all. By the time you feel something, function is usually already well reduced. Feeling fine is exactly the best time to test, because you can still act on what you find.',
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
          a: 'No. A Poor reading means higher genetic risk, not a diagnosis. Results are probabilistic and are best discussed with a doctor.',
        },
        {
          q: 'Can this replace a blood or urine kidney test?',
          a: 'No. It tells you what to watch for genetically, and it works alongside routine blood and urine tests rather than instead of them.',
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
      titleHtml:
        'Your kidneys never ask for attention. <em class="tst-em-teal">This test gives it to them anyway.</em>',
      chips: [{ label: '7 findings, 1 saliva kit' }, { label: 'Results in 3 weeks' }, { label: 'Expert guidance' }],
      cta: { label: 'Check My Filter', href: '#kit' },
      noteHtml: 'At-home saliva kit · NABL certified lab · Results in 3 weeks',
    },

    // --------------------------------------------------------- disclaimer ----
    {
      type: 'disclaimer',
      bodyHtml:
        'This test is intended for general wellness and informational purposes. It is not a diagnostic tool and does not replace blood or urine testing for kidney function. Please consult a qualified medical professional to interpret your results and to guide any decisions about your kidney health.',
    },
  ],
};
