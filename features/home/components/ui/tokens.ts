// =============================================================================
// features/home/ui - the numbers every section shares
// -----------------------------------------------------------------------------
// This file exists because the previous three homepage builds (v1, v2, v3) each
// re-derived their own grounds, their own section padding and their own type
// scale from their own Figma frame, and the page read as three products stacked
// on top of each other. Everything a section is allowed to vary now lives here.
//
// THE RAIL. The design frame is 1240 wide with a 40px gutter, so its content
// rail is 1160. That is not a new width - it is exactly what the site-wide
// <Container> (max 1600, --gutter 40) already produces at a 1240 viewport, so
// sections use Container and inherit the 1600 cap above that. See DESIGN.md §1.
// =============================================================================

/**
 * Vertical rhythm. ONE value for the whole page.
 *
 * IT IS KEYED TO VIEWPORT HEIGHT AS WELL AS WIDTH, and that is the whole point.
 * The brief is that no section may need scrolling on any laptop from 1024px up -
 * i.e. every section fits inside 90vh. A width-only clamp cannot do that: a
 * 1440x800 laptop and a 1440x1200 monitor get the same 86px of padding, and on
 * the short one the section overruns.
 *
 * `min(vw, vh)` is what makes the page shrink on a short screen rather than only
 * on a narrow one. Worked values:
 *
 *   1024 x 768    min(61, 72) = 61   <- the design draws 61.16
 *   1440 x 900    min(86, 85) = 85   <- the design draws 86
 *   1920 x 1080   min(115, 102) -> capped at 96
 *
 * Sections must not set their own py-*. The old build had five different section
 * paddings (56/94, 84/168, 62/110, 64/144, 96/180) and the page had no beat; if
 * a section genuinely needs more air it takes it INSIDE the shell.
 */
// The vh coefficient is a GUARD, not the driver. Set too low it wins on an
// ordinary 800-tall laptop and shrinks the page below the design; 9.4vh only
// bites on a viewport that is genuinely short for its width.
export const SECTION_Y = 'py-[clamp(24px,min(5.972vw,9.4vh),96px)]';

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
 * The section grounds, in the order the page alternates them.
 *
 * `ink` and `abyss` set their own ink colour because everything inside them
 * flips - a section should never have to remember to pass text-linenw.
 */
export const GROUND = {
  /** #FAF6EF - the default page cream */
  cream: 'bg-linenw text-zeus',
  /** #F5EDDF - the deeper cream, one step warmer than cream */
  sand: 'bg-sand text-zeus',
  /** #141B1A - the near-black the dark sections share */
  ink: 'bg-[#141B1A] text-linenw',
  /** #062927 - the hero and nothing else */
  abyss: 'bg-abyss text-linenw',
} as const;

export type Ground = keyof typeof GROUND;

/** Grounds that need light ink and the java2 accent rather than eden. */
export const isDark = (g: Ground) => g === 'ink' || g === 'abyss';

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

/**
 * The tapered hairline the page uses instead of a solid rule: full strength to
 * 34%, gone by 92%. Two versions because the ink flips with the ground.
 */
export const RULE_LIGHT = 'linear-gradient(90deg,rgba(27,23,18,0.13) 0%,rgba(27,23,18,0.13) 34%,rgba(27,23,18,0) 92%)';
export const RULE_DARK =
  'linear-gradient(90deg,rgba(250,246,239,0.20) 0%,rgba(250,246,239,0.20) 34%,rgba(250,246,239,0) 92%)';
