import { Container } from '@/components/shared/Container';
import { EYEBROW, EYEBROW_DASH_TEAL, GRAD_TEXT, HEADING, LEAD, SECTION_PY } from './styles';

/**
 * FinalCta - centered closing call-to-action.
 *
 * Pure Tailwind, fully static: the legacy version's 4 parallax corner photos
 * are dropped and its animated radial glow is rendered as a single static
 * gradient behind the copy. Not a nav anchor, so no `id`.
 */
export default function FinalCta() {
  return (
    <section className={`relative overflow-hidden ${SECTION_PY} text-center`}>
      {/* Soft static radial glow behind the copy (teal + peach, low opacity) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_720px_460px_at_50%_46%,rgba(37,181,171,0.16)_0%,rgba(244,180,130,0.10)_42%,rgba(250,246,239,0)_72%)]"
      />

      <Container>
        <div className="relative z-[2] mx-auto max-w-[720px]">
          {/* Eyebrow */}
          <div className="flex justify-center">
            <div className={`${EYEBROW} text-(--c-teal)`}>
              <span className={EYEBROW_DASH_TEAL} />
              Ready when you are
            </div>
          </div>

          {/* Heading */}
          <h2 className={`mt-[16px] ${HEADING} text-(--ink-1)`}>
            Your genes don&apos;t define your future.
            <em className={`block ${GRAD_TEXT} font-semibold not-italic`}>
              But they can help you understand your body better.
            </em>
          </h2>

          {/* Sub */}
          <p className={`mx-auto mt-[18px] max-w-[560px] ${LEAD} text-(--ink-2)`}>
            Start your personalized wellness journey with KYG.
          </p>

          {/* CTA */}
          <div className="mt-[42px] flex justify-center">
            <a
              href="#wellness"
              className="group inline-flex items-center gap-[10px] rounded-sm bg-(--ink-1) px-[28px] py-[15px] text-[15px] font-semibold text-(--c-cream) transition-colors hover:bg-(--c-teal)"
            >
              Explore DNA tests
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-[16px] w-[16px] transition-transform group-hover:translate-x-[3px]"
              >
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
