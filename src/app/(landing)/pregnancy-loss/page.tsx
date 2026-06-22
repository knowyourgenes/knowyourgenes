import type { Metadata } from 'next';
import PregnancyLoss from '@/components/landing/pregnancy-loss/PregnancyLoss';

export const metadata: Metadata = {
  title: 'Recurrent Pregnancy Loss — genetic risk | Women’s Health DNA',
  description:
    'Recurrent miscarriage is often genetic, not bad luck. An at-home saliva test reads your MTHFR and FOXP3 variants so you and your doctor can act before you begin trying. Part of the 5-panel Women’s Health DNA report. NABL-accredited lab, results in 7 days.',
};

export default function PregnancyLossPage() {
  return <PregnancyLoss />;
}
