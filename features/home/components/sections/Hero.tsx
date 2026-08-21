import { Container } from '@/components/shared/Container';

/**
 * Hero - full-bleed photographic hero with editorial copy.
 * Pure Tailwind, fully static (no scroll parallax / reveal - those caused jank).
 */
export default function Hero() {
  return (
    <section className="relative flex h-[100dvh] min-h-[560px] items-center overflow-hidden">
      {/* Background photo + warm cream veil (z-0, content sits above via z-10 -
          no negative z-index so it can't fall behind the page background). */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kyg/950448a92b6b.jpg"
          alt="An Indian family at home, a father and son share a moment at a laptop while the mother and daughter cook together in the kitchen"
          className="absolute inset-0 h-full w-full object-cover [object-position:60%_45%] [filter:saturate(0.92)_contrast(1.02)]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(96deg,rgba(250,246,239,.99)_0%,rgba(250,246,239,.92)_26%,rgba(250,246,239,.62)_46%,rgba(250,246,239,.22)_64%,rgba(250,246,239,0)_80%),linear-gradient(180deg,rgba(250,246,239,0)_50%,rgba(250,246,239,.65)_100%)]" />
      </div>

      <Container className="relative z-10">
        <div className="relative flex w-full flex-col items-start pt-[96px] pb-[32px] max-[880px]:pt-[76px] max-[720px]:pt-[68px]">
          <div className="max-w-[min(1100px,100%)]">
            {/* Eyebrow pill */}
            <div className="mb-[36px] inline-flex items-center gap-[14px] rounded-sm border border-[rgba(37,181,171,.32)] bg-(--c-teal) py-[12px] pr-[26px] pl-[12px] text-[16px] font-semibold tracking-[.005em] text-(--c-cream) shadow-[0_14px_32px_-8px_rgba(14,77,75,.42),0_0_0_4px_rgba(14,77,75,.05)] max-[880px]:mb-[22px] max-[880px]:py-[8px] max-[880px]:pr-[18px] max-[880px]:pl-[8px] max-[880px]:text-[13px] max-[720px]:mb-[16px] max-[720px]:text-[11px]">
              <span className="inline-flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-sm bg-white/10 text-[14px] text-(--c-cream) shadow-[0_0_0_4px_rgba(248,228,204,.14)] max-[880px]:h-[28px] max-[880px]:w-[28px] max-[720px]:h-[22px] max-[720px]:w-[22px]">
                ✦
              </span>
              <span>India&apos;s first wellness-led DNA experience</span>
            </div>

            {/* Heading */}
            <h1 className="text-[clamp(34px,5.8vw,84px)] font-semibold leading-[1.02] tracking-[-.038em] text-(--ink-1) max-[880px]:text-[clamp(30px,7.4vw,56px)] max-[720px]:text-[clamp(26px,8vw,40px)] max-[720px]:leading-[1.04]">
              Your body already carries
              <em className="block bg-[linear-gradient(110deg,var(--c-teal)_0%,var(--c-teal-2)_25%,var(--c-teal-light)_50%,var(--c-teal-2)_75%,var(--c-teal)_100%)] bg-clip-text font-medium text-transparent not-italic">
                clues about your future.
              </em>
            </h1>

            <p className="mt-[20px] max-w-[580px] text-[clamp(17px,1.45vw,21px)] leading-[1.5] text-(--ink-2) max-[720px]:mt-[14px] max-[720px]:max-w-none max-[720px]:text-[14px]">
              Understand your body better through personalized wellness and genetic insights designed for modern India.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
