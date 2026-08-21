import type { ReactNode } from 'react';
import { Container } from '@/components/shared/Container';
import { CONTENT_GAP, EYEBROW, EYEBROW_DASH_TEAL, GRAD_TEXT, HEADING, LEAD, SECTION_PY, SUBHEADING } from './styles';

/**
 * SeniorCare - KYG Senior Care split section (copy + feature pills + photo).
 *
 * Pure Tailwind, fully static: the legacy version's reveal/reveal-r scroll-ins
 * and the parallax image drift (`data-speed`) are dropped. The only motion kept
 * is a plain CSS hover lift on the feature pills. `id="senior"` stays as it is a
 * nav anchor target.
 */

const pills: { icon: ReactNode; text: string }[] = [
  {
    icon: (
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
    ),
    text: 'Healthy aging & wellness understanding',
  },
  {
    icon: (
      <>
        <rect x="4" y="6" width="16" height="14" rx="2" />
        <path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2" />
        <path d="M12 11v6M9 14h6" />
      </>
    ),
    text: 'Medication compatibility awareness',
  },
  {
    icon: <path d="M3 12h4l3-9 4 18 3-9h4" />,
    text: 'Cardiac & diabetes-related insights',
  },
  {
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
      </>
    ),
    text: 'Preventive health literacy',
  },
];

export default function SeniorCare() {
  return (
    <section
      id="senior"
      className={`relative bg-[radial-gradient(60%_50%_at_100%_0%,rgba(243,213,178,0.55),transparent_60%),radial-gradient(50%_50%_at_0%_100%,rgba(248,228,204,0.45),transparent_60%)] ${SECTION_PY}`}
    >
      <Container className="max-w-[var(--max-w-wide,1530px)]">
        <div className={`grid grid-cols-[1.05fr_1fr] items-center ${CONTENT_GAP} max-[1180px]:grid-cols-1`}>
          {/* Copy column */}
          <div>
            <div className={`${EYEBROW} text-(--c-teal)`}>
              <span className={EYEBROW_DASH_TEAL} />
              KYG Senior Care
            </div>

            <h2 className={`mt-[16px] ${HEADING} text-(--ink-1)`}>
              Your parents deserve <span className={GRAD_TEXT}>informed healthcare too.</span>
            </h2>

            <p className={`mt-[18px] max-w-[540px] ${LEAD} text-(--ink-2)`}>
              As India enters an era of rising lifestyle diseases and chronic health conditions, preventive wellness for
              parents becomes more important than ever.
            </p>

            <p className="mt-[36px] text-[11.5px] font-semibold uppercase tracking-[0.22em] text-(--c-teal)">
              KYG Senior Care focuses on:
            </p>

            <div className="my-[32px] grid grid-cols-2 gap-[12px] max-[1180px]:grid-cols-1 max-[720px]:gap-[16px]">
              {pills.map((pill) => (
                <div
                  key={pill.text}
                  className="flex items-center gap-[14px] rounded-sm border border-(--ink-line) bg-white/80 p-[16px_20px] backdrop-blur-[8px] transition-all duration-500 ease-[var(--e-out)] hover:-translate-y-[3px] hover:border-(--c-teal-light) hover:bg-white hover:shadow-[var(--sh-1)] max-[560px]:p-[14px_16px]"
                >
                  <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-sm bg-[linear-gradient(135deg,var(--c-peach)_0%,var(--c-peach-2)_100%)] text-(--c-teal)">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      {pill.icon}
                    </svg>
                  </div>
                  <div className="text-[14.5px] font-medium leading-[1.3] text-(--ink-1)">{pill.text}</div>
                </div>
              ))}
            </div>

            <div className={`mt-[16px] max-w-[540px] ${SUBHEADING} text-(--ink-1)`}>
              Better understanding. Better care. <span className={GRAD_TEXT}>Better aging.</span>
            </div>
          </div>

          {/* Photo column */}
          <div className="relative aspect-[4/4.4] overflow-hidden rounded-sm shadow-[var(--sh-2)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="absolute left-0 top-[-12%] h-[124%] w-full object-cover"
              src="/kyg/a42282e02776.jpg"
              alt="A senior Indian couple reading documents together at home"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
