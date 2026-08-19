'use client';

// =============================================================================
// features/tests — the product grid on /categories/[category_slug], with search
// -----------------------------------------------------------------------------
// Split out of Categories.tsx as the one client island on the page: the header
// above it stays a server component.
//
// The search box matches CONCERNS, not titles - `keywords` in lib/categoriesdata
// carries "hair fall", "snoring", "uric acid" and friends, because nobody
// arrives here typing "Men's Wellness DNA". That is what makes an input worth
// its pixels at nine products; a name-only filter would not be.
//
// Below ~6 products the input is hidden entirely - a filter over five cards that
// are all already on screen is pure friction.
// =============================================================================

import Link from 'next/link';
import { useId, useState } from 'react';
import { searchProducts, type CategoryProduct } from '@/lib/categoriesdata';
import { CardArt } from './CategoryCardArt';
import { Arrow, Icon } from './icons';

const SEARCH_MIN_PRODUCTS = 6;

/** Quick fills. Each one is chosen to land on a different test. */
const SUGGESTIONS = ['hair fall', 'PCOS', 'snoring', 'skin', 'uric acid', 'ancestry'];

const CARD_SIZES = '(min-width: 1120px) 360px, (min-width: 760px) 33vw, (min-width: 560px) 50vw, 100vw';

const cardHover = 'transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_18px_44px_-22px_rgba(5,36,34,0.4)]';

export function CategoryTestGrid({ products }: { products: CategoryProduct[] }) {
  const [query, setQuery] = useState('');
  const inputId = useId();

  const trimmed = query.trim();
  const results = searchProducts(products, trimmed);
  const filtering = trimmed.length > 0;

  return (
    <>
      {products.length >= SEARCH_MIN_PRODUCTS && (
        <search className="mt-8">
          <label htmlFor={inputId} className="sr-only">
            Search reports by health concern
          </label>
          <div className="relative max-w-[440px]">
            <Icon
              name="search"
              className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-cord"
            />
            <input
              id={inputId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a concern — hair fall, PCOS, sleep…"
              autoComplete="off"
              className="h-12 w-full rounded-full border border-zeus/[0.12] bg-white pl-11 pr-11 text-[15px] text-mine shadow-kyg-card outline-none placeholder:text-cord/80 focus:border-eden/40 focus:ring-2 focus:ring-eden/15 [&::-webkit-search-cancel-button]:appearance-none"
            />
            {filtering && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-cord transition hover:bg-zeus/[0.06] hover:text-mine"
              >
                <Icon name="x" className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[12.5px] font-semibold text-cord">Popular</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                aria-pressed={trimmed.toLowerCase() === s.toLowerCase()}
                className="rounded-full border border-zeus/[0.1] bg-white/70 px-3 py-1 text-[12.5px] text-cape transition hover:border-eden/35 hover:text-eden aria-pressed:border-eden/45 aria-pressed:bg-eden/[0.07] aria-pressed:font-semibold aria-pressed:text-eden"
              >
                {s}
              </button>
            ))}
          </div>
        </search>
      )}

      {/* Permanently mounted so screen readers announce the change, not the node. */}
      <p aria-live="polite" className="mt-4 min-h-[20px] text-[13.5px] text-cord">
        {filtering ? `Showing ${results.length} of ${products.length} reports` : ''}
      </p>

      {results.length > 0 ? (
        <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[18px]">
          {results.map((p) => {
            return (
              // Browsing only - no price and no buy button here. Ordering happens
              // on the kit page, where reports are ticked onto one saliva kit, so
              // a card that could add straight to a cart would bypass the step
              // where the customer sees what they are actually buying.
              <article
                key={p.slug}
                className={`group relative flex flex-col overflow-hidden rounded-[20px] border border-zeus/[0.09] bg-white shadow-kyg-card ${cardHover}`}
              >
                <CardArt
                  image={p.image}
                  icon={p.icon}
                  tone={p.tone}
                  sizes={CARD_SIZES}
                  className="aspect-[16/10] w-full"
                />
                <div className="flex flex-1 flex-col gap-2.5 p-6">
                  <div className="flex items-start justify-between gap-2.5">
                    <h3 className="text-[19px] font-semibold tracking-[-0.02em]">
                      <Link href={p.href} className="after:absolute after:inset-0 after:content-['']">
                        {p.name}
                      </Link>
                    </h3>
                    {p.meta && (
                      <span className="mt-0.5 whitespace-nowrap rounded-full bg-eden/[0.07] px-2.5 py-1 text-[11.5px] font-bold text-eden">
                        {p.meta}
                      </span>
                    )}
                  </div>
                  <span className="text-sm leading-[1.55] text-cape">{p.blurb}</span>

                  <span className="mt-auto inline-flex items-center gap-[7px] pt-3 text-[13.5px] font-bold text-eden">
                    View report <Arrow className="h-[15px] w-[15px]" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 flex flex-col items-center gap-3 rounded-[20px] border border-dashed border-zeus/[0.14] bg-white/60 px-6 py-14 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-eden/[0.07] text-eden">
            <Icon name="search" className="h-[22px] w-[22px]" />
          </span>
          <p className="text-[17px] font-semibold tracking-[-0.01em]">No reports match &ldquo;{trimmed}&rdquo;</p>
          <p className="max-w-[380px] text-[14.5px] leading-[1.55] text-cape">
            Try the symptom rather than the test — &ldquo;hair fall&rdquo;, &ldquo;snoring&rdquo; or &ldquo;kidney
            stones&rdquo; all find their report.
          </p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="mt-1 rounded-full bg-eden px-5 py-2.5 text-[13.5px] font-bold text-spring transition hover:bg-eden2"
          >
            Show all {products.length} reports
          </button>
        </div>
      )}
    </>
  );
}
