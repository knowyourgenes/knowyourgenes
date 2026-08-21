import type { ReactNode } from 'react';
import { Container } from '@/components/shared/Container';
import {
  BODY,
  CONTENT_GAP,
  EYEBROW,
  EYEBROW_DASH_TEAL,
  GRAD_TEXT,
  HEADING,
  LEAD,
  SECTION_PY,
  SUBHEADING,
} from './styles';

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const trackChips: { label: string; icon: ReactNode }[] = [
  { label: 'your money', icon: <path d="M12 1v22M5 5h11a4 4 0 010 8H8a4 4 0 000 8h12" /> },
  { label: 'your calories', icon: <path d="M3 12h4l3-9 4 18 3-9h4" /> },
  {
    label: 'your steps',
    icon: (
      <>
        <path d="M9 19V6l11-3v13" />
        <circle cx="6" cy="19" r="3" />
        <circle cx="17" cy="16" r="3" />
      </>
    ),
  },
  { label: 'your sleep', icon: <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /> },
  {
    label: 'your investments',
    icon: (
      <>
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M14 7h7v7" />
      </>
    ),
  },
];

const questions = [
  'Why does the same diet work differently for different people?',
  'Why do some people recover faster?',
  'Why do certain health conditions run in families?',
  'Why do some foods suit one person but not another?',
];

/**
 * WhyKyg - "Why KYG exists": editorial copy + big-number photo panel.
 * Pure Tailwind, static. Type + spacing come from the shared ./styles scale;
 * tightened so the whole section fits within a single large-screen viewport.
 */
export default function WhyKyg() {
  return (
    <section
      id="why"
      className={`relative ${SECTION_PY} min-[1180px]:flex min-[1180px]:min-h-[100dvh] min-[1180px]:items-center`}
    >
      <Container>
        <div className={`grid grid-cols-[1.05fr_1fr] items-stretch ${CONTENT_GAP} max-[1180px]:grid-cols-1`}>
          {/* Left column - copy */}
          <div className="flex flex-col">
            <div className={`${EYEBROW} text-(--c-teal)`}>
              <span className={EYEBROW_DASH_TEAL} />
              Why KYG exists
            </div>

            <h2 className={`mt-[16px] ${HEADING} text-(--ink-1)`}>
              Most people know their Aadhaar number better than their <span className={GRAD_TEXT}>health risks.</span>
            </h2>

            <p className={`mt-[18px] ${LEAD} text-(--ink-2)`}>You track:</p>

            {/* Chips */}
            <div className="mt-[14px] mb-[18px] flex flex-wrap gap-[10px] max-[360px]:gap-[8px]">
              {trackChips.map((chip) => (
                <div
                  key={chip.label}
                  className="inline-flex items-center gap-[10px] rounded-sm border border-(--ink-line) bg-white/70 px-[16px] py-[9px] text-[13.5px] font-medium text-(--ink-2) backdrop-blur-[8px] transition-[transform,background,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:border-[rgba(31,26,20,0.18)] hover:bg-white hover:shadow-[var(--sh-1)] max-[360px]:gap-[7px] max-[360px]:px-[12px] max-[360px]:py-[8px] max-[360px]:text-[12px]"
                >
                  <svg {...svgProps} className="h-[16px] w-[16px] shrink-0 text-(--c-teal)">
                    {chip.icon}
                  </svg>
                  {chip.label}
                </div>
              ))}
            </div>

            <p className="mb-[6px] text-[18px] font-semibold text-(--ink-1) max-[360px]:text-[16px]">
              But do you really understand your own body?
            </p>

            {/* Quote box */}
            <div className="relative mt-[18px] mb-[18px] overflow-hidden rounded-sm border border-[rgba(37,181,171,0.22)] bg-[linear-gradient(160deg,var(--c-teal)_0%,#0a3f3d_100%)] px-[28px] py-[24px] text-(--c-cream) shadow-[0_24px_50px_-22px_rgba(14,77,75,0.42),0_0_0_1px_rgba(37,181,171,0.08)] max-[880px]:px-[20px] max-[880px]:py-[20px] max-[360px]:px-[16px]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_12%_12%,rgba(37,181,171,0.22),transparent_60%),radial-gradient(50%_60%_at_90%_90%,rgba(248,228,204,0.06),transparent_60%)]" />
              <div className="relative z-[1]">
                <div className="mb-[14px] inline-flex items-center gap-[10px] text-[12px] font-bold tracking-[0.2em] text-(--c-peach-2) uppercase">
                  <span className="h-px w-[18px] bg-(--c-peach-2)" />
                  Questions worth asking
                </div>
                {questions.map((q) => (
                  <p
                    key={q}
                    className="relative mb-[8px] pl-[20px] text-[15px] leading-[1.55] text-[rgba(250,246,239,0.92)] max-[360px]:text-[13.5px]"
                  >
                    <span className="absolute top-[10px] left-0 h-[7px] w-[7px] rounded-full bg-(--c-teal-light) shadow-[0_0_0_3px_rgba(37,181,171,0.18)]" />
                    {q}
                  </p>
                ))}
              </div>
            </div>

            <div className={`mt-[10px] ${SUBHEADING} text-(--ink-1)`}>Because every body is different.</div>

            <p className={`mt-[12px] ${BODY} text-(--ink-2)`}>
              KYG helps you understand your body better through personalized wellness intelligence powered by genetics,
              lifestyle science, and expert guidance.
            </p>
          </div>

          {/* Right column - big-number photo panel */}
          <div className="relative flex min-h-[520px] flex-col overflow-hidden rounded-sm bg-(--c-cream-2) max-[880px]:min-h-[340px] max-[360px]:min-h-[280px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="absolute inset-0 z-0 h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1604881991720-f91add269bed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="A thoughtful Indian woman in warm natural light"
            />
            <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(31,26,20,0.15)_0%,rgba(31,26,20,0.55)_70%,rgba(31,26,20,0.85)_100%)]" />
            <div className="relative z-[2] mt-auto p-[32px] text-white max-[880px]:p-[22px] max-[360px]:p-[18px]">
              <div className="[font-family:var(--ff)] text-[clamp(72px,11vw,150px)] leading-[0.85] font-medium tracking-[-0.05em] text-white max-[360px]:text-[58px]">
                1
                <span className="bg-[linear-gradient(120deg,#fff_0%,var(--c-peach-2)_50%,var(--c-teal-light)_100%)] bg-clip-text font-light text-transparent">
                  in
                </span>
                1
              </div>
              <p className="mt-[16px] max-w-[280px] text-[14px] leading-[1.55] text-white/85 max-[360px]:text-[13px]">
                There is no one else with your exact genetic blueprint. That&apos;s the point. And the opportunity.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
