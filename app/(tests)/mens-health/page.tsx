import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTestPage } from '@/lib/testsdata';
import { TestPageView } from '@/features/tests';

const SLUG = 'mens-health';

export function generateMetadata(): Metadata {
  const test = getTestPage(SLUG);
  if (!test) return {};
  return { title: test.seo.title, description: test.seo.description };
}

// The Men's Health design is fully self-contained (its own sticky nav, bundles
// sidebar and final CTA), so this route intentionally sits as a static segment
// beside [category_slug] and does NOT inherit the category chrome.
export default function MensHealthTestRoute() {
  const test = getTestPage(SLUG);
  if (!test) notFound();
  return <TestPageView test={test} />;
}
