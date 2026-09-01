// =============================================================================
// features/home - the homepage, as the design currently draws it
// -----------------------------------------------------------------------------
// This is `Homepage` with the design's most recent pass applied. It exists as a
// SECOND COMPOSITION rather than as an edit to the first so /newhomepage can be
// reviewed beside the live / before anything is switched over.
//
// It is a composition and nothing else: every section below is the SAME
// component the live page renders, and the differences are passed as props. The
// one exception is section 04, where the design changed shape rather than
// detail and a flat grid cannot be propped into a curve.
//
//   04  OneLifetimeCurve   REPLACES OneLifetime - five stations on a rising
//                          curve, which is what the design draws again
//   05  plate="wide"       the character plate is 455x396, not 9:10
//   06  eyebrowTone        the teal pill, not the ink one
//   07  pinned             the step track fills and glows as you scroll it
//   08  flowArrows         arrows between Result / Context / … / Next step
//   11  chevrons+linkedMap trailing chevron, and hovering a line lights its
//                          own point on the map; nothing selected at rest
//   02/03/05/10  hoverTint the cell under the cursor takes `mist` (#E2F1ED)
//   09  hoverTint        a java2 wash - see the note in ScienceTrust for why the
//                          dark grounds do not take the pale one
//   06  pinned             the six directions are walked by page-scroll
//
// The `kyg-reveals` wrapper turns on the page's appear animations - see the
// block of the same name at the end of app/globals.css. The markers it reads
// are written by Eyebrow / Heading / Lead unconditionally and do nothing
// outside this wrapper, so / is unaffected.
//
// WHEN THIS IS SIGNED OFF, this file should not survive as a twin. Fold the
// props into the sections as their defaults, point Homepage at
// OneLifetimeCurve, and delete both this file and OneLifetime - two homepages
// is the exact condition the v1/v2/v3 collapse existed to end.
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

export default function NewHomepage() {
  return (
    <div className="kyg-reveals">
      {/* The same paper grain as Homepage - see the note there for why it is
          fixed rather than scrolled, and why it is scoped to the page. */}
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
      <BornInIndia chevrons linkedMap designPlacement /> {/* ink   */}
      <Journal /> {/* cream */}
      <FinalCta /> {/* sand  */}
    </div>
  );
}
