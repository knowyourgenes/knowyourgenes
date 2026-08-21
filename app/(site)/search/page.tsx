import type { Metadata } from 'next';
import { SearchResultsView } from '@/features/search/components/SearchResultsView';
import { getSearchCatalog } from '@/features/search/server/search.queries';

/**
 * /search - the results page behind the header's search overlay.
 *
 * A server component that does one read and hands the whole catalogue to the
 * client island. That is deliberate at this size: nine products is far less data
 * than a single product photo, so shipping all of it once buys instant filtering
 * with no request per keystroke and no loading state. The seam to change when
 * the catalogue outgrows it is `getSearchCatalog` - paginate there, and
 * SearchResultsView keeps its shape.
 *
 * The query itself is read from the URL by the client island rather than here,
 * because every OTHER control on the page writes to the URL too and one owner
 * for that state is simpler than two.
 */
export const metadata: Metadata = {
  title: 'Search',
  description: 'Search KYG DNA tests by health concern - hair fall, PCOS, sleep, skin, ancestry and more.',
  // A filtered result set is not a page worth indexing, and there is an infinite
  // number of them. The tests themselves are indexed on their own pages.
  robots: { index: false, follow: true },
};

export default async function SearchRoute() {
  const catalog = await getSearchCatalog();
  return <SearchResultsView catalog={catalog} />;
}
