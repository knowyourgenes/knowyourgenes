'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// =============================================================================
// The accreditation strip - scroll-reactive marquee
// -----------------------------------------------------------------------------
// The strip runs continuously, and the READING DIRECTION follows the page:
// scroll down and the badges travel right, scroll up and they travel left. It
// reads as the strip being pushed along by the scroll rather than as a loop
// running beside it.
//
// WHY THIS IS JAVASCRIPT AND NOT `animation-direction`. Flipping a running CSS
// animation to `reverse` keeps the animation's CURRENT TIME and mirrors it, so
// a track 30% through its cycle snaps to 70% - a visible jump on every change
// of scroll direction, which on a trackpad is constant. Driving the transform
// from a rAF loop means a direction flip is just a sign change on the next
// frame, and the strip never moves anywhere it was not already.
//
// The `Web Animations API` route (`animation.playbackRate = -1`) has the same
// no-jump property, but an infinite CSS animation run backwards walks its
// currentTime down to 0 and finishes there - it would need seeding with a fake
// multi-hour start time to have room to run. Not worth the trick.
//
// The track holds the badge row TWICE. The transform wraps modulo 50% of the
// track - exactly one copy - so whichever way it travels the seam never shows.
//
// It stops moving when it is off-screen, when the pointer is on it, and when
// the reader asks for reduced motion. With JS off it renders as a static row,
// which is what the Figma frame draws anyway.
// =============================================================================

/** 50% of the track in 34s - the speed the CSS marquee this replaced ran at. */
const PERCENT_PER_SECOND = 50 / 34;

/** Scroll deltas under this are trackpad noise and rubber-banding, not intent. */
const DIRECTION_THRESHOLD_PX = 2;

export default function TrustStrip({ mask, children }: { mask: string; children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Refs, not state: these change on scroll and on every frame, and none of
  // them should cost a React render.
  const offsetRef = useRef(0);
  // +1 travels right, -1 travels left. Starts at +1 because the reader has by
  // definition scrolled DOWN to reach this section.
  const directionRef = useRef(1);
  const runningRef = useRef({ visible: false, hovered: false });
  const rafRef = useRef(0);
  const prevTimeRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;

    const shouldRun = () => runningRef.current.visible && !runningRef.current.hovered;

    const frame = (time: number) => {
      // A resumed loop has a stale timestamp; treat the first frame as zero
      // elapsed so the strip picks up where it stopped instead of leaping.
      const dt = prevTimeRef.current ? Math.min(time - prevTimeRef.current, 50) / 1000 : 0;
      prevTimeRef.current = time;

      const next = offsetRef.current - directionRef.current * PERCENT_PER_SECOND * dt;
      // Positive modulo: `%` alone keeps the sign, which breaks travelling left.
      offsetRef.current = ((next % 50) + 50) % 50;
      track.style.transform = `translate3d(-${offsetRef.current}%,0,0)`;

      rafRef.current = shouldRun() ? requestAnimationFrame(frame) : 0;
    };

    const start = () => {
      if (rafRef.current || !shouldRun()) return;
      prevTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };

    // ---- scroll direction ----
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < DIRECTION_THRESHOLD_PX) return;
      directionRef.current = delta > 0 ? 1 : -1;
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ---- run only while on screen ----
    const io = new IntersectionObserver(
      ([entry]) => {
        runningRef.current.visible = Boolean(entry?.isIntersecting);
        if (shouldRun()) start();
        else stop();
      },
      { rootMargin: '120px 0px' }
    );
    io.observe(viewport);

    // ---- pause under the pointer, so a badge can be read ----
    const onEnter = () => {
      runningRef.current.hovered = true;
      stop();
    };
    const onLeave = () => {
      runningRef.current.hovered = false;
      start();
    };
    viewport.addEventListener('pointerenter', onEnter);
    viewport.addEventListener('pointerleave', onLeave);

    // ---- honour a reduced-motion preference turned on while the page is open ----
    const onReducedChange = () => {
      if (reduced.matches) stop();
      else start();
    };
    reduced.addEventListener('change', onReducedChange);

    return () => {
      stop();
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
      viewport.removeEventListener('pointerenter', onEnter);
      viewport.removeEventListener('pointerleave', onLeave);
      reduced.removeEventListener('change', onReducedChange);
    };
  }, []);

  return (
    <div
      ref={viewportRef}
      className="mt-8 w-full overflow-hidden"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {children}
      </div>
    </div>
  );
}
