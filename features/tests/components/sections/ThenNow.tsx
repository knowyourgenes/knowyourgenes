import { cn } from '@/lib/utils';
import type { Ground, ThenNowSection } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import { Closing, Cta, Section } from '../ui';

// =============================================================================
// STAR TREATMENT - bottom half ("then vs now - colour contrast")
// -----------------------------------------------------------------------------
// The Figma frame 'STAR TREATMENT' (1440x1738, #ffffff@70, 1px #222222@10) holds
// BOTH <Aspiration/> and this section. Its rail is 1280 with 32 of its own pad
// -> 1216 content, stacked with a 48 gap:
//
//   92 pad -> head (173) -> 48 -> editorial row (735) -> 48 -> THEN/NOW (326)
//          -> 48 -> closing + CTA (174) -> 92 pad
//
// <Aspiration/> owns the top pad and stops flush (`pb-0`); this component
// re-opens with `pt-[56px]` (the 48 gap + the row frame's own 8 top pad) and
// carries the 92 bottom pad. The frame's hairline is split the same way:
// border-t there, border-b here.
//
//   row      1216 HORIZONTAL, gap 24 -> two 596-wide cards, both 318 tall
//   then     r26 #faf6ef + 1px #222222@10, pad 36, gap 8
//   now      r26 #0e4d4b (no stroke), pad 36/36/38/36, gap 8, + a 208 blurred
//            #2ac3a2@15 blob pinned -64/-64 into the top-right corner
//   closing  Cormorant 700 italic 30/45 #2d2a24 over 660, then a 24 gap and the
//            186x60 primary CTA -> 90 + 24 + 60 = the frame's 174 exactly
//
// Glyph ids are "<pageY>-<x>" and this frame starts at page y=2361, so the spec
// line '@[x=163 y=1153]' resolves to id "3514-163".
// =============================================================================

const GLYPH = {
  /** 27x33 padlock, #7a7a7a - centred in the 56 badge. */
  then: '3514-163',
  /** 20x24 slots holding a 12x2 #7a7a7a dash. */
  thenItems: ['3649-149', '3685-149', '3721-149'],
  /** 27x33 delivery van, #2ac3a2. */
  now: '3513-783',
  /** 20x24 slots holding a 17x17 #2ac3a2 check. */
  nowItems: ['3648-769', '3684-769', '3720-769'],
} as const;

/**
 * Figtree 700 12.5/18.8 ls 1.5 (0.12em), UPPERCASE. The extractor reports the
 * authored string ("How it used to be"), not Figma's textCase, so case has to
 * be read off the measured width: every hugging label in this design that runs
 * at >=0.08em tracking measures as caps (e.g. 'Ready when you are' in
 * order-kit is 159px wide - 154 as caps, 137 as title case). Every other
 * 0.12em micro-kicker in features/tests is uppercase for the same reason.
 */
const KICKER = 'block font-kyg text-[12.5px] font-bold uppercase leading-[1.504] tracking-[0.12em]';
/** Figtree 700 23/24.8 ls -0.46 (-0.02em). */
const TITLE = 'font-kyg text-[clamp(19px,1.6vw,23px)] font-bold leading-[1.078] tracking-[-0.02em]';
/** Figtree 400 17.5/24. */
const ITEM = 'font-kyg text-[clamp(15px,1.22vw,17.5px)] font-normal leading-[1.371]';

/**
 * Before/after pair. The "then" card is a muted linen panel with dash bullets;
 * the "now" card is an eden panel with check bullets - the colour carries the
 * argument, so the copy does not have to.
 */
export default function ThenNow({ data, ground }: { data: ThenNowSection; ground?: Ground }) {
  return (
    <Section ground={ground ?? 'ivory'} className="border-b border-mine/10" innerClassName="pt-[56px]">
      <div className="flex flex-col gap-12">
        {/* The pair is the argument, so they go side by side as soon as they
            fit: at md each card is (688 - 24)/2 = 332 with 24 of pad, which
            still holds the 12.5px kicker (157) and two-line items comfortably.
            Under md they stack, then/now in reading order. */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* ------------------------------------------------------- then ---- */}
          <div className="flex flex-col gap-2 rounded-[26px] border border-mine/10 bg-linenw p-6 lg:p-9">
            {/* 56x56, radius 16 - rounded-2xl is 18 in this theme, so spell it. */}
            <span className="grid size-14 shrink-0 place-items-center rounded-[16px] bg-mine/6">
              <FigmaIcon id={GLYPH.then} className="h-8.25 w-6.75" />
            </span>

            {/* the kicker frame carries 11 of its own top pad on top of the gap */}
            <div className="pb-px pt-2.75">
              <span className={cn(KICKER, 'text-boulder')}>{data.then.kicker}</span>
            </div>

            <h3 className={cn(TITLE, 'text-mine')}>{data.then.title}</h3>

            <ul className="flex flex-col gap-3 pt-3">
              {data.then.items.map((it, i) => (
                <li key={i} className="flex items-start gap-3">
                  <FigmaIcon id={GLYPH.thenItems[i] ?? GLYPH.thenItems[0]} className="-mt-0.5 h-6 w-5 shrink-0" />
                  {/* min-w-0: a flex item's automatic minimum is its
                      min-content width, so without this a long token would
                      widen the card past its track instead of wrapping. */}
                  <span
                    className={cn(ITEM, 'min-w-0 break-words text-fusc')}
                    dangerouslySetInnerHTML={{ __html: it }}
                  />
                </li>
              ))}
            </ul>

            {data.then.footerHtml ? (
              <p
                className="mt-5 border-t border-mine/10 pt-4 font-kyg text-[15px] font-bold leading-snug text-mojo"
                dangerouslySetInnerHTML={{ __html: data.then.footerHtml }}
              />
            ) : null}
          </div>

          {/* -------------------------------------------------------- now ---- */}
          <div className="relative overflow-hidden rounded-[26px] bg-eden p-6 lg:p-9 lg:pb-9.5">
            {/* 208 circle, #2ac3a2@15, hangs 64 past the top and right edges.
                Figma LAYER_BLUR 40 -> CSS blur(20px): Figma's radius is ~2x the
                gaussian sigma CSS takes, the same halving used for the body
                map's ground shadow. `blur-2xl` would paint it at 40. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-java2/15 blur-[20px]"
            />

            <div className="relative flex flex-col gap-2">
              {/* the frame gives this badge a 16 radius but NO fill - the glyph
                  sits straight on the eden ground. */}
              <span className="grid size-14 shrink-0 place-items-center rounded-[16px]">
                <FigmaIcon id={GLYPH.now} className="h-8.25 w-6.75" />
              </span>

              <div className="pb-px pt-2.75">
                <span className={cn(KICKER, 'text-java2')}>{data.now.kicker}</span>
              </div>

              <h3 className={cn(TITLE, 'text-linenw')}>{data.now.title}</h3>

              <ul className="flex flex-col gap-3 pt-3">
                {data.now.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <FigmaIcon id={GLYPH.nowItems[i] ?? GLYPH.nowItems[0]} className="-mt-0.5 h-6 w-5 shrink-0" />
                    {/* plain runs sit at 85%; the frame paints the <b> run at
                        full #faf6ef, Figtree 700. */}
                    <span
                      className={cn(ITEM, 'min-w-0 break-words text-linenw/85 [&_b]:font-bold [&_b]:text-linenw')}
                      dangerouslySetInnerHTML={{ __html: it }}
                    />
                  </li>
                ))}
              </ul>

              {data.now.footerHtml ? (
                <p
                  className="mt-5 border-t border-white/15 pt-4 font-kyg text-[15px] font-bold leading-snug text-java2"
                  dangerouslySetInnerHTML={{ __html: data.now.footerHtml }}
                />
              ) : null}
            </div>
          </div>
        </div>

        {/* ------------------------------------------- closing line + CTA ---- */}
        {/* The closing copy ships a hard <br> that balances the two lines at
            the 660 rail. Below lg the line is nowhere near 660, so that break
            just strands "envelope, for everyone." on its own line - suppress it
            and let the measure do the breaking. Restored at lg, so >=1440 is
            byte-identical. */}
        <div className="flex flex-col items-center">
          <Closing html={data.closingHtml} className="mb-6 max-w-165 text-[#2d2a24] [&_br]:hidden lg:[&_br]:inline" />
          {data.cta ? <Cta data={data.cta} className="h-15 py-0 tracking-[0.06px]" /> : null}
        </div>
      </div>
    </Section>
  );
}
