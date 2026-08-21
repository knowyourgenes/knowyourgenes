'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Expand/collapse row.
//   variant "row"  → buy-box list (top/bottom hairlines; ExtraBold 0.08em UPPER head)
//   variant "card" → FAQ (full border, radius 16px, white; SemiBold head)
// Toggle is the Figma's rounded-square glyph button:
//   emphasis → Sea Green fill + white glyph (What's Included)
//   else     → Gin fill + Green Pea glyph
export default function Accordion({
  title,
  defaultOpen = false,
  variant = 'row',
  emphasis = false,
  titleClassName,
  children,
}: {
  title: ReactNode;
  defaultOpen?: boolean;
  variant?: 'row' | 'card';
  emphasis?: boolean;
  titleClassName?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        variant === 'card' ? 'rounded-sm border border-heavy/10 bg-white' : 'border-b border-heavy/10 first:border-t'
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex w-full items-center justify-between gap-4 text-left',
          variant === 'card' ? 'px-5 py-[17px]' : 'py-[15px]'
        )}
      >
        <span
          className={cn(
            variant === 'card'
              ? 'text-[15px] font-semibold text-heavy'
              : 'text-[12.5px] font-extrabold uppercase tracking-[0.08em] text-heavy',
            titleClassName
          )}
        >
          {title}
        </span>
        <span
          className={cn(
            'grid shrink-0 place-items-center rounded-sm pb-[2px] font-extrabold leading-none',
            emphasis ? 'size-[37px] bg-sea text-[18px] text-white' : 'size-[26px] bg-gin text-[18px] text-greenpea'
          )}
        >
          {open ? '−' : '+'}
        </span>
      </button>

      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className={cn(variant === 'card' ? 'px-5 pb-[18px]' : 'pb-[16px]')}>{children}</div>
        </div>
      </div>
    </div>
  );
}
