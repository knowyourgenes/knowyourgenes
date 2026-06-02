// Small, reusable building blocks shared across the test-page sections.
// Styling is Tailwind utilities backed by the scoped CSS-variable tokens
// declared in styles.tsx (e.g. var(--acc-500), var(--sh-1)).
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const BTN_BASE =
  'inline-flex items-center justify-center gap-[10px] rounded-full font-semibold leading-none tracking-[-0.005em] ' +
  'border-[1.5px] border-transparent cursor-pointer transition-[transform,background,box-shadow,color,border-color] ' +
  'duration-300 ease-[var(--e-out)] [&_svg]:w-4 [&_svg]:h-4 [&_svg]:transition-transform [&_svg]:duration-500';

const BTN_VARIANTS = {
  accent:
    'bg-[var(--acc-500)] text-white shadow-[0_10px_26px_-8px_rgba(31,107,67,.5)] hover:bg-[var(--acc-700)] ' +
    'hover:-translate-y-[3px] hover:shadow-[0_18px_38px_-10px_rgba(31,107,67,.55)] hover:[&_svg:last-child]:translate-x-1',
  dark: 'bg-[var(--ink-1)] text-[var(--cream)] shadow-[0_10px_26px_-8px_rgba(31,26,20,.4)] hover:bg-[var(--teal)] hover:-translate-y-[3px]',
  primary:
    'bg-[var(--ink-1)] text-[var(--cream)] shadow-[0_10px_28px_rgba(31,26,20,.18)] hover:bg-[var(--teal)] ' +
    'hover:-translate-y-[3px] hover:shadow-[0_18px_44px_rgba(14,77,75,.32)] hover:[&_svg:last-child]:translate-x-1',
  ghost:
    'bg-white text-[var(--ink-1)] border-[var(--ink-line)] hover:border-[rgba(31,26,20,.2)] hover:-translate-y-[3px] hover:shadow-[var(--sh-2)]',
  light: 'bg-white text-[var(--acc-700)] hover:-translate-y-[3px] hover:shadow-[0_14px_30px_rgba(0,0,0,.2)]',
} as const;

const BTN_SIZES = {
  md: 'py-[15px] px-[26px] text-[15.5px]',
  lg: 'py-[17px] px-[32px] text-[16.5px]',
} as const;

export type ButtonVariant = keyof typeof BTN_VARIANTS;
export type ButtonSize = keyof typeof BTN_SIZES;

interface ButtonProps {
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}

/** CTA button. Renders an anchor when `href` is given, else a <button>. */
export function Button({ href, variant = 'accent', size = 'md', className, children, ariaLabel }: ButtonProps) {
  const cls = cn(BTN_BASE, BTN_VARIANTS[variant], BTN_SIZES[size], className);
  if (href) {
    return (
      <a href={href} aria-label={ariaLabel} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" aria-label={ariaLabel} className={cls}>
      {children}
    </button>
  );
}

const BADGE_STATUS = {
  good: 'bg-[var(--st-good-bg)] text-[var(--st-good-fg)]',
  avg: 'bg-[var(--st-avg-bg)] text-[var(--st-avg-fg)]',
  risk: 'bg-[var(--st-risk-bg)] text-[var(--st-risk-fg)]',
} as const;

export function Badge({
  status,
  children,
  className,
}: {
  status: 'good' | 'avg' | 'risk';
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'text-[11.5px] font-bold py-[4px] px-[10px] rounded-full tracking-[0.01em] whitespace-nowrap',
        BADGE_STATUS[status],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Uppercase label with the gradient lead bar (via ::before). */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-[13px] font-bold tracking-[0.16em] uppercase text-[var(--acc-700)]",
        "before:content-[''] before:w-[30px] before:h-[2px] before:rounded-[2px] before:bg-[linear-gradient(90deg,var(--acc-500),var(--acc-700))]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Eyebrow + title + optional sub, the standard section header. */
export function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mb-[clamp(28px,3vw,44px)] max-w-[640px]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-semibold text-[clamp(28px,3.2vw,40px)] leading-[1.08] tracking-[-0.025em] text-[var(--ink-1)] mt-[18px]">
        {title}
      </h2>
      {sub ? (
        <p className="text-[clamp(15.5px,1.2vw,17.5px)] leading-[1.55] text-[var(--ink-2)] mt-[14px]">{sub}</p>
      ) : null}
    </div>
  );
}
