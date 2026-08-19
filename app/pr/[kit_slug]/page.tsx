import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/shared/SiteHeader';
import SiteFooter from '@/components/shared/SiteFooter';
import { ProductKitPage, getProductKit, PRODUCT_KIT_SLUGS } from '@/features/products';
import { getSelectableReports, getKitShippingFee } from '@/features/products/server/reports';

// Product URLs live under a dedicated /pr segment, e.g. /pr/genetic-testing-kit,
// so adding kits never collides with other top-level routes. Every slug in the
// data file is prerendered; anything else 404s.
export const dynamicParams = false;

// Renders per request: the report list carries live price and stock, and
// ?select= differs per visitor arriving from a test page.
export const dynamic = 'force-dynamic';

type Params = Promise<{ kit_slug: string }>;
type Search = Promise<{ select?: string | string[] }>;

export function generateStaticParams() {
  return PRODUCT_KIT_SLUGS.map((kit_slug) => ({ kit_slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { kit_slug } = await params;
  const kit = getProductKit(kit_slug);
  if (!kit) return {};
  return { title: kit.seo.title, description: kit.seo.description };
}

/** `?select=sleep&select=skin-health` or `?select=sleep,skin-health`. */
function parseSelect(raw: string | string[] | undefined): string[] {
  if (!raw) return [];
  return (Array.isArray(raw) ? raw : [raw])
    .flatMap((v) => v.split(','))
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function ProductKitRoute({ params, searchParams }: { params: Params; searchParams: Search }) {
  const { kit_slug } = await params;
  const kit = getProductKit(kit_slug);
  if (!kit) notFound();

  const [reports, shippingFee, search] = await Promise.all([getSelectableReports(), getKitShippingFee(), searchParams]);

  return (
    <div className="flex min-h-screen flex-col bg-linenw">
      <SiteHeader />
      <main className="min-w-0 flex-1">
        <ProductKitPage kit={kit} reports={reports} preselect={parseSelect(search.select)} shippingFee={shippingFee} />
      </main>
      <SiteFooter />
    </div>
  );
}
