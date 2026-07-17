'use client';

import { Children, useRef, useState, type ReactNode } from 'react';

/**
 * Minimal horizontal carousel for the Tests package row.
 *
 * The only client-side piece of the (otherwise static) homepage: prev/next
 * buttons + dots scroll by one card width. User-initiated smooth scroll, NOT a
 * scroll-driven animation, so no jank returns.
 *
 * `items-stretch` makes every card the same (tallest) height. The active card is
 * derived from scroll position, so the arrows disable at the ends and the dots
 * highlight the current card.
 */

const arrowBtn =
  'inline-flex h-[40px] w-[40px] items-center justify-center rounded-full border border-(--ink-line) bg-white text-(--ink-2) transition-[background,color,border-color,opacity] duration-300 enabled:hover:border-(--c-teal) enabled:hover:bg-(--c-teal) enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-35';

export function Carousel({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const count = Children.count(children);
  const [active, setActive] = useState(0);

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(count - 1, i));
    const target = el.children[clamped] as HTMLElement | undefined;
    // Position of the target card relative to the scroll container's current
    // scroll offset - correct regardless of the container's positioning.
    const left = target
      ? el.scrollLeft + target.getBoundingClientRect().left - el.getBoundingClientRect().left
      : clamped * el.clientWidth;
    el.scrollTo({ left, behavior: 'smooth' });
    setActive(clamped);
  };

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActive(Math.max(0, Math.min(count - 1, idx)));
  };

  return (
    <div>
      <div className="mb-[16px] flex items-center justify-between gap-[16px]">
        <span className="text-[12px] font-bold tracking-[0.16em] text-(--ink-3) uppercase">{label}</span>
        <div className="flex gap-[8px]">
          <button
            type="button"
            aria-label="Previous test"
            disabled={active === 0}
            onClick={() => goTo(active - 1)}
            className={arrowBtn}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[18px] w-[18px]"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next test"
            disabled={active >= count - 1}
            onClick={() => goTo(active + 1)}
            className={arrowBtn}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[18px] w-[18px]"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={ref}
        onScroll={onScroll}
        aria-label="Test packages"
        className="flex snap-x snap-mandatory items-stretch overflow-x-auto scroll-smooth rounded-[var(--r-lg)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {/* Dots */}
      <div className="mt-[18px] flex items-center justify-center gap-[8px]">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to test ${i + 1}`}
            aria-current={i === active}
            onClick={() => goTo(i)}
            className={`h-[8px] rounded-full transition-[width,background-color] duration-300 ${
              i === active ? 'w-[26px] bg-(--c-teal)' : 'w-[8px] bg-(--ink-line) hover:bg-(--ink-3)'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
