'use client';

import { useRef } from 'react';
import { useRevealOnScroll } from '@/hooks/use-scroll';
import { LandingStyles } from '../shared/ui';
import { HeroSection, WhatNobodySection, ComtGeneSection, IndiaProblemSection, NotAloneSection } from './sections-a';
import {
  WhatYouGetSection,
  WhatKnowingChangesSection,
  DataStatsSection,
  BeforeAfterSection,
  WhoThisIsForSection,
  AtEveryAgeSection,
} from './sections-b';
import { TestimonialsSection, FomoSection, HowItWorksSection } from './sections-c';
import { TrustSection, FaqsSection, AlsoPartSection, FinalCtaSection } from './sections-d';

export default function PeripartumDepression() {
  const rootRef = useRef<HTMLDivElement>(null);
  useRevealOnScroll(rootRef, { threshold: 0.12 });

  return (
    <div ref={rootRef} className="kyg-lx relative overflow-x-clip">
      <LandingStyles />
      <main>
        <HeroSection />
        <WhatNobodySection />
        <ComtGeneSection />
        <IndiaProblemSection />
        <NotAloneSection />
        <WhatYouGetSection />
        <WhatKnowingChangesSection />
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
