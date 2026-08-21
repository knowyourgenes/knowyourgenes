import type { Ground, TimelineSection } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import { Heading, Section } from '../ui';

// =============================================================================
// "The gap" - the years between what your genes already encode and the first
// symptom. Geometry read 1:1 from the frame (section spec 008712_timeline):
//
//   TIMELINE      1280 × 595, vertical, gap 48, centred
//   head          680 wide, gap 14  (eyebrow 46 · h2 114 · lead 28)
//   rail card     1216 × 331, r28, #ffffff, 1px #222222@10, pad 56, gap 12
//                 → inner content column is exactly 1102
//
// The callouts, the nodes and the axis labels are three 4-column grids over
// that same 1102, so a pill, its connector, its node and its label all share
// one column centre for free - no offset maths, and adding a tick still needs
// no layout change.
//
// BELOW 1440 (no frame; judgement): the rail itself never stacks - four columns
// still clear 60 each at 320, which holds a 13.5px "Age 20". What does give way
// is the callout row: below sm the two pills drop to a 2-col grid (so they sit
// over the left and right halves rather than over their own nodes) and their
// connectors are hidden, because a connector that does not land on its node
// reads as an error. Everything else is the same layout at every width.
// =============================================================================

/** 16px terminal node (start = sea, end = mojo) vs the 10px white mid dots. */
const NODE_START = 'size-4 rounded-full bg-sea shadow-[0_0_0_4px_rgba(46,125,91,0.15)]';
const NODE_END = 'size-4 rounded-full bg-mojo shadow-[0_0_0_4px_rgba(192,67,47,0.15)]';
const NODE_MID = 'size-[10px] rounded-full bg-white shadow-[0_0_0_2px_rgba(122,122,122,0.45)]';

/** The rail: a 22px soft trough with a 3px lit line centred inside it. Both run
 *  from the first node centre to the last - i.e. inset by half a column. */
const TROUGH =
  'absolute inset-x-[12.5%] top-1/2 h-[22px] -translate-y-1/2 rounded-sm bg-[linear-gradient(90deg,rgba(14,77,75,0.05)_0%,rgba(37,181,171,0.16)_33.33%,rgba(14,77,75,0.1)_66.67%,rgba(37,181,171,0.05)_100%)]';
const LINE =
  'absolute inset-x-[12.5%] top-1/2 h-[3px] -translate-y-1/2 rounded-sm bg-[linear-gradient(90deg,rgba(34,34,34,0.05)_0%,rgba(34,34,34,0)_16.67%,#25b5ab_33.33%,#0e4d4b_50%,#25b5ab_66.67%,rgba(37,181,171,0)_83.33%,rgba(34,34,34,0.05)_100%)] shadow-[0_0_12px_0_rgba(37,181,171,0.28)]';

/** The two end pills. In the frame these are single-line (174 and 183 wide) in a
 *  1102/4 = 275 column, so nowrap is free. Below lg the column is narrower than
 *  the pill - at 640 it is 127 against 183 - and nowrap would push the pill out
 *  past the card's own padding, so it only turns on once a column can hold it
 *  (>=1024). Under that the label wraps to two lines inside its column. */
const CALLOUT_PILL =
  'max-w-full rounded-sm px-[14px] py-2 text-center font-kyg text-[11.5px] font-bold leading-[15.6px] sm:text-[12.5px] lg:whitespace-nowrap';

export default function Timeline({ data, ground }: { data: TimelineSection; ground?: Ground }) {
  const { eyebrow, titleHtml, leadHtml } = data.head;
  const lastTick = data.ticks.length - 1;

  return (
    <Section ground={ground ?? 'cream'}>
      {/* ---------------------------------------------------------- head ---- */}
      {/* The frame's eyebrow is a TINTED pill (teal@7 ground, 1px teal@15,
          Figtree 800 14/21 ls .08em) - not the white/uppercase one in ui.tsx,
          so it is built here rather than borrowing <Eyebrow/>. */}
      <div className="mx-auto flex w-full max-w-[680px] flex-col items-center gap-[14px] text-center">
        {eyebrow ? (
          <span className="inline-flex items-center gap-2.5 rounded-sm border border-eden/15 bg-eden/[0.07] py-[11px] pl-[17px] pr-[22px] shadow-tst-crimson">
            {/* 22×26 glyph, pulled to a 22px optical box so the pill stays 46 tall */}
            <FigmaIcon id="8722-668" className="my-[-2px] h-[26px] w-[22px] shrink-0" />
            <span className="font-kyg text-[14px] font-extrabold leading-[21px] tracking-[0.08em] text-eden">
              {eyebrow.label}
            </span>
          </span>
        ) : null}

        <Heading html={titleHtml} />

        {leadHtml ? (
          <p
            className="font-kyg text-[clamp(15px,1.29vw,18.5px)] leading-[1.5] text-fusc"
            dangerouslySetInnerHTML={{ __html: leadHtml }}
          />
        ) : null}
      </div>

      {/* ---------------------------------------------------------- card ---- */}
      <div className="mt-[clamp(32px,3.34vw,48px)] flex flex-col gap-3 rounded-sm border border-mine/10 bg-white p-[clamp(20px,3.9vw,56px)] shadow-tst-card">
        {/* callouts - aligned above their own nodes (columns 1 and 4) */}
        <div className="grid grid-cols-2 gap-x-2 sm:grid-cols-4 sm:gap-x-0">
          <div className="col-start-1 flex flex-col items-center px-1">
            <span className={`${CALLOUT_PILL} border border-sea/25 bg-sea/10 text-sea`}>{data.startLabel}</span>
            <span className="mt-2 hidden h-5 w-px bg-sea/40 sm:block" />
          </div>
          <div className="col-start-2 flex flex-col items-center px-1 sm:col-start-4">
            <span className={`${CALLOUT_PILL} border border-mojo/25 bg-mojo/10 text-mojo`}>{data.endLabel}</span>
            <span className="mt-2 hidden h-5 w-px bg-mojo/40 sm:block" />
          </div>
        </div>

        {/* line + nodes */}
        <div className="pt-1">
          <div className="relative h-7">
            <div className={TROUGH} />
            <div className={LINE} />
            <div className="relative grid h-full grid-cols-4 items-center">
              {data.ticks.map((t, i) => (
                <span key={t} className="flex justify-center">
                  <span className={i === 0 ? NODE_START : i === lastTick ? NODE_END : NODE_MID} />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* axis labels */}
        <div className="grid grid-cols-4">
          {data.ticks.map((t) => (
            <span
              key={t}
              className="wrap-break-word text-center font-kyg text-[13.5px] font-semibold leading-[20.2px] text-boulder"
            >
              {t}
            </span>
          ))}
        </div>

        {/* the gap, captioned on its own line */}
        <div className="flex justify-center pt-4">
          <span className="inline-flex items-center gap-2 rounded-sm border border-eden/15 bg-mint px-4 py-2">
            <FigmaIcon id="9213-590" className="my-[-2px] h-6 w-5 shrink-0" />
            <span
              className="text-center font-tst text-[clamp(17px,1.46vw,21px)] font-bold italic leading-[1.5] text-eden2"
              dangerouslySetInnerHTML={{ __html: data.centreChip.label }}
            />
          </span>
        </div>
      </div>
    </Section>
  );
}
