'use client';

import { useEffect, useRef } from 'react';

/**
 * Fixed reading-progress bar across the top of a test page.
 *
 * Ported from the reference build: 3px tall, teal → java → crimson, with a java
 * glow. Two details from that implementation are load-bearing:
 *
 *   • the scroll handler is rAF-throttled behind a `ticking` flag, so a fast
 *     wheel cannot queue more work than a frame can drain;
 *   • it writes `width` on an element that is `position: fixed` and nothing
 *     else, so the paint stays off the main document flow.
 *
 * `passive: true` keeps the listener out of the scroll-blocking path.
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const st = window.scrollY || document.documentElement.scrollTop;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        el.style.width = `${h > 0 ? (st / h) * 100 : 0}%`;
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] h-[3px] w-0 bg-[linear-gradient(90deg,#0e4d4b,#25b5ab_60%,#c73c70)] shadow-[0_0_10px_rgba(37,181,171,0.5)] transition-[width] duration-100 ease-linear"
    />
  );
}
