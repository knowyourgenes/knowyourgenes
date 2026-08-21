// =============================================================================
// features/home/v3 - the /homepage redesign
// -----------------------------------------------------------------------------
// Composition only.
//
// TWO SECTIONS ARE v3's OWN - the hero and WhyGeneticTesting. Everything else
// is the v2 stack, the same components `/` renders, imported rather than
// copied so the shared eleven cannot drift apart section by section.
//
// THE RULE FOR CHANGING ANYTHING ON THIS ROUTE: if the change is meant for
// /homepage alone, it goes in a file under `./sections/`. Editing anything
// under `../v2/` edits the live homepage too - eleven of these thirteen
// imports point straight at it. WhyGeneticTesting was forked for exactly that
// reason: its ladder and its spacing were reworked for /homepage, and / keeps
// the section it shipped with, untouched.
//
// v3's own Trust / ShopByGoal / Reports / HowItWorks / FinalCta still exist in
// `./sections/Sections.tsx`, now unreferenced. They are kept rather than
// deleted because they are the other half of the comparison and cost nothing
// while nothing imports them - Next.js will not bundle a module no route pulls
// in. Delete the file when the hero question is settled.
//
// Most of the v2 sections are server components; `WhatToKnow` and `HowItWorks`
// carry their own `'use client'` and ship as client bundles either way.
// =============================================================================

import BornInIndia from '../v2/sections/BornInIndia';
import Discover from '../v2/sections/Discover';
import FinalCta from '../v2/sections/FinalCta';
import GeneousCare from '../v2/sections/GeneousCare';
import HowItWorks from '../v2/sections/HowItWorks';
import Journal from '../v2/sections/Journal';
import MeetGenee from '../v2/sections/MeetGenee';
import OneLifetime from '../v2/sections/OneLifetime';
import Privacy from '../v2/sections/Privacy';
import ScienceTrust from '../v2/sections/ScienceTrust';
import WhatToKnow from '../v2/sections/WhatToKnow';
import Hero from './sections/Hero';
import WhyGeneticTesting from './sections/WhyGeneticTesting';

export default function HomeV3() {
  return (
    <>
      {/* ---- paper grain ----------------------------------------------------
          Carried over from HomeV2 with the sections, because it is not a
          decoration on them - it is the reason the large flat cream and teal
          fields below do not read as flat digital colour. Dropping it here
          would make the same components look different on this route, which is
          the one thing a hero experiment must not do.

          Scoped to the page rather than hung off `body::after` (the designer's
          own build does the latter), so the grain does not leak onto every
          other route. `fixed` is deliberate: it must NOT scroll with the
          content, or it reads as texture printed on the page rather than on the
          screen. It covers the hero too, exactly as it does on `/`. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-9000 opacity-[0.42] mix-blend-soft-light [background-image:url(&quot;data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='180'%20height='180'%3E%3Cfilter%20id='n'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='.82'%20numOctaves='3'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='180'%20height='180'%20filter='url(%23n)'/%3E%3C/svg%3E&quot;)]"
      />
      <Hero /> {/* 03 · v3 */}
      <WhyGeneticTesting /> {/* 04 · v3 */}
      {/* ---- v2, sections 05 through 15, in frame order --------------------
          The hero's "How It Works" CTA targets `#how-it-works`, which v2's
          HowItWorks carries - the anchor survives the swap. */}
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
