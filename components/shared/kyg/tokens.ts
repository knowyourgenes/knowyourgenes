// =============================================================================
// components/shared/kyg - the numbers the page primitives share
// -----------------------------------------------------------------------------
// Promoted out of features/home when the contact page began drawing the same
// bands: DESIGN.md §7 says a thing used by two features belongs in
// components/shared, and grounds/rhythm/rules are now used by both.
//
// What did NOT come with it stayed behind in features/home/components/ui:
// PHOTO is the homepage's own photography, and MEDIA_CAP/HEAD_GAP are its
// section-internal spacing. Neither is shared, so neither is here.
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

/**
 * THE PINNED PANE, in one place because five sections use it - the homepage's
 * explore grid, step track and life curve, and About's stepper and personas.
 *
 * It was copied into each of them, which is how three of the five ended up
 * still engaging on a phone in landscape after the other two were fixed. The
 * `kyg-pin` block in globals.css carries the height requirement; see the note
 * beside it there for why width alone was not enough.
 *
 * A section pairs it with PIN_TRACK and its own walk length, and MUST use both:
 * a tall track under a static pane is a screen of empty ground.
 */
export const PIN_PANE = 'kyg-pin';

/**
 * The track a `PIN_PANE` is stuck inside. Pair it with the walk's length:
 *   <div ref={track} className={cn('relative', pinned && PIN_TRACK)}
 *        style={{ '--pin-track': '240vh' }}>
 */
export const PIN_TRACK = 'kyg-pin-track';

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
 * The tapered hairline the page uses instead of a solid rule: full strength to
 * 34%, gone by 92%. Two versions because the ink flips with the ground.
 */
export const RULE_LIGHT = 'linear-gradient(90deg,rgba(27,23,18,0.13) 0%,rgba(27,23,18,0.13) 34%,rgba(27,23,18,0) 92%)';
export const RULE_DARK =
  'linear-gradient(90deg,rgba(250,246,239,0.20) 0%,rgba(250,246,239,0.20) 34%,rgba(250,246,239,0) 92%)';
