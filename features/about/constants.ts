import type { IconName } from '@/components/shared/kyg';

// =============================================================================
// features/about - every word on the page, verbatim from Figma 343:3582
// -----------------------------------------------------------------------------
// Copy lives here so the sections stay layout-only and a wording change is one
// edit in one file. `turn` is the cursive second line each headline drops to.
//
// This frame is the SECOND pass. The earlier one had 13 sections with a
// standalone "Key statement" band; that band is now folded into 04, and six
// sections became interactive (a timeline, two accordions, a term translator,
// a stepper, a persona picker).
// =============================================================================

export const HERO = {
  eyebrow: 'About Know Your Genes',
  aside: 'HEALTH WITHOUT GUESSWORK',
  headline: 'Healthcare shouldn’t start only when',
  turn: 'something goes wrong.',
  pill: 'Health, understood earlier not after something breaks',
  shelf: {
    lead: 'We believe knowing more about your body earlier can help you make better decisions later.',
    note: 'Know Your Genes brings genetic insights into everyday health, making complex information easier to understand and prevention more personal.',
  },
  ctas: {
    primary: { label: 'Explore Genetic Testing', href: '/categories' },
    secondary: { label: 'See how it works', href: '/#how-it-works' },
  },
} as const;

// -- 02 ----------------------------------------------------------------------

export interface TimelinePoint {
  n: string;
  label: string;
  when: string;
  headline: string;
  body: string;
}

export const WHY_WE_EXIST = {
  eyebrow: 'Why we exist',
  headline: 'We usually look for answers',
  turn: 'after a health problem shows up.',
  quote: {
    lead: 'Health doesn’t suddenly begin when a symptom appears.',
    turn: 'Our story begins earlier than that.',
  },
  zones: { before: 'Before anything feels wrong', after: 'After a health problem shows up' },
  flags: { ours: 'Our story starts here', theirs: 'Most people start here' },
  /** The point the design opens on - the symptom, index 2. */
  initial: 2,
  points: [
    {
      n: '01',
      label: 'Birth',
      when: 'Day one',
      headline: 'You already have the information.',
      body: 'Every variation that shapes how your body responds is present from the start. None of it is visible, and none of it is doing anything yet.',
    },
    {
      n: '02',
      label: 'Quiet changes',
      when: 'Years pass',
      headline: 'Nothing feels different.',
      body: 'Tendencies begin to express themselves slowly, in ways no one is looking for, because there is no reason yet to look.',
    },
    {
      n: '03',
      label: 'A symptom',
      when: 'One day',
      headline: 'Something feels wrong.',
      body: 'This is usually the first time anyone looks. Health suddenly has a start date, but it began long before.',
    },
    {
      n: '04',
      label: 'A test',
      when: 'Weeks later',
      headline: 'Now we measure.',
      body: 'A test describes what is happening today. It is a snapshot, taken after the fact, of a story that started much earlier.',
    },
    {
      n: '05',
      label: 'Searching for answers',
      when: 'Months later',
      headline: 'Why did this happen?',
      body: 'The search for an explanation begins here - at the end of the timeline, working backwards, with the least information.',
    },
  ] as TimelinePoint[],
  kyg: {
    kicker: 'What changes with KYG',
    body: 'Instead of a surprise, a symptom becomes something you half expected, and prepared for.',
  },
  foot: 'The challenge is that many of the changes leading to a symptom aren’t obvious. Some of the information that can help is already in your genes.',
  hint: 'Click any point on the timeline, or use Next.',
} as const;

// -- 03 ----------------------------------------------------------------------

export const WHY_GENETICS = {
  eyebrow: 'Why genetics',
  headline: 'Your body comes with information.',
  body: 'Most of us never get to read it. Genetic testing gives you a way to explore the patterns in it, so the more you understand, the better questions you can ask.',
  cta: { label: 'Explore Genetic Testing', href: '/categories' },
  trio: [
    { text: 'Not to tell you exactly what will happen.', lifted: false },
    { text: 'Not to put a label on your future.', lifted: false },
    { text: 'But to give you another layer of information about yourself.', lifted: true },
  ],
  /** The ladder, as an accordion. The design opens on the first. */
  rows: [
    {
      n: '01',
      title: 'Genes',
      body: 'Your genes contain variations that can influence how your body responds to different aspects of health, nutrition, fitness and lifestyle.',
    },
    {
      n: '02',
      title: 'Genetic patterns',
      body: 'Those variations cluster into patterns. A pattern is not a diagnosis - it is a tendency, one input among several.',
    },
    {
      n: '03',
      title: 'Personal context',
      body: 'A pattern only means something next to your life: what you eat, where you live, what you have already been through.',
    },
    {
      n: '04',
      title: 'Better questions',
      body: 'With context, the question stops being "am I at risk?" and becomes "what is worth paying attention to, and when?"',
    },
    {
      n: '05',
      title: 'Better decisions',
      body: 'Better questions are what change a decision. That is the whole chain, and the only part of it you control is the end.',
    },
  ],
  chain: ['Genes', 'Genetic patterns', 'Personal context', 'Better questions', 'Better decisions'],
} as const;

// -- 04 ----------------------------------------------------------------------

export const NOT_DESTINY = {
  eyebrow: 'Genes ≠ Destiny',
  headline: 'Your genes aren’t your fate.',
  turn: 'They’re part of the picture.',
  quote: 'Your lifestyle, environment and choices matter too. Nothing here is already written.',
  equation: [
    { n: '01', term: 'Genes', why: 'The layer you are born with. It sets tendencies, not outcomes.' },
    { n: '02', term: 'Lifestyle', why: 'What you do repeatedly. The input with the most day-to-day leverage.' },
    { n: '03', term: 'Environment', why: 'Where you live and work, and what that exposes you to over years.' },
    { n: '04', term: 'Choices', why: 'The decisions you make once you know. This is the part that is yours.' },
  ],
  result: { kicker: 'Your', title: 'Health journey' },
  hint: 'Hover any part of the equation to see why it matters.',
  intend: {
    kicker: 'What we intend',
    chips: ['Give you context.', 'Give you awareness.', 'Give you a better starting point.'],
  },
  band: {
    left: 'Information',
    right: 'Destiny',
    lead: 'Knowing something about yourself is not the same as being told what happens next.',
    body: 'That’s why we don’t believe genetic testing should create fear or make you feel like your future is already written. We believe it should do the opposite.',
    cta: { label: 'Explore Genetic Testing', href: '/categories' },
  },
} as const;

// -- 05 ----------------------------------------------------------------------

export const UNDERSTANDABLE = {
  eyebrow: 'Making genetics understandable',
  headline: 'Your genes are complicated.',
  turn: 'Your report doesn’t have to be.',
  lead: 'We translate genomics into plain language, without losing what matters.',
  body: 'Genomics can get technical very quickly. Every KYG report is written so a curious person can read it end to end: what was found, what it tends to mean, and what is worth doing about it.',
  pills: ['No intimidating jargon.', 'No verdicts about your future.', 'Just clearer questions and better decisions.'],
  cta: { label: 'See a sample report', href: '/categories' },
  hint: 'Tap a term to see how we say it.',
  panel: { science: 'What the science says', read: 'What you read' },
  /** Each jargon term and the plain sentence we print instead. */
  terms: [
    {
      term: 'Genes',
      plain: 'The instruction manual your body came with.',
      example: {
        title: 'Vitamin D',
        tag: 'Watch · easy fix',
        body: 'Your body may need a little more help getting enough of it.',
      },
    },
    {
      term: 'Variants',
      plain: 'The small spelling differences that make you, you.',
      example: {
        title: 'Lactose',
        tag: 'Good to know',
        body: 'You may handle dairy differently from the people around you.',
      },
    },
    {
      term: 'Markers',
      plain: 'The specific places we look, and why we look there.',
      example: {
        title: 'Iron',
        tag: 'Watch · easy fix',
        body: 'Worth checking with a blood test rather than guessing.',
      },
    },
    {
      term: 'Probabilities',
      plain: 'How likely something is - never whether it will happen.',
      example: { title: 'Tendency', tag: 'Context', body: 'Higher than average is still not the same as likely.' },
    },
    {
      term: 'Risk factors',
      plain: 'The things worth paying attention to, in plain order.',
      example: { title: 'Prevention', tag: 'Act early', body: 'Knowing sooner is the only part of this you control.' },
    },
  ],
} as const;

// -- 06 ----------------------------------------------------------------------

export const GENES_TO_INSIGHT = {
  eyebrow: 'From genes to insight',
  headline: 'It starts with something simple:',
  turn: 'your genes.',
  lead: 'Three steps between a swab and a conversation. Lab-powered science, human-readable results.',
  cta: { label: 'Find your test', href: '/categories' },
  steps: [
    {
      n: '01',
      title: 'Simple DNA sample',
      body: 'A simple DNA sample gives us the starting point. No needles, no clinic visit, just a swab at home.',
    },
    {
      n: '02',
      title: 'Genetic analysis',
      body: 'Your genetic information is analysed in an accredited lab to identify the variations that are relevant to the report you chose.',
    },
    {
      n: '03',
      title: 'Making sense of the findings',
      body: 'The findings are translated into understandable insights across the areas of health and wellness your report covers.',
    },
  ],
  lab: {
    name: 'GENEous Lab',
    note: 'Trusted testing partner · NABL-accredited',
    chain: ['Genes', 'Data', 'Insight', 'Awareness'],
  },
} as const;

// -- 07 ----------------------------------------------------------------------

export const WHAT_YOU_DO = {
  eyebrow: 'What do you do with it',
  headline: 'A result is not the end.',
  turn: 'It is the start of a question.',
  lead: 'Getting a report is one thing. Knowing what it means for you is another. Here are the questions it tends to raise, and where each one leads.',
  flow: ['Result', 'Question', 'Conversation', 'Awareness', 'Informed choice'],
  rows: [
    {
      q: 'Could this explain something I’ve always wondered about?',
      a: 'Sometimes a pattern in your report gives a name to something you have felt for years. That is a question worth taking further.',
      leads: 'Question',
    },
    {
      q: 'What should I discuss with my doctor or health professional?',
      a: 'A report is most useful in a conversation. Bring the finding, not the conclusion, and let a clinician place it against everything else they know about you.',
      leads: 'Conversation',
    },
    {
      q: 'Should I pay more attention to this part of my lifestyle?',
      a: 'Often the answer is a small, permanent adjustment rather than a dramatic one - and knowing which part to adjust is the whole value.',
      leads: 'Awareness',
    },
    {
      q: 'Is there something I can do differently?',
      a: 'This is the only question that changes anything. Everything before it exists to make this one easier to answer well.',
      leads: 'Informed choice',
    },
  ],
  foot: 'Having information is useful. Knowing what it means is better.',
  cta: { label: 'Talk to our team', href: '/contact' },
} as const;

// -- 08 ----------------------------------------------------------------------

export const OUR_APPROACH = {
  eyebrow: 'Our approach',
  headline: 'Advice is written for an average body.',
  turn: 'Nobody actually has one.',
  aside: 'General guidance has its place. It just isn’t yours.',
  principles: [
    {
      n: '01',
      title: 'Personal',
      lead: 'Your genes are unique to you. So is the way we read them.',
      body: 'Two people can get the same result and need very different conversations. We write for the person, not the population.',
    },
    {
      n: '02',
      title: 'Clear',
      lead: 'Complex genetic information should be understandable.',
      body: 'If a sentence needs a genetics degree to parse, it has failed. Every report is written to be read once, by someone who is not a specialist.',
    },
    {
      n: '03',
      title: 'Responsible',
      lead: 'Genetic insights should inform, not frighten or dictate.',
      body: 'A tendency is not a verdict. We say what was found, what it tends to mean, and where the limits of that are - and we stop there.',
    },
    {
      n: '04',
      title: 'Preventive',
      lead: 'The earlier you understand a tendency, the earlier you can ask better questions.',
      body: 'Prevention is not a promise that nothing will go wrong. It is having the conversation before you are forced to have it.',
    },
  ],
  note: 'Personal. Clear. Responsible. Preventive. The four words every report is measured against.',
  foot: { lead: 'Your health is personal.', turn: 'Your approach should be too.' },
} as const;

// -- 09 ----------------------------------------------------------------------

export const BUILDING_FOR = {
  eyebrow: 'Who we’re building for',
  headline: 'For the person who wants',
  turn: 'to know more.',
  lead: 'Four kinds of curiosity. Choose the one that sounds most like you.',
  personas: [
    {
      title: 'The Curious',
      question: 'What do my genes actually say about me?',
      body: 'Maybe you’ve always been curious about what your genes say about you.',
      markers: ['Ancestry', 'Inherited traits', 'Origins'],
    },
    {
      title: 'The Proactive',
      question: 'What should I be doing differently, starting now?',
      body: 'Maybe you’re trying to make smarter lifestyle choices.',
      markers: ['Diet', 'Fitness', 'Weight'],
    },
    {
      title: 'The Health-Conscious',
      question: 'What do my routine checks not tell me?',
      body: 'Maybe you’re looking beyond routine health checks.',
      markers: ['Micronutrients', 'Immunity', 'Sleep'],
    },
    {
      title: 'The Informed',
      question: 'Why wait for something to go wrong first?',
      body: 'Maybe you simply believe that waiting for something to go wrong isn’t the only way to think about health.',
      markers: ['Prevention', 'Family history', 'Screening'],
    },
  ],
  foot: 'Different questions. One simple starting point: know more.',
  cta: { label: 'Explore Genetic Testing', href: '/categories' },
} as const;

// -- 10 ----------------------------------------------------------------------

export const MANIFESTO = {
  eyebrow: 'What we believe',
  headline: 'Four things we hold ourselves to.',
  body: 'We don’t believe in predicting your future. We believe in helping you understand your present a little better.',
  hint: 'Hover a belief to read why.',
  beliefs: [
    {
      n: '01',
      title: 'Your genes don’t decide who you become.',
      why: 'They set tendencies. What you do with them is the part that decides anything.',
    },
    {
      n: '02',
      title: 'Genetic information should inform, not frighten.',
      why: 'Fear makes people stop reading. A report nobody finishes has helped nobody.',
    },
    {
      n: '03',
      title: 'Complex information should be understandable.',
      why: 'Clarity is not simplification. It is the work of saying the true thing plainly.',
    },
    {
      n: '04',
      title: 'Prevention can mean knowing more before you need to react.',
      why: 'The earliest useful moment is almost always before anything feels wrong.',
    },
  ],
} as const;

// -- 11 ----------------------------------------------------------------------

export const BIGGER_PICTURE = {
  eyebrow: 'The bigger picture',
  headline: 'From “What’s wrong with me?”',
  turn: 'to “What should I do about it?”',
  lead: 'Healthcare is becoming more personal, and more preventive. Genetics is a big part of that shift.',
  eras: [
    { when: 'Then', what: 'Reactive healthcare' },
    { when: 'Now', what: 'Personalized health' },
    { when: 'Next', what: 'Preventive health' },
  ],
  /** The era the design highlights. */
  activeEra: 1,
  reveal: 'Understand what is true for your body, not the average one.',
  not: {
    kicker: 'Not this',
    items: ['Not by making genetics sound complicated.', 'Not by telling people what their future will look like.'],
  },
  but: {
    kicker: 'But this',
    items: ['By making it understandable.', 'By helping them understand the information they already carry.'],
  },
  foot: { lead: 'We want to make that conversation', turn: 'easier to enter.' },
} as const;

// -- 12 ----------------------------------------------------------------------

export const START_WITH_KNOWING = {
  eyebrow: 'Start with knowing',
  headline: 'Your health story is already being written.',
  turn: 'You can choose to understand it.',
  ctas: {
    primary: { label: 'Explore Genetic Testing', href: '/categories' },
    secondary: { label: 'Talk to our team', href: '/contact' },
  },
  note: {
    lead: 'You can’t rewrite your genes. But you can choose to understand them.',
    body: 'And sometimes, knowing a little more about yourself can change the questions you ask, the conversations you have, and the choices you make next.',
  },
  chain: ['Genes', 'Information', 'Insight', 'Awareness'],
} as const;

/** The glyph each persona option carries, from the shared Icon set. */
export const PERSONA_ICONS: IconName[] = ['search', 'route', 'shield', 'book'];
