import type { Metadata } from 'next';
import SiteFooter from '@/components/shared/SiteFooter';
import SiteHeader from '@/components/shared/SiteHeader';
import HomeV2 from '@/features/home/components/v2/HomeV2';

/**
 * /homepage - the previous homepage, kept reachable after v3 took over `/`.
 *
 * The two routes were swapped: `/` now renders HomeV3, and this route holds
 * HomeV2, which `/` shipped with. Holding it here keeps the comparison alive -
 * eleven of v3's thirteen sections ARE these components, so whatever the two
 * routes differ on is the hero and WhyGeneticTesting, and nothing else.
 *
 * `overlay` travels with v2 and must not be dropped: its hero is a dark,
 * full-bleed gradient the bar is meant to float on, and the hero's top padding
 * is sized to clear those 64 fixed pixels. Switch to sticky and a cream row
 * appears above a hero that has already paid for the space.
 *
 * NOINDEX IS NOT OPTIONAL. This is a near-complete duplicate of `/` - same
 * eleven sections, same copy. Left indexable the two would compete for the
 * site's own brand terms, which is the textbook way to cannibalise a homepage.
 */
export const metadata: Metadata = {
  title: 'Homepage (previous version)',
  robots: { index: false, follow: false },
};

export default function HomepageRoute() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader overlay />
      <main className="flex-1">
        <HomeV2 />
      </main>
      <SiteFooter />
    </div>
  );
}
