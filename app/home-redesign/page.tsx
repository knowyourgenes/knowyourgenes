import type { Metadata } from 'next';

import SiteFooter from '@/components/shared/SiteFooter';
import SiteHeader from '@/components/shared/SiteHeader';
import HomePage from '@/features/home/components/Homepage';

/**
 * The PREVIOUS homepage, kept reachable after the redesign took over `/`.
 *
 * The two routes were swapped: `/` now renders the redesign
 * (`features/home/components/v2`), and this route holds what used to be there.
 * The path name is now a misnomer - it says "redesign" but serves the old
 * design - and it is kept only so the swap is a single reversible commit. Once
 * the new homepage has settled, this route and
 * `features/home/components/Homepage` should both be deleted rather than
 * renamed; the file is 7,400 lines and carries its own copy of the design
 * system.
 *
 * NOINDEX IS NOT OPTIONAL HERE. This page is a near-complete duplicate of `/`
 * in subject and keywords. Left indexable it would compete with the real
 * homepage for the site's own brand terms, which is the textbook way to
 * cannibalise a homepage's ranking. The flag moved here from `/` as part of the
 * swap - it must NOT have been left behind on the live homepage.
 */
export const metadata: Metadata = {
  title: 'Previous homepage (archived)',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* overlay: the old hero is also dark and full-bleed */}
      <SiteHeader overlay />
      <main className="flex-1">
        <HomePage />
      </main>
      <SiteFooter />
    </div>
  );
}
