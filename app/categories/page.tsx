import type { Metadata } from 'next';
import SiteHeader from '@/components/shared/SiteHeader';
import SiteFooter from '@/components/shared/SiteFooter';
import { CATEGORIES } from '@/lib/categoriesdata';
import { CategoriesView } from '@/features/tests';

export const metadata: Metadata = {
  title: 'Test categories · KYG · Know Your Genes',
  description: 'Explore KYG genetic test categories. One at-home saliva kit per test.',
};

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <CategoriesView categories={CATEGORIES} />
      </main>
      <SiteFooter />
    </div>
  );
}
