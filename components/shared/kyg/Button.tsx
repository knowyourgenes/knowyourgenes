import Link from 'next/link';
import type { ReactNode } from 'react';

import { BTN, BTN_BLOCK } from '@/components/shared/button-styles';
import { cn } from '@/lib/utils';

/**
 * THE homepage button. Four skins, one box.
 *
 * The box is BTN from components/shared - 44px tall, 18px padding, 15/22.5 type,
 * rounded-sm - and it is never overridden here. Before that file existed this
 * page shipped buttons at 44, 48, 50 and 52px because each section had traced
 * its own from its own frame. Height is not a per-section decision.
 *
 *   primary   solid eden, cream label      - on cream and sand grounds
 *   ghost     eden hairline, eden label    - the secondary next to primary
 *   onDark    solid java2, abyss label     - on ink and abyss grounds
 *   ghostDark cream hairline, cream label  - the secondary on dark grounds
 *
 * The outlines are 1.5px INSET rings, not borders: a border grows the 44px box
 * and knocks the button off the baseline its neighbours sit on.
 */
const SKIN = {
  primary:
    'bg-eden font-bold text-linenw shadow-[0_6px_18px_0_rgba(14,77,75,0.18)] ' +
    'hover:bg-eden2 hover:shadow-[0_12px_30px_0_rgba(14,77,75,0.26)]',
  ghost: 'font-bold text-eden ring-[1.5px] ring-inset ring-eden/[0.26] ' + 'hover:bg-eden/[0.055] hover:ring-eden/55',
  onDark:
    'bg-java2 font-bold text-abyss shadow-[0_10px_34px_0_rgba(42,195,162,0.32)] ' +
    'hover:bg-java hover:shadow-[0_14px_40px_0_rgba(42,195,162,0.4)]',
  ghostDark:
    'font-bold text-linenw ring-[1.5px] ring-inset ring-linenw/45 ' + 'hover:bg-linenw/10 hover:ring-linenw/80',
} as const;

export type ButtonVariant = keyof typeof SKIN;

/** The arrow every CTA carries. Inline so it inherits currentColor. */
function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[15px] w-[15px] shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-[3px] motion-reduce:transition-none"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function Button({
  href,
  children,
  variant = 'primary',
  arrow = true,
  block = false,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  /** Set false for a button that is not going anywhere new - rare here. */
  arrow?: boolean;
  /** Full width on phones, natural width from sm up. */
  block?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group/btn transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
        BTN,
        block && BTN_BLOCK,
        SKIN[variant],
        className
      )}
    >
      {children}
      {arrow ? <Arrow /> : null}
    </Link>
  );
}

export default Button;
