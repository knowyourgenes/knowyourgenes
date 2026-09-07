'use client';

import { useState } from 'react';

import { Eyebrow, Heading, Icon, Note, Section } from '@/components/shared/kyg';
import { useScrollPin } from '@/hooks/use-scroll-pin';
import { cn } from '@/lib/utils';
import { WHY_WE_EXIST as C } from '../../constants';
import { Hint, Hr, Kicker } from '../ui';

/**
 * 02 · Why we exist - Figma 487:129.
 *
 * A five-point life timeline. Picking a point rewrites the story beneath it.
 * The design opens on 03, "A symptom" - the moment most people's health story
 * is usually considered to start, which is the section's whole argument.
 *
 * RESPONSIVE BEHAVIOUR IS THE HARD PART HERE. The frame lays five labelled
 * points across a 967 rail; at 360px that is 72px per label for strings like
 * "Searching for answers". So below `sm` the track keeps its nodes and numerals
 * but drops the word labels, and the selected point's label reappears in the
 * story panel underneath - which already names it. Nothing is lost, and nothing
 * is 8px wide.
 *
 * The zone bands and flags are pointer-scale annotation and go below `md`.
 */
export default function WhyWeExist() {
  const { track, pane, walked, pinning, scrollToWalked } = useScrollPin();
  // Explicitly number: C.initial is 2 inside an `as const` block, so an
  // inferred state would be typed as the literal 2 and refuse every other point.
  const [clicked, setClicked] = useState<number>(C.initial);

  const last = C.points.length - 1;
  /** Where point `n` sits in the walk, 0..1. */
  const at = (n: number) => n / last;

  // SCROLL OWNS THE POINT while the section is pinned; the click state owns it
  // otherwise (below `md`, and on a screen too short to pin - see the hook).
  const i = pinning ? Math.min(last, Math.floor(walked * last)) : clicked;
  const point = C.points[i];

  // The bar tracks the WALK, not the index, so it fills continuously between
  // points rather than jumping five times.
  const pct = (pinning ? Math.min(1, walked) : i / last) * 100;

  /**
   * Move the PAGE, not the state, while pinned.
   *
   * Setting state inside a pin is overwritten by the very next scroll frame and
   * the control reads as broken. Scrolling to the position that yields point
   * `n` makes the click and the scroll the same gesture.
   */
  const goTo = (n: number) => (pinning ? scrollToWalked(at(n)) : setClicked(n));

  return (
    <Section id="why-we-exist" labelledBy="why-we-exist-heading">
      {/* THE PIN. A tall track holds a sticky pane, so page-scroll walks the
          five points while the section stays still - the same mechanism the
          homepage's life curve and step track use, and it is `position: sticky`
          and nothing else. No wheel handler, no hijack: the scrollbar keeps its
          meaning and a fast flick still goes straight past.

          Only from `md` up. Below that the track is auto-height, the pane is
          static, the hook reports `pinning: false`, and taps drive the point -
          which is the right behaviour on a phone, where holding a section still
          costs the reader the whole screen. */}
      <div ref={track} className="relative md:h-[240vh]">
        <div
          ref={pane}
          className="md:sticky md:top-[var(--site-header-h,104px)] md:flex md:h-[calc(100svh-var(--site-header-h,104px))] md:flex-col md:justify-center"
        >
          <div className="flex flex-col gap-[clamp(16px,2.148vw,34.4px)] lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <Eyebrow icon="dna">{C.eyebrow}</Eyebrow>
              <Heading
                id="why-we-exist-heading"
                className="mt-[clamp(11px,1.074vw,17.2px)] max-w-[clamp(600px,58.594vw,937.5px)] text-[clamp(24px,3.193vw,51.1px)] leading-[1.306]"
              >
                {C.headline} <em>{C.turn}</em>
              </Heading>
            </div>
            <Note lead={C.quote.lead} turn={C.quote.turn} className="shrink-0 lg:w-[clamp(300px,29.297vw,468.8px)]" />
          </div>

          {/* ---- the timeline ---- */}
          <div className="mt-[clamp(22px,3.027vw,48.4px)]">
            {/* zone bands - annotation, so they go when there is no room to read them */}
            <div className="mb-[clamp(8px,0.781vw,12.5px)] hidden gap-[6px] md:flex">
              <span className="flex items-center justify-center rounded-sm bg-eden/[0.09] px-[10px] py-[4px] font-tst text-[clamp(12.5px,1.221vw,19.5px)] font-semibold italic text-eden [flex:374.8]">
                {C.zones.before}
              </span>
              <span className="flex items-center justify-center rounded-sm bg-zeus/[0.05] px-[10px] py-[4px] font-tst text-[clamp(12.5px,1.221vw,19.5px)] font-semibold italic text-fusc [flex:568.2]">
                {C.zones.after}
              </span>
            </div>

            <div className="relative">
              {/* track + progress. The glow is the frame's, and is decoration. */}
              <div aria-hidden="true" className="absolute left-0 right-0 top-[6px] h-[2px] rounded-sm bg-zeus/[0.14]" />
              <div
                aria-hidden="true"
                className="absolute left-0 top-[3.5px] h-[7px] rounded-sm bg-[linear-gradient(90deg,rgba(14,77,75,0)_0%,rgba(42,195,162,0.35)_100%)] blur-[3px] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{ width: `${pct}%` }}
              />
              <div
                aria-hidden="true"
                className="absolute left-0 top-[5.5px] h-[2.5px] rounded-sm bg-[linear-gradient(90deg,#0E4D4B_0%,#2AC3A2_100%)] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{ width: `${pct}%` }}
              />

              <ol className="relative flex list-none items-start justify-between">
                {C.points.map((p, n) => {
                  const active = n === i;
                  const passed = n <= i;
                  return (
                    <li key={p.n} className="flex min-w-0 flex-col items-center">
                      <button
                        type="button"
                        onClick={() => goTo(n)}
                        aria-current={active ? 'step' : undefined}
                        aria-label={`${p.n} · ${p.label} · ${p.when}`}
                        /* 44x44 floor. Below `sm` the button is only a dot and a numeral -
                       about 17x33 - and it is the section's primary control. Five
                       44px targets is 220px, comfortably inside the 324px rail. */
                        className="group/pt flex min-h-[44px] min-w-[44px] flex-col items-center justify-center px-[4px] outline-none"
                      >
                        <span
                          className={cn(
                            'block shrink-0 rounded-full ring-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-visible/pt:ring-offset-2 group-focus-visible/pt:ring-offset-linenw motion-reduce:transition-none',
                            active
                              ? 'h-[clamp(16px,1.66vw,26.6px)] w-[clamp(16px,1.66vw,26.6px)] bg-eden ring-linenw'
                              : passed
                                ? 'mt-[2px] h-[clamp(10px,1.172vw,18.8px)] w-[clamp(10px,1.172vw,18.8px)] bg-eden ring-eden'
                                : 'mt-[2px] h-[clamp(10px,1.172vw,18.8px)] w-[clamp(10px,1.172vw,18.8px)] bg-linenw ring-eden'
                          )}
                        />
                        <span
                          className={cn(
                            'mt-[clamp(6px,0.586vw,9.4px)] font-kyg text-[clamp(10.5px,1.025vw,16.4px)] font-light leading-none',
                            active ? 'text-eden' : 'text-nevada/70'
                          )}
                        >
                          {p.n}
                        </span>
                        {/* label + when: dropped below `sm`, where five of them
                        cannot be read. The story panel names the point anyway. */}
                        <span className="mt-[3px] hidden flex-col items-center sm:flex">
                          <span
                            className={cn(
                              'text-center font-kyg text-[clamp(11.5px,1.123vw,18px)] leading-[1.2] tracking-[-0.003em]',
                              active ? 'font-bold text-eden' : 'font-medium text-heavy/80'
                            )}
                          >
                            {p.label}
                          </span>
                          <span className="mt-[1px] text-center font-tst text-[clamp(12px,1.172vw,18.8px)] italic leading-[1.2] text-nevada/80">
                            {p.when}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* the two flags the frame plants on the track */}
            <div className="mt-[clamp(10px,0.977vw,15.6px)] hidden items-center gap-[clamp(8px,0.781vw,12.5px)] md:flex">
              <span className="inline-flex items-center gap-[5px] rounded-sm bg-eden px-[9px] py-[5px]">
                <Icon name="arrow" strokeWidth={2} className="h-[9px] w-[9px] text-ice" />
                <Kicker size="sm" tone="ice">
                  {C.flags.ours}
                </Kicker>
              </span>
              <span className="inline-flex items-center gap-[5px] rounded-sm bg-white px-[9px] py-[5px] ring-1 ring-inset ring-zeus/[0.14]">
                <Icon name="arrow" strokeWidth={2} className="h-[9px] w-[9px] text-eden" />
                <Kicker size="sm" tone="eden">
                  {C.flags.theirs}
                </Kicker>
              </span>
            </div>
          </div>

          {/* ---- the story ---- */}
          <div className="mt-[clamp(20px,2.539vw,40.6px)] grid gap-[clamp(16px,2.539vw,40.6px)] lg:grid-cols-[minmax(0,212fr)_minmax(0,505fr)_minmax(0,250fr)]">
            <div
              className="relative isolate hidden min-h-[clamp(180px,17.578vw,281.3px)] overflow-hidden rounded-sm bg-cover bg-center lg:block"
              style={{
                backgroundImage:
                  'linear-gradient(180deg,rgba(20,27,26,0.1) 0%,rgba(20,27,26,0.75) 100%),url(/about/img/timeline-story.jpg)',
              }}
            >
              <span
                aria-hidden="true"
                className="absolute bottom-[14px] left-[16px] select-none font-tst text-[clamp(40px,4.297vw,68.8px)] italic leading-none text-white"
              >
                {point.n}
              </span>
            </div>

            <div className="min-w-0">
              <p className="font-tst text-[clamp(12px,1.172vw,18.8px)] italic leading-[1.3] text-eden">
                {point.n} &nbsp;·&nbsp; {point.label} &nbsp;·&nbsp; {point.when}
              </p>
              <p className="mt-[clamp(6px,0.781vw,12.5px)] font-kyg text-[clamp(22px,2.93vw,46.9px)] font-normal leading-[1.133] tracking-[-0.01em] text-heavy">
                {point.headline}
              </p>
              <p className="mt-[clamp(8px,0.781vw,12.5px)] font-kyg text-[clamp(12.5px,1.221vw,19.5px)] font-normal leading-[1.56] text-fusc">
                {point.body}
              </p>

              <div className="mt-[clamp(12px,1.172vw,18.8px)] flex flex-wrap items-center gap-[clamp(8px,0.781vw,12.5px)]">
                <button
                  type="button"
                  onClick={() => goTo(Math.max(0, i - 1))}
                  disabled={i === 0}
                  className="inline-flex min-h-[44px] items-center gap-[6px] rounded-sm bg-eden px-[12px] py-[7px] font-kyg text-[clamp(12px,1.025vw,16.4px)] font-semibold text-white transition disabled:opacity-40 hover:bg-eden2 disabled:hover:bg-eden motion-reduce:transition-none"
                >
                  <Icon name="arrow" strokeWidth={2} className="h-[11px] w-[11px] rotate-180" />
                  {i === 0 ? 'Start' : C.points[i - 1].label}
                </button>
                <button
                  type="button"
                  onClick={() => goTo(Math.min(last, i + 1))}
                  disabled={i === last}
                  className="inline-flex min-h-[44px] items-center gap-[6px] rounded-sm bg-eden px-[12px] py-[7px] font-kyg text-[clamp(12px,1.025vw,16.4px)] font-semibold text-white transition disabled:opacity-40 hover:bg-eden2 disabled:hover:bg-eden motion-reduce:transition-none"
                >
                  {i === last ? 'End' : C.points[i + 1].label}
                  <Icon name="arrow" strokeWidth={2} className="h-[11px] w-[11px]" />
                </button>
                <span
                  aria-live="polite"
                  className="font-kyg text-[clamp(11px,1.074vw,17.2px)] font-light text-nevada/80"
                >
                  {point.n} / 0{C.points.length}
                </span>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-[clamp(8px,0.781vw,12.5px)] rounded-sm bg-eden p-[clamp(16px,1.758vw,28.1px)]">
              <span className="inline-flex items-center gap-[6px]">
                <Icon name="arrow" strokeWidth={2} className="h-[11px] w-[11px] shrink-0 text-ice" />
                <span className="font-tst text-[clamp(12px,1.172vw,18.8px)] italic leading-[1.3] text-ice">
                  {C.kyg.kicker}
                </span>
              </span>
              <p className="font-kyg text-[clamp(15px,1.66vw,26.6px)] font-semibold leading-[1.235] text-white">
                {C.kyg.body}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Hr className="mt-[clamp(18px,2.148vw,34.4px)]" />

      <div className="mt-[clamp(12px,1.367vw,21.9px)] flex flex-col gap-[clamp(10px,1.172vw,18.8px)] sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[clamp(640px,62.5vw,1000px)] font-kyg text-[clamp(11.8px,1.152vw,18.4px)] font-normal leading-[1.441] text-fusc">
          {C.foot}
        </p>
        <Hint>{C.hint}</Hint>
      </div>
    </Section>
  );
}
