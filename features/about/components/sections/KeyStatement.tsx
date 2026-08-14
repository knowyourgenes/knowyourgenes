// =============================================================================
// features/about - KEY VISUAL STATEMENT
// -----------------------------------------------------------------------------
// Figma: 'KEY VISUAL STATEMENT - the strongest moment on the page'
//        1440 x 543, ink ground (#141b1a), pad 128 / 220, plus a full-bleed
//        radial white-5% glow.
//
// Geometry reproduced:
//   • content rail 936 (220 gutter + the inner frame's own 32) centred at x=252
//   • 32px gap between the eyebrow and the statement
//   • the statement is TWO EXPLICIT ROWS, not a reflow: the frame free-positions
//     'Information' (x=397 w=550) and '≠' (x=979 w=64) on row y=180..284, then
//     'Destiny' (x=541 w=359) on row y=316..415 - h=235 = 104 + 32 + 99. Leaving
//     that break to flex-wrap only produced it above ~1275px (row 1 + Destiny is
//     narrower than the rail at 768/1024), so the composition collapsed to one
//     line everywhere else. flex-col makes the two-beat lockup structural at
//     every width; row 1 measures 0.426vw + gap, well inside the rail throughout
//     (646 of 936 at 1440, 344 of 688 at 768).
//   • the 32px gap is the gap at the 104px desktop type size, so it scales on
//     the same vw ramp as the type (32/1440 = 2.222vw) and bottoms out at 11.7px
//     - 0.308em of the 38px clamp floor, the frame's exact gap-to-type ratio.
//
// RADIUS TRAP: nothing in this section is rounded, so nothing to remap.
// =============================================================================

import { Section } from '../ui';

export default function KeyStatement() {
  return (
    <Section
      ground="ink"
      id="key-statement"
      className="relative overflow-hidden"
      // The frame's vertical padding is 128, above the primitive's 92 ceiling.
      innerClassName="py-[clamp(56px,8.9vw,128px)]"
    >
      {/* Full-bleed radial wash: white 5% -> transparent. Anchors to the
          <section> (the inner rail is unpositioned), so it covers the gutters
          too, exactly like the frame's absolutely-placed rectangle. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_70%)]"
      />

      <div className="relative mx-auto flex w-full max-w-[936px] flex-col gap-8">
        {/* Figtree 700 13/19.5, ls 2.86 (0.22em), #2ac3a2 @ 80%, centred.
            CASE: this run is textCase=UPPER in the frame (y=4159, measured width
            137) - the source string is sentence case but it RENDERS "REMEMBER
            THIS". The `uppercase` below is frame-accurate; do not "correct" it. */}
        <p className="text-center font-kyg text-[13px] font-bold uppercase leading-[19.5px] tracking-[0.22em] text-java2/80">
          Remember this
        </p>

        {/* Figtree 800 104/98.8 ls -0.02em for the words; the operator is
            Figtree 700 116/104.4 ls 0 in java2. Row 1 centres the word against
            the taller operator on the same optical line, so items-center rather
            than baseline. Row heights land at 104.4 + 32 + 98.8 = 235.2, the
            frame's h=235.
            CASE: the display lockup is textCase=AS_TYPED - it is absent from the
            About textCase=UPPER manifest, and "Information" only appears there as
            the Hero's 13px chain run (y=1107). Leave these two rows sentence case. */}
        <h2 className="flex flex-col items-center gap-[clamp(11.7px,2.222vw,32px)] text-center font-kyg">
          {/* Row 1 - 'Information ≠'. flex-wrap is a guard only: the row is far
              inside the rail at every width, but a font-metric drift should
              stack rather than overflow. */}
          <span className="flex flex-wrap items-center justify-center gap-[clamp(11.7px,2.222vw,32px)]">
            <span className="min-w-0 break-words text-[clamp(38px,7.22vw,104px)] font-extrabold leading-[0.95] tracking-[-0.02em] text-linenw">
              Information
            </span>
            {/* Both parents are flex containers, so these whitespace-only text
                nodes generate no rendered box (CSS Flexbox §4: an anonymous flex
                item containing only white space is not rendered). They cost zero
                layout and keep textContent / the accessible name reading
                "Information ≠ Destiny" instead of "Information≠Destiny". */}{' '}
            <span className="text-[clamp(42px,8.05vw,116px)] font-bold leading-[0.9] tracking-normal text-java2">
              &#8800;
            </span>
          </span>{' '}
          {/* Row 2 - 'Destiny', the frame's second line. */}
          <span className="min-w-0 break-words text-[clamp(38px,7.22vw,104px)] font-extrabold leading-[0.95] tracking-[-0.02em] text-linenw/45">
            Destiny
          </span>
        </h2>
      </div>
    </Section>
  );
}
