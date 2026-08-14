import type { Ground, OutcomesSection } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import { Icon } from '../icons';
import { Section } from '../ui';

// =============================================================================
// PRICE VALUE - block 3 of 5: "Tonight / In a few years / Decades from now".
// -----------------------------------------------------------------------------
// One Figma frame ('PRICE VALUE' @[80 0 1280 1919], VERTICAL, gap 44) holds all
// five blocks: head + price card (Worth.tsx), these three cards, then the pull
// quote + closing CTA (Testimonial.tsx). The frame carries NO padding of its
// own, so this file opens with pt-11 (the frame's 44 gap) and closes with pb-0;
// Testimonial re-opens with the same 44. The three files are one frame -
// changing the padding on one without the other two breaks the rhythm.
//
//   grid   @[112 1042 1216 333]  HORIZONTAL, gap 24 -> three 389 columns
//   card   389 x 333, r26, #ffffff, 1px #222222@10,
//          0 4 14 rgba(20,27,26,.05) + 0 1 2 rgba(20,27,26,.04)  (= tst-soft)
//          pad 32, gap 8; content is top-aligned, so the shortest card simply
//          carries the slack as extra bottom padding (60 instead of 32).
//          badge 48 r16 #e6f4f3 -> kicker (pad-t 7) -> h3 -> body (pad-t 3)
//   rail   387 x 4 #0e4d4b pinned inside the top hairline, clipped by the radius
// =============================================================================

/** The frame's own glyphs, in column order: moon · sprout · two figures.
 *  Ids are "<y>-<x>" from the spec (section y + 10675). A fourth card would
 *  have no glyph in the frame, so it falls back to the registry icon. */
const GLYPH = ['11757-155', '11757-569', '11757-982'];

export default function Outcomes({ data, ground }: { data: OutcomesSection; ground?: Ground }) {
  return (
    <Section ground={ground ?? 'cream'} innerClassName="pb-0 pt-11">
      {/* Three across is the frame, but three 389 columns need 1216. Below lg
          they fold to two (md, ~332 each) then one; at md:grid-cols-3 the cards
          would be 213 wide and the 22px h3 would break every second word. */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.cards.map((c, i) => {
          const glyph = GLYPH[i];
          // pad 32 is the frame's, but at lg the three columns are only ~250
          // wide and 64 of padding would leave 186 for a five-line paragraph.
          // 24 until xl, where the column is back above 330.
          return (
            <article
              key={c.title}
              className="relative flex flex-col gap-2 overflow-hidden lift rounded-[26px] border border-mine/10 bg-white p-6 shadow-tst-soft xl:p-8"
            >
              {/* 387x4 @[113 1043] - sits inside the hairline, so inset-x-0 on
                  the padding box lands it exactly; the radius clips its ends. */}
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-eden" />

              {/* 48px mint tile, r16, glyph centred (27x33 in the frame).
                  16 has no token here: this project remaps the radius scale
                  (--radius 0.625rem), so rounded-2xl would paint 18px. */}
              <span className="grid size-12 shrink-0 place-items-center rounded-[16px] bg-mint">
                {glyph ? (
                  <FigmaIcon id={glyph} className="h-8.25 w-6.75 max-w-none" />
                ) : (
                  <Icon name={c.icon} className="size-5.75 text-eden" />
                )}
              </span>

              {/* Figtree 700 11.5/17.2 ls 0.12em #0e4d4b, on a 7px top pad */}
              <span className="pt-1.75 font-kyg text-[11.5px] font-bold uppercase leading-[17.2px] tracking-[0.12em] text-eden">
                {c.kicker}
              </span>

              {/* Figtree 700 22/23.8 ls -0.02em #222222 */}
              <h3 className="font-kyg text-[clamp(17px,1.53vw,22px)] font-bold leading-[1.082] tracking-[-0.02em] text-mine">
                {c.title}
              </h3>

              {/* Figtree 400 17.5/28.4 #5b564e inside the 323 column. Spec lines
                  67/79/91 are each ONE TEXT entry across 4-5 lines - the extractor
                  splits mixed-style runs, so a single entry proves a single weight.
                  The data wraps a closing sentence of every card in <b>, which
                  preflight paints at 700, hence. */}
              <p
                className="pt-0.75 font-kyg text-[clamp(15px,1.22vw,17.5px)] leading-[1.623] text-fusc"
                dangerouslySetInnerHTML={{ __html: c.bodyHtml }}
              />
            </article>
          );
        })}
      </div>
    </Section>
  );
}
