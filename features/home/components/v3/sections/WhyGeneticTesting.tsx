// =============================================================================
// features/home/v3 - WHY GENETIC TESTING
// -----------------------------------------------------------------------------
// A v3-OWNED replacement for `../../v2/sections/WhyGeneticTesting`. It exists as
// its own file for one reason: /homepage and / share every other section, so
// editing the v2 one would have changed the live homepage too. Only HomeV3
// imports this. The v2 section is untouched and still renders on /.
//
// WHAT THE v2 SECTION DID, AND WHY IT IS GONE
//
// The questions were a LADDER: six rows, each indented one step further than the
// one above, with a teal leader line drawn back across the indent and a 7px dot
// parked at the far right of every row. Three things went wrong with it on
// screen, and they compounded:
//
//   · The staircase read as broken alignment, not as a designed descent. Six
//     ragged left edges look like a layout bug long before they look like a
//     device.
//   · The dots sat at the row's right edge while the row's hairline faded out
//     at 92% - so every dot floated in space, past the end of its own rule.
//   · Between the end of a short question ("How am I aging?") and its dot lay
//     400px of nothing. Six rows of that is most of the section's width.
//
// WHAT REPLACED IT: a BOARD. One grid, hairline gaps, no ragged edges, no
// leaders, no dots. The portrait is a cell of that grid rather than a plate
// stranded in the side column, and it spans all three question rows, so the
// board is flush on both sides - the void the ladder opened cannot exist here,
// because there is no space in the grid that is not a cell.
//
// The 1px lines are the GAP, not borders: `gap-px` over a hairline-coloured
// ground, with `p-px` adding the outer frame. Borders on each cell would double
// up wherever two cells meet and paint 2px lines everywhere except the edges.
//
// SPACING. Every value here is tighter than the v2 section's: the section pad
// steps down from clamp(84,10vw,168) to clamp(56,6vw,112), the header gutter
// from 84 to 44, and the beat between blocks from 96+46 to a single 48. Note
// that this makes the section BREATHE DIFFERENTLY from its neighbours on
// /homepage, which all still carry the page's 10vw rhythm. That is a deliberate
// trade for the density asked for, not an oversight - if the rest of the page
// follows later, the value to match is the one in `Section`.
//
// LEADING IS SPELT OUT ON EVERY TYPE BLOCK HERE. `Heading` and `Kicker` set
// their own `leading-*`, but tailwind-merge deletes it the moment a call site
// passes `text-[…]`: it groups `text-[…]` as font-size, and font-size conflicts
// with `leading` in its table because Tailwind's own `text-lg/7` shorthand sets
// both. So `cn('text-[30px] leading-[1.14]', 'text-[52px]')` returns the size
// ALONE, the browser falls back to Figtree's `normal` (~1.45), and the headline
// silently renders a fifth taller than it should. Passing an explicit
// `leading-*` alongside the size is what keeps it.
// =============================================================================

import { Reveal } from '../../v2/motion';
import { AssetSlot, Cta, Heading, Kicker, PHOTO, Section } from '../../v2/ui';

/** The six questions, in reading order: 01 02 / 03 04 / 05 06. */
const QUESTIONS: { n: string; q: string }[] = [
  { n: '01', q: 'Why does my body respond differently?' },
  { n: '02', q: 'What have I inherited?' },
  { n: '03', q: 'Could I pass something on?' },
  { n: '04', q: 'What does my family history mean for me?' },
  { n: '05', q: 'Where did I come from?' },
  { n: '06', q: 'How am I aging?' },
];

/** The page's own rule colour, as a fill - the board's gaps are drawn in it. */
const HAIRLINE = 'bg-[rgba(27,23,18,0.12)]';

export default function WhyGeneticTesting() {
  return (
    <Section
      // The v3 hero's scroll cue and the v2 sections both point at this id, so
      // it stays exactly as it is.
      id="why-genetic-testing"
      ground="cream"
      innerClassName="py-[clamp(56px,6vw,112px)]"
    >
      {/* ---- the header ----------------------------------------------------
          Two equal columns, BOTTOM-aligned. The quote used to close the section
          from its own row 140px below the questions; as a lede sitting on the
          headline's baseline it does the same work and costs no height at all.
          items-end is what makes that read as one line of type rather than two
          blocks that happen to be side by side. */}
      <div className="grid grid-cols-1 items-end gap-[clamp(22px,2.4vw,44px)] lg:grid-cols-2">
        <Reveal variant="left">
          <Kicker tone="eden" className="mb-[clamp(12px,1.2vw,18px)]">
            Why genetic testing?
          </Kicker>

          {/* 19ch, not the v2 section's 13ch. 13ch stacked this into five short
              lines, which is what made the side column ~800px tall and opened
              the hole the board now fills. Three lines here. */}
          <Heading
            html="Some questions are worth asking <em>before life asks them for you.</em>"
            className="max-w-[19ch] text-[clamp(30px,3.3vw,52px)] leading-[1.05] tracking-[-0.03em] text-balance [&_em]:text-[1.06em]"
          />
        </Reveal>

        <Reveal delay={0.08} className="lg:pb-[5px]">
          <blockquote className="font-kyg text-[clamp(20px,1.85vw,27px)] font-light leading-[1.22] tracking-[-0.022em] text-balance text-nevada">
            <span
              aria-hidden="true"
              className="mb-[clamp(13px,1.3vw,18px)] block h-[2px] w-[56px] rounded-sm bg-eden opacity-50"
            />
            Your DNA may not answer every question.
            {/* Cormorant 600 italic, teal, on its own line - the turn. */}
            <b className="block font-tst text-[1.12em] font-semibold italic tracking-normal text-eden">
              But it can help you ask better ones.
            </b>
          </blockquote>
        </Reveal>
      </div>

      {/* ---- the board ------------------------------------------------------
          ONE Reveal for the whole grid, not one per cell: the cells share
          hairlines, and staggering them would have the lines assemble in pieces
          while the boxes fade in under them.

          The portrait is the first grid item and spans all three rows, so the
          six questions auto-place into columns 2 and 3 - 01 02 / 03 04 / 05 06,
          reading order intact. Its column is the NARROW one (0.72fr against two
          1fr tracks) so that three question rows come out roughly square
          against it: at a 1000px rail the cell is 264 x ~308 and at 1600 it is
          423 x ~386. Both are close enough to the plate's native 4:5 that
          object-cover barely crops it, and the crop it does take is biased to
          32% from the top, where the face is. */}
      <Reveal delay={0.14} className="mt-[clamp(28px,2.8vw,48px)]">
        <div
          className={`grid gap-px overflow-hidden rounded-sm p-px lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)_minmax(0,1fr)] ${HAIRLINE}`}
        >
          {/* Below lg the board is a single column, so the plate needs a height
              of its own - `fill` cannot derive one from a row it no longer
              spans. It renders on phones now; in v2 it was desktop-only because
              at one column it would have split the ladder in half, and there is
              no ladder left to split. */}
          <AssetSlot
            title="Editorial Portrait"
            meta="Woman in her thirties, mid-thought, window light · 900 × 1120 · 4:5"
            path="assets/why-portrait.jpg"
            photo={PHOTO.why}
            alt="A woman pausing mid-morning, thinking about a question"
            sizes="(max-width: 1023px) 100vw, 28vw"
            className="aspect-[4/5] w-full bg-linenw [&_img]:object-[50%_32%] lg:aspect-auto lg:row-span-3"
          />

          {/* `contents` makes the <li>s the grid items so they sit in the board
              rather than in a box inside one cell of it. role="list" restores
              the semantics that display:contents strips off a <ul>/<ol>. */}
          <ol role="list" aria-label="Questions genetic testing can help you ask" className="contents">
            {QUESTIONS.map((item) => (
              <li
                key={item.n}
                className="group flex flex-col gap-[9px] bg-linenw p-[clamp(18px,1.55vw,26px)] transition-colors duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[rgba(14,77,75,0.05)]"
              >
                {/* Hind 600, tabular - every numeral on one stem, so the six
                    read as a set rather than as six unrelated labels. */}
                <span className="font-kyg-num text-[12.5px] font-semibold leading-none tracking-[0.16em] text-pewter tabular-nums transition-colors duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-eden">
                  {item.n}
                </span>
                <p className="font-kyg text-[clamp(16.5px,1.42vw,21px)] font-medium leading-[1.3] tracking-[-0.018em] text-bistre">
                  {item.q}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* ---- the CTA --------------------------------------------------------
          Under the board and left-aligned, on the same edge as everything above
          it. In v2 it was `justify-self-end` in its own 0.65fr track, which
          parked it against the far right of the page with ~400px of cream
          between it and the sentence it answers. */}
      <Reveal delay={0.2} className="mt-[clamp(22px,2.2vw,36px)]">
        <Cta
          href="/categories"
          icon="2185-1191"
          className="bg-eden text-linenw shadow-[0_6px_18px_0_rgba(14,77,75,0.18)]"
        >
          Explore Genetic Testing
        </Cta>
      </Reveal>
    </Section>
  );
}
