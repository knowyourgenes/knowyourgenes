'use client';

import { useRef } from 'react';
import { useRevealOnScroll } from '@/hooks/use-scroll';
import { LandingStyles } from '../shared/ui';
import { HeroSection, NotAloneSection, WhatTheTestCoversSection, PreventiveCaseSection } from './sections-a';
import { WhatYouGetSection, DataStatsSection, BeforeAfterSection, WhoThisIsForSection } from './sections-b';
import { AtEveryAgeSection, TestimonialsSection, FomoSection, HowItWorksSection } from './sections-c';
import { TrustSection, FaqsSection, AlsoPartSection, FinalCtaSection } from './sections-d';

export default function PregnancyLoss() {
  const rootRef = useRef<HTMLDivElement>(null);
  useRevealOnScroll(rootRef, { threshold: 0.12 });

  return (
    <div ref={rootRef} className="kyg-lx relative overflow-x-clip">
      <LandingStyles />
      <main>
        <HeroSection />
        <NotAloneSection />
        <WhatTheTestCoversSection />
        <PreventiveCaseSection />
        <WhatYouGetSection />
        <DataStatsSection />
        <BeforeAfterSection />
        <WhoThisIsForSection />
        <AtEveryAgeSection />
        <TestimonialsSection />
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
