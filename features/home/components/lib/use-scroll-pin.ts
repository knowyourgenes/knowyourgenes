'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hold a section still while the page scrolls THROUGH it, and report how far
 * through that hold you are.
 *
 * Two sections walk a line across themselves as you read them - the life curve
 * in 04 and the step track in 07 - and the arithmetic is identical, so it lives
 * here rather than twice.
 *
 * HOW PROGRESS IS DERIVED. Pin a `pane` inside a taller `track`. While the pane
 * is stuck its top holds still and the track's top keeps rising, so the GAP
 * BETWEEN THE TWO is exactly how far into the pin we are: 0 when the pane sits
 * at the top of its track, and (trackH - paneH) when it has reached the bottom.
 *
 * Deriving it from the two rects means the maths never has to know the header's
 * height, which matters because SiteHeader republishes `--site-header-h` on
 * every resize - anything that knew the number would have to be told again.
 *
 * THIS IS NOT SCROLL-JACKING. It is `position: sticky` and nothing else: no
 * wheel handler, no scroll hijack, the scrollbar keeps its meaning, and a fast
 * flick still gets you straight past the section.
 */
export function useScrollPin({
  /**
   * The share of the pin the walk is spent over. The remainder is DWELL - the
   * line finishes, and the section holds finished for a moment before the page
   * moves on. Spend the whole pin and the last step lights on the final pixel
   * before the section leaves, which is the one frame nobody sees.
   */
  span = 0.85,
} = {}) {
  const track = useRef<HTMLDivElement>(null);
  const pane = useRef<HTMLDivElement>(null);
  const [walked, setWalked] = useState(0);
  /**
   * Whether a pin is actually in effect. It is not below `lg` (where the track
   * is auto-height and the pane is static) and not on a screen tall enough to
   * hold the whole track - so callers can fall back to their own state rather
   * than reading a progress that will never move.
   */
  const [pinning, setPinning] = useState(false);

  const measure = useCallback(() => {
    const t = track.current;
    if (!t) return;
    const p = pane.current;
    const tr = t.getBoundingClientRect();
    // A caller that never attaches `pane` is asking for the unpinned reading -
    // there is nothing to stick, so there is no pin to measure progress from.
    const travel = p ? tr.height - p.getBoundingClientRect().height : 0;
    const pr = p?.getBoundingClientRect();

    if (travel > 0 && pr) {
      setPinning(true);
      const progress = (pr.top - tr.top) / travel;
      setWalked(Math.min(1, Math.max(0, progress) / span));
      return;
    }

    // NO PIN - below the pinning breakpoint, or a screen tall enough to hold
    // the whole track. Progress then comes from the section's OWN travel
    // through the viewport, so a phone still gets a line that fills as it is
    // read; it just fills downward instead of across.
    //
    // THE WALK STARTS WHEN THE SECTION IS BEING READ, NOT WHEN IT APPEARS.
    //
    // It used to run from the top edge reaching 90% of the viewport - the
    // moment the section first peeked in from the bottom - so by the time you
    // had it on screen the walk was already a third spent and there was no
    // time to read anything. It now begins when the top edge passes 60% (the
    // section is properly in view) and finishes when the bottom edge passes
    // 40%, which is the span over which it is actually in front of you.
    setPinning(false);
    const vh = window.innerHeight || 1;
    const span_ = 0.2 * vh + tr.height;
    const seen = (0.6 * vh - tr.top) / span_;
    setWalked(Math.min(1, Math.max(0, seen) / span));
  }, [span]);

  useEffect(() => {
    // rAF-coalesced: scroll fires far faster than the compositor paints, and
    // getBoundingClientRect on every event forces a layout each time.
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [measure]);

  /**
   * Scroll the PAGE to the point where the walk stands at `p`.
   *
   * This is what a control inside a pinned section has to do instead of setting
   * state: set state and the next scroll frame overwrites it, and the control
   * reads as broken. Moving the page instead makes the click and the scroll
   * agree, because they are the same thing.
   */
  const scrollToWalked = useCallback(
    (p: number) => {
      const t = track.current;
      const pane_ = pane.current;
      if (!t || !pane_) return;
      const tr = t.getBoundingClientRect();
      const pr = pane_.getBoundingClientRect();
      const travel = tr.height - pr.height;
      if (travel <= 0) return;
      // Where the pane comes to rest, read off the element rather than assumed:
      // it is the sticky `top`, which tracks the header and can change.
      const stuckAt = parseFloat(getComputedStyle(pane_).top) || 0;
      const delta = tr.top - stuckAt + Math.min(1, Math.max(0, p)) * span * travel;
      window.scrollTo({ top: window.scrollY + delta, behavior: 'smooth' });
    },
    [span]
  );

  return { track, pane, walked, pinning, scrollToWalked };
}
