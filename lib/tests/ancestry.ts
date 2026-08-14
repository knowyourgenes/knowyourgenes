// =============================================================================
// lib/tests/ancestry.ts - Ancestors In Me (Ancestry DNA) test-detail page
// -----------------------------------------------------------------------------
// From health/ancestry-health.html. The only non-health panel in the set, which
// is what shapes the two unusual choices below. Mapping:
//
//   who it's for       -> whoFor        (8 tiles)
//   family tree vs DNA -> aspiration + thenNow
//   star treatment     -> aspiration + thenNow   (the pair repeats, by design)
//   the 4 chapters     -> riskCards     (chapters, not conditions)
//   the 10 regions     -> markerGrid    (`detail` tiles with a share rail)
//   price value        -> worth + outcomes + testimonial
//
// TONE: every result here uses `neutral`, the non-grade tone (types.ts). A
// share of ancestry is not a risk, and painting "72.91% South Asian" in the red
// of a Poor result would imply a verdict this test never makes.
//
// SLUG: `ancestry` - the nav mega-menu, the homepage and the kit art
// (public/tests/ancestry) all already use it. Its redirect is removed in
// next.config.ts, which leaves that list empty.
// =============================================================================

import type { TestPage } from '@/features/tests/types';

const IMG = '/tests/ancestry';

export const ancestry: TestPage = {
  slug: 'ancestry',
  categorySlug: 'wellness',

  seo: {
    title: 'Ancestry DNA Test - 10 global regions from one saliva sample',
    description:
      'Ancestors In Me maps your origin across up to 10 global regions from 42,000+ genetic markers, and writes it up as a Gene Journey. NABL-accredited lab, results in 3 weeks, free counselling included.',
  },

  sections: [
    // --------------------------------------------------------------- hero ----
    {
      type: 'hero',
      eyebrow: { label: 'Ancestors In Me · Ancestry DNA', icon: 'globe' },
      titleHtml: 'An ancestry test that goes <em class="tst-em">beyond the family tree.</em>',
      kickerHtml: '10 regions. 1 saliva sample.',
      subHtml: 'You know who you are on paper. This goes back 50,000 years further than that.',
      ctas: [
        { label: 'Discover My Ancestors', href: '#kit' },
        { label: "See What's Inside", href: '#what-we-check', variant: 'ghost', icon: 'arrow-down' },
      ],
      chips: [
        { label: 'No needles', icon: 'droplet' },
        { label: 'NABL lab', icon: 'badge-check' },
        { label: 'Results in 3 weeks', icon: 'clock' },
      ],
      footnoteHtml: 'One saliva sample tells the story.',
      image: { src: `${IMG}/hero-map.png`, alt: 'Ancient migration lines converging on South Asia' },
      resultCard: {
        title: 'Your breakdown',
        icon: 'flask',
        rows: [
          { label: 'South Asian', value: '72.91%', tone: 'neutral' },
          { label: 'Malayan', value: '7.79%', tone: 'neutral' },
          { label: 'South Central Asian', value: '7.13%', tone: 'neutral' },
          { label: 'West Caucasian', value: '6.21%', tone: 'neutral' },
          { label: 'Amerindian', value: '1.47%', tone: 'neutral' },
        ],
      },
    },

    // ------------------------------------------------------------- who for ----
    {
      type: 'whoFor',
      ground: 'sage',
      head: {
        eyebrow: { label: 'No one is left out', icon: 'users' },
        titleHtml: 'Eight reasons people finally <em class="tst-em">take this test.</em>',
      },
      image: { src: `${IMG}/who.png`, alt: 'Three generations of a family together' },
      introTitleHtml: 'This test is for you if&hellip;',
      introBodyHtml:
        'Ancestry belongs to all of us. But some people carry the question a little closer, and feel the answer a little deeper. Your DNA never changes, so you test once and the story stays yours to keep, and to pass on.',
      chips: [
        { label: 'Test once, for life', icon: 'clock' },
        { label: 'A gift across generations', icon: 'gift' },
      ],
      signs: [
        {
          icon: 'users',
          accent: 'crimson',
          textHtml:
            "<b>Parents &amp; grandparents:</b> for the generation that always wondered about the family's real story.",
        },
        {
          icon: 'globe',
          accent: 'teal',
          textHtml: '<b>NRI family members:</b> for Indians abroad, the question of home feels bigger, not smaller.',
        },
        {
          icon: 'heart',
          accent: 'crimson',
          textHtml: '<b>Couples &amp; families:</b> compare results together, and see how your stories connect.',
        },
        {
          icon: 'gift',
          accent: 'teal',
          textHtml: '<b>Gift-givers:</b> a genetic test that gives someone their own story.',
        },
        {
          icon: 'search',
          accent: 'crimson',
          textHtml: 'You have always wondered where your features, your colour, your name truly came from.',
        },
        {
          icon: 'compass',
          accent: 'teal',
          textHtml: 'You have felt caught between two places, never quite fully from either.',
        },
        {
          icon: 'hourglass',
          accent: 'crimson',
          textHtml: 'The elders who held the old stories are getting older, or are already gone.',
        },
        {
          icon: 'sprout',
          accent: 'teal',
          textHtml: 'You want your children to grow up <b>knowing exactly where they come from.</b>',
        },
      ],
      closingHtml: 'Or you simply want to meet the 50,000 years of people who made you.',
      ctas: [
        { label: 'Discover My Ancestors', href: '#kit' },
        { label: 'Learn More', href: '#what-we-check', variant: 'ghost' },
      ],
    },

    // ------------------------------------------ family tree vs DNA · intro ----
    {
      type: 'aspiration',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'Family tree vs genetic testing', icon: 'scale' },
        titleHtml:
          'Your grandmother can name one or two regions. <em class="tst-em-teal">Most Indians match six to eight.</em>',
      },
      image: { src: `${IMG}/memory.png`, alt: 'An old family photograph beside a DNA helix' },
      badgeTop: { label: "Before it's lost", icon: 'hourglass' },
      badgeBottom: { label: '50,000 years back', icon: 'zap' },
      rows: [
        { icon: 'users', title: 'The elders', subtitle: 'who held the old stories are getting older.' },
        { icon: 'book', title: 'The memory', subtitle: 'that fades a little more each generation.' },
        { icon: 'tag', title: 'The single label', subtitle: 'passed down, hiding a much fuller picture.' },
      ],
      bodyHtml:
        'What your grandmother remembers is already getting thinner. What is left is often one word, passed down, not the older story underneath it. Your genes kept a copy of that story, and they never forget.',
      quoteHtml:
        '<em class="tst-em">A family tree reaches back two or three generations, on memory alone.</em> <b class="tst-strong">This reaches back 50,000 years, on 42,000+ genetic markers, and it can actually be checked.</b>',
    },

    // ---------------------------------------- family tree vs DNA · then/now ----
    {
      type: 'thenNow',
      ground: 'ivory',
      then: {
        icon: 'family',
        kicker: 'Family tree',
        title: 'Memory, and what survived it',
        items: [
          'Reaches back 2 to 3 generations, on stories and memory.',
          'Usually shows just 1 or 2 regions, and is hard to verify.',
          'Rarely explains the surprises, or the threads that never added up.',
        ],
      },
      now: {
        icon: 'dna',
        kicker: 'DNA test',
        title: '50,000 years, on record',
        items: [
          'Reaches back 50,000 years, on 42,000+ genetic markers.',
          '<b>Maps you across up to 10 regions worldwide, in an NABL-certified lab.</b>',
          'Explains the surprises, with a real expert to walk you through them.',
        ],
      },
      closingHtml: 'Every generation, a little more is lost. This is how you keep it.',
      cta: { label: 'Discover My Ancestors', href: '#kit' },
    },

    // ---------------------------------------- star treatment · aspiration ----
    {
      type: 'aspiration',
      ground: 'cream',
      head: {
        eyebrow: { label: 'A well-known story, told worldwide', icon: 'star' },
        titleHtml: 'Ancestry reveals have become <em class="tst-em-teal">part of popular culture.</em>',
      },
      image: { src: `${IMG}/reveal.png`, alt: 'An anonymous silhouette reading a result on screen' },
      badgeTop: { label: 'The reveal moment', icon: 'film' },
      badgeBottom: { label: 'No studio required', icon: 'zap' },
      rows: [
        { icon: 'film', title: 'Primetime specials', subtitle: 'built entirely around one envelope.' },
        { icon: 'share', title: 'Viral reveals', subtitle: 'shared millions of times over.' },
        { icon: 'globe', title: 'A universal question', subtitle: 'that audiences keep tuning in for.' },
      ],
      bodyHtml:
        'Watching someone learn where they truly come from has become one of the most shared moments on screen. What gets revealed is usually the same thing: multiple ancestral regions, unexpected trace origins, and a written narrative connecting them.',
      quoteHtml:
        '<em class="tst-em">You don\'t need a television crew to have that moment.</em> <b class="tst-strong">The same kind of discovery is available from your own home, with a genetic counsellor to walk you through it.</b>',
    },

    // ------------------------------------------ star treatment · then/now ----
    {
      type: 'thenNow',
      ground: 'cream',
      then: {
        icon: 'film',
        kicker: "What's often revealed",
        title: 'On screen, with a crew',
        items: [
          'Multiple ancestral regions, revealed one envelope at a time.',
          'Unexpected trace origins nobody in the family saw coming.',
          'A written narrative connecting them, read out to camera.',
        ],
      },
      now: {
        icon: 'truck',
        kicker: 'What you get',
        title: 'At home, in an envelope',
        items: [
          'The same kind of breakdown, mapped across up to 10 global regions.',
          '<b>From 42,000+ markers, in an NABL-certified lab.</b>',
          'One saliva sample, from home, with a genetic counsellor to explain it.',
        ],
      },
      closingHtml: 'What was once a television moment now fits inside an envelope, for everyone.',
      cta: { label: 'Discover My Ancestors', href: '#kit' },
    },

    // --------------------------------------------------------- the chapters ----
    // riskCards carries the four CHAPTERS of the report, not four conditions -
    // same card anatomy (image, kicker, question, body, note, sample), and the
    // sample rail is the share each chapter typically accounts for.
    {
      type: 'riskCards',
      ground: 'cream',
      head: {
        eyebrow: { label: 'The discovery layers', icon: 'book' },
        titleHtml: 'Your ancestry DNA test <em class="tst-em-teal">has four chapters.</em>',
        leadHtml: 'Here is what each one reveals, with a real sample result from an actual report.',
      },
      allLabel: 'All four',
      cards: [
        {
          key: 'primary',
          tabLabel: 'Primary',
          icon: 'search',
          image: { src: `${IMG}/chapter-primary.png`, alt: 'Primary ancestral origin' },
          imageCaption: 'Chapter 01 · The main chapter',
          geneLabel: 'Primary · The main chapter',
          question: 'What is my largest ancestral origin?',
          bodyHtml:
            'Your biggest single result: the one region you connect to most. For most Indians, this is South Asian. <b>But that one label hides a much older story underneath.</b>',
          warningHtml: 'Roots traced to some of the oldest known settlements in the region.',
          sample: { label: 'Sample result', valueHtml: '72.91% South Asian', tone: 'neutral', percent: 95 },
        },
        {
          key: 'secondary',
          tabLabel: 'Secondary',
          icon: 'compass',
          image: { src: `${IMG}/chapter-secondary.png`, alt: 'Secondary ancestral regions' },
          imageCaption: 'Chapter 02 · The surprising chapters',
          geneLabel: 'Secondary · The surprising chapters',
          question: 'What other parts of the world are in my genes?',
          bodyHtml:
            'Smaller results, usually 5% to 10% each, left behind by ancient trade routes and migrations. <b>Not errors. Real signals, still visible in your genes today.</b>',
          warningHtml: 'This is the section people talk about at family dinners.',
          sample: { label: 'Sample result', valueHtml: '7.79% Malayan', tone: 'neutral', percent: 35 },
        },
        {
          key: 'trace',
          tabLabel: 'Trace',
          icon: 'dna',
          image: { src: `${IMG}/chapter-trace.png`, alt: 'Trace ancestral origins' },
          imageCaption: 'Chapter 03 · The oldest chapters',
          geneLabel: 'Trace · The oldest chapters',
          question: 'What are the smallest, most unexpected traces?',
          bodyHtml:
            'Tiny results, usually under 2%, from populations you would never expect. <b>Some trace back to the very first humans who left Africa.</b>',
          warningHtml: 'The results most people screenshot and send to family immediately.',
          sample: { label: 'Sample result', valueHtml: '1.47% Amerindian', tone: 'neutral', percent: 10 },
        },
        {
          key: 'narrative',
          tabLabel: 'Gene Journey',
          icon: 'book',
          image: { src: `${IMG}/chapter-journey.png`, alt: 'The written Gene Journey' },
          imageCaption: 'Chapter 04 · Not a table. A story.',
          geneLabel: 'Gene Journey · Not a table. A story.',
          question: 'Do I get a written story, not just numbers?',
          bodyHtml:
            'Yes. Every report includes a written story, called your Gene Journey. Not a table, a story you can actually read. <b>The part most people share with their family first.</b>',
          warningHtml: 'Written to be read aloud at a family dinner.',
          sample: { label: 'Sample result', valueHtml: 'A written narrative', tone: 'neutral', percent: 100 },
        },
      ],
      cta: { label: 'Discover My Ancestors', href: '#kit' },
      ctaNoteHtml: '10 regions · 1 saliva sample · <b>results in 3 weeks</b>',
    },

    // ---------------------------------------------------------- the regions ----
    {
      type: 'markerGrid',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'Up to 10 global regions', icon: 'globe', accent: 'teal' },
        titleHtml: 'Your results, mapped <em class="tst-em-teal">across human history.</em>',
        leadHtml: 'Based on 42,000+ markers. Most people appear in 6 to 8 of these regions. Every result is unique.',
      },
      groups: [
        {
          kicker: 'An illustrative sample breakdown - your own will be unique to you',
          variant: 'detail',
          items: [
            {
              icon: 'map-pin',
              accent: 'crimson',
              title: 'South Asian',
              toneLabel: '~73%',
              tone: 'neutral',
              percent: 95,
              bodyHtml: 'The largest share for most Indians. Ties to the Indus Valley.',
            },
            {
              icon: 'anchor',
              title: 'Malayan',
              toneLabel: '~8%',
              tone: 'neutral',
              percent: 35,
              bodyHtml: 'Ancient sea trade with Southeast Asia.',
            },
            {
              icon: 'mountain',
              title: 'South Central Asian',
              toneLabel: '~7%',
              tone: 'neutral',
              percent: 30,
              bodyHtml: 'Migration from Central Asia, through Iran.',
            },
            {
              icon: 'landmark',
              title: 'West Caucasian',
              toneLabel: '~6%',
              tone: 'neutral',
              percent: 26,
              bodyHtml: 'From the Caucasus mountains, near Georgia.',
            },
            {
              icon: 'hourglass',
              accent: 'crimson',
              title: 'East African',
              toneLabel: '~1.6%',
              tone: 'neutral',
              percent: 10,
              bodyHtml: "One of humanity's oldest lineages.",
            },
            {
              icon: 'route',
              title: 'Armenian',
              toneLabel: '~1.5%',
              tone: 'neutral',
              percent: 9,
              bodyHtml: 'Ancient trade routes through Persia.',
            },
            {
              icon: 'compass',
              title: 'Amerindian',
              toneLabel: '~1.5%',
              tone: 'neutral',
              percent: 9,
              bodyHtml: 'A rare, surprising trace for Indians.',
            },
            {
              icon: 'wheat',
              title: 'Near Eastern',
              toneLabel: '~0.8%',
              tone: 'neutral',
              percent: 6,
              bodyHtml: 'The Fertile Crescent, birthplace of farming.',
            },
            {
              icon: 'texture',
              title: 'Oceanian',
              toneLabel: '~0.3%',
              tone: 'neutral',
              percent: 4,
              bodyHtml: 'Ancient sea travel across the Indian Ocean.',
            },
            {
              icon: 'trees',
              accent: 'crimson',
              title: 'Pygmy',
              toneLabel: '~0.3%',
              tone: 'neutral',
              percent: 4,
              bodyHtml: 'One of the oldest known human lineages.',
            },
          ],
        },
        {
          kicker: 'A note on trace percentages',
          variant: 'detail',
          items: [
            {
              icon: 'check',
              title: 'Small results are real',
              bodyHtml: 'Anything under 2% is a real signal, not an error.',
            },
            {
              icon: 'map-pin',
              title: 'A region, not a place',
              bodyHtml: 'They point to a broad region, never an exact town or village.',
            },
            {
              icon: 'users',
              title: 'Explained, not just listed',
              bodyHtml: 'Your counsellor helps you understand each one on a free call.',
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
        eyebrow: { label: "The scale of what's checked", icon: 'chart', accent: 'teal' },
        titleHtml: "This isn't a guess. It's tens of thousands of data points.",
        leadHtml: 'India is one of the most genetically mixed places on earth.',
      },
      stats: [
        {
          kicker: 'Markers checked',
          value: '42,000+',
          tone: 'java2',
          barPercent: 95,
          bodyHtml: 'genetic markers checked against populations worldwide, using the ADMIXTURE algorithm.',
        },
        {
          kicker: 'Global regions',
          value: '10',
          tone: 'java',
          barPercent: 70,
          bodyHtml: 'global regions your ancestry can be mapped across. Most Indians match 6 to 8 of them.',
        },
        {
          kicker: 'Sample to story',
          value: '3 Weeks',
          tone: 'pink',
          barPercent: 50,
          bodyHtml: 'from saliva sample to your finished Gene Journey, reviewed by a scientist first.',
        },
      ],
      closingHtml: 'Over 99% reproducibility. Test it twice, get the same result 99% of the time.',
      cta: { label: 'Discover My Ancestors', href: '#kit', variant: 'light' },
    },

    // -------------------------------------------------------------- worth ----
    {
      type: 'worth',
      ground: 'cream',
      head: {
        eyebrow: { label: "What it's really worth", icon: 'piggy' },
        titleHtml: 'The price is one evening out. <em class="tst-em-teal">What comes back is 50,000 years.</em>',
        leadHtml:
          'You will spend more than this on a dinner you will have forgotten by next week. This is the one that answers a question your family has carried for generations.',
      },
      emphasisHtml:
        '<em class="tst-em-teal">Because this was never really about a saliva sample.</em> <b class="tst-strong">It is about finally knowing who you come from, and passing that answer to everyone who comes after you.</b>',
      price: {
        badge: { label: 'One test · A story you keep for life', icon: 'award' },
        titleHtml: 'Just &#8377;____, one time.<br/>A 50,000-year story that stays in your family forever.',
        bodyHtml:
          'Your DNA never changes, so you test <b>only once</b> and the story is yours to keep, and to pass on. Free genetic counselling is included, so a real expert walks you through every part of where you come from.',
        chips: [
          { label: 'Less than one dinner out' },
          { label: 'Yours to keep for life' },
          { label: 'A gift across generations' },
        ],
        image: { src: `${IMG}/worth-family.png`, alt: 'A family sharing their Gene Journey together' },
      },
    },

    // ----------------------------------------------------------- outcomes ----
    {
      type: 'outcomes',
      ground: 'cream',
      cards: [
        {
          icon: 'search',
          kicker: 'Right now',
          title: 'The question finally has an answer',
          bodyHtml:
            'The wondering you have carried your whole life &mdash; <b>"where do I actually come from?"</b> &mdash; is answered, mapped across up to ten regions of the world.',
        },
        {
          icon: 'users',
          kicker: 'This year',
          title: 'You give your elders their story',
          bodyHtml:
            'You sit your parents and grandparents down and hand them the answer they always wondered about. <b>Some stories are worth telling while there is still someone to tell them to.</b>',
        },
        {
          icon: 'sprout',
          kicker: 'For generations',
          title: 'Your children inherit more than a surname',
          bodyHtml:
            'Long after you, your kids and their kids will know exactly where they came from. <b>You become the one who found the answer for all of them.</b>',
        },
      ],
    },

    // -------------------------------------------------------- testimonial ----
    {
      type: 'testimonial',
      ground: 'cream',
      quoteHtml: 'Finally&hellip; I know exactly <em class="tst-em-teal">where I come from.</em>',
      bodyHtml:
        'For a lifetime you may have felt a quiet gap where your full story should be. When you see the map of the people who made you, something settles: you stop wondering, and you finally feel <b>rooted, whole, and part of something far older than yourself.</b>',
      closingHtml: 'You are not paying for a test. You are bringing home 50,000 years of family you never got to meet.',
      cta: { label: 'Discover My Ancestors', href: '#kit' },
    },

    // ----------------------------------------------------- report preview ----
    {
      type: 'reportPreview',
      ground: 'sage',
      head: {
        eyebrow: { label: 'Your report', icon: 'file' },
        titleHtml: 'Not a spreadsheet. <em class="tst-em-teal">A story.</em>',
      },
      bullets: [
        'Your breakdown across up to 10 global regions, from one test.',
        'Primary, secondary and trace results, each with what it connects to.',
        'A written Gene Journey, not just numbers in a table.',
        'Your DNA never changes, so you only need to test once.',
      ],
      cta: { label: 'Get My Gene Journey', href: '#kit' },
      sample: {
        badge: 'Sample',
        title: 'Ancestors In Me · Breakdown',
        rows: [
          { label: 'South Asian', value: '72.91% · Primary', tone: 'neutral' },
          { label: 'Malayan', value: '7.79% · Secondary', tone: 'neutral' },
          { label: 'South Central Asian', value: '7.13% · Secondary', tone: 'neutral' },
          { label: 'West Caucasian', value: '6.21% · Secondary', tone: 'neutral' },
          { label: 'Amerindian', value: '1.47% · Trace', tone: 'neutral' },
        ],
        legendHtml: '<b>Primary</b> = largest share · <b>Secondary</b> = 5&ndash;10% each · <b>Trace</b> = under 2%',
      },
    },

    // -------------------------------------------------------------- steps ----
    {
      type: 'steps',
      ground: 'ivory',
      head: {
        eyebrow: { label: 'How it works', icon: 'box' },
        titleHtml: 'Five steps, from kit to Gene Journey. <em class="tst-em-teal">Three weeks, start to finish.</em>',
        leadHtml: 'No clinic. No needle. No fasting. About five minutes of your time.',
      },
      steps: [
        {
          icon: 'box',
          title: 'Order',
          bodyHtml: 'Kit arrives in 2 to 3 days. Tube, instructions and return envelope inside.',
        },
        { icon: 'droplet', title: 'Collect', bodyHtml: 'Spit into the tube at home. Five minutes, no needles.' },
        {
          icon: 'truck',
          title: 'Return',
          bodyHtml: 'Pre-paid, pre-labelled envelope. A courier collects it from your address.',
        },
        { icon: 'microscope', title: 'NABL lab', bodyHtml: '42,000+ markers read on the Illumina iScan platform.' },
        {
          icon: 'book',
          title: 'Gene Journey',
          bodyHtml: 'Delivered in 3 weeks. A story, not just a spreadsheet.',
          accent: 'crimson',
        },
      ],
      cta: { label: 'Order My Kit', href: '#kit' },
      ctaNoteHtml: 'Ships in 2 to 3 days · <b>Free counselling call after</b>',
    },

    // --------------------------------------------------------- counsellor ----
    {
      type: 'counsellor',
      ground: 'cream',
      head: {
        eyebrow: { label: 'Second Opinion · Not Google, a real expert', icon: 'users', accent: 'teal' },
        titleHtml: 'Your Gene Journey, <em class="tst-em-teal">explained by a real person.</em>',
      },
      image: { src: `${IMG}/counsellor.png`, alt: 'A KYG genetic counsellor walking through a Gene Journey' },
      points: [
        'A free 30-minute call after your results arrive, included with every report.',
        'What your biggest result means, and the migrations behind the others.',
        'What your smallest traces reveal, and how to explain it to your family.',
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
        eyebrow: { label: 'One test. A story you keep for life.', icon: 'box' },
        titleHtml: 'Everything you need, <em class="tst-em">in one box.</em>',
      },
      contents: {
        kicker: 'Ancestors In Me Kit',
        title: '10 Regions. One Story.',
        items: [
          'Your ancestry breakdown across up to 10 global regions, from 42,000+ markers',
          'At-home saliva kit, delivered &amp; picked up free',
          'A written Gene Journey story, not just numbers',
          'Free 30-minute call with a genetic counsellor',
          'NABL-certified processing · your data is never sold',
        ],
      },
      order: {
        kicker: 'One test · once in your life',
        lines: [
          'Kit at your door in <b>2 to 3 days</b>.',
          'Sample takes <b>5 minutes</b>.',
          'Gene Journey in <b>3 weeks</b>.',
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
        { statHtml: '99%+', title: 'Reproducibility', bodyHtml: 'Test it twice, get the same result 99% of the time.' },
        {
          icon: 'badge-check',
          title: 'NABL-accredited lab',
          bodyHtml: "India's highest lab standard, on the Illumina iScan platform.",
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
          q: 'How accurate is this ancestry DNA test?',
          a: '42,000+ genetic markers, over 99% accuracy on repeat testing. Every report is checked by a scientist before it reaches you.',
        },
        {
          q: 'Does an ancestry test only show Indian origin?',
          a: 'No. Most Indians match 6 to 8 world regions - India is one of the most genetically mixed places on earth.',
        },
        {
          q: 'Is an ancestry test a health test?',
          a: 'No. This test is about ancestry only. It does not check for any disease or health risk.',
        },
        {
          q: 'Can an ancestry test confirm my caste or gotra?',
          a: 'No. It shows broad world regions, not caste or village. Think continents and ancient migrations, not local identity.',
        },
        {
          q: 'Do I need to fast before an ancestry test?',
          a: 'No fasting needed. Just avoid food, drink or smoking for 30 minutes before you give the sample.',
        },
        {
          q: 'What if I have questions after my ancestry report?',
          a: 'A free 30-minute call with a genetic counsellor is included, and they explain every result in plain language.',
        },
        {
          q: 'Who can see my genetic data?',
          a: 'Only you, and the expert who reviews your report. It is never sold or shared, and your sample is destroyed after processing.',
        },
      ],
    },

    // ---------------------------------------------------------- final cta ----
    {
      type: 'finalCta',
      ground: 'ink',
      eyebrow: { label: 'Know now, not later', icon: 'zap', accent: 'teal' },
      titleHtml:
        'A family tree goes back three generations. <em class="tst-em-teal">This goes back fifty thousand years.</em>',
      chips: [
        { label: '10 regions, 1 saliva kit' },
        { label: 'Results in 3 weeks' },
        { label: 'Free counselling included' },
      ],
      cta: { label: 'Discover My Ancestors', href: '#kit' },
      noteHtml: 'At-home saliva kit · NABL certified lab · 42,000+ markers · Results in 3 weeks',
    },

    // --------------------------------------------------------- disclaimer ----
    {
      type: 'disclaimer',
      bodyHtml:
        'This test is intended for ancestry and informational purposes only. It is not a health or diagnostic test, and it does not check for any disease or health risk. Results show broad global regions and ancient migration patterns, not caste, gotra or a specific village of origin.',
    },
  ],
};
