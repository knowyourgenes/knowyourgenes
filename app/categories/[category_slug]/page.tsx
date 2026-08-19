import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/shared/SiteHeader';
import SiteFooter from '@/components/shared/SiteFooter';
import { CATEGORIES, getCategory } from '@/lib/categoriesdata';
import { CategoryDetailView } from '@/features/tests';

type Params = Promise<{ category_slug: string }>;

// No caching directive on purpose. The cards carry live price and stock, and
// this route already renders per request because the root layout reads the
// session - so prices are always current. If the app is ever made statically
// renderable, add `revalidate` here, and remember the cart and checkout
// re-price from the database anyway, so a stale card can never mis-bill.

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category_slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category_slug } = await params;
  const category = getCategory(category_slug);
  if (!category) return {};
  return {
    title: `${category.name} · KYG · Know Your Genes`,
    description: category.blurb,
  };
}

export default async function CategoryDetailPage({ params }: { params: Params }) {
  const { category_slug } = await params;
  const category = getCategory(category_slug);
  if (!category) notFound();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <CategoryDetailView category={category} />
      </main>
      <SiteFooter />
    </div>
  );
}
