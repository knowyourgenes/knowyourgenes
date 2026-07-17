import type { Metadata } from 'next';
import DummyHomepage from '@/features/home/components/DummyHomepage';
import SiteHeader from '@/components/shared/SiteHeader';
import SiteFooter from '@/components/shared/SiteFooter';

export const metadata: Metadata = {
  title: 'KYG - Homepage (Draft) · Know Your Genes',
  description:
    'Draft homepage built from KYG_Homepage.docx: four equal-weight product lines (My Wellness, Women’s Health, Men’s Health, Ancestors In Me), one saliva kit each, results in 7 days.',
};

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <DummyHomepage />
      </main>
      <SiteFooter />
    </div>
  );
}
