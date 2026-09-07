import Image from 'next/image';

import { Container } from '@/components/shared/Container';
import { Button, Eyebrow, Heading, Icon } from '@/components/shared/kyg';
import { HERO } from '../constants';

/**
 * /contact hero - Figma 346:1114.
 *
 * Three stacked pieces and one that straddles two of them:
 *
 *   Masthead   the eyebrow row and the h1
 *   Hero band  a 298.67-tall photograph, faded to the page ground at BOTH
 *              edges so it reads as a band of light rather than a picture in a
 *              box - there is no card, no border, no corner
 *   Shelf      a card that hangs off the bottom of the band and overlaps it
 *
 * THE FADES ARE THE DESIGN. The band has no crop and no radius; the top 79.64
 * and bottom 125.16 are gradients from the cream page ground down to nothing,
 * which is what dissolves its edges into the page. Reproduced as two absolutely
 * positioned layers rather than one background so each keeps its own height and
 * its own ramp - the design's ramps are not symmetrical (1 -> 0.5 -> 0 over the
 * top, 1 -> 0.35 -> 0 over the bottom).
 *
 * The shelf overlaps by 50.49 of its own height, which the frame spends as a
 * spacer AFTER the band. Reproduced as a negative top margin on the shelf plus
 * the same value as bottom padding on the section, so the overlap survives the
 * card growing taller on a narrow screen - a fixed spacer would not.
 */
export default function ContactHero() {
  return (
    <section className="bg-linenw">
      <Container className="pt-[clamp(28px,3.5vw,56px)]">
        {/* 11.378 between the pill and the hairline, and the hairline is a
            fixed 142.22 rule rather than a flexible one: it is a mark, not a
            divider, so it must not stretch with the row. */}
        <div className="flex flex-wrap items-center gap-[clamp(11.4px,1.111vw,17.8px)]">
          <Eyebrow>{HERO.eyebrow}</Eyebrow>
          <span aria-hidden="true" className="hidden h-px w-[clamp(142.2px,13.889vw,222.2px)] bg-mine/10 sm:block" />
          <span className="font-kyg text-[clamp(9.2px,0.903vw,14.4px)] font-bold uppercase leading-[1.5] tracking-[0.2em] text-boulder">
            {HERO.aside}
          </span>
        </div>

        {/* 48.356 at 1024 is 4.722vw. The h1 clamp in `Heading` is the
            homepage hero's 4.3vw, so this one carries its own - it is a
            different headline at a different size on a different page. */}
        {/* EXTRABOLD, not the Heading default. This frame sets its h1 at 800
            (48.356/51.2, -0.022em); /about sets its own at 700. The two hero
            headlines are deliberately different weights, so this one says so
            rather than quietly inheriting. */}
        <Heading
          as="h1"
          className="mt-[clamp(16.4px,1.597vw,25.5px)] text-[clamp(30px,min(4.722vw,9vh),75.6px)] font-extrabold leading-[1.059] tracking-[-0.022em]"
        >
          {HERO.headline} <em>{HERO.turn}</em>
        </Heading>
      </Container>

      {/* The band bleeds the full viewport width - it is a band of light, and
          railing it would put two hard vertical edges back on it. */}
      <div className="relative mt-[clamp(20px,3.056vw,49px)] h-[clamp(200px,29.17vw,467px)] w-full">
        <Image
          src="/contact/hero-band.png"
          alt="A member of the Know Your Genes team at a desk, mid-conversation"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[26.67%] bg-[linear-gradient(180deg,#FAF6EF_0%,rgba(250,246,239,0.5)_50%,rgba(250,246,239,0)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[41.9%] bg-[linear-gradient(0deg,#FAF6EF_0%,rgba(250,246,239,0.35)_50%,rgba(250,246,239,0)_100%)]"
        />

        {/* Sits at 77% across the band in the design. Below `lg` there is not
            room for it beside the headline above, so it goes. */}
        <div className="absolute left-[77%] top-[8.57%] hidden items-center gap-[clamp(8.5px,0.833vw,13.3px)] rounded-sm border border-white/60 bg-white/85 py-[clamp(5.7px,0.556vw,8.9px)] pl-[clamp(5.7px,0.556vw,8.9px)] pr-[clamp(11.4px,1.111vw,17.8px)] shadow-[0_12.8px_35.6px_0_rgba(20,27,26,0.08),0_2.8px_11.4px_0_rgba(20,27,26,0.06)] lg:flex">
          <span className="grid h-[clamp(31.3px,3.056vw,48.9px)] w-[clamp(31.3px,3.056vw,48.9px)] shrink-0 place-items-center rounded-sm border border-white bg-[linear-gradient(135deg,rgba(14,77,75,0.05)_0%,rgba(37,181,171,0.06)_71%)] text-eden">
            <Icon name="message" className="h-[clamp(15.6px,1.527vw,24.4px)] w-[clamp(15.6px,1.527vw,24.4px)]" />
          </span>
          <span className="max-w-[16ch] font-kyg text-[clamp(9.6px,0.9375vw,15px)] font-bold leading-[1.252] text-[#2D2A24]">
            {HERO.pill}
          </span>
        </div>
      </div>

      {/* -50.49 of overlap, held as a negative margin so the card can grow
          without the overlap drifting. */}
      <Container className="-mt-[clamp(30px,4.93vw,78.9px)] pb-[clamp(28px,3.5vw,56px)]">
        <div className="flex flex-col gap-[clamp(20px,3.333vw,53.3px)] rounded-sm border border-mine/10 bg-linenw/90 p-[clamp(20px,2.5vw,40px)] shadow-[0_28.4px_71.1px_0_rgba(20,27,26,0.14),0_8.5px_25.6px_0_rgba(20,27,26,0.1)] backdrop-blur-sm lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 flex-col gap-[clamp(7.1px,0.694vw,11.1px)]">
            <p className="font-kyg text-[clamp(14.2px,1.389vw,22.2px)] font-normal leading-[1.625] text-[#2D2A24]">
              {HERO.shelf.lead}
            </p>
            <p className="max-w-[clamp(398.2px,38.889vw,622.2px)] font-kyg text-[clamp(11.4px,1.111vw,17.8px)] font-normal leading-[1.625] text-fusc">
              {HERO.shelf.note}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-[clamp(8.5px,0.833vw,13.3px)] sm:flex-row sm:items-center">
            <Button href="#send-a-message">Send a message</Button>
            <Button href="#how-to-reach-us" variant="ghost">
              WhatsApp us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
