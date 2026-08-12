import { cn } from '@/lib/utils';
import type { Ground, TestimonialSection } from '../../types';
import { Closing, Cta, Section } from '../ui';

// =============================================================================
// PRICE VALUE — blocks 4 and 5 of 5: the pull quote, then the closing line + CTA.
// -----------------------------------------------------------------------------
// Same frame as Worth.tsx and Outcomes.tsx ('PRICE VALUE' @[80 0 1280 1919],
// VERTICAL, gap 44, no padding of its own): Outcomes closes with pb-0, so this
// file opens with pt-11 to rebuild the frame's 44 gap and then keeps the page's
// own bottom rhythm. The two blocks inside are another 44 apart.
//
//   quote  @[355 1419 730 278]  VERTICAL pad 12/20/0/20, gap 5, centred
//          “      Cormorant 700 italic 70/28  #0e4d4b (a 28-tall line box)
//          quote  Cormorant 700 italic 40/51.2 #222222, two lines in 690
//          body   Figtree 400 17.5/28.4 #5b564e, four lines in a 560 column,
//                 on a 10px top pad
//   close  @[112 1741 1216 178]  VERTICAL pad-t 4, centred
//          serif 30/45 #2d2a24 in a 700 column, 24 below it, then the
//          186x60 primary pill (pad 17/34, gap 10, label 16/24 ls 0.06).
// =============================================================================

/**
 * The whole quote is one Cormorant Garamond 700 italic 40/51.2 run at #222222,
 * EXCEPT "dream body": Figma's styleOverrideTable paints that run #0e4d4b (eden).
 * So this is NOT the teal gradient `.tst-em-teal` carries by default — `tst-flat`
 * switches the gradient off and the accent takes a flat eden, matching the frame.
 */
const QUOTE_RUNS = 'tst-flat [&_.tst-em-teal]:font-bold [&_.tst-em-teal]:text-eden';

export default function Testimonial({ data, ground }: { data: TestimonialSection; ground?: Ground }) {
  return (
    <Section ground={ground ?? 'cream'} innerClassName="pt-11">
      {/* ---- block 4: the pull quote, 730 rail with 20 of side padding ----
          The frame's 20 sits INSIDE the 730 rail, so on a phone it stacks on top
          of Section's own px-5 and costs the 40px column twice. It only starts
          at sm, where the rail is no longer the thing setting the width. */}
      <div className="mx-auto flex w-full max-w-182.5 flex-col items-center gap-1.25 pt-3 text-center sm:px-5">
        {/* 70px glyph in a 28px line box — it overhangs its own box, as in the frame */}
        <span aria-hidden className="font-tst text-[clamp(46px,4.86vw,70px)] font-bold italic leading-7 text-eden">
          &ldquo;
        </span>

        <blockquote
          className={cn(
            'w-full font-tst text-[clamp(28px,2.78vw,40px)] font-bold italic leading-[1.28] text-mine',
            QUOTE_RUNS
          )}
          dangerouslySetInnerHTML={{ __html: data.quoteHtml }}
        />

        {/* Spec line 99 is a single TEXT entry — Figtree 400 flat #5b564e across
            all four lines, tail included. The data bolds the closing clause, so drops it back to the frame's single weight. */}
        <p
          className="max-w-140 pt-2.5 font-kyg text-[clamp(15px,1.22vw,17.5px)] leading-[1.623] text-fusc"
          dangerouslySetInnerHTML={{ __html: data.bodyHtml }}
        />
      </div>

      {/* ---- block 5: closing serif line (mb 24) + the primary pill ------- */}
      <div className="mt-11 flex flex-col items-center pt-1">
        {/* 30/45 Cormorant 700 italic #2d2a24 — 700 wide, so it breaks in two */}
        <Closing html={data.closingHtml} className="mb-6 max-w-175 text-[#2d2a24]" />

        {data.cta ? <Cta data={data.cta} className="h-15 py-0 tracking-[0.06px]" /> : null}
      </div>
    </Section>
  );
}
