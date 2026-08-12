// =============================================================================
// lib/tests/mens-health.ts - Men's Wellness test-detail page
// -----------------------------------------------------------------------------
// From health/mens-health.html. This deck is the longest of the set: on top of
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
//
// TURNAROUND IS 3 WEEKS on this deck, not the 7 days an earlier revision quoted.
// It appears in the hero chips, the steps, the kit panel and the final CTA -
// change all four together if it moves again.
// =============================================================================

import type { TestPage } from '@/features/tests/types';

const IMG = '/tests/mens-health';

export const mensHealth: TestPage = {
  slug: 'mens-health',
  categorySlug: 'wellness',

  seo: {
    title: "Men's Wellness DNA Test — hair, hormones and fertility from one sample",
    description:
      'Hair fall, testosterone and male fertility — three genetic answers from a single at-home saliva kit, each marked Good, Average or Poor. NABL-accredited lab, results in 3 weeks, expert guidance included.',
  },

  sections: [
    // --------------------------------------------------------------- hero ----
    {
      type: 'hero',
      eyebrow: { label: "Preventive Genetic Testing · Men's Wellness", icon: 'scan-heart' },
      titleHtml:
        'Most men wait for symptoms before checking their genes. <em class="tst-em">You don&rsquo;t have to.</em>',
      kickerHtml: 'One saliva sample. One report.',
      subHtml:
        'Your genetic risk for hair fall, hormones and fertility, each marked Good, Average or Poor, while you can still do something about it.',
      bullets: [
        '<b>Catch it early</b>, while it&rsquo;s still easy to fix',
        '<b>Decide with facts</b>, not guesses',
        '<b>Test once</b>, keep the answers for life',
      ],
      ctas: [
        { label: 'Check My Risk', href: '#kit' },
        { label: "See What's Inside", href: '#what-we-check', variant: 'ghost', icon: 'arrow-down' },
      ],
      chips: [
        { label: 'At-home kit', icon: 'box' },
        { label: 'No needles', icon: 'droplet' },
        { label: 'Results in 3 weeks', icon: 'clock' },
        { label: 'Expert guidance', icon: 'users' },
      ],
      footnoteHtml: 'NABL-certified lab. Expert guidance on your results.',
      image: { src: `${IMG}/hero-man.png`, alt: 'A man in his late twenties, healthy and in control' },
      resultCard: {
        title: 'File No. MH-2026-01',
        titleRight: 'KYG Lab',
        icon: 'flask',
        rows: [
          { label: 'Hormones', value: 'Average', tone: 'avg' },
          { label: 'Hair Fall', value: 'Poor', tone: 'poor' },
          { label: 'Fertility', value: 'Good', tone: 'good' },
        ],
        footNoteHtml: 'Confidential · Report Enclosed',
      },
    },

    // ----------------------------------------------- why test · aspiration ----
    {
      type: 'aspiration',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'The mistake most men make', icon: 'scale' },
        titleHtml: 'By the time symptoms show up, <em class="tst-em-teal">they take longer and cost more to fix.</em>',
        leadHtml:
          'Most men wait to feel a problem before checking their genes. Your genes can warn you years earlier, while there is still time to act.',
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
        'Most men act only after they can see or feel a problem. By then, treatment takes longer, costs more, and works less well. Your genes never change, so one test now holds good for the rest of your life.',
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
          'You try for a baby for a year before the tests even begin, and the bills reach &#8377;1.5L+.',
          'By the time you act, treatment takes longer, costs more, and works less well.',
        ],
        footerHtml: "You lose money, time, and choices you can't get back.",
      },
      now: {
        icon: 'eye',
        kicker: 'If you test now',
        title: 'You find out in time',
        items: [
          'You see your hair fall risk while your hair is still full.',
          'You check your hormones before the tiredness starts.',
          '<b>You know your fertility risk before you start trying.</b>',
          'You act now, when treatment is quickest, cheapest and works best.',
        ],
        footerHtml: 'One saliva test. At home. This week.',
      },
      closingHtml: "You lose money, time, and choices you can't get back.",
      cta: { label: 'Check My Risk', href: '#kit' },
    },

    // ---------------------------------------- star treatment · aspiration ----
    {
      type: 'aspiration',
      ground: 'cream',
      head: {
        eyebrow: { label: 'Elite athletes already do this', icon: 'star' },
        titleHtml:
          'Top athletes don&rsquo;t guess about their health. <em class="tst-em-teal">They test their genes first.</em>',
      },
      image: { src: `${IMG}/athletes.png`, alt: 'Anonymous athletes training, data-led' },
      badgeTop: { label: 'Always a step ahead', icon: 'award' },
      badgeBottom: { label: 'Same science, now yours', icon: 'zap' },
      rows: [
        {
          icon: 'dumbbell',
          title: 'Professional sport',
          subtitle: 'has used genetic testing for years, to plan fitness, diet and recovery.',
        },
        { icon: 'globe', title: 'Cricket, the NBA and the NFL', subtitle: 'all use it today.' },
        {
          icon: 'trophy',
          title: "India's international cricketers",
          subtitle: "adopted genetic testing in 2017, on their trainer's advice.",
        },
      ],
      bodyHtml:
        'These athletes don&rsquo;t wait to feel a problem. They test for it before it shows up. Same saliva test, same lab science. You are simply asking it about your hair, hormones and fertility instead.',
      quoteHtml:
        '<em class="tst-em">They had the trainers, the teams and the doctors to do this first.</em> <b class="tst-strong">Today that same edge fits in an envelope on your doorstep, and it is finally yours too.</b>',
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
          'So they stay at the top of their game.',
          'Their trainers plan around the results, not around guesswork.',
          'It used to take a team, a budget, and access most people never had.',
        ],
      },
      now: {
        icon: 'truck',
        kicker: 'What you check',
        title: 'Hair · Hormones · Fertility',
        items: [
          'So you protect them before it is too late.',
          '<b>Same saliva test. Same lab science.</b>',
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
        eyebrow: { label: 'One kit · multiple answers', icon: 'activity' },
        titleHtml: 'Three things that quietly shape a man\'s life. <em class="tst-em-teal">We check all three.</em>',
        leadHtml: 'Each test gives you a clear result, a clear risk level, and a clear next step.',
      },
      allLabel: 'All three',
      cards: [
        {
          key: 'hormones',
          tabLabel: 'Hormones',
          icon: 'zap',
          image: { src: `${IMG}/risk-hormones.png`, alt: 'Energy, muscle, mood and drive' },
          imageCaption: 'Test 01 · Energy, muscle, mood, drive',
          geneLabel: 'Hormones · LOC108783645, HFE',
          question: 'Are your genes lowering your testosterone?',
          scenarioHtml:
            "You're 28. Same gym, same food, same sleep, but you're tired in a way rest doesn't fix, and you've stopped mentioning it.",
          bodyHtml:
            '<b>Yes.</b> Some men are born with genes that lower hormone production, hitting energy, muscle, mood and sex drive as early as their 20s. Know early, and you stop blaming stress, age or "a bad phase" for something you can actually fix.',
          chips: ['Tired despite sleep', 'Losing muscle', 'Low drive', 'Low mood'],
          warningHtml: 'Wait too long and low testosterone can start hurting fertility too.',
          sample: {
            label: 'Sample result',
            valueHtml: 'Average · Medium',
            tone: 'avg',
            percent: 55,
            noteHtml: 'Your report shows exactly where you land, and what to do about it.',
          },
        },
        {
          key: 'hair',
          tabLabel: 'Hair Fall',
          icon: 'scissors',
          image: { src: `${IMG}/risk-hair.png`, alt: 'Hair roots dying before thinning shows' },
          imageCaption: 'Test 02 · Roots dying before you notice',
          geneLabel: 'Hair Fall · AR, LINC01432, C1orf127',
          question: 'Is your hair loss coming from your genes?',
          scenarioHtml:
            "More hair on the pillow than usual. You tell yourself it's stress, a new shampoo, the weather. It's probably none of those.",
          bodyHtml:
            '<b>Yes.</b> One gene in particular, called AR, is one of the strongest signs of future hair loss in men. Most treatments work best <b>before</b> hair loss shows. Know early and you keep every option open.',
          chips: ['Thinning at crown', 'Patchy spots', 'Hair pulls out easily', 'Receding line'],
          warningHtml: 'Once a hair root dies, no treatment brings it back. Timing is everything.',
          sample: {
            label: 'Sample result',
            valueHtml: 'Poor · High',
            tone: 'poor',
            percent: 85,
            noteHtml: 'A high risk result is a warning, not a final answer.',
          },
        },
        {
          key: 'fertility',
          tabLabel: 'Fertility',
          icon: 'stroller',
          image: { src: `${IMG}/risk-fertility.png`, alt: 'A man who looks healthy on the outside' },
          imageCaption: 'Test 03 · Healthy on the outside',
          geneLabel: 'Fertility · Gene ART3',
          question: 'Can your genes make it harder to have a baby?',
          scenarioHtml:
            "You've been trying for a baby for eight months. Every month feels heavier than the last, and neither of you knows why.",
          bodyHtml:
            '<b>Yes.</b> A man can look perfectly healthy and still have genes that make it harder to have a baby. Knowing before you try means fewer months lost, less blame between partners, and a specialist sooner if needed.',
          chips: ['No baby after 12mo', 'Lower drive', 'Testicle discomfort', 'Reduced body hair'],
          warningHtml: 'IVF costs &#8377;1.5 to 2.5L per round, often started only after a year of guessing.',
          sample: {
            label: 'Sample result',
            valueHtml: 'Good · Low',
            tone: 'good',
            percent: 22,
            noteHtml: 'Peace of mind is a result too, and worth knowing.',
          },
        },
      ],
      cta: { label: 'Get My 3-in-1 Report', href: '#kit' },
      ctaNoteHtml: 'One kit · all three tests · <b>expert guidance on your results</b>',
    },

    // -------------------------------------------------------------- stats ----
    {
      type: 'stats',
      ground: 'ink',
      head: {
        eyebrow: { label: 'The numbers most men never check', icon: 'chart', accent: 'teal' },
        titleHtml: 'These are not rare cases. This is the man sitting next to you.',
      },
      stats: [
        {
          kicker: 'Hormones',
          value: '30',
          tone: 'pink',
          barPercent: 60,
          leadHtml: 'is the age testosterone can start falling',
          bodyHtml:
            'You feel tired, weaker, low on drive. You blame work, stress, or getting older. Almost no one checks their hormones.',
        },
        {
          kicker: 'Hair fall',
          value: '1 in 2',
          tone: 'java',
          barPercent: 50,
          leadHtml: 'Indian men losing hair are under 25',
          bodyHtml:
            'Half of them are barely out of college. Most only act once the hair is gone, when nothing can bring it back. (Traya, 2025)',
        },
        {
          kicker: 'Fertility',
          value: '1 in 8',
          tone: 'java2',
          barPercent: 13,
          leadHtml: 'couples struggle to have a baby',
          bodyHtml:
            'In nearly half of them, the cause is the man. He usually finds out only after a year of trying, and a pile of bills.',
        },
      ],
      closingHtml: 'The only question is whether you find out in time.',
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
        badge: { label: 'This time next year', icon: 'smile' },
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
      closingHtml: 'One test costs you five minutes. Not knowing can cost you years.',
      cta: { label: 'Check My Risk', href: '#kit' },
      ctaNoteHtml: '3 tests · 1 saliva sample · <b>results in 3 weeks</b>',
    },

    // -------------------------------------------------------------- worth ----
    {
      type: 'worth',
      ground: 'cream',
      head: {
        eyebrow: { label: 'The cost of waiting', icon: 'piggy' },
        titleHtml:
          'You have already spent more than this <em class="tst-em-teal">on things you cannot even remember.</em>',
        leadHtml: 'This is the one that quietly decides how the next ten years feel.',
      },
      emphasisHtml:
        '<em class="tst-em-teal">Because this was never really about a saliva sample.</em> <b class="tst-strong">It is about the years, and the man, you get to keep.</b>',
      price: {
        badge: { label: 'One test · Once in your life', icon: 'award' },
        titleHtml: 'Just &#8377;____, one time.<br/>And you stop guessing about your body for good.',
        bodyHtml:
          'Your genes never change, so you test <b>only once</b> and the answers hold for the rest of your life. Spread across all the years it protects, it comes to less than a cup of coffee a month, to finally know what your body is doing instead of blaming work, stress, or age.',
        chips: [
          { label: 'Less than a month at the gym' },
          { label: 'Less than one night out' },
          { label: 'You decide once, for life' },
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
          icon: 'moon',
          kicker: 'Tonight',
          title: 'You stop guessing',
          bodyHtml:
            'No more blaming work, stress or getting older for the way you feel. For the first time you actually <b>know</b>, and you can stop carrying it alone.',
        },
        {
          icon: 'sprout',
          kicker: 'Within a year',
          title: 'You fix it while you still can',
          bodyHtml:
            'Hair roots still alive. Hormones still easy to correct. Fertility caught before a wasted year of trying. <b>Early costs almost nothing. Late can cost you everything.</b>',
        },
        {
          icon: 'users',
          kicker: 'Years from now',
          title: "You're still the man they count on",
          bodyHtml:
            'Energy to keep up with your kids. The family you wanted. Still sharp, still strong, still yourself. <b>The people who rely on you get more of you, for longer.</b>',
        },
      ],
    },

    // -------------------------------------------------------- testimonial ----
    {
      type: 'testimonial',
      ground: 'cream',
      quoteHtml: 'Finally&hellip; the <em class="tst-em-teal">body I train for</em> actually shows up.',
      bodyHtml:
        'For years you may have blamed yourself for the energy that never came and the results that never showed. When you find out what your hormones are really doing, everything changes: you stop training against your body and start working with it, and feel <b>strong, sharp, and like yourself again.</b>',
      closingHtml:
        "You're not paying for a test. You're buying back the years, and the version of yourself, you would have lost.",
      cta: { label: 'Check My Risk', href: '#kit' },
    },

    // ----------------------------------------------------- report preview ----
    {
      type: 'reportPreview',
      ground: 'sage',
      head: {
        eyebrow: { label: 'See a sample report', icon: 'file' },
        titleHtml: 'A report you can <em class="tst-em-teal">actually understand.</em>',
        leadHtml: 'No gene codes. No jargon. Just clear answers.',
      },
      bullets: [
        'All three results (Hormones, Hair Fall, Fertility) on one page.',
        'A simple Good, Average or Poor risk level for each.',
        'A clear action for every result, not just numbers.',
        'Yours to keep for life. Genes don&rsquo;t change, so you test once.',
      ],
      cta: { label: 'Unlock My Report', href: '#kit' },
      sample: {
        badge: 'Confidential',
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
        titleHtml: 'Five steps, from kit to report. <em class="tst-em-teal">Three weeks, start to finish.</em>',
        leadHtml: 'No clinic. No needle. No fasting. About five minutes of your time.',
      },
      steps: [
        { icon: 'box', title: 'Order', bodyHtml: 'Kit reaches your door in 2 to 3 days with everything inside.' },
        { icon: 'droplet', title: 'Collect', bodyHtml: 'Spit into the tube at home. Five minutes, no fasting.' },
        { icon: 'truck', title: 'Return', bodyHtml: 'Pre-paid envelope. Courier pickup, trackable in-app.' },
        { icon: 'microscope', title: 'Lab', bodyHtml: 'NABL-certified lab. A scientist reviews every result.' },
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
        titleHtml: 'A real doctor explains <em class="tst-em-teal">what your results mean.</em>',
        leadHtml:
          'Book a session with Dr. Varun Sharma, Ph.D, our Human Genetics scientist. He reads your exact results and tells you what to do next, in simple language.',
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
        kicker: "Men's Wellness Genetic Kit",
        title: 'Everything in one box',
        items: [
          'All 3 tests: Hormones, Hair Fall &amp; Fertility',
          'At-home saliva kit, delivered &amp; picked up free',
          'Easy-to-read report in 3 weeks',
          'Option to consult Dr. Varun Sharma, Ph.D, about your results',
          'NABL-certified processing · data destroyed after',
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
          title: 'Accuracy on repeat testing',
          bodyHtml: 'Under 2% of samples ever need a re-check.',
        },
        {
          icon: 'badge-check',
          title: 'Checked by a Ph.D scientist',
          bodyHtml: 'Every report is checked by Dr. Varun Sharma, Ph.D, Scientist in Human Genetics.',
        },
        {
          icon: 'lock',
          accent: 'crimson',
          title: 'Your data, protected',
          bodyHtml: 'Never sold or shared. Your sample is destroyed after testing.',
        },
      ],
      noteHtml: 'Tested at Neotech World Lab Pvt. Ltd, MG Road, Gurugram.',
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
          a: 'Feeling fine is exactly when this test is most useful. Genetic risk stays silent for years before you feel anything, so testing now is the only time you can still act early. That is the whole point.',
        },
        {
          q: "I'm in my 20s. Aren't I too young for this?",
          a: 'Your 20s and 30s are the best time to test. Hair loss often starts before 25 and hormones can dip early too. Your genes never change, so one test now gives you the biggest head start.',
        },
        {
          q: 'What if my result comes back "Poor / High Risk"? Won\'t that just scare me?',
          a: 'It means "act early". It does not mean this will definitely happen to you — it shows a higher chance, not a diagnosis. Dr. Varun Sharma can explain your result and tell you exactly what to do next.',
        },
        {
          q: 'Is this actually accurate, or just a novelty genetic kit?',
          a: 'It is tested in an NABL-accredited (ISO 15189) lab on Illumina technology, following international ACMG and CPIC guidelines. Every report is checked by a Ph.D scientist, and accuracy on repeat testing is over 99%. This is clinical-grade testing, not a gimmick.',
        },
        {
          q: 'Do I have to visit a clinic or give blood?',
          a: 'No clinic, no needle, no fasting. The kit comes to your home, you give a saliva sample in about five minutes, and a courier picks it up in a pre-paid envelope.',
        },
        {
          q: 'Will my genetic data be safe and private?',
          a: 'Your data is never sold or shared with anyone. Handling follows ISO 27001, HIPAA and FDA privacy standards, data is stored on encrypted servers, and your sample is destroyed after testing.',
        },
        {
          q: 'Once I get my report, what do I actually do with it?',
          a: 'Every result comes with a clear next step: a lifestyle change, an early chat with a doctor, or simply peace of mind. If you want it explained, you can consult Dr. Varun Sharma.',
        },
        {
          q: "Can my partner test too if we're planning a family?",
          a: "Yes. It is a smart move before marriage, or before trying for a baby. Pair this with our Women's Health test for the full picture, and you can consult Dr. Varun Sharma together, as a couple.",
        },
      ],
    },

    // ---------------------------------------------------------- final cta ----
    {
      type: 'finalCta',
      ground: 'ink',
      eyebrow: { label: 'Know now, not later', icon: 'zap', accent: 'teal' },
      titleHtml: 'Health without <em class="tst-em-teal">guesswork.</em>',
      chips: [{ label: '3 tests, 1 saliva kit' }, { label: 'Results in 3 weeks' }, { label: 'Expert guidance' }],
      cta: { label: 'Start My Report', href: '#kit' },
      noteHtml: 'At-home saliva kit · NABL certified lab · Results in 3 weeks · Expert guidance available',
    },

    // --------------------------------------------------------- disclaimer ----
    {
      type: 'disclaimer',
      bodyHtml:
        'This is general educational information, not medical advice. Talk to a doctor or genetic counsellor about your own case.',
    },
  ],
};
