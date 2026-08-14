// =============================================================================
// Homepage - SECTION 12 · PRIVACY & CONFIDENTIALITY
// -----------------------------------------------------------------------------
// Ported from the designer's hand-built page, "New Homepage Build/index.html":
//   CSS     .priv / .priv__g / .chips / .priv__c   (lines 1081-1095)
//   markup  section.priv                           (lines 1968-1986)
//
// That page is the executable original the Figma frame was traced from, so where
// the two disagree it wins. Three things the trace had got wrong and this file
// now corrects:
//   1. the headline carried the designer's hand-placed line breaks as hard <br>s.
//      The source has NO breaks - it constrains the h2 to max-width:15ch and lets
//      text-wrap:balance find the lines, which is what keeps the three lines even
//      at every width instead of only at 1440.
//   2. the two columns are 1.1fr / .9fr, not the traced 691/565, and the gutter
//      is a clamp(28px,4vw,74px) - the trace had frozen it at the 58 it happens
//      to measure at 1440.
//   3. every hover state was missing. The chips and the CTA are the only
//      interactive things in the section; without them it is inert.
//
// This is the quietest section on the page - cream ground, no card, no panel, no
// photography - and it is deliberately NOT a `.sec` in the source, so it does
// not take the page's 84/168 section rhythm. Its own padding-block is
// clamp(62px,7vw,110px).
//
// NO BORDERS ANYWHERE. Every outline here is an inset box-shadow at 1.5px, not a
// 1px or 2px border: `inset 0 0 0 1.5px rgba(14,77,75,.22)` on the chips and
// `.26` on the CTA. That is why both zero the shared primitives' border and draw
// with an inset ring instead - a real border would grow the 49.9 / 58 boxes, and
// a 2px ring (which is what both primitives default to) reads visibly heavier
// than the source against this much cream.
// =============================================================================

import { Reveal } from '../motion';
import { Body, Chip, Cta, Heading, Kicker, Section } from '../ui';

/**
 * The three assurance chips, in source order.
 *
 * Icon ids are frame-absolute - the section starts at page y=12763, so the
 * spec's section-local y=116 / y=176 rows become 12879-* and 12939-*. They map
 * to the source's sprite refs #ic-circle-check, #ic-lock and #ic-shield-check.
 */
const ASSURANCES: { label: string; icon: string }[] = [
  { label: 'Clear consent', icon: '12879-828' }, // ic-circle-check
  { label: 'Responsible data handling', icon: '12879-1002' }, // ic-lock
  { label: 'Confidential reporting', icon: '12939-828' }, // ic-shield-check
];

export default function Privacy() {
  return (
    <Section
      ground="cream"
      id="privacy-confidentiality"
      // Section's default rhythm is 56/94; .priv sets its own padding-block.
      innerClassName="py-[clamp(62px,7vw,110px)]"
    >
      {/* .priv__g. The source collapses to one column at max-width:820px, which
          is not a Tailwind breakpoint - and mixing an arbitrary min-width
          variant with the named ones loses, because v4 emits arbitrary
          min-widths first. So the nearest named breakpoint below 820 is used:
          the two-column layout survives down to 768 rather than 820, which the
          .9fr column takes without wrapping the CTA (it measures ~292 against
          ~303 available there). */}
      <div className="grid grid-cols-1 items-center gap-[clamp(28px,4vw,74px)] md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {/* ---- div.rv-l : kicker + headline ------------------------------ */}
        <Reveal variant="left" className="min-w-0">
          {/* case=UPPER in the source - stored "Privacy & confidentiality",
              rendered PRIVACY & CONFIDENTIALITY. .kick's own margin-bottom is
              clamp(22px,2.2vw,32px); it is a margin rather than a column gap
              because .rv-l is a plain block in the source, and the two blocks
              below it in the right column space themselves the same way. */}
          <Kicker tone="eden" className="mb-[clamp(22px,2.2vw,32px)]">
            Privacy &amp; confidentiality
          </Kicker>

          {/* The page's recurring two-typeface turn: Figtree 400 at
              clamp(31px,3.5vw,55px) for the statement, then Cormorant Garamond
              500 italic for the answer. The italic is sized 1.1em - RELATIVE, so
              it tracks the clamp at every width; hard-coding a second clamp
              (which the trace did) desynchronises the two voices in the middle
              of the range. Heading already supplies the family, style, weight
              and the tracking reset to 0 for <em>; only the size is ours.

              .h2 is weight 400, tracking -.03em (a shade lighter than Heading's
              default -.035em) and tops out at 55, not Heading's 50.4 - that 50.4
              is the FRAME's measured cap, and using it here shrinks the whole
              statement ~8% at desktop. max-width:15ch plus text-wrap:balance are
              what produce the designer's three even lines. */}
          <Heading
            html="Your DNA is deeply personal. <em>We treat it that way.</em>"
            className="max-w-[15ch] text-balance text-[clamp(31px,3.5vw,55px)] font-normal tracking-[-0.03em] text-bistre [&_em]:text-[1.1em]"
          />
        </Reveal>

        {/* ---- div.rv (--rd:.08s) : chips, caveat, CTA -------------------- */}
        <Reveal delay={0.08} className="min-w-0">
          {/* .chips - gap 10, margin-bottom 24. Plain wrapping row, not a grid:
              the 2 + 1 break at 1440 is just the chips' own widths against the
              .9fr column. */}
          <ul className="mb-6 flex list-none flex-wrap gap-[10px]">
            {ASSURANCES.map((a) => (
              <li key={a.label} className="min-w-0">
                <Chip
                  tone="light"
                  icon={a.icon}
                  // Overrides against Chip's light tone, all from .chips li:
                  //  - zeroed border + a 1.5px inset ring at 22% eden
                  //  - the symmetric horizontal padding is zeroed FIRST so
                  //    twMerge drops it, letting the source's asymmetric
                  //    12/20/12/16 survive intact
                  //  - label is Figtree 700 at a flat 16 (not clamped - the
                  //    source never shrinks it) on the inherited 1.62 leading,
                  //    which is what makes the box 49.9 tall and clears the
                  //    44px tap-target floor
                  //  - the glyph carries opacity .7 and lifts to 1 on hover
                  // Hover, box and glyph on the SAME .77s `--e-soft` clock (they
                  // are one gesture; at this duration any drift between them is
                  // immediately visible): fill to 6% eden, ring to 50%, the chip
                  // rises 3px, the glyph goes to full opacity and scales 1.12.
                  //
                  // Every class below is written out in full rather than shared
                  // through a const - Tailwind scans raw file text, so a class
                  // assembled by interpolation is never emitted at all.
                  className={[
                    'gap-[10px] border-0 bg-transparent px-0 py-3 pl-4 pr-5',
                    'text-[16px] font-bold leading-[1.62] tracking-[-0.008em]',
                    'ring-[1.5px] ring-inset ring-eden/[0.22]',
                    'transition-[background-color,box-shadow,transform] duration-[770ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
                    'hover:-translate-y-[3px] hover:bg-eden/[0.06] hover:ring-eden/50',
                    '[&_img]:opacity-70 [&_img]:transition-[opacity,transform] [&_img]:duration-[770ms] [&_img]:ease-[cubic-bezier(0.16,1,0.3,1)]',
                    'hover:[&_img]:scale-[1.12] hover:[&_img]:opacity-100',
                  ].join(' ')}
                >
                  {a.label}
                </Chip>
              </li>
            ))}
          </ul>

          {/* .priv__c - Figtree 400 17.5/1.62 in --ink-3 (#5c6b68 = nevada),
              measure capped at 52ch, margin-bottom 26. Flat 17.5 and no forced
              break: the source lets it reflow, and the trace's hard break after
              "every" stranded a two-word line on anything narrower than 1440.
              Tracking is left alone - the rule sets none, so it takes the body's
              -.005em, which is exactly what Body already applies. */}
          <Body className="mb-[26px] max-w-[52ch] text-[17.5px] leading-[1.62] text-nevada">
            Genes can reveal valuable information. They don’t determine every aspect of your health or future.
          </Body>

          {/* .btn.btn--ghost. `ghostLight` is the matching variant - transparent
              on a light ground - and needs only the source's exact numbers on
              top: a 1.5px inset ring at 26% rising to 55%, a 5.5% eden fill on
              hover, the shared .btn lift of 3px, and the ghost's own soft drop
              shadow. Radius stays 10; this is not a pill even though the chips
              beside it are.

              The target is section 11, which sits directly above - its <section>
              id is "science-and-trust" (with the "and"), so the href must match
              verbatim or the jump silently does nothing. */}
          <Cta
            href="#science-and-trust"
            variant="ghostLight"
            icon="13099-1046"
            className="ring-[1.5px] ring-eden/[0.26] hover:-translate-y-[3px] hover:bg-eden/[0.055] hover:shadow-[0_12px_30px_rgba(14,77,75,0.12)] hover:ring-eden/55"
          >
            Our Science &amp; Standards
          </Cta>
        </Reveal>
      </div>
    </Section>
  );
}
