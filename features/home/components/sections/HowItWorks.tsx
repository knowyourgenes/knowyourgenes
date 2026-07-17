import { Container } from '@/components/shared/Container';
import { CONTENT_GAP, EYEBROW, EYEBROW_DASH_TEAL, GRAD_TEXT, HEADING, LEAD, SECTION_PY } from './styles';

/**
 * HowItWorks - five numbered step cards laid out in a row.
 *
 * Pure Tailwind, fully static: the legacy reveal-on-scroll and per-step
 * animation delays are dropped (rendered fully visible). The dotted connector
 * line behind the circles is a static decorative element. The row of 5 cards
 * scrolls horizontally on tablets and collapses to a single column (each step
 * going horizontal) on phones - matching the original CSS exactly. `id="how"`
 * is kept as an in-page nav anchor.
 */
const stepClass =
  'group relative z-[1] flex flex-col max-[560px]:flex-row max-[560px]:items-center max-[560px]:gap-[16px]';

const circleClass =
  'relative mb-[24px] flex h-[88px] w-[88px] items-center justify-center self-start rounded-full border-[1.5px] border-(--ink-line) bg-(--c-cream) text-(--ink-1) transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[4px] group-hover:rotate-[-3deg] group-hover:border-(--ink-1) group-hover:bg-(--ink-1) group-hover:text-(--c-cream) max-[560px]:mb-0 max-[560px]:h-[64px] max-[560px]:w-[64px] max-[560px]:shrink-0';

const svgClass = 'h-[34px] w-[34px] max-[560px]:h-[26px] max-[560px]:w-[26px]';

const numClass =
  'absolute right-[-4px] bottom-[-4px] flex h-[30px] w-[30px] items-center justify-center rounded-full border-[3px] border-(--c-cream) bg-(--c-peach-2) text-[12.5px] font-bold text-(--ink-1) transition-all duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-(--c-teal-light) group-hover:text-white';

const titleClass = 'mb-[8px] text-[16.5px] font-semibold leading-[1.25] tracking-[-0.012em] text-(--ink-1)';

const descClass = 'text-[13.5px] leading-[1.5] text-(--ink-3)';

export default function HowItWorks() {
  return (
    <section id="how" className={`relative ${SECTION_PY}`}>
      <Container>
        {/* Head */}
        <div className="mb-[64px] flex items-end justify-between gap-[40px] max-[1180px]:flex-col max-[1180px]:items-start">
          <div className="max-w-[520px]">
            <div className={`${EYEBROW} text-(--c-teal)`}>
              <span className={EYEBROW_DASH_TEAL} />
              How It Works
            </div>
            <h2 className={`mt-[16px] ${HEADING} text-(--ink-1)`}>
              Simple. Private. <span className={GRAD_TEXT}>Personalized.</span>
            </h2>
          </div>
          <div className="max-w-[420px] pb-[6px]">
            <p className={`${LEAD} text-(--ink-2)`}>
              Five gentle steps from kit-in-box to actionable insight, supported by humans, not just algorithms.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div
          className={`relative grid grid-cols-5 ${CONTENT_GAP} max-[1180px]:grid-cols-[repeat(5,minmax(160px,1fr))] max-[1180px]:overflow-x-auto max-[1180px]:pb-[16px] max-[720px]:grid-cols-1 max-[560px]:overflow-x-visible`}
        >
          {/* Dotted connector line behind the circles (decorative) */}
          <span
            aria-hidden="true"
            className="absolute top-[44px] right-[8%] left-[8%] z-0 h-[1.5px] bg-[repeating-linear-gradient(90deg,var(--c-teal-light)_0_4px,transparent_4px_12px)] opacity-50 max-[1180px]:hidden"
          />

          <div className={stepClass}>
            <div className={circleClass}>
              <svg
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={svgClass}
              >
                <path d="M5 8h22l-2 18a3 3 0 01-3 3H10a3 3 0 01-3-3L5 8z" />
                <path d="M11 8V5a5 5 0 0110 0v3" />
                <path d="M14 16h4M16 14v4" />
              </svg>
              <span className={numClass}>1</span>
            </div>
            <div className={titleClass}>Order Your Wellness Package</div>
            <div className={descClass}>Choose your personalized wellness journey.</div>
          </div>

          <div className={stepClass}>
            <div className={circleClass}>
              <svg
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={svgClass}
              >
                <path d="M12 4h8v22a3 3 0 01-3 3h-2a3 3 0 01-3-3V4z" />
                <path d="M14 10h4M13 16h6" />
                <circle cx="16" cy="22" r="2" fill="currentColor" opacity=".3" stroke="none" />
              </svg>
              <span className={numClass}>2</span>
            </div>
            <div className={titleClass}>Collect Your Saliva Sample</div>
            <div className={descClass}>Simple, non-invasive, and convenient.</div>
          </div>

          <div className={stepClass}>
            <div className={circleClass}>
              <svg
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={svgClass}
              >
                <path d="M10 6 Q16 14 22 6" />
                <path d="M10 16 Q16 24 22 16" />
                <path d="M10 26 Q16 18 22 26" />
                <line x1="13" y1="9" x2="13" y2="13" />
                <line x1="19" y1="9" x2="19" y2="13" />
                <line x1="13" y1="19" x2="13" y2="23" />
                <line x1="19" y1="19" x2="19" y2="23" />
              </svg>
              <span className={numClass}>3</span>
            </div>
            <div className={titleClass}>Advanced Genetic Analysis</div>
            <div className={descClass}>Processed through trusted certified genomics laboratory partners.</div>
          </div>

          <div className={stepClass}>
            <div className={circleClass}>
              <svg
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={svgClass}
              >
                <rect x="7" y="4" width="18" height="24" rx="2" />
                <line x1="11" y1="11" x2="21" y2="11" />
                <line x1="11" y1="16" x2="21" y2="16" />
                <line x1="11" y1="21" x2="17" y2="21" />
                <circle cx="22" cy="23" r="3" fill="currentColor" opacity=".25" stroke="none" />
              </svg>
              <span className={numClass}>4</span>
            </div>
            <div className={titleClass}>Receive Personalized Reports</div>
            <div className={descClass}>Easy-to-understand wellness insights designed for real-life application.</div>
          </div>

          <div className={stepClass}>
            <div className={circleClass}>
              <svg
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={svgClass}
              >
                <path d="M27 18a3 3 0 01-3 3H10l-5 5V8a3 3 0 013-3h18a3 3 0 013 3z" />
                <line x1="11" y1="11" x2="21" y2="11" />
                <line x1="11" y1="15" x2="17" y2="15" />
              </svg>
              <span className={numClass}>5</span>
            </div>
            <div className={titleClass}>Talk to a GENEous Care Expert</div>
            <div className={descClass}>
              Understand what your results actually mean for your lifestyle and wellness goals.
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
