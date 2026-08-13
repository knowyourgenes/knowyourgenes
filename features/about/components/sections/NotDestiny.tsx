// =============================================================================
// About Us — SECTION 04 · GENES ≠ DESTINY
// -----------------------------------------------------------------------------
// Built from the Figma frame 'SECTION 04 · GENES ≠ DESTINY' (page offset 3204).
// Desktop geometry, verbatim from the spec:
//   frame 1400 wide, pad 0/32 → three centred blocks stacked with a 48px gap
//   1. header rail 740 wide (eyebrow → h2, gap 15)
//   2. "visual equation" 1000 wide: Genes + Lifestyle + Environment + Choices =
//      … then the result card centred on the row below (row gap 16, item gap 16)
//   3. supporting copy: two 472 columns, 56 gap, vertically centred
//
// RADIUS TRAP: rounded-3xl is 22px in this project, so the 16px and 12px radii
// here are written as explicit arbitrary values.
// =============================================================================

import { AboutIcon } from '../AboutIcon';
import { Body, Eyebrow, Heading, Pill, Section } from '../ui';

/** Left-hand side of the equation. The first term is the dark "Genes" card. */
const EQUATION_TERMS = [
  { label: 'Genes', icon: '3413-400', tone: 'dark' as const },
  { label: 'Lifestyle', icon: '3413-580', tone: 'light' as const },
  { label: 'Environment', icon: '3413-780', tone: 'light' as const },
  { label: 'Choices', icon: '3413-978', tone: 'light' as const },
];

/** The rhythmic "matters" list under the left copy column. */
const MATTERS = [
  { label: 'Your lifestyle matters.', icon: '3747-237' },
  { label: 'Your environment matters.', icon: '3747-455' },
  { label: 'Your habits matter.', icon: '3798-237' },
  { label: 'Your choices matter.', icon: '3798-436' },
];

/** What genetic testing should do instead — the three mint chips, right column. */
const INTENT = [
  { label: 'Give you context.', icon: '3780-765' },
  { label: 'Give you awareness.', icon: '3841-765' },
  { label: 'Give you a better starting point.', icon: '3902-765' },
];

/**
 * A term in the visual equation.
 *
 * WIDTH: 128px is a MEASURED frame width, not a value derived from anything in
 * this component. The frame's cards are 128.0 / 130.2 / 167.4 / 128.0 (pad 24/24)
 * and 245.0 for the result (pad 28/28), while their labels are only 52 / 80 / 117
 * / 71 / 189 — so Genes and Choices are both drawn at 128 despite much shorter
 * labels. (Figma sizes them from a 'span.msym' icon row that is 78-80 wide there;
 * our icon renders at 24, so that row is NOT the mechanism here and cannot be
 * used to explain the number.) Sizing purely from the label gives 100/128/165/
 * 119/245, leaving the dark Genes card 28px short and visibly stunted beside
 * Lifestyle. A flat 128px floor reproduces the frame: Lifestyle and Environment
 * already clear it, and the ~2px residual on those two is font-metric drift.
 *
 * The floor is unconditional. min-width only beats max-w-full below a ~176px
 * content column, which no supported viewport reaches, and the row is flex-wrap
 * — so this cannot force an overflow on narrow phones.
 */
function TermCard({
  label,
  icon,
  tone,
}: {
  label: string;
  icon: string;
  tone: 'dark' | 'light' | 'result';
}) {
  const isDark = tone !== 'light';

  return (
    <div
      className={[
        'flex max-w-full flex-col items-center gap-[5px] rounded-[16px] pb-[21px] pt-[18px]',
        tone === 'result' ? 'px-7' : 'px-6 min-w-[128px]',
        tone === 'dark' ? 'bg-eden shadow-tst-card' : '',
        tone === 'result' ? 'bg-gradient-to-br from-eden to-eden2 shadow-tst-card' : '',
        tone === 'light' ? 'border border-mine/10 bg-white shadow-tst-soft' : '',
      ].join(' ')}
    >
      <AboutIcon id={icon} className="h-[28px] w-[24px] shrink-0" />
      {/* `uppercase` is NOT a style choice — all five term labels (Genes,
          Lifestyle, Environment, Choices, Your health journey) are textCase=UPPER
          in the frame. Figma keeps `characters` as typed and applies case via
          style.textCase, so the spec dump shows them sentence-case. The 0.87px
          tracking at 14.5px (0.06em) is the giveaway: that is uppercase tracking.
          Do not "correct" this back to sentence case. */}
      <span
        className={[
          'min-w-0 break-words text-center font-kyg text-[14.5px] font-extrabold uppercase leading-[21.8px] tracking-[0.87px]',
          isDark ? 'text-linenw' : 'text-[#2d2a24]',
        ].join(' ')}
      >
        {label}
      </span>
    </div>
  );
}

export default function NotDestiny() {
  return (
    <Section
      id="genes-destiny"
      ground="cream"
      innerClassName="flex flex-col items-center gap-12"
    >
      {/* ── 1. header rail ─────────────────────────────────────────────── */}
      <div className="flex w-full max-w-[740px] flex-col items-center gap-[15px] text-center">
        {/* Box/type metrics AND case are all the shared default: this node is
            textCase=UPPER in the frame (the spec's TEXT= line shows it as-typed,
            which is not how it renders). See the Eyebrow note in ui.tsx. */}
        <Eyebrow label="Genes ≠ Destiny" icon="3211-636" />
        <Heading
          as="h2"
          // ls -0.76 at 42px = -0.018em, a shade looser than Heading's -0.02em base.
          className="text-center text-[clamp(26px,2.9vw,42px)] leading-[1.05] tracking-[-0.018em]"
          html={
            "Your genes aren't your fate. <em class=\"abt-grad\">They're <br class=\"hidden lg:inline\" />part of the picture.</em>"
          }
        />
      </div>

      {/* ── 2. visual equation ─────────────────────────────────────────── */}
      <div className="flex w-full max-w-[1000px] flex-col items-center gap-4">
        {/* Each term after the first carries its own leading "+" so an operator
            can never be orphaned at the end of a wrapped row. */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-4">
          {EQUATION_TERMS.map((term, i) => (
            <div key={term.label} className="flex max-w-full items-center gap-4">
              {i > 0 ? (
                <span
                  aria-hidden="true"
                  className="shrink-0 font-kyg text-[clamp(22px,2.08vw,30px)] font-semibold leading-[1.5] text-boulder"
                >
                  +
                </span>
              ) : null}
              <TermCard label={term.label} icon={term.icon} tone={term.tone} />
            </div>
          ))}
          <span
            aria-hidden="true"
            className="shrink-0 font-kyg text-[clamp(24px,2.36vw,34px)] font-semibold leading-[1.5] text-eden"
          >
            =
          </span>
        </div>

        <TermCard label="Your health journey" icon="3524-708" tone="result" />
      </div>

      {/* ── 3. supporting copy ─────────────────────────────────────────── */}
      <div className="flex w-full max-w-[1000px] flex-col items-center gap-10 pb-px pt-4 lg:flex-row lg:items-center lg:gap-14">
        {/* left: "matters" list + intent line */}
        <div className="flex w-full min-w-0 flex-col gap-4 lg:max-w-[472px] lg:flex-1">
          <p className="break-words font-kyg text-[clamp(16px,1.25vw,18px)] font-bold leading-[1.62] text-mine">
            Your genes matter. But they aren&apos;t the whole story.
          </p>

          <div className="flex flex-wrap gap-x-[9px] gap-y-[10px]">
            {MATTERS.map((item) => (
              <Pill
                key={item.label}
                label={item.label}
                icon={item.icon}
                className="gap-2 px-4 py-2 shadow-none [&>img]:h-[21px] [&>img]:w-[17px] [&>span]:text-[15px] [&>span]:leading-[22.5px]"
              />
            ))}
          </div>

          <p className="break-words font-kyg text-[clamp(19px,1.67vw,24px)] font-semibold leading-[1.375] text-eden2">
            Think of genetics as information, not a prediction.
          </p>
        </div>

        {/* right: intent paragraph + the three mint chips */}
        <div className="flex w-full min-w-0 flex-col gap-5 lg:max-w-[472px] lg:flex-1">
          <Body
            className="text-[clamp(15px,1.18vw,17px)] leading-[1.62]"
            html={
              "That's why we don't believe genetic testing should create fear or make you feel like your future is already written. <b>We believe it should do the opposite.</b>"
            }
          />

          <div className="flex flex-col gap-2.5">
            {INTENT.map((item) => (
              <div
                key={item.label}
                className="flex min-w-0 items-center gap-3 rounded-[12px] border border-mine bg-mint/60 px-4 py-3"
              >
                <AboutIcon id={item.icon} className="h-6 w-5 shrink-0" />
                <span className="min-w-0 break-words font-kyg text-[clamp(15px,1.15vw,16.5px)] font-semibold leading-[1.5] text-[#2d2a24]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
