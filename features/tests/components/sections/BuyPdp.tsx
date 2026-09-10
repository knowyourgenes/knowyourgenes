import Link from 'next/link';
import { Accordion, Stars } from '@/features/products';
import type { KitPricing } from '@/features/products/types';
import { BTN } from '@/components/shared/button-styles';
import { discountPercent, formatPaise } from '@/lib/catalog';
import { cn } from '@/lib/utils';
import type { BuyPdpSection, Ground } from '../../types';
import { PdpIcon } from '../FigmaIcon';
import { Section } from '../ui';
import BuyPdpGallery from './BuyPdpGallery';

// =============================================================================
// BUY PDP - "Women's Health Genetic Test"
// -----------------------------------------------------------------------------
// Figma `01 · Buy · PDP` @ node 727:570. The 1024 artboard is a 1440 design, so
// every measurement here is the frame's own multiplied by 1.40625.
//
//   frame    pad 14 / 40 top-bottom -> 20 / 56, gap 12.8 -> 18
//   columns  542 gallery + 40 gap + 386 buy box -> 1.4fr / 1fr with a 56px gap
//
// The rail here is 1216 where the frame's is 1360, so the buy box lands at
// 483 rather than 543. The title is set from the frame's ratio to its own
// column (28.2/386) rather than its absolute size, which is what keeps
// "Women's Health Genetic Test" on one line the way the frame draws it.
//
// TWO PLACES THIS DELIBERATELY LEAVES THE FRAME:
//
//   BUTTON HEIGHT  the frame draws 40.3 (-> 57px). Every button on this site is
//                  44px via BTN (docs/DESIGN.md §2, and the note in
//                  components/shared/button-styles.ts about the six heights
//                  that rule replaced). 44 wins; the frame does not get to
//                  reintroduce a seventh.
//
//   RADIUS         the frame's pills are 6.7 (-> 9.4px). §2 allows one radius,
//                  rounded-sm, and `pnpm design:check` enforces it.
//
// THE PRICE IS NOT IN THE CONTENT FILE. It comes from the same live Package row
// the kit section reads, so the hero and the kit panel cannot quote two
// different numbers. `data.cta.href` has already been rewritten to the kit page
// with this report pre-ticked - see features/tests/kit-link.ts.
// =============================================================================

/** Each glyph's own box, in design px - these vectors are not one size. */
const PILL_GLYPH = 15;
const TILE = 54.7;

export default function BuyPdp({
  data,
  ground,
  pricing,
}: {
  data: BuyPdpSection;
  ground?: Ground;
  pricing: KitPricing | null;
}) {
  const off = pricing ? discountPercent(pricing.price, pricing.compareAtPrice) : null;
  const soldOut = pricing !== null && !pricing.inStock;

  return (
    <Section ground={ground ?? 'cream'} innerClassName="py-[20px] pb-[56px] lg:px-8">
      {/* ---------------- breadcrumb ---------------- */}
      <nav aria-label="Breadcrumb" className="mb-[18px]">
        <ol className="flex flex-wrap items-center gap-[8px] font-kyg text-[12.5px] leading-none">
          <li className="flex items-center gap-[8px]">
            <PdpIcon name="home" width={14} height={14} />
          </li>
          {data.breadcrumb.map((c, i) => {
            const last = i === data.breadcrumb.length - 1;
            return (
              <li key={c.label} className="flex items-center gap-[8px]">
                {c.href && !last ? (
                  // -my/py grows the hit box to the 24px WCAG 2.5.8 floor
                  // without moving the label or the row's height.
                  <Link
                    href={c.href}
                    className="-my-[6px] inline-flex min-h-[24px] items-center py-[6px] text-fusc underline-offset-2 hover:underline"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span className={last ? 'font-semibold text-heavy' : 'text-fusc'}>{c.label}</span>
                )}
                {!last && (
                  <span aria-hidden className="text-boulder">
                    ›
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-[40px] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-[56px]">
        <BuyPdpGallery gallery={data.gallery} title={data.title} />

        {/* ---------------- buy box ---------------- */}
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-[12.2px]">
            {data.pills.map((p) => (
              <span
                key={p.label}
                className="inline-flex items-center gap-[8px] rounded-sm border border-sea/[0.28] bg-gin py-[9.8px] pl-[15.5px] pr-[18.3px] font-kyg text-[14px] font-medium leading-none text-greenpea"
              >
                <PdpIcon name={p.glyph} width={PILL_GLYPH} height={PILL_GLYPH} />
                {p.label}
              </span>
            ))}
          </div>

          <h1 className="mt-[19.7px] font-kyg text-[30px] font-extrabold leading-[1.14] tracking-[-0.021em] text-heavy sm:text-[33px] lg:text-[35px]">
            {data.title}
          </h1>

          <div className="mt-[12.7px] flex flex-wrap items-center gap-[9.8px]">
            <Stars count={5} className="text-[18px]" />
            <b className="font-kyg text-[16px] font-bold text-heavy">{data.rating.value.toFixed(2)}</b>
            <Link
              href={data.rating.href}
              className="font-kyg text-[16px] font-medium text-eden underline underline-offset-2"
            >
              ({data.rating.count} reviews)
            </Link>
          </div>

          {pricing && (
            <div className="mt-[22.5px] flex flex-wrap items-center gap-[15.5px]">
              <span className="font-kyg text-[35.9px] font-extrabold leading-none tracking-[-0.02em] text-heavy">
                {formatPaise(pricing.price)}
              </span>
              {pricing.compareAtPrice && (
                <span className="font-kyg text-[18.8px] font-medium text-boulder line-through">
                  {formatPaise(pricing.compareAtPrice)}
                </span>
              )}
              {off !== null && (
                <span className="rounded-sm border border-sea/[0.28] bg-gin px-[14px] py-[7.7px] font-kyg text-[14px] font-bold leading-none text-greenpea">
                  {off}% off
                </span>
              )}
            </div>
          )}

          <p className="mt-[9.8px] font-kyg text-[14px] leading-none text-boulder">{data.taxNote}</p>

          <p className="mt-[15.5px] font-kyg text-[16px] leading-[25.5px] text-fusc">{data.blurb}</p>

          {/* four feature tiles */}
          <ul className="mt-[33px] grid list-none grid-cols-2 gap-[16px] min-[420px]:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {data.features.map((f) => (
              <li key={f.lines.join(' ')} className="flex flex-col items-center gap-[9.1px]">
                <PdpIcon name={f.tile} width={TILE} height={TILE} />
                <span className="text-center font-kyg text-[14px] font-medium leading-[19.7px] text-heavy">
                  {f.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>

          {/* CTAs - 44px via BTN, see the header note */}
          <div className="mt-[19.7px] flex flex-col gap-[11.4px] min-[380px]:flex-row">
            <Link
              href={data.cta.href}
              className={cn(
                BTN,
                'flex-1 border-2 border-eden/85 bg-white font-kyg text-[16px] font-bold text-eden transition-colors hover:bg-gin'
              )}
            >
              <PdpIcon name="cart" width={20.5} height={20.5} />
              {data.cta.addToCart}
            </Link>
            {soldOut ? (
              <span
                className={cn(BTN, 'flex-1 cursor-not-allowed bg-mine/20 font-kyg text-[16px] font-bold text-white')}
              >
                Out of stock
              </span>
            ) : (
              <Link
                href={data.cta.href}
                className={cn(
                  BTN,
                  'flex-1 bg-eden font-kyg text-[16px] font-bold text-white transition-colors hover:bg-eden2'
                )}
              >
                {data.cta.buyNow}
                <PdpIcon name="arrow" width={18.3} height={18.3} />
              </Link>
            )}
          </div>

          <div className="mt-[20.8px] h-px w-full bg-heavy/10" />

          <div className="mt-[16.9px] flex items-center">
            {data.assurances.map((a, i) => (
              <div key={a.lines.join(' ')} className="flex flex-1 items-center justify-center gap-[12.7px]">
                {i > 0 && <span aria-hidden className="mr-[12.7px] h-[42px] w-px bg-heavy/[0.12]" />}
                <PdpIcon name={a.glyph} width={21.7} height={21.7} className="shrink-0" />
                <span className="font-kyg text-[13.5px] font-medium leading-[18.3px] text-fusc">
                  {a.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>

          {/* ---------------- accordions ---------------- */}
          <div className="mt-[12px]">
            <Accordion
              title={data.included.title}
              defaultOpen
              toggle="chevron"
              titleClassName="text-[13.5px] tracking-[0.06em]"
            >
              <div className="flex flex-col gap-[10px] pt-[12px]">
                {data.included.items.map((it) => (
                  <div key={it.name} className="rounded-sm border border-heavy/10 bg-white px-[16px] py-[14px]">
                    <div className="mb-[3.9px] flex items-center justify-between gap-[12px]">
                      <span className="font-kyg text-[14.5px] font-extrabold text-heavy">{it.name}</span>
                      <span className="shrink-0 rounded-sm border border-sea/[0.28] bg-gin px-[10px] py-[3px] font-kyg text-[11px] font-bold leading-none text-greenpea">
                        {it.genes}
                      </span>
                    </div>
                    <p className="font-kyg text-[12.9px] leading-[20.7px] text-fusc">
                      <span className="font-semibold text-heavy">{it.question}</span> {it.answer}
                    </p>
                  </div>
                ))}
              </div>
            </Accordion>

            {data.specs.map((s) => (
              <Accordion
                key={s.title}
                title={s.title}
                toggle="chevron"
                titleClassName="text-[13.5px] tracking-[0.06em]"
              >
                <p className="font-kyg text-[12.9px] leading-[20.7px] text-fusc">{s.body}</p>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
