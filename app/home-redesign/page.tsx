import type { Metadata } from 'next';

import SiteFooter from '@/components/shared/SiteFooter';
import SiteHeader from '@/components/shared/SiteHeader';
import HomeV2 from '@/features/home/components/v2/HomeV2';

/**
 * Preview route for the homepage redesign while it is being built.
 *
 * It lives here rather than at `/` so the live homepage keeps working until
 * every section of the frame exists. When the build is complete this component
 * moves to app/page.tsx, the current homepage moves to /old-homepage, and this
 * route goes away.
 *
 * noindex: a half-built duplicate of the homepage must never reach search.
 */
export const metadata: Metadata = {
  title: 'Homepage redesign (preview) · Know Your Genes',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* overlay: the hero is dark and full-bleed, so the header sits on it */}
      <SiteHeader overlay />
      <main className="flex-1">
        <HomeV2 />
      </main>
      <SiteFooter />
    </div>
  );
}
