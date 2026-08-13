// =============================================================================
// About Us — SECTION 05 · MAKING GENETICS UNDERSTANDABLE
// -----------------------------------------------------------------------------
// Figma frame @ page y=4574 (h=937). White-70 veil ground with a 1px #222222@0.1
// hairline top and bottom, 92px vertical padding.
//
// The frame's inner rail is WIDER than this page's default: 1440 − 20 gutter ×2
// = 1400, minus its own 32 ×2 = a 1336 content column (the transformation visual
// is exactly 1336 wide: 621 + 16 + 143 + 16 + 540). <Section> is reused and the
// two width utilities are overridden through cn()/tailwind-merge rather than
// rebuilding the primitive.
//
// RADIUS TRAP: rounded-4xl == 26px (the two big cards) and that is the only
// value here that maps cleanly. 16 / 10 / 999 are written as arbitrary values.
// =============================================================================

import { AboutIcon } from '../AboutIcon';
import { Body, Eyebrow, Heading, Section } from '../ui';

/** The five "complex input" chips, left card. */
const INPUT_CHIPS: { label: string; icon: string }[] = [
  { label: 'Genes', icon: '4982-94' },
  { label: 'Variants', icon: '4980-199' },
  { label: 'Markers', icon: '4982-317' },
  { label: 'Probabilities', icon: '4979-433' },
  { label: 'Risk factors', icon: '5033-95' },
];

/**
 * Small-caps label used by all five 13px labels in this section — the four
 * card/lens headers plus the java2 pill (13px · 700 · tracked).
 *
 * The `uppercase` here is FRAME-ACCURATE — do not strip it. Figma keeps the
 * string in `characters` as the designer typed it and applies case separately
 * via `style.textCase`, so a spec dump that prints only `characters` shows
 * "Filter" for a node the frame renders as "FILTER". All five consumers of this
 * constant are textCase=UPPER runs in .about-case-manifest.json (y=4935.2
 * "Simple human insight", 4936.2 "Complex genetic information", 4990.6
 * "Filter", 4996.2 "Lower · act early", 5134.1 "Interpretation") — there is no
 * AS_TYPED consumer, which is why the transform lives on the constant. The
 * >= 0.06em tracking on every call site is uppercase tracking, the giveaway.
 *
 * NOTE the neighbouring 15px labels are NOT in the manifest and must stay
 * sentence case: the INPUT_CHIPS ("Genes", "Variants", …) and "Vitamin D".
 * "Genes" is textCase=UPPER in the Hero at 13px, not here at 15px.
 */
const MICRO = 'font-kyg text-[13px] font-bold uppercase leading-[19.5px]';

export default function Understandable() {
  return (
    <Section
      id="understandable"
      ground="veil"
      className="border-y border-mine/10 lg:px-5"
      innerClassName="max-w-[1400px] lg:px-8"
    >
      {/* ── header block — 740 wide, centred, gap 15 ─────────────────────── */}
      <div className="mx-auto flex w-full max-w-[740px] flex-col items-center gap-[15px] text-center">
        {/* The shared Eyebrow already emits this frame's metrics exactly — pad
            8/17/8/13, gap 9, glyph 19x23, label Figtree 700 13.5/20.2 ls 0.11em
            — so nothing is overridden locally. */}
        <Eyebrow icon="4674-556" label="Making genetics understandable" />

        {/* 42/44.1, ls −0.76 → −0.76/42 = −0.018em (the Heading base is −0.02em). */}
        <Heading
          className="text-[clamp(26px,2.92vw,42px)] leading-[1.05] tracking-[-0.018em]"
          html={`Because your genes are complicated.<span class="abt-grad mt-[-1px] block font-semibold">Your report doesn't have to be.</span>`}
        />

        <Body
          className="text-[clamp(15px,1.22vw,17.5px)] leading-[1.5]"
          html="Genomics can get technical very quickly."
        />
      </div>

      {/* ── transformation visual — complex → lens → simple insight ───────
          Desktop tracks are the frame's exact 621 / 143 / 540 with 16px gaps;
          below lg the three blocks stack in reading order and the lens arrows
          rotate a quarter turn (see the note on them), so the flow still reads
          complex -> filter -> interpretation -> simple, top-to-bottom.
          The lens track carries a 143px floor: as a bare fr it collapses to
          ~97px between lg and ~1285px and the 126px "INTERPRETATION" label —
          one unbreakable word — spills into both gutters. */}
      <div className="mt-[39px] grid grid-cols-1 gap-6 pt-[17px] lg:grid-cols-[621fr_minmax(143px,143fr)_540fr] lg:gap-4">
        {/* ---- complex input -------------------------------------------- */}
        <div className="relative min-w-0 rounded-4xl border border-mine/10 bg-linenw p-6 lg:p-[29px]">
          <div className="mb-4 flex items-center gap-2">
            {/* 19x23 artwork: drawn at its true ratio, the 4px of overhang
                pulled back so the row still measures the frame's 19px box. */}
            <AboutIcon id="4935-81" className="-my-[2px] h-[23px] w-[19px] shrink-0" />
            <span className={`${MICRO} min-w-0 break-words tracking-[0.12em] text-boulder`}>
              Complex genetic information
            </span>
          </div>

          <div className="mb-5 flex flex-wrap gap-x-2 gap-y-2.5">
            {INPUT_CHIPS.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex max-w-full items-center gap-1.5 rounded-[10px] border border-mine/[0.12] bg-white px-[13px] py-2 shadow-[0_6px_16px_0_rgba(20,27,26,0.05)]"
              >
                {/* chip glyphs export at 18x22 — same true-ratio + pull-back
                    treatment, so the chip still reads as an 18px square box. */}
                <AboutIcon id={chip.icon} className="-my-[2px] h-[22px] w-[18px] shrink-0" />
                <span className="min-w-0 break-words font-kyg text-[15px] font-bold leading-[22.5px] text-[#6b665d]">
                  {chip.label}
                </span>
              </span>
            ))}
          </div>

          {/* quote card + its 23px rotated notch (a 16px square at 45°) */}
          <div className="relative rounded-[16px] border border-mine/10 bg-white px-5 py-4 shadow-tst-soft">
            <span
              aria-hidden
              className="absolute -top-[8px] left-[22px] h-4 w-4 rotate-45 rounded-[2px] border-l border-t border-mine/10 bg-white"
            />
            <p className="min-w-0 break-words font-kyg text-[16.5px] font-normal italic leading-[22.7px] text-fusc">
              {'"Okay... but what does this actually mean for me?"'}
            </p>
          </div>

          <p className="mt-4 break-words font-kyg text-[15px] font-normal leading-[20.6px] text-boulder">
            {"It's easy to end up with a report full of information and still wonder."}
          </p>
        </div>

        {/* ---- filter / interpretation lens ------------------------------
            The lens is absolutely positioned in the frame, so its three gaps
            are NOT uniform: 8 under the Filter block, 15 under the first arrow,
            9 under the Interpretation block (345→437→445→473→488→580→589→617,
            a 272px stack). Written as per-child margins rather than one gap. */}
        <div className="flex min-w-0 flex-col items-center justify-center py-2">
          <div className="flex flex-col items-center gap-2">
            <span className="flex h-16 w-16 items-center justify-center rounded-[16px] bg-eden shadow-tst-card">
              <AboutIcon id="4933-746" className="h-[36px] w-[30px]" />
            </span>
            <span className={`${MICRO} tracking-[0.1em] text-eden`}>Filter</span>
          </div>

          {/* The frame's arrow artwork POINTS RIGHT, which only reads correctly
              in the desktop three-column layout (complex -> lens -> simple).
              Below lg the three blocks stack, so the flow runs top-to-bottom and
              an unrotated arrow points sideways into the gutter. Rotated a
              quarter turn under lg; the glyph is a plain chevron, so a rotation
              is honest artwork reuse rather than a different icon.
              w/h stay 34x28 — rotate() does not affect layout size, and the
              parent centres it either way. */}
          <AboutIcon id="5019-741" className="mt-[8px] h-[28px] w-[34px] rotate-90 lg:rotate-0" />

          <div className="mt-[15px] flex flex-col items-center gap-2">
            <span className="flex h-16 w-16 items-center justify-center rounded-[16px] border border-eden/20 bg-mint">
              <AboutIcon id="5076-745" className="h-[36px] w-[30px]" />
            </span>
            <span className={`${MICRO} min-w-0 break-words text-center tracking-[0.1em] text-eden`}>
              Interpretation
            </span>
          </div>

          <AboutIcon id="5163-741" className="mt-[9px] h-[28px] w-[34px] rotate-90 lg:rotate-0" />
        </div>

        {/* ---- simple human insight -------------------------------------- */}
        <div className="relative flex min-w-0 flex-col overflow-hidden rounded-4xl bg-[linear-gradient(180deg,#0e4d4b_0%,#15605d_100%)] p-6 lg:p-7">
          {/* blurred java bloom, top-right, bleeding past the card edge */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-java2/15 blur-[40px]"
          />

          <div className="relative flex min-w-0 flex-1 flex-col">
            <div className="mb-4 flex items-center gap-2">
              <AboutIcon id="4934-876" className="-my-[2px] h-[23px] w-[19px] shrink-0" />
              <span className={`${MICRO} min-w-0 break-words tracking-[0.12em] text-java2`}>
                Simple human insight
              </span>
            </div>

            <div className="flex flex-col gap-3 rounded-[16px] border border-white/15 bg-white/10 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="min-w-0 break-words font-kyg text-[15.5px] font-bold leading-[23.2px] text-linenw">
                  Vitamin D
                </span>
                {/* Same MICRO style as every other 13/19.5 tracked label here:
                    the frame measures this string at 137px, which is its
                    uppercase advance width (sentence case is 115px). */}
                <span className="inline-flex max-w-full items-center rounded-full bg-java2 px-2.5 py-1">
                  <span className={`${MICRO} min-w-0 break-words tracking-[0.06em] text-ink`}>
                    Lower · act early
                  </span>
                </span>
              </div>
              {/* The frame's break belongs to a 442px text box, which this card
                  only reaches once the 1400 rail is full — i.e. at 1440, not lg
                  (~272px there, where the forced break just orphans a line). */}
              <p className="min-w-0 break-words font-kyg text-[15.5px] font-normal leading-[21.3px] text-linenw/85">
                Your body may hold on to less vitamin D, so a small daily habit{' '}
                <br className="hidden min-[1440px]:inline" />
                keeps it in a healthy range.
              </p>
            </div>

            <p className="mt-auto break-words pt-[46px] font-kyg text-[15px] font-normal leading-[20.6px] text-linenw/70">
              Clear, accessible, and easy to understand and explore.
            </p>
          </div>
        </div>
      </div>

      {/* ── closing copy — 720 wide, centred ─────────────────────────────── */}
      <p className="mx-auto mt-[39px] w-full max-w-[720px] break-words text-center font-kyg text-[clamp(15px,1.15vw,16.5px)] font-normal leading-[1.5] text-fusc">
        {"That's the gap Know Your Genes is built to address. We take complex genetic information and "}
        <br className="hidden lg:inline" />
        turn it into clear, accessible insights that are easier to understand and explore.
      </p>

      {/* ── closing statement — 820 wide, 34/42.2, bold run on the second half */}
      <p className="mx-auto mt-[39px] w-full max-w-[820px] break-words text-center font-kyg text-[clamp(24px,2.36vw,34px)] font-semibold leading-[1.24] text-mine">
        {"Too many data isn't useful. "}
        <em className="abt-grad">
          Understanding the data <br className="hidden lg:inline" />
          is.
        </em>
      </p>
    </Section>
  );
}
