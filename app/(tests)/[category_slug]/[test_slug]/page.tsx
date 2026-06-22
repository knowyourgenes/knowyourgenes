import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allTestParams, getTest } from '@/data/tests';
import TestContent from '@/components/tests/TestContent';

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

// The shared chrome (header + sidebar + footer) lives in the category layout;
// this page renders only the report's content, so navigating between reports
// swaps just this.
export default async function TestRoute({ params }: { params: Params }) {
  const { category_slug, test_slug } = await params;
  const test = getTest(category_slug, test_slug);
  if (!test) notFound();
  return <TestContent test={test} />;
}
