import { Container } from '@/components/shared/Container';
import { BODY, CONTENT_GAP, EYEBROW, EYEBROW_DASH_TEAL, GRAD_TEXT, HEADING, LEAD, SECTION_PY } from './styles';

/**
 * TrustPrivacy - "Your data stays yours." Two-column trust section: copy +
 * feature list on the left, a static shield graphic on the right.
 *
 * Pure Tailwind, fully static: the original cursor-follow 3D tilt on the shield
 * (JS-driven --rx/--ry rotation + perspective wobble) and the drifting glow
 * animation have been dropped. The shield renders as a plain, static SVG.
 */
export default function TrustPrivacy() {
  return (
    <section id="privacy" className={SECTION_PY}>
      <Container>
        <div className={`grid grid-cols-[1.05fr_1fr] items-center ${CONTENT_GAP} max-[1180px]:grid-cols-1`}>
          {/* Left: copy + feature list */}
          <div>
            <div className={`${EYEBROW} text-(--c-teal)`}>
              <span className={EYEBROW_DASH_TEAL} />
              Trust &amp; Privacy
            </div>

            <h2 className={`mt-[16px] ${HEADING} text-(--ink-1)`}>
              Your data <span className={GRAD_TEXT}>stays yours.</span>
            </h2>

            <p className={`mt-[18px] max-w-[540px] ${LEAD} text-(--ink-2)`}>
              We understand that health and genetic information is deeply personal.
            </p>
            <p className={`mt-[14px] max-w-[540px] ${BODY} text-(--ink-2)`}>
              That&apos;s why KYG focuses on privacy-focused systems, secure data handling, trusted certified lab
              partnerships, and confidential wellness reporting.
            </p>

            <div className="mt-[32px] grid grid-cols-2 gap-[12px] max-[720px]:grid-cols-1">
              <div className="flex items-center gap-[12px] rounded-[18px] border border-(--ink-line) bg-white/70 px-[20px] py-[16px] text-[14px] font-medium text-(--ink-1) backdrop-blur-[8px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:border-(--c-teal-light) hover:bg-white max-[720px]:px-[16px] max-[720px]:py-[14px] max-[720px]:leading-[1.4]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[18px] w-[18px] shrink-0 text-(--c-teal)"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                Trusted Certified Lab Partners
              </div>
              <div className="flex items-center gap-[12px] rounded-[18px] border border-(--ink-line) bg-white/70 px-[20px] py-[16px] text-[14px] font-medium text-(--ink-1) backdrop-blur-[8px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:border-(--c-teal-light) hover:bg-white max-[720px]:px-[16px] max-[720px]:py-[14px] max-[720px]:leading-[1.4]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[18px] w-[18px] shrink-0 text-(--c-teal)"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Secure Data Handling
              </div>
              <div className="flex items-center gap-[12px] rounded-[18px] border border-(--ink-line) bg-white/70 px-[20px] py-[16px] text-[14px] font-medium text-(--ink-1) backdrop-blur-[8px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:border-(--c-teal-light) hover:bg-white max-[720px]:px-[16px] max-[720px]:py-[14px] max-[720px]:leading-[1.4]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[18px] w-[18px] shrink-0 text-(--c-teal)"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Privacy-Focused Systems
              </div>
              <div className="flex items-center gap-[12px] rounded-[18px] border border-(--ink-line) bg-white/70 px-[20px] py-[16px] text-[14px] font-medium text-(--ink-1) backdrop-blur-[8px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:border-(--c-teal-light) hover:bg-white max-[720px]:px-[16px] max-[720px]:py-[14px] max-[720px]:leading-[1.4]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[18px] w-[18px] shrink-0 text-(--c-teal)"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                Scientific &amp; Expert-Backed
              </div>
              <div className="col-span-2 flex items-center gap-[12px] rounded-[18px] border border-(--ink-line) bg-white/70 px-[20px] py-[16px] text-[14px] font-medium text-(--ink-1) backdrop-blur-[8px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:border-(--c-teal-light) hover:bg-white max-[880px]:col-auto max-[720px]:px-[16px] max-[720px]:py-[14px] max-[720px]:leading-[1.4]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[18px] w-[18px] shrink-0 text-(--c-teal)"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6M16 13H8M16 17H8" />
                </svg>
                Confidential Wellness Reports, only shared with you
              </div>
            </div>
          </div>

          {/* Right: static shield graphic (3D cursor-tilt + glow drift dropped) */}
          <div className="relative flex aspect-[1/1.1] items-center justify-center">
            {/* Static teal glow (was an animated ::before) */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(37,181,171,0.18)_0%,transparent_60%)]"
            />
            <svg
              viewBox="0 0 280 320"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="relative z-[1] h-[82%] w-[82%] [filter:drop-shadow(0_16px_32px_rgba(14,77,75,0.28))]"
            >
              <defs>
                <linearGradient id="shieldBody" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0E4D4B" />
                  <stop offset="100%" stopColor="#1A2220" />
                </linearGradient>
                <linearGradient id="shieldLight" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.28" />
                  <stop offset="55%" stopColor="#fff" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <radialGradient id="shieldGlow" cx="50%" cy="55%" r="55%">
                  <stop offset="0%" stopColor="#25B5AB" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#25B5AB" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Outer halo glow */}
              <circle cx="140" cy="170" r="140" fill="url(#shieldGlow)" />

              {/* Back depth layer */}
              <path
                d="M 140 22 L 248 56 L 246 168 C 246 230 200 282 140 308 C 80 282 34 230 34 168 L 36 56 Z"
                fill="#15605D"
                opacity="0.35"
                transform="translate(4,5)"
              />

              {/* Main shield */}
              <path
                d="M 140 22 L 248 56 L 246 168 C 246 230 200 282 140 308 C 80 282 34 230 34 168 L 36 56 Z"
                fill="url(#shieldBody)"
              />

              {/* Top-light overlay for 3D feel */}
              <path
                d="M 140 22 L 248 56 L 246 168 C 246 230 200 282 140 308 C 80 282 34 230 34 168 L 36 56 Z"
                fill="url(#shieldLight)"
              />

              {/* Inner border outline */}
              <path
                d="M 140 42 L 226 70 L 224 168 C 224 220 188 264 140 286 C 92 264 56 220 56 168 L 58 70 Z"
                fill="none"
                stroke="rgba(248,228,204,0.15)"
                strokeWidth="1.5"
              />

              {/* Big elegant check mark */}
              <path
                d="M 92 162 L 128 198 L 196 130"
                fill="none"
                stroke="#FAF6EF"
                strokeWidth="11"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Subtle corner accent dots */}
              <circle cx="82" cy="86" r="2.5" fill="#25B5AB" opacity="0.7" />
              <circle cx="198" cy="86" r="2.5" fill="#F3D5B2" opacity="0.7" />
              <circle cx="60" cy="178" r="2" fill="#F3D5B2" opacity="0.5" />
              <circle cx="220" cy="178" r="2" fill="#25B5AB" opacity="0.55" />
              <circle cx="100" cy="246" r="1.8" fill="#25B5AB" opacity="0.45" />
              <circle cx="180" cy="246" r="1.8" fill="#F3D5B2" opacity="0.45" />
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
}
