import { cn } from '@/lib/utils';
import type { Ground, TestimonialSection } from '../../types';
import { Closing, ClosingRow, Cta, Section } from '../ui';

// =============================================================================
// PRICE VALUE - the pull quote, then the closing line + CTA.
// -----------------------------------------------------------------------------
// Frame: quote @[355 1419 730 278] (mark 70/28 eden, quote Cormorant 700 italic
// 40/51.2, body Figtree 400 17.5/28.4 in a 560 column); close @[112 1741 1216
// 178]. Both flush left on the rail, as every other section now is.
//
// FOUR THINGS THIS DOES THAT THE FRAME DOES NOT, because the frame's version
// does not survive contact with real copy:
//
//   ONE MEASURE      the frame runs the quote at the full 1216 rail and the body
//                    at 560 - a 2.2x difference that reads as two unrelated
//                    columns. 40px Cormorant across 1216 is also ~95 characters
//                    a line, well past the 45-75 a display serif stays readable
//                    at. Quote 980, body 680: still ragged (they are different
//                    sizes) but now recognisably one block.
//
//   A RULE BETWEEN   the closing line is set in the SAME Cormorant italic as the
//                    quote, so on the frame the customer's words and the brand's
//                    words are typographically identical and the eye cannot tell
//                    where one ends. The hairline is what separates the voice
//                    being quoted from the voice doing the selling.
//
//   <figure>         a <blockquote> with its source in a sibling <p> is not a
//                    quotation to a screen reader, it is two unrelated blocks.
//                    figure > blockquote + figcaption is, and it is what lets
//                    the attribution below be read as the source.
//
//   ATTRIBUTION      rendered ONLY when the data carries it. An unattributed
//                    testimonial is the weakest thing on a health page - and the
//                    hero's "(5 reviews)" link lands here - but a name invented
//                    to fill the slot would be a fabricated review, so the slot
//                    stays empty until someone real fills it.
// =============================================================================

/**
 * The whole quote is one Cormorant Garamond 700 italic 40/51.2 run at #222222,
 * EXCEPT "dream body": Figma's styleOverrideTable paints that run #0e4d4b (eden).
 * So this is NOT the teal gradient `.tst-em-teal` carries by default - `tst-flat`
 * switches the gradient off and the accent takes a flat eden, matching the frame.
 */
const QUOTE_RUNS = 'tst-flat [&_.tst-em-teal]:font-bold [&_.tst-em-teal]:text-eden';

export default function Testimonial({ data, ground }: { data: TestimonialSection; ground?: Ground }) {
  return (
    <Section ground={ground ?? 'cream'} id="reviews" innerClassName="pt-11">
      <figure className="flex w-full flex-col items-start pt-3">
        {/* The 70px mark sits in a 28px line box and overhangs it, as in the
            frame. `leading-[0.62]` is that 28 expressed against the type size,
            so it holds at every step of the clamp instead of only at 1440. */}
        <span
          aria-hidden
          className="font-tst text-[clamp(46px,4.86vw,70px)] font-bold italic leading-[0.62] text-eden"
        >
          &ldquo;
        </span>

        <blockquote
          className={cn(
            'mt-[18px] max-w-[980px] font-tst text-[clamp(28px,2.78vw,40px)] font-bold italic leading-[1.28] text-mine',
            QUOTE_RUNS
          )}
          dangerouslySetInnerHTML={{ __html: data.quoteHtml }}
        />

        {/* Spec line 99 is a single TEXT entry - Figtree 400 flat #5b564e across
            all four lines, tail included. The data bolds the closing clause. */}
        <p
          className="mt-[14px] max-w-[680px] font-kyg text-[clamp(15px,1.22vw,17.5px)] leading-[1.623] text-fusc"
          dangerouslySetInnerHTML={{ __html: data.bodyHtml }}
        />

        {data.attribution ? (
          <figcaption className="mt-[22px] flex items-center gap-[10px]">
            <span aria-hidden className="h-[2px] w-[28px] shrink-0 bg-eden" />
            <span className="font-kyg text-[14.5px] leading-[21px] text-fusc">
              <b className="font-semibold text-mine">{data.attribution.name}</b>
              {data.attribution.detail ? ` · ${data.attribution.detail}` : null}
            </span>
          </figcaption>
        ) : null}
      </figure>

      {/* ---- the closing line + CTA ---------------------------------------
          The hairline is the point: above it is the customer, below it is us. */}
      <ClosingRow
        className="mt-[40px] border-t border-mine/10 pt-[32px]"
        note={<Closing html={data.closingHtml} className="max-w-[760px] text-[#2d2a24]" />}
        cta={data.cta ? <Cta data={data.cta} className="tracking-[0.06px]" /> : null}
      />
    </Section>
  );
}
