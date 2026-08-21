import type { Metadata } from 'next';
import SiteFooter from '@/components/shared/SiteFooter';
import SiteHeader from '@/components/shared/SiteHeader';
import HomeV3 from '@/features/home/components/v3/HomeV3';

/**
 * /homepage - the hero experiment.
 *
 * This is `/` with ONE section swapped. HomeV3 renders its own hero and then
 * the v2 stack - the same components `/` renders, imported rather than copied.
 * Holding everything below the fold constant is the point: whatever the two
 * routes measure differently is the hero, and nothing else.
 *
 * Promote it by pointing `app/page.tsx` at HomeV3. (`/home-redesign` is v1, the
 * pre-v2 homepage, still parked on its own route.)
 *
 * SiteHeader is left in its default `sticky` mode: it reserves its own row and
 * the hero begins BELOW it. It used to run `overlay` (fixed, reserving nothing),
 * which floated the bar on top of the hero card - and because the bar's ground is
 * a translucent cream, that read as a grey band washed over the footage rather
 * than as chrome. Sticky also lets the card be inset on all four sides.
 *
 * The card sizes itself against `--site-header-h`, so it fills exactly the
 * viewport the bar leaves behind. See the note in v3/sections/Hero.
 */
export const metadata: Metadata = {
  title: 'DNA tests at home, read in plain language',
  description:
    'One at-home saliva kit, NABL-certified labs, and a report written in plain language. At-home collection across Delhi NCR.',
};

export default function HomepageRoute() {
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
