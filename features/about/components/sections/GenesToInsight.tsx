'use client';

import { type CSSProperties, useState } from 'react';

import { Button, Eyebrow, Heading, Icon, PIN_PANE, PIN_TRACK, Section } from '@/components/shared/kyg';
import { useScrollPin } from '@/hooks/use-scroll-pin';
import { cn } from '@/lib/utils';
import { GENES_TO_INSIGHT as C } from '../../constants';
import { Chain, Kicker } from '../ui';

/**
 * 06 · From genes to insight - Figma 506:139.
 *
 * Three steps as a stepper, with a detail panel underneath that follows the
 * selection. The connector between tiles is drawn on every step but the last,
 * so the row reads as a sequence rather than three separate buttons.
 *
 * The tiles are real buttons in an ordered list, and the panel is
 * `aria-live="polite"` - so changing step is announced rather than silently
 * repainting for anyone not watching the pixels.
 */
export default function GenesToInsight() {
  const { track, pane, walked, pinning, scrollToWalked } = useScrollPin();
  const [clicked, setClicked] = useState(0);

  const last = C.steps.length - 1;
  /** Where step `n` sits in the walk, 0..1. */
  const at = (n: number) => n / last;

  // SCROLL OWNS THE STEP while the section is pinned; the click state owns it
  // otherwise (below `md`, and on a screen too short to pin - see the hook).
  const s = pinning ? Math.min(last, Math.floor(walked * last)) : clicked;
  const step = C.steps[s];
  const next = C.steps[s + 1];

  /**
   * Move the PAGE, not the state, while pinned.
   *
   * Setting state inside a pin is overwritten by the very next scroll frame and
   * the control reads as broken. Scrolling to the position that yields step `n`
   * makes the click and the scroll the same gesture.
   */
  const goTo = (n: number) => (pinning ? scrollToWalked(at(n)) : setClicked(n));

  return (
    <Section id="genes-to-insight" ground="sand" labelledBy="genes-to-insight-heading">
      {/* THE PIN. A tall track holds a sticky pane, so page-scroll walks the
          three steps while the section stays still. It is `position: sticky`
          and nothing else - no wheel handler, no hijack: the scrollbar keeps
          its meaning and a fast flick still goes straight past.

          THE HEAD ROW IS INSIDE THE PANE. The pane is a hard `100svh - header`
          box that centres what it holds, so with the head left outside it the
          stepper and panel - about 415px of content - sat centred in a ~735px
          box and put 160px of dead air between the lede and the stepper. Held
          together, the section reads as one screen, which is the point of
          pinning it. Only the lab strip stays outside.

          `md` and up only: below that the hook reports `pinning: false`, the
          pane is static, and taps drive the step. */}
      <div ref={track} className={cn('relative', PIN_TRACK)} style={{ '--pin-track': '200vh' } as CSSProperties}>
        <div ref={pane} {...{ className: PIN_PANE }}>
          <div className="flex flex-col gap-[clamp(16px,min(2.148vw,3.751vh),34.4px)] lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <Eyebrow icon="dna">{C.eyebrow}</Eyebrow>
              <Heading
                id="genes-to-insight-heading"
                className="mt-[clamp(11px,min(1.074vw,1.875vh),17.2px)] max-w-[clamp(600px,58.594vw,937.5px)] text-[clamp(24px,min(3.193vw,5.575vh),51.1px)] leading-[1.306]"
              >
                {C.headline} <em>{C.turn}</em>
              </Heading>
              <p className="mt-[clamp(10px,min(0.977vw,1.706vh),15.6px)] max-w-[clamp(600px,58.594vw,937.5px)] font-kyg text-[clamp(15px,min(1.465vw,2.558vh),23.4px)] font-normal leading-[1.4] text-heavy">
                {C.lead}
              </p>
            </div>
            <Button href={C.cta.href} className="shrink-0">
              {C.cta.label}
            </Button>
          </div>

          {/* ---- the stepper ---- */}
          <ol className="mt-[clamp(22px,min(3.027vw,5.285vh),48.4px)] flex list-none flex-col gap-[clamp(10px,min(1.172vw,2.046vh),18.8px)] sm:flex-row sm:gap-0">
            {C.steps.map((x, n) => {
              const active = n === s;
              return (
                <li key={x.n} className="flex min-w-0 flex-1 flex-col gap-[clamp(8px,min(0.977vw,1.706vh),15.6px)]">
                  <button
                    type="button"
                    onClick={() => goTo(n)}
                    aria-current={active ? 'step' : undefined}
                    className="group/step flex min-h-[44px] w-full items-center gap-[clamp(10px,min(1.172vw,2.046vh),18.8px)] pr-[clamp(0px,1.172vw,18.8px)] text-left outline-none"
                  >
                    <span
                      className={cn(
                        'grid h-[clamp(28px,3.223vw,51.6px)] w-[clamp(28px,3.223vw,51.6px)] shrink-0 place-items-center rounded-sm font-kyg text-[clamp(11.7px,min(1.143vw,1.996vh),18.3px)] font-bold transition-colors duration-300 group-focus-visible/step:ring-2 group-focus-visible/step:ring-eden motion-reduce:transition-none',
                        active ? 'bg-eden text-white' : 'bg-white text-heavy ring-1 ring-inset ring-zeus/[0.14]'
                      )}
                    >
                      {x.n}
                    </span>
                    {/* the connector - never after the last tile */}
                    {n < last ? (
                      /* The connector FILLS as the walk crosses it, so the line
                     between two tiles is the read-out rather than decoration. */
                      <span aria-hidden="true" className="relative hidden h-px flex-1 bg-zeus/[0.13] sm:block">
                        <span
                          className="absolute inset-y-0 left-0 bg-eden transition-[width] duration-300 ease-out motion-reduce:transition-none"
                          style={{
                            width: `${
                              Math.min(1, Math.max(0, pinning ? (walked - at(n)) / (at(1) - at(0)) : s > n ? 1 : 0)) *
                              100
                            }%`,
                          }}
                        />
                      </span>
                    ) : null}
                    <span
                      className={cn(
                        'font-kyg text-[clamp(11.7px,min(1.143vw,1.996vh),18.3px)] font-bold leading-[1.2] sm:hidden',
                        active ? 'text-heavy' : 'text-fusc'
                      )}
                    >
                      {x.title}
                    </span>
                  </button>
                  <span
                    className={cn(
                      'hidden font-kyg text-[clamp(11.7px,min(1.143vw,1.996vh),18.3px)] font-bold leading-[1.2] sm:block',
                      active ? 'text-heavy' : 'text-fusc'
                    )}
                  >
                    {x.title}
                  </span>
                </li>
              );
            })}
          </ol>

          {/* ---- the detail ---- */}
          {/* `shrink-0`: this is the pane's only child with `overflow-hidden`,
          and that zeroes a flex item's automatic minimum size - without it
          the panel is compressed to fit the fixed-height pane and quietly
          clips its own "Next" link instead of overflowing where it shows. */}
          <div className="mt-[clamp(16px,min(2.246vw,3.922vh),35.9px)] grid shrink-0 overflow-hidden rounded-sm bg-white ring-1 ring-inset ring-zeus/10 lg:grid-cols-[minmax(0,512fr)_minmax(0,455fr)]">
            <div
              className="relative isolate md:hidden lg:block min-h-[clamp(150px,min(20.801vw,36.32vh),332.8px)] bg-cover bg-center"
              style={{
                backgroundImage:
                  'linear-gradient(180deg,rgba(20,27,26,0.12) 0%,rgba(20,27,26,0.5) 100%),url(/about/img/step-visual.jpg)',
              }}
            >
              <span
                aria-hidden="true"
                className="absolute bottom-[clamp(10px,1.172vw,18.8px)] left-[clamp(14px,1.563vw,25px)] select-none font-tst text-[clamp(44px,min(5.859vw,10.23vh),93.8px)] italic leading-none text-white/35"
              >
                {step.n}
              </span>
            </div>

            <div
              aria-live="polite"
              className="flex min-w-0 flex-col justify-center gap-[clamp(8px,min(0.977vw,1.706vh),15.6px)] px-[clamp(18px,3.057vw,48.9px)] py-[clamp(18px,min(2.344vw,4.093vh),37.5px)]"
            >
              <span className="inline-flex w-fit items-center rounded-sm bg-eden/[0.07] px-[clamp(8px,0.879vw,14.1px)] py-[clamp(4px,min(0.488vw,0.852vh),7.8px)]">
                <Kicker>
                  Step {step.n} of 0{C.steps.length}
                </Kicker>
              </span>
              <p className="font-kyg text-[clamp(18px,min(2.227vw,3.888vh),35.6px)] font-bold leading-[1.228] tracking-[-0.02em] text-heavy">
                {step.title}
              </p>
              <p className="font-kyg text-[clamp(11.7px,min(1.143vw,1.996vh),18.3px)] font-normal leading-[1.598] text-fusc">
                {step.body}
              </p>
              {next ? (
                <button
                  type="button"
                  onClick={() => goTo(s + 1)}
                  className="-mx-[8px] inline-flex min-h-[44px] w-fit items-center gap-[6px] px-[8px] font-kyg text-[clamp(12px,min(1.045vw,1.825vh),16.7px)] font-bold text-eden outline-none hover:underline focus-visible:underline"
                >
                  Next · {next.title}
                  <Icon name="arrow" strokeWidth={2} className="h-[11px] w-[11px]" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* ---- the lab strip ---- */}
      <div className="mt-[clamp(14px,1.563vw,25px)] flex flex-wrap items-center justify-between gap-[clamp(12px,1.367vw,21.9px)] rounded-sm bg-white/60 px-[clamp(14px,1.758vw,28.1px)] py-[clamp(11px,1.172vw,18.8px)] ring-1 ring-inset ring-zeus/10">
        <span className="flex items-center gap-[9px]">
          <span className="grid h-[clamp(24px,2.344vw,37.5px)] w-[clamp(24px,2.344vw,37.5px)] shrink-0 place-items-center rounded-sm bg-eden/[0.08] text-eden">
            <Icon name="flask" className="h-[12px] w-[12px]" />
          </span>
          <span className="flex min-w-0 flex-col gap-[1px]">
            <span className="font-tst text-[clamp(12.5px,1.221vw,19.5px)] font-semibold italic leading-none text-eden">
              {C.lab.name}
            </span>
            <span className="font-kyg text-[clamp(11px,1.045vw,16.7px)] font-medium leading-[1.3] text-heavy">
              {C.lab.note}
            </span>
          </span>
        </span>

        <Chain items={C.lab.chain} />
      </div>
    </Section>
  );
}
