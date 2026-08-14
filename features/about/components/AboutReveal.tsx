'use client';

import { useEffect, useRef } from 'react';
import { useRevealOnScroll } from '@/hooks/use-scroll';

/**
 * Scroll-reveal wrapper for the About page.
 *
 * Same contract as the test pages': `.reveal` is only hidden once this mounts
 * and adds `reveal-on`, so a JS failure degrades to plain visible content
 * instead of a blank page. `kyg-tests` is what scopes the reveal/animation
 * rules in globals.css - reused here rather than duplicating that block.
 *
 * threshold 0, deliberately: a fractional threshold can never be satisfied by an
 * element taller than viewportHeight/threshold, and these sections stack well
 * past that on a phone.
 */
export default function AboutReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useRevealOnScroll(ref, { threshold: 0 });

  useEffect(() => {
    ref.current?.classList.add('reveal-on');
  }, []);

  return (
    <div ref={ref} className="kyg-tests bg-linenw">
      {children}
    </div>
  );
}
