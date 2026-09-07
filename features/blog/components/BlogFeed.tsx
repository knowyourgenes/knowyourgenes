'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';

import { BTN } from '@/components/shared/button-styles';
import { Icon, Rule } from '@/components/shared/kyg';
import { cn } from '@/lib/utils';
import { categoryLabel, type BlogListItem } from '@/features/blog';
import { FEED, PAGE_SIZE, SORTS, type SortValue } from '../constants';
import FeaturedPost from './FeaturedPost';
import PostCard from './PostCard';

/** The frame's control box: 31.29 tall at 1024, white, hairline, one radius. */
const CONTROL =
  'h-[clamp(31.3px,3.056vw,48.9px)] rounded-sm bg-white ring-1 ring-inset ring-zeus/[0.13] font-kyg leading-none';

/**
 * 02 · Latest - Figma 343:657.
 *
 * A client component, because the frame's filter bar is a REAL search box and a
 * REAL sort control, and a search field that does not search is worse than no
 * search field. Everything it needs is already in memory - the page fetches the
 * whole list from Sanity - so filtering and sorting are pure array work with no
 * second round trip.
 *
 * `initialCategory` comes from ?category= on the route. The frame drops the
 * category pills the old page had, so that parameter would otherwise become
 * unreachable and, worse, inescapable once set - hence the removable chip.
 */
export default function BlogFeed({ posts, initialCategory }: { posts: BlogListItem[]; initialCategory?: string }) {
  const uid = useId();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortValue>('newest');
  const [shown, setShown] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const matches = posts.filter((p) => {
      if (initialCategory && p.category !== initialCategory) return false;
      if (!q) return true;
      // Search what a reader can actually see on the card.
      return [p.title, p.excerpt, p.author?.name, categoryLabel(p.category)]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q));
    });

    const time = (p: BlogListItem) => (p.publishedAt ? new Date(p.publishedAt).getTime() : 0);
    const sorted = [...matches];
    if (sort === 'newest') sorted.sort((a, b) => time(b) - time(a));
    if (sort === 'oldest') sorted.sort((a, b) => time(a) - time(b));
    // Unset read times sort last rather than first - an unknown length is not
    // the quickest read.
    if (sort === 'quickest') sorted.sort((a, b) => (a.readMinutes ?? 1e6) - (b.readMinutes ?? 1e6));
    return sorted;
  }, [posts, query, sort, initialCategory]);

  /* The featured post is only lifted out of an UNFILTERED list. Pulling it out
     of a search result would silently drop it from the matches, or promote a
     post the reader did not ask for above the ones they did. */
  const searching = query.trim().length > 0;
  const featured = !searching && !initialCategory ? (filtered.find((p) => p.featured) ?? null) : null;
  const rest = featured ? filtered.filter((p) => p._id !== featured._id) : filtered;
  const visible = rest.slice(0, shown);

  return (
    <>
      {/* ---- filter bar ------------------------------------------------- */}
      <div className="flex flex-wrap items-center gap-[clamp(12px,1.667vw,26.7px)]">
        <p className="font-kyg text-[clamp(9.2px,0.903vw,14.4px)] font-bold uppercase leading-[1.462] tracking-[0.2em] text-boulder">
          {FEED.label}
        </p>

        {initialCategory ? (
          <span className="inline-flex items-center gap-2 rounded-sm bg-mint px-[10px] py-[5px] font-kyg text-[clamp(9.2px,0.903vw,14.4px)] font-bold uppercase tracking-[0.14em] text-eden">
            {categoryLabel(initialCategory)}
            <Link href="/blog" aria-label="Clear category filter" className="text-eden/70 hover:text-eden">
              <Icon name="cross" strokeWidth={2.4} className="h-[11px] w-[11px]" />
            </Link>
          </span>
        ) : null}

        {/* 426.67 of the 967.11 rail, and it gives that up first when the row
            runs out of room - the sort control has a fixed intrinsic width. */}
        <label htmlFor={`${uid}-q`} className="sr-only">
          Search articles
        </label>
        <div
          className={cn(
            CONTROL,
            'flex min-w-[200px] flex-1 items-center gap-[clamp(7.1px,0.694vw,11.1px)] px-[clamp(11.4px,1.111vw,17.8px)] focus-within:ring-eden/40 lg:max-w-[clamp(426.7px,41.667vw,666.7px)]'
          )}
        >
          <Icon
            name="search"
            className="h-[clamp(12.8px,1.25vw,20px)] w-[clamp(12.8px,1.25vw,20px)] shrink-0 text-boulder"
          />
          <input
            id={`${uid}-q`}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShown(PAGE_SIZE);
            }}
            placeholder={FEED.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent font-kyg text-[clamp(11px,1.076vw,17.2px)] text-heavy outline-none placeholder:text-boulder"
          />
        </div>

        {/* the frame's `push` */}
        <div className="hidden flex-1 lg:block" />

        <label htmlFor={`${uid}-sort`} className="sr-only">
          Sort articles
        </label>
        <div
          className={cn(
            CONTROL,
            'relative flex shrink-0 items-center gap-[clamp(5.7px,0.556vw,8.9px)] pl-[clamp(11.4px,1.111vw,17.8px)] pr-[clamp(9.2px,0.903vw,14.4px)] focus-within:ring-eden/40'
          )}
        >
          <span className="shrink-0 font-kyg text-[clamp(9.6px,0.9375vw,15px)] font-medium text-boulder">
            {FEED.sortLabel}
          </span>
          <select
            id={`${uid}-sort`}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortValue)}
            className="cursor-pointer appearance-none bg-transparent pr-[16px] font-kyg text-[clamp(9.6px,0.9375vw,15px)] font-bold text-fusc outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <Icon
            name="chevron"
            strokeWidth={2}
            className="pointer-events-none absolute right-[clamp(9.2px,0.903vw,14.4px)] h-[9px] w-[9px] rotate-90 text-boulder"
          />
        </div>
      </div>

      <Rule className="mt-[clamp(12px,1.389vw,22.2px)]" />

      {/* ---- results ---------------------------------------------------- */}
      {filtered.length === 0 ? (
        <div className="mt-[clamp(28px,4vw,64px)] rounded-sm border border-dashed border-zeus/15 bg-white/60 px-6 py-[clamp(40px,6vw,96px)] text-center">
          <p className="font-kyg text-[clamp(16px,1.5vw,24px)] font-bold text-heavy">
            {searching ? FEED.empty.searchTitle : FEED.empty.noneTitle}
          </p>
          <p className="mt-2 font-kyg text-[clamp(12px,1.146vw,18.3px)] leading-[1.6] text-fusc">
            {searching ? FEED.empty.search : FEED.empty.none}
          </p>
        </div>
      ) : (
        <>
          {featured ? (
            <div className="mt-[clamp(20px,2.222vw,35.6px)]">
              <FeaturedPost post={featured} />
            </div>
          ) : null}

          <div className="mt-[clamp(20px,2.222vw,35.6px)] grid gap-[clamp(14.2px,1.389vw,22.2px)] sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {rest.length > shown ? (
            <div className="mt-[clamp(20px,2.5vw,40px)] flex justify-center">
              <button
                type="button"
                onClick={() => setShown((n) => n + PAGE_SIZE)}
                className={cn(
                  BTN,
                  'font-bold text-eden ring-[1.5px] ring-inset ring-eden/[0.26]',
                  'transition duration-300 hover:bg-eden/[0.055] hover:ring-eden/55 motion-reduce:transition-none'
                )}
              >
                {FEED.loadMore}
              </button>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}
