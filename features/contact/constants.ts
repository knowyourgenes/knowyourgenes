import type { IconName } from '@/components/shared/kyg';

// =============================================================================
// features/contact - every word on the page, verbatim from Figma 346:1112
// -----------------------------------------------------------------------------
// Copy lives here rather than inline so the components stay layout-only and a
// wording change is one edit in one file.
// =============================================================================

export const HERO = {
  eyebrow: 'We’re here to help',
  /** Sits after the pill, past a hairline. */
  aside: 'A REAL PERSON REPLIES',
  headline: 'DNA can be complex.',
  turn: 'Understanding it shouldn’t be.',
  /** The pill floating over the photograph. */
  pill: 'A real person reads every message and replies, usually the same day',
  shelf: {
    lead: 'Got a question about your report, test, or booking? Just reach out.',
    note: 'A real person from the Know Your Genes team is here to help, not a bot, and not an automated queue.',
  },
} as const;

export const FORM_COPY = {
  eyebrow: 'Send a message',
  headline: 'Tell us what you need.',
  turn: 'We’ll pick it up from there.',
  lead: 'Fields marked * are required. Or email hello@kyg.in directly, either reaches the same team.',
  consent:
    'I agree that Know Your Genes may use these details to respond to my message, in line with the Privacy Policy. Your genetic data is never sold or shared.',
  submit: 'Send message',
} as const;

export const REACH = {
  eyebrow: 'How to reach us',
  headline: 'Three ways in.',
  turn: 'Every one of them lands with a person.',
  aside: { lead: 'A real person replies.', turn: 'Usually the same day.' },
  whatsapp: {
    kicker: 'WHATSAPP & CALL',
    number: '+91 __ ____ ____',
    body: 'Quick questions and free counselling sessions happen here. Send a message and someone picks it up, usually the same day.',
    cta: 'Open WhatsApp',
    note: 'or call the same number',
  },
} as const;

/** The two cards beside the WhatsApp panel. */
export const ROUTES: {
  icon: IconName;
  kicker: string;
  title: string;
  body: string;
  cta: string;
  ctaIcon: IconName;
  href: string;
}[] = [
  {
    icon: 'mail',
    kicker: 'EMAIL US',
    title: 'hello@kyg.in',
    body: 'Best for report questions and anything detailed. We read every one.',
    cta: 'Copy address',
    ctaIcon: 'copy',
    href: 'mailto:hello@kyg.in',
  },
  {
    icon: 'flask',
    kicker: 'OUR ACCREDITED LAB',
    title: 'Neotech World Lab',
    body: 'MG Road, Gurugram · NABL-accredited (ISO 15189).',
    cta: 'Get directions',
    ctaIcon: 'pin',
    href: 'https://maps.google.com/?q=Neotech+World+Lab+MG+Road+Gurugram',
  },
];

export const QUICKER = {
  eyebrow: 'Might be quicker',
  headline: 'Looking for something specific?',
  turn: 'Start here.',
  aside: { lead: 'Four quick routes.', turn: 'No form required.' },
} as const;

/** Two columns of two. The design splits them 1-2 / 3-4. */
export const SHORTCUTS: { icon: IconName; title: string; body: string; href: string }[] = [
  {
    icon: 'help',
    title: 'Read the FAQ',
    body: 'Most questions about testing, results and privacy are answered here.',
    href: '/about#faq',
  },
  {
    icon: 'route',
    title: 'How it works',
    body: 'From ordering a kit to your findings, in a few simple steps.',
    href: '/#how-it-works',
  },
  {
    icon: 'dna',
    title: 'Explore the tests',
    body: 'Women’s Health, Eye Health, Wellness and more, built for Indian bodies.',
    href: '/categories',
  },
  {
    icon: 'messages',
    title: 'Talk to an expert',
    body: 'Book a free counselling session to walk through your report.',
    href: '/contact#send-a-message',
  },
];
