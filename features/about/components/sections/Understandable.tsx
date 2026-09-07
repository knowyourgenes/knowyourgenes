'use client';

import { useState } from 'react';

import { Button, Eyebrow, Heading, Icon, Section } from '@/components/shared/kyg';
import { cn } from '@/lib/utils';
import { UNDERSTANDABLE as C } from '../../constants';
import { Hint } from '../ui';

/**
 * 05 · Making genetics understandable - Figma 548:316.
 *
 * A translator panel: the jargon along the top, and underneath it the plain
 * sentence we print instead, plus a worked example. Picking a term swaps both.
 *
 * The panel comes FIRST in the DOM and second on screen below `lg` - the copy
 * column explains what the panel is doing, and reading the demo before the
 * explanation is the wrong order on a phone. `lg:order-first` restores the
 * frame's left-hand placement on a wide screen.
 */
export default function Understandable() {
  const [t, setT] = useState(0);
  const term = C.terms[t];

  return (
    <Section id="understandable" labelledBy="understandable-heading">
      <div className="grid gap-[clamp(20px,4.297vw,68.8px)] lg:grid-cols-[minmax(0,455fr)_minmax(0,468fr)]">
        {/* ---- the translator ---- */}
        <div className="relative isolate order-last flex min-w-0 flex-col gap-[clamp(11px,1.367vw,21.9px)] overflow-hidden rounded-sm bg-eden p-[clamp(18px,2.344vw,37.5px)] lg:order-first">
          {/* the frame's ghost "G" */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[0.18em] right-[-0.04em] -z-10 select-none font-kyg text-[clamp(120px,17.578vw,281.3px)] font-normal leading-none text-white/[0.05]"
          >
            G
          </span>

          <span className="inline-flex items-center gap-[7px]">
            <Icon name="arrow" strokeWidth={2} className="h-[11px] w-[11px] shrink-0 text-java2" />
            <span className="font-tst text-[clamp(12.5px,1.221vw,19.5px)] font-semibold italic leading-none text-java2">
              {C.panel.science}
            </span>
          </span>

          <div role="tablist" aria-label="Genetics terms" className="flex flex-wrap gap-[6px]">
            {C.terms.map((x, n) => (
              <button
                key={x.term}
                type="button"
                role="tab"
                aria-selected={n === t}
                onClick={() => setT(n)}
                className={cn(
                  'rounded-sm px-[clamp(9px,1.074vw,17.2px)] py-[clamp(6px,0.684vw,10.9px)] font-kyg text-[clamp(11px,1.074vw,17.2px)] leading-none outline-none transition duration-300 focus-visible:ring-2 focus-visible:ring-java2 motion-reduce:transition-none',
                  n === t
                    ? 'bg-java2 font-bold text-abyss'
                    : 'bg-white/[0.07] font-medium text-white/[0.88] ring-1 ring-inset ring-white/[0.16] hover:bg-white/[0.12]'
                )}
              >
                {x.term}
              </button>
            ))}
          </div>

          <div aria-hidden="true" className="h-px w-full bg-white/[0.12]" />

          <span className="inline-flex items-center gap-[7px]">
            <Icon name="arrow" strokeWidth={2} className="h-[11px] w-[11px] shrink-0 text-java2" />
            <span className="font-tst text-[clamp(12.5px,1.221vw,19.5px)] font-semibold italic leading-none text-java2">
              {C.panel.read}
            </span>
          </span>

          <p
            aria-live="polite"
            className="font-kyg text-[clamp(19px,2.344vw,37.5px)] font-medium leading-[1.208] text-white"
          >
            {term.plain}
          </p>

          <div className="flex flex-col gap-[5px] rounded-sm bg-white/[0.07] px-[clamp(12px,1.367vw,21.9px)] py-[clamp(10px,1.172vw,18.8px)] ring-1 ring-inset ring-white/[0.12]">
            <span className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-kyg text-[clamp(12px,1.172vw,18.8px)] font-bold leading-none text-white">
                {term.example.title}
              </span>
              <span className="rounded-sm bg-java2/[0.18] px-[7px] py-[3px] font-kyg text-[clamp(8.2px,0.801vw,12.8px)] font-bold uppercase leading-none tracking-[0.08em] text-ice">
                {term.example.tag}
              </span>
            </span>
            <p className="font-kyg text-[clamp(10.8px,1.055vw,16.9px)] font-normal leading-[1.481] text-white/[0.78]">
              {term.example.body}
            </p>
          </div>
        </div>

        {/* ---- the copy ---- */}
        <div className="min-w-0">
          <Eyebrow icon="dna">{C.eyebrow}</Eyebrow>

          <Heading
            id="understandable-heading"
            className="mt-[clamp(12px,1.172vw,18.8px)] text-[clamp(24px,3.193vw,51.1px)] leading-[1.306]"
          >
            {C.headline} <em>{C.turn}</em>
          </Heading>

          <p className="mt-[clamp(10px,1.172vw,18.8px)] font-kyg text-[clamp(15px,1.465vw,23.4px)] font-normal leading-[1.4] text-heavy">
            {C.lead}
          </p>
          <p className="mt-[clamp(8px,0.977vw,15.6px)] font-kyg text-[clamp(11.7px,1.143vw,18.3px)] font-normal leading-[1.581] text-fusc">
            {C.body}
          </p>

          <ul className="mt-[clamp(12px,1.367vw,21.9px)] flex list-none flex-col items-start gap-[clamp(6px,0.684vw,10.9px)]">
            {C.pills.map((p) => (
              <li
                key={p}
                className="inline-flex items-center gap-[8px] rounded-sm bg-sand px-[clamp(10px,0.977vw,15.6px)] py-[clamp(7px,0.781vw,12.5px)]"
              >
                <Icon name="tick" strokeWidth={2.4} className="h-[12px] w-[12px] shrink-0 text-eden" />
                <span className="font-kyg text-[clamp(11px,1.074vw,17.2px)] font-medium leading-none text-heavy">
                  {p}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-[clamp(16px,1.758vw,28.1px)] flex flex-wrap items-center gap-[clamp(12px,1.367vw,21.9px)]">
            <Button href={C.cta.href}>{C.cta.label}</Button>
            <Hint>{C.hint}</Hint>
          </div>
        </div>
      </div>
    </Section>
  );
}
