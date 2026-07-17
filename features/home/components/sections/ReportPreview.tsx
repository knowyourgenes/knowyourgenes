import { Container } from '@/components/shared/Container';
import { BODY, CONTENT_GAP, EYEBROW, EYEBROW_DASH_TEAL, GRAD_TEXT, HEADING, LEAD, SECTION_PY } from './styles';

/**
 * ReportPreview - "Your Report" section: a mock report card (browser chrome +
 * document with genetic metric bars + a floating "Plain English" info card) on
 * the left, and the descriptive copy with a feature grid on the right.
 *
 * Pure Tailwind, fully static: the floating card keeps its absolute placement
 * but no longer parallaxes, and all reveal/scroll animations are dropped.
 */

const METRICS = [
  { name: 'Vitamin D response', bar: 'w-[36%]', pill: 'bg-[#fde6dc] text-[#b5482b]', status: 'Below avg' },
  { name: 'Caffeine metabolism', bar: 'w-[78%]', pill: 'bg-[#fff1d4] text-[#9a6c0f]', status: 'Fast' },
  { name: 'Lactose tolerance', bar: 'w-[62%]', pill: 'bg-[rgba(37,181,171,0.16)] text-(--c-teal)', status: 'Typical' },
  { name: 'Salt sensitivity', bar: 'w-[84%]', pill: 'bg-[#fff1d4] text-[#9a6c0f]', status: 'Elevated' },
  { name: 'Omega-3 response', bar: 'w-[58%]', pill: 'bg-[#e8f0dc] text-[#557a30]', status: 'Balanced' },
];

export default function ReportPreview() {
  return (
    <section id="report" className={`relative ${SECTION_PY}`}>
      <Container>
        <div className={`grid grid-cols-[1.05fr_1fr] items-center ${CONTENT_GAP} max-[1180px]:grid-cols-1`}>
          {/* ---------- Left: mock report card ---------- */}
          <div className="relative rounded-[var(--r-lg)] bg-[radial-gradient(60%_50%_at_100%_0%,rgba(248,228,204,0.5),transparent_60%),linear-gradient(155deg,var(--c-cream-2)_0%,var(--c-peach)_100%)] p-[40px] shadow-[var(--sh-2)] max-[880px]:p-[28px] max-[560px]:p-[22px]">
            {/* Browser chrome */}
            <div className="mb-[18px] flex items-center gap-[8px]">
              <span className="h-[10px] w-[10px] rounded-full bg-[#E07258] opacity-[.65]" />
              <span className="h-[10px] w-[10px] rounded-full bg-[#E8B14E] opacity-[.65]" />
              <span className="h-[10px] w-[10px] rounded-full bg-[#6BB87B] opacity-[.65]" />
              <span className="ml-auto text-[11px] font-semibold uppercase tracking-[.18em] text-(--ink-3)">
                your-report · kyg
              </span>
            </div>

            {/* Document */}
            <div className="relative rounded-[var(--r-md)] bg-white p-[28px] shadow-[0_18px_50px_rgba(45,32,18,0.1)] max-[560px]:p-[22px]">
              <div className="flex items-center justify-between border-b border-(--ink-line) pb-[18px]">
                <div>
                  <div className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-(--ink-3)">
                    Report · My Diet
                  </div>
                  <div className="mt-[4px] text-[18px] font-semibold text-(--ink-1)">
                    Nutrition &amp; Sensitivity Profile
                  </div>
                </div>
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--c-teal-light),var(--c-teal))] text-[14px] font-bold text-white">
                  KYG
                </div>
              </div>

              {METRICS.map((m) => (
                <div
                  key={m.name}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-[16px] border-b border-(--ink-line) py-[14px] last:border-b-0"
                >
                  <div className="text-[13.5px] font-medium text-(--ink-2)">{m.name}</div>
                  <div className="relative h-[7px] overflow-hidden rounded-[7px] bg-(--c-cream-2)">
                    <div
                      className={`absolute bottom-0 left-0 top-0 rounded-[7px] bg-[linear-gradient(90deg,var(--c-teal-light),var(--c-teal))] ${m.bar}`}
                    />
                  </div>
                  <div
                    className={`whitespace-nowrap rounded-full px-[10px] py-[4px] text-[10.5px] font-semibold tracking-[0.06em] ${m.pill}`}
                  >
                    {m.status}
                  </div>
                </div>
              ))}

              <div className="mt-[18px] flex justify-between border-t border-(--ink-line) pt-[14px] text-[11.5px] text-(--ink-3)">
                <span>27 markers analyzed</span>
                <span>Reviewed by GENEous Care</span>
              </div>
            </div>

            {/* Floating info card (static placement, no parallax) */}
            <div className="absolute bottom-[-18px] right-[-18px] flex max-w-[240px] items-center gap-[12px] rounded-[var(--r-sm)] bg-white px-[18px] py-[14px] shadow-[0_18px_50px_rgba(45,32,18,0.16)] max-[880px]:bottom-[-12px] max-[880px]:right-[8px] max-[880px]:max-w-[calc(100%-16px)] max-[560px]:static max-[560px]:bottom-auto max-[560px]:right-auto max-[560px]:mt-[14px] max-[560px]:max-w-full">
              <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[12px] bg-(--ink-1) text-white">
                <svg
                  className="h-[18px] w-[18px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div className="text-[12.5px] leading-[1.35] text-(--ink-2)">
                <b className="mb-[2px] block font-semibold text-(--ink-1)">Plain English</b>
                Every result, explained.
              </div>
            </div>
          </div>

          {/* ---------- Right: copy + feature grid ---------- */}
          <div>
            <div className={`${EYEBROW} text-(--c-teal)`}>
              <span className={EYEBROW_DASH_TEAL} />
              Your Report
            </div>

            <h2 className={`mt-[16px] ${HEADING} text-(--ink-1)`}>
              Personalized insights, <span className={GRAD_TEXT}>backed by science.</span>
            </h2>

            <p className={`mt-[18px] ${LEAD} text-(--ink-2)`}>
              Your report is designed to simplify complex genetic science into practical wellness understanding.
            </p>

            <p className={`mt-[18px] ${BODY} text-(--ink-2)`}>
              Each insight includes your genetic response, simplified interpretation, wellness implications, food
              recommendations, lifestyle guidance, and actionable next steps.
            </p>

            <div className="mt-[36px] grid grid-cols-2 gap-[14px] max-[720px]:grid-cols-1 max-[720px]:gap-[12px]">
              <div className="flex items-start gap-[14px] rounded-[var(--r-sm)] border border-(--ink-line) bg-white/60 px-[20px] py-[18px] backdrop-blur-[8px] transition-all duration-500 ease-[var(--e-out)] hover:-translate-y-[2px] hover:border-[rgba(31,26,20,0.16)] hover:bg-white max-[720px]:px-[16px] max-[720px]:py-[14px]">
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,var(--c-peach)_0%,var(--c-peach-2)_100%)] text-(--c-teal)">
                  <svg
                    className="h-[18px] w-[18px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                  </svg>
                </div>
                <div className="text-[14px] font-medium leading-[1.4] text-(--ink-1)">Easy-to-understand summaries</div>
              </div>

              <div className="flex items-start gap-[14px] rounded-[var(--r-sm)] border border-(--ink-line) bg-white/60 px-[20px] py-[18px] backdrop-blur-[8px] transition-all duration-500 ease-[var(--e-out)] hover:-translate-y-[2px] hover:border-[rgba(31,26,20,0.16)] hover:bg-white max-[720px]:px-[16px] max-[720px]:py-[14px]">
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,var(--c-peach)_0%,var(--c-peach-2)_100%)] text-(--c-teal)">
                  <svg
                    className="h-[18px] w-[18px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </div>
                <div className="text-[14px] font-medium leading-[1.4] text-(--ink-1)">
                  Color-coded wellness indicators
                </div>
              </div>

              <div className="flex items-start gap-[14px] rounded-[var(--r-sm)] border border-(--ink-line) bg-white/60 px-[20px] py-[18px] backdrop-blur-[8px] transition-all duration-500 ease-[var(--e-out)] hover:-translate-y-[2px] hover:border-[rgba(31,26,20,0.16)] hover:bg-white max-[720px]:px-[16px] max-[720px]:py-[14px]">
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,var(--c-peach)_0%,var(--c-peach-2)_100%)] text-(--c-teal)">
                  <svg
                    className="h-[18px] w-[18px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                  </svg>
                </div>
                <div className="text-[14px] font-medium leading-[1.4] text-(--ink-1)">Personalized recommendations</div>
              </div>

              <div className="flex items-start gap-[14px] rounded-[var(--r-sm)] border border-(--ink-line) bg-white/60 px-[20px] py-[18px] backdrop-blur-[8px] transition-all duration-500 ease-[var(--e-out)] hover:-translate-y-[2px] hover:border-[rgba(31,26,20,0.16)] hover:bg-white max-[720px]:px-[16px] max-[720px]:py-[14px]">
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,var(--c-peach)_0%,var(--c-peach-2)_100%)] text-(--c-teal)">
                  <svg
                    className="h-[18px] w-[18px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-[14px] font-medium leading-[1.4] text-(--ink-1)">
                  Lifestyle-focused interpretation
                </div>
              </div>

              <div className="col-span-2 flex items-start gap-[14px] rounded-[var(--r-sm)] border border-(--ink-line) bg-white/60 px-[20px] py-[18px] backdrop-blur-[8px] transition-all duration-500 ease-[var(--e-out)] hover:-translate-y-[2px] hover:border-[rgba(31,26,20,0.16)] hover:bg-white max-[880px]:col-auto max-[720px]:px-[16px] max-[720px]:py-[14px]">
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,var(--c-peach)_0%,var(--c-peach-2)_100%)] text-(--c-teal)">
                  <svg
                    className="h-[18px] w-[18px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div className="text-[14px] font-medium leading-[1.4] text-(--ink-1)">
                  Wellness-oriented guidance. Not clinical jargon, not generic advice.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
