'use client';

import { useState } from 'react';

import { Button, Eyebrow, Heading, Icon, Section } from '@/components/shared/kyg';
import { cn } from '@/lib/utils';
import { NOT_DESTINY as C } from '../../constants';
import { Hr, Kicker } from '../ui';

/**
 * 04 · Genes ≠ Destiny - Figma 546:102, on ink.
 *
 * The equation is the section: four terms, an equals, and your health journey.
 * The frame says "Hover any part of the equation to see why it matters", and
 * the strip beneath it is where that answer lands - so hovering a term swaps
 * the strip's copy rather than opening a tooltip that a touch screen can never
 * summon.
 *
 * IT ALSO RESPONDS TO FOCUS AND TAP, because hover alone reaches neither a
 * keyboard nor a phone. Each term is a real button; the strip is aria-live so
 * the swap is announced rather than silently repainted.
 *
 * This section also absorbs what used to be its own band - the standalone
 * "Information ≠ Destiny" statement, which the previous frame had as section 05.
 */
export default function NotDestiny() {
  const [hot, setHot] = useState<number | null>(null);
  const shown = hot === null ? null : C.equation[hot];

  return (
    <Section id="not-destiny" ground="ink" labelledBy="not-destiny-heading">
      <div className="flex flex-col gap-[clamp(16px,2.148vw,34.4px)] lg:flex-row lg:justify-between">
        <div className="min-w-0">
          <Eyebrow icon="dna" tone="teal">
            {C.eyebrow}
          </Eyebrow>
          <Heading
            id="not-destiny-heading"
            tone="dark"
            className="mt-[clamp(11px,1.074vw,17.2px)] max-w-[clamp(560px,54.688vw,875px)] text-[clamp(24px,3.193vw,51.1px)] leading-[1.306] text-white"
          >
            {C.headline} <em>{C.turn}</em>
          </Heading>
        </div>

        <p className="flex shrink-0 items-start gap-[clamp(10px,1.172vw,18.8px)] lg:w-[clamp(300px,29.297vw,468.8px)] lg:pt-[clamp(20px,4.297vw,68.8px)]">
          <Icon name="dna" className="h-[16px] w-[16px] shrink-0 text-java2" />
          <span className="min-w-0 font-kyg text-[clamp(16px,1.953vw,31.3px)] font-medium leading-[1.3] text-white">
            {C.quote}
          </span>
        </p>
      </div>

      <Hr tone="dark" className="my-[clamp(18px,2.539vw,40.6px)]" />

      {/* ---- the equation ---- */}
      <div className="flex flex-wrap items-stretch gap-[clamp(8px,0.977vw,15.6px)]">
        {C.equation.map((part, n) => (
          <div key={part.term} className="contents">
            {n > 0 ? (
              <span
                aria-hidden="true"
                className="self-center font-kyg text-[clamp(18px,2.344vw,37.5px)] font-light leading-none text-java2"
              >
                +
              </span>
            ) : null}
            <button
              type="button"
              onMouseEnter={() => setHot(n)}
              onMouseLeave={() => setHot(null)}
              onFocus={() => setHot(n)}
              onBlur={() => setHot(null)}
              // SET, never toggle. A touch tap emits mouseenter -> focus ->
              // click; the first two already selected this term, so a toggle
              // would immediately clear it and the reveal would never appear
              // on any phone. mouseleave does not fire on touch either, so
              // the selection correctly persists until another term is tapped.
              onClick={() => setHot(n)}
              aria-describedby="equation-reveal"
              className={cn(
                'flex min-w-[clamp(96px,10.742vw,171.9px)] flex-1 flex-col gap-[4px] rounded-sm px-[clamp(12px,1.563vw,25px)] py-[clamp(12px,1.367vw,21.9px)] text-left outline-none ring-1 ring-inset transition duration-300 motion-reduce:transition-none',
                hot === n ? 'bg-white/[0.12] ring-java2/50' : 'bg-white/[0.05] ring-white/[0.12] hover:bg-white/[0.09]'
              )}
            >
              <Kicker tone="java">{part.n}</Kicker>
              <span className="font-kyg text-[clamp(14px,1.367vw,21.9px)] font-bold leading-[1.2] tracking-[-0.01em] text-white">
                {part.term}
              </span>
            </button>
          </div>
        ))}

        <span
          aria-hidden="true"
          className="self-center font-kyg text-[clamp(18px,2.344vw,37.5px)] font-light leading-none text-java2"
        >
          =
        </span>

        <div className="flex min-w-[clamp(140px,18.555vw,296.9px)] flex-1 flex-col gap-[4px] rounded-sm bg-eden px-[clamp(12px,1.563vw,25px)] py-[clamp(12px,1.367vw,21.9px)] ring-1 ring-inset ring-java2/35">
          <span className="font-tst text-[clamp(12.5px,1.221vw,19.5px)] font-semibold italic leading-[1.2] text-java2">
            {C.result.kicker}
          </span>
          <span className="font-kyg text-[clamp(14px,1.367vw,21.9px)] font-bold leading-[1.2] tracking-[-0.01em] text-white">
            {C.result.title}
          </span>
        </div>
      </div>

      <p
        id="equation-reveal"
        aria-live="polite"
        className="mt-[clamp(12px,1.367vw,21.9px)] flex items-center gap-[clamp(10px,1.172vw,18.8px)] rounded-sm bg-white/[0.04] px-[clamp(14px,1.563vw,25px)] py-[clamp(11px,1.172vw,18.8px)] ring-1 ring-inset ring-white/10"
      >
        <Icon name="dna" className="h-[14px] w-[14px] shrink-0 text-java2" />
        <span
          className={cn(
            'min-w-0 font-tst text-[clamp(15px,1.66vw,26.6px)] font-semibold italic leading-[1.3]',
            shown ? 'text-white' : 'text-white/60'
          )}
        >
          {shown ? `${shown.term} — ${shown.why}` : C.hint}
        </span>
      </p>

      {/* ---- what we intend ---- */}
      <div className="mt-[clamp(16px,1.758vw,28.1px)] flex flex-wrap items-center gap-[clamp(8px,0.781vw,12.5px)]">
        <Kicker tone="java" className="mr-[2px]">
          {C.intend.kicker}
        </Kicker>
        {C.intend.chips.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-[6px] rounded-sm bg-white/[0.06] px-[clamp(9px,0.977vw,15.6px)] py-[clamp(6px,0.586vw,9.4px)] ring-1 ring-inset ring-white/[0.14]"
          >
            <Icon name="tick" strokeWidth={2.4} className="h-[10px] w-[10px] shrink-0 text-java2" />
            <span className="font-kyg text-[clamp(11px,1.045vw,16.7px)] font-medium leading-none text-white/[0.86]">
              {chip}
            </span>
          </span>
        ))}
      </div>

      {/* ---- the statement band (its own section in the previous frame) ---- */}
      <div
        className="mt-[clamp(20px,2.93vw,46.9px)] flex min-h-[clamp(200px,25.391vw,406.3px)] flex-col justify-center gap-[clamp(10px,1.172vw,18.8px)] overflow-hidden rounded-sm bg-cover bg-center px-[clamp(20px,3.125vw,50px)] py-[clamp(22px,2.734vw,43.8px)]"
        style={{
          /* NO GREEN WASH. This was two abyss stops at 0.86 and 0.92, which is
             not a scrim - at that strength it is a fill, and the photograph
             underneath may as well not have been there. The frame lays the
             picture in plain. What is left is a neutral bottom-weighted
             gradient, and it exists only so the white copy keeps its contrast
             over the lighter parts of the image - not to tint it. */
          backgroundImage:
            'linear-gradient(180deg,rgba(11,15,14,0.15) 0%,rgba(11,15,14,0.55) 100%),url(/about/img/key-statement.jpg)',
        }}
      >
        <p className="flex flex-wrap items-baseline gap-x-[clamp(8px,1.172vw,18.8px)] gap-y-1">
          <span className="font-kyg text-[clamp(24px,2.93vw,46.9px)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
            {C.band.left}
          </span>
          <span className="font-kyg text-[clamp(28px,3.906vw,62.5px)] font-normal leading-[1] text-java2">≠</span>
          <span className="font-kyg text-[clamp(26px,3.516vw,56.3px)] font-medium leading-[1.1] text-java2">
            {C.band.right}
          </span>
        </p>
        <p className="max-w-[clamp(560px,54.688vw,875px)] font-kyg text-[clamp(13.5px,1.318vw,21.1px)] font-medium leading-[1.481] text-white">
          {C.band.lead}
        </p>
        <p className="max-w-[clamp(560px,54.688vw,875px)] font-kyg text-[clamp(11.7px,1.143vw,18.3px)] font-normal leading-[1.538] text-white/[0.72]">
          {C.band.body}
        </p>
        <div className="mt-[clamp(4px,0.391vw,6.3px)] flex">
          <Button href={C.band.cta.href} variant="onDark">
            {C.band.cta.label}
          </Button>
        </div>
      </div>
    </Section>
  );
}
