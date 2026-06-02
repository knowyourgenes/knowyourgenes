import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allTestParams, getCategory, getTest } from '../../data';
import TestPage from '../../_components/test-page';

type Params = Promise<{ category_slug: string; test_slug: string }>;

/** Prerender one static page per (category, test) declared in data.ts. */
export function generateStaticParams() {
  return allTestParams();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category_slug, test_slug } = await params;
  const test = getTest(category_slug, test_slug);
  if (!test) return {};
  return {
    title: test.seo.title,
    description: test.seo.description,
  };
}

export default async function TestRoute({ params }: { params: Params }) {
  const { category_slug, test_slug } = await params;
  const category = getCategory(category_slug);
  const test = getTest(category_slug, test_slug);
  if (!category || !test) notFound();
  return <TestPage category={category} test={test} />;
}
