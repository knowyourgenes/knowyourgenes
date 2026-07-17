/**
 * Shared type scale + spacing for the homepage sections.
 *
 * These are the sizes/gaps we standardised on (extracted from WhyKyg). They are
 * intentionally COLOUR-AGNOSTIC - a section adds its own text colour
 * (`text-(--ink-1)`, `text-(--c-cream)`, ...) so the same constant works on both
 * light and dark backgrounds. Compose with a template string:
 *
 *   <h2 className={`mt-[16px] ${HEADING} text-(--ink-1)`}>…</h2>
 *   <div className={`${EYEBROW} text-(--c-teal)`}>
 *     <span className={EYEBROW_DASH_TEAL} /> Why KYG exists
 *   </div>
 *
 * Change a size here once and every section moves together.
 */

/** Section vertical padding - keeps a section within ~one large-screen viewport. */
export const SECTION_PY = 'py-[clamp(48px,5vw,72px)] max-[1180px]:py-[clamp(40px,5vw,64px)] max-[560px]:py-[44px]';

/** Gap for two-column / content grids. */
export const CONTENT_GAP = 'gap-[56px] max-[1180px]:gap-[44px] max-[720px]:gap-[24px]';

/** Eyebrow (kicker) label - add a colour (`text-(--c-teal)` / `text-(--c-peach-2)`). */
export const EYEBROW =
  'inline-flex items-center gap-[14px] text-[17px] font-bold uppercase tracking-[0.16em] max-[560px]:gap-[10px] max-[560px]:text-[14px] max-[360px]:gap-[8px] max-[360px]:text-[11px]';

/** Leading dash for the eyebrow - add a background (see the *_TEAL / *_PEACH variants). */
export const EYEBROW_DASH = 'h-[2px] w-[40px] shrink-0 rounded-[2px] max-[360px]:w-[28px]';
export const EYEBROW_DASH_TEAL = `${EYEBROW_DASH} bg-[linear-gradient(90deg,var(--c-teal),var(--c-teal-light))]`;
export const EYEBROW_DASH_PEACH = `${EYEBROW_DASH} bg-(--c-peach-2)`;

/** Primary section heading (h2) - add a colour. */
export const HEADING =
  '[font-family:var(--ff)] text-[clamp(32px,4vw,52px)] font-semibold leading-[1.05] tracking-[-0.028em] max-[560px]:text-[clamp(26px,7.5vw,40px)] max-[360px]:text-[23px]';

/** Smaller sub-heading - add a colour. */
export const SUBHEADING =
  '[font-family:var(--ff)] text-[clamp(24px,2.6vw,32px)] font-semibold leading-[1.15] tracking-[-0.018em] max-[360px]:text-[21px]';

/** Lead paragraph (intro under a heading) - add a colour. */
export const LEAD = 'text-[clamp(16px,1.3vw,19px)] leading-[1.55] max-[360px]:text-[15px]';

/** Standard body paragraph - add a colour. */
export const BODY = 'text-[16px] leading-[1.6] max-[360px]:text-[14.5px]';

/** Small print / captions - add a colour. */
export const SMALL = 'text-[14px] leading-[1.55] max-[360px]:text-[13px]';

/** Teal gradient accent text (for the highlighted phrase inside a heading). */
export const GRAD_TEXT =
  'bg-[linear-gradient(110deg,var(--c-teal)_0%,var(--c-teal-2)_25%,var(--c-teal-light)_50%,var(--c-teal-2)_75%,var(--c-teal)_100%)] bg-clip-text text-transparent';
