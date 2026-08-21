// =============================================================================
// Homepage - SECTION 13 · BORN IN INDIA
// -----------------------------------------------------------------------------
// Rebuilt against the designer's own build ("New Homepage Build/index.html",
// `section.ind`, CSS at 1100-1125, markup at 1989), which is the page the Figma
// frame was traced from. Where the two disagree the HTML wins, because it is the
// executable version.
//
// GROUND - TWO paints, not one. The frame flattens them into a single diagonal
// ramp, which is why this section used to carry a lone 135deg linear:
//   radial 62% 52% at 22% 26%   #f8e4cc @0.9 -> transparent 68%
//   linear 150deg               #edddb8 -> #f8e4cc 52% -> #f5eddf
// The radial is a peach bloom offset into the UPPER-LEFT quadrant, so folding it
// into the linear's mid stop (what the flattened trace implies) moves the
// brightest point to the middle of the section and leaves the top-left corner
// reading as flat khaki. Keep them as two stacked paints.
//
// `overflow:clip` on the section is load-bearing: the map's glow is 120% of the
// figure on both axes, and on a narrow viewport that overhang would otherwise
// give the whole document a horizontal scrollbar.
//
// SECTION RHYTHM is deliberately NOT the source's `--sp-sec`
// (clamp(84px,10vw,168px)). Every other section in this build ships
// clamp(64px,10vw,144px) - the middle term is identical, so the two agree at the
// 1440 design width and only diverge below ~840 and above ~1680. Changing the
// page's vertical rhythm in one section would make this the only block on a
// 16,000px page with a different beat.
// =============================================================================

import Image from 'next/image';

import { Body, Heading, Kicker } from '../ui';
import { Reveal } from '../motion';

/**
 * ul.ind__l - the four "this is for…" lines.
 *
 * `rd` is the source's own per-row `--rd`, i.e. the reveal's transition-delay in
 * seconds. It is stamped literally (0.10 / 0.14 / 0.18 / 0.22) rather than
 * computed from the index so the emitted style stays free of float noise like
 * `0.14000000000000001s`.
 */
const AUDIENCE: { line: string; rd: number }[] = [
  { line: 'To someone discovering personalized wellness at 25.', rd: 0.1 },
  { line: 'To a couple planning their future.', rd: 0.14 },
  { line: 'To a family trying to understand what runs through generations.', rd: 0.18 },
  { line: 'To someone simply curious about where they came from.', rd: 0.22 },
];

/**
 * The source's tapering hairline (`--line` 0% -> `--line` 34% -> 0 at 92%), used
 * on every row's bottom edge. Written once because border-image is long enough
 * that four inline copies would bury the rest of the row's styling.
 *
 * NOTE the companion `border-transparent`: `border-b` only sets a WIDTH, and if
 * the border-image ever fails to resolve the edge falls back to border-color,
 * which without this would be currentColor - a hard ink rule across the row.
 */
const ROW_RULE =
  '[border-image:linear-gradient(90deg,rgba(27,23,18,0.11)_0%,rgba(27,23,18,0.11)_34%,rgba(27,23,18,0)_92%)_1]';

export default function BornInIndia() {
  return (
    <section
      id="born-in-india"
      aria-labelledby="born-in-india-heading"
      className="relative scroll-mt-20 overflow-clip bg-[radial-gradient(62%_52%_at_22%_26%,rgba(248,228,204,0.9),transparent_68%),linear-gradient(150deg,#edddb8_0%,#f8e4cc_52%,#f5eddf_100%)] px-5 py-[clamp(84px,10vw,168px)] text-bistre sm:px-8 lg:px-[63px]"
    >
      {/* .ind__g - minmax(0,.86fr) / minmax(0,1.14fr), gap clamp(30,4.4vw,84).
          The source collapses to one column at max-width:900px; that lands
          between Tailwind's md (768) and lg (1024), and an arbitrary min-width
          variant would be emitted BEFORE the named ones and always lose, so the
          switch is lg. The minmax(0,…) is not decoration - without it a long
          unbroken word in the copy column can blow the track past its share. */}
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-[clamp(30px,4.4vw,84px)] lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
        {/* ---- figure.ind__map -----------------------------------------------
            The map is real artwork, not a placeholder: public/home/brand/
            map-india-teal.png, a 1000 x 1000 export. The source sets
            `width:min(100%,440px)` with `max-width:320px` under 900, so the two
            widths are written against the same lg switch as the grid.

            `isolate` reproduces what the source only gets by accident. Its
            ::after is `z-index:-1` inside a `position:relative` figure with no
            z-index of its own, so the glow belongs to the ROOT stacking context
            and paints beneath the section's opaque ground - invisible. Scoping
            it to the figure puts it where the design clearly intends: behind the
            map, over the ground. (Reveal's will-change already forces a stacking
            context here, but relying on that is a trap for whoever edits it
            next.) */}
        <Reveal
          as="figure"
          variant="scale"
          className="relative isolate w-[min(100%,320px)] justify-self-center lg:w-[min(100%,440px)]"
        >
          <Image
            src="/home/brand/map-india-teal.png"
            alt="Map of India"
            width={1000}
            height={1000}
            // width:100% + height:auto, exactly as the source has it - the
            // square export then sets the figure's height, which is what the
            // 120% glow below is measured against.
            sizes="(max-width: 1024px) 320px, 440px"
            className="h-auto w-full opacity-[0.94]"
          />
          {/* '::after' - 120% x 120%, centred, radius 50%, a 9%-opacity teal
              circle fading out at 66%. It is the ground shadow the artwork sits
              on; the radius is 50% (an ellipse of the box) and NOT 999, so it
              stays rounded-sm even though the box is square today. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-[-1] h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-sm bg-[radial-gradient(circle,rgba(14,77,75,0.09),transparent_66%)]"
          />
        </Reveal>

        {/* ---- copy column ---------------------------------------------------
            Spacing is the source's own margins, kept as margins rather than
            re-expressed as a flex gap: the values differ per block (32 under the
            kicker, 20 over the lead, 32 around the list, 34 under the ambition
            line) and a gap would flatten them to one number. */}
        <div className="min-w-0">
          {/* Figtree 800 16.5/20.5 ls .13em, textCase=UPPER, fill #0e4d4b. The
              string is stored sentence-case and renders "BORN IN INDIA". */}
          <Reveal className="mb-[clamp(22px,2.2vw,32px)]">
            <Kicker tone="eden">Born in India</Kicker>
          </Reveal>

          {/* h2 - Figtree 400 clamp(31,3.5vw,55)/1.14 ls -.03em, text-wrap
              balance, with a Cormorant Garamond 500 italic run at 1.1em. The
              serif is sized up because Cormorant reads visibly smaller than
              Figtree at equal px; dropping the bump breaks the pairing at every
              clamp step. The Heading primitive's defaults (50.4 cap, -0.035em)
              are the flattened Figma numbers, so both are overridden here.

              The id lives on a wrapper because <Heading> takes no `id` prop and
              ui.tsx is shared - this section is not the place to widen its API.
              aria-labelledby resolves the name from the subtree, so the wrapper
              names the region with the heading's own text. */}
          <Reveal delay={0.04}>
            <div id="born-in-india-heading">
              <Heading
                as="h2"
                html={'Born in India. <em>Built for every body.</em>'}
                className="text-balance text-[clamp(31px,3.5vw,55px)] font-normal tracking-[-0.03em] [&_em]:text-[1.1em]"
              />
            </div>
          </Reveal>

          {/* p.lead - Figtree 400 clamp(19,1.45vw,24)/1.46 ls -.015em, #33403d */}
          <Reveal delay={0.08} className="mt-[20px]">
            <p className="font-kyg text-[clamp(19px,1.45vw,24px)] font-normal leading-[1.46] tracking-[-0.015em] text-corduroy">
              Genetics belongs to everyone.
            </p>
          </Reveal>

          <ul className="my-[clamp(22px,2.4vw,32px)] list-none">
            {AUDIENCE.map(({ line, rd }) => (
              // Each row is its own reveal in the source (`li.rv`), which is
              // what makes the four lines arrive as a cascade rather than as one
              // block. The bottom rule is drawn on every row, the last included.
              <Reveal
                key={line}
                as="li"
                delay={rd}
                className={`relative border-b border-transparent py-[13px] pl-[30px] font-kyg text-[18px] font-medium leading-[1.5] text-corduroy ${ROW_RULE}`}
              >
                {/* '::before' - 14 x 1.5 dash, #0e4d4b @0.6, sitting in the 30px
                    gutter. `top:1.32em` pins it to the FIRST line's optical
                    centre rather than the row's, so it stays beside the text
                    when a row wraps to two lines on a narrow screen. */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[1.32em] block h-[1.5px] w-[14px] bg-eden opacity-60"
                />
                {line}
              </Reveal>
            ))}
          </ul>

          {/* p.ind__amb - Figtree 400 18/1.62, #5c6b68, measure capped at 56ch.
              The source sets no manual break here; the 56ch measure is what
              decides where the line turns, at every width. */}
          <Reveal delay={0.26} className="mb-[clamp(24px,2.6vw,34px)]">
            <Body className="max-w-[56ch] text-[18px] leading-[1.62] text-nevada">
              Our ambition is to make genetic science more understandable, responsible and accessible.
            </Body>
          </Reveal>

          {/* div.ind__close - no gap, the two lines deliberately touching.
              The second line is `p + p`, and TWO rules in the source match it at
              equal specificity: the shared serif-accent rule (Cormorant, italic,
              500, ls 0) and .ind__close's own (1.1em, 600, teal). The later rule
              wins per-property, so the outcome is Cormorant italic 600 with
              tracking reset - hence font-semibold AND tracking-normal here.

              19.8px is not a guess: `font-size:1.1em` resolves against the
              PARENT (div.ind__close), which inherits the 18px body size - not
              against the 36px line above it. That deliberate drop from the first
              line to the second is the whole gesture of the close. */}
          <Reveal delay={0.3}>
            <p className="font-kyg text-[clamp(22px,2.4vw,36px)] font-light leading-[1.16] tracking-[-0.028em] text-bistre">
              India is where we begin.
            </p>
            <p className="font-tst text-[19.8px] font-semibold italic leading-[1.16] tracking-normal text-eden">
              The world is where we&rsquo;re going.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
