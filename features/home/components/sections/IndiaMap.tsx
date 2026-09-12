'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

// =============================================================================
// The map in "Born in India" - and what it does under a pointer
// -----------------------------------------------------------------------------
// The designer's note: "Hover interaction in the map".
//
// THE LAND LIGHTS UP UNDER THE CURSOR, AND THE POINTS NEAR IT SWELL. A soft
// glow follows the pointer across the country, and each dot grows with how
// close the cursor is - so moving across the map reads as passing over places,
// without the map having to name any. It names none on purpose: the section
// makes no city claims, and a tooltip per dot would need copy that does not
// exist.
//
// THE GLOW IS MASKED TO THE COASTLINE. It is a radial gradient clipped by the
// map artwork's own alpha, so it stops at the land's edge instead of at the edge
// of a square box. The mask is only applied once the pointer first arrives
// (`data-lit`, set below): the artwork on screen is served through next/image,
// so the raw PNG the mask needs is a separate 116KB request, and a visitor who
// never points at the map should not pay for it. An unloaded mask renders as
// fully masked, so there is no flash of an unclipped glow on the first hover.
// Once on, the mask STAYS on - tying it to :hover dropped it the instant the
// pointer left, and the glow lit the sea in a square for its 300ms fade-out.
//
// THE SCALE GOES ON EACH DOT'S ANCHOR, NOT THE DOT. The dots and their aura
// rings already run CSS pulses (globals.css), and the aura's pulse animates
// `transform` - an inline transform on it would simply be overwritten. The
// anchor is a 0x0 span at the point itself, so scaling it grows dot and aura
// together about the right centre.
//
// Pointer moves are coalesced into one requestAnimationFrame, and nothing here
// re-renders React: 28 transforms are written straight to the DOM. Under
// prefers-reduced-motion the glow still follows, but the dots hold still.
// =============================================================================

/** How far the cursor's pull reaches, as a share of the map's width. */
const REACH = 0.22;
/** Extra scale for a dot directly under the cursor (so it reaches 1 + LIFT). */
const LIFT = 1.4;

const MAP_SRC = '/home/brand/map-india-teal.png';

export function IndiaMap({ dots }: { dots: [number, number, number][] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const anchors = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let px = 0.5;
    let py = 0.5;

    const paint = () => {
      raf = 0;
      box.style.setProperty('--mx', `${px * 100}%`);
      box.style.setProperty('--my', `${py * 100}%`);
      if (reduced.matches) return;
      dots.forEach(([x, y], i) => {
        const el = anchors.current[i];
        if (!el) return;
        // 1 directly under the cursor, 0 at REACH and beyond; squared so the
        // pull falls away smoothly instead of in a cone
        const k = Math.max(0, 1 - Math.hypot(x - px, y - py) / REACH);
        el.style.transform = k > 0 ? `scale(${(1 + k * k * LIFT).toFixed(3)})` : '';
        el.style.filter = k > 0 ? `brightness(${(1 + k * 0.7).toFixed(3)})` : '';
      });
    };

    const onMove = (e: PointerEvent) => {
      if (!('lit' in box.dataset)) box.dataset.lit = '';
      const r = box.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width;
      py = (e.clientY - r.top) / r.height;
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      anchors.current.forEach((el) => {
        if (!el) return;
        el.style.transform = '';
        el.style.filter = '';
      });
    };

    box.addEventListener('pointermove', onMove);
    box.addEventListener('pointerleave', onLeave);
    return () => {
      onLeave();
      box.removeEventListener('pointermove', onMove);
      box.removeEventListener('pointerleave', onLeave);
    };
  }, [dots]);

  return (
    <div ref={boxRef} className="group/map relative aspect-square w-[min(78%,340px)]">
      <Image
        src={MAP_SRC}
        alt="Map of India"
        fill
        sizes="340px"
        className="object-contain [filter:brightness(1.6)_saturate(1.35)]"
      />

      {/* The glow, clipped to the land. `mask-size: contain` + centre matches
          the image's own object-contain placement, so the mask and the artwork
          are the same shape in the same place. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] group-hover/map:opacity-100 group-data-[lit]/map:[mask-image:url('/home/brand/map-india-teal.png')]"
        style={{
          background:
            'radial-gradient(150px circle at var(--mx, 50%) var(--my, 50%), rgba(234,251,246,0.62), rgba(127,227,214,0.28) 45%, transparent 75%)',
        }}
      />

      {dots.map(([x, y, r], i) => (
        <span
          key={i}
          ref={(el) => {
            anchors.current[i] = el;
          }}
          className="absolute transition-[transform,filter] duration-200 ease-out"
          style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
        >
          {r >= 4.5 ? (
            <span
              aria-hidden="true"
              className="kyg-aura absolute rounded-full ring-1 ring-ice/60"
              style={{
                width: r * 5,
                height: r * 5,
                left: -r * 2.5,
                top: -r * 2.5,
                animationDelay: `${(i % 7) * 0.37}s`,
              }}
            />
          ) : null}
          <span
            aria-hidden="true"
            className="kyg-dot absolute rounded-full bg-ice"
            style={{
              width: r * 2,
              height: r * 2,
              left: -r,
              top: -r,
              // 7 is prime against 28, so the stagger never lines the dots up
              // into a pulse sweeping across the map
              animationDelay: `${(i % 7) * 0.37}s`,
            }}
          />
        </span>
      ))}
    </div>
  );
}
