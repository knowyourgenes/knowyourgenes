'use client';

import { useEffect, useRef } from 'react';
import { useRevealOnScroll } from '@/hooks/use-scroll';

/**
 * Owns the scroll-reveal observer for a test page.
 *
 * Keeping it separate from <TestPageView/> is what lets every section stay a
 * server component: `children` is already-rendered RSC output passed through,
 * so no section markup ships as JavaScript. Only this wrapper hydrates.
 *
 * Two deliberate details:
 *
 *  • `.reveal` is only hidden while the root carries `reveal-on`, and that class
 *    is added HERE on mount. If JavaScript never runs, nothing is hidden and the
 *    page reads normally — the reference build hides unconditionally, which
 *    blanks the page when its script fails.
 *  • siblings inside a block are staggered by writing `data-rd`, which the
 *    observer copies into `--rd` (the transition-delay) as each one enters.
 */
const STAGGER_STEP = 0.07; // seconds between siblings, as in the reference build
const STAGGER_MAX = 6;

export default function RevealRoot({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // threshold 0, NOT the reference build's 0.12: its `.reveal` targets are small
  // blocks, ours are whole sections. A section that stacks past ~5,500px on a
  // phone can never show 12% of itself, and would stay invisible for good.
  useRevealOnScroll(ref, { threshold: 0 });

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.classList.add('reveal-on');

    // Stagger only where the author has not already set a delay.
    for (const group of root.querySelectorAll<HTMLElement>('[data-reveal-group]')) {
      const kids = Array.from(group.children) as HTMLElement[];
      kids.forEach((k, i) => {
        if (!k.classList.contains('reveal') || k.dataset.rd) return;
        k.dataset.rd = `${Math.min(i, STAGGER_MAX) * STAGGER_STEP}s`;
      });
    }
  }, []);

  return <div ref={ref}>{children}</div>;
}
