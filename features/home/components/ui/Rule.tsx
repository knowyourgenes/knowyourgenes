import { cn } from '@/lib/utils';

import { RULE_DARK, RULE_LIGHT } from './tokens';

/**
 * The page's hairline. It TAPERS - solid to 34% of the width, gone by 92% -
 * which is what stops a full-bleed rule from reading as a table border.
 *
 * Drawn as a 1px div with a gradient background rather than a border-image:
 * border-image needs a companion `border-transparent` or it falls back to
 * currentColor, and every previous build got that pairing wrong at least once.
 */
const IMAGE = {
  light: RULE_LIGHT,
  dark: RULE_DARK,
  /** Fades out symmetrically from the middle - used to close a dark section. */
  center: 'linear-gradient(90deg,rgba(27,23,18,0) 0%,rgba(27,23,18,0.2) 50%,rgba(27,23,18,0) 100%)',
  /**
   * The list rule: strong at the left and gone by the right, 70% to 10%. This is
   * NOT the tapered rule the rest of the page uses - Discover's rows are drawn
   * with this one specifically, and it is what makes a stack of seven of them
   * read as a list rather than as a table.
   */
  fade: 'linear-gradient(90deg,rgba(27,23,18,0.7) 0%,rgba(27,23,18,0.1) 100%)',
} as const;

export function Rule({ tone = 'light', className }: { tone?: keyof typeof IMAGE; className?: string }) {
  return <div aria-hidden="true" className={cn('h-px w-full', className)} style={{ backgroundImage: IMAGE[tone] }} />;
}

export default Rule;
