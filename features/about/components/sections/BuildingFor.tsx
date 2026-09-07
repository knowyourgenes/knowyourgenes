'use client';

import { useState } from 'react';

import { Button, Eyebrow, Heading, Icon, Section } from '@/components/shared/kyg';
import { cn } from '@/lib/utils';
import { BUILDING_FOR as C, PERSONA_ICONS } from '../../constants';
import { Hr } from '../ui';

/**
 * 09 · Who we're building for - Figma 555:538, on ink.
 *
 * Four personas as a picker with a detail card. The options are a real
 * radiogroup rather than four styled divs, so arrow keys and a screen reader
 * both behave the way the visual implies.
 *
 * Below `lg` the options become a horizontal wrap above the card - four full
 * rows plus a 210-tall image is most of a phone screen otherwise.
 */
export default function BuildingFor() {
  const [p, setP] = useState(0);
  const persona = C.personas[p];

  return (
    <Section id="building-for" ground="ink" labelledBy="building-for-heading">
      <div className="flex flex-col gap-[clamp(16px,2.148vw,34.4px)] lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <Eyebrow icon="dna" tone="teal">
            {C.eyebrow}
          </Eyebrow>
          <Heading
            id="building-for-heading"
            tone="dark"
            className="mt-[clamp(11px,1.074vw,17.2px)] max-w-[clamp(560px,54.688vw,875px)] text-[clamp(24px,3.193vw,51.1px)] leading-[1.306] text-white"
          >
            {C.headline} <em>{C.turn}</em>
          </Heading>
        </div>
        <p className="shrink-0 font-kyg text-[clamp(11.7px,1.143vw,18.3px)] font-normal leading-[1.538] text-white/70 lg:w-[clamp(300px,29.297vw,468.8px)]">
          {C.lead}
        </p>
      </div>

      <div className="mt-[clamp(22px,3.027vw,48.4px)] grid gap-[clamp(14px,2.217vw,35.5px)] lg:grid-cols-[minmax(0,287fr)_minmax(0,658fr)]">
        {/* ---- the options ---- */}
        <div
          role="radiogroup"
          aria-label="Which sounds most like you?"
          className="flex min-w-0 flex-wrap gap-[clamp(6px,0.557vw,8.9px)] lg:flex-col"
        >
          {C.personas.map((x, n) => {
            const active = n === p;
            return (
              <button
                key={x.title}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setP(n)}
                className={cn(
                  'flex min-w-[150px] flex-1 items-center gap-[clamp(8px,0.977vw,15.6px)] rounded-sm py-[clamp(10px,1.172vw,18.8px)] pl-[clamp(9px,0.977vw,15.6px)] pr-[clamp(10px,1.25vw,20px)] text-left outline-none transition duration-300 focus-visible:ring-2 focus-visible:ring-java2 motion-reduce:transition-none lg:flex-none',
                  active ? 'bg-java2' : 'bg-white/[0.05] ring-1 ring-inset ring-white/[0.12] hover:bg-white/[0.09]'
                )}
              >
                <span
                  className={cn(
                    'grid h-[clamp(24px,2.637vw,42.2px)] w-[clamp(24px,2.637vw,42.2px)] shrink-0 place-items-center rounded-sm',
                    active ? 'bg-abyss/[0.18] text-abyss' : 'bg-white/[0.06] text-white'
                  )}
                >
                  <Icon name={PERSONA_ICONS[n]} className="h-[13px] w-[13px]" />
                </span>
                <span
                  className={cn(
                    'min-w-0 flex-1 font-kyg text-[clamp(11.7px,1.143vw,18.3px)] leading-[1.25] tracking-[-0.006em]',
                    active ? 'font-bold text-abyss' : 'font-medium text-white/90'
                  )}
                >
                  {x.title}
                </span>
                <Icon
                  name="arrow"
                  strokeWidth={2}
                  className={cn('h-[12px] w-[12px] shrink-0', active ? 'text-abyss' : 'text-white/50')}
                />
              </button>
            );
          })}
        </div>

        {/* ---- the detail ---- */}
        <div className="flex min-w-0 flex-col overflow-hidden rounded-sm bg-white/[0.04] ring-1 ring-inset ring-white/10">
          <div
            className="h-[clamp(140px,20.508vw,328.1px)] shrink-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'linear-gradient(180deg,rgba(20,27,26,0.1) 0%,rgba(20,27,26,0.55) 100%),url(/about/img/persona-detail.jpg)',
            }}
          />
          <div
            aria-live="polite"
            className="flex flex-col gap-[clamp(8px,0.977vw,15.6px)] px-[clamp(16px,2.227vw,35.6px)] pb-[clamp(16px,2.08vw,33.3px)] pt-[clamp(15px,1.943vw,31.1px)]"
          >
            <span className="inline-flex items-center gap-[7px]">
              <span className="grid h-[clamp(18px,2.051vw,32.8px)] w-[clamp(18px,2.051vw,32.8px)] shrink-0 place-items-center rounded-sm bg-java2/[0.16] text-java2">
                <Icon name={PERSONA_ICONS[p]} className="h-[11px] w-[11px]" />
              </span>
              <span className="font-tst text-[clamp(12.5px,1.221vw,19.5px)] font-semibold italic leading-none text-java2">
                {persona.title}
              </span>
            </span>

            <p className="font-kyg text-[clamp(18px,2.227vw,35.6px)] font-bold leading-[1.228] tracking-[-0.02em] text-white">
              {persona.question}
            </p>
            <p className="font-kyg text-[clamp(11.7px,1.143vw,18.3px)] font-normal leading-[1.598] text-white/70">
              {persona.body}
            </p>

            <ul className="flex list-none flex-wrap gap-[clamp(5.7px,0.557vw,8.9px)]">
              {persona.markers.map((m) => (
                <li
                  key={m}
                  className="rounded-sm bg-white/[0.06] px-[clamp(8.5px,0.83vw,13.3px)] py-[clamp(5px,0.488vw,7.8px)] ring-1 ring-inset ring-white/[0.14]"
                >
                  <span className="font-kyg text-[clamp(9.6px,0.9375vw,15px)] font-medium leading-none text-white/85">
                    {m}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-[clamp(4px,0.391vw,6.3px)] flex">
              <Button href={C.cta.href} variant="onDark">
                {C.cta.label}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Hr tone="dark" className="mt-[clamp(18px,2.539vw,40.6px)]" />

      <div className="mt-[clamp(14px,1.758vw,28.1px)] flex flex-col gap-[clamp(12px,1.367vw,21.9px)] sm:flex-row sm:items-center sm:justify-between">
        <p className="font-tst text-[clamp(17px,1.855vw,29.7px)] font-medium italic leading-[1.3] text-white/90">
          {C.foot}
        </p>
        <Button href={C.cta.href} variant="onDark" className="shrink-0">
          {C.cta.label}
        </Button>
      </div>
    </Section>
  );
}
