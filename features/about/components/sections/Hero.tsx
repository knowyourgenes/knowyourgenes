import Image from 'next/image';

import { Container } from '@/components/shared/Container';
import { Button, Eyebrow, Heading, Icon } from '@/components/shared/kyg';
import { HERO } from '../../constants';

/**
 * 01 · Hero - Figma 343:3584.
 *
 * Masthead, a photograph faded into the page at both edges, and a shelf card
 * that hangs off the bottom of the band and overlaps it.
 *
 * THE FADES ARE THE DESIGN, not a crop. The band has no radius and no border;
 * its top 79.64 and bottom 125.16 are gradients from the cream page ground down
 * to nothing. Two layers rather than one background, because the ramps are not
 * symmetrical - 1 -> 0.5 -> 0 over the top, 1 -> 0.35 -> 0 over the bottom.
 *
 * The shelf overlaps by 73.24 of its own height, held as a negative margin so
 * the overlap survives the card growing taller on a narrow screen.
 */
export default function Hero() {
  return (
    <section className="bg-linenw">
      <Container className="pt-[clamp(28px,4.444vw,71.1px)]">
        <div className="flex flex-wrap items-center gap-[clamp(11.4px,1.111vw,17.8px)]">
          <Eyebrow icon="dna" data-rise-load="1">
            {HERO.eyebrow}
          </Eyebrow>
          {/* A fixed 142.22 mark, not a divider - it must not stretch. */}
          <span aria-hidden="true" className="hidden h-px w-[clamp(142.2px,13.889vw,222.2px)] bg-mine/10 sm:block" />
          <span
            data-rise-load="1"
            className="font-kyg text-[clamp(11px,0.903vw,14.4px)] font-bold uppercase leading-[1.5] tracking-[0.2em] text-boulder"
          >
            {HERO.aside}
          </span>
        </div>

        <Heading
          as="h1"
          data-rise-load="2"
          className="mt-[clamp(16.4px,1.597vw,25.5px)] text-[clamp(30px,min(4.722vw,9vh),75.6px)] leading-[1.309] tracking-[-0.03em]"
        >
          {HERO.headline} <em>{HERO.turn}</em>
        </Heading>
      </Container>

      {/* Full-bleed: it is a band of light, and railing it would put two hard
          vertical edges back on it. */}
      <div className="relative mt-[clamp(20px,3.056vw,49px)] h-[clamp(220px,41.25vw,660px)] w-full">
        <Image
          src="/about/img/hero-band.jpg"
          alt="Two members of the Know Your Genes team reviewing a report together"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[18.86%] bg-[linear-gradient(180deg,#FAF6EF_0%,rgba(250,246,239,0.5)_50%,rgba(250,246,239,0)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[29.63%] bg-[linear-gradient(0deg,#FAF6EF_0%,rgba(250,246,239,0.35)_50%,rgba(250,246,239,0)_100%)]"
        />

        {/* 80.2% across the band. Below `lg` there is no room for it beside the
            headline above, so it goes rather than overlapping. */}
        <div className="absolute left-[80.2%] top-[6.06%] hidden items-center gap-[clamp(8.5px,0.833vw,13.3px)] rounded-sm border border-white/60 bg-white/85 py-[clamp(5.7px,0.556vw,8.9px)] pl-[clamp(5.7px,0.556vw,8.9px)] pr-[clamp(11.4px,1.111vw,17.8px)] shadow-[0_12.8px_35.6px_0_rgba(20,27,26,0.08)] lg:flex">
          <span className="grid h-[clamp(31.3px,3.056vw,48.9px)] w-[clamp(31.3px,3.056vw,48.9px)] shrink-0 place-items-center rounded-sm border border-white bg-[linear-gradient(135deg,rgba(14,77,75,0.05)_0%,rgba(37,181,171,0.06)_71%)] text-eden">
            <Icon name="heart" className="h-[clamp(15.6px,1.527vw,24.4px)] w-[clamp(15.6px,1.527vw,24.4px)]" />
          </span>
          <span className="max-w-[16ch] font-kyg text-[clamp(11px,0.9375vw,15px)] font-bold leading-[1.252] text-fusc">
            {HERO.pill}
          </span>
        </div>
      </div>

      <Container className="-mt-[clamp(34px,7.152vw,114.4px)] pb-[clamp(28px,5.278vw,84.4px)]">
        <div
          data-rise="1"
          className="flex flex-col gap-[clamp(20px,3.333vw,53.3px)] rounded-sm border border-mine/10 bg-linenw/90 p-[clamp(20px,2.5vw,40px)] shadow-[0_28.4px_71.1px_0_rgba(20,27,26,0.14),0_8.5px_25.6px_0_rgba(20,27,26,0.1)] backdrop-blur-sm lg:flex-row lg:items-center"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-[clamp(7.1px,0.694vw,11.1px)]">
            <p className="font-kyg text-[clamp(14.2px,1.389vw,22.2px)] font-normal leading-[1.625] text-fusc">
              {HERO.shelf.lead}
            </p>
            <p className="max-w-[clamp(398.2px,38.889vw,622.2px)] font-kyg text-[clamp(11.4px,1.111vw,17.8px)] font-normal leading-[1.625] text-fusc">
              {HERO.shelf.note}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-[clamp(8.5px,0.833vw,13.3px)] sm:flex-row sm:items-center">
            <Button href={HERO.ctas.primary.href}>{HERO.ctas.primary.label}</Button>
            <Button href={HERO.ctas.secondary.href} variant="ghost">
              {HERO.ctas.secondary.label}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
