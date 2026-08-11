import type { AspirationSection, Ground } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import { Heading, Media, Section } from '../ui';

// =============================================================================
// STAR TREATMENT — top half ("From Hollywood to Bollywood")
// -----------------------------------------------------------------------------
// The Figma frame 'STAR TREATMENT' (1440x1738) holds BOTH this section and
// <ThenNow/>. Its vertical rhythm is: 92 top pad -> head (173) -> 48 -> the
// editorial row (735) -> 48 -> the then/now cards -> 48 -> closing -> 92.
// So this component owns the top pad and stops flush at the editorial row
// (`pb-0`); <ThenNow/> re-opens with `pt-[56px]` (48 gap + the row frame's own
// 8px top pad) and carries the 92 bottom pad. The frame's 1px #222222@10 stroke
// is split the same way: border-t here, border-b there.
//
// Glyph ids are "<pageY>-<x>"; this frame sits at page y=2361, so a spec line
// '@[x=754 y=432]' is id "2793-754".
// =============================================================================

const GLYPH = {
  eyebrow: '2464-562', // 22x26 star, drawn in a 22x22 slot
  badgeTop: '2673-113', // 20x24 sparkle, 20x20 slot
  badgeBottom: '3389-491', // 20x24 bolt, 20x20 slot
  rows: ['2793-754', '2865-754', '2937-754'], // 28x34, exact slot
} as const;

// The H2's Cormorant run carries the frame's 5-stop teal gradient
// (#0e4d4b → #15605d → #25b5ab → #15605d → #0e4d4b). That IS `.tst-em-teal` in
// globals.css, so the accent needs no component override at all.

/**
 * The quote panel is the opposite case: both runs are FLAT — Cormorant 700
 * #9a2855 for the serif and Figtree 700 #222222 for the sans — so `tst-flat`
 * switches off the gradient `.tst-em` carries by default and lets these plain
 * colour utilities take over.
 */
const QUOTE_RUNS =
  'tst-flat [&_.tst-em]:font-bold! [&_.tst-em]:text-crimson-deep! [&_.tst-strong]:text-mine!';

export default function Aspiration({
  data,
  ground,
}: {
  data: AspirationSection;
  ground?: Ground;
}) {
  const eyebrow = data.head.eyebrow;

  return (
    <Section
      ground={ground ?? 'ivory'}
      className="border-t border-mine/10"
      innerClassName="pb-0"
    >
      {/* ---- head — 720 rail, 16 gap ------------------------------------- */}
      <div className="mx-auto flex max-w-180 flex-col items-center gap-4 text-center">
        {eyebrow ? (
          /* pill: r999, #c73c70@10 on a #c73c70@24 hairline, 0 6 18 crimson@10,
             pad 11/22/11/17, gap 10 -> 353x46 at desktop. */
          <span className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-crimson/24 bg-crimson/10 py-[11px] pl-[17px] pr-[22px] shadow-tst-crimson">
            <span className="relative grid size-[22px] shrink-0 place-items-center">
              <FigmaIcon id={GLYPH.eyebrow} className="absolute h-[26px] w-[22px] max-w-none" />
            </span>
            {/* Figtree 800 14/21 ls 1.12 (0.08em) #9a2855, set in caps: the
                label hugs at 280px, which only reconciles with uppercase
                (title case measures ~222 at this size).

                Below sm the pill cannot hold that: 22 icon + 10 gap + 39 pad +
                280 label = 353, against 280 of content at 320w and 335 at 375w.
                12px/0.06em brings the label to ~233 so it stays one line from
                375 up, and `text-center` keeps the two-line wrap at 320 tidy
                instead of ragged-left. */}
            <span className="text-center font-kyg text-[12px] font-extrabold uppercase leading-normal tracking-[0.06em] text-crimson-deep sm:text-[14px] sm:tracking-[0.08em]">
              {eyebrow.label}
            </span>
          </span>
        ) : null}

        {/* Figtree 700 51/55 ls -.02em, second line Cormorant 600 italic on the
            teal gradient (`.tst-em-teal`, no override needed). The break after
            "…look up to have" is natural at this measure — the sans run is 712
            wide, so " already" cannot follow it inside the 720 rail. */}
        <Heading html={data.head.titleHtml} />
      </div>

      {/* ---- editorial visual + copy — 588 | 40 | 588, centred ------------ */}
      <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
        {/* Image, with a badge pinned to each diagonal corner at -12. No bottom
            margin: as a grid item it would grow the row track by 60px and push
            the next block past where the frame puts it — the rail's own gap
            already supplies the spacing.

            Both badge labels are Figtree 700 15/22.5; `leading-normal` is 1.5
            in this theme, so 15 x 1.5 = 22.5 exactly. The white badge adds a
            1px hairline (10 + 23 + 10 + 2 = the frame's 45); the eden one has
            no stroke (10 + 23 + 10 = 43). */}
        {/* Capped at its own 588 and centred, the way Counsellor treats the
            same portrait slot. Single-column under lg the content rail is wider
            than the frame ever draws this image, and 588/735 is portrait — at
            768 an uncapped w-full renders 688x860, a full viewport of scroll for
            one editorial photo. The cap is a no-op from 1024 up (the column is
            380 -> 588 there), so desktop is untouched. */}
        <div className="relative mx-auto w-full max-w-[588px] lg:mx-0">
          {/* The column is 588 only from 1440 up. Below that it is
              (100vw - 264)/2 on lg (gutter 80x2 + rail pad 32x2 + the 40 gap),
              the 588 cap from md, and the full content width on phones — or the
              browser downloads the 1200w candidate for a 280px slot. */}
          <Media
            img={data.image}
            className="aspect-588/735 w-full rounded-[28px] border border-mine/10 shadow-tst-card"
            sizes="(min-width: 1440px) 588px, (min-width: 1024px) calc((100vw - 264px) / 2), (min-width: 768px) 588px, 100vw"
          />

          {/* Both badges hug their label, so at 320 they cover 72% / 84% of a
              280-wide image. Below sm they step down to 13px with tighter pad
              (~182 / ~205) — still legible, no longer swallowing the photo. */}
          <span className="absolute -left-3 -top-3 inline-flex items-center gap-1.5 rounded-full border border-mine/10 bg-white py-2 pl-2.5 pr-3.5 shadow-tst-card sm:gap-2 sm:py-[10px] sm:pl-3 sm:pr-5">
            <span className="relative grid size-5 shrink-0 place-items-center">
              <FigmaIcon id={GLYPH.badgeTop} className="absolute h-6 w-5 max-w-none" />
            </span>
            <span
              className="font-kyg text-[13px] font-bold leading-normal text-crimson-deep sm:text-[15px]"
              dangerouslySetInnerHTML={{ __html: data.badgeTop.label }}
            />
          </span>

          <span className="absolute -bottom-3 -right-3 inline-flex items-center gap-1.5 rounded-full bg-eden py-2 pl-2.5 pr-3.5 shadow-tst-card sm:gap-2 sm:py-2.5 sm:pl-3 sm:pr-5">
            <span className="relative grid size-5 shrink-0 place-items-center">
              <FigmaIcon id={GLYPH.badgeBottom} className="absolute h-6 w-5 max-w-none" />
            </span>
            <span
              className="font-kyg text-[13px] font-bold leading-normal text-linenw sm:text-[15px]"
              dangerouslySetInnerHTML={{ __html: data.badgeBottom.label }}
            />
          </span>
        </div>

        {/* rows (200) + 23 + body (118) + 23 + quote (156) = 520 */}
        <div className="flex flex-col gap-[23px]">
          <ul className="flex flex-col gap-4">
            {data.rows.map((r, i) => (
              <li key={r.title} className="flex items-start gap-[14px]">
                {/* 56x56, radius 16 (NOT rounded-2xl — that token is 18 here). */}
                <span className="grid size-14 shrink-0 place-items-center rounded-[16px] bg-blush">
                  <FigmaIcon id={GLYPH.rows[i] ?? GLYPH.rows[0]} className="h-[34px] w-[28px]" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-kyg text-[clamp(17px,1.5vw,21px)] font-extrabold leading-[1.248] text-mine">
                    {r.title}
                  </span>
                  <span className="font-kyg text-[clamp(14.5px,1.2vw,17px)] font-normal leading-[1.376] text-fusc">
                    {r.subtitle}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          {/* Figtree 400 18/29.2 #5b564e — four lines at 588, plus the frame's
              own 1px bottom pad (4 x 29.2 + 1 = the spec's 118). */}
          <p
            className="break-words pb-px font-kyg text-[clamp(15px,1.3vw,18px)] font-normal leading-[1.622] text-fusc"
            dangerouslySetInnerHTML={{ __html: data.bodyHtml }}
          />

          {/* r16 (rounded-2xl is 18 in this theme) #fbeef3 on a #f6dce6
              hairline, pad 25/24/24/24 -> 25 + 105 + 24 + 2 = 156 tall. The 24
              side pad eats 17% of a 280px phone column, so it drops to 20 under
              sm; the panel is unchanged from 640 up. */}
          <div
            className={`break-words rounded-[16px] border border-[#f6dce6] bg-blush px-5 pb-6 pt-6.25 font-kyg text-[clamp(18px,1.8vw,25px)] font-bold leading-[1.376] text-mine sm:px-6 ${QUOTE_RUNS}`}
            dangerouslySetInnerHTML={{ __html: data.quoteHtml }}
          />
        </div>
      </div>
    </Section>
  );
}
