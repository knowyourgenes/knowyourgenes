'use client';

import { useEffect, useRef } from 'react';
import { LandingStyles } from '../_shared/ui';
import LandingNav, { type NavLink } from '../_shared/nav';
import LandingFooter from '../_shared/footer';
import { HeroSection, TrustBand, NotAloneSection, WhatIsPCOSSection } from './sections-a';
import { WhyTestSection, WhatYouGetSection, DataStatsSection, BeforeAfterSection } from './sections-b';
import { TestimonialsSection, AtEveryAgeSection, FomoSection, HowItWorksSection } from './sections-c';
import { TrustSection, FaqsSection, AlsoPartSection, FinalCtaSection } from './sections-d';
import KygHeader from '@/components/site/KygHeader';

const NAV_LINKS: NavLink[] = [
  { label: 'What PCOS is', href: '#what' },
  { label: 'Why test', href: '#why' },
  { label: 'The report', href: '#report' },
  { label: 'How it works', href: '#how' },
  { label: 'FAQs', href: '#faqs' },
];

/** Adds `is-in` to `.reveal` / `.reveal-r` elements as they enter the viewport. */
function useRevealOnScroll(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll('.reveal, .reveal-r'));
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootRef]);
}

export default function WomensHealth() {
  const rootRef = useRef<HTMLDivElement>(null);
  useRevealOnScroll(rootRef);

  return (
    <div ref={rootRef} className="kyg-lx relative overflow-x-clip">
      <LandingStyles />
      {/* <LandingNav links={NAV_LINKS} /> */}
      <KygHeader />
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
      <LandingFooter />
    </div>
  );
}
