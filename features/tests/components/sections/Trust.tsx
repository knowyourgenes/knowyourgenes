import { cn } from '@/lib/utils';
import type { Ground, TrustSection } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import { Icon } from '../icons';
import { Heading, Section } from '../ui';

// =============================================================================
// TRUST / ACCREDITATION — 1440 frame, section y 15619, height 656.
// -----------------------------------------------------------------------------
// Frame     1440 x 656, pad 88/80, ground = linear #faf6ef -> #f5eddf ("sand").
// Rail      1280 + 32 side padding -> 1216 content, three blocks, gap 32,
//           each centred on the rail.
//
//   head      680 column, gap 16: tinted teal eyebrow pill (46) + H2 (57).
//   carousel  1216 x 78 mask-group. Inside it a 2910-wide horizontal track of
//             78-tall badge cards, each followed by an 18px margin. The mask is
//             a black gradient with stops 0 / 7% / 93% / 100%, i.e. the strip
//             fades out over the outer 85px on each side.
//             NOTE the frame's track is TWO copies of EIGHT cards (widths
//             156/165/156/198/156/172/153/156 + 8 x 18 = 1455.5 per copy, twice
//             = the declared 2910). `data.badges` supplies only seven, so the
//             8th — an icon card, 156 wide, i.e. a ~79px label beside the 19px
//             glyph — never renders. Its copy is NOT recoverable: the extract
//             carries the card's geometry but no TEXT node, and the second copy
//             is likewise text-less. Authoring it belongs in lib/testsdata.ts;
//             nothing is invented here.
//   facts     980 x 219, pad-top 12, three 313 x 207 cards, gap 20.
//
// Badge card  r16 #ffffff, 1px #222222@10, pad 0/24, gap 8, height 78.
//             Icon cards hug their content (153 / 165 / 172 / 198 wide); the
//             two-line text cards are all exactly 156, so they carry a floor.
//             Label Figtree 700 13, 19.5 single-line / 16.2 stacked, #0e4d4b.
// Fact card   r24 #ffffff, 1px #222222@10, pad 28, gap 6.
//             stat  Figtree 800 50/50 ls -.02em #0e4d4b   (card 1)
//             icon  64 square r16, mint #e6f4f3 / blush #fbeef3, 34x40 glyph
//             title Figtree 700 16/24 #222222, on a 6 (stat) / 10 (icon) pad
//             body  Figtree 400 14/19.2 #5b564e
//             Card 1's content is 18px shorter than the other two, which is
//             exactly why the frame gives it a 46 bottom pad instead of 28 —
//             an equal-height row with top-aligned content reproduces that.
//
// Both shadows on every surface here are the frame's two-layer soft effect
// (0 4 14 @5% + 0 1 2 @4%) = --shadow-tst-soft, NOT the deeper -card token.
// =============================================================================

// The H2 accent run ("Real science.") is Cormorant Garamond 600 italic filled
// with the frame's 5-stop teal gradient (#0e4d4b/#15605d/#25b5ab/#15605d/#0e4d4b).
// That is exactly what `.tst-em-teal` already paints from globals.css (now in
// @layer components, so it is no longer shadowed by utilities) — the data writes
// the class and nothing here needs to restate the gradient.

/** Carousel glyphs — 19x23, colour baked in (#0e4d4b), keyed by the data icon. */
const BADGE_GLYPH: Record<string, string> = {
  award: '15886-311', // ISO 9001:2015
  flask: '15886-668', // Illumina Genotyping
  'badge-check': '15886-1058', // ISO 27001:2013
  shield: '15886-1248', // HIPAA · FDA
};

/** Fact-card glyphs — 34x40, teal #0e4d4b / crimson #c73c70. */
const TILE_GLYPH: Record<string, string> = {
  'badge-check': '16021-703',
  lock: '16021-1036',
};

/** The frame's mask rectangle: transparent -> black at 7% -> 93% -> transparent. */
const STRIP_MASK = 'linear-gradient(90deg, rgba(0,0,0,0) 0%, #000 7%, #000 93%, rgba(0,0,0,0) 100%)';

function BadgeCard({ badge }: { badge: TrustSection['badges'][number] }) {
  const stacked = Boolean(badge.line2);
  const glyph = badge.icon ? BADGE_GLYPH[badge.icon] : undefined;

  return (
    <div
      className={cn(
        // r16 — NOT rounded-2xl: this project remaps --radius, so that token is 18px
        'flex h-[78px] shrink-0 items-center justify-center gap-2 rounded-[16px] border border-mine/10 bg-white px-6 shadow-tst-soft',
        stacked && 'min-w-[156px]'
      )}
    >
      {badge.icon ? (
        glyph ? (
          // 19x19 slot; the glyph is 19x23 and overhangs by 2px, as in the frame
          <FigmaIcon id={glyph} className="-my-0.5 block h-[23px] w-[19px] shrink-0" />
        ) : (
          <Icon name={badge.icon} className="size-[19px] shrink-0 text-eden" />
        )
      ) : null}

      <span
        className={cn(
          'text-center font-kyg text-[13px] font-bold text-eden',
          stacked ? 'leading-[16.2px]' : 'whitespace-nowrap leading-[19.5px]'
        )}
      >
        {badge.line1}
        {badge.line2 ? (
          <>
            <br />
            {badge.line2}
          </>
        ) : null}
      </span>
    </div>
  );
}

export default function Trust({ data, ground }: { data: TrustSection; ground?: Ground }) {
  const { eyebrow, titleHtml, leadHtml } = data.head;

  return (
    // the frame pads 88 top and bottom, not the 92 the shell defaults to
    <Section ground={ground ?? 'sand'} innerClassName="py-[clamp(56px,6.2vw,88px)]">
      {/* ---- head: 680 column, 16px gap ------------------------------------ */}
      <div className="mx-auto flex max-w-[680px] flex-col items-center gap-4 text-center">
        {eyebrow ? (
          <span className="inline-flex items-center gap-2.5 rounded-full border border-eden/15 bg-eden/[0.07] py-[11px] pl-[17px] pr-[22px] shadow-tst-crimson">
            {/* 22x22 slot; the glyph is 22x26 and overhangs by 2px */}
            <FigmaIcon id="15717-605" className="-my-0.5 block h-[26px] w-[22px] shrink-0" />
            <span className="font-kyg text-[14px] font-extrabold uppercase leading-[21px] tracking-[0.08em] text-eden">
              {eyebrow.label}
            </span>
          </span>
        ) : null}

        <Heading html={titleHtml} />

        {leadHtml ? (
          <p
            className="font-kyg text-[clamp(15px,1.29vw,18.5px)] leading-[1.5] text-fusc"
            dangerouslySetInnerHTML={{ __html: leadHtml }}
          />
        ) : null}
      </div>

      {/* ---- moving certification carousel --------------------------------- */}
      {/* The frame holds the track twice over; translateX(-50%) therefore
          scrolls exactly one copy and the loop never seams. At rest the first
          card sits flush on the rail's left edge, as in the frame. */}
      <div className="group mt-8 w-full overflow-hidden" style={{ maskImage: STRIP_MASK, WebkitMaskImage: STRIP_MASK }}>
        <div className="flex w-max animate-tst-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy > 0} className="flex w-max">
              {data.badges.map((b, i) => (
                <div key={`${b.line1}-${i}`} className="pr-[18px]">
                  <BadgeCard badge={b} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---- headline trust facts ------------------------------------------ */}
      <div className="mx-auto mt-8 grid w-full max-w-[980px] gap-5 pt-3 md:grid-cols-3">
        {data.tiles.map((t) => {
          const crimson = t.accent === 'crimson';
          const glyph = t.icon ? TILE_GLYPH[t.icon] : undefined;

          // r24 — NOT rounded-3xl, which is 22px on this project's radius scale
          return (
            <div
              key={t.title}
              // 28 is the frame's card padding. Between md and lg the three-up
              // row is only ~216 wide, so 28+28 leaves the 16px title 158px to
              // sit in; 24 until lg buys it back. Unchanged from lg up.
              className="flex flex-col items-center gap-1.5 rounded-[24px] border border-mine/10 bg-white p-6 text-center shadow-tst-soft lg:p-7"
            >
              {t.statHtml ? (
                <span
                  className="font-kyg text-[clamp(34px,3.5vw,50px)] font-extrabold leading-none tracking-[-0.02em] text-eden"
                  dangerouslySetInnerHTML={{ __html: t.statHtml }}
                />
              ) : (
                <span
                  className={cn(
                    // 64 square, r16 (rounded-2xl would paint 18 here)
                    'grid size-16 shrink-0 place-items-center rounded-[16px]',
                    crimson ? 'bg-blush' : 'bg-mint'
                  )}
                >
                  {glyph ? (
                    <FigmaIcon id={glyph} className="block h-10 w-[34px]" />
                  ) : t.icon ? (
                    <Icon name={t.icon} className={cn('size-[34px]', crimson ? 'text-crimson' : 'text-eden')} />
                  ) : null}
                </span>
              )}

              <h3
                className={cn(
                  'wrap-break-word font-kyg text-[16px] font-bold leading-6 text-mine',
                  t.statHtml ? 'pt-1.5' : 'pt-2.5'
                )}
              >
                {t.title}
              </h3>

              {/* the stat card's content is 18px shorter than the other two;
                  the equal-height row turns that into its 46px bottom pad */}
              <p
                className="wrap-break-word font-kyg text-[14px] leading-[19.2px] text-fusc"
                dangerouslySetInnerHTML={{ __html: t.bodyHtml }}
              />
            </div>
          );
        })}
      </div>
    </Section>
  );
}
