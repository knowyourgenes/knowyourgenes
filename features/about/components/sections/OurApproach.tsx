// =============================================================================
// features/about - SECTION 08 · OUR APPROACH
// -----------------------------------------------------------------------------
// Figma frame 1440×1242, veil ground (#ffffff@0.7) hairlined top and bottom.
// Three stacked blocks at 32px rhythm:
//   1. eyebrow + centred H2 (740 rail)
//   2. "averages vs you" - cream card → arrow glyph → gradient teal card (900 rail)
//   3. the four-principle hub: 2×2 card grid with a cross-hair rule and the
//      132px "The KYG Approach" medallion pinned dead centre (940 rail)
//
// RADIUS TRAP: this project's scale is remapped, so only 22 (rounded-3xl) maps
// cleanly. The 24px cards and the 16px icon chips are written as arbitrary
// values on purpose - do not "simplify" them to rounded-2xl/rounded-xl.
// =============================================================================

import { AboutIcon } from '../AboutIcon';
import { Body, Eyebrow, Heading, Pill, Section } from '../ui';

/**
 * Figtree 700/800, uppercase, wide tracking - the frame's small label style.
 *
 * KEEP `uppercase`. Figma stores copy in `characters` exactly as the designer
 * typed it and applies case separately via `style.textCase`, so a spec dump that
 * prints only `characters` makes these read sentence-case. All six runs this
 * constant renders are textCase=UPPER in the frame - "Most health advice starts
 * with averages" (y=8273), "But you aren't an average" (y=8327), "Four
 * principles, one approach" (y=8548) and the four PRINCIPLES titles (y=8693 /
 * y=8985). The >=0.12em tracking is uppercase tracking, which is the giveaway.
 * Do not "restore" sentence case, and do not add `normal-case` at a call site.
 *
 * Every consumer of this constant is an UPPER run, which is why the transform
 * lives here rather than at the call sites. If a future AS_TYPED label needs
 * this type style, give it its own constant instead of stripping this one.
 */
const LABEL = 'font-kyg font-bold uppercase';

/**
 * The generic-advice chips. Frame: white capsule, hairline, no shadow, #5b564e.
 *
 * These are textCase=AS_TYPED - they are absent from the frame's uppercase-run
 * manifest, and Pill renders them at 14.5/600 with no tracking, which is body
 * type, not label type. They sit directly under an UPPER label; do not uppercase
 * them by association.
 */
const ADVICE = ['Eat this.', 'Avoid that.', 'Exercise this much.', 'Sleep this long.'];

const PRINCIPLES = [
  {
    icon: '8639-291',
    title: 'Personal',
    body: 'Your genes are unique to you.',
  },
  {
    icon: '8639-817',
    title: 'Clear',
    body: 'Complex genetic information should be understandable.',
  },
  {
    icon: '8930-291',
    title: 'Responsible',
    body: 'Genetic insights should inform, not frighten or dictate.',
  },
  {
    icon: '8930-817',
    title: 'Preventive',
    body: 'The earlier you understand relevant health tendencies, the earlier you can start asking better questions.',
  },
] as const;

/** 5-stop teal rule used by both arms of the cross-hair. */
const RULE_H =
  'bg-[linear-gradient(90deg,rgba(14,77,75,0)_0%,rgba(14,77,75,0.18)_25%,rgba(37,181,171,0.4)_50%,rgba(14,77,75,0.18)_75%,rgba(14,77,75,0)_100%)]';
const RULE_V =
  'bg-[linear-gradient(180deg,rgba(14,77,75,0)_0%,rgba(14,77,75,0.18)_25%,rgba(37,181,171,0.4)_50%,rgba(14,77,75,0.18)_75%,rgba(14,77,75,0)_100%)]';

export default function OurApproach() {
  return (
    <Section
      id="our-approach"
      ground="veil"
      className="border-y border-mine/10"
      innerClassName="flex flex-col items-center gap-8"
    >
      {/* ── 1. Heading block ────────────────────────────────────────────── */}
      <div className="flex w-full max-w-[740px] flex-col items-center gap-[15px] text-center">
        {/* Frame metrics (pad 8/17/8/13, gap 9, glyph 19×23, label 13.5/20.2
            ls 0.11em) are the shared Eyebrow's own defaults - no override. */}
        <Eyebrow label="Our approach" icon="8062-642" />
        <Heading
          html="Your health is personal. <em class='abt-grad'>Your approach <br class='hidden md:inline' />should be too.</em>"
          className="text-[clamp(26px,2.92vw,42px)] leading-[1.05]"
        />
      </div>

      {/* ── 2. Averages vs you ──────────────────────────────────────────── */}
      <div className="flex w-full flex-col items-center gap-6 pt-4 xl:flex-row xl:justify-center">
        {/* Generic advice */}
        <div className="flex w-full min-w-0 max-w-[412px] flex-col gap-4 rounded-[24px] border border-mine/10 bg-linenw p-7 xl:w-[412px]">
          <p className={`${LABEL} text-[13px] leading-[19.5px] tracking-[0.12em] text-boulder`}>
            Most health advice starts with averages
          </p>
          <div className="flex flex-wrap gap-2">
            {ADVICE.map((label) => (
              // Frame: pad 7/14/9/14 (symmetric sides), Figtree 600 14.5/21.8,
              // #5b564e, and NO shadow. `shadow-none` cannot win here - twMerge
              // reads Pill's `shadow-tst-soft` as a shadow *colour* and keeps
              // both, and Tailwind emits `.shadow-none` first, so the soft
              // shadow survives. `shadow-transparent` is the same twMerge group,
              // so the base class is dropped outright (and if it ever were not,
              // it resolves --tw-shadow-color to transparent anyway).
              <Pill
                key={label}
                label={label}
                className="p-[7px_14px_9px_14px] shadow-transparent [&>span]:leading-[21.8px] [&>span]:text-fusc"
              />
            ))}
          </div>
          <Body html="General guidance has its place." className="text-[15px] leading-[22.5px] text-boulder" />
        </div>

        {/* Connector - points right on the desktop row, down once it stacks. */}
        <AboutIcon id="8346-706" className="h-9 w-[30px] shrink-0 rotate-90 xl:rotate-0" alt="" />

        {/* You */}
        <div className="relative w-full min-w-0 max-w-[410px] overflow-hidden rounded-[24px] bg-gradient-to-r from-eden to-eden2 p-7 xl:w-[410px]">
          <span
            aria-hidden
            className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-java2/15 blur-[40px]"
          />
          <div className="relative flex flex-col gap-3">
            <p className={`${LABEL} text-[13px] leading-[19.5px] tracking-[0.12em] text-java2`}>
              But you aren&apos;t an average
            </p>
            <p className="break-words font-kyg text-[clamp(22px,2.1vw,30px)] font-semibold leading-[1.37] text-linenw">
              Your biology is your own.
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. Four principles ──────────────────────────────────────────── */}
      <p className={`${LABEL} w-full pt-8 text-center text-[13px] leading-[19.5px] tracking-[0.16em] text-boulder`}>
        Four principles, one approach
      </p>

      <div className="relative mx-auto w-full max-w-[940px]">
        {/* Cross-hair - geometry only reads at the frame's 940 rail, so it is
            xl-only; below that the cards simply stack. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
          <span className={`absolute left-[6%] right-[6%] top-1/2 h-[2px] -translate-y-1/2 ${RULE_H}`} />
          <span className={`absolute bottom-[6%] left-1/2 top-[6%] w-[2px] -translate-x-1/2 ${RULE_V}`} />
        </div>

        {/* Central medallion - pinned to the cross-hair at xl, and simply the
            first thing in the stack below it. */}
        <div className="relative z-10 mx-auto mb-6 flex h-[132px] w-[132px] shrink-0 flex-col items-center justify-center rounded-full border-[5px] border-linenw bg-eden text-center shadow-tst-float xl:absolute xl:left-1/2 xl:top-1/2 xl:mx-0 xl:mb-0 xl:-translate-x-1/2 xl:-translate-y-1/2">
          <AboutIcon id="8821-707" className="h-8 w-[26px]" alt="" />
          {/* textCase=UPPER in the frame (y=8853, 13/800, 0.06em) - renders
              "THE KYG / APPROACH". The manifest's 79px is the hug width of the
              wider line, which only "APPROACH" reaches; sentence case measures
              short. Keep `uppercase`. 79 clears the 122px inner medallion, so
              the two-line break below stays a 2-liner. */}
          <span className="-mt-px font-kyg text-[13px] font-extrabold uppercase leading-[1.25] tracking-[0.06em] text-linenw">
            The KYG
            <br />
            Approach
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-7 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-16 xl:gap-x-[112px] xl:gap-y-[94px]">
          {PRINCIPLES.map((p) => (
            <article
              key={p.title}
              className="flex min-w-0 flex-col gap-2 rounded-3xl border border-mine/10 bg-white p-7 shadow-tst-soft"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-mint">
                <AboutIcon id={p.icon} className="h-7 w-6" alt="" />
              </span>
              <h3 className={`${LABEL} pt-2 text-[13.5px] leading-[20.2px] tracking-[0.12em] text-eden`}>{p.title}</h3>
              <Body html={p.body} className="text-[clamp(15px,1.15vw,16.5px)] leading-[22.7px]" />
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
