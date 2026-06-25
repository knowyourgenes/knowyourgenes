import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/shared/SiteHeader';
import SiteFooter from '@/components/shared/SiteFooter';
import { getCategory, getCategoryTests } from '@/features/catalog/data/tests';
import CategoryShell from '@/features/catalog/components/CategoryShell';

/**
 * Category layout - the shared chrome for every report in a category.
 * Because it's a layout, Next.js preserves it across navigation between sibling
 * reports (it "does not rerender"); only the [test_slug] page swaps. The header,
 * sidebar and footer therefore stay mounted while the content changes.
 */
export default async function CategoryLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ category_slug: string }>;
}) {
  const { category_slug } = await params;
  const category = getCategory(category_slug);
  if (!category) notFound();

  const tests = getCategoryTests(category_slug);

  return (
    <>
      <SiteHeader />
      <CategoryShell category={category} tests={tests}>
        {children}
      </CategoryShell>
      <SiteFooter />
    </>
  );
}
