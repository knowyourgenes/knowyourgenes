'use client';

import { useState } from 'react';

import { Button, Eyebrow, Icon, Section } from '@/components/shared/kyg';
import { cn } from '@/lib/utils';
import { WHAT_YOU_DO as C } from '../../constants';
import { Hr, Kicker } from '../ui';

/**
 * 07 · What do you do with it - Figma 551:436.
 *
 * A five-stage flow, then the four questions a report tends to raise, each
 * opening to where it leads.
 *
 * The flow's second chip is lit, matching the open row: "Question" is the stage
 * the section is about. Selecting a row moves that highlight, so the strip reads
 * as a position indicator rather than decoration.
 */
export default function WhatYouDo() {
  const [open, setOpen] = useState(0);

  return (
    <Section id="what-you-do" labelledBy="what-you-do-heading">
      <Eyebrow icon="dna">{C.eyebrow}</Eyebrow>

      <h2
        id="what-you-do-heading"
        data-rise="2"
        className="mt-[clamp(12px,1.367vw,21.9px)] font-kyg tracking-[-0.02em] text-balance"
      >
        <span className="block text-[clamp(28px,4.297vw,68.8px)] font-medium leading-[1.045] text-eden">
          {C.headline}
        </span>
        <span className="block text-[clamp(22px,3.193vw,51.1px)] font-bold leading-[1.223] tracking-[-0.03em] text-heavy">
          {C.turn}
        </span>
      </h2>

      <p className="mt-[clamp(10px,0.977vw,15.6px)] max-w-[clamp(640px,62.5vw,1000px)] font-kyg text-[clamp(15px,1.465vw,23.4px)] font-normal leading-[1.4] text-heavy">
        {C.lead}
      </p>

      {/* ---- the flow ---- */}
      <div className="mt-[clamp(20px,2.734vw,43.8px)] flex flex-wrap items-center gap-[clamp(6px,0.781vw,12.5px)]">
        {C.flow.map((stage, i) => {
          // Stage 0 is "Result", the thing you arrive with; the open row's
          // destination is what lights up after it.
          const lit = i === 0 || C.rows[open].leads === stage;
          return (
            <div key={stage} className="contents">
              {i > 0 ? (
                <Icon
                  name="arrow"
                  strokeWidth={2}
                  className="h-[clamp(11px,1.074vw,17.2px)] w-[clamp(11px,1.074vw,17.2px)] shrink-0 text-eden/45"
                />
              ) : null}
              <span
                className={cn(
                  'inline-flex shrink-0 items-center justify-center rounded-sm px-[clamp(10px,0.977vw,15.6px)] py-[clamp(11px,1.27vw,20.3px)]',
                  'font-kyg text-[clamp(11.2px,1.094vw,17.5px)] leading-none transition-colors duration-300 motion-reduce:transition-none',
                  i === 0 && 'bg-eden/[0.12] font-medium text-eden',
                  i > 0 && lit && 'bg-eden font-bold text-white',
                  i > 0 && !lit && 'bg-zeus/[0.06] font-medium text-fusc'
                )}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>

      {/* ---- the questions ---- */}
      <ul className="mt-[clamp(16px,2.148vw,34.4px)] flex list-none flex-col gap-[clamp(8px,0.781vw,12.5px)]">
        {C.rows.map((row, i) => {
          const isOpen = i === open;
          return (
            <li
              key={row.q}
              className={cn(
                'rounded-sm px-[clamp(14px,1.758vw,28.1px)] py-[clamp(12px,1.367vw,21.9px)] ring-1 ring-inset transition-colors duration-300 motion-reduce:transition-none',
                isOpen ? 'bg-white ring-zeus/[0.13]' : 'bg-white/45 ring-zeus/[0.08]'
              )}
            >
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-expanded={isOpen}
                  aria-controls={`q-panel-${i}`}
                  className="flex min-h-[44px] w-full items-center gap-[clamp(10px,1.367vw,21.9px)] text-left outline-none focus-visible:underline focus-visible:decoration-eden focus-visible:underline-offset-4"
                >
                  <span
                    aria-hidden="true"
                    className="shrink-0 select-none font-tst text-[clamp(24px,2.93vw,46.9px)] italic leading-[0.6] text-eden/30"
                  >
                    &ldquo;
                  </span>
                  <span
                    className={cn(
                      'min-w-0 flex-1 font-kyg text-[clamp(14px,1.367vw,21.9px)] font-bold leading-[1.286] tracking-[-0.01em]',
                      isOpen ? 'text-heavy' : 'text-fusc'
                    )}
                  >
                    {row.q}
                  </span>
                  <Icon
                    name="chevron"
                    strokeWidth={2}
                    className={cn(
                      'h-[clamp(12px,1.172vw,18.8px)] w-[clamp(12px,1.172vw,18.8px)] shrink-0 text-eden transition-transform duration-300 motion-reduce:transition-none',
                      isOpen ? 'rotate-90' : 'rotate-0'
                    )}
                  />
                </button>
              </h3>

              <div
                id={`q-panel-${i}`}
                className={cn(
                  'grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                )}
              >
                <div className="overflow-hidden">
                  <div className="flex gap-[clamp(10px,1.172vw,18.8px)] pt-[clamp(10px,0.977vw,15.6px)]">
                    <span aria-hidden="true" className="w-[2px] shrink-0 rounded-sm bg-java2" />
                    <p className="min-w-0 font-kyg text-[clamp(11.7px,1.143vw,18.3px)] font-normal leading-[1.598] text-fusc">
                      {row.a}
                    </p>
                  </div>
                  <span className="mt-[clamp(10px,0.977vw,15.6px)] inline-flex items-center gap-[clamp(6px,0.586vw,9.4px)] rounded-sm bg-eden/[0.07] px-[clamp(8px,0.781vw,12.5px)] py-[clamp(4px,0.391vw,6.3px)] ring-1 ring-inset ring-eden/[0.18]">
                    <Icon
                      name="arrow"
                      strokeWidth={2}
                      className="h-[clamp(9px,0.879vw,14.1px)] w-[clamp(9px,0.879vw,14.1px)] text-eden"
                    />
                    <Kicker size="sm" className="tracking-[0.08em]">
                      Leads to · {row.leads}
                    </Kicker>
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <Hr className="mt-[clamp(18px,2.539vw,40.6px)]" />

      <div className="mt-[clamp(14px,1.758vw,28.1px)] flex flex-col gap-[clamp(12px,1.367vw,21.9px)] sm:flex-row sm:items-center sm:justify-between">
        <p className="font-tst text-[clamp(17px,1.855vw,29.7px)] font-medium italic leading-[1.3] text-heavy">
          {C.foot}
        </p>
        <Button href={C.cta.href} variant="ghost" className="shrink-0">
          {C.cta.label}
        </Button>
      </div>
    </Section>
  );
}
