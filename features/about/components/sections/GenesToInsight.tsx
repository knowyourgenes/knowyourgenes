'use client';

import { useState } from 'react';

import { Button, Eyebrow, Heading, Icon, Section } from '@/components/shared/kyg';
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
  const [s, setS] = useState(0);
  const step = C.steps[s];
  const next = C.steps[s + 1];

  return (
    <Section id="genes-to-insight" ground="sand" labelledBy="genes-to-insight-heading">
      <div className="flex flex-col gap-[clamp(16px,2.148vw,34.4px)] lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <Eyebrow icon="dna">{C.eyebrow}</Eyebrow>
          <Heading
            id="genes-to-insight-heading"
            className="mt-[clamp(11px,1.074vw,17.2px)] max-w-[clamp(600px,58.594vw,937.5px)] text-[clamp(24px,3.193vw,51.1px)] leading-[1.306]"
          >
            {C.headline} <em>{C.turn}</em>
          </Heading>
          <p className="mt-[clamp(10px,0.977vw,15.6px)] max-w-[clamp(600px,58.594vw,937.5px)] font-kyg text-[clamp(15px,1.465vw,23.4px)] font-normal leading-[1.4] text-heavy">
            {C.lead}
          </p>
        </div>
        <Button href={C.cta.href} className="shrink-0">
          {C.cta.label}
        </Button>
      </div>

      {/* ---- the stepper ---- */}
      <ol className="mt-[clamp(22px,3.027vw,48.4px)] flex list-none flex-col gap-[clamp(10px,1.172vw,18.8px)] sm:flex-row sm:gap-0">
        {C.steps.map((x, n) => {
          const active = n === s;
          return (
            <li key={x.n} className="flex min-w-0 flex-1 flex-col gap-[clamp(8px,0.977vw,15.6px)]">
              <button
                type="button"
                onClick={() => setS(n)}
                aria-current={active ? 'step' : undefined}
                className="group/step flex w-full items-center gap-[clamp(10px,1.172vw,18.8px)] pr-[clamp(0px,1.172vw,18.8px)] text-left outline-none"
              >
                <span
                  className={cn(
                    'grid h-[clamp(28px,3.223vw,51.6px)] w-[clamp(28px,3.223vw,51.6px)] shrink-0 place-items-center rounded-sm font-kyg text-[clamp(11.7px,1.143vw,18.3px)] font-bold transition-colors duration-300 group-focus-visible/step:ring-2 group-focus-visible/step:ring-eden motion-reduce:transition-none',
                    active ? 'bg-eden text-white' : 'bg-white text-heavy ring-1 ring-inset ring-zeus/[0.14]'
                  )}
                >
                  {x.n}
                </span>
                {/* the connector - never after the last tile */}
                {n < C.steps.length - 1 ? (
                  <span aria-hidden="true" className="hidden h-px flex-1 bg-zeus/[0.13] sm:block" />
                ) : null}
                <span
                  className={cn(
                    'font-kyg text-[clamp(11.7px,1.143vw,18.3px)] font-bold leading-[1.2] sm:hidden',
                    active ? 'text-heavy' : 'text-fusc'
                  )}
                >
                  {x.title}
                </span>
              </button>
              <span
                className={cn(
                  'hidden font-kyg text-[clamp(11.7px,1.143vw,18.3px)] font-bold leading-[1.2] sm:block',
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
      <div className="mt-[clamp(16px,2.246vw,35.9px)] grid overflow-hidden rounded-sm bg-white ring-1 ring-inset ring-zeus/10 lg:grid-cols-[minmax(0,512fr)_minmax(0,455fr)]">
        <div
          className="relative isolate min-h-[clamp(150px,20.801vw,332.8px)] bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(180deg,rgba(20,27,26,0.12) 0%,rgba(20,27,26,0.5) 100%),url(/about/img/step-visual.jpg)',
          }}
        >
          <span
            aria-hidden="true"
            className="absolute bottom-[clamp(10px,1.172vw,18.8px)] left-[clamp(14px,1.563vw,25px)] select-none font-tst text-[clamp(44px,5.859vw,93.8px)] italic leading-none text-white/35"
          >
            {step.n}
          </span>
        </div>

        <div
          aria-live="polite"
          className="flex min-w-0 flex-col justify-center gap-[clamp(8px,0.977vw,15.6px)] px-[clamp(18px,3.057vw,48.9px)] py-[clamp(18px,2.344vw,37.5px)]"
        >
          <span className="inline-flex w-fit items-center rounded-sm bg-eden/[0.07] px-[clamp(8px,0.879vw,14.1px)] py-[clamp(4px,0.488vw,7.8px)]">
            <Kicker>
              Step {step.n} of 0{C.steps.length}
            </Kicker>
          </span>
          <p className="font-kyg text-[clamp(18px,2.227vw,35.6px)] font-bold leading-[1.228] tracking-[-0.02em] text-heavy">
            {step.title}
          </p>
          <p className="font-kyg text-[clamp(11.7px,1.143vw,18.3px)] font-normal leading-[1.598] text-fusc">
            {step.body}
          </p>
          {next ? (
            <button
              type="button"
              onClick={() => setS(s + 1)}
              className="inline-flex w-fit items-center gap-[6px] font-kyg text-[clamp(10.7px,1.045vw,16.7px)] font-bold text-eden outline-none hover:underline focus-visible:underline"
            >
              Next · {next.title}
              <Icon name="arrow" strokeWidth={2} className="h-[11px] w-[11px]" />
            </button>
          ) : null}
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
            <span className="font-kyg text-[clamp(10.7px,1.045vw,16.7px)] font-medium leading-[1.3] text-heavy">
              {C.lab.note}
            </span>
          </span>
        </span>

        <Chain items={C.lab.chain} />
      </div>
    </Section>
  );
}
