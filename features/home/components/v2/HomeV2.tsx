// =============================================================================
// Homepage — the redesign assembled
// -----------------------------------------------------------------------------
// Built from the Figma frame "Homepage - New UI" (node 1058:5544 in the
// KYG - Homepage UI file), 1440 x 16692.
//
// The frame also contains 01 · UTILITY BAR, 02 · HEADER / NAVIGATION and
// 16 · FOOTER. Those are deliberately NOT rebuilt — the site's existing
// SiteHeader and SiteFooter are kept, so this renders only the frame's
// `main#main` content, sections 03 through 15, in frame order.
//
// Section components are named for what they say, but the comments below keep
// the frame's own numbering so any component can be traced back to its named
// frame and its extracted spec.
// =============================================================================

import BornInIndia from './sections/BornInIndia';
import Discover from './sections/Discover';
import FinalCta from './sections/FinalCta';
import GeneousCare from './sections/GeneousCare';
import Hero from './sections/Hero';
import HowItWorks from './sections/HowItWorks';
import Journal from './sections/Journal';
import MeetGenee from './sections/MeetGenee';
import OneLifetime from './sections/OneLifetime';
import Privacy from './sections/Privacy';
import ScienceTrust from './sections/ScienceTrust';
import WhatToKnow from './sections/WhatToKnow';
import WhyGeneticTesting from './sections/WhyGeneticTesting';

export default function HomeV2() {
  return (
    <>
      {/* ---- paper grain ----------------------------------------------------
          The designer's build hangs this off `body::after` — one fixed layer of
          fractal noise at 42% under `mix-blend-mode:soft-light`, sitting over
          light and dark sections alike. It is what stops the large flat cream
          and teal fields from looking like flat digital colour.

          Scoped to this page rather than to `body`, because `body::after` would
          apply the grain to every other route on the site too. `fixed` is the
          source's own choice: the grain must NOT scroll with the content, or it
          reads as texture printed on the page instead of on the screen. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-9000 opacity-[0.42] mix-blend-soft-light [background-image:url(&quot;data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='180'%20height='180'%3E%3Cfilter%20id='n'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='.82'%20numOctaves='3'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='180'%20height='180'%20filter='url(%23n)'/%3E%3C/svg%3E&quot;)]"
      />

      <Hero /> {/* 03 */}
      <WhyGeneticTesting /> {/* 04 */}
      <Discover /> {/* 05 */}
      <OneLifetime /> {/* 06 */}
      <MeetGenee /> {/* 07 */}
      <WhatToKnow /> {/* 08 */}
      <HowItWorks /> {/* 09 */}
      <GeneousCare /> {/* 10 */}
      <ScienceTrust /> {/* 11 */}
      <Privacy /> {/* 12 */}
      <BornInIndia /> {/* 13 */}
      <Journal /> {/* 14 */}
      <FinalCta /> {/* 15 */}
    </>
  );
}
