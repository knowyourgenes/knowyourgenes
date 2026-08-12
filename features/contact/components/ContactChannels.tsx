import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CHANNELS } from '../constants';
import type { Channel } from '../types';
import { ContactIcon } from './ContactIcon';

/**
 * LEFT column of the main section — 499 wide, gap 20.
 *
 * Three white cards (r24, 1px #222222@10, pad 28, shadow-tst-soft) then the
 * inverted eden card (r24, no stroke, shadow-tst-card), which additionally
 * carries a blurred 176px java2@15 orb bleeding 56px off its top-right corner.
 *
 * Radii are written as explicit arbitrary values: this project remaps the
 * Tailwind radius scale (--radius: 0.625rem), so rounded-3xl is 22px and
 * rounded-2xl is 18px — neither is the frame's 24 / 16.
 */
function ChannelCard({ data }: { data: Channel }) {
  const inverted = data.tone === 'inverted';

  const inner = (
    <>
      {inverted ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-14 -top-14 size-44 rounded-full bg-java2/15 blur-[40px]"
        />
      ) : null}

      <div className="relative flex items-start gap-4">
        {/* 52x52, r16. The eden card's badge carries no fill in the frame. */}
        <span className={cn('grid size-13 shrink-0 place-items-center rounded-[16px]', inverted ? null : 'bg-mint')}>
          <ContactIcon id={data.icon} className="h-8 w-[26px]" />
        </span>

        <div className="min-w-0 flex-1">
          {/* Figtree 700 11/16.5 ls 1.32 (0.12em), uppercase */}
          <div
            className={cn(
              'font-kyg text-[11px] font-bold uppercase leading-[16.5px] tracking-[0.12em]',
              inverted ? 'text-java2' : 'text-boulder'
            )}
          >
            {data.kicker}
          </div>

          {/* Figtree 800 — 19/28.5 (email, phone), 17/23.4 (lab), 18/24.8 (eden) */}
          <div
            className={cn(
              'mt-[3px] break-words font-kyg font-extrabold',
              data.titleSize === 'sm'
                ? inverted
                  ? 'text-[clamp(16px,1.4vw,18px)] leading-[24.8px]'
                  : 'text-[clamp(15px,1.35vw,17px)] leading-[23.4px]'
                : 'text-[clamp(17px,1.5vw,19px)] leading-[28.5px]',
              inverted ? 'text-linenw' : 'text-mine'
            )}
          >
            {data.title}
          </div>

          {/* Figtree 400 14/19.2 */}
          <p
            className={cn(
              'mt-[7px] font-kyg text-[14px] font-normal leading-[19.2px]',
              inverted ? 'text-linenw/80' : 'text-fusc'
            )}
          >
            {data.body}
          </p>
        </div>
      </div>
    </>
  );

  // p-6 below sm: the frame's 28 padding + the 52 badge + the 16 gap leaves the
  // copy only 154px inside a 320 viewport, which sets the 14px body at ~22
  // characters a line. 24 buys it back; >= 640 keeps the frame's 28 exactly.
  const shell = cn(
    'relative block overflow-hidden rounded-[24px] p-6 transition duration-200 sm:p-7',
    inverted
      ? 'bg-eden shadow-tst-card'
      : 'border border-mine/10 bg-white shadow-tst-soft hover:-translate-y-px hover:shadow-tst-card'
  );

  return data.href ? (
    <Link href={data.href} className={shell}>
      {inner}
    </Link>
  ) : (
    <div className={shell}>{inner}</div>
  );
}

export default function ContactChannels() {
  return (
    <div className="flex flex-col gap-5">
      {CHANNELS.map((c) => (
        <ChannelCard key={c.kicker} data={c} />
      ))}
    </div>
  );
}
