import type { Metadata } from 'next';
import WomensHealth from '@/features/landing/components/womens-health/WomensHealth';

export const metadata: Metadata = {
  title: "Is your PCOS genetic? - Women's Health DNA",
  description:
    '1 in 5 Indian women has PCOS. An at-home saliva test reads your THADA gene variant so you can stop guessing and start managing. Part of the 5-panel Women’s Health DNA report. NABL-accredited lab, results in 7 days.',
};

export default function WomensHealthPage() {
  return <WomensHealth />;
}
