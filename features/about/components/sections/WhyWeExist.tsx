'use client';

import { type CSSProperties, useState } from 'react';

import { Eyebrow, Heading, Icon, Note, Section } from '@/components/shared/kyg';
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
  // Explicitly number: C.initial is 2 inside an `as const` block, so an
  // inferred state would be typed as the literal 2 and refuse every other point.
  const [i, setI] = useState<number>(C.initial);
  const point = C.points[i];
  const last = C.points.length - 1;
  // The bar stops at the ACTIVE NODE'S CENTRE. Points sit at the centres of
  // equal fifths, so that is (i + 0.5)/5 - the frame draws 483.5 of 967 on
  // point 03, which is exactly 50%. `i / last` started the line at 0% on
  // point 01 and ran it to the very end on 05, neither of which it does.
  const pct = ((i + 0.5) / C.points.length) * 100;

  return (
    <Section id="why-we-exist" labelledBy="why-we-exist-heading">
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

      {/* ---- the timeline ----
          THE FRAME STACKS THIS IN ONE ORDER AND THE ORDER IS THE POINT: flags
          ABOVE the track on stems that land on their own nodes, then the track,
          then the labels, then the zone bands UNDER them. A flag says WHERE a
          story starts, so it has to point at a node; a band says WHAT a stretch
          of the line is, so it sits beneath the stretch it names. Both are
          pointer-scale annotation and go below `md`. */}
      <div className="mt-[clamp(22px,3.027vw,48.4px)]">
        {/* The flags. Five equal columns - the SAME five the track below uses -
            so each marker stays centred over its node at every width, instead
            of being pinned to a percentage that only holds at one size. */}
        <div aria-hidden="true" className="hidden h-[clamp(38px,4.883vw,78.1px)] md:flex">
          {C.points.map((p) => (
            <span key={p.n} className="flex flex-1 flex-col items-center">
              {p.flag ? (
                <>
                  <span
                    className={cn(
                      'inline-flex items-center gap-[5px] rounded-sm px-[9px] py-[5px]',
                      p.flag.tone === 'ours' ? 'bg-eden' : 'bg-white ring-1 ring-inset ring-zeus/[0.14]'
                    )}
                  >
                    <Icon
                      name="flag"
                      strokeWidth={2}
                      className={cn('h-[9px] w-[9px]', p.flag.tone === 'ours' ? 'text-ice' : 'text-eden')}
                    />
                    <Kicker size="sm" tone={p.flag.tone === 'ours' ? 'ice' : 'eden'}>
                      {p.flag.label}
                    </Kicker>
                  </span>
                  {/* the frame's 10x6 pointer on the pill, then a hairline stem
                      down to the node - `flex-1`, so it always reaches it */}
                  <span
                    className={cn(
                      'h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent',
                      p.flag.tone === 'ours' ? 'border-t-eden' : 'border-t-white'
                    )}
                  />
                  <span className={cn('w-px flex-1', p.flag.tone === 'ours' ? 'bg-eden/45' : 'bg-zeus/20')} />
                </>
              ) : null}
            </span>
          ))}
        </div>

        {/* `--node` is the ACTIVE node's diameter, published once so the track,
            the glow and the progress line can all centre on it. The frame draws
            every node centred on the same 2px line whatever its size, and a
            hard `top-[6px]` only held while the active node was undersized. */}
        {/* THE LINE RUNS DOWN THE PAGE ON A PHONE AND ACROSS IT FROM `sm`.
            `--pct` carries the walk so the same element can fill on either
            axis; `--node` is still the active node's diameter, so the rail
            centres on the dots whichever way it is pointing. */}
        <div
          className="relative"
          style={{ '--node': 'clamp(16px,2.148vw,34.4px)', '--pct': `${pct}%` } as CSSProperties}
        >
          {/* the unlit rail */}
          <div
            aria-hidden="true"
            className="absolute left-[calc(4px+var(--node)/2-1px)] top-0 h-full w-[2px] rounded-sm bg-zeus/[0.14] sm:left-0 sm:right-0 sm:top-[calc(var(--node)/2-1px)] sm:h-[2px] sm:w-auto"
          />
          {/* the glow is the frame's, and is decoration - it only reads as a
              glow along a horizontal line, so it stays there */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-[calc(var(--node)/2-3.5px)] hidden h-[7px] w-[var(--pct)] rounded-sm bg-[linear-gradient(90deg,rgba(14,77,75,0)_0%,rgba(42,195,162,0.35)_100%)] blur-[3px] transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:block"
          />
          {/* the lit length */}
          <div
            aria-hidden="true"
            className="absolute left-[calc(4px+var(--node)/2-1.25px)] top-0 h-[var(--pct)] w-[2.5px] rounded-sm bg-[linear-gradient(180deg,#0E4D4B_0%,#2AC3A2_100%)] transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:left-0 sm:top-[calc(var(--node)/2-1.25px)] sm:h-[2.5px] sm:w-[var(--pct)] sm:bg-[linear-gradient(90deg,#0E4D4B_0%,#2AC3A2_100%)] sm:transition-[width]"
          />

          {/* Equal fifths, not `justify-between`: the frame centres each point
              in its own fifth (10%, 30%, 50%, 70%, 90%), so the line runs on
              past 01 and 05 rather than starting and ending on them. */}
          <ol className="relative flex list-none flex-col gap-[2px] sm:flex-row sm:items-start sm:gap-0">
            {C.points.map((p, n) => {
              const active = n === i;
              const passed = n <= i;
              return (
                <li key={p.n} className="min-w-0 sm:flex-1">
                  <button
                    type="button"
                    onClick={() => setI(n)}
                    aria-current={active ? 'step' : undefined}
                    aria-label={`${p.n} · ${p.label} · ${p.when}`}
                    /* A FULL-WIDTH ROW ON A PHONE, a column from `sm`. Five
                       labelled points cannot sit side by side on a 360px rail -
                       "Searching for answers" alone gets 72px - so the frame's
                       row was turning into five anonymous dots and the section
                       lost its whole argument. Down the page there is no such
                       limit, and each point becomes a 44px-tall target the width
                       of the screen instead of a 44px dot. */
                    className="group/pt flex min-h-[44px] w-full flex-wrap items-center gap-[12px] px-[4px] text-left outline-none sm:w-auto sm:min-w-[44px] sm:flex-nowrap sm:flex-col sm:justify-center sm:gap-0 sm:text-center"
                  >
                    {/* every node centres inside one `--node` box, so a 12px dot
                        and a 22px one sit on the same line */}
                    <span className="flex h-[var(--node)] w-[var(--node)] shrink-0 items-center justify-center">
                      <span
                        className={cn(
                          'block shrink-0 rounded-full ring-2 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-visible/pt:ring-offset-2 group-focus-visible/pt:ring-offset-linenw motion-reduce:transition-none',
                          active
                            ? 'h-[var(--node)] w-[var(--node)] bg-eden shadow-[0_4px_12px_0_rgba(14,77,75,0.28)] ring-[3px] ring-linenw'
                            : passed
                              ? 'h-[clamp(10px,1.172vw,18.8px)] w-[clamp(10px,1.172vw,18.8px)] bg-eden ring-eden'
                              : 'h-[clamp(10px,1.172vw,18.8px)] w-[clamp(10px,1.172vw,18.8px)] bg-linenw ring-eden'
                        )}
                      />
                    </span>
                    {/* ONE set of markup for both axes: a baseline row that
                        wraps on a phone, the frame's centred stack from `sm`. */}
                    <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-[7px] sm:mt-[clamp(6px,0.586vw,9.4px)] sm:flex-none sm:flex-col sm:items-center sm:gap-x-0">
                      <span
                        className={cn(
                          'font-kyg text-[clamp(11px,1.025vw,16.4px)] font-light leading-none',
                          active ? 'text-eden' : 'text-nevada/70'
                        )}
                      >
                        {p.n}
                      </span>
                      <span
                        className={cn(
                          'font-kyg text-[clamp(13px,1.123vw,18px)] leading-[1.35] tracking-[-0.003em] sm:mt-[3px] sm:text-center sm:leading-[1.2]',
                          active ? 'font-bold text-eden' : 'font-medium text-heavy/80'
                        )}
                      >
                        {p.label}
                      </span>
                      {/* the middot only exists while the three sit on one line */}
                      <span className="font-tst text-[clamp(12px,1.172vw,18.8px)] italic leading-[1.35] text-nevada/80 before:mr-[6px] before:content-['·'] sm:mt-[1px] sm:text-center sm:leading-[1.2] sm:before:content-none">
                        {p.when}
                      </span>
                    </span>

                    {/* The flag, inline on its own row. The anchored version
                        above the track needs five equal columns to point at
                        anything, so it starts at `md`; below that the marker
                        would be lost, and it is the section's thesis - our
                        story starts at birth, most people's at a symptom. */}
                    {p.flag ? (
                      /* `basis-full` drops it onto its own line, indented to sit
                         under the label rather than under the node. */
                      <span className="mt-[2px] flex basis-full pl-[calc(var(--node)+12px)] sm:hidden">
                        <span
                          className={cn(
                            'inline-flex shrink-0 items-center gap-[5px] rounded-sm px-[8px] py-[4px]',
                            p.flag.tone === 'ours' ? 'bg-eden' : 'bg-white ring-1 ring-inset ring-zeus/[0.14]'
                          )}
                        >
                          <Icon
                            name="flag"
                            strokeWidth={2}
                            className={cn('h-[9px] w-[9px]', p.flag.tone === 'ours' ? 'text-ice' : 'text-eden')}
                          />
                          <Kicker size="sm" tone={p.flag.tone === 'ours' ? 'ice' : 'eden'}>
                            {p.flag.label}
                          </Kicker>
                        </span>
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* The zone bands, BENEATH the labels as the frame draws them. 374.8 to
            568.2 of the rail puts the seam on the 02|03 boundary - exactly
            where "before anything feels wrong" stops being true. */}
        <div className="mt-[clamp(8px,0.781vw,12.5px)] hidden gap-[6px] md:flex">
          <span className="flex items-center justify-center rounded-sm bg-eden/[0.09] px-[10px] py-[4px] font-tst text-[clamp(12.5px,1.221vw,19.5px)] font-semibold italic text-eden [flex:374.8]">
            {C.zones.before}
          </span>
          <span className="flex items-center justify-center rounded-sm bg-zeus/[0.05] px-[10px] py-[4px] font-tst text-[clamp(12.5px,1.221vw,19.5px)] font-semibold italic text-fusc [flex:568.2]">
            {C.zones.after}
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
          {/* A LABEL, so it is the uppercase Figtree voice - the frame draws it
              at 8.2px/0.2em, which is exactly `Kicker`. It was set in Cormorant
              italic, which is the voice this panel reserves for statements. */}
          <Kicker>
            {point.n} &nbsp;·&nbsp; {point.label} &nbsp;·&nbsp; {point.when}
          </Kicker>
          {/* ...and the moment itself is the STATEMENT, so it takes the
              Cormorant italic the kicker had borrowed. 30/34 at the frame's
              1024, which is what the size and leading below already were. */}
          <p className="mt-[clamp(6px,0.781vw,12.5px)] font-tst text-[clamp(22px,2.93vw,46.9px)] font-normal italic leading-[1.133] tracking-[-0.01em] text-heavy">
            {point.headline}
          </p>
          <p className="mt-[clamp(8px,0.781vw,12.5px)] font-kyg text-[clamp(12.5px,1.221vw,19.5px)] font-normal leading-[1.56] text-fusc">
            {point.body}
          </p>

          <div className="mt-[clamp(12px,1.172vw,18.8px)] flex flex-wrap items-center gap-[clamp(8px,0.781vw,12.5px)]">
            <button
              type="button"
              onClick={() => setI((n) => Math.max(0, n - 1))}
              disabled={i === 0}
              className="inline-flex min-h-[44px] items-center gap-[6px] rounded-sm bg-eden px-[12px] py-[7px] font-kyg text-[clamp(12px,1.025vw,16.4px)] font-semibold text-white transition disabled:opacity-40 hover:bg-eden2 disabled:hover:bg-eden motion-reduce:transition-none"
            >
              <Icon name="arrow" strokeWidth={2} className="h-[11px] w-[11px] rotate-180" />
              {i === 0 ? 'Start' : C.points[i - 1].label}
            </button>
            <button
              type="button"
              onClick={() => setI((n) => Math.min(last, n + 1))}
              disabled={i === last}
              className="inline-flex min-h-[44px] items-center gap-[6px] rounded-sm bg-eden px-[12px] py-[7px] font-kyg text-[clamp(12px,1.025vw,16.4px)] font-semibold text-white transition disabled:opacity-40 hover:bg-eden2 disabled:hover:bg-eden motion-reduce:transition-none"
            >
              {i === last ? 'End' : C.points[i + 1].label}
              <Icon name="arrow" strokeWidth={2} className="h-[11px] w-[11px]" />
            </button>
            <span aria-live="polite" className="font-kyg text-[clamp(11px,1.074vw,17.2px)] font-light text-nevada/80">
              {point.n} / 0{C.points.length}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-[clamp(8px,0.781vw,12.5px)] rounded-sm bg-eden p-[clamp(16px,1.758vw,28.1px)]">
          <span className="inline-flex items-center gap-[6px]">
            <Icon name="arrow" strokeWidth={2} className="h-[11px] w-[11px] shrink-0 text-ice" />
            <Kicker tone="ice">{C.kyg.kicker}</Kicker>
          </span>
          {/* Cormorant SemiBold Italic 17/21 - the card's whole job is to say
              the one thing that changes, so it speaks in the statement voice */}
          <p className="font-tst text-[clamp(15px,1.66vw,26.6px)] font-semibold italic leading-[1.235] text-white">
            {C.kyg.body}
          </p>
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
