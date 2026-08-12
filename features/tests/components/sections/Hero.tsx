// =============================================================================
// features/tests — HERO
// -----------------------------------------------------------------------------
// Rebuilt 1:1 from the Figma frame (node 'HERO', 1440x896).
//
//   frame      pad 80/80/96/80, no fill (sits on the cream page)
//   inner rail 1280 wide, its own 32 px padding -> two 576 px columns, gap 64,
//              both vertically centred in the 720 px band
//   left       VERTICAL, gap 7, with per-block top padding (13 / 21 / 25 / 21)
//   right      576x720 arch (radius 200/200/26/26) over a blurred gradient wash
//              that is inset -24 on every side, plus the results card at -24/-24
//
// Everything below carries the frame's own numbers; nothing here is eyeballed.
// =============================================================================

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Ground, HeroSection } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import { Icon } from '../icons';
import { Eyebrow, Heading, Lead, Section, TONE_DOT, TONE_TEXT } from '../ui';

// ---- the frame's own glyphs -------------------------------------------------
// Ids are "<y>-<x>" from the spec (page coords), resolved by <FigmaIcon/>. Keyed
// by the data file's icon name so reordering the data cannot mis-pair a glyph.

/**
 * Trailing button glyphs, both 20x24 with the frame's fill baked in: the white
 * arrow-right (660-268) only ever sits on the eden primary, the eden arrow-down
 * (660-520) only on the white ghost — that is the only pairing the frame ships,
 * and no white arrow-down / eden arrow-right exists in the export.
 * `motion` is the hover nudge, along the axis the glyph actually points.
 */
const CTA_GLYPH: Record<string, { id: string; motion: string }> = {
  'arrow-right': { id: '660-268', motion: 'group-hover:translate-x-0.5' },
  'arrow-down': { id: '660-520', motion: 'group-hover:translate-y-0.5' },
};

/** Chip glyph + the 32 px badge ground behind it (mint for teal, blush for crimson). */
const CHIP_GLYPH: Record<string, { id: string; badge: string }> = {
  droplet: { id: '747-127', badge: 'bg-mint' }, // No needles      — teal
  'badge-check': { id: '747-277', badge: 'bg-blush' }, // NABL lab — crimson
  clock: { id: '747-415', badge: 'bg-mint' }, // Results in 3 weeks — teal
};

/** Results-card header glyph (18x21). */
const RESULT_GLYPH: Record<string, string> = { flask: '670-749' };

// ---- buttons ----------------------------------------------------------------
// h60  r999  pad 16/34/18/34  gap 10  label Figtree 800 16/24 ls 0.06.
// Rendered locally rather than through <Cta/> so both buttons carry THIS
// frame's glyph instances: <Cta/> ships the who-it's-for arrows and falls back
// to the lucide set whenever the data names an icon, which is exactly the case
// for the hero's "How does it work?" arrow-down.

// `max-w-full` + the max-sm wrap escape hatch are the only additions to the
// frame's spec: below 640 a long data-supplied label would otherwise push the
// nowrap pill past the 280 px content column. At >=640 nothing changes.
const BTN =
  'group inline-flex max-w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-full border px-[34px] pb-[18px] pt-4 font-kyg text-[16px] font-extrabold leading-6 tracking-[0.06px] transition duration-200 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-java max-sm:whitespace-normal max-sm:text-center';

const BTN_VARIANT: Record<'primary' | 'ghost' | 'light', string> = {
  primary: 'border-eden bg-eden text-white shadow-tst-cta hover:bg-eden2',
  ghost: 'border-eden/28 bg-white text-eden shadow-tst-ghost hover:bg-spring',
  light: 'border-transparent bg-white text-eden shadow-tst-card hover:bg-spring',
};

export default function Hero({ data, ground = 'cream' }: { data: HeroSection; ground?: Ground }) {
  const card = data.resultCard;
  const cardGlyph = card.icon ? RESULT_GLYPH[card.icon] : undefined;

  return (
    <Section ground={ground} innerClassName="py-0">
      <div className="grid items-center gap-x-16 gap-y-14 pt-[clamp(48px,5.6vw,80px)] pb-[clamp(64px,6.7vw,96px)] lg:grid-cols-2">
        {/* ------------------------------------------------------------ copy -- */}
        <div className="flex flex-col items-start gap-[7px]">
          {/* White pill with an 8 px crimson dot — the frame has no glyph here. */}
          <Eyebrow data={{ label: data.eyebrow.label, accent: data.eyebrow.accent }} />

          {/* Figtree 800 64/69.1 ls -0.02em #222222. The serif run's
              #9a2855 -> #c73c70 gradient lives on `.tst-em` in globals.css and
              is NOT restated here; the only local addition is the per-line
              restart, because the frame lists the two serif lines as two
              separately-filled runs.
              The frame's h1 box is 297 tall for 4x69.1 = 276.4 of text: the
              17 px of slack sits above the first line (text node starts at
              y=168 inside a box that starts at 151), so it is padding, not gap. */}
          <Heading
            as="h1"
            html={data.titleHtml}
            className="w-full max-w-[576px] wrap-break-word pt-[clamp(6px,1.2vw,17px)] [&_em]:[-webkit-box-decoration-break:clone] [&_em]:[box-decoration-break:clone]"
          />

          {/* Highlighted kicker: Figtree 800 28/35 #9a2855 on a 2 px-radius
              highlighter band, 2 px side padding.
              The frame's fill is a VERTICAL gradient (handles (0.5,0)->(0.5,1) =
              180deg) whose two stops SHARE position 0.6: crimson@0 at 60% and
              crimson@0.22 at 60%. That is a hard edge, not a fade — nothing
              above the 60 % line, a flat 22 % crimson band across the bottom
              14 px of the 35 px box. Restated literally rather than through
              `bg-gradient-to-r`, which would fade left-to-right across the whole
              box and is the wrong axis, edge and coverage.
              `crimson-deep` is the frame's #9a2855 (globals.css). */}
          <p className="pb-px pt-[13px]">
            <span
              className="inline-block rounded-[2px] bg-[linear-gradient(180deg,rgba(199,60,112,0)_60%,rgba(199,60,112,0.22)_60%)] px-[2px] font-kyg text-[clamp(21px,2vw,28px)] font-extrabold leading-[1.25] text-crimson-deep"
              dangerouslySetInnerHTML={{ __html: data.kickerHtml }}
            />
          </p>

          {/* Figtree 400 19/28.5 #5b564e */}
          <Lead html={data.subHtml} className="max-w-[520px]" />

          {/* Optional benefit checklist — Figtree 400 17/24 on a filled tick,
              the same 12px gap the chip row below uses. */}
          {data.bullets?.length ? (
            <ul className="flex max-w-[520px] flex-col gap-3 pt-[21px]">
              {data.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Icon name="check" className="mt-0.5 size-[21px] shrink-0 text-sea" />
                  <span
                    className="font-kyg text-[17px] leading-snug text-[#2d2a24] [&_b]:font-bold"
                    dangerouslySetInnerHTML={{ __html: b }}
                  />
                </li>
              ))}
            </ul>
          ) : null}

          {/* pad-top 21, gap 12 */}
          <div className="flex flex-wrap items-center gap-3 pt-[21px]">
            {data.ctas.map((c) => {
              const variant = c.variant ?? 'primary';
              const glyph = CTA_GLYPH[c.icon ?? 'arrow-right'];
              return (
                <Link key={c.label} href={c.href} className={cn(BTN, BTN_VARIANT[variant])}>
                  {c.label}
                  {glyph ? (
                    <FigmaIcon
                      id={glyph.id}
                      className={cn('h-6 w-5 shrink-0 transition-transform duration-300', glyph.motion)}
                    />
                  ) : (
                    <Icon
                      name={c.icon ?? 'arrow-right'}
                      className="size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* pad-top 25, gap 10 — h50 white pills, 32 px badge, label 14.5/21.8 */}
          <div className="flex flex-wrap items-center gap-2.5 pt-[25px]">
            {data.chips.map((c) => {
              const glyph = c.icon ? CHIP_GLYPH[c.icon] : undefined;
              return (
                <span
                  key={c.label}
                  className="inline-flex max-w-full items-center gap-2 rounded-full border border-mine/10 bg-white py-2 pl-2 pr-4 shadow-tst-soft"
                >
                  <span
                    className={cn('grid size-8 shrink-0 place-items-center rounded-full', glyph?.badge ?? 'bg-mint')}
                  >
                    {glyph ? (
                      <FigmaIcon id={glyph.id} className="h-6 w-5" />
                    ) : c.icon ? (
                      <Icon name={c.icon} className="size-[18px] text-eden" />
                    ) : null}
                  </span>
                  <span
                    className="min-w-0 font-kyg text-[14.5px] font-bold leading-[1.5] text-[#2d2a24]"
                    dangerouslySetInnerHTML={{ __html: c.label }}
                  />
                </span>
              );
            })}
          </div>

          {/* Cormorant Garamond 700 italic 22/33 #15605d, pad-top 21 */}
          <p
            className="pt-[21px] font-tst text-[clamp(18px,1.6vw,22px)] font-bold italic leading-[1.5] text-eden2"
            dangerouslySetInnerHTML={{ __html: data.footnoteHtml }}
          />
        </div>

        {/* -------------------------------------------- portrait + results -- */}
        <div className="relative mx-auto w-full max-w-[576px]">
          {/* 624x768 wash behind the arch: inset -24, radius 220.
              LAYER_BLUR 40 -> CSS blur(20px): Figma's blur radius is twice the
              Gaussian sigma CSS takes, the same halving used by Counsellor
              (24->12), FinalCta (90->45) and BodyMap (14->7).
              Below sm the page gutter is only 20px, so a -24 inset pushes the
              wash 4px past the viewport and opens a horizontal scrollbar; the
              inset is pulled to -12 there and restored to the frame's -24 from
              640 up, where the gutter is 40. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-3 rounded-[220px] bg-[linear-gradient(135deg,#e6f4f3_0%,rgba(245,237,223,0.6)_55%,rgba(251,238,243,0.6)_100%)] blur-[20px] sm:-inset-6"
          />

          <div className="relative">
            <div className="relative aspect-[576/720] w-full overflow-hidden rounded-t-[200px] rounded-b-[26px] shadow-tst-float">
              <Image
                src={data.image.src}
                alt={data.image.alt}
                fill
                priority
                sizes="(min-width: 1440px) 576px, (min-width: 1024px) 40vw, (min-width: 640px) 576px, 100vw"
                className="object-cover"
              />
            </div>

            {/* 248x247, r22, #ffffff@95, 1 px #222222@10, BACKGROUND_BLUR 8 ->
                backdrop-blur(4px) (same halving as Counsellor's float card).
                The card cannot shrink (its rows are fixed 13.5px type), so on a
                phone it would cover ~2/3 of the portrait. Below sm it therefore
                drops out of the overlay and into normal flow under the arch,
                keeping the frame's 24 px overlap as a negative margin; from 640
                up it is the frame's absolute -24/-24 float again. */}
            <div className="floaty relative mx-auto -mt-6 w-full max-w-[248px] rounded-[22px] border border-mine/10 bg-white/95 p-5 shadow-tst-float backdrop-blur-[4px] sm:absolute sm:-bottom-6 sm:-left-6 sm:mx-0 sm:mt-0 sm:w-[248px]">
              {/* `titleRight` splits the header into a labelled pair (the
                  Men's deck runs "File No. …" against "KYG Lab"); without it
                  the title sits alone beside the glyph, as the frame draws it. */}
              <div className="flex items-center justify-between gap-2 pb-3">
                <span className="flex min-w-0 items-center gap-1.5">
                  <span className="flex size-[18px] shrink-0 items-center justify-center">
                    {cardGlyph ? (
                      <FigmaIcon id={cardGlyph} className="h-[21px] w-[18px] max-w-none" />
                    ) : (
                      <Icon name={card.icon ?? 'flask'} className="size-[18px] text-eden" />
                    )}
                  </span>
                  <span className="truncate font-kyg text-[10px] font-bold uppercase leading-[15px] tracking-[0.14em] text-boulder">
                    {card.title}
                  </span>
                </span>
                {card.titleRight ? (
                  <span className="shrink-0 font-kyg text-[10px] font-bold uppercase leading-[15px] tracking-[0.14em] text-boulder">
                    {card.titleRight}
                  </span>
                ) : null}
              </div>

              <ul className="flex flex-col">
                {card.rows.map((r) => (
                  <li
                    key={r.label}
                    className="flex h-[35px] items-center justify-between gap-3 border-b border-mine/10 last:h-[34px] last:border-b-0"
                  >
                    <span className="flex items-center gap-2 font-kyg text-[13.5px] leading-[20.2px] text-mine">
                      <span className={cn('size-2 shrink-0 rounded-full', TONE_DOT[r.tone])} />
                      {r.label}
                    </span>
                    <span className={cn('font-kyg text-[13.5px] font-bold leading-[20.2px]', TONE_TEXT[r.tone])}>
                      {r.value}
                    </span>
                  </li>
                ))}
              </ul>

              {card.footNoteHtml ? (
                <p
                  className="mt-3 border-t border-mine/10 pt-3 font-kyg text-[10px] font-bold uppercase leading-[15px] tracking-[0.12em] text-crimson-deep"
                  dangerouslySetInnerHTML={{ __html: card.footNoteHtml }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
