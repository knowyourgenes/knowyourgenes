import Link from 'next/link';
import { BTN } from '@/components/shared/button-styles';
import { cn } from '@/lib/utils';
import { discountPercent, formatPaise } from '@/lib/catalog';
import type { KitPricing } from '@/features/products/types';
import type { Ground, KitSection } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import { Heading, Section } from '../ui';

// =============================================================================
// ORDER KIT - "Everything you need, in one box."
// -----------------------------------------------------------------------------
// Frame @[0 0 1440 788] pad 92/80, ground #ffffff@70, 1px #222222@10 hairline
// (the 2px of border is why 92 + 602 + 92 comes to 788).
// Rail 1280 (pad 32) -> 1216 content, VERTICAL gap 48, centred:
//
//   head   680 x 176, gap 16 - crimson eyebrow pill (46) + H2 (114)
//   card   920 x 377 @[260 317], r28, #ffffff, 1px #222222@10, two-layer shadow
//          -> 918 of inner width split as a 528 / 390 grid, no gutter
//
//   left   528 x 375, pad 40/40/59/40, gap 6, 1px #222222@10 on its RIGHT edge
//          (the frame's own arithmetic proves it: text x=301..748 is 447 wide,
//          40 + 447 + 40 = 527, and the cell is 528 - the spare pixel is the
//          seam hairline where the #faf6ef panel starts at x=789)
//          kicker 12/18 ls .12em -> h3 26/28 -> ul (pad-top 18, gap 14)
//          each li: 22x26 glyph + 12 gap + 17.5/24 copy, glyph overhangs 2 up
//   right  390 x 375, #faf6ef, pad 40. Not auto-laid-out in the frame, so the
//          spacing is margins: kicker (mb 16) / 17/32.3 lines (mb 24) /
//          310x69 CTA pill (pad 20/44, gap 10) / note (mt 20).
//          The note's copy column is 250 wide inside a 281 slot -> pr 31.
//
// Every CTA on the page points at #kit, so this section carries that anchor.
// =============================================================================

/**
 * The #9a2855 -> #c73c70 ramp itself is NOT re-declared here: `.tst-em`
 * (globals.css, @layer components) already carries it with background-clip:text.
 *
 * The one thing left to say is that the frame holds "in one" and "box." as TWO
 * separately-filled runs (spec lines 11-12), each ramping across its own width.
 * A single inline box would slice one ramp across both fragments, so the accent
 * needs `box-decoration-break: clone` to restart it per line.
 */
const EM_PER_LINE = '[&_.tst-em]:[-webkit-box-decoration-break:clone] [&_.tst-em]:[box-decoration-break:clone]';

/** Component 2 @ x=301, one per row of the contents list (y 432/494/532/570/608). */
const CHECK_ICONS = ['15264-301', '15326-301', '15364-301', '15402-301', '15440-301'];

/** Both kickers: Figtree 700 12/18, ls 1.44 (.12em), #9a2855, upper case. */
const KICKER = 'font-kyg text-[12px] font-bold uppercase leading-[1.5] tracking-[0.12em] text-crimson-deep';

/** 40px on the artboard; 2.78vw hits 40.03 at 1440 so the clamp pins it there. */
const PAD = 'px-[clamp(22px,2.78vw,40px)]';

/**
 * "Everything you need, in one box." - contents list beside the order panel.
 *
 * This is the page's HAND-OFF, not its checkout. Every CTA on a test page is
 * authored as `#kit`; TestPageView rewrites all of them (this panel's own button
 * included) to /pr/genetic-testing-kit?select=<slug>, where the report is
 * pre-ticked and the customer can add others to the same kit before ordering.
 * Before that, the button pointed at `#kit` too - it scrolled to itself.
 *
 * The price shown here is this one report; the kit adds nothing on its own.
 * `pricing` is null when the test has no active Package row, and the panel then
 * shows the CTA without a number rather than implying it is free.
 */
export default function Kit({
  data,
  ground,
  pricing,
}: {
  data: KitSection;
  ground?: Ground;
  pricing: KitPricing | null;
}) {
  const { eyebrow, titleHtml } = data.head;
  const cta = data.order.cta;
  const off = pricing ? discountPercent(pricing.price, pricing.compareAtPrice) : null;

  /** Shared with the fallback link so both render identically. */
  const CTA_CLASS =
    BTN +
    ' group w-full border border-eden bg-eden font-kyg text-[18px] font-extrabold tracking-[0.004em] text-white shadow-tst-cta transition duration-200 hover:-translate-y-px hover:bg-eden2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-java sm:';

  return (
    <Section ground={ground ?? 'ivory'} id="kit" className="border-y border-mine/10">
      <div className="flex flex-col items-center gap-12">
        {/* ---- head: 680 column, eyebrow + H2, gap 16 --------------------- */}
        <div className="flex w-full max-w-170 flex-col items-center gap-4 text-center">
          {eyebrow ? (
            /* Tinted crimson pill (#c73c70@10 on #c73c70@24), not the white
               eyebrow in ui.tsx: pad 11/22/11/17, gap 10, 0 6 18 crimson@10. */
            <span className="inline-flex items-center gap-2.5 rounded-sm border border-crimson/24 bg-crimson/10 py-2.75 pl-4.25 pr-5.5 shadow-tst-crimson">
              {/* 22px slot; the glyph is 22x26 and overhangs 2px either side */}
              <FigmaIcon id="14935-541" className="-my-0.5 block h-6.5 w-5.5 shrink-0" />
              {/* 321 wide at 1440 against ~209 of usable pill at 320: min-w-0 lets
                  it wrap inside the pill instead of widening it past the gutter. */}
              <span className="min-w-0 break-words font-kyg text-[14px] font-extrabold uppercase leading-5.25 tracking-[0.08em] text-crimson-deep">
                {eyebrow.label}
              </span>
            </span>
          ) : null}

          <Heading html={titleHtml} className={cn('w-full break-words', EM_PER_LINE)} />
        </div>

        {/* ---- the 920 card: 528 contents / 390 order --------------------- */}
        <div className="grid w-full max-w-230 overflow-hidden rounded-sm border border-mine/10 bg-white shadow-tst-card lg:grid-cols-[minmax(0,528fr)_minmax(0,390fr)]">
          {/* ---- contents ------------------------------------------------ */}
          {/* border-r is the frame's seam hairline, and it is what makes the
              inner measure 447: 528 - 1 - 40 - 40. Only once the grid splits. */}
          <div
            className={cn(
              // The 59 of bottom padding is the frame balancing the seam against
              // the order panel; once the two cells stack it is just a lopsided
              // gap, so below lg the cell pads symmetrically.
              'flex flex-col gap-1.5 pt-[clamp(22px,2.78vw,40px)] pb-[clamp(22px,2.78vw,40px)] lg:border-r lg:border-mine/10 lg:pb-[clamp(28px,4.1vw,59px)]',
              PAD
            )}
          >
            <span className={KICKER}>{data.contents.kicker}</span>

            <h3 className="break-words font-kyg text-[clamp(21px,1.85vw,26px)] font-extrabold leading-[1.077] tracking-[-0.02em] text-mine">
              {data.contents.title}
            </h3>

            {/* pad-top 18 on top of the 6 gap -> 24 under the h3 */}
            <ul className="flex flex-col gap-3.5 pt-4.5">
              {data.contents.items.map((it, i) => (
                <li key={i} className="flex items-start gap-3">
                  <FigmaIcon id={CHECK_ICONS[i] ?? '15364-301'} className="-mt-0.5 block h-6.5 w-5.5 shrink-0" />
                  <span
                    className="min-w-0 break-words font-kyg text-[clamp(15px,1.22vw,17.5px)] leading-[1.371] text-[#2d2a24]"
                    dangerouslySetInnerHTML={{ __html: it }}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* ---- order --------------------------------------------------- */}
          <div className={cn('flex flex-col bg-linenw py-[clamp(22px,2.78vw,40px)] text-center', PAD)}>
            <span className={cn(KICKER, 'mb-4')}>{data.order.kicker}</span>

            {/* 17/32.3 - the frame runs this at 1.9 leading, not the usual 1.5.
                All three lines are ONE uniform Figtree 400 run in the frame
                (spec line 51 is a single TEXT node; the extractor splits a node
                the moment its runs differ in style, as it does for the h2). The
                data still wraps "2 to 3 days" / "5 minutes" / "3 weeks" in <b>,
                so preflight's font-weight:bolder is knocked back to 400 here. */}
            <div className="mb-6">
              {data.order.lines.map((l, i) => (
                <p
                  key={i}
                  className="break-words font-kyg text-[clamp(15px,1.2vw,17px)] leading-[1.9] text-fusc"
                  dangerouslySetInnerHTML={{ __html: l }}
                />
              ))}
            </div>

            {/* 310x69 primary pill - wider and taller than the ui.tsx default
                (pad 20/44 vs 16/34, label 18/27 vs 16/24), and it carries the
                frame's own arrow glyph rather than the shared lucide one.

                The 44 of side padding is the one value that cannot survive 320:
                the order panel is 236 of inner width there, 88 of it would be
                padding, and "Order My Kit" + arrow is already 140 - one word
                longer and the pill overflows. So px-11 starts at sm. The 20 of
                vertical pad stays (a 67px tap target) as does everything else. */}
            {/* price - sits directly above the button so the number and the
                commitment are read together */}
            {pricing && (
              <div className="mb-5 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
                <span className="font-kyg text-[clamp(28px,2.4vw,34px)] font-extrabold leading-none tracking-[-0.02em] text-mine">
                  {formatPaise(pricing.price)}
                </span>
                {pricing.compareAtPrice && (
                  <span className="font-kyg text-[17px] font-semibold text-fusc line-through">
                    {formatPaise(pricing.compareAtPrice)}
                  </span>
                )}
                {off !== null && (
                  <span className="rounded-sm bg-eden/10 px-2.5 py-1 font-kyg text-[12.5px] font-bold text-eden">
                    {off}% off
                  </span>
                )}
              </div>
            )}

            {pricing && !pricing.inStock ? (
              <span className={cn(CTA_CLASS, 'cursor-not-allowed border-mine/15 bg-mine/20 hover:translate-y-0')}>
                Out of stock
              </span>
            ) : (
              // `cta.href` has already been rewritten to the kit page with this
              // report pre-ticked - see features/tests/kit-link.ts.
              <Link href={cta.href} className={CTA_CLASS}>
                {cta.label}
                <FigmaIcon
                  id="15367-1034"
                  className="-my-0.5 block h-6 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>
            )}

            {pricing && (
              <p className="mt-3 font-kyg text-[12.5px] leading-[1.5] text-fusc">
                Add other reports to the same kit on the next step - one sample covers them all.
              </p>
            )}

            {/* reassurance note: 19x23 shield + 12.5/17.2, left-aligned */}
            <div className="mt-5 flex items-start gap-2.5 text-left">
              <FigmaIcon id="15432-829" className="-mt-0.5 block h-5.75 w-4.75 shrink-0" />
              <span
                className="min-w-0 break-words font-kyg text-[12.5px] leading-[1.376] text-fusc sm:pr-7.75"
                dangerouslySetInnerHTML={{ __html: data.order.noteHtml }}
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
