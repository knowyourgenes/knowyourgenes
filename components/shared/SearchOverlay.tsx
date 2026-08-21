'use client';

// =============================================================================
// components/shared - the full-width search overlay
// -----------------------------------------------------------------------------
// Opened by the search icon in SiteHeader's right-hand cluster. Replaces the
// inline search box that briefly lived in the middle of the bar: a permanent
// input made the header two rows tall on every page to serve an action most
// visits never take, and it crowded the nav links it sat above.
//
// Three lanes, matched from one query:
//   Suggestions - the concern keywords in lib/categoriesdata (`hair fall`,
//                 `pcos`, `uric acid`). These are the phrases people actually
//                 type, so completing INTO them is more useful than ranking.
//   Products    - the same searchProducts() the category page uses.
//   Pages       - SITE_PAGES from lib/nav-data.
//
// All three resolve in memory over nine products and nine pages, so there is no
// debounce, no request and no loading state - it filters on the keystroke. If
// the catalogue grows past a few dozen this is the seam to put an /api/search
// behind; nothing outside this file would change.
//
// NO PRICES HERE, on purpose. This is the QUICK lane: it answers "is there a
// test for this?" in one keystroke, with no navigation and no request. Enter, or
// the "View all results" button, hands off to /search - the FULL lane, where
// prices, filters and sorting live, rendered by a server component that reads
// Package rows directly. Keeping money on the server side of that line is what
// features/cart requires, and it keeps this overlay a pure in-memory filter.
// =============================================================================

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CATEGORIES,
  normalizeSearchText,
  searchProducts,
  visibleProducts,
  type CategoryProduct,
} from '@/lib/categoriesdata';
import { SITE_PAGES } from '@/lib/nav-data';
import { searchHref } from '@/features/search';
import { CHROME_VARS } from '@/features/auth/server/tokens';
import { CardArt } from '@/features/tests/components/CategoryCardArt';

/** Every product that renders anywhere, flattened once at module load. */
const ALL_PRODUCTS: CategoryProduct[] = CATEGORIES.flatMap((c) => visibleProducts(c));

/** href -> owning category name, for the kicker above each result. */
const CATEGORY_BY_HREF = new Map<string, string>(
  CATEGORIES.flatMap((c) => visibleProducts(c).map((p) => [p.href, c.name] as const))
);

/** Every concern keyword in the catalogue, de-duped, for the Suggestions lane. */
const ALL_KEYWORDS: string[] = [...new Set(ALL_PRODUCTS.flatMap((p) => p.keywords))].sort();

/**
 * Shown when the box is empty. Each one is chosen to land on a different test,
 * so the blank state demonstrates the breadth of the catalogue rather than
 * six ways of reaching the same product.
 */
const POPULAR = ['hair fall', 'pcos', 'snoring', 'acne', 'uric acid', 'ancestry'];

const MAX_SUGGESTIONS = 7;
const MAX_PAGES = 5;

// The products lane is a 2-up grid of ~64px thumbs on desktop, 1-up on mobile.
const THUMB_SIZES = '64px';

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

const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

/**
 * Render a suggestion with the part the visitor already typed de-emphasised, so
 * the eye lands on what each row would ADD to the query. Mirrors how every
 * storefront autocomplete reads: you scan the completions, not the stem.
 */
function Suggestion({ text, query }: { text: string; query: string }) {
  const at = query ? normalizeSearchText(text).indexOf(normalizeSearchText(query)) : -1;
  if (at < 0) return <span className="font-semibold">{text}</span>;
  return (
    <>
      <span className="font-semibold">{text.slice(0, at)}</span>
      <span className="font-normal text-(--ink-3)">{text.slice(at, at + query.length)}</span>
      <span className="font-semibold">{text.slice(at + query.length)}</span>
    </>
  );
}

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pathname = usePathname();

  const trimmed = query.trim();
  const searching = trimmed.length > 0;

  const products = useMemo(
    () => (searching ? searchProducts(ALL_PRODUCTS, trimmed) : ALL_PRODUCTS),
    [searching, trimmed]
  );

  const suggestions = useMemo(() => {
    if (!searching) return POPULAR;
    const q = normalizeSearchText(trimmed);
    return ALL_KEYWORDS.filter((k) => normalizeSearchText(k).includes(q)).slice(0, MAX_SUGGESTIONS);
  }, [searching, trimmed]);

  const pages = useMemo(() => {
    if (!searching) return SITE_PAGES.slice(0, MAX_PAGES);
    const q = normalizeSearchText(trimmed);
    return SITE_PAGES.filter((p) => normalizeSearchText([p.label, ...p.keywords].join(' ')).includes(q)).slice(
      0,
      MAX_PAGES
    );
  }, [searching, trimmed]);

  const nothing = searching && products.length === 0 && suggestions.length === 0 && pages.length === 0;

  const close = useCallback(() => {
    setQuery('');
    onClose();
  }, [onClose]);

  /** Hand off to the full results page, where the filters are. */
  const submit = useCallback(() => {
    const href = searchHref(query);
    close();
    router.push(href);
  }, [query, close, router]);

  // Escape closes from anywhere in the overlay, including the backdrop.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  // Lock the page behind the overlay. Restores whatever `overflow` was there
  // before rather than assuming `visible` - the drawer in SiteHeader can be the
  // one that set it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Focus the field on open. This is the one thing that has to happen after
  // paint, so it is a real effect rather than a render-time adjustment.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Picking any result navigates; the overlay must not survive the trip.
  // Adjusted during render (React's "reset state when a prop changes" pattern)
  // so the panel never paints once over the page it just opened.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) close();
  }

  if (!open) return null;

  return (
    // CHROME_VARS is applied HERE, not inherited. This overlay renders as a
    // sibling of <header>, and the KYG palette (--cream, --ink-1, --r-sm, …)
    // is set inline on the header element itself - so without this every token
    // below resolves to nothing and the panel paints fully transparent over the
    // page. Same reason the mobile drawer carries its own copy.
    <div
      style={CHROME_VARS}
      className="fixed inset-0 z-[1400] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Backdrop. Sits BEHIND the panel in the same stacking context so a click
          anywhere outside the sheet closes, including the strip below it. */}
      <button
        type="button"
        aria-label="Close search"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-[rgba(20,15,10,.45)] backdrop-blur-[2px]"
      />

      <div className="relative flex max-h-full w-full flex-col overflow-hidden bg-(--cream) shadow-[0_30px_80px_rgba(45,32,18,.25)]">
        {/* ---- query row ------------------------------------------------- */}
        <div className="shrink-0 border-b border-(--ink-line) px-[var(--gutter,clamp(18px,3vw,40px))] py-[14px]">
          <div className="mx-auto flex w-full max-w-[1600px] items-center gap-[12px]">
            <div className="relative flex-1">
              <label htmlFor="site-search" className="sr-only">
                Search DNA tests by health concern
              </label>
              <SearchIcon className="pointer-events-none absolute left-[16px] top-1/2 h-[19px] w-[19px] -translate-y-1/2 text-(--ink-3)" />
              <input
                ref={inputRef}
                id="site-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' || !trimmed) return;
                  e.preventDefault();
                  submit();
                }}
                placeholder="Search a concern - hair fall, PCOS, sleep…"
                autoComplete="off"
                className="h-[52px] w-full rounded-sm border border-transparent bg-[rgba(31,26,20,.05)] pl-[48px] pr-[16px] text-[16px] text-(--ink-1) outline-none transition-[border-color,background] duration-200 ease-(--e-out) placeholder:text-(--ink-3) focus:border-(--teal)/30 focus:bg-white [&::-webkit-search-cancel-button]:appearance-none"
              />
            </div>

            {searching && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="shrink-0 rounded-sm px-[12px] py-[8px] text-[14px] font-medium text-(--ink-3) transition hover:bg-[rgba(31,26,20,.06)] hover:text-(--ink-1)"
              >
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={close}
              aria-label="Close search"
              className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-sm text-(--ink-1) transition hover:bg-[rgba(31,26,20,.06)]"
            >
              <XIcon className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        {/* ---- results ---------------------------------------------------- */}
        <div className="min-h-0 flex-1 overflow-y-auto px-[var(--gutter,clamp(18px,3vw,40px))] py-[26px]">
          <div className="mx-auto w-full max-w-[1600px]">
            {nothing ? (
              <p className="py-[40px] text-center text-[15px] text-(--ink-3)">
                Nothing matches “{trimmed}”. Try a concern like “hair fall”, “PCOS” or “sleep”.
              </p>
            ) : (
              <div className="grid gap-[36px] min-[900px]:grid-cols-[260px_minmax(0,1fr)]">
                {/* ---- left rail: suggestions + pages ---------------------- */}
                <div className="flex flex-col gap-[30px]">
                  {suggestions.length > 0 && (
                    <section>
                      <h2 className="mb-[10px] border-b border-(--ink-line) pb-[10px] text-[15px] font-bold text-(--ink-1)">
                        {searching ? 'Suggestions' : 'Popular searches'}
                      </h2>
                      <ul className="flex flex-col">
                        {suggestions.map((s) => (
                          <li key={s}>
                            <button
                              type="button"
                              onClick={() => {
                                setQuery(s);
                                inputRef.current?.focus();
                              }}
                              className="w-full rounded-sm px-[8px] py-[7px] text-left text-[14.5px] text-(--ink-1) transition hover:bg-[rgba(14,77,75,.07)] hover:text-(--teal)"
                            >
                              <Suggestion text={s} query={trimmed} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {pages.length > 0 && (
                    <section>
                      <h2 className="mb-[10px] border-b border-(--ink-line) pb-[10px] text-[15px] font-bold text-(--ink-1)">
                        Pages
                      </h2>
                      <ul className="flex flex-col">
                        {pages.map((p) => (
                          <li key={p.href}>
                            <Link
                              href={p.href}
                              onClick={close}
                              className="block rounded-sm px-[8px] py-[7px] text-[14.5px] font-medium text-(--ink-1) transition hover:bg-[rgba(14,77,75,.07)] hover:text-(--teal)"
                            >
                              {p.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>

                {/* ---- right: products ------------------------------------ */}
                {products.length > 0 && (
                  <section>
                    <h2 className="mb-[10px] border-b border-(--ink-line) pb-[10px] text-[15px] font-bold text-(--ink-1)">
                      {searching ? 'Products' : 'All tests'}
                    </h2>
                    <ul className="grid gap-[6px] min-[1180px]:grid-cols-2">
                      {products.map((p) => (
                        <li key={p.href}>
                          <Link
                            href={p.href}
                            onClick={close}
                            className="flex items-center gap-[14px] rounded-sm p-[10px] transition hover:bg-[rgba(14,77,75,.06)]"
                          >
                            <CardArt
                              image={p.image}
                              icon={p.icon}
                              tone={p.tone}
                              sizes={THUMB_SIZES}
                              className="h-[64px] w-[64px] shrink-0 overflow-hidden rounded-sm"
                            />
                            <div className="min-w-0">
                              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--ink-3)">
                                {CATEGORY_BY_HREF.get(p.href)}
                              </div>
                              <div className="mt-[3px] text-[15px] font-semibold leading-[1.25] text-(--ink-1)">
                                {p.name}
                              </div>
                              {p.meta && <div className="mt-[2px] text-[12.5px] text-(--ink-3)">{p.meta}</div>}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {/* The one route through to filters, sorting and prices.
                        Also the only place the overlay states a COUNT - the
                        lanes above are a preview, not the whole answer. */}
                    <Link
                      href={searchHref(trimmed)}
                      onClick={close}
                      className="mt-[16px] inline-flex items-center gap-[8px] rounded-sm bg-(--ink-1) px-[18px] py-[10px] text-[13.5px] font-semibold text-(--cream) transition hover:bg-(--teal)"
                    >
                      {searching
                        ? `View all ${products.length} ${products.length === 1 ? 'result' : 'results'}`
                        : 'Browse all tests with filters'}
                      <span aria-hidden>→</span>
                    </Link>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;
