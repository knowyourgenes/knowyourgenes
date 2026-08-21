'use client';

// =============================================================================
// features/search - /search, the results page
// -----------------------------------------------------------------------------
// One client island over a server-supplied catalogue. Every product and every
// price arrives from the server (see server/search.queries.ts); nothing here
// fetches, so filtering and sorting are synchronous and there is no spinner to
// design around.
//
// ALL STATE LIVES IN THE URL. A filtered result set is a thing people send each
// other and come back to, and back/forward has to undo a filter rather than
// leave the page. `router.replace(..., { scroll: false })` keeps the grid still
// while the query string changes.
//
// FACETS HIDE THEMSELVES WHEN THEY CANNOT NARROW. A checkbox list where every
// option selects everything is worse than no list - it implies a choice the
// catalogue cannot honour. Today that means the category facet is hidden (every
// active Package is WELLNESS) and it will appear on its own the day a second
// category ships. Same rule for stock and offers.
// =============================================================================

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { normalizeSearchText, searchProducts } from '@/lib/categoriesdata';
import { formatPaise } from '@/lib/catalog';
import { cn } from '@/lib/utils';
import { CardArt } from '@/features/tests/components/CategoryCardArt';
import { SIZE_BUCKETS, SORT_OPTIONS, type SearchProduct, type SortKey } from '../types';

const CARD_SIZES = '(min-width: 1180px) 300px, (min-width: 760px) 33vw, (min-width: 560px) 50vw, 100vw';

/** Price inputs and the slider work in whole rupees; the data is paise. */
const toRupees = (paise: number) => Math.round(paise / 100);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.6-3.6" />
  </svg>
);

// Both range thumbs sit on top of each other, so the tracks must not swallow
// clicks meant for the thumb underneath - hence pointer-events off on the input
// and back on for the thumb itself.
const RANGE_INPUT =
  'pointer-events-none absolute inset-x-0 top-1/2 m-0 h-0 w-full -translate-y-1/2 appearance-none bg-transparent ' +
  'focus:outline-none ' +
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] ' +
  '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 ' +
  '[&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-eden [&::-webkit-slider-thumb]:shadow-kyg-card ' +
  '[&::-webkit-slider-thumb]:cursor-grab ' +
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:w-[18px] ' +
  '[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 ' +
  '[&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-eden [&::-moz-range-thumb]:cursor-grab';

/** A facet heading with a Reset that only appears once the facet is doing something. */
function FacetHead({ title, active, onReset }: { title: string; active: boolean; onReset: () => void }) {
  return (
    <div className="mb-[10px] flex items-baseline justify-between border-b border-zeus/[0.1] pb-[8px]">
      <h2 className="text-[14.5px] font-bold text-mine">{title}</h2>
      {active && (
        <button type="button" onClick={onReset} className="text-[12.5px] text-cord underline hover:text-eden">
          Reset
        </button>
      )}
    </div>
  );
}

function CheckRow({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-[10px] rounded-sm px-[4px] py-[6px] text-[14px] text-cape transition hover:bg-eden/[0.05]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-[15px] w-[15px] shrink-0 cursor-pointer accent-eden"
      />
      <span className={cn('min-w-0 flex-1 truncate', checked && 'font-semibold text-eden')}>{label}</span>
      <span className="shrink-0 text-[12px] text-cord tabular-nums">({count})</span>
    </label>
  );
}

export function SearchResultsView({ catalog }: { catalog: SearchProduct[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // ---- URL state ----------------------------------------------------------
  const q = params.get('q') ?? '';
  const sort = (params.get('sort') as SortKey | null) ?? 'relevance';
  const selectedCats = useMemo(() => new Set((params.get('cat') ?? '').split(',').filter(Boolean)), [params]);
  const selectedSizes = useMemo(() => new Set((params.get('size') ?? '').split(',').filter(Boolean)), [params]);
  const onlyStock = params.get('stock') === '1';
  const onlyOffer = params.get('offer') === '1';

  // The text field is local so typing does not push a history entry per
  // keystroke; the URL catches up on submit (or on the debounce-free blur).
  const [draft, setDraft] = useState(q);

  const setParams = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === '') next.delete(k);
        else next.set(k, v);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router]
  );

  const toggleIn = (set: Set<string>, key: string, value: string) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setParams({ [key]: [...next].join(',') });
  };

  // ---- the text-matched set, before any facet ----------------------------
  // Facet counts are computed against THIS, not against the fully filtered
  // results: a count that already had the other facets applied would drop to
  // zero on every option you have not picked, which reads as "no results" when
  // it means "not with your current selection".
  const matched = useMemo(() => {
    if (!q.trim()) return catalog;
    const bySearch = new Set(searchProducts(catalog, q).map((p) => p.href));
    // searchProducts covers name/meta/blurb/keywords. Category name is not in
    // that haystack, so "wellness" as a query would miss - fold it in here.
    const nq = normalizeSearchText(q.trim());
    return catalog.filter((p) => bySearch.has(p.href) || normalizeSearchText(p.categoryName).includes(nq));
  }, [catalog, q]);

  // ---- price bounds, from the whole catalogue -----------------------------
  const priced = catalog.map((p) => p.price).filter((v): v is number => v !== null);
  const floorRs = priced.length ? toRupees(Math.min(...priced)) : 0;
  const ceilRs = priced.length ? toRupees(Math.max(...priced)) : 0;
  const minRs = Number(params.get('min') ?? floorRs);
  const maxRs = Number(params.get('max') ?? ceilRs);
  const priceActive = minRs > floorRs || maxRs < ceilRs;
  const priceUsable = ceilRs > floorRs;

  // ---- facet options, each with its count ---------------------------------
  const catOptions = useMemo(() => {
    const counts = new Map<string, { label: string; count: number }>();
    for (const p of matched) {
      const e = counts.get(p.categorySlug) ?? { label: p.categoryName, count: 0 };
      e.count += 1;
      counts.set(p.categorySlug, e);
    }
    return [...counts.entries()].map(([value, e]) => ({ value, ...e }));
  }, [matched]);

  const sizeOptions = useMemo(
    () =>
      SIZE_BUCKETS.map((b) => ({
        ...b,
        count: matched.filter(
          (p) => p.biomarkerCount !== null && p.biomarkerCount >= b.min && p.biomarkerCount <= b.max
        ).length,
      })).filter((b) => b.count > 0),
    [matched]
  );

  const stockCount = matched.filter((p) => p.inStock).length;
  const offerCount = matched.filter(
    (p) => p.compareAtPrice !== null && p.price !== null && p.compareAtPrice > p.price
  ).length;

  // A facet earns its space only if it can actually narrow the set.
  const showCat = catOptions.length > 1;
  const showSize = sizeOptions.length > 1;
  const showStock = stockCount > 0 && stockCount < matched.length;
  const showOffer = offerCount > 0 && offerCount < matched.length;
  const showMoreFilters = showSize || showStock || showOffer;

  // ---- apply the facets ---------------------------------------------------
  const results = useMemo(() => {
    let out = matched;
    if (selectedCats.size) out = out.filter((p) => selectedCats.has(p.categorySlug));
    if (selectedSizes.size) {
      out = out.filter((p) =>
        SIZE_BUCKETS.some(
          (b) =>
            selectedSizes.has(b.value) &&
            p.biomarkerCount !== null &&
            p.biomarkerCount >= b.min &&
            p.biomarkerCount <= b.max
        )
      );
    }
    if (priceActive) {
      // An unpriced row has no price to compare, so a price filter excludes it
      // rather than silently keeping it in a range it was never measured for.
      out = out.filter((p) => p.price !== null && toRupees(p.price) >= minRs && toRupees(p.price) <= maxRs);
    }
    if (onlyStock) out = out.filter((p) => p.inStock);
    if (onlyOffer) out = out.filter((p) => p.compareAtPrice !== null && p.price !== null && p.compareAtPrice > p.price);

    const sorted = [...out];
    // Unpriced rows sort last in both price directions - they are not "free",
    // and they are not "most expensive" either.
    const byPrice = (dir: 1 | -1) => (a: SearchProduct, b: SearchProduct) => {
      if (a.price === null) return 1;
      if (b.price === null) return -1;
      return (a.price - b.price) * dir;
    };
    if (sort === 'price-asc') sorted.sort(byPrice(1));
    else if (sort === 'price-desc') sorted.sort(byPrice(-1));
    else if (sort === 'name-asc') sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [matched, selectedCats, selectedSizes, priceActive, minRs, maxRs, onlyStock, onlyOffer, sort]);

  const anyFilter = selectedCats.size > 0 || selectedSizes.size > 0 || priceActive || onlyStock || onlyOffer;

  const resetAll = () =>
    setParams({ cat: null, size: null, min: null, max: null, stock: null, offer: null, sort: null });

  const loPct = priceUsable ? ((minRs - floorRs) / (ceilRs - floorRs)) * 100 : 0;
  const hiPct = priceUsable ? ((maxRs - floorRs) / (ceilRs - floorRs)) * 100 : 100;

  return (
    <div className="mx-auto w-full max-w-[1600px] px-[var(--gutter,clamp(18px,3vw,40px))] py-[42px]">
      {/* ---- title + query ------------------------------------------------ */}
      <div className="mx-auto max-w-[720px] text-center">
        <h1 className="text-[30px] font-bold tracking-[-0.02em] text-mine sm:text-[34px]">Search results</h1>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            setParams({ q: draft.trim() || null });
          }}
          className="relative mt-[18px]"
        >
          <label htmlFor="search-page-q" className="sr-only">
            Search DNA tests by health concern
          </label>
          <SearchIcon className="pointer-events-none absolute left-[16px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-cord" />
          <input
            id="search-page-q"
            type="search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => setParams({ q: draft.trim() || null })}
            placeholder="Search a concern - hair fall, PCOS, sleep…"
            autoComplete="off"
            className="h-[48px] w-full rounded-sm border border-zeus/[0.1] bg-white pl-[46px] pr-[16px] text-[15px] text-mine shadow-kyg-card outline-none transition focus:border-eden/40 focus:ring-2 focus:ring-eden/15 [&::-webkit-search-cancel-button]:appearance-none"
          />
        </form>
      </div>

      <div className="mt-[34px] grid gap-[34px] min-[900px]:grid-cols-[236px_minmax(0,1fr)]">
        {/* ---- filter rail ------------------------------------------------- */}
        <aside aria-label="Filters" className="flex flex-col gap-[26px]">
          {anyFilter && (
            <button
              type="button"
              onClick={resetAll}
              className="self-start rounded-sm border border-zeus/[0.12] bg-white px-[14px] py-[7px] text-[13px] font-semibold text-cape transition hover:border-eden/40 hover:text-eden"
            >
              Clear all filters
            </button>
          )}

          {showCat && (
            <section>
              <FacetHead title="Product type" active={selectedCats.size > 0} onReset={() => setParams({ cat: null })} />
              {catOptions.map((o) => (
                <CheckRow
                  key={o.value}
                  checked={selectedCats.has(o.value)}
                  onChange={() => toggleIn(selectedCats, 'cat', o.value)}
                  label={o.label}
                  count={o.count}
                />
              ))}
            </section>
          )}

          {priceUsable && (
            <section>
              <FacetHead title="Price" active={priceActive} onReset={() => setParams({ min: null, max: null })} />
              <div className="relative mt-[14px] h-[20px]">
                <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-sm bg-zeus/[0.12]" />
                <div
                  className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-sm bg-eden"
                  style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
                />
                <input
                  type="range"
                  aria-label="Minimum price"
                  min={floorRs}
                  max={ceilRs}
                  value={minRs}
                  onChange={(e) => setParams({ min: String(Math.min(Number(e.target.value), maxRs)) })}
                  className={RANGE_INPUT}
                />
                <input
                  type="range"
                  aria-label="Maximum price"
                  min={floorRs}
                  max={ceilRs}
                  value={maxRs}
                  onChange={(e) => setParams({ max: String(Math.max(Number(e.target.value), minRs)) })}
                  className={RANGE_INPUT}
                />
              </div>
              <p className="mt-[10px] text-[13px] text-cord tabular-nums">
                {formatPaise(minRs * 100)} – {formatPaise(maxRs * 100)}
              </p>
            </section>
          )}

          {showMoreFilters && (
            <section>
              <FacetHead
                title="More filters"
                active={selectedSizes.size > 0 || onlyStock || onlyOffer}
                onReset={() => setParams({ size: null, stock: null, offer: null })}
              />
              {showSize &&
                sizeOptions.map((b) => (
                  <CheckRow
                    key={b.value}
                    checked={selectedSizes.has(b.value)}
                    onChange={() => toggleIn(selectedSizes, 'size', b.value)}
                    label={b.label}
                    count={b.count}
                  />
                ))}
              {showOffer && (
                <CheckRow
                  checked={onlyOffer}
                  onChange={() => setParams({ offer: onlyOffer ? null : '1' })}
                  label="Reduced today"
                  count={offerCount}
                />
              )}
              {showStock && (
                <CheckRow
                  checked={onlyStock}
                  onChange={() => setParams({ stock: onlyStock ? null : '1' })}
                  label="In stock"
                  count={stockCount}
                />
              )}
            </section>
          )}
        </aside>

        {/* ---- results ----------------------------------------------------- */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-[12px]">
            <label className="flex items-center gap-[8px] text-[13px] font-semibold uppercase tracking-[0.12em] text-cord">
              Sort by
              <select
                value={sort}
                onChange={(e) => setParams({ sort: e.target.value === 'relevance' ? null : e.target.value })}
                className="rounded-sm border border-zeus/[0.12] bg-white px-[12px] py-[8px] text-[13.5px] font-medium normal-case tracking-normal text-mine outline-none transition focus:border-eden/40"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <p className="text-[13.5px] text-cord">
              {results.length} {results.length === 1 ? 'result' : 'results'}
              {q.trim() && (
                <>
                  {' '}
                  found for <span className="font-semibold text-cape">“{q.trim()}”</span>
                </>
              )}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="mt-[40px] rounded-sm border border-zeus/[0.1] bg-white/60 px-[24px] py-[48px] text-center">
              <p className="text-[16px] font-semibold text-mine">No tests match that</p>
              <p className="mx-auto mt-[8px] max-w-[420px] text-[14px] text-cord">
                {anyFilter
                  ? 'Try widening the filters, or clear them to see everything that matches your search.'
                  : 'Try a concern instead of a product name - “hair fall”, “PCOS”, “snoring”, “uric acid”.'}
              </p>
              {anyFilter && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="mt-[18px] rounded-sm bg-eden px-[18px] py-[10px] text-[13.5px] font-semibold text-white transition hover:bg-eden2"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <ul className="mt-[20px] grid gap-[22px] min-[560px]:grid-cols-2 min-[1180px]:grid-cols-3">
              {results.map((p) => {
                const reduced = p.compareAtPrice !== null && p.price !== null && p.compareAtPrice > p.price;
                return (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      className="group flex h-full flex-col overflow-hidden rounded-sm border border-zeus/[0.08] bg-white shadow-kyg-card transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_18px_44px_-22px_rgba(5,36,34,0.4)]"
                    >
                      <CardArt
                        image={p.image}
                        icon={p.icon}
                        tone={p.tone}
                        sizes={CARD_SIZES}
                        className="aspect-[4/3] w-full overflow-hidden"
                      />
                      <div className="flex flex-1 flex-col p-[16px]">
                        <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-cord">
                          {p.categoryName}
                        </div>
                        <div className="mt-[6px] text-[16px] font-semibold leading-[1.25] text-mine">{p.name}</div>
                        {p.meta && <div className="mt-[4px] text-[12.5px] text-cord">{p.meta}</div>}
                        <p className="mt-[8px] line-clamp-2 text-[13px] leading-[1.5] text-cape/85">{p.blurb}</p>

                        <div className="mt-auto flex items-baseline gap-[8px] pt-[14px]">
                          {p.price === null ? (
                            // No active Package row. Unpriced, not free.
                            <span className="text-[13.5px] text-cord">Price on request</span>
                          ) : (
                            <>
                              {reduced && (
                                <span className="text-[13px] text-cord line-through tabular-nums">
                                  {formatPaise(p.compareAtPrice!)}
                                </span>
                              )}
                              <span className="text-[17px] font-bold text-eden tabular-nums">
                                {formatPaise(p.price)}
                              </span>
                            </>
                          )}
                          {!p.inStock && p.price !== null && (
                            <span className="ml-auto text-[12px] font-semibold text-cord">Out of stock</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResultsView;
