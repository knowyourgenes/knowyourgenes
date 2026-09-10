// =============================================================================
// THE NUMBERS - ink band, 1440x888
// -----------------------------------------------------------------------------
// Frame geometry (all values straight off the Figma node tree):
//   section      pad 92/80  fill #141b1a
//   inner rail   1280, own 32 padding -> 1216 content, VERTICAL gap 36, centred
//     head       680 wide, gap 14 (eyebrow 46 / h2 112 / lead 28)
//     grid       1216, pad-top 20, 5 x 230 cards, gap 16
//     closing    1216, pad-top 8
//     cta row    1216, 245x69 white pill
//   92 + 214 + 36 + 257 + 36 + 56 + 36 + 69 + 92 = 888 ✓
//
// The numerals do NOT follow the two-value `tone`: the frame runs
// #2ac3a2 / #25b5ab / #7fe3d6 across the teal cards and #e39bb4 on the crimson
// one, and each bar has its own fill ratio (34/95/86/121/138 of 172). Neither is
// expressible with today's StatsSection type, so both live here as ordered
// component data - see the report's typeChangesNeeded.
// =============================================================================

import Link from 'next/link';
import { BTN } from '@/components/shared/button-styles';
import { cn } from '@/lib/utils';
import type { Ground, StatsSection } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import StatCard from './StatCard';
import { Closing, ClosingRow, HeadRow, Section } from '../ui';

/**
 * The frame's four numeral/rail accents. Data names one per card, so a future
 * test page can pick its own without editing this component.
 */
const ACCENT: Record<StatsSection['stats'][number]['tone'], string> = {
  java2: '#2ac3a2',
  java: '#25b5ab',
  ice: '#7fe3d6',
  pink: '#e39bb4',
};

export default function Stats({ data, ground }: { data: StatsSection; ground?: Ground }) {
  const { eyebrow, titleHtml, leadHtml } = data.head;

  return (
    <Section ground={ground ?? 'ink'}>
      <div className="flex flex-col items-start gap-9">
        {/* ---- head: 680 wide, gap 14 -------------------------------------- */}
        <HeadRow
          eyebrow={
            eyebrow ? (
              // 182x46 r6, #25b5ab@14 fill, #25b5ab@28 hairline, crimson glow.
              <span className="inline-flex h-[46px] shrink-0 items-center gap-2.5 rounded-sm border border-java/28 bg-java/14 pl-[17px] pr-[22px] shadow-tst-crimson">
                <FigmaIcon id="7007-647" className="h-[26px] w-[22px] shrink-0" />
                <span className="font-kyg text-[14px] font-extrabold uppercase leading-[21px] tracking-[0.08em] text-ice">
                  {eyebrow.label}
                </span>
              </span>
            ) : null
          }
          titleHtml={titleHtml}
          leadHtml={leadHtml}
          headingClassName="pt-[2px] leading-[1.0784] text-linenw"
          leadClassName="text-linenw/70"
          ruleClassName="bg-java"
        />

        {/* ---- five stat cards: 230x237, r22, pad 28, gap 11 ----------------
            Five across only from xl (1280) up, which is where a card is still
            ~198 wide / 142 of content - the width the frame was signed off at.
            At lg (1024) five tracks leave 91px of content per card, which wraps
            the numeral mid-value ("2 to / 3") and shreds the body copy, so the
            row steps down to three (3 + 2) there and at md. */}
        <div className="grid w-full grid-cols-1 gap-4 pt-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {data.stats.map((s, i) => (
            <StatCard key={i} data={s} accent={ACCENT[s.tone]} />
          ))}
        </div>

        {/* ---- closing row: serif note left, white pill right --------------
            The frame puts these on ONE line rather than stacking the button
            under the note. The 44px side padding makes the pill 245 wide, which
            leaves only 35px of slack in the 280px column at 320 - before the
            4px halo - so below sm the padding drops to 32 and the row stacks. */}
        <ClosingRow
          className="pt-2"
          note={<Closing html={data.closingHtml} className="text-[clamp(21px,2.3vw,32px)] text-linenw" />}
          cta={
            data.cta ? (
              <Link
                href={data.cta.href}
                className={cn(
                  BTN,
                  'group border border-white bg-white font-kyg text-[18px] font-extrabold leading-[27px] tracking-[0.004em] text-eden shadow-[0_0_0_4px_rgba(255,255,255,0.16),0_14px_32px_0_rgba(0,0,0,0.22)] transition duration-200 hover:-translate-y-px sm:px-[44px]'
                )}
              >
                {data.cta.label}
                <FigmaIcon
                  id="7654-778"
                  className="h-6 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>
            ) : null
          }
        />
      </div>
    </Section>
  );
}
