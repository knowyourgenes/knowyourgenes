// =============================================================================
// features/home/ui - the numbers only the homepage uses
// -----------------------------------------------------------------------------
// The grounds, the vertical rhythm and the tapered rules moved to
// components/shared/kyg/tokens.ts when the contact page started drawing the
// same bands. What is left here is homepage-only: its photography, and two
// spacings that exist inside its sections and nowhere else.
// =============================================================================

/** Gap between a section's header block and its body. Same height rule. */
export const HEAD_GAP = 'mt-[clamp(20px,min(3.056vw,4.8vh),49px)]';

/**
 * The cap every large photograph takes.
 *
 * Images are the single biggest thing standing between a section and its 90vh
 * budget - a 16:9 band on a 1160 rail is 650px tall on its own, which is the
 * whole allowance on a 768-tall laptop. Capping in `vh` lets the picture keep
 * its aspect ratio on a tall screen and give the height back on a short one.
 */
export const MEDIA_CAP = 'max-h-[min(38vh,420px)]';

/**
 * The delivered photography, keyed by slot. Kept as a map rather than inline
 * strings so a re-shoot is one edit, and so a missing slot is a type error
 * rather than a 404 nobody notices.
 */
export const PHOTO = {
  hero: '/home/photos/ph-hero.webp',
  /** The editorial portrait in Why genetic testing, exported from the design. */
  why: '/home/photos/ph-why-portrait.jpg',
  life1: '/home/photos/ph-life-1.webp',
  life2: '/home/photos/ph-life-2.jpg',
  life3: '/home/photos/ph-life-3.webp',
  life5: '/home/photos/ph-life-5.webp',
  care1: '/home/photos/ph-care-1.webp',
  care2: '/home/photos/ph-care-2.webp',
  care3: '/home/photos/ph-care-3.webp',
  lab: '/home/photos/ph-lab.webp',
  conversation: '/about/img/real-conversation.jpg',
  jrn1: '/home/photos/ph-jrn-1.webp',
  jrn2: '/home/photos/ph-jrn-2.webp',
  jrn3: '/home/photos/ph-jrn-3.webp',
  jrn4: '/home/photos/ph-jrn-4.webp',
  jrn5: '/home/photos/ph-jrn-5.webp',
  jrn6: '/home/photos/ph-jrn-6.webp',
} as const;
