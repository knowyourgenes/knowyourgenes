'use client';

import { useRef } from 'react';
import { useRevealOnScroll } from '@/hooks/use-scroll';
import { LandingStyles } from '../shared/ui';
import { HeroSection, TrustBand, NotAloneSection, WhatIsPCOSSection } from './sections-a';
import { WhyTestSection, WhatYouGetSection, DataStatsSection, BeforeAfterSection } from './sections-b';
import { TestimonialsSection, AtEveryAgeSection, FomoSection, HowItWorksSection } from './sections-c';
import { TrustSection, FaqsSection, AlsoPartSection, FinalCtaSection } from './sections-d';

export default function WomensHealth() {
  const rootRef = useRef<HTMLDivElement>(null);
  useRevealOnScroll(rootRef, { threshold: 0.12 });

  return (
    <div ref={rootRef} className="kyg-lx relative overflow-x-clip">
      <LandingStyles />
      <main>
        <HeroSection />
        <TrustBand />
        <NotAloneSection />
        <WhatIsPCOSSection />
        <WhyTestSection />
        <WhatYouGetSection />
        <DataStatsSection />
        <BeforeAfterSection />
        <TestimonialsSection />
        <AtEveryAgeSection />
        <FomoSection />
        <HowItWorksSection />
        <TrustSection />
        <FaqsSection />
        <AlsoPartSection />
        <FinalCtaSection />
      </main>
    </div>
  );
}
