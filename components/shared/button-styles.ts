// =============================================================================
// components/shared - the ONE button size
// -----------------------------------------------------------------------------
// Every button and button-shaped link in the UI is this size. Before this file
// existed the site shipped buttons at 35, 42, 56, 58, 60 and 69px tall, each
// feature having picked its own from its own Figma frame, and the result read as
// a different product on every page.
//
// The size is taken from the header's nav-link hover chip - the smallest, most
// repeated interactive surface on the site - so the CTA on a hero and the link
// in the nav are visibly the same control.
//
//   height    44px
//   padding   18px horizontal
//   text      15px / 22.5px
//   radius    rounded-sm (5px, docs/DESIGN.md §2)
//
// 44px, not 38: 38 read as cramped at hero scale, and 44x44 is the minimum
// touch target both WCAG 2.5.8 and the iOS HIG ask for - so the size that looks
// right is also the size that is reachable. The header's nav links use the same
// box, which is what keeps a hero CTA and a nav item visibly one control.
//
// SIZE ONLY. Colour, weight, border and shadow stay with the variant that owns
// them - a ghost button on the test pages should still look like a ghost button
// on the test pages, it should just not be 60px tall.
// =============================================================================

/**
 * The canonical button box. Compose as:
 *   cn(BTN, 'bg-eden text-white hover:bg-eden2')
 *
 * Use `cn()` rather than string concatenation when overriding anything here, so
 * tailwind-merge drops the loser instead of shipping both classes and letting
 * source order decide.
 */
export const BTN =
  'inline-flex h-[44px] items-center justify-center gap-[8px] whitespace-nowrap rounded-sm ' +
  'px-[18px] text-[15px] leading-[22.5px]';

/**
 * Square icon-only button - same 38px box, no horizontal padding.
 * Used by the header cluster (search / account / cart) and the drawer closers.
 */
export const BTN_ICON = 'inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-sm';

/**
 * Full-width on phones, natural width from `sm` up. The usual responsive want
 * for a hero CTA. Height never changes.
 */
export const BTN_BLOCK = 'w-full sm:w-auto';
