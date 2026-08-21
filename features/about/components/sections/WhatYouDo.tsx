// =============================================================================
// About Us - SECTION 07 · WHAT DO YOU DO WITH THE INFORMATION
// -----------------------------------------------------------------------------
// Figma: header block (740) → 2×2 question cards (960) → conversation-starter
// callout (980) → QUESTION → CONVERSATION → AWARENESS → INFORMED CHOICE flow.
// Section stack gap is 40; the cards grid and the flow row each carry the
// frame's extra 8px top pad.
//
// RADIUS: one radius site-wide - rounded-sm. See docs/DESIGN.md §2.
// =============================================================================

import { Fragment } from 'react';

import { AboutIcon } from '../AboutIcon';
import { Eyebrow, Heading, Photo, Section } from '../ui';

/** The four "click to consider" cards - Figma order is row-major. */
const QUESTIONS: { icon: string; text: string }[] = [
  { icon: '7243-280', text: "Could this explain something I've always wondered about?" },
  { icon: '7243-770', text: 'Should I pay more attention to this part of my lifestyle?' },
  { icon: '7370-280', text: 'What should I discuss with my doctor or health professional?' },
  { icon: '7370-770', text: 'Is there something I can do differently?' },
];

/**
 * The visual flow rail. The last step is the filled eden chip.
 *
 * CASE: these four labels are textCase=AS_TYPED in the frame - none of them is in
 * the About uppercase manifest, and the 0.02em tracking below is body tracking,
 * not uppercase tracking. The Hero renders a similar Question/Awareness chain that
 * IS uppercase (y 1107, 13px, 0.14em); same words, different run. Keep these
 * sentence case.
 */
const FLOW: { icon: string; label: string; accent?: boolean }[] = [
  { icon: '7832-261', label: 'Question' },
  { icon: '7832-503', label: 'Conversation' },
  { icon: '7832-776', label: 'Awareness' },
  { icon: '7832-1031', label: 'Informed choice', accent: true },
];

export default function WhatYouDo() {
  return (
    <Section id="what-you-do" ground="cream">
      <div className="flex flex-col items-center gap-10">
        {/* ---------------------------------------------------------------- */}
        {/* Header - eyebrow + h2, 740 rail, centred                          */}
        {/* ---------------------------------------------------------------- */}
        <div className="mx-auto flex w-full max-w-[740px] flex-col items-center gap-[15px] text-center">
          <Eyebrow label="What do you do with the information?" icon="7022-532" />
          <Heading
            className="text-[clamp(28px,3.4vw,42px)] leading-[1.05]"
            html='Having information is useful. <em class="abt-grad">Knowing <br class="hidden lg:inline" />what it means is better.</em>'
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Interactive questions (click to consider) - 2 × 470 cards         */}
        {/* ---------------------------------------------------------------- */}
        <ul className="mx-auto grid w-full max-w-[960px] grid-cols-1 gap-5 pt-2 md:grid-cols-2">
          {QUESTIONS.map((q) => (
            <li
              key={q.icon}
              className="relative min-w-0 overflow-hidden rounded-sm border border-mine/10 bg-white p-7 shadow-tst-soft"
            >
              {/* qglow - mint blob bleeding out of the top-right corner */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-[55px] -top-[55px] h-40 w-40 rounded-full bg-mint blur-[20px]"
              />
              <div className="relative flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-mint">
                  <AboutIcon id={q.icon} className="h-[26px] w-[22px]" />
                </span>
                <div className="flex min-h-[44px] min-w-0 flex-1 items-center">
                  <p className="min-w-0 break-words font-kyg text-[clamp(16px,1.35vw,18px)] font-semibold leading-[1.38] text-[#2d2a24]">
                    {q.text}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* ---------------------------------------------------------------- */}
        {/* Conversation-starter callout - tinted panel + copy                */}
        {/* ---------------------------------------------------------------- */}
        <div className="mx-auto grid w-full max-w-[980px] grid-cols-1 overflow-hidden rounded-sm border border-eden/20 bg-white shadow-tst-soft md:grid-cols-[477fr_501fr]">
          {/* The designer's photograph (frame 2084:4145). Filling this slot sets
              its placeholder overlay - glyph 7594-453 and the caption "A real
              conversation" - to HIDDEN in the frame, so the photo replaces the
              stand-in. Source is 4:3 into a 1.64:1 slot, so object-cover trims
              top and bottom only. */}
          <Photo
            src="/about/img/real-conversation.jpg"
            alt="Two people talking over a tablet at a kitchen table."
            className="min-h-[200px] min-w-0"
            sizes="(min-width: 768px) 48vw, 100vw"
          />

          <div className="flex min-w-0 flex-col justify-center bg-mint/40 p-[clamp(24px,4vw,40px)]">
            <p className="mb-3 break-words font-kyg text-[clamp(21px,2.1vw,28px)] font-semibold leading-[1.38] text-mine">
              A genetic insight isn&apos;t a command. <em className="abt-grad">It&apos;s a conversation starter.</em>
            </p>
            <p className="break-words font-kyg text-[clamp(15px,1.2vw,17px)] font-normal leading-[1.62] text-fusc">
              The goal isn&apos;t to make every decision based on your genes. It&apos;s to give you one more informed
              piece of the puzzle.
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Flow: QUESTION → CONVERSATION → AWARENESS → INFORMED CHOICE       */}
        {/* ---------------------------------------------------------------- */}
        {/*
          The frame is ONE unbroken 960 rail: 645 of fixed-width chips + 54 of
          gaps + three 87px connectors. The chips cannot shrink, so 699px is the
          floor for a single row - more than the 688 available at 768. A wrapping
          row therefore stranded a connector at a row edge (and started a row
          with one) anywhere between 640 and ~1085.
          So the connectors exist only from lg up, where the row is also switched
          to nowrap and each connector flexes into whatever the chips leave
          (basis 0, so it can never force a wrap; capped at the frame's 87px,
          which is exactly what it gets once the rail hits its 960 cap).
          Below lg the connectors are gone and the chips wrap on their own - no
          rule ever points at nothing.
        */}
        <div className="mx-auto flex w-full max-w-[960px] flex-wrap items-center justify-center gap-x-[9px] gap-y-3 pt-2 lg:flex-nowrap">
          {FLOW.map((step, i) => (
            <Fragment key={step.label}>
              {i > 0 ? (
                <span
                  aria-hidden="true"
                  className="relative hidden h-[2px] min-w-0 max-w-[87px] flex-1 rounded-sm bg-gradient-to-r from-eden/[0.14] via-java/[0.55] to-eden/[0.14] lg:block"
                >
                  <span className="absolute -left-[3px] top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-java shadow-[0_0_10px_0_rgba(37,181,171,0.85)]" />
                </span>
              ) : null}
              <span
                className={
                  step.accent
                    ? 'inline-flex h-[49px] shrink-0 items-center gap-2 rounded-sm border border-eden bg-eden px-[21px] shadow-[0_12px_30px_0_rgba(14,77,75,0.28)]'
                    : 'inline-flex h-[49px] shrink-0 items-center gap-2 rounded-sm border border-mine/[0.12] bg-white px-[21px] shadow-tst-soft'
                }
              >
                <AboutIcon id={step.icon} className="h-[25px] w-[21px] shrink-0" />
                <span
                  className={
                    step.accent
                      ? 'font-kyg text-[15px] font-extrabold leading-[17.2px] tracking-[0.02em] text-linenw'
                      : 'font-kyg text-[15px] font-extrabold leading-[17.2px] tracking-[0.02em] text-mine'
                  }
                >
                  {step.label}
                </span>
              </span>
            </Fragment>
          ))}
        </div>
      </div>
    </Section>
  );
}
