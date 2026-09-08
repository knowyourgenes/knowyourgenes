import { Button, Icon, Note, Section, SectionTitle } from '@/components/shared/kyg';
import { REACH, ROUTES } from '../constants';

/**
 * 04 · How to reach us - Figma 346:1201.
 *
 * A 236.8-tall row: one filled panel carrying the phone number, and two stacked
 * cards beside it. The panel and the stack each take half, and the stack's two
 * cards share its height, which is what lines their bottom edges up with the
 * panel's.
 *
 * The head row is the shared `SectionTitle` with its aside - the same rule +
 * two-voice note that `WhyGeneticTesting` uses on the homepage, because it is
 * literally the same component in the design system, drawn again here.
 */
export default function HowToReachUs() {
  return (
    <Section id="how-to-reach-us" ground="sand" labelledBy="reach-heading">
      <SectionTitle
        id="reach-heading"
        eyebrow={REACH.eyebrow}
        aside={<Note lead={REACH.aside.lead} turn={REACH.aside.turn} />}
      >
        {REACH.headline} <em>{REACH.turn}</em>
      </SectionTitle>

      <div className="mt-[clamp(28.4px,2.778vw,44.4px)] grid gap-[clamp(14.2px,1.389vw,22.2px)] lg:grid-cols-2">
        {/* The panel. eden with a teal glow rising from its bottom edge, and
            the motif bled off the right - both are the design's, and both are
            decoration the copy never has to survive without. */}
        <div className="relative isolate overflow-hidden rounded-sm bg-eden p-[clamp(20px,2.778vw,44.4px)]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_100%,rgba(42,195,162,0.34)_0%,rgba(42,195,162,0)_100%)]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/contact/whatsapp-motif.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -z-10 hidden opacity-[0.07] sm:block"
            style={{ left: '70.1%', top: '30%', width: '44.8%' }}
          />

          <p className="font-kyg text-[clamp(11px,0.799vw,12.8px)] font-bold uppercase leading-[1.478] tracking-[0.16em] text-linenw/60">
            {REACH.whatsapp.kicker}
          </p>
          <p className="mt-[clamp(7.1px,0.694vw,11.1px)] font-kyg text-[clamp(24px,3.056vw,48.9px)] font-bold leading-[1.227] tracking-[-0.025em] text-linenw tabular-nums">
            {REACH.whatsapp.number}
          </p>
          <p className="mt-[clamp(9.9px,0.972vw,15.6px)] max-w-[clamp(305.8px,29.861vw,477.8px)] font-kyg text-[clamp(12.1px,1.181vw,18.9px)] font-normal leading-[1.647] text-linenw/[0.74]">
            {REACH.whatsapp.body}
          </p>

          <div className="mt-[clamp(21.3px,2.083vw,33.3px)] flex flex-wrap items-center gap-[clamp(11.4px,1.111vw,17.8px)]">
            <Button href="https://wa.me/910000000000" variant="onDark">
              {REACH.whatsapp.cta}
            </Button>
            <span className="font-kyg text-[clamp(12px,1.007vw,16.1px)] font-medium leading-[1.517] text-linenw/55">
              {REACH.whatsapp.note}
            </span>
          </div>
        </div>

        {/* The two cards share the panel's height on lg, so all three bottom
            edges land on one line. */}
        <div className="grid gap-[clamp(14.2px,1.389vw,22.2px)]">
          {ROUTES.map((r) => (
            <div
              key={r.title}
              className="flex flex-1 flex-wrap items-center gap-[clamp(12.8px,1.25vw,20px)] rounded-sm border border-zeus/10 bg-linenw p-[clamp(14px,1.667vw,26.7px)] shadow-[0_2.8px_9.9px_0_rgba(45,32,18,0.05)]"
            >
              <span className="grid h-[clamp(32.7px,3.194vw,51.1px)] w-[clamp(32.7px,3.194vw,51.1px)] shrink-0 place-items-center rounded-sm bg-eden/[0.08] text-eden">
                <Icon name={r.icon} className="h-[clamp(15.6px,1.527vw,24.4px)] w-[clamp(15.6px,1.527vw,24.4px)]" />
              </span>

              <div className="flex min-w-[12rem] flex-1 flex-col gap-[clamp(2.8px,0.278vw,4.4px)]">
                <p className="font-kyg text-[clamp(11px,0.764vw,12.2px)] font-bold uppercase leading-[1.455] tracking-[0.16em] text-boulder">
                  {r.kicker}
                </p>
                <p className="font-kyg text-[clamp(14.2px,1.389vw,22.2px)] font-bold leading-[1.35] tracking-[-0.02em] text-black">
                  {r.title}
                </p>
                <p className="font-kyg text-[clamp(12px,1.042vw,16.7px)] font-normal leading-[1.6] text-fusc">
                  {r.body}
                </p>
              </div>

              <Button href={r.href} variant="ghost" arrow={false} className="shrink-0">
                {r.cta}
                <Icon name={r.ctaIcon} className="h-[clamp(10px,0.972vw,15.6px)] w-[clamp(10px,0.972vw,15.6px)]" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
