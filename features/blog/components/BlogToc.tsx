'use client';

import { useEffect, useState } from 'react';
import type { BlogHeading } from '@/features/blog';

// Sticky "quick navigation" for an article. Lists the h2/h3 headings, scroll-
// spies the current section, and smooth-scrolls on click (heading scroll-margin
// clears the sticky site header). Rendered inside the article's CHROME_VARS
// scope, so the design tokens cascade in.
export default function BlogToc({ headings }: { headings: BlogHeading[] }) {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const ids = headings.map((h) => h.id);
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        // active = topmost heading (document order) currently in the band
        const first = ids.find((id) => visible.has(id));
        if (first) setActive(first);
      },
      { rootMargin: '-88px 0px -66% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [headings]);

  const onClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (typeof history !== 'undefined') history.replaceState(null, '', `#${id}`);
    setActive(id);
  };

  return (
    <nav
      aria-label="On this page"
      className="sticky top-22 max-h-[calc(100vh-112px)] overflow-y-auto"
    >
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-(--ink-3)">On this page</p>
      <ul className="flex flex-col border-l border-(--ink-line)">
        {headings.map((h) => {
          const isActive = active === h.id;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => onClick(e, h.id)}
                className={
                  '-ml-px block border-l-2 py-1.5 text-[13.5px] leading-snug transition-colors ' +
                  (h.level === 3 ? 'pl-7 ' : 'pl-4 ') +
                  (isActive
                    ? 'border-(--teal) font-semibold text-(--teal)'
                    : 'border-transparent text-(--ink-3) hover:text-(--ink-1)')
                }
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
