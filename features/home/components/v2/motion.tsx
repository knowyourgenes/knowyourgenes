'use client';

// =============================================================================
// Homepage - MOTION PRIMITIVES
// -----------------------------------------------------------------------------
// Ports sections 1 and 6 of the designer's build script ("New Homepage Build/
// index.html"): the scroll-reveal observer, the hero's time-based entrance, and
// the two scroll-LINKED drawings (the lifetime strand and the how-it-works
// rail). Everything here is a faithful port - same thresholds, same easing,
// same durations - because the frame was traced from that page.
//
// THE EASING is `--e-soft: cubic-bezier(.16,1,.3,1)` throughout. It is a long,
// heavily front-loaded ease; at 0.85s it reads as "settling into place" rather
// than "sliding in", and shortening it makes the whole page feel cheaper.
//
// EVERY primitive here honours prefers-reduced-motion by rendering the FINAL
// state immediately - never by freezing an element at opacity 0.
// =============================================================================

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { cn } from '@/lib/utils';

const EASE = 'cubic-bezier(0.16,1,0.3,1)';
const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReduce(onChange: () => void) {
  const mq = window.matchMedia(REDUCE_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/**
 * `useSyncExternalStore`, not `useState` + `useEffect`.
 *
 * A media query is an external store, and reading one into state inside an
 * effect means every consumer renders once with the wrong answer and then
 * again with the right one - which for `Reveal` means the element is briefly
 * mounted at opacity 0 even for a user who asked for no motion. It also trips
 * `react-hooks/set-state-in-effect`, correctly.
 *
 * The server snapshot is `false` (assume motion is allowed): the server cannot
 * know the preference, and the alternative - assuming reduced - would ship the
 * page with every entrance already finished and then animate it away on
 * hydration for everyone else.
 */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE_QUERY).matches,
    () => false
  );
}

/* -------------------------------------------------------------------------- */
/* 1 · scroll reveal                                                          */
/* -------------------------------------------------------------------------- */

/**
 * The source's `.rv` / `.rv-l` / `.rv-s` classes plus its single shared
 * IntersectionObserver, expressed as a component.
 *
 *   up    translateY(26px)   the default - most blocks rise into place
 *   left  translateX(-22px)  for copy columns that sit beside an image
 *   scale scale(0.965)       for image plates, so they bloom rather than slide
 *
 * `delay` is the source's `--rd` custom property, used to stagger a row of
 * cards. It is a transition-delay, NOT a separate animation, so a reveal that
 * is already on screen at load still settles in one wave.
 *
 * Observation is one-shot (`unobserve` on first intersection), matching the
 * source: scrolling back up must not replay the entrance.
 */
export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  as: As = 'div',
  className,
}: {
  children: React.ReactNode;
  variant?: 'up' | 'left' | 'scale';
  /** seconds */
  delay?: number;
  as?: 'div' | 'li' | 'section' | 'header' | 'figure' | 'article';
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);
  const reduce = usePrefersReducedMotion();
  // DERIVED, not set in an effect: under reduced motion the element must render
  // in its final state on the very first paint, not flash at opacity 0 and then
  // be corrected.
  const shown = seen || reduce;

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    // Defensive only - IntersectionObserver is available everywhere this app
    // ships. Deferred by a frame rather than called inline so it stays out of
    // the effect body (a synchronous setState there cascades a second render).
    if (typeof IntersectionObserver === 'undefined') {
      const id = requestAnimationFrame(() => setSeen(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((x) => {
          if (x.isIntersecting) {
            setSeen(true);
            io.unobserve(x.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const hidden = variant === 'left' ? 'translateX(-22px)' : variant === 'scale' ? 'scale(0.965)' : 'translateY(26px)';

  return (
    <As
      ref={ref as never}
      className={cn('will-change-[opacity,transform] motion-reduce:!opacity-100', className)}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : hidden,
        transition: shown ? `opacity 0.85s ${EASE} ${delay}s, transform 0.85s ${EASE} ${delay}s` : undefined,
      }}
    >
      {children}
    </As>
  );
}

/**
 * The hero's entrance (`.hv` + `@keyframes heroIn`). Time-based, not scroll
 * based - the hero is above the fold, so an observer would fire instantly and
 * the stagger would be lost. Each child names its own delay via `--rd`.
 */
export function HeroReveal({
  children,
  delay = 0,
  as: As = 'div',
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  as?: 'div' | 'p' | 'h1' | 'span';
  className?: string;
}) {
  const [shown, setShown] = useState(false);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    // one frame's grace so the initial (hidden) style is committed before the
    // transition to the shown style - otherwise React lands both in one paint
    // and nothing animates
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const on = shown || reduce;
  return (
    <As
      className={cn('will-change-[opacity,transform] motion-reduce:!opacity-100', className)}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? 'none' : 'translateY(24px)',
        transition: reduce ? undefined : `opacity 1.05s ${EASE} ${delay}s, transform 1.05s ${EASE} ${delay}s`,
      }}
    >
      {children}
    </As>
  );
}

/* -------------------------------------------------------------------------- */
/* 2 · scroll-linked progress                                                 */
/* -------------------------------------------------------------------------- */

/**
 * The source's `progress(el, a, b)`, verbatim: how far an element has travelled
 * between two viewport-height fractions, clamped 0..1.
 *
 * `a` is where the drawing STARTS (0.82 = when the element's top reaches 82%
 * down the viewport) and `b` where it FINISHES. b < a, so the span is the
 * element's height minus the distance between those two lines.
 */
function progressOf(el: HTMLElement, a: number, b: number) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  const start = vh * a;
  const end = vh * b;
  const span = r.height + (start - end);
  if (span <= 0) return 0;
  return Math.max(0, Math.min(1, (start - r.top) / span));
}

/**
 * Drives `progressOf` on a rAF-throttled scroll listener. Returns 0..1.
 *
 * One listener per hook instance is deliberate: the two consumers sit far apart
 * on a 16,000px page and each unmounts independently. The rAF gate means a
 * fling still costs one measurement per frame, not one per scroll event.
 */
export function useScrollProgress<T extends HTMLElement>(a: number, b: number) {
  const ref = useRef<T | null>(null);
  const [raw, setRaw] = useState(0);
  const reduce = usePrefersReducedMotion();
  // Derived rather than assigned in the effect: under reduced motion the rail
  // must render COMPLETE, not empty-then-corrected. An empty rail is not a
  // neutral fallback - it is a drawing that failed.
  const p = reduce ? 1 : raw;

  useEffect(() => {
    if (reduce) return;
    let ticking = false;
    const tick = () => {
      const el = ref.current;
      if (el) setRaw(progressOf(el, a, b));
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    // first measurement deferred a frame, so the effect body itself never
    // calls setState (and so the element has actually been laid out)
    const id = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [a, b, reduce]);

  return [ref, p] as const;
}

/* -------------------------------------------------------------------------- */
/* 3 · the lifetime strand                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Section 06's vertical rail. The path is GENERATED, not authored: a sine wave
 * of 5 waves whose amplitude is itself shaped by sin(pi * p), so the strand
 * pinches to nothing at the top and bottom and is widest in the middle.
 *
 * Two copies of the same path are drawn - a static faint one and a bright one
 * revealed by animating stroke-dashoffset from its full length down to 0 as the
 * section scrolls. That is what makes the strand look "drawn" on the way down.
 *
 * The path must be rebuilt on resize because the amplitude is derived from the
 * rail's rendered width (`min(30, w * 0.4)`), and the viewBox is set to the
 * rail's pixel box so the stroke never scales.
 */
export function LifeStrand({ className }: { className?: string }) {
  const [box, setBox] = useState({ w: 120, h: 1 });
  const [len, setLen] = useState(0);
  const brightRef = useRef<SVGPathElement | null>(null);
  const [wrapRef, p] = useScrollProgress<HTMLDivElement>(0.82, 0.34);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.offsetWidth || 120, h: el.offsetHeight || 1 });
    measure();
    if (!('ResizeObserver' in window)) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [wrapRef]);

  const { w, h } = box;
  const d = (() => {
    const amp = Math.min(30, w * 0.4);
    const waves = 5;
    const steps = 240;
    let out = '';
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = w / 2 + Math.sin(t * Math.PI * 2 * waves) * amp * Math.sin(Math.PI * t);
      out += (i ? 'L' : 'M') + x.toFixed(2) + ' ' + (h * t).toFixed(2);
    }
    return out;
  })();

  // getTotalLength is only meaningful once the path is in the DOM with this `d`
  useEffect(() => {
    const el = brightRef.current;
    if (el) setLen(el.getTotalLength());
  }, [d]);

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} fill="none" className="h-full w-full overflow-visible">
        <path d={d} stroke="rgba(14,77,75,0.14)" strokeWidth={1.5} />
        <path
          ref={brightRef}
          d={d}
          stroke="#0E4D4B"
          strokeWidth={1.5}
          strokeLinecap="round"
          style={
            len
              ? {
                  strokeDasharray: len,
                  strokeDashoffset: reduce ? 0 : len * (1 - p),
                }
              : undefined
          }
        />
      </svg>
    </div>
  );
}
