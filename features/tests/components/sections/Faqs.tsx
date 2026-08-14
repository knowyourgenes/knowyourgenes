'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/utils';
import type { FaqsSection, Ground } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import { Heading, Lead, Section } from '../ui';

// =============================================================================
// FAQ - 1440 frame, section spec 016367_faq. Geometry read 1:1 from the frame:
//
//   FAQ frame     860 x 655 at x=290, vertical, pad 0/32, gap 48
//                 → the content rail is exactly 796, centred in the 1216 column
//   head          796, gap 16, centred: eyebrow 46 · h2 57
//   eyebrow       232 x 46, r999, #c73c70@10 ground, 1px #c73c70@24,
//                 0 6 18 rgba(199,60,112,.1), pad 11/22/11/17 gap 10.
//                 Label Figtree 800 14/21 ls .08em #9a2855 - sentence case,
//                 NOT uppercase (the frame's literal string is "Before you
//                 decide" at 159px wide).
//   list          796, vertical, gap 12 - six 71-tall rows (167→583, step 83)
//   row           r16, #ffffff, 1px #222222@10, NO shadow
//   button        794 x 69, pad 20/24, gap 16, centred
//                 → question 705 (flex-1) + 16 + plus 25 = 746 content
//   question      Figtree 700 19.5/29.2 ls 0 #222222, left
//   plus          25 slot; the glyph itself is 25x31 and overhangs 3px each way
//
// Every row is CLOSED in the frame, so the answer panel below has no Figma
// counterpart - it inherits the page's standard 17.5/26 body type. State lives
// in React (not <details>) because the + → × rotation has to animate.
//
// The H2 accent ("answered.") is the frame's 5-stop teal gradient. That already
// ships as `.tst-em-teal` in globals.css (@layer components, background-clip:
// text), so the data's <em class="tst-em-teal"> gets it for free - nothing to
// re-declare here.
// =============================================================================

/** The +/× toggle. Each of the six rows carries its own node id in the frame
 *  (16554 / 16637 / 16721 / 16804 / 16887 / 16970, all at x=1068) but the six
 *  exported files are byte-identical, so one id serves all six and the browser
 *  fetches the glyph once. */
const PLUS_ICON = '16554-1068';

export default function Faqs({ data, ground }: { data: FaqsSection; ground?: Ground }) {
  const [open, setOpen] = useState<number | null>(null);
  const uid = useId();
  const { eyebrow, titleHtml, leadHtml } = data.head;

  return (
    <Section ground={ground ?? 'cream'} id="faq">
      {/* the frame's 796 rail, with its own 48 gap between head and list */}
      <div className="mx-auto flex w-full max-w-[796px] flex-col gap-[clamp(32px,3.34vw,48px)]">
        {/* ---------------------------------------------------------- head ---- */}
        {/* A CRIMSON-TINTED pill, not the white/uppercase one in ui.tsx, so it is
            built here rather than borrowing <Eyebrow/>. */}
        <div className="flex flex-col items-center gap-4 text-center">
          {eyebrow ? (
            <span className="inline-flex items-center gap-2.5 rounded-full border border-crimson/24 bg-crimson/10 py-[11px] pl-[17px] pr-[22px] shadow-tst-crimson">
              {/* 22x22 slot; the glyph is 22x26 and overhangs 2px, as in the frame */}
              <FigmaIcon id="16377-622" className="-my-0.5 block h-[26px] w-[22px] shrink-0" />
              <span className="font-kyg text-[14px] font-extrabold leading-[21px] tracking-[0.08em] text-crimson-deep">
                {eyebrow.label}
              </span>
            </span>
          ) : null}

          {/* h2 is the full 796 rail in the frame - no narrower measure. */}
          <Heading html={titleHtml} />

          {leadHtml ? <Lead html={leadHtml} /> : null}
        </div>

        {/* --------------------------------------------------------- rows ---- */}
        <ul className="flex flex-col gap-3">
          {data.items.map((it, i) => {
            const isOpen = open === i;
            const btnId = `${uid}-q${i}`;
            const panelId = `${uid}-a${i}`;

            return (
              // rounded-[16px], not rounded-2xl: this project's @theme remaps
              // --radius-2xl to 18px, and the frame's row radius is 16.
              <li key={i} className="overflow-hidden rounded-[16px] border border-mine/10 bg-white">
                <button
                  type="button"
                  id={btnId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  // 24/16 is the frame's row padding; below sm it costs the
                  // question a fifth of its measure, so it steps down to 20/12
                  // there and is back on the frame's numbers from 640 up.
                  className="flex w-full items-center gap-3 px-5 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-java sm:gap-4 sm:px-6"
                >
                  {/* Figtree 700 19.5/29.2 #222222 → 29.2 / 19.5 = 1.4974 */}
                  <span
                    className="min-w-0 flex-1 wrap-break-word font-kyg text-[clamp(16px,1.36vw,19.5px)] font-bold leading-[1.4974] text-mine"
                    dangerouslySetInnerHTML={{ __html: it.q }}
                  />
                  {/* 25x31 glyph pulled back to a 25px optical box; the plus is
                      centred on the image, so 45° turns it into a × in place. */}
                  <FigmaIcon
                    id={PLUS_ICON}
                    className={cn(
                      '-my-[3px] block h-[31px] w-[25px] shrink-0 transition-transform duration-300',
                      isOpen && 'rotate-45'
                    )}
                  />
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={cn(
                    'grid transition-all duration-300 ease-out',
                    // `invisible` keeps a closed answer out of the a11y tree and
                    // the tab order. visibility is specially interpolated, so it
                    // still stays painted for the whole 300ms collapse.
                    isOpen ? 'visible grid-rows-[1fr] opacity-100' : 'invisible grid-rows-[0fr] opacity-0'
                  )}
                >
                  <div className="overflow-hidden">
                    <p
                      className="wrap-break-word px-5 pb-5 font-kyg text-[clamp(14.5px,1.25vw,17.5px)] leading-[1.486] text-fusc sm:px-6"
                      dangerouslySetInnerHTML={{ __html: it.a }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
