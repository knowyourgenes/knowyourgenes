import type { Metadata } from 'next';
import { Figtree, Hind } from 'next/font/google';
import WomensHealth from '@/components/(landing)/womens-health/WomensHealth';

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-figtree',
  display: 'swap',
});

const hind = Hind({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-hind',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Is your PCOS genetic? — Women's Health DNA",
  description:
    '1 in 5 Indian women has PCOS. An at-home saliva test reads your THADA gene variant so you can stop guessing and start managing. Part of the 5-panel Women’s Health DNA report. NABL-accredited lab, results in 7 days.',
};

export default function WomensHealthPage() {
  return (
    <div className={`${figtree.variable} ${hind.variable}`}>
      <WomensHealth />
    </div>
  );
}
