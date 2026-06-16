'use client';

import { useEffect, useState, type RefObject } from 'react';

/** Adds an `is-in` class to `.reveal` / `.reveal-r` elements as they scroll into
 *  view (one-shot). The reveal transitions themselves live in the scoped
 *  stylesheet (_components/styles.tsx). */
export function useRevealOnScroll(rootRef: RefObject<HTMLElement | null>) {
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
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );
    root.querySelectorAll('.reveal, .reveal-r').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootRef]);
}

/** True once the window has scrolled past `threshold` px — drives the sticky
 *  nav's translucent → solid transition. */
export function useNavScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
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
