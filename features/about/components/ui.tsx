import type { ReactNode } from 'react';

import { Icon } from '@/components/shared/kyg';
import { cn } from '@/lib/utils';

// =============================================================================
// features/about - the shapes THIS page repeats
// -----------------------------------------------------------------------------
// Everything shared with the homepage, /contact, /blog and /categories comes
// from @/components/shared/kyg - Section, Eyebrow, Heading, Note, Button, Icon,
// Rule, PageMasthead. Nothing here duplicates any of those.
//
// All measurements are the frame's own at its 1024 artboard, written as vw so
// they hold proportion up to the 1600 rail Container caps at. Each clamp's floor
// is the 1024 value: below a laptop the page stops shrinking type and reflows.
// =============================================================================

/**
 * The bare uppercase label. NOT the eyebrow pill - this frame uses both, and the
 * difference is deliberate: a pill opens a section, a kicker labels a block
 * inside one.
 */
export function Kicker({
  children,
  size = 'lg',
  tone = 'eden',
  className,
}: {
  children: ReactNode;
  /**
   * lg = the section-internal label (0.2em), sm = a flag (0.16em).
   *
   * The clamp FLOORS are raised above the frame's 8.2 and 7.6: those are the
   * values at a 1024 artboard, and a clamp floor is what a 360px phone actually
   * renders - 8px uppercase with 0.2em tracking is not readable. Only the floor
   * moves, so every width from 1024 up is still the frame's exact size.
   */
  size?: 'sm' | 'lg';
  tone?: 'eden' | 'java' | 'ice' | 'muted' | 'dim';
  className?: string;
}) {
  return (
    <p
      className={cn(
        'font-kyg font-bold uppercase',
        size === 'lg'
          ? 'text-[clamp(11px,0.801vw,12.8px)] leading-[1.5] tracking-[0.2em]'
          : 'text-[clamp(11px,0.742vw,11.9px)] leading-[1.5] tracking-[0.16em]',
        tone === 'eden' ? 'text-eden' : null,
        tone === 'java' ? 'text-java2' : null,
        tone === 'ice' ? 'text-ice' : null,
        tone === 'muted' ? 'text-boulder' : null,
        tone === 'dim' ? 'text-linenw/45' : null,
        className
      )}
    >
      {children}
    </p>
  );
}

/**
 * chip -> arrow -> chip, ending on a filled one. Drawn in 03, 06 and 12.
 *
 * IT WRAPS rather than scrolls. A sequence whose whole point is where it ends up
 * must not have its end hidden off the side of a phone.
 */
export function Chain({
  items,
  tone = 'light',
  className,
}: {
  items: readonly string[];
  /** `dark` is the ink-ground variant used on 12's sand card and 09. */
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const dark = tone === 'dark';
  return (
    <div className={cn('flex flex-wrap items-center gap-[clamp(5.7px,0.557vw,8.9px)]', className)}>
      {items.map((label, i) => {
        const last = i === items.length - 1;
        return (
          <div key={label} className="contents">
            {i > 0 ? (
              <Icon
                name="arrow"
                strokeWidth={2}
                className={cn(
                  'h-[clamp(9px,0.879vw,14.1px)] w-[clamp(9px,0.879vw,14.1px)] shrink-0',
                  dark ? 'text-linenw/40' : 'text-eden/45'
                )}
              />
            ) : null}
            <span
              className={cn(
                'inline-flex shrink-0 items-center rounded-sm px-[clamp(8.5px,0.83vw,13.3px)] py-[clamp(5px,0.488vw,7.8px)]',
                'font-kyg text-[clamp(11px,0.9375vw,15px)] leading-[1.48]',
                last
                  ? 'bg-eden font-bold text-white'
                  : dark
                    ? 'bg-white/[0.06] font-medium text-linenw ring-1 ring-inset ring-white/[0.14]'
                    : 'bg-eden/[0.05] font-medium text-eden ring-1 ring-inset ring-eden/[0.15]'
              )}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * The hint line the frame puts under an interactive block - "Click any point on
 * the timeline", "Hover a belief to read why".
 *
 * `aria-hidden`, deliberately. It describes a POINTER affordance that keyboard
 * and screen-reader users reach a different way, and every one of these blocks
 * is built from real buttons that announce themselves. Reading "hover this" to
 * someone who cannot hover is worse than silence.
 */
export function Hint({ children, tone = 'eden' }: { children: ReactNode; tone?: 'eden' | 'ice' }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex items-center gap-[clamp(6px,0.586vw,9.4px)] font-tst text-[clamp(14px,1.367vw,21.9px)] font-semibold italic',
        tone === 'ice' ? 'text-ice' : 'text-eden'
      )}
    >
      <Icon name="arrow" strokeWidth={2} className="h-[clamp(11px,1.074vw,17.2px)] w-[clamp(11px,1.074vw,17.2px)]" />
      {children}
    </span>
  );
}

/** The frame's plain 1px divider (not the page's tapered `Rule`). */
export function Hr({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('h-px w-full', tone === 'dark' ? 'bg-white/10' : 'bg-zeus/[0.12]', className)}
    />
  );
}

/**
 * The two-voice closing line several sections end on: a light Figtree phrase
 * and a cursive turn beside it.
 */
export function Coda({
  lead,
  turn,
  tone = 'light',
  className,
}: {
  lead: string;
  turn: string;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const dark = tone === 'dark';
  return (
    <p className={cn('flex flex-wrap items-baseline gap-x-[0.35em] gap-y-1', className)}>
      <span
        className={cn(
          'font-kyg text-[clamp(20px,2.539vw,40.6px)] font-light leading-[1.2] tracking-[-0.02em]',
          dark ? 'text-linenw' : 'text-heavy'
        )}
      >
        {lead}
      </span>
      <span
        className={cn(
          'font-tst text-[clamp(20px,1.855vw,29.7px)] font-semibold italic leading-[1.25]',
          dark ? 'text-java2' : 'text-eden'
        )}
      >
        {turn}
      </span>
    </p>
  );
}
