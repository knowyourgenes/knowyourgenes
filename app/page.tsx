import SiteFooter from '@/components/shared/SiteFooter';
import SiteHeader from '@/components/shared/SiteHeader';
import HomeV3 from '@/features/home/components/v3/HomeV3';

/**
 * The homepage.
 *
 * Renders HomeV3 - the v3 hero and WhyGeneticTesting over the shared v2 stack.
 * The previous homepage (HomeV2) has moved to /homepage; the two routes swapping
 * is the whole of this change. /home-redesign still holds v1, the pre-v2 design.
 *
 * SiteHeader is DEFAULT (sticky), not `overlay`, and that has to stay with v3.
 * v3's hero is an inset card that sizes itself against `--site-header-h`, so it
 * needs the bar to reserve its own row. Run overlay, and the bar - whose ground
 * is a translucent cream - floats on the hero footage and reads as a grey wash
 * over the video rather than as chrome. See v3/sections/Hero.
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
        <HomeV3 />
      </main>
      <SiteFooter />
    </div>
  );
}
