'use client';

import { useRef } from 'react';
import type { Test } from '@/data/tests';
import { useRevealOnScroll } from '@/hooks/use-scroll';
import {
  ActionPlan,
  BottomCta,
  Bundles,
  BuyBar,
  Discover,
  Divider,
  Expertise,
  Faq,
  Hero,
  HowItWorks,
  MidCta,
  Myth,
  Report,
} from './sections';

/**
 * The report's content sections — everything inside <main>. Rendered by the
 * page (not the layout), so navigating between sibling reports swaps only this
 * while the shared header/sidebar/footer stay mounted. Re-mounts per report, so
 * reveal-on-scroll re-runs for the new content.
 */
export default function TestContent({ test }: { test: Test }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useRevealOnScroll(rootRef);

  return (
    <div ref={rootRef} className="w-full">
      <Hero hero={test.hero} />
      <Divider />
      <Myth myth={test.myth} />
      <Discover discover={test.discover} />
      <MidCta text={test.midCta1.text} ctaLabel={test.midCta1.ctaLabel} />
      <Report report={test.report} />
      <Expertise expertise={test.expertise} />
      <ActionPlan actionPlan={test.actionPlan} />
      <MidCta text={test.midCta2.text} ctaLabel={test.midCta2.ctaLabel} />
      <HowItWorks howItWorks={test.howItWorks} />
      <Faq faq={test.faq} />
      <Bundles items={test.bundlesSection.items} />
      <BottomCta cta={test.bottomCta} />
      <BuyBar label={test.hero.ctaLabel} />
    </div>
  );
}
