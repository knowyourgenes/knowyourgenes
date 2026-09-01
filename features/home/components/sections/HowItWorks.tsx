'use client';

import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { useScrollPin } from '../lib/use-scroll-pin';
import { Button, Icon, PHOTO, Section, SectionTitle } from '../ui';

/** The five steps, verbatim. Only one body is on screen at a time. */
const STEPS = [
  {
    n: '01',
    title: 'Find your test',
    body: 'Choose what you’d like to understand, or let us help you find the right test.',
  },
  {
    n: '02',
    title: 'Give your sample',
    body: 'Depending on the test, sample collection is made simple and convenient.',
  },
  {
    n: '03',
    title: 'We get to work',
    body: 'Your sample is processed through our trusted genetic laboratory ecosystem using the methodology appropriate for your selected test.',
  },
  {
    n: '04',
    title: 'Receive your results',
    body: 'Get genetic insights presented in a way that’s easier to understand.',
  },
  {
    n: '05',
    title: 'Understand what comes next',
    body: 'Access expert or genetic counselling support where applicable to help put your results into context.',
  },
];

/** The walk position each tile sits at: 0, 0.25, 0.5, 0.75, 1. */
const AT = (i: number) => i / (STEPS.length - 1);

/**
 * A stepper, not five columns.
 *
 * The five step bodies run from 12 to 30 words. Laid out as five equal columns
 * (which is what the old build did) they ended at five different heights and
 * left a ragged band of empty ground across the bottom, with the CTA stranded
 * below all of it. One panel at a time makes the uneven lengths irrelevant.
 */
export default function HowItWorks({
  connectors = false,
  /**
   * Hold the section still and let page-scroll walk the track, the way the life
   * curve in 04 does. Implies `connectors` - the line IS the read-out, so there
   * is nothing to fill without it.
   */
  pinned = false,
}: { connectors?: boolean; pinned?: boolean } = {}) {
  const { track, pane, walked, pinning, scrollToWalked } = useScrollPin();
  const [clicked, setClicked] = useState(0);

  const joined = connectors || pinned;
  /**
   * Scroll owns the active step while the pin is live; clicks own it otherwise.
   *
   * They must never both own it. Setting state from a click inside a live pin
   * is overwritten by the next scroll frame, which reads as a dead control - so
   * a click there moves the PAGE instead, and the state follows from that.
   */
  const driven = pinned && pinning;
  const active = driven ? Math.min(STEPS.length - 1, Math.floor(walked * (STEPS.length - 1))) : clicked;
  const goTo = (i: number) => (driven ? scrollToWalked(AT(i)) : setClicked(i));

  const step = STEPS[active]!;
  const next = STEPS[active + 1];

  return (
    <Section id="how-it-works" ground="cream" labelledBy="hiw-heading">
      {/* The pin. Only from lg up, and only when asked for: below that the
          track is auto-height and the pane is static, so this is an ordinary
          section that happens to carry two extra refs. */}
      <div ref={track} className={cn('relative', pinned && 'lg:h-[200vh]')}>
        <div
          ref={pane}
          className={cn(
            pinned &&
              'lg:sticky lg:top-[var(--site-header-h,104px)] lg:flex lg:h-[calc(100svh-var(--site-header-h,104px))] lg:flex-col lg:justify-center'
          )}
        >
          <SectionTitle
            id="hiw-heading"
            eyebrow="How it works"
            aside={
              <div className="flex lg:justify-end">
                <Button href="/categories">Find My Test</Button>
              </div>
            }
          >
            A lot of science. <em>Made remarkably simple.</em>
          </SectionTitle>

          {/* The track. Each tile is a real control - the numerals are how you
              move through the section, not decoration on it. */}
          <ol className="mt-[clamp(18px,min(3.7vw,3.6vh),52px)] grid list-none gap-[10px] sm:grid-cols-2 lg:grid-cols-5 lg:gap-[clamp(10px,1.4vw,20px)]">
            {STEPS.map((s, i) => {
              const on = i === active;
              // How much of THIS segment the walk has covered. Each of the four
              // segments owns a quarter of the walk, so the light crosses the
              // row at one speed rather than four.
              const segment = driven
                ? Math.min(1, Math.max(0, (walked - AT(i)) / (AT(1) - AT(0))))
                : i < active
                  ? 1
                  : 0;
              return (
                <li key={s.n} className={joined ? 'relative' : undefined}>
                  {/* The line that joins one tile to the next, drawn only on lg
                      where the five are actually a row. It starts 11px past the
                      tile and runs to the column edge - the grid's own gap
                      supplies the matching breathing space on the far side.
                      Never after the last step: a line running off the rail
                      says the sequence continues, and it does not. */}
                  {joined && i < STEPS.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-[57px] right-0 top-[23px] hidden h-px bg-zeus/[0.13] lg:block"
                    >
                      {/* The lit part. eden rather than java2, and an eden glow:
                          this section is on cream, where the teal the dark
                          sections glow with reads as a stray highlighter. */}
                      <span
                        className="block h-full origin-left bg-eden shadow-[0_0_8px_0_rgba(14,77,75,0.55)] motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-out"
                        style={{ width: `${segment * 100}%` }}
                      />
                    </span>
                  ) : null}
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => goTo(i)}
                    className="flex w-full items-center gap-[14px] text-left lg:flex-col lg:items-start"
                  >
                    <span
                      className={cn(
                        'grid h-[46px] w-[46px] shrink-0 place-items-center rounded-sm font-kyg text-[19px] font-extrabold tabular-nums',
                        'transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                        on
                          ? 'bg-eden text-linenw shadow-[0_0_0_7px_rgba(14,77,75,0.1)]'
                          : 'bg-white text-pewter ring-1 ring-inset ring-zeus/[0.14] hover:ring-eden/40'
                      )}
                    >
                      {s.n}
                    </span>
                    <span
                      className={cn(
                        'min-w-0 font-kyg text-[16.5px] font-bold leading-[1.3] tracking-[-0.015em] lg:mt-[20px]',
                        on ? 'text-zeus' : 'text-fusc'
                      )}
                    >
                      {s.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* One panel. Photograph left, the active step's copy right. */}
          <div className="mt-[clamp(14px,min(2.8vw,2.6vh),36px)] grid overflow-hidden rounded-sm bg-white ring-1 ring-inset ring-zeus/[0.1] lg:grid-cols-[minmax(0,620px)_minmax(0,1fr)]">
            <div className="relative aspect-[16/9] max-h-[min(34vh,380px)] w-full lg:aspect-auto lg:min-h-0">
              <Image
                src={PHOTO.conversation}
                alt="Two people choosing a test together over a tablet"
                fill
                sizes="(max-width: 1023px) 100vw, 620px"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,41,39,0.8)_0%,rgba(6,41,39,0.14)_58%,rgba(6,41,39,0.04)_100%)]"
              />
              <span className="absolute left-[38px] top-[26px] font-tst text-[clamp(72px,9vw,124px)] font-medium italic leading-none text-white/30">
                {step.n}
              </span>
            </div>

            <div className="flex min-w-0 flex-col justify-center px-[clamp(22px,2.6vw,44px)] py-[clamp(26px,3vw,40px)]">
              <span className="inline-flex w-fit rounded-sm bg-eden/[0.08] px-[13px] py-[7px] font-kyg text-[12px] font-bold uppercase tracking-[0.14em] text-eden">
                Step {step.n} of 05
              </span>

              <h3 className="mt-[18px] font-kyg text-[clamp(22px,2.2vw,30px)] font-bold leading-[1.25] tracking-[-0.02em] text-zeus">
                {step.title}
              </h3>

              <p className="mt-[12px] font-kyg text-[17px] leading-[1.66] text-fusc">{step.body}</p>

              {next ? (
                <button
                  type="button"
                  onClick={() => goTo(active + 1)}
                  className="group/next mt-[24px] inline-flex w-fit items-center gap-[8px] font-kyg text-[15px] font-semibold text-eden transition-colors duration-300 hover:text-eden2"
                >
                  Next · {next.title}
                  <Icon
                    name="arrow"
                    strokeWidth={2}
                    className="h-[16px] w-[16px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/next:translate-x-[3px] motion-reduce:transition-none"
                  />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
