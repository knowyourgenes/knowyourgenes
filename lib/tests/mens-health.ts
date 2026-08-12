// =============================================================================
// lib/tests/mens-health.ts - Men's Wellness test-detail page
// -----------------------------------------------------------------------------
// From health/mens-health.html. This deck is the longest of the four: on top of
// the shared spine it carries a second editorial pair ("star treatment"), a body
// map, an outcome contrast and the full price-value argument. Mapping:
//
//   why test        -> aspiration + thenNow
//   star treatment  -> aspiration + thenNow   (the pair repeats, by design)
//   body map        -> bodyMap
//   the 3 tests     -> riskCards
//   the numbers     -> stats
//   value           -> contrast
//   price value     -> worth + outcomes + testimonial (one frame, three files -
//                      see the note at the top of sections/Outcomes.tsx)
//
// The three hotspots are NOT the Women's Health five, so each carries its own
// `geom`, rebased from the deck's 820x560 overlay onto the 720x492 figure box
// BodyMap draws in. Scale is 0.935 with the anatomy origin at (208,34).
// =============================================================================

import type { TestPage } from '@/features/tests/types';

const IMG = '/tests/mens-health';

export const mensHealth: TestPage = {
  slug: 'mens-health',
  categorySlug: 'wellness',

  seo: {
    title: "Men's Wellness DNA Test — hair, hormones and fertility from one sample",
    description:
      'Hair fall, testosterone and male fertility — three genetic answers from a single at-home saliva kit. NABL-accredited lab, results in 7 days, free Second Opinion session.',
  },

  sections: [
    // --------------------------------------------------------------- hero ----
    {
      type: 'hero',
      eyebrow: { label: "Preventive Genetic Testing · Men's Wellness", icon: 'scan-heart' },
      titleHtml: 'Most men wait for symptoms. <em class="tst-em">You don&rsquo;t have to.</em>',
      kickerHtml: '3 tests. 1 saliva sample.',
      subHtml: 'Hair fall, hormones and fertility in 7 days. While you can still do something about it.',
      ctas: [
        { label: 'Check My Risk', href: '#kit' },
        { label: "See What's Inside", href: '#what-we-check', variant: 'ghost', icon: 'arrow-down' },
      ],
      chips: [
        { label: 'No needles', icon: 'droplet' },
        { label: 'NABL lab', icon: 'badge-check' },
        { label: 'Results in 7 days', icon: 'clock' },
      ],
      footnoteHtml: 'One test costs you an afternoon. Not knowing can cost you years.',
      image: { src: `${IMG}/hero-man.png`, alt: 'A man in his late twenties, healthy and in control' },
      resultCard: {
        title: 'Your results',
        icon: 'flask',
        rows: [
          { label: 'Hormones', value: 'Average', tone: 'avg' },
          { label: 'Hair Fall', value: 'Poor', tone: 'poor' },
          { label: 'Fertility', value: 'Good', tone: 'good' },
        ],
      },
    },

    // ----------------------------------------------- why test · aspiration ----
    {
      type: 'aspiration',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'The mistake most men make', icon: 'scale' },
        titleHtml: 'By the time you notice a problem, <em class="tst-em-teal">it&rsquo;s already hard to fix.</em>',
      },
      image: { src: `${IMG}/why-reactive.png`, alt: 'A man noticing hair in the comb, years too late' },
      badgeTop: { label: 'Catch it early', icon: 'eye' },
      badgeBottom: { label: "While it's still fixable", icon: 'zap' },
      rows: [
        { icon: 'scissors', title: 'The hair fall', subtitle: 'you blame on stress and shampoo.' },
        { icon: 'tired', title: 'The tiredness', subtitle: 'nobody thinks to check hormones for.' },
        { icon: 'stroller', title: 'The year of trying', subtitle: 'before anyone runs a single test.' },
      ],
      bodyHtml:
        'Most men act only after they can see or feel a problem. By then, treatment takes longer, costs more, and works less often. Your genes warn you long before that, and they never change.',
      quoteHtml:
        '<em class="tst-em">You notice hair falling, but the roots have been dying for years.</em> <b class="tst-strong">One saliva test, at home, this week, tells you what your body has been signalling all along.</b>',
    },

    // ------------------------------------------------ why test · then/now ----
    {
      type: 'thenNow',
      ground: 'ivory',
      then: {
        icon: 'eye-off',
        kicker: 'If you wait',
        title: 'You find out the hard way',
        items: [
          'You notice hair falling. The roots have been dying for years.',
          'You feel tired all the time. Nobody thinks to check your hormones.',
          'You try for a baby for a year. Then come the tests, and &#8377;1.5L+ in bills.',
          'By now, treatment takes longer, costs more, and works less often.',
        ],
      },
      now: {
        icon: 'eye',
        kicker: 'If you test now',
        title: 'You find out in time',
        items: [
          'You see your hair fall risk while your hair is still full.',
          'You check your hormones before the tiredness starts.',
          '<b>You know about fertility before you start trying.</b>',
          'You act now, when treatment is quickest, cheapest and works best.',
        ],
      },
      closingHtml: 'You lose money, time, and choices you can&rsquo;t get back. One saliva test. At home. This week.',
      cta: { label: 'Check My Risk', href: '#kit' },
    },

    // ---------------------------------------- star treatment · aspiration ----
    {
      type: 'aspiration',
      ground: 'cream',
      head: {
        eyebrow: { label: 'International players already do this', icon: 'star' },
        titleHtml: 'The best players don&rsquo;t guess. <em class="tst-em-teal">They check their genes.</em>',
      },
      image: { src: `${IMG}/athletes.png`, alt: 'Anonymous athletes training, data-led' },
      badgeTop: { label: 'Always a step ahead', icon: 'award' },
      badgeBottom: { label: 'Same science, now yours', icon: 'zap' },
      rows: [
        { icon: 'trophy', title: 'In 2017', subtitle: "India's international players started genetic testing." },
        { icon: 'dumbbell', title: 'Their trainers', subtitle: 'used the results to plan fitness, food and recovery.' },
        { icon: 'globe', title: 'Cricket, the NBA and the NFL', subtitle: 'all use genetic testing now.' },
      ],
      bodyHtml:
        'Top players don&rsquo;t wait to feel a problem. They look for it before it shows up. Same saliva test, same lab science. You just ask it a different question. <br/><br/><span class="text-[13px]">Reference to international sports genetic-testing adoption is factual and attributed; not an endorsement of KYG.</span>',
      quoteHtml:
        '<em class="tst-em">They check fitness, diet and recovery so they stay at the top of their game.</em> <b class="tst-strong">You check hair, hormones and fertility, so you keep your hair, your energy and your future.</b>',
    },

    // ----------------------------------------- star treatment · then/now ----
    {
      type: 'thenNow',
      ground: 'cream',
      then: {
        icon: 'trophy',
        kicker: 'What they check',
        title: 'Fitness · Diet · Recovery',
        items: [
          'So they stay at the top of their game, season after season.',
          'Their trainers plan around the results, not around guesswork.',
          'It used to take a team, a budget, and access most people never had.',
        ],
      },
      now: {
        icon: 'truck',
        kicker: 'What you check',
        title: 'Hair · Hormones · Fertility',
        items: [
          'So you keep your hair, your energy and your future.',
          '<b>Same saliva test. Same lab science. A different question.</b>',
          'A kit at your door. No clinic, no needles, no team required.',
        ],
      },
      closingHtml: "What was once a professional's advantage now fits inside an envelope, for everyone.",
      cta: { label: 'Check My Risk', href: '#kit' },
    },

    // ----------------------------------------------------------- body map ----
    {
      type: 'bodyMap',
      ground: 'sage',
      head: {
        eyebrow: { label: 'Where these tests read your risk', icon: 'target' },
        titleHtml: 'Three areas of the body. <em class="tst-em-teal">Three early warning systems.</em>',
        leadHtml: 'Tap any part of the body to see what we check there.',
      },
      image: { src: `${IMG}/bodymap-figure.png`, alt: 'Anatomical figure marking the three tested areas' },
      hotspots: [
        {
          key: 'hair',
          label: 'Hair Fall',
          caption: 'Read before thinning shows',
          tipTitle: 'Scalp · Hair Fall',
          tipBody:
            'The AR gene is one of the strongest signs of future hair loss in men, read before thinning shows. Once a hair root dies, no treatment brings it back. Genes: AR, LINC01432, C1orf127.',
          x: 49.7,
          y: 14.4,
          side: 'left',
          geom: {
            box: [26, 50, 340, 44],
            dot: [358, 71],
            line: [206, 71, 346, 71],
            text: { side: 'left', x: 195, y: 52 },
            ring: '#a8762a',
            core: '#a8762a',
          },
        },
        {
          key: 'hormones',
          label: 'Hormones',
          caption: 'Energy, muscle, mood, drive',
          tipTitle: 'Endocrine system · Hormones',
          tipBody:
            'Genes tied to hormone production that affect energy, muscle, mood and sex drive, sometimes as early as your 20s. Wait too long and low testosterone can start hurting fertility too. Genes: LOC108783645, HFE.',
          x: 55.1,
          y: 38.8,
          side: 'right',
          geom: {
            box: [380, 155, 340, 60],
            dot: [397, 191],
            line: [520, 176, 410, 189],
            text: { side: 'right', x: 531, y: 157 },
            ring: '#15605d',
            core: '#15605d',
          },
        },
        {
          key: 'fertility',
          label: 'Fertility',
          caption: 'Even when you look healthy',
          tipTitle: 'Reproductive system · Fertility',
          tipBody:
            'A gene that can make it harder to have a baby, even in men who look perfectly healthy. Knowing before you try means fewer months lost, and a specialist sooner if needed. Gene: ART3.',
          x: 47.6,
          y: 60.8,
          side: 'left',
          geom: {
            box: [26, 288, 340, 44],
            dot: [343, 299],
            line: [206, 309, 329, 301],
            text: { side: 'left', x: 195, y: 288 },
            ring: '#25b5ab',
            core: '#0e7c77',
          },
        },
      ],
    },

    // --------------------------------------------------------- risk cards ----
    {
      type: 'riskCards',
      ground: 'cream',
      head: {
        eyebrow: { label: 'One kit · three answers', icon: 'activity' },
        titleHtml: 'Three things that quietly shape a man\'s life. <em class="tst-em-teal">We check all three.</em>',
        leadHtml: 'Each test gives a clear result, a clear risk level, and a clear next step.',
      },
      allLabel: 'All three',
      cards: [
        {
          key: 'hormones',
          tabLabel: 'Hormones',
          icon: 'zap',
          image: { src: `${IMG}/risk-hormones.png`, alt: 'Energy, muscle, mood and drive' },
          imageCaption: 'Energy, muscle, mood, drive',
          geneLabel: 'Hormones · LOC108783645, HFE',
          question: 'Are your genes lowering your testosterone?',
          bodyHtml:
            'Same gym, same food, same sleep, but you&rsquo;re tired in a way rest doesn&rsquo;t fix. Some men are born with genes that lower hormone production. <b>It can hit energy, muscle, mood and drive as early as your 20s.</b>',
          warningHtml: 'Wait too long and low testosterone can start hurting fertility too.',
          sample: { label: 'Sample result', valueHtml: 'Average · Medium', tone: 'avg', percent: 55 },
        },
        {
          key: 'hair',
          tabLabel: 'Hair Fall',
          icon: 'scissors',
          image: { src: `${IMG}/risk-hair.png`, alt: 'Hair roots dying before thinning shows' },
          imageCaption: 'Roots dying before you notice',
          geneLabel: 'Hair Fall · AR, LINC01432, C1orf127',
          question: 'Is your hair loss coming from your genes?',
          bodyHtml:
            'More hair on the pillow than usual. You tell yourself it&rsquo;s stress, a new shampoo, the weather. It&rsquo;s probably none of those. <b>The AR gene is one of the strongest signs of future hair loss in men.</b>',
          warningHtml: 'Once a hair root dies, no treatment brings it back.',
          sample: { label: 'Sample result', valueHtml: 'Poor · High', tone: 'poor', percent: 85 },
        },
        {
          key: 'fertility',
          tabLabel: 'Fertility',
          icon: 'stroller',
          image: { src: `${IMG}/risk-fertility.png`, alt: 'A man who looks healthy on the outside' },
          imageCaption: 'Healthy on the outside',
          geneLabel: 'Fertility · Gene ART3',
          question: 'Can your genes make it harder to have a baby?',
          bodyHtml:
            'Eight months of trying, and every month feels heavier than the last. A man can look perfectly healthy and still carry genes that make it harder. <b>ART3 is where that shows up.</b>',
          warningHtml: 'IVF costs &#8377;1.5&ndash;2.5L per round, often after a year of guessing.',
          sample: { label: 'Sample result', valueHtml: 'Good · Low', tone: 'good', percent: 22 },
        },
      ],
      cta: { label: 'Get My 3-in-1 Report', href: '#kit' },
      ctaNoteHtml: '3 tests · 1 saliva sample · <b>results in 7 days</b>',
    },

    // -------------------------------------------------------------- stats ----
    {
      type: 'stats',
      ground: 'ink',
      head: {
        eyebrow: { label: 'The numbers most men never check', icon: 'chart', accent: 'teal' },
        titleHtml: 'These are not rare cases. This is the man sitting next to you.',
        leadHtml: 'Most only find out once the damage is done.',
      },
      stats: [
        {
          kicker: 'Hormones',
          value: '30',
          tone: 'java2',
          barPercent: 60,
          bodyHtml:
            'is the age testosterone can start falling. You blame work, stress or getting older, and almost no one checks.',
        },
        {
          kicker: 'Hair fall',
          value: '1 in 2',
          tone: 'java',
          barPercent: 50,
          bodyHtml: 'Indian men losing hair are under 25. Most only act once the hair is gone. (Traya, 2025)',
        },
        {
          kicker: 'Fertility',
          value: '1 in 8',
          tone: 'pink',
          barPercent: 13,
          bodyHtml: 'couples struggle to have a baby. In nearly half of them, the cause is the man.',
        },
      ],
      closingHtml: 'All three can be managed. The only question is whether you find out in time.',
      cta: { label: 'Check My Risk', href: '#kit', variant: 'light' },
    },

    // ----------------------------------------------------------- contrast ----
    {
      type: 'contrast',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'What changes when you know', icon: 'scale', accent: 'teal' },
        titleHtml: 'This is not about genes. <em class="tst-em-teal">It&rsquo;s about the life you want.</em>',
        leadHtml: 'Every result you get back is really a choice: keep guessing, or start fixing.',
      },
      negative: {
        badge: { label: 'Right now', icon: 'frown' },
        image: { src: `${IMG}/contrast-now.png`, alt: 'A man checking the mirror before anyone else wakes up' },
        kicker: 'He never tested',
        title: 'Still guessing, every single day',
        items: [
          'He trains hard and sees nothing, and he&rsquo;s tired by evening, every day.',
          'He&rsquo;s stopped telling anyone, and tells himself this is just his body now.',
          'He checks the mirror before anyone wakes up, and picks chairs by the light in the room.',
          'He&rsquo;s started avoiding photos. Every month, a little more is gone.',
          'Another month, another no. Neither of them knows what is wrong, and he&rsquo;s quietly starting to blame himself.',
        ],
      },
      positive: {
        badge: { label: 'Next year', icon: 'smile' },
        image: { src: `${IMG}/contrast-next-year.png`, alt: 'A man back to himself, energy and hairline intact' },
        kicker: 'He tested early',
        title: 'This time next year, still ahead',
        items: [
          'He found out why, and fixed it early. His energy is back.',
          'So is the body he&rsquo;s been working for. He feels like himself again.',
          'He caught it while the roots were still alive, and started treatment when it still works.',
          'He still has his hairline, and stopped thinking about it every day.',
          'He knew early, so he never lost a year guessing. One day soon, they both get to share the good news.',
        ],
      },
      closingHtml: 'One test today can save you years of guessing later.',
      cta: { label: 'Check My Risk', href: '#kit' },
    },

    // -------------------------------------------------------------- worth ----
    {
      type: 'worth',
      ground: 'cream',
      head: {
        eyebrow: { label: 'The cost of waiting', icon: 'piggy' },
        titleHtml: 'Guessing has a price. <em class="tst-em-teal">It&rsquo;s just paid later.</em>',
        leadHtml:
          'Think about what a year of not knowing actually costs: the tests, the bills, and the months you can&rsquo;t get back. This costs less than almost any of it, and it is the only one that changes what happens next.',
      },
      emphasisHtml:
        '<em class="tst-em-teal">Because this was never really about a test.</em> <b class="tst-strong">It&rsquo;s about your hair, your energy, and your future.</b>',
      price: {
        badge: { label: 'One test · Once in your whole life', icon: 'award' },
        titleHtml: 'Just &#8377;____, one time.<br/>And you never have to wonder again.',
        bodyHtml:
          'Your genes never change, so you test <b>only once</b> and the answers stay true for the rest of your life. Set against a single round of IVF, or a year of fertility bills, it is a rounding error, and it is the only one that buys you time instead of spending it.',
        chips: [
          { label: 'Less than one month of gym' },
          { label: 'Less than one dinner out' },
          { label: 'Yours to keep for life' },
        ],
        image: { src: `${IMG}/worth-life.png`, alt: 'A man at ease, years ahead with the people he loves' },
      },
    },

    // ----------------------------------------------------------- outcomes ----
    {
      type: 'outcomes',
      ground: 'cream',
      cards: [
        {
          icon: 'receipt',
          kicker: 'The bills that come later',
          title: '&#8377;1.5L+ in fertility tests',
          bodyHtml:
            'Often only started <b>after a year of trying and guessing.</b> The tests are the same either way. Only the timing, and what you can still do about it, changes.',
        },
        {
          icon: 'piggy',
          kicker: 'Per round',
          title: '&#8377;1.5&ndash;2.5L for IVF',
          bodyHtml:
            'A cost many couples face after months of not knowing why. <b>Knowing before you start trying can change how that year goes entirely.</b>',
        },
        {
          icon: 'hourglass',
          kicker: "What you can't buy back",
          title: 'The years, and the choices',
          bodyHtml:
            'Once a hair root dies, nothing brings it back. Once a year is spent guessing, it&rsquo;s gone. <b>You lose money, time, and choices you can&rsquo;t get back.</b>',
        },
      ],
    },

    // -------------------------------------------------------- testimonial ----
    {
      type: 'testimonial',
      ground: 'cream',
      quoteHtml: 'One test costs you an afternoon. <em class="tst-em-teal">Not knowing can cost you years.</em>',
      bodyHtml:
        'For years you may have blamed work, stress or just getting older. When you finally see what your genes are doing, everything changes: you stop guessing about your own body and start acting on it, <b>while every option is still open to you.</b>',
      closingHtml:
        'You are not paying for a test. You are buying back the years, and the choices, you would have lost.',
      cta: { label: 'Check My Risk', href: '#kit' },
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
        'All three results (Hormones, Hair Fall, Fertility) on one page.',
        'A simple Good, Average or Poor risk level for each.',
        'A clear action for every result, not just numbers.',
        'Yours to keep for life. Genes don&rsquo;t change, so you test once.',
      ],
      cta: { label: 'Unlock My Report', href: '#kit' },
      sample: {
        badge: 'Sample',
        title: "Men's Wellness · Sample Report",
        rows: [
          { label: 'Hormones', value: 'Average · Med', tone: 'avg' },
          { label: 'Hair Fall', value: 'Poor · High', tone: 'poor' },
          { label: 'Fertility', value: 'Good · Low', tone: 'good' },
        ],
        legendHtml: '<b>Good</b> = normal range · <b>Average</b> = some risk · <b>Poor</b> = higher risk',
      },
    },

    // -------------------------------------------------------------- steps ----
    {
      type: 'steps',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'How it works', icon: 'box' },
        titleHtml: 'From your doorstep to your genes, <em class="tst-em-teal">in 5 simple steps.</em>',
        leadHtml: 'No clinic. No needle. No fasting. About five minutes of your time.',
      },
      steps: [
        { icon: 'box', title: 'Order', bodyHtml: 'Kit reaches your door in 2 to 3 days with everything inside.' },
        { icon: 'droplet', title: 'Collect', bodyHtml: 'Spit into the tube at home. Five minutes, no fasting.' },
        { icon: 'truck', title: 'Return', bodyHtml: 'Pre-paid envelope. Courier pickup, trackable in-app.' },
        { icon: 'microscope', title: 'NABL lab', bodyHtml: 'A scientist reviews every result.' },
        {
          icon: 'file',
          title: 'Report',
          bodyHtml: 'Ready in 7 days, delivered to your KYG account.',
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
        titleHtml: 'A result on its own is just data. <em class="tst-em-teal">We tell you what to do next.</em>',
      },
      image: { src: `${IMG}/counsellor.png`, alt: "A KYG genetics expert reviewing a Men's Wellness report" },
      points: [
        '<b>Hormones:</b> what your result means for energy, training and when to see a doctor.',
        '<b>Hair Fall:</b> what to do at the early stage, and when treatment is actually worth it.',
        '<b>Fertility:</b> whether a fertility check makes sense, and what it involves.',
        '<b>As a couple:</b> your next steps if you&rsquo;re planning marriage or a family.',
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
        kicker: "Men's Wellness Genetic Kit",
        title: '3 Tests. One Panel.',
        items: [
          'All 3 tests: Hormones, Hair Fall &amp; Fertility',
          'At-home saliva kit, delivered &amp; picked up free',
          'Easy-to-read report in 7 days',
          'Every result reviewed by our genetics team',
          'NABL-certified processing · your data is never sold',
        ],
      },
      order: {
        kicker: 'One test · once in your life',
        lines: [
          'Kit at your door in <b>2 to 3 days</b>.',
          'Sample takes <b>5 minutes</b>.',
          'Report in <b>7 days</b>.',
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
        {
          statHtml: '99%+',
          title: 'Accuracy on testing',
          bodyHtml: 'Tested at Neotech World Lab, MG Road, Gurugram. Under 2% ever need a re-check.',
        },
        {
          icon: 'badge-check',
          title: 'NABL-accredited lab',
          bodyHtml: "India's highest lab standard, on Illumina technology, following ACMG and CPIC guidelines.",
        },
        {
          icon: 'lock',
          accent: 'crimson',
          title: 'Your data, protected',
          bodyHtml: 'Never sold or shared. Your sample is destroyed after testing.',
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
          q: "I feel completely fine. Isn't this a waste of money?",
          a: 'Feeling fine is exactly when this test is most useful, because genetic risk stays silent for years before symptoms show. Testing now is how you get ahead of hair fall, hormone dips and fertility issues while you still have the most options.',
        },
        {
          q: "I'm in my 20s. Aren't I too young for this?",
          a: 'Your 20s and 30s are the best time. Hair loss often starts before 25, hormones can dip early, and fertility is easiest to plan around before you are actively trying. Your genes do not change with age, so testing young gives you the biggest head start from a single test.',
        },
        {
          q: 'What if my result comes back "Poor"? Won\'t that just scare me?',
          a: 'A high-risk result means "act early", not "this will definitely happen to you". It shows a higher chance, not a diagnosis, and catching it now is good news, because prevention works best. You are not left alone with it either: a free Second Opinion session explains what it means and what to do next.',
        },
        {
          q: 'Is this actually accurate, or just a novelty genetic kit?',
          a: 'It is processed in an NABL-accredited (ISO 15189) lab on Illumina technology, following international ACMG and CPIC guidelines. Accuracy on repeat testing is over 99%, under 2% of samples ever need a re-check, and every report is checked by a Ph.D scientist.',
        },
        {
          q: 'Do I have to visit a clinic or give blood?',
          a: 'No clinic, no needle, no fasting. The kit comes to your home, you give a small saliva sample in about five minutes, and a courier picks it up in a pre-paid envelope.',
        },
        {
          q: 'Will my genetic data be safe and private?',
          a: 'Your data is never sold or shared with anyone. Handling follows ISO 27001, HIPAA and FDA privacy standards, data is stored on encrypted servers, and your physical sample is destroyed after processing.',
        },
        {
          q: 'Once I get my report, what do I actually do with it?',
          a: 'Every result comes with a clear next step: a lifestyle change, an early chat with a doctor, or simply peace of mind. If you want it explained, book a free Second Opinion session — you are never handed data and left to figure it out alone.',
        },
        {
          q: "Can my partner test too if we're planning a family?",
          a: "Yes, and it is a smart move before marriage or trying for a baby. Pairing the Men's Wellness test with our Women's Health test gives you both a clearer picture together.",
        },
      ],
    },

    // ---------------------------------------------------------- final cta ----
    {
      type: 'finalCta',
      ground: 'ink',
      eyebrow: { label: 'Know now, not later', icon: 'zap', accent: 'teal' },
      titleHtml: 'Health without <em class="tst-em-teal">guesswork.</em>',
      chips: [{ label: '3 tests, 1 saliva kit' }, { label: 'Results in 7 days' }, { label: 'Expert guidance' }],
      cta: { label: 'Start My Report', href: '#kit' },
      noteHtml: 'At-home saliva kit · NABL certified lab · Results in 7 days',
    },

    // --------------------------------------------------------- disclaimer ----
    {
      type: 'disclaimer',
      bodyHtml:
        'This test is intended for general wellness and informational purposes. It is not a diagnostic tool and does not replace a clinical evaluation. Please consult a qualified medical professional to interpret your results and to guide any decisions about your health.',
    },
  ],
};
