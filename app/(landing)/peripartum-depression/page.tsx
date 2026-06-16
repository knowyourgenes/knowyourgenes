import type { Metadata } from 'next';
import { Figtree, Hind } from 'next/font/google';
import PeripartumDepression from '@/components/(landing)/peripartum-depression/PeripartumDepression';

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
  title: 'Peripartum Depression - genetic risk | Women’s Health DNA',
  description:
    'Postpartum depression is not a weakness, it is often biology. An at-home saliva test reads your COMT gene variant so you and your doctor can prepare before birth, not react after. Part of the 5-panel Women’s Health DNA report. NABL-accredited lab, results in 7 days.',
};

export default function PeripartumDepressionPage() {
  return (
    <div className={`${figtree.variable} ${hind.variable}`}>
      <PeripartumDepression />
    </div>
  );
}
