import type { ReactNode } from 'react';

import { Container } from '@/components/shared/Container';
import { cn } from '@/lib/utils';

import { GROUND, SECTION_Y, type Ground } from './tokens';

/**
 * THE section shell. Every band on the homepage is one of these - there is no
 * second way to open a section.
 *
 * It owns three things so no section has to decide them again:
 *   ground      the fill and the ink that goes with it
 *   rail        <Container>, so content lands on the same x as every other
 *               section at every width (1160 at the 1240 design width)
 *   padding     SECTION_Y, the page's single vertical rhythm
 *
 * The ground runs full-bleed and only the CONTENT is railed, which is what lets
 * a dark section reach the viewport edge while its headline still lines up with
 * the cream section above it.
 *
 * `labelledBy` names the landmark. Without it a screen reader announces a dozen
 * anonymous "section" landmarks, which is worse than shipping none - pair it
 * with the id SectionTitle puts on its heading.
 */
export function Section({
  ground = 'cream',
  id,
  labelledBy,
  className,
  innerClassName,
  children,
}: {
  ground?: Ground;
  id?: string;
  labelledBy?: string;
  /** Ground-level overrides: gradients, `relative isolate`, overflow clipping. */
  className?: string;
  /** Rail-level overrides. Reach for this before reaching for className. */
  innerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      // scroll-mt clears the sticky SiteHeader (64px) on in-page jumps
      className={cn('w-full', GROUND[ground], id && 'scroll-mt-[84px]', className)}
    >
      <Container className={cn(SECTION_Y, innerClassName)}>{children}</Container>
    </section>
  );
}

export default Section;
