'use client';

// =============================================================================
// Homepage - SECTION 09 · HOW IT WORKS
// -----------------------------------------------------------------------------
// Rebuilt against the designer's own build ("New Homepage Build/index.html",
// CSS section 14 "HOW IT WORKS · the rail", markup at `section.how`, behaviour
// in the `howRail` / `howFill` / `howSteps` block of its scroll tick). That page
// is what the Figma frame was traced from, so where the two disagree it wins.
//
// WHAT CHANGED AGAINST THE FIGMA READING. The frame flattens this section into a
// static hairline with five inert cream discs, and it exports the five step
// glyphs at opacity 0 - which read as "the icons are switched off". They are
// not: in the executable page they are the HOVER state of each disc, and the
// hairline is a SCROLL-LINKED PROGRESS TRACK, not decoration. Both are restored
// here.
//
// THE RAIL IS A PROGRESS BAR MADE OF TWO LAYERS.
//   .how__line   a 1px track pinned across the rail, painted with a 4-stop
//                gradient (0 → .11 → .11 → 0) so it feathers out at both ends.
//   .how__fill   a solid teal bar inside it whose length is the scroll progress
//                `p`, published to CSS as `--p` so ONE inline value can drive a
//                width at desktop and a height on phones without a resize
//                listener or a second render path.
// `p` comes from useScrollProgress(0.78, 0.42) - the source's own numbers: the
// draw starts when the rail's top crosses 78% down the viewport and completes
// when it has travelled to 42%.
//
// THE DISCS MASK THE TRACK. Each 66px disc is filled with the SECTION'S OWN
// GROUND (--c-cream = #faf6ef = linenw) and sits at z-2 over the line, so it
// punches a hole in the hairline rather than sitting on a visible stripe. Change
// the section ground and this breaks - the disc must stay bg-linenw.
//
// TWO GEOMETRIES, ONE MARKUP. The source flips the whole rail at 1000px: the
// track becomes a 1px COLUMN at left 33px, the fill grows downward, and each
// step becomes a 66px / 1fr row. Tailwind's nearest named breakpoint is lg
// (1024) and the house rule forbids pairing an arbitrary min-width with named
// breakpoints (v4 emits arbitrary min-widths first, so they always lose), so the
// flip lands at 1024 instead of 1000. Mobile is the base case here, desktop is
// the `lg:` case - the reverse of most of this page, because the source writes
// the horizontal rail as the default and the vertical one in the media query.
//
// WHY THIS FILE IS A CLIENT COMPONENT. useScrollProgress is a hook, and the fill
// plus the five `on` flags all read from it. There is no server-rendered half of
// this section worth splitting out - the header and the CTA are three elements -
// so the whole section opts in rather than being cut into two files.
//
// RADIUS TRAP: this project remaps Tailwind's radius scale (--radius 0.625rem),
// so rounded-2xl is 18px. The disc is a true circle (border-radius:50%) and the
// CTA is radius 10, written explicitly.
// =============================================================================

import { cn } from '@/lib/utils';

import { Cta, Heading, Kicker, Section } from '../ui';
import { HomeIcon } from '../HomeIcon';
import { Reveal, useScrollProgress } from '../motion';

// EVERY easing below is the source's `--e-soft: cubic-bezier(.16,1,.3,1)`,
// written out in full at each site. It cannot be hoisted into a constant and
// interpolated: Tailwind scans this file as RAW TEXT, so a class assembled as
// `ease-[${E_SOFT}]` is never seen and the rule is never emitted.

type Step = {
  n: string;
  title: string;
  body: string;
  /**
   * The glyph the disc crossfades to on hover. These are the frame's own
   * 'Component 13' instances - search / test-tube / microscope / file-text /
   * route - which Figma exports at opacity 0 because the frame captures the
   * REST state. The source shows them on `.how__s:hover`, so they are wired up.
   */
  icon: string;
  /** the source's `--rd` stagger, in seconds */
  delay: number;
};

const STEPS: Step[] = [
  {
    n: '01',
    title: 'Find your test',
    body: 'Choose what you’d like to understand, or let us help you find the right test.',
    icon: '8896-87',
    delay: 0.02,
  },
  {
    n: '02',
    title: 'Give your sample',
    body: 'Depending on the test, sample collection is made simple and convenient.',
    icon: '8896-355',
    delay: 0.08,
  },
  {
    n: '03',
    title: 'We get to work',
    body: 'Your sample is processed through our trusted genetic laboratory ecosystem using the methodology appropriate for your selected test.',
    icon: '8896-622',
    delay: 0.14,
  },
  {
    n: '04',
    title: 'Receive your results',
    body: 'Get genetic insights presented in a way that’s easier to understand.',
    icon: '8896-890',
    delay: 0.2,
  },
  {
    n: '05',
    title: 'Understand what comes next',
    body: 'Access expert or genetic counselling support where applicable to help put your results into context.',
    icon: '8896-1158',
    delay: 0.26,
  },
];

/**
 * How far past a step the fill must be before that step lights up: the source's
 * `q * howSteps.length >= i + 0.18`. The 0.18 bias is what stops a step from
 * flicking on the instant the bar touches its left edge - the bar has to be
 * visibly INTO the step's own fifth before the disc reacts.
 */
const ON_BIAS = 0.18;

export default function HowItWorks() {
  const [railRef, p] = useScrollProgress<HTMLDivElement>(0.78, 0.42);

  return (
    <Section ground="cream" id="how-it-works">
      {/* ---- header --------------------------------------------------------
          `.how__head` margin-bottom clamp(48,5.4vw,86); `.kick` carries its own
          clamp(22,2.2vw,32) beneath it. The 16ch cap is what breaks the line
          after "science." without a hard <br>. */}
      <Reveal as="header" className="mb-[clamp(48px,5.4vw,86px)]">
        <Kicker tone="eden" className="mb-[clamp(22px,2.2vw,32px)]">
          How it works
        </Kicker>
        {/* Two voices in one line: Figtree for the statement, Cormorant Garamond
            italic for the turn. Both runs are as-typed - do not uppercase. */}
        <Heading
          html="A lot of science. <em>Made remarkably simple.</em>"
          className="max-w-[16ch] [text-wrap:balance]"
        />
      </Reveal>

      {/* ---- the rail ------------------------------------------------------
          The ref is the MEASURED element for the scroll progress, so it must
          wrap the track and every step and nothing else - put it on the section
          and the bar would already be half drawn before the first disc appears. */}
      <div ref={railRef} className="relative">
        {/* The track. Vertical by default (the source's <=1000 case): a 1px
            column at left 33px, which is the horizontal centre of the 66px disc
            column beside it. From lg it lies down across the full rail at top
            33px - the same 33, now the vertical centre of the disc row.

            The 90deg feathered gradient is kept in BOTH orientations because the
            source keeps it: compressed into a 1px-wide column its stops all land
            inside the 0.11 plateau, so the vertical track simply reads as a flat
            hairline. That is the source's behaviour, not an oversight here. */}
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute bottom-0 left-[33px] top-0 w-px',
            'bg-[linear-gradient(90deg,rgba(27,23,18,0)_0%,rgba(27,23,18,0.11)_5%,rgba(27,23,18,0.11)_88%,rgba(27,23,18,0)_100%)]',
            'lg:bottom-auto lg:left-0 lg:right-0 lg:top-[33px] lg:h-px lg:w-auto'
          )}
        >
          {/* The drawn part. `--p` is published once and consumed as a height
              here and a width at lg, so the same 0..1 number serves both
              geometries. Written with the source's `,0` fallback so a missing
              custom property collapses the bar instead of invalidating the
              calc() and letting it size itself. */}
          <span
            style={{ '--p': p } as React.CSSProperties}
            className="block h-[calc(var(--p,0)_*_100%)] w-full bg-eden lg:h-full lg:w-[calc(var(--p,0)_*_100%)]"
          />
        </div>

        {/* `relative` (no z-index) so the whole list paints after the track. */}
        <ol className="relative grid list-none grid-cols-1 gap-0 lg:grid-cols-5 lg:gap-x-[clamp(14px,1.8vw,32px)]">
          {STEPS.map((step, i) => {
            // the source's toggle, verbatim
            const on = p * STEPS.length >= i + ON_BIAS;

            return (
              <Reveal
                key={step.n}
                as="li"
                delay={step.delay}
                // Below lg the step is its own 66/1fr grid so the disc sits in
                // the track's column and the copy runs beside it; the 34 bottom
                // pad is the row rhythm the horizontal layout gets from the
                // grid gap. At lg it goes back to ordinary block flow.
                className="group relative grid grid-cols-[66px_minmax(0,1fr)] gap-x-[22px] pb-[34px] lg:block lg:pb-0"
              >
                {/* The numeral disc. Both children share ONE grid cell
                    (grid-area 1/1 in the source) so the digit and the glyph
                    crossfade in place rather than displacing each other. */}
                <span
                  className={cn(
                    'relative z-[2] grid h-[66px] w-[66px] rounded-full bg-linenw',
                    // tabular-nums keeps 01…05 the same optical width, so the
                    // digits do not shuffle inside the circle
                    'font-kyg text-[19px] font-extrabold leading-[1.62] tracking-[-0.02em] tabular-nums text-pewter',
                    'transition-[box-shadow,color,background-color,transform] duration-[850ms]',
                    'ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
                    // hover: solid teal, cream ink, lifted 3px
                    'group-hover:bg-eden group-hover:text-linenw group-hover:[transform:translateY(-3px)]',
                    on
                      ? // lit by the scroll: solid teal under a 7px soft halo.
                        // No group-hover shadow in this branch - in the source
                        // the `.on` rule is authored AFTER the hover rule at
                        // equal specificity, so a lit step keeps its halo while
                        // hovered instead of swapping to the drop shadow.
                        'bg-eden text-linenw shadow-[0_0_0_7px_rgba(14,77,75,0.09)]'
                      : // at rest: INSET hairline (the source's
                        // `inset 0 0 0 1px`), never a border - a border would
                        // grow the 66px box and knock the disc off the track
                        'shadow-[inset_0_0_0_1px_rgba(27,23,18,0.11)] group-hover:shadow-[0_12px_28px_rgba(14,77,75,0.24)]'
                  )}
                >
                  {/* Two durations, one declaration: the fade (0.64s) is
                      deliberately shorter than the travel (0.79s) so the swap
                      reads as a dissolve rather than a slide. That cannot be
                      written with transition-* utilities, hence the arbitrary
                      property. */}
                  <b
                    className={cn(
                      'col-start-1 row-start-1 place-self-center font-extrabold',
                      'group-hover:opacity-0 group-hover:[transform:scale(0.6)]',
                      // the reduced-motion kill switch is written as the same
                      // `transition` SHORTHAND, not `transition-none`: a
                      // longhand transition-property declaration cannot reliably
                      // out-order a shorthand in the emitted sheet, so the swap
                      // would keep animating
                      '[transition:opacity_0.64s_cubic-bezier(0.16,1,0.3,1),transform_0.79s_cubic-bezier(0.16,1,0.3,1)]',
                      'motion-reduce:[transition:none]'
                    )}
                  >
                    {step.n}
                  </b>

                  {/* The glyph rotates and grows out of nothing as the digit
                      leaves. The exported SVGs bake the frame's rest colour
                      (#92a19e) into their fills and an <img> cannot inherit
                      currentColor, so brightness-0+invert forces them to white
                      - the disc is always teal whenever this is visible, so
                      there is no state where the flattened colour shows. */}
                  <HomeIcon
                    id={step.icon}
                    className={cn(
                      'col-start-1 row-start-1 h-[25px] w-[25px] place-self-center brightness-0 invert',
                      'opacity-0 [transform:scale(0.62)_rotate(-16deg)]',
                      'group-hover:opacity-100 group-hover:[transform:none]',
                      '[transition:opacity_0.64s_cubic-bezier(0.16,1,0.3,1),transform_0.79s_cubic-bezier(0.16,1,0.3,1)]',
                      'motion-reduce:[transition:none]'
                    )}
                  />
                </span>

                {/* `.h4` + `.how__t`: margin 14/0/8 below lg, 24/0/10 from lg.
                    col-start-2 is inert once the li stops being a grid at lg. */}
                <h3 className="col-start-2 mb-[8px] mt-[14px] font-kyg text-[clamp(19px,1.3vw,22px)] font-bold leading-[1.28] tracking-[-0.015em] lg:mb-[10px] lg:mt-[24px]">
                  {step.title}
                </h3>

                {/* The 12 right pad is the source's own: it narrows the measure
                    inside the column so the copy wraps before it reaches the
                    next step's disc. */}
                <p className="col-start-2 pr-[12px] font-kyg text-[17px] font-normal leading-[1.6] tracking-[-0.005em] text-nevada">
                  {step.body}
                </p>
              </Reveal>
            );
          })}
        </ol>
      </div>

      {/* ---- footer CTA -----------------------------------------------------
          `.how__ft` margin-top clamp(46,5vw,74). On this cream ground the source
          uses the default `.btn` - teal fill, cream label, radius 10, drop
          shadow 0 6 18 rgba(14,77,75,.18) - but the primary variant ships the
          java2/abyss pairing meant for dark grounds, so eden/linenw is passed
          through className (twMerge drops the conflicting bg/text). The label is
          stored with those capitals; it is not a text-transform. */}
      <Reveal className="mt-[clamp(46px,5vw,74px)] flex">
        <Cta
          href="/categories"
          icon="9223-204"
          className="bg-eden text-linenw shadow-[0_6px_18px_0_rgba(14,77,75,0.18)]"
        >
          Find My Test
        </Cta>
      </Reveal>
    </Section>
  );
}
