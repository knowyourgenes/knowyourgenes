import type { CounsellorSection, Ground } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import { Heading, Lead, Section } from '../ui';

// =============================================================================
// DOCTOR - "Our GENEous Care expert explains it to you."
// -----------------------------------------------------------------------------
// Frame: 1280 x 468, HORIZONTAL, pad 0/32, gap 56, align CENTER/CENTER.
// Two 580px columns (580 + 56 + 580 = 1216 = the 1280 rail minus its own 32/32).
//
//   left  580 x 435, vertically centred in the 468 row (top 16)
//         · glow  rect  -16 on every side, 612 x 467, r30, java2@15 -> mint, blur 24
//         · slot  580 x 435, r26, eden@5 -> java@6, 1px #222222@10, shadow-tst-float
//         · badge 236 x 117, r20, white@95, 1px #222222@10, float shadow + bg-blur 8,
//                 overhanging the slot by 20 to the right and 20 below
//   right 580 x 468, VERTICAL, gap 16: eyebrow 46 / h2 112 / ul 148 / card 114
//
// Every colour, radius, padding and type value below is read off the frame.
// =============================================================================

export default function Counsellor({ data, ground }: { data: CounsellorSection; ground?: Ground }) {
  const eyebrow = data.head.eyebrow;

  return (
    <Section ground={ground ?? 'cream'}>
      <div className="grid items-center gap-x-14 gap-y-16 lg:grid-cols-2">
        {/* ------------------------------------------------ visual - 580x435 -- */}
        <div className="relative mx-auto w-full max-w-[580px] lg:mx-0">
          {/* The glow is pinned to the slot, not to the column, so that the badge
              dropping into flow below 640 does not drag the plate down with it. */}
          <div className="relative">
            {/* the blurred gradient plate behind the slot: 16px proud on each side */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-4 rounded-sm bg-[linear-gradient(135deg,rgba(42,195,162,0.15),#e6f4f3)] blur-[12px]"
            />

            {/* The frame ships this as an EMPTY image slot - a tinted plate with the
                design's own caduceus glyph and a caption, not a photograph. There is
                no counsellor export in the file, so it is rebuilt here 1:1. */}
            <div className="relative flex aspect-[580/435] flex-col items-center justify-center gap-[2px] overflow-hidden rounded-sm border border-mine/10 bg-[linear-gradient(135deg,rgba(14,77,75,0.05),rgba(37,181,171,0.06))] shadow-tst-float">
              <FigmaIcon id="14476-385" className="h-[40px] w-[34px]" />
              <span className="text-center font-kyg text-[11px] font-bold leading-[16.5px] tracking-[0.12em] text-eden">
                GENEous Care counsellor
              </span>
            </div>
          </div>

          {/* floating GENEous Care badge - 236x117, r20, overhang -20/-20.
              Under 640 the slot is only ~210-290 tall, so a 117-tall badge pinned
              -20/-20 lands on top of the centred caption AND its right edge runs
              flush into the 20px page gutter. Below sm it therefore drops out of
              absolute flow and sits under the slot as a plain card; from sm up it
              is byte-for-byte the frame's overhang again. */}
          <div className="static mx-auto mt-4 w-full max-w-[236px] rounded-sm border border-mine/10 bg-white/95 p-4 shadow-tst-float backdrop-blur-[4px] sm:absolute sm:-bottom-5 sm:-right-5 sm:mt-0 sm:w-[236px] sm:max-w-none">
            <div className="flex items-center gap-2.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-eden">
                <FigmaIcon id="14652-502" className="h-[25px] w-[21px]" />
              </span>
              {/* min-w-0 + break-words so a longer name/subtitle wraps inside the
                  236 card instead of pushing the round glyph off its left edge. */}
              <span className="flex min-w-0 flex-col">
                <span className="break-words font-kyg text-[15px] font-extrabold leading-[18.8px] text-mine">
                  {data.floatCard.title}
                </span>
                <span className="-mt-px break-words font-kyg text-[11.5px] font-normal leading-[17.2px] text-boulder">
                  {data.floatCard.subtitle}
                </span>
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 border-t border-mine/10 pt-3">
              <FigmaIcon id="14708-493" className="my-[-2px] h-[21px] w-[17px] shrink-0" />
              <span
                className="min-w-0 break-words font-kyg text-[12px] font-normal leading-[18px] text-fusc"
                dangerouslySetInnerHTML={{ __html: data.floatCard.noteHtml }}
              />
            </div>
          </div>
        </div>

        {/* -------------------------------------------------- copy - 580x468 -- */}
        <div className="flex w-full flex-col items-start gap-4">
          {/* eyebrow: NOT the shared white pill - eden@7 ground, eden@15 hairline,
              crimson glow, Figtree 800 14/21 ls 1.12, sentence case. */}
          {eyebrow ? (
            <span className="inline-flex items-center gap-2.5 rounded-sm border border-eden/15 bg-eden/[0.07] py-[11px] pl-[17px] pr-[22px] shadow-tst-crimson">
              <FigmaIcon id="14283-766" className="my-[-2px] h-[26px] w-[22px] shrink-0" />
              {/* the label is 366 wide at 1440 and the pill is only ~209 of usable
                  width at 320 - min-w-0 lets it wrap inside the pill rather than
                  stretching the pill past the gutter. */}
              <span className="min-w-0 break-words font-kyg text-[14px] font-extrabold leading-[21px] tracking-[0.08em] text-eden">
                {eyebrow.label}
              </span>
            </span>
          ) : null}

          {/* H2 Figtree 700 51/55 ls -0.02em #222222. The serif accent's 5-stop
              teal gradient (#0e4d4b -> #15605d -> #25b5ab -> #15605d -> #0e4d4b)
              is already carried by `.tst-em-teal`, which the data's <em> uses -
              so it is NOT re-declared here. w-full keeps the h2 at the column's
              580 so "explains it to you." breaks onto line two as in the frame. */}
          <Heading html={data.head.titleHtml} className="w-full break-words" />

          {data.head.leadHtml ? <Lead html={data.head.leadHtml} className="w-full" /> : null}

          <ul className="flex w-full flex-col gap-[14px] pt-2">
            {data.points.map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <FigmaIcon id="14469-748" className="mt-[-2px] h-[25px] w-[21px] shrink-0" />
                {/* the frame runs all three bullets at Figtree 400 - the <b> in the
                    data has no counterpart in the design, so it is neutralised.
                    18.5/27.8 => ratio 1.5027, kept as a ratio for the clamp. */}
                <span
                  className="min-w-0 break-words font-kyg text-[clamp(15.5px,1.3vw,18.5px)] font-normal leading-[1.5027] text-mine"
                  dangerouslySetInnerHTML={{ __html: p }}
                />
              </li>
            ))}
          </ul>

          {/* expert credit - inline-flex 335x114, r16, 2px #0e4d4b@25, card shadow.
              r16 must be literal: this project remaps --radius, so rounded-sm
              is 18px here, not 16. */}
          {/* max-w-full already caps w-fit at the column, so the card never pushes
              past 320 - but 28 of right padding is a lot of the ~166 left for the
              name there, so the frame's pr-7 only starts at sm. */}
          <div className="flex w-fit max-w-full items-center gap-4 rounded-sm border-2 border-eden/25 bg-white pb-4 pl-3.5 pr-5 pt-6 shadow-tst-card sm:pr-7">
            <span className="flex size-14 shrink-0 items-start justify-center rounded-sm bg-eden pt-[11px]">
              <span className="font-tst text-[22px] font-semibold italic leading-[33px] text-white">
                {data.expert.initials}
              </span>
            </span>

            {/* min-w-0: without it this column's automatic minimum size is its
                longest word, and "Dr. Varun Sharma, Ph.D" at 20/800 would hold the
                card open wider than the 280 available at 320. */}
            <div className="flex min-w-0 flex-col">
              <div className="flex items-start gap-1.5 sm:items-center">
                <FigmaIcon id="14651-836" className="my-[-2px] h-[22px] w-[18px] shrink-0" />
                <span className="min-w-0 break-words font-kyg text-[11.5px] font-bold leading-[17.2px] tracking-[0.1em] text-eden2">
                  {data.expert.reviewedByLabel}
                </span>
              </div>
              <div className="pt-1">
                <span className="break-words font-kyg text-[20px] font-extrabold leading-[25px] text-mine">
                  {data.expert.name}
                </span>
              </div>
              <div className="break-words font-kyg text-[15px] font-medium leading-[22.5px] text-fusc">
                {data.expert.role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
