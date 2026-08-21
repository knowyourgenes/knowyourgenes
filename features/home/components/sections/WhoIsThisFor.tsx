import type { ReactNode } from 'react';
import { Container } from '@/components/shared/Container';
import { CONTENT_GAP, EYEBROW, EYEBROW_DASH_TEAL, GRAD_TEXT, HEADING, LEAD, SECTION_PY } from './styles';

const AUDIENCE_CHIPS: Array<{ label: string; icon: ReactNode }> = [
  {
    label: 'Fitness-conscious individuals',
    icon: <path d="M3 12h4l3-9 4 18 3-9h4" />,
  },
  {
    label: 'Wellness seekers',
    icon: (
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
    ),
  },
  {
    label: 'Busy professionals',
    icon: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </>
    ),
  },
  {
    label: 'Preventive healthcare adopters',
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  },
  {
    label: 'Struggling with generic diets',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 14s1 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
      </>
    ),
  },
  {
    label: 'Curious about personalized wellness',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 11a4 4 0 018 0" />
        <path d="M9 16h6" />
      </>
    ),
  },
  {
    label: 'Adults focused on long-term health',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </>
    ),
  },
  {
    label: 'Families prioritizing preventive care',
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </>
    ),
  },
];

export default function WhoIsThisFor() {
  return (
    <section id="who" className={`relative ${SECTION_PY}`}>
      <Container>
        <div className={`grid grid-cols-[1fr_1.1fr] items-center ${CONTENT_GAP} max-[1180px]:grid-cols-1`}>
          <div className="relative aspect-[4/4.6] overflow-hidden rounded-sm shadow-[var(--sh-2)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src="/kyg/4c2cb66bab2c.jpg"
              alt="A focused Indian tennis player on court, representing the active KYG community"
            />
          </div>

          <div>
            <div className={`${EYEBROW} text-(--c-teal)`}>
              <span className={EYEBROW_DASH_TEAL} />
              Who Is This For?
            </div>

            <h2 className={`mt-[16px] ${HEADING} text-(--ink-1)`}>
              Built for people who want <span className={GRAD_TEXT}>smarter wellness decisions.</span>
            </h2>

            <p className={`mt-[18px] max-w-[560px] ${LEAD} text-(--ink-2)`}>
              KYG fits into the lives of people who care about understanding their bodies, not just managing them.
            </p>

            <div className="mt-[32px] flex flex-wrap gap-[10px]">
              {AUDIENCE_CHIPS.map((chip) => (
                <span
                  key={chip.label}
                  className="group inline-flex cursor-default items-center gap-[10px] rounded-sm border border-(--ink-line) bg-white/70 px-[22px] py-[12px] text-[14.5px] font-medium text-(--ink-1) backdrop-blur-[8px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px] hover:border-(--ink-1) hover:bg-(--ink-1) hover:text-(--c-cream)"
                >
                  <svg
                    className="h-[16px] w-[16px] text-(--c-teal) transition-colors duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-(--c-teal-bright)"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {chip.icon}
                  </svg>
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
