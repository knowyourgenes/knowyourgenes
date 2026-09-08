'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { BTN } from '@/components/shared/button-styles';
import { Container } from '@/components/shared/Container';
import { AddToCart } from '@/features/cart/components/AddToCart';
import { Icon as KygIcon, PageMasthead, Rule, SECTION_Y, Toolbar } from '@/components/shared/kyg';
import { formatPaise } from '@/lib/catalog';
import { cn } from '@/lib/utils';
import { visibleProducts, type CategoryProduct, type TestCategory } from '@/lib/categoriesdata';
import type { KitPricing } from '@/features/products/types';
import { CardArt } from './CategoryCardArt';
import { Icon } from './icons';

// =============================================================================
// /categories/[category_slug] - Figma 343:3047 ("03 · Tests")
// -----------------------------------------------------------------------------
// The category's own hero over the category photograph, then a filterable grid
// of the reports inside it.
//
// The hero is the shared `PageMasthead` - its third caller, after /blog and
// /categories. Same 90deg cream wash, same 32.711 headline with a 1.1em cursive
// turn, same 440.89 lede. The eyebrow is the category NAME, and the headline and
// lede are its `tagline` and `blurb`, so nothing here is retyped from the frame.
//
// PRICES ARE LIVE AND MAY BE ABSENT. `pricing` comes from getCatalogPrices() in
// the server component above; a slug with no active Package is simply missing
// from the record. Three states are real and all three are handled: priced and
// reduced, priced flat, and unpriced. Nothing ever renders as free.
// =============================================================================

/** How many concern chips fit a card before the rest collapse into "+N". */
const CHIPS_SHOWN = 3;

/** The frame's placeholder band, used when a product has no photograph. */
const BAND_FALLBACK = 'linear-gradient(135deg,#DCEFEB 0%,#F1F8F6 71%)';

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'checks', label: 'Most checks' },
] as const;

/**
 * The price bands, and the one place this departs from the frame.
 *
 * The design's control reads "Sort · Most popular" and "Price · Any". There is
 * no popularity field on a product - the only popularity signal in the repo is
 * a single hard-coded `popular: slug === 'womens-health'` in the catalogue seed
 * - so "Most popular" cannot be computed and is not offered. Every option here
 * sorts or filters on something real: the live Package price, or the number of
 * authored concerns.
 */
const PRICE_BANDS = [
  { value: 'any', label: 'Any' },
  { value: 'under-8', label: 'Under ₹8,000' },
  { value: '8-12', label: '₹8,000 – ₹12,000' },
  { value: 'over-12', label: 'Over ₹12,000' },
] as const;

function inBand(band: string, paise: number | undefined) {
  if (band === 'any') return true;
  // A product with no price row cannot satisfy a price filter - it is unknown,
  // not cheap, so it drops out rather than defaulting into the lowest band.
  if (paise === undefined) return false;
  const rupees = paise / 100;
  if (band === 'under-8') return rupees < 8000;
  if (band === '8-12') return rupees >= 8000 && rupees <= 12000;
  return rupees > 12000;
}

/** One concern chip - Figma EL-3cb154f5, and its "+N" sibling EL-594ab59f. */
function Chip({ label, icon, overflow = false }: { label: string; icon?: string; overflow?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-[clamp(4.3px,0.417vw,6.7px)] rounded-sm px-[clamp(7.1px,0.694vw,11.1px)] py-[clamp(5px,0.486vw,7.8px)] ring-1 ring-inset',
        overflow ? 'bg-[#EFF6F5] text-eden ring-eden/[0.14]' : 'bg-white text-[#222222] ring-eden/[0.16]'
      )}
    >
      {icon ? (
        <Icon name={icon} className="h-[clamp(11.4px,1.111vw,17.8px)] w-[clamp(11.4px,1.111vw,17.8px)] shrink-0" />
      ) : null}
      <span className="whitespace-nowrap font-kyg text-[clamp(11px,0.868vw,13.9px)] font-semibold leading-[1.36]">
        {label}
      </span>
    </span>
  );
}

/**
 * One report card - Figma EL-232dae7d.
 *
 * NOT a whole-card link. The frame puts an "Add to cart" button in the footer,
 * and a <button> inside an <a> is invalid HTML - so the title carries a
 * stretched link across the card and the button is lifted above it on its own
 * stacking context. That is the same pattern the previous grid used.
 */
function TestCard({ product, pricing }: { product: CategoryProduct; pricing?: KitPricing }) {
  const concerns = product.concerns ?? [];
  const shown = concerns.slice(0, CHIPS_SHOWN);
  const rest = concerns.length - shown.length;

  // Strike ONLY when the compare-at is genuinely higher. A compare-at equal to
  // or below the price is bad data, and striking it would advertise a discount
  // that does not exist.
  const reduced = pricing && pricing.compareAtPrice !== null && pricing.compareAtPrice > pricing.price;

  return (
    <article className="group/card relative flex flex-col overflow-hidden rounded-sm bg-white ring-1 ring-inset ring-mine/10 shadow-[0_2.8px_9.9px_0_rgba(33,38,36,0.07)] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_14px_34px_0_rgba(20,27,26,0.11)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      {product.image ? (
        <CardArt
          image={product.image}
          icon={product.icon}
          tone={product.tone}
          sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw"
          className="h-[clamp(130px,13.889vw,222.2px)] w-full shrink-0"
        />
      ) : (
        /* The frame's own empty state: a pale ramp with the product glyph at
           32%. Two of the nine products have no photograph on purpose, so this
           has to look deliberate rather than broken. */
        <div
          className="grid h-[clamp(130px,13.889vw,222.2px)] w-full shrink-0 place-items-center"
          style={{ backgroundImage: BAND_FALLBACK }}
        >
          <Icon
            name={product.icon}
            className="h-[clamp(24px,2.361vw,37.8px)] w-[clamp(24px,2.361vw,37.8px)] text-eden/[0.32]"
          />
        </div>
      )}

      <div className="flex flex-col gap-[clamp(7.1px,0.694vw,11.1px)] px-[clamp(12px,1.389vw,22.2px)] pb-[clamp(12px,1.389vw,22.2px)] pt-[clamp(13px,1.528vw,24.4px)]">
        {product.meta ? (
          /* The frame labels this "N PARAMETERS". `meta` is rendered as authored
             instead: the numbers are identical, but the nouns are not
             interchangeable - ancestry's 10 are global regions, not parameters,
             and my-wellness is "52 traits · 4 reports", which "52 PARAMETERS"
             would silently halve. */
          <span className="inline-flex w-fit items-center rounded-sm bg-mint px-[clamp(7.1px,0.694vw,11.1px)] py-[clamp(3.6px,0.347vw,5.6px)] font-kyg text-[clamp(11px,0.903vw,14.4px)] font-bold uppercase leading-[1.5] tracking-[0.14em] text-eden">
            {product.meta}
          </span>
        ) : null}

        <h3 className="font-kyg text-[clamp(17.1px,1.667vw,26.7px)] font-bold leading-[1.208] tracking-[-0.015em] text-eden">
          <Link href={product.href} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>

        <p className="font-kyg text-[clamp(13px,0.9375vw,15px)] font-normal leading-[1.481] text-fusc">
          {product.blurb}
        </p>
      </div>

      {shown.length ? (
        <>
          <div aria-hidden="true" className="h-px w-full bg-mine/[0.08]" />
          <ul className="flex list-none flex-wrap gap-[clamp(5.7px,0.556vw,8.9px)] px-[clamp(12px,1.389vw,22.2px)] py-[clamp(10px,1.111vw,17.8px)]">
            {shown.map((c) => (
              <li key={c.label}>
                <Chip label={c.label} icon={c.icon} />
              </li>
            ))}
            {rest > 0 ? (
              <li>
                <Chip label={`+${rest}`} icon="check" overflow />
              </li>
            ) : null}
          </ul>
        </>
      ) : null}

      <div aria-hidden="true" className="h-px w-full bg-mine/[0.08]" />

      <div className="mt-auto flex flex-wrap items-center justify-between gap-[clamp(8.5px,0.833vw,13.3px)] px-[clamp(12px,1.389vw,22.2px)] pb-[clamp(12px,1.389vw,22.2px)] pt-[clamp(11px,1.25vw,20px)]">
        {pricing ? (
          <span className="flex items-baseline gap-[clamp(5.7px,0.556vw,8.9px)]">
            <span className="font-kyg text-[clamp(14.9px,1.458vw,23.3px)] font-bold leading-[1.238] tracking-[-0.01em] text-eden">
              {formatPaise(pricing.price)}
            </span>
            {reduced ? (
              <span className="font-kyg text-[clamp(12px,0.972vw,15.6px)] font-normal leading-[1.428] text-boulder line-through">
                {formatPaise(pricing.compareAtPrice as number)}
              </span>
            ) : null}
          </span>
        ) : (
          /* No active Package row. Never render a zero, and never offer a buy
             button for something with no price. */
          <span className="font-kyg text-[clamp(12px,1.007vw,16.1px)] font-medium text-boulder">Price on request</span>
        )}

        {pricing && pricing.inStock ? (
          <AddToCart
            slug={product.slug}
            name={product.name}
            className={cn(
              BTN,
              'relative z-10 shrink-0 bg-eden font-bold text-linenw',
              'transition-colors duration-300 hover:bg-eden2 motion-reduce:transition-none'
            )}
          >
            <span className="inline-flex items-center gap-[6px]">
              Add to cart
              <KygIcon name="arrow" strokeWidth={2} className="h-[15px] w-[15px]" />
            </span>
          </AddToCart>
        ) : pricing ? (
          <span
            className={cn(BTN, 'relative z-10 shrink-0 bg-mine/[0.06] font-bold text-boulder')}
            aria-label={`${product.name} is out of stock`}
          >
            Out of stock
          </span>
        ) : null}
      </div>
    </article>
  );
}

export function CategoryTestsView({
  category,
  pricing = {},
}: {
  category: TestCategory;
  /** slug -> live price. Slugs with no active Package are absent. */
  pricing?: Record<string, KitPricing>;
}) {
  const products = useMemo(() => visibleProducts(category), [category]);

  /* "Genetic health reports" + cursive "from one saliva kit." The split is
     authored on the category (`heroTurn`); if it is absent, or no longer a
     suffix of the tagline, the whole tagline renders in one voice rather than
     being cut in the wrong place. */
  const turn = category.heroTurn;
  const headline =
    turn && category.tagline.toLowerCase().endsWith(turn.replace(/\.$/, '').toLowerCase())
      ? category.tagline.slice(0, category.tagline.length - turn.replace(/\.$/, '').length).trimEnd()
      : category.tagline;
  const shownTurn = headline === category.tagline ? undefined : turn;
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<string>('featured');
  const [band, setBand] = useState<string>('any');

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();

    const matched = products.filter((p) => {
      if (!inBand(band, pricing[p.slug]?.price)) return false;
      if (!q) return true;
      // `keywords` is the whole reason searching nine products is worth it -
      // people arrive typing "hair fall" or "cant sleep", not "Men's Wellness
      // DNA". It is matched but never rendered.
      return [p.name, p.blurb, p.meta ?? '', ...(p.concerns ?? []).map((c) => c.label), ...p.keywords]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });

    const price = (p: CategoryProduct) => pricing[p.slug]?.price;
    const out = [...matched];
    if (sort === 'price-asc') out.sort((a, b) => (price(a) ?? Infinity) - (price(b) ?? Infinity));
    if (sort === 'price-desc') out.sort((a, b) => (price(b) ?? -Infinity) - (price(a) ?? -Infinity));
    if (sort === 'checks') out.sort((a, b) => (b.concerns?.length ?? 0) - (a.concerns?.length ?? 0));
    return out;
  }, [products, query, sort, band, pricing]);

  const filtering = query.trim().length > 0 || band !== 'any';

  return (
    <div className="kyg-reveals bg-linenw">
      <PageMasthead
        id="category-heading"
        eyebrow={category.name}
        headline={headline}
        turn={shownTurn}
        lede={category.blurb}
        /* The frame backs this hero with the category's OWN photograph, which is
           also the card art on /categories - the same picture on two consecutive
           screens. That is the frame's instruction, not an oversight here. */
        image={category.image?.src ?? '/categories/hero.jpg'}
      />

      <section aria-label={`${category.name} reports`} className="w-full bg-linenw">
        <Container className={SECTION_Y}>
          <Toolbar
            label="TESTS"
            query={query}
            onQuery={setQuery}
            searchPlaceholder="Search a concern"
            searchLabel="Search a concern"
            selects={[
              { label: 'Sort', value: sort, onChange: setSort, options: SORTS },
              { label: 'Price', value: band, onChange: setBand, options: PRICE_BANDS },
            ]}
          />

          <Rule className="mt-[clamp(12px,1.528vw,24.4px)]" />

          {/* Permanently mounted so a screen reader announces the count changing
              rather than a node appearing. */}
          <p aria-live="polite" className="mt-[10px] min-h-[20px] font-kyg text-[13px] text-boulder">
            {filtering ? `Showing ${shown.length} of ${products.length} reports` : ''}
          </p>

          {shown.length === 0 ? (
            <div className="mt-[clamp(20px,3vw,48px)] rounded-sm border border-dashed border-zeus/15 bg-white/60 px-6 py-[clamp(40px,6vw,96px)] text-center">
              <p className="font-kyg text-[clamp(16px,1.5vw,24px)] font-bold text-heavy">No reports match</p>
              <p className="mt-2 font-kyg text-[clamp(12px,1.146vw,18.3px)] leading-[1.6] text-fusc">
                Try a different concern, or widen the price range.
              </p>
            </div>
          ) : (
            <div className="mt-[clamp(14px,1.667vw,26.7px)] grid gap-x-[clamp(14.2px,1.389vw,22.2px)] gap-y-[clamp(17.1px,1.667vw,26.7px)] sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((p) => (
                <TestCard key={p.slug} product={p} pricing={pricing[p.slug]} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

export default CategoryTestsView;
