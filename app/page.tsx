import SiteFooter from '@/components/shared/SiteFooter';
import SiteHeader from '@/components/shared/SiteHeader';
import HomeV2 from '@/features/home/components/v2/HomeV2';

/**
 * The homepage.
 *
 * This now renders the redesign (`features/home/components/v2`), built against
 * the designer's own HTML build. The previous homepage
 * (`features/home/components/Homepage`) has moved to /home-redesign, which the
 * two routes swapping is the whole of this change.
 *
 * NO `metadata` export here, deliberately: `/` inherits the root layout's title
 * and description, which are the site-level ones. Adding a page-level metadata
 * block would shadow them with something narrower, and the root layout's
 * `template: '%s | Know Your Genes'` would then double the brand name.
 *
 * `overlay` makes SiteHeader `fixed` so it floats over the hero's full-bleed
 * dark gradient rather than reserving a cream row above it. The hero's top
 * padding is sized to clear those 64px - see the note in v2/sections/Hero.tsx.
 */
export default function Page() {
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
