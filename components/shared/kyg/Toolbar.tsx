'use client';

import { useId } from 'react';

import { cn } from '@/lib/utils';

import { Icon } from './Icon';

/** The frame's control box: 31.29 tall at the 1024 artboard, white, hairline. */
const CONTROL =
  'h-[clamp(31.3px,3.056vw,48.9px)] rounded-sm bg-white ring-1 ring-inset ring-zeus/[0.13] font-kyg leading-none';

export interface SortOption {
  value: string;
  label: string;
}

/**
 * The listing toolbar: a section label, a search field, and a sort control
 * pushed to the far end.
 *
 * /blog (343:659) and /categories (343:4449) draw it identically - same 17.067
 * gap, same 426.67 field, same 31.29 controls - so the chrome lives here and
 * each page owns its own state and options. DESIGN.md §7.
 *
 * PRESENTATIONAL ONLY. It holds no state: the page filtering the list is the
 * page that must own the query, or the two drift out of sync the first time
 * something else needs to reset it.
 *
 * The search field is the flexible one and gives up width first; the sort
 * control keeps its intrinsic width, because a label that wraps mid-phrase
 * reads as broken where a shorter input does not.
 */
export function Toolbar({
  label,
  query,
  onQuery,
  searchPlaceholder,
  searchLabel = 'Search',
  sort,
  onSort,
  sorts,
  sortLabel = 'Sort',
  children,
  className,
}: {
  label: string;
  query: string;
  onQuery: (value: string) => void;
  searchPlaceholder: string;
  /** Accessible name for the field - it has no visible label in the design. */
  searchLabel?: string;
  sort: string;
  onSort: (value: string) => void;
  sorts: readonly SortOption[];
  sortLabel?: string;
  /** Anything that belongs beside the label - a removable filter chip, say. */
  children?: React.ReactNode;
  className?: string;
}) {
  const uid = useId();

  return (
    <div className={cn('flex flex-wrap items-center gap-[clamp(12px,1.667vw,26.7px)]', className)}>
      <p className="font-kyg text-[clamp(9.2px,0.903vw,14.4px)] font-bold uppercase leading-[1.462] tracking-[0.2em] text-boulder">
        {label}
      </p>

      {children}

      <label htmlFor={`${uid}-q`} className="sr-only">
        {searchLabel}
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
          onChange={(e) => onQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="min-w-0 flex-1 bg-transparent font-kyg text-[clamp(10.7px,1.042vw,16.7px)] text-heavy outline-none placeholder:text-boulder"
        />
      </div>

      {/* the frame's `push` */}
      <div className="hidden flex-1 lg:block" />

      <label htmlFor={`${uid}-sort`} className="sr-only">
        Sort
      </label>
      <div
        className={cn(
          CONTROL,
          'relative flex shrink-0 items-center gap-[clamp(5.7px,0.556vw,8.9px)] pl-[clamp(11.4px,1.111vw,17.8px)] pr-[clamp(9.2px,0.903vw,14.4px)] focus-within:ring-eden/40'
        )}
      >
        <span className="shrink-0 font-kyg text-[clamp(9.6px,0.9375vw,15px)] font-medium text-boulder">
          {sortLabel}
        </span>
        <select
          id={`${uid}-sort`}
          value={sort}
          onChange={(e) => onSort(e.target.value)}
          className="cursor-pointer appearance-none bg-transparent pr-[16px] font-kyg text-[clamp(9.6px,0.9375vw,15px)] font-bold text-fusc outline-none"
        >
          {sorts.map((s) => (
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
  );
}

export default Toolbar;
