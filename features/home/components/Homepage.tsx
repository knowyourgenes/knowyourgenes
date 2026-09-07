// =============================================================================
// features/home - the homepage
// -----------------------------------------------------------------------------
// Composition only. Every decision that could vary between sections has been
// pulled out into components/shared/kyg:
//
//   Section       the shell - ground, rail and the ONE vertical rhythm
//   SectionTitle  the eyebrow pill, the two-voice heading, the aside alignment
//   Button        the four skins over the site-wide 44px box
//   Rule          the tapered hairline
//   Icon          the glyph set, inline so it inherits currentColor
//
// THIS IS THE DESIGN'S LATEST PASS, promoted from what was /newhomepage. That
// route existed so the new pass could be reviewed beside the live page; it has
// been signed off, so the twin is gone and this is the only homepage again.
// `NewHomepage.tsx` and `OneLifetime.tsx` were deleted with it - two homepages
// is the exact condition the earlier v1/v2/v3 collapse existed to end, and a
// staging twin becomes a second thing to keep in step the moment it outlives
// its review.
//
// The props below are the design's asks, kept EXPLICIT at the call site rather
// than folded into each section's defaults. They read as a manifest of what
// this page wants, and every one of them names something the section can also
// do without - which is worth being able to see in one place:
//
//   04  OneLifetimeCurve   five stations on a rising curve - a shape change,
//                          not a detail, which is why it is a different
//                          component rather than a prop
//   05  plate="wide"       the character plate is 455x396, not 9:10
//   06  eyebrowTone        the teal pill, not the ink one
//   06  pinned             the six directions are walked by page-scroll
//   07  pinned             the step track fills and glows as you scroll it
//   08  flowArrows         arrows between Result / Context / … / Next step
//   11  designPlacement    the design's own head row, columns and chip box.
//                          No chevrons and no hover pairing: the map is
//                          atmosphere, its points blink on their own, and
//                          line 01 is highlighted as the design draws it
//   02/03/05/10  hoverTint the cell under the cursor takes `mist` (#E2F1ED)
//   09  hoverTint          a java2 wash - see the note in ScienceTrust for why
//                          the dark grounds do not take the pale one
//
// GROUNDS ALTERNATE ON PURPOSE. cream -> sand -> ink and back, so no two
// adjacent sections share a fill and the page has a visible beat. If you add a
// section, take the ground its neighbours leave free.
//
// `kyg-reveals` turns on the page's appear animations - see the block of the
// same name at the end of app/globals.css. The markers it reads are written by
// Eyebrow / Heading / Lead unconditionally and do nothing outside this wrapper.
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
import OneLifetimeCurve from './sections/OneLifetimeCurve';
import Privacy from './sections/Privacy';
import ScienceTrust from './sections/ScienceTrust';
import WhyGeneticTesting from './sections/WhyGeneticTesting';

export default function Homepage() {
  return (
    <div className="kyg-reveals">
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
      <WhyGeneticTesting hoverTint /> {/* cream */}
      <Discover hoverTint /> {/* sand  */}
      <OneLifetimeCurve /> {/* ink   */}
      <MeetGenee plate="wide" hoverTint /> {/* cream */}
      <ExploreKyg eyebrowTone="teal" pinned /> {/* ink   */}
      <HowItWorks pinned /> {/* cream */}
      <GeneousCare flowArrows /> {/* sand  */}
      <ScienceTrust hoverTint /> {/* ink   */}
      <Certifications /> {/* cream */}
      <Privacy hoverTint /> {/* sand  */}
      <BornInIndia designPlacement /> {/* ink   */}
      <Journal /> {/* cream */}
      <FinalCta /> {/* sand  */}
    </div>
  );
}
