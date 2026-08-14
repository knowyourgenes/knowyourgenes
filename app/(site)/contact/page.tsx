import type { Metadata } from 'next';
import ContactPage from '@/features/contact/components/ContactPage';
import { absoluteUrl } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Contact us',
  description:
    'Questions about your report, a test, or a booking? Email hello@kyg.in, message us on WhatsApp, or send the Know Your Genes team a note - a real person replies.',
  alternates: { canonical: absoluteUrl('/contact') },
  openGraph: {
    title: 'Contact Know Your Genes',
    description: 'DNA can be complex. Understanding it shouldn’t be. Talk to a real person on the KYG team.',
    url: absoluteUrl('/contact'),
    type: 'website',
  },
};

export default function ContactRoute() {
  return <ContactPage />;
}
