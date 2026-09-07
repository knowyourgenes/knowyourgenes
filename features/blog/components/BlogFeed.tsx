'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { BTN } from '@/components/shared/button-styles';
import { Icon, Rule, Toolbar } from '@/components/shared/kyg';
import { cn } from '@/lib/utils';
import { categoryLabel, type BlogListItem } from '@/features/blog';
import { FEED, PAGE_SIZE, SORTS, type SortValue } from '../constants';
import FeaturedPost from './FeaturedPost';
import PostCard from './PostCard';

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
      <Toolbar
        label={FEED.label}
        query={query}
        onQuery={(v) => {
          setQuery(v);
          setShown(PAGE_SIZE);
        }}
        searchPlaceholder={FEED.searchPlaceholder}
        searchLabel="Search articles"
        selects={[{ label: FEED.sortLabel, value: sort, onChange: (v) => setSort(v as SortValue), options: SORTS }]}
      >
        {initialCategory ? (
          <span className="inline-flex items-center gap-2 rounded-sm bg-mint px-[10px] py-[5px] font-kyg text-[clamp(9.2px,0.903vw,14.4px)] font-bold uppercase tracking-[0.14em] text-eden">
            {categoryLabel(initialCategory)}
            {/* 44x44 target pulled back with negative margin, so the chip keeps its
                drawn height. This is the only control that clears the filter. */}
            <Link
              href="/blog"
              aria-label="Clear category filter"
              className="-my-[16px] -mr-[10px] inline-flex h-[44px] w-[44px] items-center justify-center text-eden/70 hover:text-eden"
            >
              <Icon name="cross" strokeWidth={2.4} className="h-[11px] w-[11px]" />
            </Link>
          </span>
        ) : null}
      </Toolbar>

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
