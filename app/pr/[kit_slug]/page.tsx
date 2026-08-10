import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/shared/SiteHeader';
import SiteFooter from '@/components/shared/SiteFooter';
import { ProductKitPage, getProductKit, PRODUCT_KIT_SLUGS } from '@/features/products';

// Product URLs live under a dedicated /pr segment, e.g. /pr/genetic-testing-kit,
// so adding kits never collides with other top-level routes. Every slug in the
// data file is prerendered; anything else 404s.
export const dynamicParams = false;

type Params = Promise<{ kit_slug: string }>;

export function generateStaticParams() {
  return PRODUCT_KIT_SLUGS.map((kit_slug) => ({ kit_slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { kit_slug } = await params;
  const kit = getProductKit(kit_slug);
  if (!kit) return {};
  return { title: kit.seo.title, description: kit.seo.description };
}

export default async function ProductKitRoute({ params }: { params: Params }) {
  const { kit_slug } = await params;
  const kit = getProductKit(kit_slug);
  if (!kit) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-linenw">
      <SiteHeader />
      <main className="min-w-0 flex-1">
        <ProductKitPage kit={kit} />
      </main>
      <SiteFooter />
    </div>
  );
}
