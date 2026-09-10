import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button, Icon, Lead, Section, SectionTitle } from '../ui';

/** The three promises, in the source's order. The last one is the payoff. */
const PROMISES = [
  'No complicated science lesson.',
  'No intimidating jargon.',
  'Just better questions and clearer understanding.',
];

/**
 * The two floating quotes.
 *
 * SMALLER BELOW `sm`, because the plate is not. On a 390px phone the plate is
 * 354 wide against roughly 700 on a desktop, but the bubbles kept their full
 * 15.5px/20px box - so together they covered the middle of the plate instead of
 * hanging off its corners, and the dark one cut straight through the caption.
 */
const BUBBLE =
  'absolute z-[3] rounded-sm px-4 py-3 font-kyg text-[15px] font-semibold leading-[1.4] tracking-[-0.01em] shadow-[0_4px_16px_0_rgba(45,32,18,0.07),0_18px_50px_0_rgba(45,32,18,0.09)] sm:px-5 sm:py-[15px] sm:text-[15.5px]';

/**
 * The blobs behind the character.
 *
 * Circles, not the plate's own radial washes - the design draws discrete soft
 * discs with a visible edge, which a background gradient cannot do without
 * banding. `w-[N%] aspect-square` rather than `h-[N%] w-[N%]`, because the
 * plate is not square and percentage height would make every one an ellipse.
 *
 * Positions are the disc's top-left, worked back from its centre in the design:
 * a centre at 13%/14% with a diameter of 52% of the width lands at -13% left,
 * and -3% top once 26% of the WIDTH is converted into a share of the HEIGHT.
 * They therefore only hold at the phone's 2:3 plate, which is why they stop at
 * `sm` - the desktop plate has its own gradient treatment and is untouched.
 */
const BLOBS = [
  'left-[-13%] top-[-3%] w-[52%]',
  'left-[56%] top-[51%] w-[68%]',
  'left-[-13%] top-[62%] w-[41%]',
];

/**
 * `plate` is the shape of the character slot.
 *
 *   portrait  9:10, the transparent PNG's own ratio - what a delivered render
 *             will need, and what the slot has always claimed
 *   wide      455.111 x 396.089, which is what the design actually DRAWS: the
 *             plate is wider than tall and the two columns hang off a shared
 *             bottom edge rather than a shared centre line
 *
 * Neither applies on a phone, where the plate is 2:3 regardless. A wide plate
 * at 354px is 308px tall, and two quotes plus a caption do not fit in that
 * without one of them sitting on another. Portrait is also the shape the real
 * artwork wants, so this is the one width where the placeholder is already
 * standing in the right box.
 *
 * They differ because the artwork does not exist yet. Once it does, the plate
 * stops being a placeholder and this prop stops being interesting.
 */
export default function MeetGenee({
  plate = 'portrait',
  /** Same java2 hover as the other light-ground lists. */
  hoverTint = false,
}: { plate?: 'portrait' | 'wide'; hoverTint?: boolean } = {}) {
  const wide = plate === 'wide';
  return (
    <Section id="meet-genee" ground="cream" labelledBy="genee-heading">
      <div
        className={cn(
          'grid gap-[clamp(28px,3.6vw,64px)]',
          wide
            ? 'items-end lg:grid-cols-[minmax(0,1.0509fr)_minmax(0,1fr)]'
            : 'items-center lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]'
        )}
      >
        {/* The character plate. Still a plate rather than a render: GENEe is the
            one slot on this page whose artwork has not been delivered, and a
            labelled placeholder is honest where a stock illustration would not
            be. The two bubbles are the section's whole personality, so they ship
            with the plate rather than waiting on it.

            The top padding is what the white quote hangs into. It is on the
            wrapper rather than the section so the overhang stays inside the grid
            item's box and the row gap below still measures its full 28px to the
            heading. */}
        <div className="relative w-full min-w-0 max-w-[460px] pt-[26px] sm:pt-0 lg:max-w-none">
          <div
            className={cn(
              'relative grid w-full place-items-center overflow-hidden rounded-sm p-[28px] text-center',
              // The question card owns the bottom of the plate, so the group
              // centres against a shorter box and lands on the optical middle
              // rather than the geometric one.
              'pb-[64px] sm:pb-[28px]',
              'aspect-[2/3]',
              wide ? 'sm:aspect-[455/396]' : 'sm:aspect-[9/10]',
              'bg-[radial-gradient(118%_84%_at_18%_12%,rgba(42,195,162,0.34),transparent_58%),radial-gradient(96%_78%_at_88%_88%,rgba(237,221,184,0.34),transparent_60%),linear-gradient(158deg,#20605B_0%,#154744_58%,#0E3634_100%)]',
              'shadow-[0_4px_16px_0_rgba(45,32,18,0.07),0_18px_50px_0_rgba(45,32,18,0.09)]'
            )}
          >
            {BLOBS.map((pos) => (
              <span
                key={pos}
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute aspect-square rounded-full bg-java2/[0.09] blur-[4px] sm:hidden',
                  pos
                )}
              />
            ))}

            <div className="relative flex flex-col items-center gap-[10px] text-linenw/70">
              <span className="relative grid place-items-center">
                {/* The glow the design puts under the mark. Its own circle
                    rather than a shadow, so the blur can be far wider than the
                    glyph without smearing the strokes. */}
                <span
                  aria-hidden="true"
                  className="absolute h-[118px] w-[118px] rounded-full bg-java2/[0.16] blur-2xl sm:hidden"
                />
                <Icon name="chat" className="relative h-[70px] w-[70px] text-java2 sm:h-[54px] sm:w-[54px]" strokeWidth={1.4} />
              </span>
              <p className="font-kyg text-[19px] font-bold tracking-[-0.012em] text-linenw sm:text-[14px] sm:tracking-[0.06em]">
                GENEe Character Asset
              </p>
              <p className="max-w-[280px] font-kyg text-[13.5px] leading-[1.5] sm:text-[12.5px]">
                GENEe, the KYG guide character · transparent PNG · 900 × 1000 · 9:10
              </p>
            </div>
          </div>

          <p className={cn(BUBBLE, 'right-0 top-0 max-w-[min(76%,300px)] bg-linenw text-eden sm:top-[6%] lg:right-[-4%]')}>
            Let&rsquo;s ask your genes.
            <span aria-hidden="true" className="absolute -bottom-[6px] left-[32px] block h-4 w-4 rotate-45 bg-linenw" />
          </p>

          {/*
            The question, as a link rather than a caption.
            The design gives it an arrow in a filled circle, and an arrow in a
            circle is a promise - so it goes where the section's own CTA goes,
            rather than being a button that does nothing. On a phone it spans the
            plate and sits on its bottom edge; from `sm` it returns to the tailed
            quote hanging off the plate's lower-left.
          */}
          <Link
            href="/categories"
            className={cn(
              BUBBLE,
              'group/ask flex items-center gap-3 bg-eden text-linenw transition-colors hover:bg-eden2',
              'bottom-0 left-[5%] right-[5%]',
              'sm:bottom-[9%] sm:left-0 sm:right-auto sm:block sm:max-w-[min(76%,300px)] lg:left-[-5%]'
            )}
          >
            <span>Why does the same diet affect two people differently?</span>
            {/* A true circle, which is the one place rounded-full is legal
                (docs/DESIGN.md §2). 44px is also the minimum touch target. */}
            <span
              aria-hidden="true"
              className="grid h-[44px] w-[44px] shrink-0 place-items-center rounded-full bg-java2 text-eden sm:hidden"
            >
              <Icon name="arrow" className="h-[19px] w-[19px]" />
            </span>
            <span
              aria-hidden="true"
              className="absolute -top-[6px] right-[36px] hidden h-4 w-4 rotate-45 bg-eden group-hover/ask:bg-eden2 sm:block"
            />
          </Link>
        </div>

        <div className="min-w-0">
          {/* `caps={false}` on purpose - this eyebrow is a name. */}
          <SectionTitle id="genee-heading" eyebrow="Meet GENEe" eyebrowCaps={false}>
            Genetics sounds complicated. <em>Good thing GENEe doesn&rsquo;t.</em>
          </SectionTitle>

          <p className="mt-[22px] font-kyg text-[clamp(19px,1.45vw,24px)] leading-[1.46] tracking-[-0.015em] text-heavy2">
            Meet GENEe, your curious guide to the world inside you.
          </p>

          <Lead className="mt-[16px] max-w-[64ch]">
            From explaining why the same diet can affect two people differently to helping you understand unfamiliar
            genetic concepts, GENEe makes genetics simpler, friendlier and easier to explore.
          </Lead>

          <ul className="my-[clamp(24px,2.6vw,34px)] grid list-none gap-[12px]">
            {PROMISES.map((p) => (
              <li
                key={p}
                className={cn(
                  'group/promise flex items-center gap-[13px] rounded-sm bg-eden/[0.07] py-3 pl-4 pr-5 font-kyg text-[15.5px] leading-[1.45] text-zeus',
                  hoverTint && 'transition-colors duration-300 hover:bg-mist active:bg-mist'
                )}
              >
                <Icon name="check" className={'h-[19px] w-[19px] shrink-0 text-eden'} />
                {p}
              </li>
            ))}
          </ul>

          <div className="flex">
            <Button href="/categories">Meet GENEe</Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
