import type { ReactNode } from 'react';

const iconClass =
  'h-[30px] w-[30px] shrink-0 text-(--c-teal-light) drop-shadow-[0_0_10px_rgba(37,181,171,0.4)] max-[880px]:h-[22px] max-[880px]:w-[22px] max-[360px]:h-[18px] max-[360px]:w-[18px]';

const trustItems: { icon: ReactNode; label: string }[] = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <path d="M9 12l2 2 4-4M12 22a10 10 0 110-20 10 10 0 010 20z" />
      </svg>
    ),
    label: 'Saliva-Based DNA Wellness Test',
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
    label: 'Personalized Wellness Insights',
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    ),
    label: '4 Comprehensive Wellness Reports',
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    ),
    label: 'GENEous Care Counseling',
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    label: 'Trusted Certified Labs',
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    label: 'Built for Indian Biology',
  },
];

/**
 * Trust marquee - a continuous, seamless CSS scroll (no JS).
 *
 * The track holds two identical copies of the items; each item is a
 * self-contained cell (its own gap + right padding, no flex gap on the track),
 * so `translateX(-50%)` scrolls exactly one copy and the loop never jumps.
 * Pauses on hover; fully still under prefers-reduced-motion.
 */
export default function TrustMarquee() {
  return (
    <section
      aria-label="Why people trust KYG"
      className="relative overflow-hidden border-y border-[rgba(248,228,204,0.12)] bg-[linear-gradient(180deg,#0e4d4b_0%,#082f2d_100%)] pt-[52px] pb-[48px] shadow-[inset_0_14px_28px_-16px_rgba(0,0,0,0.45),inset_0_-14px_28px_-16px_rgba(0,0,0,0.45)] max-[880px]:pt-[36px] max-[880px]:pb-[32px] max-[420px]:py-[36px]"
    >
      {/* Radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_90%_at_10%_50%,rgba(37,181,171,0.28),transparent_60%),radial-gradient(45%_90%_at_90%_50%,rgba(248,228,204,0.12),transparent_60%)]"
      />

      {/* Label */}
      <div className="relative z-[3] mb-[28px] flex items-center justify-center gap-[12px] px-[20px] text-[13px] font-bold tracking-[0.24em] whitespace-nowrap text-[rgba(248,228,204,0.72)] uppercase max-[560px]:gap-[8px] max-[560px]:text-[11px] max-[560px]:tracking-[0.18em]">
        <span aria-hidden className="h-[1px] w-[36px] shrink-0 bg-[rgba(248,228,204,0.35)] max-[560px]:hidden" />
        <span className="inline-block h-[6px] w-[6px] shrink-0 rounded-full bg-(--c-teal-light) shadow-[0_0_0_3px_rgba(37,181,171,0.24)]" />
        <span className="inline-flex items-center">Trusted by India&apos;s wellness seekers</span>
        <span aria-hidden className="h-[1px] w-[36px] shrink-0 bg-[rgba(248,228,204,0.35)] max-[560px]:hidden" />
      </div>

      {/* Marquee viewport */}
      <div className="group relative z-[1] overflow-hidden [mask-image:linear-gradient(to_right,transparent_0,#000_5%,#000_95%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0,#000_5%,#000_95%,transparent_100%)]">
        {/* Track: four copies so the -50% loop stays seamless at any width */}
        <div className="flex w-max animate-kyg-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[0, 1, 2, 3].map((copy) =>
            trustItems.map((item) => (
              <div
                key={`${copy}-${item.label}`}
                aria-hidden={copy > 0}
                className="flex shrink-0 items-center gap-[72px] pr-[72px] max-[880px]:gap-[36px] max-[880px]:pr-[36px]"
              >
                <div className="flex shrink-0 items-center gap-[18px] text-[19px] font-medium tracking-[0.005em] whitespace-nowrap text-(--c-cream) max-[880px]:text-[15px] max-[360px]:gap-[10px] max-[360px]:text-[13px]">
                  {item.icon}
                  {item.label}
                </div>
                <span
                  aria-hidden
                  className="h-[8px] w-[8px] shrink-0 rounded-full bg-(--c-peach-2) opacity-90 shadow-[0_0_10px_rgba(243,213,178,0.5)]"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
