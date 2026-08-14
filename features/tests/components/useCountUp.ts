'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Reveal-driven number and rail animation, ported from the reference build.
 *
 * The build observes each `.stat` card at threshold 0.4 and, on first entry:
 *   • counts a purely numeric value up over 1300ms on a cubic ease-out
 *     (1 - (1-p)^3), keeping any suffix;
 *   • sets the rail's width, which CSS then transitions.
 *
 * Values that are not a bare number ("1 in 5", "2 to 3", "50%", "3x") cannot be
 * counted, so those pop in with a spring instead - same as the build, which
 * gates on `data-mode === 'num'`.
 *
 * Returns a ref to attach to the card and the string to render.
 */
export function useCountUp(value: string, durationMs = 1300) {
  // A bare integer, optionally with a trailing unit - "30", "50%", "3x".
  const match = /^(\d+)(\D*)$/.exec(value.trim());
  const target = match ? Number(match[1]) : null;
  const suffix = match ? match[2] : '';

  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<string>(target === null ? value : `0${suffix}`);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (typeof IntersectionObserver === 'undefined' || reduce) {
      // Land on the final value without animating. Deferred to a frame rather
      // than set synchronously here: state written straight from an effect body
      // forces an extra render pass (and trips react-hooks/set-state-in-effect).
      const id = requestAnimationFrame(() => {
        setShown(value);
        setEntered(true);
      });
      return () => cancelAnimationFrame(id);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          setEntered(true);
          if (target === null) return;

          let start: number | null = null;
          const step = (ts: number) => {
            if (start === null) start = ts;
            const p = Math.min((ts - start) / durationMs, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setShown(`${Math.round(eased * target)}${suffix}`);
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [value, target, suffix, durationMs]);

  return { ref, shown, entered, isCounted: target !== null };
}
