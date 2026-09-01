import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * The DNA glyph inside every eyebrow pill. Inline rather than an <img> so it
 * takes currentColor and flips with the ground like the label beside it.
 */
function Helix({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      // 19 x 23, exported from the design node rather than redrawn. The earlier
      // approximation was a 24-square glyph with straight strands; this one is
      // taller than it is wide and the strands actually cross, which is what
      // makes it read as a helix at 13px.
      viewBox="0 0 19 23"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      className={cn('w-auto shrink-0', className)}
    >
      <path d="M5 2C5 7 14 7 14 11.5C14 16 5 16 5 21" />
      <path d="M14 2C14 7 5 7 5 11.5C5 16 14 16 14 21" />
      <path d="M6.5 6H12.5M6.5 17H12.5" />
    </svg>
  );
}

/**
 * The boxed eyebrow. A PILL, not bare text - the box is what makes a 13.5px
 * label read as a label rather than as a stray line of body copy, and it is the
 * one element that appears in every section, so it is the page's strongest
 * continuity cue.
 *
 * `caps` exists for exactly one caller: GENEous Care. "GENEous" is a
 * GENE + genius lockup whose lowercase middle is the whole joke, so that one
 * pill is stored and rendered mixed-case. Everything else is UPPER with the
 * wide tracking that goes with it.
 */
export function Eyebrow({
  children,
  tone = 'light',
  caps = true,
  className,
}: {
  children: ReactNode;
  tone?: 'light' | 'dark';
  caps?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        // the design's 8 / 17 / 8 / 13 and gap 9, as shares of the 1440 rail so
        // they land on its 1024 values too
        'inline-flex items-center rounded-sm',
        'gap-[clamp(6.4px,0.625vw,10px)] py-[clamp(5.7px,0.556vw,8.9px)] pl-[clamp(9.2px,0.903vw,14.4px)] pr-[clamp(12.1px,1.181vw,18.9px)]',
        'font-kyg text-[clamp(9.6px,0.9375vw,15px)] font-bold leading-[1.46]',
        caps ? 'uppercase tracking-[0.11em]' : 'tracking-[0.03em]',
        tone === 'dark'
          ? 'bg-linenw/[0.07] text-java2 ring-1 ring-inset ring-linenw/[0.18]'
          : 'bg-eden/[0.07] text-eden ring-1 ring-inset ring-eden/[0.15]',
        className
      )}
    >
      <Helix className="h-[clamp(16.4px,1.597vw,25.5px)]" />
      {children}
    </span>
  );
}

/**
 * The page's h2. Two voices in one heading: Figtree bold for the statement, and
 * an <em> run set in Cormorant Garamond italic for the turn.
 *
 * The italic is 1.1em - RELATIVE - because Cormorant reads visibly smaller than
 * Figtree at the same px. Hard-coding a second clamp desynchronises the two
 * voices in the middle of the range, which is what every previous build did.
 *
 * Callers write the turn as real JSX: <Heading>A lot of science. <em>Made
 * remarkably simple.</em></Heading>
 */
export function Heading({
  children,
  id,
  as: As = 'h2',
  tone = 'light',
  className,
}: {
  children: ReactNode;
  id?: string;
  as?: 'h1' | 'h2';
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <As
      id={id}
      className={cn(
        // -0.03em and 1.315 leading are the design's, not a house default
        'font-kyg font-bold tracking-[-0.03em] text-balance',
        // The vw term is measured off the design, not guessed: the h2 is 46px on
        // the 1440 artboard and 32.7px on the 1024 one, and both are 3.194vw.
        // The ceiling is the same ratio on the 1600 rail the Container caps at.
        // The vh term is a GUARD for the 90vh rule in tokens.ts, deliberately
        // loose: at 4.2vh it won an ordinary 1536x800 window and rendered the
        // headline at 33px against the 49px the design asks for. 6.2vh only
        // bites on a viewport that is genuinely short for its width.
        As === 'h1'
          ? 'text-[clamp(30px,min(4.3vw,8.4vh),62px)] leading-[1.1]'
          : 'text-[clamp(24px,min(3.194vw,6.2vh),51px)] leading-[1.315]',
        // The cursive turn, and it OWNS ITS OWN LINE.
        //
        // `block` is not decoration - every headline in the design is drawn with
        // a hard break before the turn, and all twelve of them are two-liners.
        // Leaving it inline and trusting the wrap is what let these collapse
        // onto one line as soon as the viewport got wide enough to fit them:
        // text-balance has no obligation to break where a designer did.
        '[&_em]:block [&_em]:font-tst [&_em]:text-[1.1em] [&_em]:font-medium [&_em]:italic [&_em]:tracking-normal',
        tone === 'dark' ? '[&_em]:text-java2' : '[&_em]:text-eden',
        className
      )}
    >
      {children}
    </As>
  );
}

/** Supporting copy. One size for the whole page. */
export function Lead({
  children,
  tone = 'light',
  className,
}: {
  children: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <p
      className={cn(
        'font-kyg text-[18px] font-normal leading-[1.64]',
        tone === 'dark' ? 'text-linenw/70' : 'text-fusc',
        className
      )}
    >
      {children}
    </p>
  );
}

/**
 * The header block every section opens with: eyebrow, heading, and whatever
 * belongs opposite them.
 *
 * Where the aside sits against the headline is the `asideAlign` prop below.
 */
export function SectionTitle({
  eyebrow,
  eyebrowCaps = true,
  children,
  aside,
  asideAlign = 'end',
  id,
  as,
  tone = 'light',
  className,
  headingClassName,
}: {
  eyebrow: ReactNode;
  eyebrowCaps?: boolean;
  /** The heading. Wrap the cursive turn in <em>. */
  children: ReactNode;
  /** Copy or a CTA opposite the headline. Omit for a full-width header. */
  aside?: ReactNode;
  /**
   * How the aside sits against the headline.
   *
   *   end  its LAST line lands on the headline's last line (the design's
   *        `align-items:flex-end`, and the default)
   *   top  its FIRST line starts on the headline's first line, i.e. inset past
   *        the eyebrow pill
   *
   * Both exist because both are used: a two-line pull quote wants its baseline
   * shared with the headline, while a block that ends in a button does not.
   */
  asideAlign?: 'end' | 'top';
  id?: string;
  as?: 'h1' | 'h2';
  tone?: 'light' | 'dark';
  className?: string;
  headingClassName?: string;
}) {
  return (
    <div
      className={cn(
        // 56 between the columns at 1440, 39.8 at 1024 - both are 3.889vw
        'grid gap-[clamp(20px,3.889vw,62px)]',
        // 61.3% / 34.6% of the rail, which is what the design splits at
        aside ? 'lg:grid-cols-[minmax(0,1.774fr)_minmax(0,1fr)]' : null,
        aside && asideAlign === 'end' ? 'lg:items-end' : null,
        className
      )}
    >
      <div className="min-w-0">
        <Eyebrow tone={tone} caps={eyebrowCaps}>
          {eyebrow}
        </Eyebrow>
        {/* 16 under the pill at 1440, 11.4 at 1024 */}
        <Heading id={id} as={as} tone={tone} className={cn('mt-[clamp(11.4px,1.111vw,17.8px)]', headingClassName)}>
          {children}
        </Heading>
      </div>

      {aside ? <div className={cn('min-w-0', asideAlign === 'top' && 'lg:mt-[55px]')}>{aside}</div> : null}
    </div>
  );
}

export default SectionTitle;
