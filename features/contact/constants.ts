// =============================================================================
// features/contact — page content
// -----------------------------------------------------------------------------
// Copy and icon ids transcribed from the Figma "Contact Us" frame (node
// 2066:1568). Icon ids are the glyph's "<y>-<x>" position in that frame, which
// is exactly what the extracted specs report — see components/ContactIcon.tsx.
// =============================================================================

import type { Channel, HeroChip, SelfServeCard } from './types';

export const CONTACT_HERO = {
  eyebrow: { label: "We're here to help", icon: '164-620' },
  /** Roman line + the teal-gradient Cormorant italic line beneath it. */
  titleTop: 'DNA Can Be Complex.',
  titleAccent: "Understanding It Shouldn't Be.",
  lead: 'Got a question about your report, test, or booking? Just reach out. A real person from the Know Your Genes team is here to help.',
} as const;

export const HERO_CHIPS: HeroChip[] = [
  { label: 'hello@kyg.in', icon: '466-430' },
  { label: 'WhatsApp support', icon: '466-586' },
  { label: 'Reviewed by our genetics team', icon: '466-780', tone: 'sea' },
];

/** Left column. The last entry is the inverted eden card in the design. */
export const CHANNELS: Channel[] = [
  {
    kicker: 'Email us',
    title: 'hello@kyg.in',
    body: 'Best for report questions and anything detailed. We read every one.',
    icon: '598-204',
    href: 'mailto:hello@kyg.in',
  },
  {
    kicker: 'WhatsApp & call',
    title: '+91 __ ____ ____',
    body: 'Quick questions and free counselling sessions happen on WhatsApp.',
    icon: '769-204',
  },
  {
    kicker: 'Our accredited lab',
    title: 'Neotech World Lab Pvt. Ltd',
    body: 'MG Road, Gurugram · NABL-accredited (ISO 15189). Where every sample is processed and reviewed.',
    icon: '941-204',
    titleSize: 'sm',
  },
  {
    kicker: 'Response',
    title: 'A real person replies',
    body: 'Not a bot, and not an automated queue. Someone from the team will get back to you.',
    icon: '1106-203',
    tone: 'inverted',
    titleSize: 'sm',
  },
];

export const FORM_COPY = {
  eyebrow: { label: 'Send a message', icon: '610-752' },
  title: 'Tell us what you need.',
  lead: "Fill this in and we'll pick it up from there. Fields marked * are required.",
  submit: 'Send message',
  /** Rendered to the right of the submit button. */
  fallbackPrefix: 'or email',
  fallbackEmail: 'hello@kyg.in',
  fallbackSuffix: 'directly',
  consentPrefix: 'I agree that Know Your Genes may use these details to respond to my message, in line with the',
  consentLinkLabel: 'Privacy Policy',
  consentLinkHref: '/privacy',
  consentSuffix: '. Your genetic data is never sold or shared.',
} as const;

export const SELF_SERVE = {
  eyebrow: { label: 'Might be quicker', icon: '1477-628' },
  title: 'Looking for something specific?',
} as const;

export const SELF_SERVE_CARDS: SelfServeCard[] = [
  {
    title: 'Read the FAQ',
    body: 'Most questions about testing, results and privacy are answered here.',
    icon: '1635-191',
    href: '/categories/wellness/womens-health#faq',
  },
  {
    title: 'How it works',
    body: 'From ordering a kit to your findings, in a few simple steps.',
    icon: '1635-475',
    href: '/categories/wellness/womens-health#how-it-works-steps',
  },
  {
    title: 'Explore the tests',
    body: "Women's Health, Eye Health, Wellness and more, built for Indian bodies.",
    icon: '1635-759',
    href: '/categories',
  },
  {
    title: 'Talk to an expert',
    body: 'Book a free counselling session to walk through your report.',
    icon: '1635-1043',
    href: 'mailto:hello@kyg.in?subject=Free%20counselling%20session',
  },
];
