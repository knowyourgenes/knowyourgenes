'use client';

import { useState } from 'react';

import { Eyebrow, Heading, Icon, Section } from '@/components/shared/kyg';
import { cn } from '@/lib/utils';
import { OUR_APPROACH as C } from '../../constants';
import { Coda, Hr, Kicker } from '../ui';

/**
 * 08 · Our approach - Figma 553:368.
 *
 * Four principles as a picker: the rows on the right, the selected one expanded
 * into the eden card on the left.
 *
 * The card comes SECOND in the DOM and first on screen at `lg`. Source order
 * matters more than visual order here: the rows are the control and the card is
 * the output, so a screen reader meets the choices before the consequence.
 */
export default function OurApproach() {
  const [p, setP] = useState(0);
  const principle = C.principles[p];

  return (
    <Section id="our-approach" ground="sand" labelledBy="our-approach-heading">
      <div className="flex flex-col gap-[clamp(16px,2.148vw,34.4px)] lg:flex-row lg:justify-between">
        <div className="min-w-0">
          <Eyebrow icon="dna">{C.eyebrow}</Eyebrow>
          <Heading
            id="our-approach-heading"
            className="mt-[clamp(11px,1.074vw,17.2px)] max-w-[clamp(600px,58.594vw,937.5px)] text-[clamp(24px,3.193vw,51.1px)] leading-[1.306]"
          >
            {C.headline} <em>{C.turn}</em>
          </Heading>
        </div>
        <p className="shrink-0 font-kyg text-[clamp(15px,1.465vw,23.4px)] font-normal leading-[1.4] text-fusc lg:w-[clamp(300px,29.297vw,468.8px)] lg:pt-[clamp(20px,4.297vw,68.8px)]">
          {C.aside}
        </p>
      </div>

      <div className="mt-[clamp(20px,2.93vw,46.9px)] grid gap-[clamp(16px,2.148vw,34.4px)] lg:grid-cols-[minmax(0,380fr)_minmax(0,565fr)]">
        {/* the card - visually first on lg, second in source */}
        <div className="relative isolate order-last flex min-w-0 flex-col gap-[clamp(8px,0.977vw,15.6px)] overflow-hidden rounded-sm bg-eden p-[clamp(18px,2.539vw,40.6px)] lg:order-first">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[0.22em] right-[-0.03em] -z-10 select-none font-kyg text-[clamp(110px,16.602vw,265.6px)] font-normal leading-none text-white/[0.06]"
          >
            {principle.n}
          </span>

          <Kicker tone="java">Principle {principle.n}</Kicker>
          <p
            aria-live="polite"
            className="font-kyg text-[clamp(22px,2.734vw,43.8px)] font-bold leading-[1.143] tracking-[-0.02em] text-white"
          >
            {principle.title}
          </p>
          <p className="font-kyg text-[clamp(13px,1.27vw,20.3px)] font-medium leading-[1.462] text-white">
            {principle.lead}
          </p>
          <p className="font-kyg text-[clamp(11.5px,1.123vw,18px)] font-normal leading-[1.522] text-white/[0.72]">
            {principle.body}
          </p>
        </div>

        {/* the rows */}
        <div className="flex min-w-0 flex-col gap-[clamp(6px,0.781vw,12.5px)]">
          {C.principles.map((x, n) => {
            const active = n === p;
            return (
              <button
                key={x.n}
                type="button"
                onClick={() => setP(n)}
                aria-pressed={active}
                className={cn(
                  'flex w-full items-center gap-[clamp(10px,1.172vw,18.8px)] rounded-sm py-[clamp(11px,1.27vw,20.3px)] pl-[clamp(12px,1.563vw,25px)] pr-[clamp(11px,1.367vw,21.9px)] text-left outline-none ring-1 ring-inset transition duration-300 focus-visible:ring-2 focus-visible:ring-eden motion-reduce:transition-none',
                  active ? 'bg-white ring-eden/50' : 'bg-white ring-zeus/10 hover:ring-eden/25'
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn('h-[7px] w-[7px] shrink-0 rounded-sm', active ? 'bg-java2' : 'bg-nevada/35')}
                />
                <span
                  className={cn(
                    'min-w-0 flex-1 font-kyg text-[clamp(12px,1.172vw,18.8px)] leading-[1.35]',
                    active ? 'font-bold text-heavy' : 'font-medium text-fusc'
                  )}
                >
                  {x.lead}
                </span>
                <Icon
                  name="arrow"
                  strokeWidth={2}
                  className={cn(
                    'h-[12px] w-[12px] shrink-0 transition-transform duration-300 motion-reduce:transition-none',
                    active ? 'translate-x-[2px] text-eden' : 'text-nevada/50'
                  )}
                />
              </button>
            );
          })}

          <p className="mt-[clamp(4px,0.391vw,6.3px)] font-kyg text-[clamp(10.7px,1.045vw,16.7px)] font-normal leading-[1.449] text-nevada">
            {C.note}
          </p>
        </div>
      </div>

      <Hr className="mt-[clamp(20px,2.93vw,46.9px)]" />
      <Coda lead={C.foot.lead} turn={C.foot.turn} className="mt-[clamp(14px,1.953vw,31.3px)]" />
    </Section>
  );
}
