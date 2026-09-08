import FinalCta from '@/features/home/components/sections/FinalCta';
import Journal from '@/features/home/components/sections/Journal';

import ContactHero from './ContactHero';
import HowToReachUs from './HowToReachUs';
import MightBeQuicker from './MightBeQuicker';
import SendMessage from './SendMessage';

/**
 * /contact - Figma 346:1112 ("06 · Contact — 1024").
 *
 * The route lives under app/(site)/, so SiteHeader and SiteFooter come from
 * that layout. The frame draws both, but they are ordinary site chrome rather
 * than anything this page owns.
 *
 * THE LAST TWO SECTIONS ARE THE HOMEPAGE'S, not copies of them. The frame
 * draws The Journal and the Final CTA identically to the homepage's 12 and 13 -
 * same seven-card rail at the same 224.71 pitch, same couplet, same two CTAs -
 * so this renders those components rather than a second implementation that
 * would have to be kept in step by hand.
 *
 * GROUNDS ALTERNATE, as they do on the homepage: cream, sand, ink, cream,
 * sand. If a section is added, it takes the ground its neighbours leave free.
 */
export default function ContactPage() {
  return (
    /* `kyg-reveals` turns on the page's appear animations - the same CSS-only
       `animation-timeline: view()` block the homepage, /about, /blog and
       /categories already run. This page was the only rebuilt one still
       without it, so its sections simply appeared. The markers it reads are
       written by Eyebrow / Heading / Lead unconditionally. */
    <div className="kyg-reveals">
      <ContactHero />
      <SendMessage /> {/* cream */}
      <HowToReachUs /> {/* sand  */}
      <MightBeQuicker /> {/* ink   */}
      <Journal /> {/* cream */}
      <FinalCta /> {/* sand  */}
    </div>
  );
}
