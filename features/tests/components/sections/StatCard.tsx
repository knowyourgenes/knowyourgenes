'use client';

import { cn } from '@/lib/utils';
import type { StatsSection } from '../../types';
import { useCountUp } from '../useCountUp';

type Stat = StatsSection['stats'][number];

/**
 * One card in THE NUMBERS band.
 *
 * Client-only because the reference build animates each card the first time it
 * scrolls past 40% visible: the numeral counts up (when it is a bare number)
 * and the rail grows from 0 to its own ratio. Everything else in <Stats/> stays
 * a server component — this is the only interactive leaf.
 */
export default function StatCard({ data, accent }: { data: Stat; accent: string }) {
  const { ref, shown, entered, isCounted } = useCountUp(data.value);

  // `min-w-0` + `break-words`: a grid item's automatic minimum size is its
  // min-content width, so one long kicker or body token would floor the 1fr
  // track and push the whole row past a 320px viewport. Both are inert at 1440,
  // where the widest word sits far inside the 172px content box.
  return (
    <div
      ref={ref}
      className="flex min-w-0 flex-col gap-[11px] rounded-[22px] border border-linenw bg-white/[0.04] p-7 text-center"
    >
      {/* Figtree 700 10.5/15.8 ls 0.12em #faf6ef@80 */}
      <div className="break-words font-kyg text-[10.5px] font-bold uppercase leading-[15.8px] tracking-[0.12em] text-linenw/80">
        {data.kicker}
      </div>

      {/* Figtree 800 53/53 ls -0.01em, pad 1 / 0 / 5 / 0.
          Values that are not a bare number ("1 in 5", "2 to 3") cannot count,
          so they spring in instead — the build gates on the same condition. */}
      <div className="pb-[5px] pt-px">
        <span
          className={cn(
            'block font-kyg text-[clamp(38px,3.7vw,53px)] font-extrabold leading-none tracking-[-0.01em]',
            !isCounted && 'transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]',
            !isCounted && !entered && 'translate-y-2.5 scale-[0.92] opacity-0'
          )}
          style={{ color: accent }}
        >
          {shown}
        </span>
      </div>

      {/* 172x4 rail, r9999, #ffffff@10 track. `.bar` starts at width 0 and
          transitions once the inline width lands (globals.css). */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="bar h-full rounded-full"
          style={{ width: entered ? `${data.barPercent}%` : 0, backgroundColor: accent }}
        />
      </div>

      {/* Figtree 400 13.5/21.9 #faf6ef@70, pad-bottom 1 */}
      <p
        className="break-words pb-px font-kyg text-[13.5px] leading-[21.9px] text-linenw/70"
        dangerouslySetInnerHTML={{ __html: data.bodyHtml }}
      />
    </div>
  );
}
