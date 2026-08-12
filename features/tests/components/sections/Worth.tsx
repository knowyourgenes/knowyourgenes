import { cn } from '@/lib/utils';
import type { Ground, WorthSection } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import { Heading, Media, Section } from '../ui';

// =============================================================================
// PRICE VALUE — "The cost of knowing is small."
// -----------------------------------------------------------------------------
// Frame 'PRICE VALUE' @[80 0 1280 1919], pad 0/32/0/32 -> 1216 content column,
// VERTICAL with gap 44 between FIVE stacked blocks:
//   1  head            720 wide, gap 13            <- this file
//   2  price card      1216x589, r28               <- this file
//   3  outcome cards   1216x333                    <- Outcomes.tsx
//   4  pull quote      730x278                     <- Testimonial.tsx
//   5  closing + CTA   1216x178                    <- Testimonial.tsx
//
// The frame carries NO vertical padding of its own, so this section keeps the
// page's top rhythm and drops its bottom padding; Outcomes and Testimonial
// re-open with pt-11 (44px) to rebuild the frame's gap. The three files are one
// Figma frame — changing the padding on one without the other two breaks it.
// =============================================================================

/**
 * The frame's own glyph for each price chip, in order. Ids are "<y>-<x>" from
 * the spec, offset by the section's page y (10675): the three INSTANCE boxes sit
 * at @[178 864], @[396 864] and @[178 917]. Same shape three times, but they are
 * three separate exports, so each chip gets the one that belongs to its slot.
 */
const CHIP_GLYPH = ['11539-178', '11539-396', '11592-178'];

export default function Worth({ data, ground }: { data: WorthSection; ground?: Ground }) {
  const eyebrow = data.head.eyebrow;

  return (
    <Section ground={ground ?? 'cream'} innerClassName="pb-0">
      {/* ---- block 1: head @[360 0 720 364], VERTICAL gap 13, centred ------ */}
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-[13px] text-center">
        {eyebrow ? (
          // 283x46 pill, r999, #0e4d4b@7 on a #0e4d4b@15 hairline, crimson glow.
          // pad 11/22/11/17, gap 10. Vector @[596 10] is the piggy-bank glyph.
          // 283 is 3px MORE than the 280 a 320px phone leaves, so below sm the
          // pill trims its padding and lets the label wrap inside a min-h rather
          // than clip against a fixed 46px box. sm+ restores the frame exactly.
          <span className="inline-flex min-h-11.5 max-w-full items-center gap-2.5 rounded-full border border-eden/15 bg-eden/[0.07] py-2 pl-3 pr-3.5 shadow-tst-crimson sm:h-11.5 sm:py-0 sm:pl-4.25 sm:pr-5.5">
            <FigmaIcon id="10685-596" className="h-6.5 w-5.5 shrink-0" />
            <span className="font-kyg text-[14px] font-extrabold uppercase leading-5.25 tracking-[0.08em] text-eden">
              {eyebrow.label}
            </span>
          </span>
        ) : null}

        {/* Figtree 700 51/55 ls -0.02em #222222; the serif run is the frame's
            5-stop teal gradient, which `.tst-em-teal` already paints by default
            (globals.css @layer components) — do NOT restate it here. */}
        <Heading html={data.head.titleHtml} className="max-w-[720px]" />

        {/* Figtree 400 18.5/27.8 #5b564e — three centred lines inside 720. */}
        {data.head.leadHtml ? (
          <p
            className="max-w-[720px] font-kyg text-[clamp(15px,1.29vw,18.5px)] leading-[1.503] text-fusc"
            dangerouslySetInnerHTML={{ __html: data.head.leadHtml }}
          />
        ) : null}

        {/* 23/34.5 two-tone line: Cormorant 700 italic FLAT #2d2a24, then Figtree
            700 #0e4d4b. The serif run is flat here, not the default gradient, so
            the wrapper carries `tst-flat` to switch background-clip off before a
            plain text-* utility takes over (utilities beat @layer components). */}
        <p
          className="tst-flat max-w-[720px] font-kyg text-[clamp(18px,1.6vw,23px)] leading-[1.5] [&_.tst-em-teal]:font-bold [&_.tst-em-teal]:text-[#2d2a24] [&_.tst-strong]:text-eden"
          dangerouslySetInnerHTML={{ __html: data.emphasisHtml }}
        />
      </div>

      {/* ---- block 2: price card @[112 408 1216 589] ------------------------
          GRID, pad 4/0/0/0 (a 4px transparent band above both panels), r28,
          transparent fill on a 1px #0e4d4b@40 stroke, 0 24 60 rgba(14,77,75,.14).
          Columns 656 / 558 of the 1214 inner width.                        */}
      <div className="mt-11 grid overflow-hidden rounded-[28px] border border-eden/40 pt-1 shadow-[0_24px_60px_0_rgba(14,77,75,0.14)] lg:grid-cols-[656fr_558fr]">
        {/* left panel 656x583, pad 48, #0e4d4b@10 -> #ffffff, content centred.
            48 would eat 96 of a 280px phone column, so the pad only reaches the
            frame's value at xl. It dips back to 24 at lg on purpose: that is
            where the card splits into two columns, so the panel is NARROWER at
            lg (~431) than it was full-width at md (~688), and 48 there would
            wrap the 370px badge. Ladder: 24 · 32 · 24 · 48. */}
        <div className="flex flex-col justify-center bg-gradient-to-b from-[rgba(14,77,75,0.1)] to-white p-6 sm:p-8 lg:p-6 xl:p-12">
          {/* 370x42 eden pill, r9999, shadow-tst-soft, pad 20, gap 8; mb 24.
              370 cannot fit a narrow column, so below sm the label wraps inside
              a min-h rather than clipping out of a fixed 42px box. */}
          <div className="mb-6">
            <span className="inline-flex min-h-[42px] max-w-full items-center gap-2 rounded-full bg-eden px-5 py-2 shadow-tst-soft sm:h-[42px] sm:py-0">
              <FigmaIcon id="11146-181" className="h-[23px] w-[19px] shrink-0" />
              <span
                className="font-kyg text-[14.5px] font-extrabold uppercase leading-[21.8px] tracking-[0.06em] text-linenw"
                dangerouslySetInnerHTML={{ __html: data.price.badge.label }}
              />
            </span>
          </div>

          {/* Cormorant Garamond 600 italic 49/57.8 #222222, three lines; mb 15 */}
          <h3
            className="mb-[15px] wrap-break-word font-tst text-[clamp(30px,3.41vw,49px)] font-semibold italic leading-[1.18] text-mine"
            dangerouslySetInnerHTML={{ __html: data.price.titleHtml }}
          />

          {/* Figtree 400 17.5/28.4 #5b564e, four lines inside 560; mb 24. Spec
              line 32 is ONE TEXT entry at a single weight, but the data bolds
"only once" — keeps the run uniform. */}
          <p
            className="mb-6 font-kyg text-[clamp(15px,1.22vw,17.5px)] leading-[1.623] text-fusc"
            dangerouslySetInnerHTML={{ __html: data.price.bodyHtml }}
          />

          {/* three 42px white chips, r9999, 1px #222222@10, pad 10/16, gap 10;
              two on the first row (209 + 10 + 211 = 430 of the 560), one below */}
          <div className="flex flex-wrap gap-2.5">
            {data.price.chips.map((c, i) => {
              const glyph = CHIP_GLYPH[i] ?? CHIP_GLYPH[0];
              return (
                <span
                  key={i}
                  className="inline-flex min-h-[42px] max-w-full items-center gap-2 rounded-full border border-mine/10 bg-white px-4 py-2 sm:h-[42px] sm:py-0"
                >
                  {glyph ? <FigmaIcon id={glyph} className="h-[22px] w-[18px] shrink-0" /> : null}
                  <span
                    className={cn(
                      'font-kyg text-[13.5px] font-semibold leading-[20.2px]',
                      // the last chip is the emphasised one: #222222, not #5b564e
                      i === data.price.chips.length - 1 ? 'text-mine' : 'text-fusc'
                    )}
                    dangerouslySetInnerHTML={{ __html: c.label }}
                  />
                </span>
              );
            })}
          </div>
        </div>

        {/* right panel 558x583 — full-bleed photo, no radius of its own. The
            imgslot carries stroke #222222@10 at a mixed weight, i.e. one edge:
            the only interior edge it owns is the 769 seam against the left
            panel, so it renders as a left hairline. */}
        {/* Stacked below lg, where the grid row no longer forces a 583px height:
            a 320px band is a ~2:1 crop on a tablet, so the floor lifts to 420
            between sm and lg. At lg+ the row height wins and min-h is inert. */}
        <Media
          img={data.price.image}
          className="min-h-[320px] w-full sm:min-h-[420px] lg:min-h-[320px] lg:border-l lg:border-mine/10"
          sizes="(min-width: 1024px) 558px, (min-width: 640px) 95vw, 100vw"
        />
      </div>
    </Section>
  );
}
