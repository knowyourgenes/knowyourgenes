import { Eyebrow, Heading, Section } from '@/components/shared/kyg';
import { MANIFESTO as C } from '../../constants';
import { Hint } from '../ui';

/**
 * 10 · What we believe - Figma 558:447.
 *
 * Four belief cards in a 2x2, each with an oversized Cormorant numeral behind
 * it and a `why` that the frame reveals on hover.
 *
 * THE REVEAL IS NOT HOVER-ONLY. Tailwind gates `hover:` behind
 * `@media (hover:hover)`, so on a touch screen a hover-only reveal is content
 * that simply never appears. The `why` is therefore open by default wherever
 * hovering is impossible, and collapses to the frame's behaviour only on a real
 * pointer. It also opens on keyboard focus, so tabbing through reveals it.
 *
 * The height animates via `grid-template-rows: 0fr -> 1fr`, which is the only
 * way to transition to an unknown content height without measuring it.
 */
export default function Manifesto() {
  return (
    <Section id="what-we-believe" labelledBy="believe-heading">
      <div className="flex flex-col gap-[clamp(16px,2.148vw,34.4px)] lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <Eyebrow icon="dna">{C.eyebrow}</Eyebrow>
          <Heading
            id="believe-heading"
            className="mt-[clamp(12px,1.172vw,18.8px)] max-w-[clamp(560px,54.688vw,875px)] text-[clamp(24px,3.193vw,51.1px)] leading-[1.162]"
          >
            {C.headline}
          </Heading>
          <p className="mt-[clamp(10px,0.977vw,15.6px)] max-w-[clamp(560px,54.688vw,875px)] font-kyg text-[clamp(15px,1.465vw,23.4px)] font-normal leading-[1.4] text-heavy">
            {C.body}
          </p>
        </div>

        <Hint>{C.hint}</Hint>
      </div>

      <ul className="mt-[clamp(20px,2.93vw,46.9px)] grid list-none gap-[clamp(12px,1.172vw,18.8px)] sm:grid-cols-2">
        {C.beliefs.map((b) => (
          <li
            key={b.n}
            tabIndex={0}
            className="group/belief relative isolate flex min-h-[clamp(150px,14.648vw,234.4px)] flex-col justify-end overflow-hidden rounded-sm bg-white p-[clamp(18px,2.148vw,34.4px)] ring-1 ring-inset ring-zeus/[0.12] outline-none transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-eden/50 hover:shadow-[0_14px_34px_0_rgba(20,27,26,0.1)] motion-reduce:transition-none"
          >
            {/* The frame's ghost numeral - decoration, so it is hidden from the
                accessibility tree and never read out as "zero one". */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-[clamp(10px,1.172vw,18.8px)] top-[clamp(-14px,-1.367vw,-8px)] -z-10 select-none font-tst text-[clamp(64px,8.594vw,137.5px)] italic leading-none text-eden/[0.08]"
            >
              {b.n}
            </span>

            <p className="font-kyg text-[clamp(16px,1.563vw,25px)] font-bold leading-[1.313] tracking-[-0.01em] text-heavy">
              {b.title}
            </p>

            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-visible/belief:grid-rows-[1fr] group-hover/belief:grid-rows-[1fr] motion-reduce:transition-none [@media(hover:none)]:grid-rows-[1fr]">
              <p className="overflow-hidden font-kyg text-[clamp(11.7px,1.143vw,18.3px)] font-normal leading-[1.5] text-fusc">
                <span className="block pt-[clamp(8px,0.781vw,12.5px)]">{b.why}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
