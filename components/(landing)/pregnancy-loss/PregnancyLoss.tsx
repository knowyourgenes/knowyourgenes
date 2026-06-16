'use client';

import { useEffect, useRef } from 'react';
import { LandingStyles } from '../_shared/ui';
import LandingNav, { type NavLink } from '../_shared/nav';
import LandingFooter from '../_shared/footer';
import { HeroSection, NotAloneSection, WhatTheTestCoversSection, PreventiveCaseSection } from './sections-a';
import { WhatYouGetSection, DataStatsSection, BeforeAfterSection, WhoThisIsForSection } from './sections-b';
import { AtEveryAgeSection, TestimonialsSection, FomoSection, HowItWorksSection } from './sections-c';
import { TrustSection, FaqsSection, AlsoPartSection, FinalCtaSection } from './sections-d';
import KygHeader from '@/components/site/KygHeader';

const NAV_LINKS: NavLink[] = [
  { label: 'The two genes', href: '#covers' },
  { label: 'Why test early', href: '#why' },
  { label: 'The report', href: '#report' },
  { label: 'Is it for me', href: '#who' },
  { label: 'FAQs', href: '#faqs' },
];

const FOOTER_LEARN = ['The two genes', 'Why test early', 'Sample report', 'FAQs'];

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

export default function PregnancyLoss() {
  const rootRef = useRef<HTMLDivElement>(null);
  useRevealOnScroll(rootRef);

  return (
    <div ref={rootRef} className="kyg-lx relative overflow-x-clip">
      <LandingStyles />
      {/* <LandingNav links={NAV_LINKS} cta={{ label: 'Know my risk', tone: 'eden' }} /> */}
      <KygHeader />
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
      <LandingFooter bg="#15201E" learn={FOOTER_LEARN} />
    </div>
  );
}
