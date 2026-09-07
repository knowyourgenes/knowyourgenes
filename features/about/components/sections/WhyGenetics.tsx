'use client';

import { useState } from 'react';

import { Button, Eyebrow, Heading, Icon, Section } from '@/components/shared/kyg';
import { cn } from '@/lib/utils';
import { WHY_GENETICS as C } from '../../constants';
import { Chain, Hr } from '../ui';

/**
 * 03 · Why genetics - Figma 544:556.
 *
 * The argument on the left, and the ladder on the right as an accordion: five
 * rows, one open, each a step further from "Genes" toward "Better decisions".
 *
 * ONE OPEN AT A TIME, and one is always open. An accordion that can close
 * everything leaves the right-hand column as five bare titles and a lot of
 * empty rail, which reads as broken rather than tidy - so clicking the open row
 * does nothing.
 *
 * The panel animates with `grid-template-rows: 0fr -> 1fr`, the only way to
 * transition to an unmeasured height. Every row is a real <button> inside its
 * heading, so the whole thing is reachable and announceable by keyboard.
 */
export default function WhyGenetics() {
  const [open, setOpen] = useState(0);

  return (
    <Section id="why-genetics" ground="sand" labelledBy="why-genetics-heading">
      <div className="grid gap-[clamp(24px,3.906vw,62.5px)] lg:grid-cols-[minmax(0,330fr)_minmax(0,597fr)]">
        {/* ---- the argument ---- */}
        <div className="min-w-0">
          <Eyebrow icon="dna">{C.eyebrow}</Eyebrow>

          <Heading
            id="why-genetics-heading"
            className="mt-[clamp(14px,1.367vw,21.9px)] text-[clamp(24px,3.193vw,51.1px)] leading-[1.162]"
          >
            {C.headline}
          </Heading>

          <p className="mt-[clamp(14px,1.367vw,21.9px)] font-kyg text-[clamp(12.5px,1.221vw,19.5px)] font-normal leading-[1.56] text-fusc">
            {C.body}
          </p>

          <Button href={C.cta.href} className="mt-[clamp(16px,1.758vw,28.1px)]">
            {C.cta.label}
          </Button>

          <ul className="mt-[clamp(18px,2.344vw,37.5px)] flex list-none flex-col gap-[clamp(8px,0.781vw,12.5px)]">
            {C.trio.map((t) => (
              <li key={t.text} className="flex items-center gap-[clamp(10px,0.977vw,15.6px)]">
                <span
                  className={cn(
                    'grid h-[clamp(20px,1.953vw,31.3px)] w-[clamp(20px,1.953vw,31.3px)] shrink-0 place-items-center rounded-sm',
                    t.lifted ? 'bg-eden text-white' : 'bg-zeus/[0.06] text-fusc'
                  )}
                >
                  <Icon
                    name={t.lifted ? 'tick' : 'cross'}
                    strokeWidth={2.4}
                    className="h-[clamp(10px,0.977vw,15.6px)] w-[clamp(10px,0.977vw,15.6px)]"
                  />
                </span>
                <span
                  className={cn(
                    'min-w-0 font-kyg text-[clamp(11.2px,1.094vw,17.5px)] leading-[1.429]',
                    t.lifted ? 'font-semibold text-eden' : 'font-normal text-fusc'
                  )}
                >
                  {t.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ---- the ladder ---- */}
        <div className="min-w-0">
          <Hr />
          {C.rows.map((row, i) => {
            const isOpen = i === open;
            return (
              <div key={row.n}>
                <div
                  className={cn(
                    'flex gap-[clamp(14px,2.148vw,34.4px)] rounded-sm px-[clamp(6px,0.781vw,12.5px)] py-[clamp(14px,1.758vw,28.1px)] transition-colors duration-300 motion-reduce:transition-none',
                    isOpen && 'bg-white/55'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'shrink-0 select-none font-kyg text-[clamp(22px,2.93vw,46.9px)] font-light leading-[1.067]',
                      isOpen ? 'text-eden' : 'text-nevada/55'
                    )}
                  >
                    {row.n}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(i)}
                        aria-expanded={isOpen}
                        aria-controls={`ladder-panel-${i}`}
                        className="flex min-h-[44px] w-full items-center gap-[clamp(10px,0.977vw,15.6px)] text-left outline-none focus-visible:underline focus-visible:decoration-eden focus-visible:underline-offset-4"
                      >
                        <span
                          className={cn(
                            'grid h-[clamp(22px,2.539vw,40.6px)] w-[clamp(22px,2.539vw,40.6px)] shrink-0 place-items-center rounded-sm transition-colors duration-300 motion-reduce:transition-none',
                            isOpen ? 'bg-eden text-white' : 'bg-eden/[0.07] text-eden'
                          )}
                        >
                          <Icon name="dna" className="h-[clamp(12px,1.172vw,18.8px)] w-[clamp(12px,1.172vw,18.8px)]" />
                        </span>
                        <span
                          className={cn(
                            'min-w-0 flex-1 font-kyg text-[clamp(15px,1.465vw,23.4px)] font-bold leading-[1.3] tracking-[-0.01em]',
                            isOpen ? 'text-heavy' : 'text-fusc'
                          )}
                        >
                          {row.title}
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
                      id={`ladder-panel-${i}`}
                      className={cn(
                        'grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="pt-[clamp(8px,0.781vw,12.5px)] font-kyg text-[clamp(11.7px,1.143vw,18.3px)] font-normal leading-[1.581] text-fusc">
                          {row.body}
                        </p>
                        {/* The whole chain is only drawn once, under the open
                            row - repeating it five times would make the ladder
                            look like five copies of one thing. */}
                        {i === 0 ? <Chain items={C.chain} className="pt-[clamp(10px,0.977vw,15.6px)]" /> : null}
                      </div>
                    </div>
                  </div>
                </div>
                <Hr />
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
