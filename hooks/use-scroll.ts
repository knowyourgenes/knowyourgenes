'use client';

import { useEffect, useState, type RefObject } from 'react';

/** Adds an `is-in` class to `.reveal` / `.reveal-r` elements as they scroll into
 *  view (one-shot). The reveal transitions themselves live in the scoped
 *  stylesheet (components/tests/styles.tsx). */
/**
 * NOTE ON `threshold`: a fractional threshold is a trap for tall targets. It
 * requires that fraction of the ELEMENT to be on screen, so anything taller than
 * `viewportHeight / threshold` can never satisfy it — at 0.12 on a 667px phone
 * that is any element over ~5,560px, which a stacked section easily exceeds. Such
 * an element would stay at opacity:0 permanently.
 *
 * So the default is 0: fire as soon as any part intersects. The reveal is then
 * timed entirely by `rootMargin`, which is independent of element height.
 */
export function useRevealOnScroll(
  rootRef: RefObject<HTMLElement | null>,
  { threshold = 0 }: { threshold?: number } = {}
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (typeof IntersectionObserver === 'undefined') {
      root.querySelectorAll('.reveal, .reveal-r').forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            // `data-rd` staggers siblings: the value is copied into `--rd`,
            // which the .reveal rule reads as its transition-delay.
            const rd = e.target.getAttribute('data-rd');
            if (rd) (e.target as HTMLElement).style.setProperty('--rd', rd);
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );
    root.querySelectorAll('.reveal, .reveal-r').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootRef, threshold]);
}

/** Tracks which panel section is currently in the reading zone (sidebar spy). */
export function useScrollSpy(ids: string[], fallback?: string) {
  const key = ids.join(',');
  const [active, setActive] = useState(fallback ?? ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!els.length || typeof IntersectionObserver === 'undefined') return;
    const spy = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
    );
    els.forEach((el) => spy.observe(el));
    return () => spy.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return [active, setActive] as const;
}

/** Smooth-scrolls to an in-page anchor, offsetting for the sticky SiteHeader. */
export function scrollToHashWithOffset(id: string, offset = 64 + 16) {
  const target = document.getElementById(id);
  if (!target) return;
  const y = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
}
