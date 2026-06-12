import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import KygHeader from '@/components/site/KygHeader';
import KygFooter from '@/components/site/KygFooter';
import { getCategory, getCategoryTests } from '../data';
import CategoryShell from '../_components/category-shell';

/**
 * Category layout — the shared chrome for every report in a category.
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
      <KygHeader />
      <CategoryShell category={category} tests={tests}>
        {children}
      </CategoryShell>
      <KygFooter />
    </>
  );
}
