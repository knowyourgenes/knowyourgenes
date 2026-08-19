import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteFooter from '@/components/shared/SiteFooter';
import SiteHeader from '@/components/shared/SiteHeader';
import { TEST_PAGES, getTestPage } from '@/lib/testsdata';
import { TestPageView } from '@/features/tests';
import { getKitPricing } from '@/features/products/server/kit-pricing';

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

// Test pages use the GLOBAL site chrome, same as every other public page. The
// Figma frame draws its own header and footer, but those are ordinary site
// chrome rather than anything page-specific, and a third bespoke copy is exactly
// the duplication this repo already suffers from. `nav` and `footer` remain
// valid section variants (see features/tests/types.ts) - this page just does not
// use them, so nothing here doubles up.
//
// This mirrors app/(site)/layout.tsx rather than importing it: the route lives
// outside the (site) group, because /categories is not in it.
export default async function TestDetailRoute({ params }: { params: Params }) {
  const { category_slug, test_slug } = await params;
  const test = getTestPage(test_slug);
  if (!test || test.categorySlug !== category_slug) notFound();

  // The kit section shows this report's price before handing over to the kit
  // page, where it arrives pre-ticked.
  const pricing = await getKitPricing(test_slug);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <TestPageView test={test} pricing={pricing} />
      </main>
      <SiteFooter />
    </div>
  );
}
