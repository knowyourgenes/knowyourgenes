// =============================================================================
// WHO IT'S FOR - 1:1 rebuild of the Figma frame at y=970 (1440 x 1391).
// -----------------------------------------------------------------------------
// Frame:   pad 92/80, gradient #faf6ef -> #f1f7f6, inner rail 1280 + 32 px
//          padding => a 1216 content column, children stacked with a 32 gap.
// Blocks:  head (720 wide, gap 16) · portrait 503 + intro 681 (gap 32)
//          · 2 x 4 tile grid 600/600 (gap 16) · closing 640 + CTA row (gap 12).
//
// The eyebrow pill and the two intro chips are drawn locally rather than with
// <Eyebrow/> / <Chip/> from ui.tsx: the shared primitives are a white pill with
// an 11.5 px 0.14em label, while every eyebrow in this file is a tinted pill
// with a 14/21 0.08em label (see the report note).
// =============================================================================

import { cn } from '@/lib/utils';
import type { Ground, WhoForSection } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import { Icon } from '../icons';
import { Closing, CtaRow, Heading, Media, Section } from '../ui';

// ---- the frame's own glyphs -------------------------------------------------
// A FigmaIcon id is "<y>-<x>" in PAGE space. This section starts at y=970, so a
// spec line `INSTANCE @[x=143 y=711]` maps to id "1681-143".

const EYEBROW_GLYPH = '1072-584';
const CHIP_GLYPHS = ['1550-668', '1550-874'];

/** Tile glyphs keyed by the data file's icon name, in the frame's own order
 *  (top-left -> bottom-right), so a reorder of the tiles still resolves.
 *  A key that is NOT here belongs to another test page, whose tiles this frame
 *  has no artwork for - those fall through to the lucide registry rather than
 *  borrowing, say, the pregnancy-loss glyph for "you catch every cold". */
const SIGN_GLYPH_BY_KEY: Record<string, string> = {
  calendar: '1681-143',
  baby: '1681-759',
  'pregnancy-loss': '1784-143',
  family: '1784-759',
  frown: '1886-143',
  person: '1886-759',
  shield: '1989-143',
  file: '1989-759',
};

/** 44 px badge behind a tile glyph: blush #fbeef3 / mint #e6f4f3. */
const SIGN_BADGE: Record<string, string> = {
  crimson: 'bg-blush',
  teal: 'bg-mint',
};

/**
 * A 22x22 slot holding a 22x26 instance (or 23x27 on the tiles) - the glyph is
 * centred in its instance, so centring the instance reproduces the frame.
 */
function Glyph({ id, className, box }: { id: string; className: string; box: string }) {
  return (
    <span className={cn('flex shrink-0 items-center justify-center', box)}>
      <FigmaIcon id={id} className={cn('max-w-none shrink-0', className)} />
    </span>
  );
}

/** "This test is for every woman" - intro block, then a two-column sign grid. */
export default function WhoFor({ data, ground }: { data: WhoForSection; ground?: Ground }) {
  const eyebrow = data.head.eyebrow;

  // Both CTAs end in one of the frame's OWN arrow glyphs - a 13x13 right arrow
  // on "Book a Test" (2227-660) and a 12x17 down arrow on "Learn More"
  // (2227-856), which is precisely what <Cta/> draws when no `icon` is supplied.
  // The data still carries icon:'arrow-down' on the ghost button, i.e. a lucide
  // stand-in for a glyph we already have; drop it so the design's own art wins.
  const ctas = data.ctas.map((c) => (c.icon ? { ...c, icon: undefined } : c));

  return (
    <Section ground={ground ?? 'sage'} id="who-for">
      {/* ---- head: 720 wide, eyebrow + h2, gap 16 --------------------------- */}
      <div className="mx-auto flex max-w-[720px] flex-col items-center gap-4 text-center">
        {eyebrow ? (
          /* The pill's intrinsic width is 307 (17+22+10+234+22) - wider than the
             280 a 320px viewport leaves. `max-w-full` pins it to the rail, and
             px-4 below sm buys back 7px so it stays a one-liner from 375 up and
             only wraps on the very narrowest phones. That wrap already centres
             itself: `text-align` inherits from the head's `text-center`. The
             frame's own 17/22 padding is restored from sm up. */
          <span className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-crimson/24 bg-crimson/10 px-4 py-[11px] shadow-tst-crimson sm:pl-[17px] sm:pr-[22px]">
            <Glyph id={EYEBROW_GLYPH} box="size-[22px]" className="h-[26px] w-[22px]" />
            <span className="font-kyg text-[14px] font-extrabold uppercase leading-[21px] tracking-[0.08em] text-crimson-deep">
              {eyebrow.label}
            </span>
          </span>
        ) : null}

        {/* H2 Figtree 700 51/55 ls -0.02em #222222. The serif "you" is
            GRADIENT_LINEAR(#9a2855,#c73c70,#c73c70) in the frame - which is
            exactly what `.tst-em` already paints (globals.css), so do NOT
            re-declare it here: a local `bg-gradient-to-r` would move the middle
            stop from 55% to 50%. */}
        <Heading html={data.head.titleHtml} className="max-w-[720px]" />
      </div>

      {/* ---- portrait 503 + intro 681, gap 32, block pad-top 16 ------------- */}
      <div className="mt-8 grid items-center gap-8 pt-4 lg:grid-cols-[503fr_681fr]">
        {/* Below lg the grid is one column, so the portrait fills the content
            rail: 100vw minus the section gutter (40 under sm, 80 up to lg),
            i.e. ~88-94vw. Rounded up so the candidate Next picks is never
            smaller than the box it has to fill. */}
        <Media
          img={data.image}
          className="aspect-[503/280] w-full rounded-[26px] border border-mine/10 shadow-tst-soft"
          sizes="(min-width: 1440px) 503px, (min-width: 1024px) 40vw, (min-width: 640px) 93vw, 95vw"
        />

        <div className="flex flex-col">
          {/* Cormorant Garamond 700 italic 27/40.5 #15605d, 11 px below it. */}
          <p
            className="mb-[11px] font-tst text-[clamp(21px,1.875vw,27px)] font-bold italic leading-[1.5] text-eden2"
            dangerouslySetInnerHTML={{ __html: data.introTitleHtml }}
          />

          {/* Figtree 400 18.5/30 #5b564e, measured at 641 so it wraps as drawn. */}
          <p
            className="max-w-[641px] font-kyg text-[clamp(16px,1.29vw,18.5px)] leading-[1.622] text-fusc"
            dangerouslySetInnerHTML={{ __html: data.introBodyHtml }}
          />

          {/* Two white pills: h50, r9999, 1px #222222@10, soft two-layer shadow. */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            {data.chips.map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full border border-mine/10 bg-white px-5 py-3 shadow-tst-soft"
              >
                <Glyph id={CHIP_GLYPHS[i] ?? ''} box="size-[22px]" className="h-[26px] w-[22px]" />
                <span
                  className="font-kyg text-[15.5px] font-bold leading-[23.2px] text-[#2d2a24]"
                  dangerouslySetInnerHTML={{ __html: c.label }}
                />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ---- 2 x 4 tile grid: 600 wide, gap 16 -------------------------------
          No `auto-rows-fr`: the frame's rows are NOT all the same height (86 on
          the row where both tiles are one-liners, 87.4 where one wraps to two
          lines). Default row sizing reproduces that, and cards still stretch to
          match each other WITHIN a row.
          Radius is 16 - `rounded-2xl` is 18px in this project. */}
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {data.signs.map((s, i) => (
          <li
            key={i}
            /* On a 320 rail the frame's 20px padding + 16px gap + the 44px
               badge leave the copy only 180px, which runs the longest tile to
               eight lines. Trimming both to 16/12 below sm gives it 208px back;
               everything is the frame's again from sm up. */
            className="flex items-center gap-3 rounded-[16px] border border-mine/10 bg-white p-4 shadow-tst-soft sm:gap-4 sm:p-5"
          >
            <span
              className={cn(
                'flex size-11 shrink-0 items-center justify-center rounded-[12px]',
                SIGN_BADGE[s.accent] ?? SIGN_BADGE.teal
              )}
            >
              {SIGN_GLYPH_BY_KEY[s.icon] ? (
                <FigmaIcon id={SIGN_GLYPH_BY_KEY[s.icon]!} className="h-[27px] w-[23px] max-w-none shrink-0" />
              ) : (
                <Icon
                  name={s.icon}
                  className={cn('size-[23px] shrink-0', s.accent === 'crimson' ? 'text-crimson' : 'text-eden')}
                />
              )}
            </span>
            {/* Figtree 400 (600 where the copy is <b>) 16.5/22.7 #2d2a24 */}
            <p
              className="min-w-0 break-words font-kyg text-[clamp(15px,1.15vw,16.5px)] leading-[1.376] text-[#2d2a24] [&_b]:font-semibold"
              dangerouslySetInnerHTML={{ __html: s.textHtml }}
            />
          </li>
        ))}
      </ul>

      {/* ---- closing line 640 wide + the two CTAs, gap 12 --------------------
          The frame's closing frame is 640 with its own 3px side padding, so the
          serif measures 635 - that inset is what puts the break after
          "years to". */}
      <div className="mt-8 pt-4">
        <Closing html={data.closingHtml} className="max-w-[640px] px-[3px] text-[#2d2a24]" />
        <CtaRow items={ctas} className="mt-6" />
      </div>
    </Section>
  );
}
