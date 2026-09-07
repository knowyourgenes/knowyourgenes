import BiggerPicture from './sections/BiggerPicture';
import BuildingFor from './sections/BuildingFor';
import FinalCta from './sections/FinalCta';
import GenesToInsight from './sections/GenesToInsight';
import Hero from './sections/Hero';
import Manifesto from './sections/Manifesto';
import NotDestiny from './sections/NotDestiny';
import OurApproach from './sections/OurApproach';
import Understandable from './sections/Understandable';
import WhatYouDo from './sections/WhatYouDo';
import WhyGenetics from './sections/WhyGenetics';
import WhyWeExist from './sections/WhyWeExist';

/**
 * The /about page body, in the Figma frame's order (343:3582).
 *
 * TWELVE sections, not the thirteen the previous frame had: the standalone
 * "Key statement" band is now folded into 04. Grounds alternate cream and sand
 * with dark at 04, 09 and 11 - the frame's own rhythm, and each section carries
 * its own `ground`.
 *
 * Six of these are interactive (a timeline, two accordions, a term translator,
 * a stepper, a persona picker), so they are client components. The page shell
 * and the hero stay on the server.
 *
 * `kyg-reveals` turns on the CSS-only appear animations - `animation-timeline:
 * view()` behind an `@supports`, reading the `data-rise` markers the shared
 * components already write. It replaces the page's old IntersectionObserver
 * wrapper, which hid every section on mount and would have left the page blank
 * if its effect never ran.
 */
export default function AboutPage() {
  return (
    <div className="kyg-reveals bg-linenw">
      <Hero />
      <WhyWeExist />
      <WhyGenetics />
      <NotDestiny />
      <Understandable />
      <GenesToInsight />
      <WhatYouDo />
      <OurApproach />
      <BuildingFor />
      <Manifesto />
      <BiggerPicture />
      <FinalCta />
    </div>
  );
}
