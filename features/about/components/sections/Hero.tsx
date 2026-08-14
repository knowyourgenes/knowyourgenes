// =============================================================================
// features/about - SECTION 01 · HERO (editorial cinematic masthead)
// -----------------------------------------------------------------------------
// Figma: 'SECTION 01 · HERO (editorial cinematic masthead)'
//        1440 x 1166, cream ground (#faf6ef), pad 64 top / 76 bottom, gap 44.
//
// This hero does NOT sit on the page's usual 1216 rail:
//   • the masthead and the content shelf run on a 1336 rail (x=52 -> 1388)
//   • the cinematic band is full-bleed 1440
// so <Section> is stripped of its padding/max-width and the rails are rebuilt
// locally (see RAIL). Everything else still comes from the shared primitives.
//
// Geometry reproduced:
//   • masthead 218 tall - eyebrow row 38, gap 23, h1 156 (Figtree 800 76/77.5)
//   • cinematic band 594 tall, full-bleed, with a 112 cream fade at the top and
//     a 176 cream fade at the bottom, both melting the band into the ground
//   • the shelf overlaps the band by 96 (frame gap = -96) and carries a 26 radius
//   • shelf grid 1262 = 738 + 48 + 476; the right column is centred in the row
//     (frame: left col 861->988, right col 878->971 - 17 of slack either side)
//
// RADIUS TRAP: the frame uses 26 (shelf) and 999/9999 (pills). 26 would be
// rounded-4xl under this project's remap, but it is written explicitly here so
// the value survives any future scale change.
//
// The band now carries the designer's photography (frame 2084:4145 filled every
// div.imgslot). Filling the slot sets its placeholder overlay - the centred
// glyph 665-703 and the caption "Hero · everyday-health portrait" - to HIDDEN in
// the frame, so the photo replaces the stand-in. The tint, the two edge fades
// and the floating pill all still sit ON TOP of it.
// =============================================================================

import Link from 'next/link';
import { cn } from '@/lib/utils';

import { AboutIcon } from '../AboutIcon';
import { Eyebrow, Heading, Photo, Section } from '../ui';

/** The frame's 1336 rail: 1440 - 52 either side. Collapses to page gutters. */
const RAIL = 'mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-[52px]';

/**
 * Figtree 700 13/19.5, ls 1.82 (0.14em), uppercase - the bookend motif.
 *
 * CASE IS LOAD-BEARING, DO NOT "CORRECT" IT. All four consumers (Genes /
 * Information / Insight / Awareness) are textCase=UPPER in the frame at
 * y=1107.3, so the `uppercase` here is the frame, not a style choice.
 *
 * TRAP: FinalCta renders the SAME four words at 15px and those are AS_TYPED -
 * sentence case is correct there. Same words, opposite answer; go by the
 * manifest entry's y offset and type spec, never by the string.
 */
const MOTIF_WORD = 'font-kyg text-[13px] font-bold uppercase leading-[19.5px] tracking-[0.14em]';

/** Both CTA capsules: 56 tall, pad 15/28, gap 9, radius 999. */
const CTA_BASE =
  'inline-flex min-h-[56px] min-w-0 items-center justify-center gap-[9px] rounded-full px-7 py-[15px] font-kyg text-[15.5px] font-bold leading-[23.2px] transition-colors';

export default function Hero() {
  return (
    <Section
      ground="cream"
      id="about-hero"
      // The band is full-bleed, so the section keeps no horizontal padding and
      // the rails are re-applied per block below.
      className="px-0 sm:px-0 lg:px-0"
      innerClassName="max-w-none px-0 py-0 lg:px-0"
    >
      {/* Frame padding: 64 top / 76 bottom (4.44vw / 5.28vw at 1440). */}
      <div className="pb-[clamp(44px,5.28vw,76px)] pt-[clamp(36px,4.44vw,64px)]">
        {/* ── masthead: the copy leads, oversized ─────────────────────────── */}
        <div className={cn(RAIL, 'flex flex-col gap-[23px]')}>
          {/* Eyebrow row - the hairline and the kicker are the frame's own
              'span.hidden' pair, so they only appear once there is room. */}
          <div className="flex flex-wrap items-center gap-4">
            <Eyebrow
              label="About Know Your Genes"
              icon="146-66"
              // The frame's metrics (pad 8/17/8/13, gap 9, glyph 19 x 23, label
              // Figtree 700 13.5/20.2 ls 1.49) are already the shared Eyebrow
              // default - only this row's no-shrink behaviour is local.
              className="shrink-0"
            />
            <span aria-hidden="true" className="hidden h-px w-[200px] shrink-0 bg-mine/10 lg:block" />
            {/* textCase=UPPER in the frame (y=147.9, 13/700, ls 2.6 = 0.2em,
                measured 259 wide) - the `uppercase` is the design, not a
                flourish. Leave it; the 0.2em is uppercase tracking. */}
            <span className="hidden font-kyg text-[13px] font-bold uppercase leading-[19.5px] tracking-[0.2em] text-boulder lg:block">
              Health without guesswork
            </span>
          </div>

          {/* Figtree 800 76/77.5, ls -1.67 (-0.022em), #222222. The frame breaks
              the line after "only"; below lg the copy wraps on its own. */}
          <Heading
            as="h1"
            html={
              'Healthcare shouldn&#39;t start only <br class="hidden lg:inline" />when <em class="abt-grad">something goes wrong.</em>'
            }
            className="max-w-[1060px] tracking-[-0.022em]"
          />
        </div>

        {/* ── cinematic full-bleed band + overlapping content shelf ────────── */}
        <div className="mt-[clamp(28px,3.06vw,44px)]">
          {/* 1440 x 594. The slot's fill CHANGED between frames: 2076:2376 had
              GRADIENT_LINEAR(#0e4d4b@0.05 -> #25b5ab@0.06), 2084:4145 has the
              photograph. The tint was the stand-in, so it is replaced - not kept
              as a wash over the image. */}
          <div className="relative h-[clamp(220px,41.25vw,594px)] w-full overflow-hidden">
            {/* The band is the page's LCP element, hence priority. Full-bleed at
                every width, so sizes is 100vw. The source is 16:9 against a
                2.42:1 slot, so object-cover crops top and bottom - pulled up to
                40% to keep the subject off the lower fade.

                NO NEGATIVE Z-INDEX HERE. This wrapper is `relative` with
                z-index:auto, so it establishes no stacking context; a child at
                -z-10 would paint behind the wrapper's own background and vanish.
                DOM order alone is enough - the fades and the pill come after
                this and paint on top. */}
            <Photo
              src="/about/img/hero-band.jpg"
              alt="Someone at home in daylight, at ease before anything has gone wrong."
              className="absolute inset-0"
              sizes="100vw"
              position="center 40%"
              priority
            />
            {/* "blend the photo into the page at the edges" - 112 top, 176 bottom. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(48px,7.78vw,112px)] bg-gradient-to-b from-linenw via-linenw/50 to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[clamp(76px,12.22vw,176px)] bg-gradient-to-t from-linenw via-linenw/35 to-transparent"
            />

            {/* "floating human moment" - 246 x 62 pill, inset 36 from the band's
                top-right corner.

                NOT SHOWN BELOW sm. The band is clamp(220px, 41.25vw, 594px), so
                it bottoms out at a fixed 220px for every viewport under 533px -
                while the pill stays 246 wide and two lines tall. On a 430px
                phone that is a 246px card sitting across more than half a band
                that has stopped shrinking, landing squarely on the subject's
                face. It returns at 640px, where the band is 264px and there is
                room for it to read as a floating detail again.

                No content is lost: the h1 above already says "Healthcare
                shouldn't start only when something goes wrong", which is the
                same point this pill restates. */}
            <div className="absolute right-4 top-4 hidden max-w-[calc(100%-2rem)] items-center gap-3 rounded-full border border-white/60 bg-white/85 py-2 pl-2 pr-4 shadow-[0_18px_50px_0_rgba(20,27,26,0.08),0_4px_16px_0_rgba(20,27,26,0.06)] backdrop-blur-[12px] sm:flex md:right-9 md:top-9">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white bg-gradient-to-br from-eden/[0.05] to-java/[0.06]">
                <AboutIcon id="456-1180" className="h-[22px] w-[18px]" />
              </span>
              {/* The frame breaks this label after "earlier"; the explicit space
                  keeps the two halves separate words in the text layer, since a
                  <br> contributes no character to textContent / clipboard. */}
              <span className="min-w-0 break-words font-kyg text-[13.5px] font-bold leading-[16.9px] text-[#2d2a24]">
                Health, understood earlier <br />
                not after something breaks
              </span>
            </div>
          </div>

          {/* Frame gap is -96: the shelf climbs back over the band. */}
          <div className={cn(RAIL, 'relative z-10 mt-[calc(-1*clamp(40px,6.67vw,96px))]')}>
            <div className="rounded-[26px] border border-mine/10 bg-linenw/90 p-[clamp(20px,2.5vw,36px)] shadow-[0_40px_100px_0_rgba(20,27,26,0.14),0_12px_36px_0_rgba(20,27,26,0.1)] backdrop-blur-[12px]">
              {/* 1262 grid: 738 + 48 + 476, right column centred on the row. */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[738fr_476fr] lg:items-center lg:gap-x-12">
                {/* left: supporting copy */}
                <div className="flex min-w-0 flex-col gap-2.5">
                  {/* Figtree 400 20/32.5, #2d2a24. */}
                  <p className="min-w-0 break-words font-kyg text-[clamp(17px,1.39vw,20px)] leading-[1.625] text-[#2d2a24]">
                    We believe knowing more about your body earlier can help you make better decisions later.
                  </p>
                  {/* Figtree 400 16/26, #5b564e, capped at the frame's 560. */}
                  <p className="min-w-0 max-w-[560px] break-words font-kyg text-[clamp(14.5px,1.11vw,16px)] leading-[1.625] text-fusc">
                    Know Your Genes brings genetic insights into everyday health, making complex information easier to
                    understand and prevention more personal.
                  </p>
                </div>

                {/* right: CTAs + trust, right-aligned from lg */}
                <div className="flex min-w-0 flex-col gap-4 lg:items-end">
                  <div className="flex flex-wrap gap-3 lg:justify-end">
                    <Link
                      href="/categories"
                      className={cn(
                        CTA_BASE,
                        'border border-eden bg-eden text-white shadow-[0_10px_26px_0_rgba(14,77,75,0.22)] hover:bg-eden2'
                      )}
                    >
                      <span className="min-w-0">Explore Genetic Testing</span>
                      <AboutIcon id="969-1108" className="h-[23px] w-[19px] shrink-0" />
                    </Link>
                    <Link
                      href="#from-genes-to-insight"
                      className={cn(
                        CTA_BASE,
                        'border border-eden/[0.18] bg-white text-eden shadow-[0_4px_16px_0_rgba(20,27,26,0.06)] hover:bg-mint'
                      )}
                    >
                      <span className="min-w-0">How It Works</span>
                      <AboutIcon id="969-1303" className="h-[23px] w-[19px] shrink-0" />
                    </Link>
                  </div>

                  {/* Figtree 600 14/21, #5b564e, glyphs 17 x 21. */}
                  <div className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-end">
                    <span className="inline-flex min-w-0 items-center gap-1.5">
                      <AboutIcon id="1024-1035" className="h-[21px] w-[17px] shrink-0" />
                      <span className="min-w-0 break-words font-kyg text-[14px] font-semibold leading-[21px] text-fusc">
                        NABL-accredited lab
                      </span>
                    </span>
                    <span className="inline-flex min-w-0 items-center gap-1.5">
                      <AboutIcon id="1024-1212" className="h-[21px] w-[17px] shrink-0" />
                      <span className="min-w-0 break-words font-kyg text-[14px] font-semibold leading-[21px] text-fusc">
                        At-home saliva kit
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* "subtle typographic motif - a bookend for the final section's
                  full arc": a 1px top rule, 20 of padding, then the four words
                  separated by the frame's own chevrons. */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-mine/10 pt-5">
                <span className={cn(MOTIF_WORD, 'text-eden')}>Genes</span>
                <AboutIcon id="1107-150" className="h-5 w-4 shrink-0" />
                <span className={cn(MOTIF_WORD, 'text-boulder')}>Information</span>
                <AboutIcon id="1107-296" className="h-5 w-4 shrink-0" />
                <span className={cn(MOTIF_WORD, 'text-boulder')}>Insight</span>
                <AboutIcon id="1107-396" className="h-5 w-4 shrink-0" />
                <span className={cn(MOTIF_WORD, 'text-boulder')}>Awareness</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
