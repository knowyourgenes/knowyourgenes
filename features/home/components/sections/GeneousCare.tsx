import { CONTENT_GAP, EYEBROW, EYEBROW_DASH_PEACH, GRAD_TEXT, HEADING, LEAD } from './styles';

const CARE_ITEMS: Array<[string, string]> = [
  ['01', 'understand your wellness report'],
  ['02', 'reduce confusion'],
  ['03', 'make informed lifestyle decisions'],
  ['04', 'take meaningful next steps'],
];

const CARE_PILLS = [
  'Pre-Test Guidance',
  'Post-Test Counseling',
  'Lifestyle Discussions',
  'Wellness Guidance',
  'Personalized Support',
];

export default function GeneousCare() {
  return (
    <section className="relative pt-0 pb-[clamp(56px,6.5vw,96px)] max-[560px]:pb-[56px]">
      <div className="relative mx-auto w-[min(var(--max-w),100%_-_2*var(--gutter))] overflow-hidden rounded-[var(--r-2xl)] bg-(--dark-1) text-(--c-cream) max-[1180px]:mx-0 max-[1180px]:w-full max-[1180px]:rounded-none">
        {/* Static dark warm glow overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50vw_60vh_at_85%_15%,rgba(37,181,171,0.18),transparent_60%),radial-gradient(40vw_50vh_at_10%_90%,rgba(248,228,204,0.1),transparent_60%)]"
        />

        <div className="relative z-[1] px-[clamp(40px,6vw,80px)] py-[clamp(60px,7vw,96px)] max-[880px]:px-[var(--gutter)] max-[880px]:py-[48px]">
          <div className={`grid grid-cols-[1.05fr_1fr] items-center ${CONTENT_GAP} max-[1180px]:grid-cols-1`}>
            {/* Copy column */}
            <div>
              <div className={`${EYEBROW} text-(--c-peach-2)`}>
                <span className={EYEBROW_DASH_PEACH} />
                GENEous Care
              </div>

              <h2 className={`mt-[16px] ${HEADING} text-(--c-cream)`}>
                Because reports alone are <span className={GRAD_TEXT}>not enough.</span>
              </h2>

              <p className={`mt-[18px] max-w-[540px] ${LEAD} text-(--c-cream)/85`}>
                Most people receive health reports and don&apos;t know what to do next.
              </p>
              <p className={`mt-[14px] max-w-[540px] ${LEAD} text-(--c-cream)/85`}>
                That&apos;s where GENEous Care comes in. KYG combines genetic intelligence with human guidance to help
                you:
              </p>

              <div className="my-[32px] grid grid-cols-2 gap-[14px] max-[1180px]:grid-cols-1 max-[720px]:gap-[16px]">
                {CARE_ITEMS.map(([num, label]) => (
                  <div
                    key={num}
                    className="flex items-center gap-[14px] rounded-[var(--r-sm)] border border-white/[0.08] bg-white/[0.05] px-[20px] py-[16px] text-[14.5px] text-(--c-cream) transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-[4px] hover:border-[rgba(37,181,171,0.4)] hover:bg-white/[0.09] max-[560px]:px-[14px] max-[560px]:py-[12px] max-[560px]:text-[13.5px]"
                  >
                    <span className="min-w-[20px] [font-family:var(--ff)] text-[13px] font-bold tracking-[0.06em] text-(--c-teal-bright)">
                      {num}
                    </span>
                    {label}
                  </div>
                ))}
              </div>

              <div className="mt-[36px] mb-[14px] text-[11.5px] font-semibold uppercase tracking-[0.22em] text-(--c-peach-2)">
                What&apos;s included
              </div>
              <div className="flex flex-wrap gap-[10px]">
                {CARE_PILLS.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-white/[0.12] bg-white/[0.05] px-[16px] py-[8px] text-[13px] font-medium text-(--c-cream) transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-(--c-peach-2) hover:bg-[rgba(248,228,204,0.15)]"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              <div className="mt-[32px] rounded-[var(--r-sm)] border border-[rgba(37,181,171,0.32)] bg-[linear-gradient(135deg,rgba(37,181,171,0.18),rgba(248,228,204,0.1))] px-[26px] py-[20px] [font-family:var(--ff)] text-[20px] font-semibold leading-[1.3] tracking-[-0.012em] text-white max-[560px]:px-[20px] max-[560px]:py-[16px] max-[560px]:text-[17px]">
                Human understanding meets genetic intelligence.
              </div>
            </div>

            {/* Visual column */}
            <div className="group relative aspect-[4/4.6] overflow-hidden rounded-[var(--r-lg)] shadow-[0_36px_80px_rgba(0,0,0,0.36)]">
              <div className="absolute top-[24px] left-[24px] z-[2] inline-flex items-center gap-[10px] rounded-full border border-white/[0.15] bg-[rgba(31,26,20,0.6)] px-[14px] py-[8px] text-[12.5px] font-medium text-white backdrop-blur-[10px]">
                <span className="h-[8px] w-[8px] rounded-full bg-(--c-teal-bright) shadow-[0_0_0_4px_rgba(42,195,162,0.3)]" />
                Available 7 days a week
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="A GENEous Care counselor in a warm, supportive conversation"
                className="absolute top-[-12%] left-0 h-[124%] w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
