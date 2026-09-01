import type { Metadata } from 'next';

import { NewHomepage } from '@/features/home';

/**
 * /newhomepage - the homepage with the design's latest pass, for review.
 *
 * It sits in the (site) group, so it takes the shared chrome from
 * app/(site)/layout.tsx - the SAME SiteHeader and SiteFooter the live homepage
 * renders, and the same sticky (not overlay) header the inset hero needs.
 *
 * `noindex`, deliberately: this is a staging surface for one design review, and
 * a second crawlable copy of the homepage is a duplicate-content problem the
 * day it ships rather than the day anyone notices.
 */
export const metadata: Metadata = {
  title: 'Homepage (design review)',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <NewHomepage />;
}
