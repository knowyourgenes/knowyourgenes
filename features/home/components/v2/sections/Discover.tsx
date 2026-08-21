// =============================================================================
// Homepage - SECTION 05 · DISCOVER WHAT'S RIGHT FOR YOU
// -----------------------------------------------------------------------------
// Ported against the designer's build (`New Homepage Build/index.html`,
// `.disc` block at CSS ~718-762, markup at 1501). The Figma frame was traced
// FROM that page, so where the two disagree the HTML wins - which here only
// means the responsive bounds, since at 1440 every clamp lands exactly on the
// number the frame reports (5vw = 72 numeral, 1.6vw = 23 gutter, 1.75vw = 25.2
// heading, 4vw = 57.6 column gap).
//
// Ground is #f5eddf - a shade DEEPER than the cream token (linenw #faf6ef) the
// neighbouring sections use. That hex is already tokenised as `sand`, so
// `ground="cream"` supplies the shell (rail, gutters, bistre ink) and `bg-sand`
// swaps only the fill.
//
// One 1313 shell (x=63) split into two columns that share a top edge:
//   side  0.76fr  (476.9 at 1440)  kicker · two-voice headline · body · CTA
//   rows  1.24fr  (778.4 at 1440)  six stacked "Component 9" rows
// The side column is STICKY: it pins under the header and the six rows scroll
// past it, which is what makes the section read as an index rather than as two
// unrelated stacks. It only stops while the ladder keeps going below lg, where
// the source drops the stickiness too.
//
// ROW ANATOMY (every row identical, only the copy length changes):
//   a fading 1px rule on top - a gradient border-image, NOT a flat line
//   numeral col clamp(50,5vw,78) · gutter clamp(14,1.6vw,26) · body · 34 arrow
//   whole-row hover: the ground lifts to 78% linenw, the row indents, the
//   numeral warms to java, the heading goes eden, the icon chip flips solid and
//   tilts, and the parked arrow slides in and fills.
//
// RADIUS: one radius site-wide - rounded-sm. See docs/DESIGN.md §2.
// it reads as a circle without being a 999 capsule). Both explicit.
//
// ICON NOTE: the row hover circle's own ids (2613-1324 …) all dedupe to a
// CREAM-stroked arrow file, which would be invisible on this ground, so the
// circle reuses the row's eden text-link arrow - same glyph, correct paint.
// =============================================================================

import Link from 'next/link';

import { Body, Cta, Kicker, Section } from '../ui';
import { HomeIcon } from '../HomeIcon';
import { Reveal } from '../motion';

type DiscoverRow = {
  /** The frame's own numeral - displayed, not derived from the index. */
  n: string;
  /** 19x19 stroked glyph inside the 38px tinted tile. */
  icon: string;
  title: string;
  desc: string;
  cta: string;
  /** 20x20 eden arrow that trails the text link (and fills the hover circle). */
  arrow: string;
  href: string;
  /** the source's `--rd` reveal delay for this row, in seconds */
  rd: number;
};

/**
 * The six "where do I want answers" rows, top to bottom.
 *
 * Only wellness and ancestry have real category routes today; the other four
 * intents have no landing page yet and point at the /categories hub rather than
 * shipping a 404. See `escalate` - these want real destinations.
 */
const ROWS: DiscoverRow[] = [
  {
    n: '01',
    icon: '2559-714',
    title: 'I want to feel better.',
    desc: 'Understand your nutrition, fitness, weight, metabolism, vitamins, sleep, stress and everyday wellness.',
    cta: 'Explore Wellness',
    arrow: '2674-837',
    href: '/categories/wellness',
    rd: 0.02,
  },
  {
    n: '02',
    icon: '2780-714',
    title: 'We’re planning our future together.',
    desc: 'Explore carrier screening and reproductive genetics to make more informed decisions as you plan a family.',
    cta: 'Explore Reproductive Genetics',
    arrow: '2895-939',
    href: '/categories',
    rd: 0.06,
  },
  {
    n: '03',
    icon: '3001-714',
    title: 'I want to understand what runs in my family.',
    desc: 'Explore genetic predispositions associated with hereditary cancers, cardiac conditions, hypertension, kidney health, eye health and more.',
    cta: 'Explore Health Tests',
    arrow: '3116-863',
    href: '/categories',
    rd: 0.1,
  },
  {
    n: '04',
    icon: '3221-714',
    title: 'I want to know where I come from.',
    desc: 'Discover your ancestry, origins and inherited traits.',
    cta: 'Explore Ancestry',
    arrow: '3308-839',
    href: '/categories/wellness/ancestry',
    rd: 0.14,
  },
  {
    n: '05',
    icon: '3414-714',
    title: 'I want to understand how I’m aging.',
    desc: 'Explore longevity, telomeres, epigenetic age and insights associated with healthy aging.',
    cta: 'Explore Longevity',
    arrow: '3529-846',
    href: '/categories',
    rd: 0.18,
  },
  {
    n: '06',
    icon: '3635-714',
    title: 'I have a specific health concern.',
    desc: 'Explore our range of clinical and specialty genetic tests.',
    cta: 'Explore Clinical Tests',
    arrow: '3722-868',
    href: '/categories',
    rd: 0.22,
  },
];

/**
 * The source's `.fade-t` rule, which every `.drow` carries.
 *
 * This is NOT a flat hairline: it is a gradient `border-image` that holds
 * rgba(27,23,18,.11) for the first 34% of the row and then fades to nothing by
 * 92%, so the ladder's rules taper out instead of butting into the right
 * gutter. That is the difference between "a table" and "an index".
 *
 * It has to be an inline style rather than a utility because `border-image`
 * takes a gradient plus a slice, and `Reveal` already owns the element's
 * `style` - hence it lands on the inner row box, which is also what carries the
 * padding and the hover ground, exactly like `.drow` itself does.
 */
const FADE_RULE = 'linear-gradient(90deg, rgba(27,23,18,0.11) 0%, rgba(27,23,18,0.11) 34%, rgba(27,23,18,0) 92%) 1';
const RULE_TOP: React.CSSProperties = {
  borderStyle: 'solid',
  borderWidth: '1px 0 0',
  borderImage: FADE_RULE,
};
/** the last row closes the ladder with a matching rule underneath */
const RULE_BOTH: React.CSSProperties = {
  borderStyle: 'solid',
  borderWidth: '1px 0',
  borderImage: FADE_RULE,
};

export default function Discover() {
  return (
    <Section
      id="discover-whats-right-for-you"
      ground="cream"
      // The frame fills this section #f5eddf, which is NOT linenw (#faf6ef).
      // That hex already has a token - `sand`, sampled from the test pages'
      // TRUST gradient - so it is reused rather than hard-coded. `cn` is
      // tailwind-merge, so this bg wins over the `cream` ground's bg-linenw
      // while that ground's text-bistre survives.
      className="bg-sand"
      // frame pad is 144 top and bottom (10vw at 1440)
      innerClassName="py-[clamp(84px,10vw,168px)]"
    >
      {/* minmax(0,…) rather than a bare fr on both tracks: an fr track floors at
          min-content, so one long unbreakable row heading would otherwise push
          the ladder wider than its share and overflow the shell. */}
      <div className="grid grid-cols-1 gap-[clamp(30px,4vw,84px)] lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)]">
        {/* ---- side column ------------------------------------------------
            Frame gap between all four children is 19; the headline carries a
            13 top pad and the body a 14 bottom pad on top of that, which
            reproduces the source's 32 / 20 / 32 stack of margins.

            rv-l in the source: the copy slides in from the left while the rows
            rise, so the two columns do not arrive as one slab.

            Sticky top is 108 = the site header's real 64px plus the source's
            own 44 of breathing room. The source says calc(--hdr-h + 44) where
            --hdr-h is 92, but that is ITS header; pinning to 136 here would
            leave a visible gap under our shorter one. */}
        <Reveal variant="left" className="flex min-w-0 flex-col gap-[19px] lg:sticky lg:top-[108px] lg:self-start">
          <Kicker tone="eden">Discover what’s right for you</Kicker>

          {/* Two voices in one heading, as in section 04: Figtree 400 50.4/57.5
              states it, Cormorant Garamond 500 italic 55.4/63.2 turns it. The
              frame's line gap is 0, so no margin between the two spans. */}
          <h2 className="pt-[13px] font-kyg text-[clamp(32px,3.5vw,50.4px)] font-normal leading-[1.14] tracking-[-0.03em] text-bistre">
            Whatever stage
            <br className="hidden sm:inline" /> of life you’re in,
            <span className="block font-tst text-[clamp(34px,3.85vw,55.4px)] font-medium italic leading-[1.14] tracking-normal">
              there’s more to know.
            </span>
          </h2>

          {/* 378 of text in a 392 box - the break is authored, not a wrap. */}
          <Body className="max-w-[392px] pb-[14px] text-nevada">
            You don’t need to understand genetics to know
            <br className="hidden sm:inline" /> where you want answers.
          </Body>

          {/* 277 x 58, radius 10, eden fill + the frame's teal drop shadow.
              self-start keeps it at its intrinsic width inside the flex column
              instead of stretching to the rail. */}
          <Cta
            href="/categories"
            icon="2874-290"
            className="self-start bg-eden text-linenw shadow-[0_6px_18px_0_rgba(14,77,75,0.18)]"
          >
            Explore Genetic Testing
          </Cta>
        </Reveal>

        {/* ---- the six rows ------------------------------------------------
            Each row is its own reveal, staggered 0.02 → 0.22 by the source's
            --rd, so the ladder assembles top-down instead of appearing whole. */}
        <ol className="flex list-none flex-col">
          {ROWS.map((row, i) => (
            <Reveal
              as="li"
              key={row.n}
              delay={row.rd}
              // `group` is on the li, not the padded box, so EVERY hover state
              // below - chip, numeral, heading, arrows, ground - fires from one
              // pointer test. group-focus-within stands in for the source's
              // `.ic-h:focus-visible`: there the whole row is the anchor, here
              // the text link is, so keyboard focus has to be relayed up.
              className="group min-w-0"
            >
              <div
                style={i === ROWS.length - 1 ? RULE_BOTH : RULE_TOP}
                // Padding and columns are the source's, verbatim. The left pad
                // GROWS on hover (6→12 min, 12→24 max) - the row physically
                // steps toward the reader; that indent is the section's whole
                // hover idea and the transition is what keeps it from twitching.
                className="grid grid-cols-[clamp(42px,9vw,60px)_minmax(0,1fr)] items-start gap-x-[clamp(14px,1.6vw,26px)] gap-y-0 py-[clamp(24px,2.6vw,36px)] pl-[clamp(6px,0.8vw,12px)] pr-[clamp(10px,1.2vw,18px)] transition-[background-color,padding-left] duration-790 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-linenw/78 group-hover:pl-[clamp(12px,1.6vw,24px)] group-focus-within:bg-linenw/78 group-focus-within:pl-[clamp(12px,1.6vw,24px)] lg:grid-cols-[clamp(50px,5vw,78px)_minmax(0,1fr)_34px]"
              >
                {/* tabular-nums keeps 01…06 on one optical column - Figtree's
                    proportional 1 is narrow enough to visibly shift the pair.
                    The source asks for weight 200; only 300+ is loaded in
                    app/layout.tsx (and the frame measured 300), so 300 is the
                    honest floor rather than a synthesised face. */}
                <span className="font-kyg text-[clamp(26px,2.9vw,42px)] font-light leading-[0.9] tracking-[-0.04em] tabular-nums text-pewter transition-colors duration-580 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-java group-focus-within:text-java">
                  {row.n}
                </span>

                <div className="flex min-w-0 flex-col gap-[12px]">
                  <div className="flex min-w-0 items-center gap-[15px]">
                    {/* 38px tile, radius 11, eden at 8%. The shared `.ic-h`
                        hover: the chip goes solid eden, lifts 4 and tilts -5deg
                        under a teal-tinted shadow. Both durations in the source
                        are 0.83/0.85s; they are collapsed to 850ms because a
                        20ms split across two properties on the same element is
                        below the threshold of perception and splitting it costs
                        a second arbitrary transition declaration.

                        The property list names `translate` and `rotate`, NOT
                        `transform`: Tailwind v4 compiles the movement utilities
                        to the individual CSS properties, so a hand-written
                        transition-[transform] list animates nothing here. */}
                    <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-sm bg-eden/[0.08] transition-[background-color,translate,rotate,box-shadow] duration-850 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:rotate-[-5deg] group-hover:bg-eden group-hover:shadow-[0_12px_26px_rgba(14,77,75,0.26)] group-focus-within:-translate-y-1 group-focus-within:rotate-[-5deg] group-focus-within:bg-eden group-focus-within:shadow-[0_12px_26px_rgba(14,77,75,0.26)] motion-reduce:transition-none">
                      {/* HomeIcon serves a static <img>, so the source's
                          `color:var(--c-cream)` on the hovered chip cannot be
                          inherited - the eden stroke is baked into the file.
                          brightness(0) flattens every painted pixel to black
                          (alpha untouched) and invert(1) lifts it to white,
                          which is the only way to recolour an <img> glyph. The
                          identity filter is declared explicitly so the change
                          interpolates instead of snapping from `none`. */}
                      <HomeIcon
                        id={row.icon}
                        className="h-[19px] w-[19px] filter-[brightness(1)_invert(0)] transition-[scale,filter] duration-850 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.12] group-hover:filter-[brightness(0)_invert(1)] group-focus-within:scale-[1.12] group-focus-within:filter-[brightness(0)_invert(1)] motion-reduce:transition-none"
                      />
                    </span>
                    <h3 className="min-w-0 font-kyg text-[clamp(23px,1.75vw,29px)] font-bold leading-[1.16] tracking-[-0.022em] text-bistre transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-eden group-focus-within:text-eden">
                      {row.title}
                    </h3>
                  </div>

                  {/* 17.5 flat, not a clamp: the source never scales this down,
                      and the 56ch cap only binds above ~1500 - under that the
                      body track is already the narrower constraint (597.5 at
                      1440, which is the 597.7 the frame reports). */}
                  <p className="max-w-[56ch] font-kyg text-[17.5px] font-normal leading-[1.6] tracking-[-0.005em] text-nevada">
                    {row.desc}
                  </p>

                  {/* w-fit so the hit area is the label, not the whole column */}
                  <Link
                    href={row.href}
                    // min-h-11 (44px) is a TAP TARGET floor, not styling. Measured
                    // at 27px tall before, which is under the 44px minimum and the
                    // smallest interactive element on the page. The negative top
                    // margin absorbs the extra height so the frame's 4px gap above
                    // the link is unchanged - the row does not grow.
                    className="-mb-[8px] -mt-[8px] inline-flex min-h-11 w-fit items-center gap-[9px] pt-[4px] font-kyg text-[16px] font-bold leading-[1.62] tracking-[-0.008em] text-eden"
                  >
                    <span className="min-w-0">{row.cta}</span>
                    {/* the arrow answers to the ROW, not to itself: in the
                        source the row is the anchor, so hovering anywhere in it
                        walks this arrow 5px right. */}
                    <HomeIcon
                      id={row.arrow}
                      className="h-5 w-5 shrink-0 transition-transform duration-640 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[5px] group-focus-within:translate-x-[5px] motion-reduce:transition-none"
                    />
                  </Link>
                </div>

                {/* The frame's op=0.0 circle: a 34px ring (INNER_SHADOW 1px at
                    11% ink) parked 8px left of its slot, which slides home and
                    FILLS solid eden as the row is hovered - the ring is what it
                    looks like arriving, not what it looks like at rest.
                    Desktop only: below lg the source drops this column entirely,
                    since there is no rail to park it on and it duplicates the
                    text link already in the row. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none hidden h-[34px] w-[34px] -translate-x-2 place-items-center rounded-sm opacity-0 shadow-[inset_0_0_0_1px_rgba(27,23,18,0.11)] transition-[opacity,translate,background-color,box-shadow] duration-640 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:bg-eden group-hover:opacity-100 group-hover:shadow-none group-focus-within:translate-x-0 group-focus-within:bg-eden group-focus-within:opacity-100 group-focus-within:shadow-none motion-reduce:transition-none lg:grid lg:self-center lg:justify-self-end"
                >
                  {/* same <img> recolour as the chip: eden stroke → cream once
                      the circle behind it fills */}
                  <HomeIcon
                    id={row.arrow}
                    className="h-5 w-5 filter-[brightness(1)_invert(0)] transition-[filter] duration-510 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:filter-[brightness(0)_invert(1)] group-focus-within:filter-[brightness(0)_invert(1)] motion-reduce:transition-none"
                  />
                </span>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
