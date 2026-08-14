import BiggerPicture from './sections/BiggerPicture';
import BuildingFor from './sections/BuildingFor';
import FinalCta from './sections/FinalCta';
import GenesToInsight from './sections/GenesToInsight';
import Hero from './sections/Hero';
import KeyStatement from './sections/KeyStatement';
import Manifesto from './sections/Manifesto';
import NotDestiny from './sections/NotDestiny';
import OurApproach from './sections/OurApproach';
import Understandable from './sections/Understandable';
import WhatYouDo from './sections/WhatYouDo';
import WhyGenetics from './sections/WhyGenetics';
import WhyWeExist from './sections/WhyWeExist';
import AboutReveal from './AboutReveal';

/**
 * The /about page body, in the Figma frame's order.
 *
 * Unlike a test page this is a SINGLETON, so there is no section-array data
 * model: each section owns its own copy. A generic renderer would be
 * indirection with exactly one caller.
 *
 * The route lives under app/(site)/, so SiteHeader/SiteFooter wrap this. The
 * frame draws its own header and footer, but those are ordinary site chrome.
 */
export default function AboutPage() {
  return (
    <AboutReveal>
      <Hero />
      <WhyWeExist />
      <WhyGenetics />
      <NotDestiny />
      <KeyStatement />
      <Understandable />
      <GenesToInsight />
      <WhatYouDo />
      <OurApproach />
      <BuildingFor />
      <Manifesto />
      <BiggerPicture />
      <FinalCta />
    </AboutReveal>
  );
}
