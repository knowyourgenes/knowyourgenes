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
import type { Ground, StatsSection } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import StatCard from './StatCard';
import { Closing, Heading, Lead, Section } from '../ui';

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
      <div className="flex flex-col items-center gap-9">
        {/* ---- head: 680 wide, gap 14 -------------------------------------- */}
        <div className="flex w-full max-w-[680px] flex-col items-center gap-[14px] text-center">
          {eyebrow ? (
            // 182x46 r999, #25b5ab@14 fill, #25b5ab@28 hairline, crimson glow.
            <span className="inline-flex h-[46px] shrink-0 items-center gap-2.5 rounded-full border border-java/28 bg-java/14 pl-[17px] pr-[22px] shadow-tst-crimson">
              <FigmaIcon id="7007-647" className="h-[26px] w-[22px] shrink-0" />
              <span className="font-kyg text-[14px] font-extrabold uppercase leading-[21px] tracking-[0.08em] text-ice">
                {eyebrow.label}
              </span>
            </span>
          ) : null}

          {/* Figtree 700 51/55 ls -0.02em #faf6ef - breaks after "are". */}
          <Heading html={titleHtml} className="pt-[2px] leading-[1.0784] text-linenw" />

          {/* Figtree 400 18.5/27.8 #faf6ef@70 */}
          {leadHtml ? (
            <Lead html={leadHtml} className="text-[clamp(15px,1.3vw,18.5px)] leading-[1.5027] text-linenw/70" />
          ) : null}
        </div>

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

        {/* ---- closing: Cormorant 700 italic 32/48 #faf6ef, pad-top 8 ------- */}
        <Closing html={data.closingHtml} className="pt-2 text-[clamp(21px,2.3vw,32px)] text-linenw" />

        {/* ---- cta: 245x69 white pill, 4px white halo + deep drop ----------
            The 44px side padding makes the pill 245 wide, which leaves only
            35px of slack in the 280px column at 320 - before the 4px halo. It
            is `whitespace-nowrap`, so a label any longer than this one would
            push the page sideways; below sm the padding drops to 32. */}
        {data.cta ? (
          <div className="flex w-full justify-center">
            <Link
              href={data.cta.href}
              className="group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full border border-white bg-white px-8 py-5 font-kyg text-[18px] font-extrabold leading-[27px] tracking-[0.004em] text-eden shadow-[0_0_0_4px_rgba(255,255,255,0.16),0_14px_32px_0_rgba(0,0,0,0.22)] transition duration-200 hover:-translate-y-px sm:px-[44px]"
            >
              {data.cta.label}
              <FigmaIcon
                id="7654-778"
                className="h-6 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
