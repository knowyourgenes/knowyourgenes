// =============================================================================
// Homepage - HELIX GROUND
// -----------------------------------------------------------------------------
// The brand helix artwork, laid in behind four sections as a ground texture.
// Ported from `.hx` in the designer's build ("New Homepage Build/index.html",
// CSS block 04c) and its four placements at markup lines 1590, 1653, 1693, 1902.
//
// This is NOT the particle helix - that one is a live canvas (HelixCanvas) and
// only appears in the hero and the closing panel. This is a still render of the
// same motif, sunk to 15-16% so it reads as watermark rather than illustration.
//
// TWO TINTS, and they are not interchangeable:
//   dark   assets/helix.png      cream line art, 16%, over the teal sections
//   light  assets/helix-ink.png  ink line art, 15% + mix-blend-multiply, so it
//                                sinks INTO cream rather than sitting on it
// Using the cream artwork on a light ground gives an invisible smear; using the
// ink artwork on a dark ground gives a black smudge. The tint follows the
// section's ground, always.
//
// THE RADIAL MASK is what stops it looking like a pasted PNG: the artwork is
// masked with `radial-gradient(closest-side, #000 58%, transparent 100%)`, so it
// is solid through the middle and dissolves to nothing before its own bounding
// box ends. Without it the image's rectangular edge is visible against the flat
// section fill.
//
// STACKING: each placement is `z-index:-1`, so the SECTION must establish a
// stacking context (`isolate`) and must not be transparent, or the ground will
// paint behind the page rather than behind the section's content. Every call
// site in the source pairs this with `overflow:clip; isolation:isolate`.
// =============================================================================

import { cn } from '@/lib/utils';

/** The four placements, each hand-positioned against its own section. */
const PLACE = {
  /** 06 ONE LIFETIME - right edge, upper half */
  life: 'right-[-9%] top-[6%] h-[70%] w-[min(32vw,400px)]',
  /** 07 MEET GENEe - left edge, hanging below the section's bottom */
  genee: 'bottom-[-14%] left-[-10%] h-[88%] w-[min(26vw,330px)]',
  /** 08 WHAT WOULD YOU LIKE TO KNOW - left edge, nearly full height */
  explore: 'left-[-7%] top-[-5%] h-[90%] w-[min(32vw,410px)]',
  /** 11 SCIENCE & TRUST - right edge, full height */
  science: 'right-[-5%] top-0 h-[98%] w-[min(28vw,370px)]',
} as const;

export function HelixGround({
  place,
  tone,
  className,
}: {
  place: keyof typeof PLACE;
  /** must match the section's ground - see the header note */
  tone: 'dark' | 'light';
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute -z-10 bg-contain bg-center bg-no-repeat',
        // dissolve the artwork's own rectangular edge into the section fill
        '[-webkit-mask-image:radial-gradient(closest-side,#000_58%,transparent_100%)]',
        '[mask-image:radial-gradient(closest-side,#000_58%,transparent_100%)]',
        tone === 'dark'
          ? 'opacity-[0.16] [background-image:url(/home/brand/helix.png)]'
          : 'opacity-[0.15] mix-blend-multiply [background-image:url(/home/brand/helix-ink.png)]',
        PLACE[place],
        // Below 820 the source drops it to 7%: on a phone the artwork is wider
        // than the copy column, so at full strength it reads as a smudge behind
        // the text rather than as a ground.
        'max-[820px]:!opacity-[0.07]',
        className
      )}
    />
  );
}
