import { cn } from '@/lib/utils';
import { Button, Icon, Lead, Section, SectionTitle } from '../ui';

/** The three promises, in the source's order. The last one is the payoff. */
const PROMISES = [
  'No complicated science lesson.',
  'No intimidating jargon.',
  'Just better questions and clearer understanding.',
];

const BUBBLE =
  'absolute z-[3] max-w-[min(76%,300px)] rounded-sm px-5 py-[15px] font-kyg text-[15.5px] font-semibold leading-[1.4] tracking-[-0.01em] shadow-[0_4px_16px_0_rgba(45,32,18,0.07),0_18px_50px_0_rgba(45,32,18,0.09)]';

/**
 * `plate` is the shape of the character slot.
 *
 *   portrait  9:10, the transparent PNG's own ratio - what a delivered render
 *             will need, and what the slot has always claimed
 *   wide      455.111 x 396.089, which is what the design actually DRAWS: the
 *             plate is wider than tall and the two columns hang off a shared
 *             bottom edge rather than a shared centre line
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
            with the plate rather than waiting on it. */}
        <div className="relative w-full min-w-0 max-w-[460px] lg:max-w-none">
          <div
            className={cn(
              'grid w-full place-items-center rounded-sm p-[28px] text-center',
              wide ? 'aspect-[455/396]' : 'aspect-[9/10]',
              'bg-[radial-gradient(118%_84%_at_18%_12%,rgba(42,195,162,0.34),transparent_58%),radial-gradient(96%_78%_at_88%_88%,rgba(237,221,184,0.34),transparent_60%),linear-gradient(158deg,#20605B_0%,#154744_58%,#0E3634_100%)]',
              'shadow-[0_4px_16px_0_rgba(45,32,18,0.07),0_18px_50px_0_rgba(45,32,18,0.09)]'
            )}
          >
            <div className="flex flex-col items-center gap-[10px] text-linenw/70">
              <Icon name="chat" className="h-[54px] w-[54px] text-java2" strokeWidth={1.4} />
              <p className="font-kyg text-[14px] font-bold tracking-[0.06em] text-linenw">GENEe Character Asset</p>
              <p className="max-w-[280px] font-kyg text-[12.5px] leading-[1.5]">
                GENEe, the KYG guide character · transparent PNG · 900 × 1000 · 9:10
              </p>
            </div>
          </div>

          <p className={cn(BUBBLE, 'right-0 top-[6%] bg-linenw text-eden lg:right-[-4%]')}>
            Let&rsquo;s ask your genes.
            <span aria-hidden="true" className="absolute -bottom-[6px] left-[32px] block h-4 w-4 rotate-45 bg-linenw" />
          </p>

          <p className={cn(BUBBLE, 'bottom-[9%] left-0 bg-eden text-linenw lg:left-[-5%]')}>
            Why does the same diet affect two people differently?
            <span aria-hidden="true" className="absolute -top-[6px] right-[36px] block h-4 w-4 rotate-45 bg-eden" />
          </p>
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
                  hoverTint && 'transition-colors duration-300 hover:bg-mist'
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
