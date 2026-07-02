import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/shared/SiteHeader';
import SiteFooter from '@/components/shared/SiteFooter';
import { TEST_PAGES, getTestPage } from '@/lib/testsdata';
import { TestPageView } from '@/features/tests';

type Params = Promise<{ category_slug: string; test_slug: string }>;

/** Prerender one page per test declared in lib/testsdata.ts. */
export function generateStaticParams() {
  return TEST_PAGES.map((t) => ({ category_slug: t.categorySlug, test_slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { test_slug } = await params;
  const test = getTestPage(test_slug);
  if (!test) return {};
  return { title: test.seo.title, description: test.seo.description };
}

// Every page uses the global navbar (SiteHeader) + footer; the test design's own
// bundles sidebar and content render below it.
export default async function TestDetailRoute({ params }: { params: Params }) {
  const { category_slug, test_slug } = await params;
  const test = getTestPage(test_slug);
  if (!test || test.categorySlug !== category_slug) notFound();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <TestPageView test={test} />
      </main>
      <SiteFooter />
    </div>
  );
}
