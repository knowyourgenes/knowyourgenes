import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/shared/SiteHeader';
import SiteFooter from '@/components/shared/SiteFooter';
import { CATEGORIES, getCategory } from '@/lib/categoriesdata';
import { CategoryDetailView } from '@/features/tests';

type Params = Promise<{ category_slug: string }>;

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
