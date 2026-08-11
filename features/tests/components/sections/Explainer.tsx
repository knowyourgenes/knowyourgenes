import type { ExplainerSection, Ground } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import { Closing, Heading, Lead, Media, Section } from '../ui';

// =============================================================================
// Figma: "30-SECOND EXPLAINER" — 1440 x 827.
// -----------------------------------------------------------------------------
// Frame        pad 88/80, fill #ffffff@70 (= ground `ivory`), 1px #222222@10
//              hairline top + bottom.
// Inner rail   1280 wide, 32 of its own padding -> 1216 content, gap 44,
//              cross-axis centred. Three stacked blocks: head, card row, closing.
// Head         680 wide, gap 16. That 680 is load-bearing: it is what breaks the
//              H2 after "sounds" instead of after "complicated.".
// Eyebrow      h46 r999, fill #0e4d4b@7, 1px #0e4d4b@15, 0 6 18 rgba(199,60,112,.10),
//              pad 11/22/11/17, gap 10. Label Figtree 800 14/21 ls 1.12 #0e4d4b —
//              sentence case in the frame, NOT uppercased like the shared pill.
// Card row     pad-top 12, gap 24, 3 x 389 (389*3 + 24*2 = 1215 ≈ the 1216 rail).
//              The frame's `align=CENTER/` is on the PRIMARY (horizontal) axis —
//              justify, not align-items — and the three tracks already fill the
//              rail, so it needs no utility. The cards therefore STRETCH: all
//              three are 327 in the frame and must stay equal-height when a body
//              wraps to a third line below 1440.
// Card         r26, #ffffff, 1px #222222@10, pad 28, gap 23,
//              0 4 14 rgba(20,27,26,.05) + 0 1 2 rgba(20,27,26,.04) (= tst-soft).
// Image slot   331 x 190 (aspect 331/190), r20, image scaled to FILL.
// Card copy    Figtree 600 19/27.5 ls 0 #222222, centred.
// Closing      1216 wide, Cormorant Garamond 700 italic 32/48 #2d2a24, centred.
//
// BELOW 1440 (no frame; judgement): the 3 x 389 row stacks 1 -> sm:2 -> lg:3.
// It cannot go 3-up at md — at 768 three tracks are only 213 wide, which leaves
// a 177px image slot (~102 tall) and pushes the body to 5 lines. Two tracks at
// 640-1023 keep the card between 268 and 459 wide, i.e. within reach of the
// frame's 389, and 3-up resumes at lg where a track is >=250.
//
// DELIBERATELY NOT RENDERED: each imgslot in the frame also carries a centred
// placeholder overlay (34x40 glyph 8205-290/703/1116 + an 11/16.5 ls 1.32 label
// "Genes / DNA visual", "Risk visual", "Prevention visual"). That is the
// designer's scaffolding sitting ON TOP of the real IMAGE fill; there is no
// caption field on ExplainerSection.cards to carry it, and every sibling
// section (RiskCards, Worth, …) drops the same "… visual" labels. Escalated
// rather than invented.
// =============================================================================

/** "Gene testing sounds complicated. It is not." — three illustrated cards. */
export default function Explainer({ data, ground }: { data: ExplainerSection; ground?: Ground }) {
  const eyebrow = data.head.eyebrow;

  return (
    <Section
      ground={ground ?? 'ivory'}
      id="how-it-works"
      className="border-y border-mine/10"
      innerClassName="py-[clamp(52px,6.2vw,88px)]"
    >
      <div className="flex flex-col items-center gap-[clamp(30px,3.06vw,44px)]">
        {/* ---- head: eyebrow + H2, 680 wide, gap 16 ---------------------- */}
        <div className="flex w-full max-w-[680px] flex-col items-center gap-4 text-center">
          {eyebrow ? (
            <span className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-eden/15 bg-eden/7 py-[11px] pl-[17px] pr-[22px] shadow-tst-crimson">
              <span className="flex size-[22px] shrink-0 items-center justify-center">
                <FigmaIcon id="7892-592" className="h-[26px] w-[22px] max-w-none" />
              </span>
              <span className="font-kyg text-[14px] font-extrabold leading-[21px] tracking-[0.08em] text-eden">
                {eyebrow.label}
              </span>
            </span>
          ) : null}

          <Heading html={data.head.titleHtml} className="w-full" />

          {data.head.leadHtml ? <Lead html={data.head.leadHtml} className="w-full" /> : null}
        </div>

        {/* ---- three cards: pad-top 12, gap 24 ---------------------------- */}
        <div className="grid w-full grid-cols-1 items-stretch gap-6 pt-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.cards.map((c, i) => (
            <div
              key={i}
              className="flex flex-col gap-[clamp(16px,1.6vw,23px)] rounded-[26px] border border-mine/10 bg-white p-[clamp(18px,1.95vw,28px)] shadow-tst-soft"
            >
              <Media
                img={c.image}
                className="aspect-[331/190] w-full rounded-[20px]"
                sizes="(min-width:1440px) 331px, (min-width:1024px) 24vw, (min-width:640px) 42vw, 88vw"
              />
              <p
                className="text-center font-kyg text-[clamp(16px,1.33vw,19px)] font-semibold leading-[1.4474] tracking-normal text-mine"
                dangerouslySetInnerHTML={{ __html: c.bodyHtml }}
              />
            </div>
          ))}
        </div>

        {/* ---- closing serif line ---------------------------------------- */}
        <Closing
          html={data.closingHtml}
          className="w-full max-w-[1216px] text-[clamp(21px,2.24vw,32px)] leading-[1.5] text-[#2d2a24]"
        />
      </div>
    </Section>
  );
}
