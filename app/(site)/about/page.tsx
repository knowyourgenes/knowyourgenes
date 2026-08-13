import type { Metadata } from 'next';
import AboutPage from '@/features/about/components/AboutPage';
import { absoluteUrl } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'About us',
  description:
    'Healthcare should not start only when something goes wrong. Know Your Genes brings genetic insight into everyday health — making complex information easier to understand and prevention more personal.',
  alternates: { canonical: absoluteUrl('/about') },
  openGraph: {
    title: 'About Know Your Genes',
    description: 'Health without guesswork. Genetics as information, not prediction.',
    url: absoluteUrl('/about'),
    type: 'website',
  },
};

export default function AboutRoute() {
  return <AboutPage />;
}
