import type { ReactNode } from 'react';

import { Container } from '@/components/shared/Container';
import { cn } from '@/lib/utils';

import { Eyebrow } from './SectionTitle';
import { Heading } from './SectionTitle';
import { SECTION_Y } from './tokens';

/**
 * The listing-page masthead: an eyebrow, a two-voice headline and a lede, laid
 * over a photograph that has been washed out to near-cream.
 *
 * /blog (343:649) and /categories (343:4440) draw this identically - same
 * gradient stops, same padding, same 32.711 headline, same 440.89 lede - so it
 * is one component rather than two that will drift. DESIGN.md §7.
 *
 * THE WASH IS THE POINT, and its order matters. The frame lays a 90deg cream
 * ramp over the image - 0.96 opaque at the left, 0.86 at 52%, 0.42 at the right
 * - so the picture only ever surfaces behind the empty right-hand third and the
 * headline sits on near-solid ground. CSS paints the FIRST background layer on
 * top, so the gradient is written before the url().
 *
 * The headline is an h1 at the page's h2 SIZE. That is deliberate in both
 * frames: a listing masthead is quieter than a landing hero, and `Heading`'s
 * own h1 clamp (4.3vw) is a third larger than the 3.194vw drawn here.
 */
export function PageMasthead({
  eyebrow,
  headline,
  turn,
  lede,
  image,
  id,
  className,
}: {
  eyebrow: ReactNode;
  headline: ReactNode;
  /** The cursive second line. */
  turn?: ReactNode;
  lede?: ReactNode;
  /** Public path to the background photograph. */
  image: string;
  /** Id for the heading, so the band can be an aria-labelledby target. */
  id?: string;
  className?: string;
}) {
  return (
    <section
      aria-labelledby={id}
      /* TWO WASHES, and the narrow one is not a weaker copy of the wide one.
         The frame's 90deg ramp fades to 0.42 by the right edge because on a
         1360 rail the copy stops around 46% of it. On a phone the rail IS the
         copy: both the h1 and the lede run to ~95%, where that ramp is only
         0.47 opaque, so text would sit on a half-covered photograph. Below `lg`
         the wash is therefore near-flat and near-opaque; from `lg` up it is the
         frame's exact gradient.

         Keyed by class rather than inline style because an inline style cannot
         carry a breakpoint - the photograph rides in on a custom property. */
      className={cn(
        'w-full bg-linenw bg-cover bg-center bg-no-repeat',
        'bg-[image:linear-gradient(90deg,rgba(250,246,239,0.97)_0%,rgba(250,246,239,0.93)_100%),var(--masthead)]',
        'lg:bg-[image:linear-gradient(90deg,rgba(250,246,239,0.96)_0%,rgba(250,246,239,0.86)_52%,rgba(250,246,239,0.42)_100%),var(--masthead)]',
        className
      )}
      style={{ '--masthead': `url(${image})` } as React.CSSProperties}
    >
      <Container className={SECTION_Y}>
        <Eyebrow data-rise-load="1">{eyebrow}</Eyebrow>

        <Heading
          as="h1"
          id={id}
          data-rise-load="2"
          className="mt-[clamp(11.4px,1.111vw,17.8px)] text-[clamp(24px,min(3.194vw,6.2vh),51px)] leading-[1.315] text-heavy"
        >
          {headline}
          {turn ? <em>{turn}</em> : null}
        </Heading>

        {lede ? (
          <p
            data-rise-load="3"
            className="mt-[clamp(12.8px,1.25vw,20px)] max-w-[clamp(440.9px,43.056vw,688.9px)] font-kyg text-[clamp(13.5px,1.319vw,21.1px)] font-normal leading-[1.5] text-fusc"
          >
            {lede}
          </p>
        ) : null}
      </Container>
    </section>
  );
}

export default PageMasthead;
