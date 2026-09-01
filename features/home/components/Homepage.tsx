// =============================================================================
// features/home - the homepage
// -----------------------------------------------------------------------------
// Composition only. Every decision that could vary between sections has been
// pulled out into `./ui`:
//
//   Section       the shell - ground, rail and the ONE vertical rhythm
//   SectionTitle  the eyebrow pill, the two-voice heading, the aside alignment
//   Button        the four skins over the site-wide 44px box
//   Rule          the tapered hairline
//   Icon          the glyph set, inline so it inherits currentColor
//
// This replaces v1, v2 and v3, which were three parallel homepages: v3 rendered
// its own hero over eleven of v2's sections, v1 sat unreferenced behind
// /home-redesign, and each had re-derived its own grounds, paddings and type
// scale from its own Figma frame. Editing any shared section meant checking
// which of the three routes it was live on.
//
// GROUNDS ALTERNATE ON PURPOSE. cream -> sand -> ink and back, so no two
// adjacent sections share a fill and the page has a visible beat. If you add a
// section, take the ground its neighbours leave free.
// =============================================================================

import BornInIndia from './sections/BornInIndia';
import Certifications from './sections/Certifications';
import Discover from './sections/Discover';
import ExploreKyg from './sections/ExploreKyg';
import FinalCta from './sections/FinalCta';
import GeneousCare from './sections/GeneousCare';
import Hero from './sections/Hero';
import HowItWorks from './sections/HowItWorks';
import Journal from './sections/Journal';
import MeetGenee from './sections/MeetGenee';
import OneLifetime from './sections/OneLifetime';
import Privacy from './sections/Privacy';
import ScienceTrust from './sections/ScienceTrust';
import WhyGeneticTesting from './sections/WhyGeneticTesting';

export default function Homepage() {
  return (
    <>
      {/* Paper grain. Not decoration on the sections - it is the reason the
          large flat cream and teal fields below do not read as flat digital
          colour. `fixed` is deliberate: it must NOT scroll with the content, or
          it reads as texture printed on the page rather than on the screen.
          Scoped here rather than on body::after so it cannot leak onto other
          routes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-9000 opacity-[0.42] mix-blend-soft-light [background-image:url(&quot;data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='180'%20height='180'%3E%3Cfilter%20id='n'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='.82'%20numOctaves='3'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='180'%20height='180'%20filter='url(%23n)'/%3E%3C/svg%3E&quot;)]"
      />
      <Hero />
      <WhyGeneticTesting /> {/* cream */}
      <Discover /> {/* sand  */}
      <OneLifetime /> {/* ink   */}
      <MeetGenee /> {/* cream */}
      <ExploreKyg /> {/* ink   */}
      <HowItWorks /> {/* cream */}
      <GeneousCare /> {/* sand  */}
      <ScienceTrust /> {/* ink   */}
      <Certifications /> {/* cream */}
      <Privacy /> {/* sand  */}
      <BornInIndia /> {/* ink   */}
      <Journal /> {/* cream */}
      <FinalCta /> {/* sand  */}
    </>
  );
}
