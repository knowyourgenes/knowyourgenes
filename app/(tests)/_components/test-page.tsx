'use client';

import { useRef, useState, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import KygHeader from '@/components/site/KygHeader';
import KygFooter from '@/components/site/KygFooter';
import { type Category, type Test } from '../data';
import { useRevealOnScroll, useScrollSpy } from '../_hooks';
import PageStyles from './styles';
import ReportSidebar from './report-sidebar';
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

/** Client root for a single test page. Wraps the warm KYG report body in the
 *  shared site chrome (SiteHeader / SiteFooter) so every page across the site
 *  shares the same header and footer. Owns the report rail's collapse state,
 *  scroll-spy and reveal-on-scroll, and composes the data-driven sections. */
export default function TestPage({ category, test }: { category: Category; test: Test }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useRevealOnScroll(rootRef);
  const panelIds = test.discover.panels.map((p) => p.id);
  const [activePanel] = useScrollSpy(panelIds, panelIds[0]);

  // Per-category accent, applied as CSS variables the utilities read via var().
  const accentStyle = {
    '--acc-50': category.accent.c50,
    '--acc-100': category.accent.c100,
    '--acc-500': category.accent.c500,
    '--acc-700': category.accent.c700,
  } as CSSProperties;

  return (
    <>
      <KygHeader />

      <div ref={rootRef} className="kyg-test" style={accentStyle}>
        <PageStyles />

        <div className={cn('flex min-h-screen max-w-[1280px] mx-auto relative max-[980px]:block')}>
          <ReportSidebar
            category={category}
            sidebar={test.sidebar}
            panels={test.discover.panels}
            activePanel={activePanel}
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed((c) => !c)}
          />

          <main className="flex-1 min-w-0 p-[clamp(28px,3vw,52px)_clamp(24px,3.4vw,60px)_90px] max-[980px]:p-[clamp(24px,5vw,40px)_var(--gutter)_110px]">
            <div className="max-w-[940px]">
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
            </div>
          </main>
        </div>

        <BuyBar label={test.hero.ctaLabel} />
      </div>

      <KygFooter />
    </>
  );
}
