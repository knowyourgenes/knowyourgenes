/**
 * Movement - "The Movement" dark, warm break card.
 *
 * Pure Tailwind, fully static. Dropped from the legacy version: the `reveal`
 * scroll-in stagger (`--rd`), the animated bg-fx layer (drifting orbs +
 * particles), the SVG wave `<animate>` morphs, and the gradient-shift on the
 * highlight text. The wave SVG is kept as a subtle STATIC decorative overlay
 * (each path frozen at its first keyframe). Not a nav anchor, so no `id`.
 */

import { EYEBROW, EYEBROW_DASH_PEACH, GRAD_TEXT, HEADING, LEAD } from './styles';

const items: { num: string; text: string }[] = [
  { num: '01', text: 'Smarter wellness decisions' },
  { num: '02', text: 'Preventive health awareness' },
  { num: '03', text: 'Personalized lifestyle understanding' },
  { num: '04', text: 'Future-ready healthcare thinking for India' },
];

export default function Movement() {
  return (
    <section className="relative pb-0 pt-[clamp(56px,6.5vw,96px)] max-[1180px]:pt-[clamp(48px,6vw,80px)] max-[560px]:pt-[56px]">
      <div className="relative mx-auto w-[min(var(--max-w),100%_-_2_*_var(--gutter))] overflow-hidden rounded-[var(--r-2xl)] bg-[linear-gradient(180deg,var(--dark-1)_0%,var(--dark-2)_100%)] text-(--c-cream) max-[1180px]:mx-0 max-[1180px]:w-full max-[1180px]:rounded-none">
        {/* Static radial glow (legacy .movement::before, drift animation dropped) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(50%_60%_at_90%_10%,rgba(248,228,204,0.16),transparent_60%),radial-gradient(60%_60%_at_10%_90%,rgba(37,181,171,0.18),transparent_60%)]"
        />

        {/* Static decorative wave lines (legacy .movement__waves, <animate> dropped) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] opacity-[0.22]">
          <svg
            viewBox="0 0 1200 500"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            <defs>
              <linearGradient id="mvWave1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#25B5AB" stopOpacity="0" />
                <stop offset="50%" stopColor="#25B5AB" stopOpacity="1" />
                <stop offset="100%" stopColor="#25B5AB" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="mvWave2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F3D5B2" stopOpacity="0" />
                <stop offset="50%" stopColor="#F3D5B2" stopOpacity="1" />
                <stop offset="100%" stopColor="#F3D5B2" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M 0 120 Q 300 60 600 120 T 1200 120" stroke="url(#mvWave1)" strokeWidth="1.4" fill="none" />
            <path
              d="M 0 240 Q 300 200 600 260 T 1200 240"
              stroke="url(#mvWave2)"
              strokeWidth="1.2"
              fill="none"
              opacity="0.7"
            />
            <path
              d="M 0 380 Q 300 320 600 380 T 1200 380"
              stroke="url(#mvWave1)"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M 0 60 Q 400 20 800 60 T 1200 60"
              stroke="url(#mvWave2)"
              strokeWidth="0.9"
              fill="none"
              opacity="0.55"
            />
            <path
              d="M 0 440 Q 400 400 800 460 T 1200 440"
              stroke="url(#mvWave1)"
              strokeWidth="1"
              fill="none"
              opacity="0.5"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-[3] px-[clamp(40px,6vw,80px)] py-[clamp(60px,7vw,96px)] max-[880px]:px-[var(--gutter)] max-[880px]:py-[48px]">
          <div>
            <div className={`${EYEBROW} text-(--c-peach-2)`}>
              <span className={EYEBROW_DASH_PEACH} />
              The Movement
            </div>

            <h2 className={`mt-[16px] max-w-[680px] ${HEADING} text-(--c-cream)`}>
              India&apos;s preventive wellness movement <span className={GRAD_TEXT}>starts here.</span>
            </h2>

            <p className={`mt-[18px] max-w-[640px] ${LEAD} text-(--c-cream)/85`}>
              KYG is more than a wellness test. It&apos;s a movement toward:
            </p>
          </div>

          <div className="mt-[56px] grid grid-cols-4 gap-[28px] max-[1180px]:grid-cols-2 max-[720px]:gap-[16px] max-[560px]:grid-cols-1 max-[420px]:gap-[18px]">
            {items.map((item) => (
              <div key={item.num} className="border-t border-white/[0.18] pt-[22px]">
                <div className="text-[13px] font-semibold tracking-[0.22em] text-(--c-peach-2)">{item.num}</div>
                <div className="mt-[12px] font-[family-name:var(--ff)] text-[19px] font-semibold leading-[1.3] tracking-[-0.012em] text-(--c-cream)">
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-[72px] font-[family-name:var(--ff)] text-[clamp(34px,4.6vw,60px)] font-medium leading-[1.06] tracking-[-0.028em] text-(--c-cream) max-[420px]:text-[28px]">
            Future Ready Health.{' '}
            <span className="bg-[linear-gradient(110deg,var(--c-peach-2)_0%,var(--c-teal-light)_50%,var(--c-peach-2)_100%)] bg-clip-text text-transparent">
              Future Ready Bharat.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
