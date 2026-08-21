import { cn } from '@/lib/utils';
import type { Ground, StepsSection } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import { Icon } from '../icons';
import { Cta, Heading, Section } from '../ui';

// =============================================================================
// HOW IT WORKS - 1440 frame, section y 13269, height 912.
// -----------------------------------------------------------------------------
// Frame        pad 92/80, ground #ffffff@0.7, 1px #222222@0.1 hairline (border-y).
// Inner rail   1280 + 32 side padding -> 1216 content, three blocks, gap 48.
// Head         680 column, gap 14: teal eyebrow pill / H2 / 18px lead.
// Grid         5 x 227 cards, gap 20, 8px top pad; a 3px gradient rail runs
//              behind them at y 428 (badge baseline), inset 10% each side.
// Card         227 x 298, r26, #faf6ef, 1px #222222@0.1, 28px padding.
//              badge 36 -> 20 -> icon slot 70 -> 11 -> title 22 -> 8 -> body.
// CTA          230 x 69 pill (pad 20/44, gap 10) + 16px gap + 16/24 note.
//
// The H2 accent is the frame's 5-stop teal gradient; that already lives on
// `.tst-em-teal` in globals.css, so the heading takes no gradient class here.
//
// The five step glyphs (frame ids 13722-200/447/694/941/1188) were NOT captured
// by the icon extractor - figma-icons.json only holds this section's eyebrow
// (13372-642) and CTA arrow (14002-770). Until they exist the registry glyph
// stands in, sized so its ink matches the frame's vectors (39x43, 34x43, 47x34,
// 30x41, 43x43 inside a 52x62 msym box).
// =============================================================================

/** Connector rail: #222222@5 -> transparent -> java -> eden -> java -> transparent -> #222222@5. */
const RAIL_GRADIENT =
  'linear-gradient(90deg, rgba(34,34,34,0.05) 0%, rgba(34,34,34,0) 16.67%, #25b5ab 33.33%, #0e4d4b 50%, #25b5ab 66.67%, rgba(37,181,171,0) 83.33%, rgba(34,34,34,0.05) 100%)';

export default function Steps({ data, ground }: { data: StepsSection; ground?: Ground }) {
  const { eyebrow, titleHtml, leadHtml } = data.head;

  return (
    <Section ground={ground ?? 'ivory'} id="how-it-works-steps" className="border-y border-mine/10">
      {/* ---- head: 680 column, 14px gaps ---------------------------------- */}
      <div className="mx-auto flex max-w-[680px] flex-col items-center gap-3.5 text-center">
        {eyebrow ? (
          <span className="inline-flex items-center gap-2.5 rounded-sm border border-eden/15 bg-eden/[0.07] py-[11px] pl-[17px] pr-[22px] shadow-tst-crimson">
            {/* 22x22 slot; the glyph itself is 22x26 and overhangs by 2px, as in the frame */}
            <FigmaIcon id="13372-642" className="-my-0.5 block h-[26px] w-[22px] shrink-0" />
            <span className="font-kyg text-[14px] font-extrabold uppercase leading-[21px] tracking-[0.08em] text-eden">
              {eyebrow.label}
            </span>
          </span>
        ) : null}

        {/* Figtree 700 51/55 ls -0.02em #222222; the serif run is .tst-em-teal. */}
        <Heading html={titleHtml} />

        {leadHtml ? (
          <p
            className="font-kyg text-[clamp(15px,1.25vw,18px)] leading-[1.5] text-fusc"
            dangerouslySetInnerHTML={{ __html: leadHtml }}
          />
        ) : null}
      </div>

      {/* ---- the five cards -----------------------------------------------
          The frame's row of five only works once each card can hold the 169px
          text column it was drawn around. At xl the track is 195px (139 of
          copy) and at 1440 it is the frame's 227; at lg it would be 144 (88 of
          copy), which shreds every body line into three or four words. So the
          five-across kicks in at xl and the smaller widths step down 3 / 2 / 1.
          The 28px card padding is untouched - the rail's top-[72px] is measured
          off it (8 grid pad + 28 card pad + 36 badge). */}
      <div className="relative mt-[clamp(28px,3.4vw,48px)] grid gap-5 pt-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {/* Rail sits at the badge baseline, behind the opaque cards. It only
            reads as a connector when the steps are a single row, so it is tied
            to the five-across layout rather than to lg. */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-[10%] right-[10%] top-[72px] hidden h-[3px] rounded-sm xl:block"
          style={{
            backgroundImage: RAIL_GRADIENT,
            boxShadow: '0 0 12px 0 rgba(37,181,171,0.28)',
          }}
        />

        {data.steps.map((s, i) => {
          const crimson = s.accent === 'crimson';
          return (
            <div
              key={s.title}
              className="relative flex flex-col items-center rounded-sm border border-mine/10 bg-linenw p-7 text-center"
            >
              <span
                className={cn(
                  'grid size-9 shrink-0 place-items-center rounded-sm font-kyg text-[13.5px] font-bold leading-[20.2px] text-white',
                  crimson ? 'bg-crimson' : 'bg-eden'
                )}
              >
                {i + 1}
              </span>

              {/* 169 x 70 slot, glyph centred; frame ink averages ~39x41 */}
              <span className="mt-5 flex h-[70px] w-full items-center justify-center">
                <Icon name={s.icon} className={cn('size-[48px]', crimson ? 'text-crimson' : 'text-eden')} />
              </span>

              {/* break-words: the xl track is only 139px of copy, so a long
                  step title would otherwise push out of the card. No effect on
                  the frame's copy, which fits on one line at 1440. */}
              <h3 className="mt-[11px] break-words pb-px font-kyg text-[clamp(17px,1.32vw,19px)] font-bold leading-[20.5px] tracking-[-0.02em] text-mine">
                {s.title}
              </h3>

              <p
                className="mt-2 break-words font-kyg text-[15px] leading-[24.4px] text-fusc"
                dangerouslySetInnerHTML={{ __html: s.bodyHtml }}
              />
            </div>
          );
        })}
      </div>

      {/* ---- closing CTA --------------------------------------------------- */}
      {data.cta ? (
        <div className="mt-[clamp(28px,3.4vw,48px)] flex flex-col items-center text-center">
          <Cta data={data.cta} className="text-[18px] leading-[27px] tracking-[0.004em]" />
          {data.ctaNoteHtml ? (
            <p
              className="mt-4 font-kyg text-[16px] leading-6 text-fusc"
              dangerouslySetInnerHTML={{ __html: data.ctaNoteHtml }}
            />
          ) : null}
        </div>
      ) : null}
    </Section>
  );
}
