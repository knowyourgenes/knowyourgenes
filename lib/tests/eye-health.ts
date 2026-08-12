// =============================================================================
// lib/tests/eye-health.ts - Eye Health test-detail page
// -----------------------------------------------------------------------------
// Built on the same section-array layout as `womensHealth` (lib/testsdata.ts),
// from the approved copy deck in health/eye-health.html. That deck runs:
//
//   hero · reactive-vs-preventive · the 7 findings · the numbers · report ·
//   how it works · Second Opinion · order kit · accreditation · FAQ · final
//
// which maps 1:1 onto hero / aspiration + thenNow / riskCards / stats /
// reportPreview / steps / counsellor / kit / trust / faqs / finalCta. The deck's
// own header and footer are the global site chrome and are NOT repeated here -
// see the note in app/categories/[category_slug]/[test_slug]/page.tsx.
//
// In-page CTA targets are the ids the components render: `#kit` (Kit) and
// `#what-we-check` (RiskCards). The deck's `#final` has no counterpart, because
// FinalCta is not an anchor target.
//
// Photography is placeholder tint at these paths - drop the finished art in at
// the same names and nothing else changes.
// =============================================================================

import type { TestPage } from '@/features/tests/types';

const IMG = '/tests/eye-health';

export const eyeHealth: TestPage = {
  slug: 'eye-health',
  categorySlug: 'wellness',

  seo: {
    title: 'Eye Health DNA Test — 7 findings from one saliva sample',
    description:
      'Glaucoma, diabetic retinopathy, cataract, myopia, eye pressure, macular degeneration and retinal occlusion — seven genetic findings from a single at-home saliva kit. NABL-accredited lab, results in 3 weeks.',
  },

  sections: [
    // --------------------------------------------------------------- hero ----
    {
      type: 'hero',
      eyebrow: { label: 'Genetic Testing · Not A Vision Test', icon: 'eye' },
      titleHtml: 'What your eyes can\'t show you is <em class="tst-em">already written in your genes.</em>',
      kickerHtml: '7 conditions. 1 saliva sample.',
      subHtml: 'Seven findings in 3 weeks. Early enough to act.',
      ctas: [
        { label: 'Take The Real Eye Test', href: '#kit' },
        { label: 'See The 7 Findings', href: '#what-we-check', variant: 'ghost', icon: 'arrow-down' },
      ],
      chips: [
        { label: 'No needles', icon: 'droplet' },
        { label: 'NABL lab', icon: 'badge-check' },
        { label: 'Results in 3 weeks', icon: 'clock' },
      ],
      footnoteHtml: 'An eye chart tests what you can see. This tests what&rsquo;s coming.',
      image: { src: `${IMG}/hero-eye.png`, alt: 'A close-up of an eye, calm and clear' },
      resultCard: {
        title: 'Your findings',
        icon: 'flask',
        rows: [
          { label: 'Glaucoma', value: '20/20 · Good', tone: 'good' },
          { label: 'Diabetic Retinopathy', value: '20/200 · Poor', tone: 'poor' },
          { label: 'Cataract', value: '20/70 · Avg', tone: 'avg' },
          { label: 'Macular Degen.', value: '20/25 · Good', tone: 'good' },
          { label: 'Ocular Hypertension', value: '20/200 · Poor', tone: 'poor' },
        ],
      },
    },

    // --------------------------------------------------------- aspiration ----
    // The deck's "reactive vs preventive" editorial block: image with two
    // floating badges, three icon rows, a paragraph and a tinted pull quote.
    {
      type: 'aspiration',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'Reactive vs Preventive', icon: 'scale' },
        titleHtml:
          'Your optometrist asks &ldquo;red or green&rdquo; every visit. <em class="tst-em-teal">We&rsquo;re asking a bigger version of it.</em>',
      },
      image: { src: `${IMG}/why-reactive.png`, alt: 'An eye chart and a lens phoropter side by side' },
      badgeTop: { label: 'See it coming', icon: 'eye' },
      badgeBottom: { label: 'Focus, years early', icon: 'zap' },
      rows: [
        { icon: 'frown', title: 'The headaches', subtitle: 'you blame on screens.' },
        { icon: 'glasses', title: 'The floaters', subtitle: 'you have learned to ignore.' },
        { icon: 'chart', title: 'The prescription', subtitle: 'that keeps getting stronger.' },
      ],
      bodyHtml:
        'So many people wait for one of these before ever taking the test. By the time something feels wrong, glaucoma or macular degeneration may already have been progressing for years, with no symptoms at all.',
      quoteHtml:
        '<em class="tst-em">Doctors compare two lenses to sharpen your prescription: which is clearer, this or that?</em> <b class="tst-strong">This test asks a bigger version of that same question, years before a chart ever could.</b>',
    },

    // ------------------------------------------------------------ then/now ----
    {
      type: 'thenNow',
      ground: 'ivory',
      then: {
        icon: 'eye-off',
        kicker: 'Reactive',
        title: 'You wait for the blur',
        items: [
          'You wait for headaches, floaters or a stronger prescription.',
          'By the time something feels wrong, damage may be years in.',
          'Glaucoma and macular degeneration progress with no symptoms at all.',
        ],
      },
      now: {
        icon: 'eye',
        kicker: 'Preventive',
        title: 'You bring it into focus',
        items: [
          'You test your genes once and know which of the 7 conditions you are more likely to face.',
          '<b>You and your eye doctor build a watch list, years before a chart.</b>',
          'No clinic. No needles. Only preventive care.',
        ],
      },
      closingHtml:
        'Reactive or preventive: it is your choice either way. Most people just don&rsquo;t realise they are already making it.',
      cta: { label: 'Book My Eye Test', href: '#kit' },
    },

    // --------------------------------------------------------- risk cards ----
    {
      type: 'riskCards',
      ground: 'cream',
      head: {
        eyebrow: { label: 'The 7 eye conditions', icon: 'activity' },
        titleHtml: 'Seven conditions that stay silent <em class="tst-em-teal">until it is too late.</em>',
        leadHtml: 'Each one gets an acuity-style reading: Good, Average or Poor.',
      },
      allLabel: 'All seven',
      cards: [
        {
          key: 'retinopathy',
          tabLabel: 'Retinopathy',
          icon: 'droplet',
          image: { src: `${IMG}/risk-retinopathy.png`, alt: 'Retinal vessels damaged by high blood sugar' },
          imageCaption: 'Retinal vessels under sugar stress',
          geneLabel: 'Diabetic Retinopathy · VEGFA, ICAM1, EPO',
          question: 'Is my retina at risk from diabetes?',
          bodyHtml:
            'Long-term high blood sugar slowly damages the blood vessels of the retina, often with no symptoms until real vision loss has begun. <b>Three genes show how your retinal vessels hold up.</b>',
          warningHtml: 'No symptoms until real vision loss has begun.',
          sample: { label: 'Sample reading', valueHtml: '20/200 · Poor', tone: 'poor', percent: 85 },
        },
        {
          key: 'glaucoma',
          tabLabel: 'Glaucoma',
          icon: 'eye',
          image: { src: `${IMG}/risk-glaucoma.png`, alt: 'Optic nerve under rising pressure' },
          imageCaption: 'Optic-nerve pressure over time',
          geneLabel: 'Glaucoma · MYOC, LOXL1-AS1',
          question: 'Could pressure be harming my optic nerve?',
          bodyHtml:
            'Rising pressure inside the eye damages the optic nerve so gradually that peripheral vision is often gone before it is ever noticed. <b>MYOC and LOXL1-AS1 flag your inherited risk.</b>',
          warningHtml: 'Peripheral vision can be gone before it is noticed.',
          sample: { label: 'Sample reading', valueHtml: '20/20 · Good', tone: 'good', percent: 24 },
        },
        {
          key: 'cataract',
          tabLabel: 'Cataract',
          icon: 'cataract',
          image: { src: `${IMG}/risk-cataract.png`, alt: "The eye's natural lens slowly clouding" },
          imageCaption: 'The lens slowly clouding',
          geneLabel: 'Cataract · Gene EPHA2',
          question: 'Will the lens in my eye slowly cloud over?',
          bodyHtml:
            'A slow clouding of the eye&rsquo;s natural lens, building over months and years rather than announcing itself all at once. <b>EPHA2 is linked to inherited forms of cataract.</b>',
          warningHtml: 'It builds silently over months and years.',
          sample: { label: 'Sample reading', valueHtml: '20/70 · Average', tone: 'avg', percent: 55 },
        },
        {
          key: 'myopia',
          tabLabel: 'Myopia',
          icon: 'glasses',
          image: { src: `${IMG}/risk-myopia.png`, alt: 'An eye grown slightly too long, blurring distance' },
          imageCaption: 'The eye grows a little too long',
          geneLabel: 'Myopia · Gene TGFB1',
          question: 'Why does my distance vision keep blurring?',
          bodyHtml:
            'Nearsightedness: sharp up close, blurry at a distance. Common, well understood, and among the easiest conditions here to correct early. <b>TGFB1 shapes how your eye grows and focuses light.</b>',
          warningHtml: 'Left unchecked, it can keep worsening for years.',
          sample: { label: 'Sample reading', valueHtml: '20/20 · Good', tone: 'good', percent: 24 },
        },
        {
          key: 'pressure',
          tabLabel: 'Eye Pressure',
          icon: 'pressure',
          image: { src: `${IMG}/risk-pressure.png`, alt: 'Raised pressure inside the eye' },
          imageCaption: 'Pressure with no symptoms',
          geneLabel: 'Ocular Hypertension · Gene PTGFR',
          question: 'Is my eye pressure quietly too high?',
          bodyHtml:
            'Higher-than-normal eye pressure with essentially no symptoms of its own. The single biggest known precursor to glaucoma. <b>PTGFR affects how your eye pressure is regulated.</b>',
          warningHtml: 'The single biggest known precursor to glaucoma.',
          sample: { label: 'Sample reading', valueHtml: '20/200 · Poor', tone: 'poor', percent: 85 },
        },
        {
          key: 'macular',
          tabLabel: 'Macula',
          icon: 'target',
          image: { src: `${IMG}/risk-macular.png`, alt: 'Central vision breaking down at the macula' },
          imageCaption: 'Central vision breaking down',
          geneLabel: 'Macular Degeneration · ARMS2, C2, VEGF',
          question: 'Could I lose my central vision as I age?',
          bodyHtml:
            'A breakdown of central vision, the part used for reading and recognising faces. One of the leading causes of vision loss after 50. <b>ARMS2, C2 and VEGF sit behind the retina.</b>',
          warningHtml: 'A leading cause of vision loss after 50.',
          sample: { label: 'Sample reading', valueHtml: '20/25 · Good', tone: 'good', percent: 24 },
        },
        {
          key: 'occlusion',
          tabLabel: 'Occlusion',
          icon: 'alert',
          image: { src: `${IMG}/risk-occlusion.png`, alt: 'A sudden blockage of blood flow to the retina' },
          imageCaption: 'A stroke at the level of the eye',
          geneLabel: 'Retinal Occlusion · AGTR1, ADIPOQ',
          question: 'Am I at risk of a sudden retinal blockage?',
          bodyHtml:
            'A sudden blockage of blood flow to the retina, effectively a stroke at the level of the eye. It calls for immediate attention when it happens. <b>AGTR1 and ADIPOQ affect vessel and metabolic health.</b>',
          warningHtml: 'It is a medical emergency when it happens.',
          sample: { label: 'Sample reading', valueHtml: '20/70 · Average', tone: 'avg', percent: 55 },
        },
      ],
      cta: { label: 'Take The Real Eye Test', href: '#kit' },
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
          kicker: 'Cataract',
          value: '66%',
          tone: 'java2',
          barPercent: 66,
          bodyHtml: 'of all blindness in India traces back to cataract, and most of it is treatable.',
        },
        {
          kicker: 'Glaucoma',
          value: '90%',
          tone: 'java',
          barPercent: 90,
          bodyHtml: 'of glaucoma cases in India go undiagnosed until the damage is already done.',
        },
        {
          kicker: 'Diabetes',
          value: '1 in 8',
          tone: 'ice',
          barPercent: 15,
          bodyHtml: 'people with diabetes in India already show signs of retinal damage.',
        },
      ],
      closingHtml:
        'All seven conditions can be managed if you catch them early. Most give no warning until damage is done.',
      cta: { label: 'Take The Real Eye Test', href: '#kit', variant: 'light' },
    },

    // ----------------------------------------------------- report preview ----
    {
      type: 'reportPreview',
      ground: 'sage',
      head: {
        eyebrow: { label: 'Your report', icon: 'file' },
        titleHtml: 'Clear findings, <em class="tst-em-teal">in plain language.</em>',
      },
      bullets: [
        'Seven findings, from one test.',
        'Each with an acuity-style reading and a clear grade.',
        'Recommendations to match, so you know what to do next.',
        'Built to be read by you, and handed to your eye doctor.',
      ],
      cta: { label: 'See My Findings', href: '#kit' },
      sample: {
        badge: 'Sample',
        title: 'Eye Health · Findings',
        rows: [
          { label: 'Glaucoma', value: '20/20 · Good', tone: 'good' },
          { label: 'Diabetic Retinopathy', value: '20/200 · Poor', tone: 'poor' },
          { label: 'Cataract', value: '20/70 · Avg', tone: 'avg' },
          { label: 'Macular Degeneration', value: '20/25 · Good', tone: 'good' },
          { label: 'Ocular Hypertension', value: '20/200 · Poor', tone: 'poor' },
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
        titleHtml: 'A finding on its own is just data. <em class="tst-em-teal">We help you make sense of it.</em>',
      },
      image: { src: `${IMG}/counsellor.png`, alt: 'A KYG genetics expert reviewing an eye finding' },
      points: [
        'Every single report is checked by our genetics team before it reaches you.',
        'Want a finding explained? Book a free Second Opinion session with us.',
        'Easy to understand, and easy to hand to your own eye doctor.',
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
        kicker: 'Eye Health Genetic Kit',
        title: '7 Eye Conditions. One Test.',
        items: [
          'All 7 conditions: retinopathy, glaucoma, cataract, myopia, eye pressure, macular &amp; occlusion',
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
          q: 'I have 20/20 vision. Why should I still test?',
          a: 'Most of these conditions give no warning in the early years. Glaucoma and ocular hypertension show no signs at all until real damage is done. Seeing well today is the best time to test, because you can still do something about it.',
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
          q: 'Does a "Poor" finding mean I have the condition?',
          a: 'No. A Poor reading means higher genetic risk, not a diagnosis. Results are probabilistic and should be discussed with an eye care professional.',
        },
        {
          q: 'Can this replace regular visits to my eye doctor?',
          a: 'No. It tells you what to watch for, and it works alongside regular visits to your eye doctor rather than instead of them.',
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
      titleHtml: 'An eye chart tests what you can see. <em class="tst-em-teal">This tests what&rsquo;s coming.</em>',
      chips: [{ label: '7 findings, 1 saliva kit' }, { label: 'Results in 3 weeks' }, { label: 'Expert guidance' }],
      cta: { label: 'Book My Eye Test', href: '#kit' },
      noteHtml: 'At-home saliva kit · NABL certified lab · Results in 3 weeks',
    },

    // --------------------------------------------------------- disclaimer ----
    {
      type: 'disclaimer',
      bodyHtml:
        'This test is intended for general wellness and informational purposes. It is not a diagnostic tool and does not replace a comprehensive evaluation by an eye care professional. Please consult a qualified eye care professional to interpret your results and to guide any decisions about your eye health.',
    },
  ],
};
