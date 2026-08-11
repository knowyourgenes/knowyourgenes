import { cn } from '@/lib/utils';
import type { Ground, ReportPreviewSection } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import { Cta, Heading, Section, TONE_PILL } from '../ui';

// =============================================================================
// REPORT — "No gene codes. No jargon."
// -----------------------------------------------------------------------------
// Frame 1440x584. Ground is a vertical gradient sage3 #eff6f5 -> linenw #faf6ef
// (the REPORT ground is the one that starts tinted and fades to cream, hence the
// className override — GROUND.sage runs the other way, linenw -> sage).
//
// Inner rail 1280 with its own 32px padding -> 1216 of content, split
// 543 | 64 | 609. Left column is 380 tall and vertically centred against the
// 400-tall card; its four blocks are spaced by a flat 16.
// =============================================================================

export default function ReportPreview({
  data,
  ground,
}: {
  data: ReportPreviewSection;
  ground?: Ground;
}) {
  const rows = data.sample.rows;

  return (
    <Section ground={ground ?? 'sage'} className="bg-gradient-to-b from-sage3 to-linenw">
      <div className="grid items-center gap-y-12 lg:grid-cols-[543fr_609fr] lg:gap-x-16">
        {/* ------------------------------------------------------ claims ---- */}
        <div className="flex flex-col gap-4">
          {/* Crimson-tinted pill: #c73c70@10 ground, @24 hairline, crimson drop.
              pad 11/22/11/17, gap 10 -> 1+11+22+11+1 = 46 tall. The glyph draws
              22x26 but only occupies a 22px optical box (it overflows the text
              band by 2px top and bottom in the frame), hence the -2px margins. */}
          {data.head.eyebrow ? (
            <span className="inline-flex w-fit items-center gap-[10px] self-start rounded-full border border-crimson/24 bg-crimson/10 py-[11px] pl-[17px] pr-[22px] shadow-tst-crimson">
              <FigmaIcon id="12798-130" className="my-[-2px] block h-[26px] w-[22px] shrink-0" />
              <span className="font-kyg text-[14px] font-extrabold uppercase leading-[21px] tracking-[0.08em] text-crimson-deep">
                {data.head.eyebrow.label}
              </span>
            </span>
          ) : null}

          {/* Figtree 700 51/55 ls -0.02em #222222 + the Cormorant italic accent. */}
          <Heading html={data.head.titleHtml} />

          {/* pad 8/0, gap 14; rows are 6px eden dot + Figtree 400 18.5/27.8 #222222.
              Every bullet is one line from lg up (that is the frame), so the dot
              stays optically centred there. Below lg the column is full-bleed and
              the longest bullet wraps to 2-3 lines, so the dot pins to the first
              line instead of floating in the middle of the block: mt-2 puts its
              centre at 11px, which is the centre of a 15px/1.5 line box. */}
          <ul className="flex flex-col gap-[14px] py-2">
            {data.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3 lg:items-center">
                <span className="mt-2 size-[6px] shrink-0 rounded-full bg-eden lg:mt-0" />
                <span
                  className="break-words font-kyg text-[clamp(15px,1.3vw,18.5px)] font-normal leading-[1.5] text-mine"
                  dangerouslySetInnerHTML={{ __html: b }}
                />
              </li>
            ))}
          </ul>

          {/* 211x60 eden pill — the frame's button is 60 tall, not the shared 58. */}
          <Cta data={data.cta} className="h-[60px] self-start py-0" />
        </div>

        {/* ----------------------------------------------- sample report ---- */}
        {/* r26 white card, 1px #222222@10, pad 40/32/32/32, two-layer float. */}
        <div className="relative rounded-[26px] border border-mine/10 bg-white px-[clamp(20px,2.3vw,32px)] pb-[clamp(20px,2.3vw,32px)] pt-[clamp(28px,2.8vw,40px)] shadow-tst-float">
          {/* 80x28 eden tag straddling the card's top edge (y -11 of the frame).
              Its 32px inset is the card's own left padding, so it tracks the same
              clamp — otherwise it drifts away from the rows once the padding
              starts shrinking (below ~1392, where 2.3vw drops under 32). */}
          <span className="absolute -top-3 left-[clamp(20px,2.3vw,32px)] whitespace-nowrap rounded-full bg-eden px-4 py-1.5 font-kyg text-[10.5px] font-bold uppercase leading-[15.8px] tracking-[0.12em] text-white">
            {data.sample.badge}
          </span>

          {/* Figtree 700 11.5/12.4 ls 0.12em #7a7a7a, 16 of space beneath. */}
          <p className="pb-4 font-kyg text-[11.5px] font-bold uppercase leading-[12.4px] tracking-[0.12em] text-boulder">
            {data.sample.title}
          </p>

          {/* Five 52.8px rows: pad 12/0, 1px #222222@10 rule between (not after). */}
          <ul className="flex flex-col">
            {rows.map((r, i) => (
              <li
                key={`${r.label}-${i}`}
                className={cn(
                  'flex items-center justify-between gap-4 py-3',
                  i < rows.length - 1 && 'border-b border-mine/10',
                )}
              >
                {/* `min-w-0` so a long label wraps inside the row instead of
                    pushing the tone pill (shrink-0) past the card's edge. */}
                <span className="min-w-0 break-words font-tst text-[clamp(16px,1.3vw,18.5px)] font-bold italic leading-[1.5] text-mine">
                  {r.label}
                </span>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-[10px] py-1 font-kyg text-[10.5px] font-bold uppercase leading-[15.8px] tracking-[0.06em]',
                    TONE_PILL[r.tone],
                  )}
                >
                  {r.value}
                </span>
              </li>
            ))}
          </ul>

          {/* No rule above the legend in the frame — just 16 of top padding.
              This TEXT node is NOT one uniform run: characterStyleOverrides
              split it. Base style = Figtree 700 #5b564e and covers only the
              three labels (Good / Average / Poor); every connector run
              (" = normal · ", " = some risk · ", " = higher risk") takes
              styleOverrideTable 3 = Figtree 400 #7a7a7a. Size 12/18 ls 0
              throughout. Hence 400/boulder on the <p> with the <b> labels
              lifted back to 700/fusc — do NOT flatten this to one bold run,
              the flattened .txt dump reports a single run and is wrong here. */}
          <p
            className="pt-4 font-kyg text-[12px] font-normal leading-[18px] text-boulder [&_b]:font-bold [&_b]:text-fusc"
            dangerouslySetInnerHTML={{ __html: data.sample.legendHtml }}
          />
        </div>
      </div>
    </Section>
  );
}
