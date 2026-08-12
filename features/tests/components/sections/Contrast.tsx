import { cn } from '@/lib/utils';
import type { ContrastSection, Ground } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import { Closing, Cta, Heading, Media, Section } from '../ui';

// =============================================================================
// VALUE — "Take one test now. Stay in control for life."
// -----------------------------------------------------------------------------
// Frame @[0 0 1440 1187] pad 92/80, fill #ffffff@70, 1px #222222@10 hairline.
// Rail 1280 (pad 32) -> 1216 content, vertical gap 48 between head / grid / close.
// Two 596x600 outcome cards, radius 28, gap 24.
// =============================================================================

/** Per-column styling, read straight off the frame (see spec lines 14 / 62). */
const TONE = {
  negative: {
    /** Component 2 @[x=136 y=337] — frowning face, #c0432f. */
    badgeIcon: '9734-136',
    /** Component 2 @[x=145 y=609] — cross, #c0432f. */
    itemIcon: '10006-145',
    card: 'border-mine/10 bg-white shadow-tst-soft',
    body: '',
    label: 'text-mojo',
    itemText: 'text-fusc',
  },
  positive: {
    /** Component 2 @[x=756 y=337] — smiling face, #2e7d5b. */
    badgeIcon: '9734-756',
    /** Component 2 @[x=765 y=609] — upward check, #2e7d5b. */
    itemIcon: '10006-765',
    card: 'border-sea/40 bg-transparent shadow-tst-card',
    body: 'bg-gradient-to-b from-[rgba(46,125,91,0.06)] to-white',
    label: 'text-sea',
    itemText: 'text-[#2d2a24]',
  },
} as const;

/**
 * The heading's serif accent already ships its 5-stop teal ramp
 * (#0e4d4b -> #15605d -> #25b5ab -> #15605d -> #0e4d4b) from `.tst-em-teal` in
 * globals.css, so the gradient is NOT restated here.
 *
 * The one thing the global rule cannot know is that Figma paints "Stay in" and
 * "control for life." as two separately-filled runs — i.e. the ramp restarts on
 * each line box. `box-decoration-clone` is what re-runs it per fragment.
 */
const EM_CLONE = '[&_.tst-em-teal]:box-decoration-clone';

/** "She never tested" vs "She tested early" — two illustrated outcome columns. */
export default function Contrast({ data, ground }: { data: ContrastSection; ground?: Ground }) {
  const cols = [
    { ...data.negative, tone: 'negative' as const },
    { ...data.positive, tone: 'positive' as const },
  ];
  const eyebrow = data.head.eyebrow;

  return (
    <Section ground={ground ?? 'ivory'} className="border-y border-mine/10">
      <div className="flex flex-col items-center gap-12">
        {/* head — 680 wide, gap 16, centred ------------------------------- */}
        <div className="flex w-full max-w-170 flex-col items-center gap-4 text-center">
          {/* `min-h` not `h`: the frame's 46px already clears the 26px glyph, so
              this renders identically at >=1440 — but a label forced to wrap in a
              280px column now grows the pill instead of spilling out of it. */}
          {eyebrow ? (
            <span className="inline-flex min-h-11.5 max-w-full items-center gap-2.5 rounded-full border border-eden/15 bg-eden/[0.07] pl-4.25 pr-5.5 shadow-tst-crimson">
              <FigmaIcon id="9500-623" className="h-6.5 w-5.5 shrink-0" />
              <span className="font-kyg text-[14px] font-extrabold uppercase leading-5.25 tracking-[0.08em] text-eden">
                {eyebrow.label}
              </span>
            </span>
          ) : null}

          <Heading html={data.head.titleHtml} className={cn('max-w-170', EM_CLONE)} />
        </div>

        {/* the two outcome cards — 596 each, gap 24 ----------------------- */}
        <div className="grid w-full gap-6 lg:grid-cols-2">
          {cols.map((col) => {
            const t = TONE[col.tone];
            return (
              <article key={col.kicker} className={cn('flex flex-col overflow-hidden rounded-[28px] border', t.card)}>
                {/* image slot 594x188 + floating status pill.
                    `sizes` tracks the real rendered width: 594 once the 1280 rail
                    caps out, ~42vw while the two columns share a narrower rail,
                    then the full gutter-less column once the grid stacks — so a
                    phone is not served the 594px desktop crop. */}
                <div className="relative">
                  <Media
                    img={col.image}
                    className="aspect-594/188 w-full"
                    sizes="(min-width: 1440px) 594px, (min-width: 1024px) 42vw, (min-width: 640px) calc(100vw - 80px), calc(100vw - 40px)"
                  />
                  {/* min-h + max-w keep the badge inside the 278px-wide mobile
                      image slot if a longer label ever has to wrap; at 594 both
                      are inert. */}
                  <span className="absolute left-3.5 top-3.5 inline-flex min-h-8.25 max-w-[calc(100%-28px)] items-center gap-1.5 rounded-full border border-mine/10 bg-white/95 pl-2 pr-3.5 shadow-tst-soft">
                    <FigmaIcon id={t.badgeIcon} className="h-5.75 w-4.75 shrink-0" />
                    <span
                      className={cn(
                        'font-kyg text-[11.5px] font-bold uppercase leading-[17.2px] tracking-[0.08em]',
                        t.label
                      )}
                      dangerouslySetInnerHTML={{ __html: col.badge.label }}
                    />
                  </span>
                </div>

                {/* body — pad 32, kicker (mb 6) / h3 (mb 20) / list gap 14 */}
                <div className={cn('flex flex-1 flex-col p-6 lg:p-8', t.body)}>
                  <span
                    className={cn(
                      'mb-1.5 wrap-break-word font-kyg text-[13.5px] font-bold uppercase leading-[20.2px] tracking-[0.12em]',
                      t.label
                    )}
                  >
                    {col.kicker}
                  </span>

                  <h3 className="mb-5 wrap-break-word font-kyg text-[clamp(19px,1.67vw,24px)] font-extrabold leading-[1.08] tracking-[-0.02em] text-mine">
                    {col.title}
                  </h3>

                  <ul className="flex flex-col gap-3.5">
                    {col.items.map((it, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <FigmaIcon id={t.itemIcon} className="-mt-0.5 h-6 w-5 shrink-0" />
                        {/* `min-w-0` + wrap: a flex item's automatic minimum size
                            is its longest word, so without these a stray long
                            token widens the li past the 198px text column a
                            320px phone leaves for it. Inert at 530px. */}
                        <span
                          className={cn(
                            'min-w-0 wrap-break-word font-kyg text-[clamp(15px,1.22vw,17.5px)] leading-[1.371]',
                            t.itemText
                          )}
                          dangerouslySetInnerHTML={{ __html: it }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        {/* closing serif line (mb 24) + primary CTA ----------------------- */}
        <div className="flex w-full flex-col items-center">
          <Closing html={data.closingHtml} className="mb-6 text-[#2d2a24]" />
          {/* min-h-15, not h-15: the frame's 60px pill holds a 24px label line, so
              this is the same 60px at >=1440 while surviving a bumped-up default
              font size instead of clipping the label. */}
          {data.cta ? <Cta data={data.cta} className="min-h-15 py-0 tracking-[0.06px]" /> : null}
          {data.ctaNoteHtml ? (
            <p
              className="pt-3.5 text-center font-kyg text-[14.5px] leading-snug text-fusc"
              dangerouslySetInnerHTML={{ __html: data.ctaNoteHtml }}
            />
          ) : null}
        </div>
      </div>
    </Section>
  );
}
