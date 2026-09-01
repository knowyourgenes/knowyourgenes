import SiteFooter from '@/components/shared/SiteFooter';
import SiteHeader from '@/components/shared/SiteHeader';
import { Homepage } from '@/features/home';

/**
 * The homepage.
 *
 * Renders the single `Homepage` composition from features/home. There is no
 * longer a v1/v2/v3 split: the three parallel builds were collapsed into one set
 * of sections over the shared primitives in `features/home/components/ui`, and
 * /home-redesign, /homepage, /new-homepage and /dummy-homepage were deleted
 * along with them.
 *
 * SiteHeader is DEFAULT (sticky), not `overlay`, and that has to stay. The hero
 * is an inset card that sizes itself against `--site-header-h`, so it needs the
 * bar to reserve its own row. Run overlay and the bar - whose ground is a
 * translucent cream - floats on the hero footage and reads as a grey wash over
 * the video rather than as chrome.
 *
 * NO `metadata` export, deliberately: `/` inherits the root layout's site-level
 * title and description. A page-level block would shadow them, and the root's
 * `template: '%s | Know Your Genes'` would then repeat the brand name.
 */
export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Homepage />
      </main>
      <SiteFooter />
    </div>
  );
}
