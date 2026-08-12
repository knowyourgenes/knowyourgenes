'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Ground, PanelKey, RiskCardsSection } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import { Icon } from '../icons';
import { Body, Heading, Lead, Media, ResultBar, Section, TONE_TEXT } from '../ui';

// =============================================================================
// Figma: "THE 5 TESTS" — inner rail 1280 @ x=80, pad 0/32 -> 1216 content,
// VERTICAL gap 40, cross-axis centred. Four blocks: head, filter row, card
// wrap, CTA. Every number below is read off the frame, not eyeballed.
// -----------------------------------------------------------------------------
// Head        720 wide, gap 14, centred.
// Eyebrow     h46 r999, fill #c73c70@10, 1px #c73c70@24, 0 6 18 rgba(199,60,112,.10)
//             (= shadow-tst-crimson), pad 11/22/11/17, gap 10. Label Figtree 800
//             14/21 ls 1.12 (0.08em) #9a2855 — sentence case, NOT uppercased.
// H2          Figtree 700 51/55 ls -1.02 #222222 + Cormorant 600 italic 51/55 on
//             its own line (two text runs, gap 1) -> the <em> is forced block and
//             carries that 1px as a margin. The h2 frame also has 2 of top pad,
//             which is what makes the head block 46+14+113+14+28 = 215 tall.
// Lead        Figtree 400 18.5/27.8 #5b564e.
// Filter row  gap 10, centred. Pill h42 r9999 pad 10/20, 1px border, label
//             Figtree 700 13.5/20.2. Active: #0e4d4b fill + border, white label,
//             0 8 20 rgba(14,77,75,.24), and sits 1px high (the frame wraps it in
//             a 43-tall box with 1 of bottom pad = translateY(-1px)).
//             Idle: #ffffff, 1px #222222@10, #5b564e label, 8px accent dot.
// Card        389 wide, r26, #ffffff, 1px #222222@10, tst-soft. Rows of 3 with a
//             24 gap (3x389 + 48 = 1215 of the 1216 rail); the 4th/5th centre.
//             Cards stretch to the tallest in their row, content stays top-aligned.
//             Below 1440 the track count steps down 3 -> 2 -> 1 (see the card
//             className): a bare w-[389px] only ever fits three abreast on a rail
//             >=1215, i.e. a >=1247 viewport, so every laptop and tablet width was
//             rendering ONE centred column. The widths are calc()s off the rail so
//             the cards fill it, capped at max-w-[389px] so >=1440 lands on 389 to
//             the pixel and the row still measures 1215.
// Img slot    387 x 180 (aspect 387/180). Badge 44x44 r16 #ffffff at 12/12 with
//             INNER 0 -10 22 rgba(0,0,0,.05) + INNER 0 1 0 rgba(255,255,255,.60).
//             r16 must be spelt rounded-[16px]: this project remaps the radius
//             scale (--radius: .625rem), so rounded-2xl paints 18px, not 16.
//             Caption Figtree 700 10/15 ls 1.0 accent@80 (@70 on pregnancy), 12
//             from the left, 10 up from the slot's bottom edge.
//             The frame also parks a centred 34x40 glyph + "<Panel> visual"
//             caption over every slot (spec lines 55-60, 90-95, 125-130, 160-165,
//             195-200). That is the designer's placeholder scaffolding naming the
//             artwork to be dropped in; the finished photography now sits in the
//             slot, so printing "PCOS visual" across it would be a defect. It is
//             deliberately NOT rendered — same call as star-treatment, price-value
//             and the 30-second explainer, which carry the identical scaffolding.
// Rule        4px full-bleed linear gradient between the slot and the copy.
// Copy block  pad 27/28/28/28, gap 7: gene label (Figtree 700 11/16.5 ls 1.1,
//             accent) / H3 (Figtree 700 23/24.8 ls -0.46 #222222) / body (Figtree
//             400 17.5/26.2 #5b564e, pad-top 4) / warning row (pad 9/0/13/0 gap 8,
//             Figtree 600 13.5/18.6 #c0432f) / result block (1px #222222@10 top
//             rule, pad-top 16, gap 6): "Sample result" Figtree 700 10.5/15.8
//             ls 1.26 #7a7a7a, value Cormorant 600 italic 21/31.5 tone-coloured
//             (no dot in the frame), 6px rail on #222222@10.
//             The body and the CTA note are each a SINGLE 400-weight run in the
//             frame (the extractor splits a text node per style run — see the
//             h2, split at the serif). The data still wraps their last sentence
//             in <b>, which preflight renders at 700, so the weight is pinned
//             back to 400 here until the copy loses the tag.
// CTA         pad-top 8, gap 8. Button h69 r999 #0e4d4b pad 20/44 gap 10, label
//             Figtree 800 18/27 ls 0.07, both frame effects (= shadow-tst-cta).
//             Note Figtree 400 16/21.8 #5b564e, 13 below the button, 1 under it.
// =============================================================================

type Accent = {
  /** 8px dot on the idle filter pill. */
  dot: string;
  /** 4px gradient rule under the image. */
  rule: string;
  /** Gene kicker above the question. */
  label: string;
  /** Caption inside the image slot. */
  caption: string;
  /** 2px rule beside an optional scenario quote. Spelt out rather than derived
   *  from `rule` at runtime — Tailwind only emits classes it can see in source. */
  border: string;
  /** Tint for a registry badge icon (pages outside Women's Health). */
  badgeText: string;
  /** The design's own glyph for the 44px badge, top-right of the image. */
  badge: string;
};

// The five colourways the frame runs across its cards. A page with more panels
// than this cycles them by position, which is what the reference build's own
// pill dots do once they run past the palette.
const PALETTE: Accent[] = [
  {
    dot: 'bg-crimson',
    rule: 'from-crimson to-crimson-deep',
    label: 'text-crimson',
    caption: 'text-crimson-deep/80',
    border: 'border-crimson',
    badgeText: 'text-crimson',
    badge: '5485-455',
  },
  {
    dot: 'bg-eden',
    rule: 'from-eden to-java',
    label: 'text-eden',
    caption: 'text-eden/70',
    border: 'border-eden',
    badgeText: 'text-eden',
    badge: '5485-868',
  },
  {
    dot: 'bg-java',
    rule: 'from-java to-surfie',
    label: 'text-surfie',
    caption: 'text-surfie/80',
    border: 'border-java',
    badgeText: 'text-surfie',
    badge: '5485-1281',
  },
  {
    dot: 'bg-eden2',
    rule: 'from-eden2 to-bottlehero',
    label: 'text-eden2',
    caption: 'text-eden2/80',
    border: 'border-eden2',
    badgeText: 'text-eden2',
    badge: '6108-661',
  },
  {
    dot: 'bg-surfie',
    rule: 'from-surfie to-java',
    label: 'text-surfie',
    caption: 'text-surfie/80',
    border: 'border-surfie',
    badgeText: 'text-surfie',
    badge: '6108-1075',
  },
];

/** The Women's Health panels keep the exact colourway the frame gives them. */
const ACCENT: Record<string, Accent | undefined> = {
  pcos: PALETTE[0],
  pregnancy: PALETTE[1],
  mood: PALETTE[2],
  bones: PALETTE[3],
  joints: PALETTE[4],
};

function accentFor(key: PanelKey, index: number): Accent {
  return ACCENT[key] ?? PALETTE[index % PALETTE.length]!;
}

/** The frame's glyphs overflow their layout box by a couple of px; this keeps the
 *  box the size Figma reports and lets the artwork bleed, exactly as it does there. */
function Glyph({ id, box, w, h }: { id: string; box: string; w: string; h: string }) {
  return (
    <span className={cn('flex shrink-0 items-center justify-center', box)}>
      <FigmaIcon id={id} className={cn('max-w-none', w, h)} />
    </span>
  );
}

/** "Five risks that stay silent" — filter pills over a wrapped card grid. */
export default function RiskCards({ data, ground }: { data: RiskCardsSection; ground?: Ground }) {
  const [filter, setFilter] = useState<PanelKey | 'all'>('all');
  // The reference build DIMS the cards that fall outside the filter rather than
  // unmounting them: opacity .32 + saturate(.6) + scale(.985) over 450ms. Keeping
  // every card mounted means the grid never reflows, so the row you are reading
  // does not jump when you change filter.
  const eyebrow = data.head.eyebrow;

  return (
    <Section ground={ground ?? 'cream'} id="what-we-check">
      <div className="flex flex-col items-center gap-[clamp(28px,2.78vw,40px)]">
        {/* ---- head: 720 wide, gap 14 -------------------------------------- */}
        <div className="flex w-full max-w-[720px] flex-col items-center gap-[14px] text-center">
          {eyebrow ? (
            <span className="inline-flex items-center gap-2.5 rounded-full border border-crimson/24 bg-crimson/10 py-[11px] pl-[17px] pr-[22px] shadow-tst-crimson">
              <Glyph id="5137-634" box="size-[22px]" w="w-[22px]" h="h-[26px]" />
              <span className="font-kyg text-[14px] font-extrabold leading-[21px] tracking-[0.08em] text-crimson-deep">
                {eyebrow.label}
              </span>
            </span>
          ) : null}

          {/* h2 frame: 2 of top pad, the two runs 1 apart -> 2 + 55 + 1 + 55 = 113.
           *  The <em> is forced block for that 1px gap, so it must also be w-fit +
           *  mx-auto: .tst-em-teal paints its 5-stop gradient across the element's
           *  own box, and a full-width block would size the ramp to 720 and clip
           *  the #0e4d4b ends off the 328-wide glyph run. */}
          <Heading
            html={data.head.titleHtml}
            className="w-full pt-0.5 [&>em]:mx-auto [&>em]:mt-px [&>em]:block [&>em]:w-fit"
          />

          {data.head.leadHtml ? (
            <Lead html={data.head.leadHtml} className="w-full text-[clamp(15px,1.29vw,18.5px)] leading-[1.5027]" />
          ) : null}
        </div>

        {/* ---- filter pills: gap 10, centred ------------------------------- */}
        <div className="flex w-full flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
            className={cn(
              'inline-flex items-center justify-center rounded-full border px-5 py-[10px] font-kyg text-[13.5px] font-bold leading-[20.2px] transition duration-200',
              filter === 'all'
                ? '-translate-y-px border-eden bg-eden text-white shadow-[0_8px_20px_0_rgba(14,77,75,0.24)]'
                : 'border-mine/10 bg-white text-fusc hover:bg-spring'
            )}
          >
            {data.allLabel}
          </button>

          {data.cards.map((c, i) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setFilter(c.key)}
              aria-pressed={filter === c.key}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-5 py-[10px] font-kyg text-[13.5px] font-bold leading-[20.2px] transition duration-200',
                filter === c.key
                  ? '-translate-y-px border-eden bg-eden text-white shadow-[0_8px_20px_0_rgba(14,77,75,0.24)]'
                  : 'border-mine/10 bg-white text-fusc hover:bg-spring'
              )}
            >
              <span
                className={cn('size-2 shrink-0 rounded-full', filter === c.key ? 'bg-white' : accentFor(c.key, i).dot)}
              />
              {c.tabLabel}
            </button>
          ))}
        </div>

        {/* ---- cards: 389 wide, gap 24, wrapped and centred ---------------- */}
        <div className="flex w-full flex-wrap justify-center gap-6">
          {data.cards.map((c, i) => {
            const a = accentFor(c.key, i);
            const dim = filter !== 'all' && c.key !== filter;
            return (
              <article
                key={c.key}
                aria-hidden={dim || undefined}
                className={cn(
                  'tcard zoomcard lift flex flex-col overflow-hidden rounded-[26px] border border-mine/10 bg-white shadow-tst-soft',
                  // 1 up -> 2 up (md) -> 3 up (xl). The 25/49 subtrahends are the
                  // 24/48 of gap plus 1px of slack, so a fractional rail can never
                  // round the last card onto its own line. At the 1216 rail the
                  // 3-up calc is exactly 389, which max-w-[389px] then pins.
                  'w-full max-w-[389px] md:w-[calc((100%-25px)/2)] xl:w-[calc((100%-49px)/3)]',
                  dim && 'dim'
                )}
              >
                {/* image slot 387 x 180 — the aspect box keeps it fluid at every
                 *  card width. `sizes`: the card tops out at 389 at EVERY width
                 *  >=430 (where the rail first clears 389), so one 389px hint
                 *  covers the whole tablet/desktop range and the browser reuses a
                 *  single file; under 430 the card IS the rail, 100vw - 40 of
                 *  gutter. The old 45vw/92vw pair shipped a ~660px crop to a
                 *  768 tablet that only ever paints 332. */}
                <div className="relative w-full">
                  <Media img={c.image} className="aspect-[387/180] w-full" sizes="(min-width:430px) 389px, 92vw" />
                  {/* r16 — NOT rounded-2xl, which is 18px on this project's scale. */}
                  {/* The frame's badge artwork exists for the Women's Health
                      panels only, so any other page names a registry icon and
                      gets it in that card's accent instead. */}
                  <span className="absolute right-3 top-3 flex size-[44px] items-center justify-center rounded-[16px] bg-white shadow-[inset_0_-10px_22px_0_rgba(0,0,0,0.05),inset_0_1px_0_0_rgba(255,255,255,0.6)]">
                    {c.icon ? (
                      <Icon name={c.icon} className={cn('size-[23px]', a.badgeText)} />
                    ) : (
                      <Glyph id={a.badge} box="size-[23px]" w="w-[23px]" h="h-[27px]" />
                    )}
                  </span>
                  <span
                    className={cn(
                      'absolute bottom-[10px] left-3 right-3 truncate font-kyg text-[10px] font-bold leading-[15px] tracking-[0.1em]',
                      a.caption
                    )}
                  >
                    {c.imageCaption}
                  </span>
                </div>

                {/* 4px gradient rule */}
                <div className={cn('h-1 w-full shrink-0 bg-gradient-to-r', a.rule)} />

                {/* copy block: pad 27/28/28/28, gap 7 */}
                <div className="flex flex-col gap-[7px] px-7 pb-7 pt-[27px]">
                  <span className={cn('font-kyg text-[11px] font-bold leading-[16.5px] tracking-[0.1em]', a.label)}>
                    {c.geneLabel}
                  </span>

                  <h3
                    className="font-kyg text-[23px] font-bold leading-[24.8px] tracking-[-0.02em] text-mine"
                    dangerouslySetInnerHTML={{ __html: c.question }}
                  />

                  {/* Optional scene-setter above the body: Cormorant italic on
                      a 2px accent rule, so the card opens on the reader's own
                      situation before it explains the gene. */}
                  {c.scenarioHtml ? (
                    <p
                      className={cn(
                        'mt-1 border-l-2 pl-3.5 font-tst text-[17px] font-semibold italic leading-snug text-[#2d2a24]',
                        a.border
                      )}
                      dangerouslySetInnerHTML={{ __html: c.scenarioHtml }}
                    />
                  ) : null}

                  {/* One uniform 400 run in the frame — see the note above on <b>. */}
                  <Body html={c.bodyHtml} className="pt-1 text-[17.5px] leading-[26.2px]" />

                  {/* Symptom pills — hairline outline, no fill, so they read as
                      a checklist rather than as another set of tone chips. */}
                  {c.chips?.length ? (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {c.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-full border border-mine/10 px-2.5 py-1 font-kyg text-[11.5px] font-semibold leading-tight text-fusc"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <p className="flex items-start gap-2 pb-[13px] pt-[9px] font-kyg text-[13.5px] font-semibold leading-[18.6px] text-mojo">
                    <Glyph id="5881-968" box="size-[19px]" w="w-[19px]" h="h-[23px]" />
                    <span dangerouslySetInnerHTML={{ __html: c.warningHtml }} />
                  </p>

                  <div className="flex flex-col gap-1.5 border-t border-mine/10 pt-4">
                    <span className="font-kyg text-[10.5px] font-bold leading-[15.8px] tracking-[0.12em] text-boulder">
                      {c.sample.label}
                    </span>
                    <p
                      className={cn(
                        'pb-[2px] font-tst text-[21px] font-semibold italic leading-[31.5px]',
                        TONE_TEXT[c.sample.tone]
                      )}
                      dangerouslySetInnerHTML={{ __html: c.sample.valueHtml }}
                    />
                    <ResultBar tone={c.sample.tone} percent={c.sample.percent} />
                    {c.sample.noteHtml ? (
                      <p
                        className="pt-0.5 font-kyg text-[12.5px] leading-snug text-boulder"
                        dangerouslySetInnerHTML={{ __html: c.sample.noteHtml }}
                      />
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* ---- CTA: pad-top 8, gap 8 --------------------------------------- */}
        {data.cta ? (
          <div className="flex w-full flex-col items-center gap-2 pt-2">
            {/* The shared <Cta/> is the 60-tall button (pad 16/34/18/34, label
             *  16/24); this frame's is the big one — h69, pad 20/44, label 18/27
             *  — so it is spelt out here with the same tokens and the frame's own
             *  arrow glyph. */}
            <Link
              href={data.cta.href}
              className="group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full border border-eden bg-eden px-[44px] py-5 font-kyg text-[18px] font-extrabold leading-[27px] tracking-[0.07px] text-white shadow-tst-cta transition duration-200 hover:-translate-y-px hover:bg-eden2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-java"
            >
              {data.cta.label}
              <span className="flex size-5 shrink-0 items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                <FigmaIcon id="6730-778" className="h-6 w-5 max-w-none" />
              </span>
            </Link>

            {data.ctaNoteHtml ? (
              <p
                className="pb-px pt-[13px] text-center font-kyg text-[16px] leading-[21.8px] text-fusc"
                dangerouslySetInnerHTML={{ __html: data.ctaNoteHtml }}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
