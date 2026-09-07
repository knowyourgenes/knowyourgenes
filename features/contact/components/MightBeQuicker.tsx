import Link from 'next/link';
import { Fragment } from 'react';

import { Icon, Note, Section, SectionTitle } from '@/components/shared/kyg';
import { QUICKER, SHORTCUTS } from '../constants';

/** The design's own hairline here: a 2-stop fade, not the page's tapered rule. */
const RULE = 'linear-gradient(90deg,rgba(250,246,239,0.18) 0%,rgba(250,246,239,0.04) 100%)';

/**
 * 05 · Might be quicker - Figma 346:1266.
 *
 * Four routes in two columns, each row held between hairlines - rule, row,
 * rule, row, rule, so a column of two carries three rules and the set reads as
 * a ladder rather than as four loose cards.
 *
 * The rows are real links. The design draws a bordered square on the right of
 * each; it is an affordance, not a second target, so it sits INSIDE the link
 * rather than beside it - two tap targets for one destination is how a list
 * like this ends up with a dead zone between them.
 */
export default function MightBeQuicker() {
  const columns = [SHORTCUTS.slice(0, 2), SHORTCUTS.slice(2)];

  return (
    <Section id="might-be-quicker" ground="ink" labelledBy="quicker-heading">
      <SectionTitle
        id="quicker-heading"
        eyebrow={QUICKER.eyebrow}
        tone="dark"
        aside={<Note lead={QUICKER.aside.lead} turn={QUICKER.aside.turn} tone="dark" />}
      >
        {QUICKER.headline} <em>{QUICKER.turn}</em>
      </SectionTitle>

      <div className="mt-[clamp(28.4px,2.778vw,44.4px)] grid gap-x-[clamp(24px,3.889vw,62px)] lg:grid-cols-2">
        {columns.map((column, ci) => (
          <ul key={ci} className="grid list-none grid-cols-1">
            <li aria-hidden="true" className="h-px" style={{ backgroundImage: RULE }} />
            {column.map((s) => (
              <Fragment key={s.title}>
                <li>
                  <Link
                    href={s.href}
                    className="group/row flex items-center gap-[clamp(12.8px,1.25vw,20px)] py-[clamp(15.6px,1.527vw,24.4px)]"
                  >
                    <span className="grid h-[clamp(32.7px,3.194vw,51.1px)] w-[clamp(32.7px,3.194vw,51.1px)] shrink-0 place-items-center rounded-sm bg-java2/[0.13] text-ice transition-colors duration-300 group-hover/row:bg-java2/25 motion-reduce:transition-none">
                      <Icon
                        name={s.icon}
                        className="h-[clamp(15.6px,1.527vw,24.4px)] w-[clamp(15.6px,1.527vw,24.4px)]"
                      />
                    </span>

                    <span className="flex min-w-0 flex-1 flex-col gap-[clamp(2.8px,0.278vw,4.4px)]">
                      <span className="font-kyg text-[clamp(13.5px,1.319vw,21.1px)] font-bold leading-[1.368] tracking-[-0.018em] text-linenw">
                        {s.title}
                      </span>
                      <span className="font-kyg text-[clamp(11px,1.076vw,17.2px)] font-normal leading-[1.613] text-linenw/[0.62]">
                        {s.body}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className="grid h-[clamp(27px,2.639vw,42.2px)] w-[clamp(27px,2.639vw,42.2px)] shrink-0 place-items-center rounded-sm text-linenw ring-1 ring-inset ring-linenw/[0.18] transition duration-300 group-hover/row:ring-linenw/45 motion-reduce:transition-none"
                    >
                      <Icon
                        name="arrow"
                        strokeWidth={2}
                        className="h-[clamp(11.4px,1.111vw,17.8px)] w-[clamp(11.4px,1.111vw,17.8px)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/row:translate-x-[3px] motion-reduce:transition-none"
                      />
                    </span>
                  </Link>
                </li>
                <li aria-hidden="true" className="h-px" style={{ backgroundImage: RULE }} />
              </Fragment>
            ))}
          </ul>
        ))}
      </div>
    </Section>
  );
}
