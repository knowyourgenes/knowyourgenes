// =============================================================================
// About Us — SECTION 02 · WHY WE EXIST
// -----------------------------------------------------------------------------
// Figma: frame 1440×1093, pad 88/20, white@0.7 ground with a mine/10 hairline.
// The rail here is WIDER than the page default: outer gutter 20 + inner rail
// 1400 with its own 32 → a 1336 content column (not the usual 1216), so the
// shared <Section> is nudged via className/innerClassName rather than rebuilt.
//
// RADIUS TRAP: rounded-4xl = 26px (image card). Everything else in this frame
// (24, 16, 2, 999) is written as an explicit arbitrary value.
// =============================================================================

import { Fragment } from 'react';

import { AboutIcon } from '../AboutIcon';
import { Body, Eyebrow, Heading, Photo, Section } from '../ui';

/**
 * The muted "old way" chain — four beats, each a stone-coloured capsule.
 *
 * CASE: these four labels are textCase=AS_TYPED in the frame — they are NOT in
 * the uppercase manifest, and their 0.02em tracking is body tracking, not the
 * >=0.06em uppercase tracking every UPPER run on this page carries. Render them
 * exactly as typed; do not "match" them to the uppercase labels around them.
 */
const REACTIVE_CHAIN = [
  { icon: '1571-228', label: 'Something feels wrong' },
  { icon: '1571-508', label: 'We get a test' },
  { icon: '1571-716', label: 'A problem shows up' },
  { icon: '1571-974', label: 'We start looking for answers' },
] as const;

/** The two cream narrative cards that sit above the teal payoff card. */
const NARRATIVE_POINTS = [
  {
    icon: '1827-725',
    text: 'Health changes can begin before we notice them.',
  },
  {
    icon: '1957-725',
    text: "The challenge is that many of those changes aren't obvious. Some of the information that can help us understand ourselves is already in our genes.",
  },
] as const;

const PAYOFF = "And that's exactly where our story begins.";

/**
 * The 22×2 gradient rule with its 7px dot, drawn locally — the extracted glyph
 * for this connector clips the dot to a 2px-tall box, so CSS reproduces it.
 *
 * In the frame a connector only ever sits BETWEEN two capsules, so it may only
 * be shown at a width where the whole four-beat chain fits on one line. That
 * needs 1026px of rail; the content column is vw−104 from lg up, i.e. 1176 at
 * xl and only 920 at lg — so xl is the first breakpoint that clears it. Below
 * that the capsules wrap (or stack) on their own, with no stub left pointing at
 * nothing.
 */
function ChainLink() {
  return (
    <span
      aria-hidden="true"
      className="relative hidden h-[2px] w-[22px] shrink-0 rounded-[2px] bg-[linear-gradient(90deg,rgba(34,34,34,0.08),rgba(122,122,122,0.35),rgba(34,34,34,0.08))] xl:block"
    >
      <span className="absolute left-[-4px] top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-[#b8b3aa]" />
    </span>
  );
}

export default function WhyWeExist() {
  return (
    <Section
      id="why-we-exist"
      ground="veil"
      className="border-y border-mine/10 lg:px-5"
      innerClassName="max-w-[1400px] py-[clamp(56px,6.2vw,88px)] lg:px-8"
    >
      <div className="flex flex-col items-center gap-9 lg:gap-[47px]">
        {/* ---------- header ---------------------------------------------- */}
        <div className="flex w-full max-w-[720px] flex-col items-center gap-[15px] text-center">
          {/* The shared primitive already carries this frame's metrics exactly
              (pad 8/17/8/13, gap 9, glyph 19×23, label Figtree 700 13.5/20.2
              ls 0.11em), so nothing here is worth restating locally. */}
          <Eyebrow label="Why we exist" icon="1336-647" />
          <Heading
            className="text-[clamp(28px,2.95vw,42px)] leading-[1.05] tracking-[-0.018em]"
            html={
              'We usually look for answers' +
              '<span class="block font-semibold text-fusc">after a health problem shows up.</span>'
            }
          />
        </div>

        {/* ---------- the reactive loop, rendered muted --------------------- */}
        {/* The frame's block is 960 wide but the chain inside it deliberately
            breaks that rail symmetrically: x=207..1233 = 1026 (capsules
            239+168+218+280 = 905, three 22px connectors, six 9px gaps), 33px
            proud on each side. The wrapper is therefore sized to the chain, not
            to the 960 label rail — the label is centred text, so it is unmoved —
            with enough headroom above 1026 to absorb font-metric drift before
            anything wraps. */}
        <div className="flex w-full max-w-[1120px] flex-col gap-5">
          <p className="text-center font-kyg text-[13px] font-bold uppercase leading-[19.5px] tracking-[0.16em] text-boulder">
            The reactive loop
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-[9px] sm:gap-y-3">
            {REACTIVE_CHAIN.map((step, i) => (
              <Fragment key={step.icon}>
                {i > 0 ? <ChainLink /> : null}
                <span className="inline-flex min-h-[49px] max-w-full items-center gap-2 rounded-full border border-mine/10 bg-[#f3f1ea] py-[11px] pl-[21px] pr-5">
                  <AboutIcon id={step.icon} className="h-[25px] w-[21px] shrink-0" />
                  <span className="min-w-0 break-words font-kyg text-[15px] font-extrabold leading-[17.2px] tracking-[0.02em] text-[#6b665d]">
                    {step.label}
                  </span>
                </span>
              </Fragment>
            ))}
          </div>
        </div>

        {/* ---------- transition statement --------------------------------- */}
        <Body
          className="max-w-[760px] text-center text-[clamp(22px,2.4vw,34px)] font-semibold leading-[1.24] tracking-normal text-mine"
          html={
            'But health doesn\'t suddenly begin <em class="abt-grad">when a symptom appears.</em>'
          }
        />

        {/* ---------- panel + the three narrative points -------------------- */}
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[600fr_704fr]">
          {/* Editorial panel. In the frame the photograph is laid OVER the tinted
              slot as a sibling rectangle rather than replacing it, so the glyph
              and its "Everyday life · before symptoms" caption are covered, not
              deleted — same net result, and the eden wash still sits on top.
              The source is portrait (1122x1402) in a 1.65:1 landscape slot, so
              object-cover crops hard; held at 42% to keep the face in frame. */}
          <div className="relative min-h-[240px] overflow-hidden rounded-4xl border border-mine/10 shadow-tst-card sm:min-h-[300px] lg:min-h-[365px]">
            <Photo
              src="/about/img/why-we-exist-panel.jpg"
              alt="A woman sitting quietly at home in the afternoon light."
              className="absolute inset-0"
              sizes="(min-width: 1024px) 46vw, 100vw"
              position="center 42%"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-eden/25 via-eden/0 to-eden/0"
            />
          </div>

          <div className="flex min-w-0 flex-col gap-5">
            {NARRATIVE_POINTS.map((point) => (
              <div
                key={point.icon}
                className="flex items-center gap-4 rounded-[24px] border border-mine/10 bg-linenw p-6 sm:p-7"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-mint">
                  <AboutIcon id={point.icon} className="h-[28px] w-[24px]" />
                </span>
                <p className="min-w-0 break-words font-kyg text-[clamp(15.5px,1.25vw,17.5px)] leading-[1.62] text-[#2d2a24]">
                  {point.text}
                </p>
              </div>
            ))}

            <div className="relative flex items-center gap-4 overflow-hidden rounded-[24px] bg-eden p-6 sm:p-7">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-[56px] -top-[56px] h-[176px] w-[176px] rounded-full bg-java2/15 blur-[20px]"
              />
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px]">
                <AboutIcon id="2087-724" className="h-[28px] w-[24px]" />
              </span>
              <p className="relative min-w-0 break-words font-kyg text-[clamp(19px,1.65vw,23px)] font-semibold leading-[1.37] text-linenw">
                {PAYOFF}
              </p>
            </div>
          </div>
        </div>

        {/* ---------- reactive → understanding earlier ---------------------- */}
        {/* Frame: HORIZONTAL, gap 16, both axes centred — the arrow reads as the
            transition BETWEEN the two pills, so it has to stay between them at
            every width. The row measures 146 + 16 + 24 + 16 + 273 = 475 and the
            rail is vw−40 here, so it stops fitting just above 515px: below that
            the whole row becomes a column (arrow turned down, still in the
            middle) instead of wrapping the arrow onto the first line. */}
        <div className="flex w-full flex-col items-center justify-center gap-4 min-[560px]:flex-row">
          <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-mine/10 bg-linenw px-5 py-[10px]">
            <AboutIcon id="2211-503" className="h-[22px] w-[18px] shrink-0" />
            <span className="min-w-0 break-words font-kyg text-[14px] font-bold uppercase leading-[21px] tracking-[0.1em] text-boulder">
              Reactive
            </span>
          </span>
          {/* Rotation is keyed off the SAME query as the direction switch above,
              so the arrow can never point down beside a pill or across a stack. */}
          <AboutIcon
            id="2208-644"
            className="h-[28px] w-[24px] shrink-0 rotate-90 min-[560px]:rotate-0"
          />
          <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-eden px-5 py-[10px]">
            <AboutIcon id="2211-705" className="h-[22px] w-[18px] shrink-0" />
            <span className="min-w-0 break-words font-kyg text-[14px] font-bold uppercase leading-[21px] tracking-[0.1em] text-linenw">
              Understanding earlier
            </span>
          </span>
        </div>
      </div>
    </Section>
  );
}
