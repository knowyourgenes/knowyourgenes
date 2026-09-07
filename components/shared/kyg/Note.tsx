import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * The two-voice note: a short rule, a line of light Figtree, and a cursive turn
 * on its own line underneath.
 *
 *   ------
 *   Because the more you understand,
 *   *the better questions you can ask.*
 *
 * It is a real component in the Figma library and the page leans on it hard -
 * seven times on /about, twice on /contact - which is exactly DESIGN.md §7's
 * threshold for promoting out of a feature. Before this it was inlined twice in
 * features/contact with the numbers retyped each time.
 *
 * THE TURN IS A <b> INSIDE THE <p>, not a second paragraph: it is the same
 * sentence continuing in a different voice, and splitting it into two blocks is
 * what makes a screen reader announce a pause that the design does not draw.
 *
 * Sizes are relative to the lead (1.13em) rather than clamped again, because
 * Cormorant reads visibly smaller than Figtree at the same px - the same reason
 * `Heading` sets its <em> at 1.1em instead of a second clamp.
 */
export function Note({
  lead,
  turn,
  tone = 'light',
  className,
}: {
  lead: ReactNode;
  /** The cursive line. Omit for a rule + single voice. */
  turn?: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const dark = tone === 'dark';
  return (
    <div className={cn('min-w-0', className)}>
      {/* 39.82 x 1.42 in the frame - a mark, not a divider, so it is a fixed
          width and must not stretch to its column. */}
      <span
        aria-hidden="true"
        className={cn(
          'block h-[2px] w-[clamp(39.8px,3.889vw,62px)] rounded-sm',
          dark ? 'bg-linenw/35' : 'bg-nevada/50'
        )}
      />
      <p
        data-rise="3"
        className={cn(
          'mt-[clamp(12.8px,1.25vw,20px)] font-kyg text-[clamp(16.4px,1.597vw,25.5px)] font-light leading-[1.392] tracking-[-0.02em]',
          dark ? 'text-linenw/[0.72]' : 'text-fusc'
        )}
      >
        {lead}
        {turn ? (
          <b
            className={cn(
              'block font-tst text-[1.13em] font-semibold italic leading-[1.385] tracking-normal',
              dark ? 'text-java2' : 'text-eden'
            )}
          >
            {turn}
          </b>
        ) : null}
      </p>
    </div>
  );
}

export default Note;
