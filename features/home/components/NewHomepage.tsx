import { KYG_HOME_VARS } from './sections/tokens';
import Hero from './sections/Hero';
import TrustMarquee from './sections/TrustMarquee';
import WhyKyg from './sections/WhyKyg';
import WhatIsKyg from './sections/WhatIsKyg';
import WellnessPackages from './sections/WellnessPackages';
import Tests from './sections/Tests';
import ReportPreview from './sections/ReportPreview';
import GeneousCare from './sections/GeneousCare';
import HowItWorks from './sections/HowItWorks';
import WhoIsThisFor from './sections/WhoIsThisFor';
import SeniorCare from './sections/SeniorCare';
import HealthDecoded from './sections/HealthDecoded';
import TrustPrivacy from './sections/TrustPrivacy';
import Movement from './sections/Movement';
import FinalCta from './sections/FinalCta';

/**
 * Rebuilt homepage - one pure-Tailwind component per section, no scoped
 * stylesheet and no scroll-driven JS animations. Rendered at /new-homepage for
 * testing before it replaces the legacy Homepage at /.
 *
 * Design tokens are applied once here (KYG_HOME_VARS); every section consumes
 * them via Tailwind arbitrary utilities like `bg-(--c-teal)` / `text-(--ink-1)`.
 */
export default function NewHomepage() {
  return (
    <div style={KYG_HOME_VARS} className="relative overflow-x-hidden bg-(--c-cream) text-(--ink-1)">
      <Hero />
      <TrustMarquee />
      <WhyKyg />
      <WhatIsKyg />
      <WellnessPackages />
      <Tests />
      <ReportPreview />
      <GeneousCare />
      <HowItWorks />
      <WhoIsThisFor />
      <SeniorCare />
      <HealthDecoded />
      <TrustPrivacy />
      <Movement />
      <FinalCta />
    </div>
  );
}
