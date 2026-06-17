import Image from 'next/image';
import { Container, Eyebrow, FigIcon, SheenButton } from '../_shared/ui';

/* ==================== 13 · TRUST ==================== */

const CERTS = [
  { icon: 'cert-nabl', label: 'NABL · MC-6400' },
  { icon: 'cert-iso9001', label: 'ISO 9001:2015' },
  { icon: 'cert-iso27001', label: 'ISO 27001:2013' },
  { icon: 'cert-acmg', label: 'ACMG · CPIC' },
  { icon: 'cert-hipaa', label: 'HIPAA · FDA' },
];

export function TrustSection() {
  return (
    <section className="relative overflow-hidden py-[80px] lg:py-[100px]">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(228,241,236,0) 0%, rgba(228,241,236,0.5) 50%, rgba(228,241,236,0) 100%)',
        }}
      />
      <Container>
        <div className="grid items-center gap-[48px] lg:grid-cols-2">
          <div className="reveal relative overflow-hidden rounded-[30px] shadow-[0_40px_100px_rgba(20,45,40,0.15),0_12px_36px_rgba(20,45,40,0.1)]">
            <div className="relative aspect-[568/483] w-full">
              <Image
                src="/landing/pregnancy-loss/trust.png"
                alt="A genetic counsellor in teal scrubs"
                fill
                sizes="(max-width:1024px) 90vw, 568px"
                className="object-cover object-[50%_28%]"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, rgba(14,77,75,0) 40%, rgba(14,77,75,0.6) 100%)' }}
              />
            </div>
            <div className="absolute inset-x-5 bottom-5 flex items-center gap-[14px] rounded-[16px] bg-white px-[20px] py-[16px] shadow-[0_14px_34px_rgba(20,45,40,0.22)]">
              <span className="grid size-[40px] shrink-0 place-items-center rounded-[12px] bg-[#0E4D4B] text-[#FAF6EF]">
                <FigIcon src="/landing/_icons/pl-expert-review.svg" className="size-[22px]" />
              </span>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0E4D4B]">Expert review</div>
                <p className="text-[13.5px] leading-[18.56px] text-[#2D2A24]">
                  Every report manually reviewed by{' '}
                  <strong className="font-semibold text-[#1F1A14]">Dr. Varun Sharma, Ph.D</strong>, Scientist, Human
                  Genetics.
                </p>
              </div>
            </div>
          </div>

          <div className="reveal-r flex flex-col gap-[16px]">
            <Eyebrow icon={<FigIcon src="/landing/_icons/eb-shield-check.svg" className="size-[19px]" />}>Trust</Eyebrow>
            <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.022em] text-[#1F1A14] sm:text-[36px] lg:text-[40px] lg:leading-[44px]">
              The science is real. <span className="font-medium text-[#6B6358]">The lab is certified.</span>
            </h2>
            <p className="text-[15.5px] leading-[23.25px] text-[#2D2A24]">
              Tested by <strong className="font-semibold text-[#1F1A14]">Neotech World Lab Pvt. Ltd.</strong>, MG Road,
              Gurugram, Haryana.
            </p>

            <div className="mt-[12px] flex flex-wrap gap-[10px]">
              {CERTS.map(({ icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-[8px] rounded-full border border-[rgba(31,26,20,0.08)] bg-white/70 px-[16px] py-[8px] text-[13px] font-medium text-[#2D2A24]"
                >
                  <FigIcon src={`/landing/_icons/${icon}.svg`} className="size-[16px] text-[#0E4D4B]" />
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-[12px] flex flex-col">
              <div className="flex items-start gap-[16px] border-t border-[rgba(31,26,20,0.08)] py-[16px]">
                <FigIcon src="/landing/_icons/pl-microscope.svg" className="mt-[1px] size-[22px] shrink-0 text-[#0E4D4B]" />
                <p className="text-[14.5px] font-semibold leading-[21.75px]">
                  <span className="text-[#1F1A14]">Technology:</span>
                  <span className="font-normal text-[#2D2A24]">
                    {' '}
                    Illumina Infinium SNP array · 99%+ reproducibility · &gt;98% call rate.
                  </span>
                </p>
              </div>
              <div className="flex items-start gap-[16px] border-t border-[rgba(31,26,20,0.08)] py-[16px]">
                <FigIcon src="/landing/_icons/pl-lock.svg" className="mt-[1px] size-[22px] shrink-0 text-[#0E4D4B]" />
                <p className="text-[14.5px] font-semibold leading-[21.75px]">
                  <span className="text-[#1F1A14]">Your data is yours.</span>
                  <span className="font-normal text-[#2D2A24]"> Never sold, never shared. Sample destroyed after processing.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ==================== 14 · FAQs ==================== */

const FAQS = [
  {
    q: 'Will this test tell me why I had a miscarriage?',
    a: 'It can point to a likely genetic contributor. If you carry an MTHFR or FOXP3 variant, that is often the piece standard testing misses, the difference between “unexplained” and a cause your doctor can act on. It will not explain every loss, but for many women it explains theirs.',
  },
  {
    q: 'I’m already pregnant. Should I take this?',
    a: 'You can, and the result is still useful, but this test is most powerful taken before conception, when supplementation and monitoring can be adjusted from the start. If you are already pregnant, share the result with your doctor so they can factor it into your care right away.',
  },
  {
    q: 'If my MTHFR comes back as a risk variant, what happens next?',
    a: 'Your report explains exactly what the variant means and what to discuss with your doctor, typically switching from standard folic acid to active methylfolate and monitoring homocysteine. Your free counselling session walks you through it, and your gynaecologist makes the final call.',
  },
  {
    q: 'Can my husband also test for pregnancy loss risk?',
    a: 'Pregnancy loss risk is assessed from your genetics, so this panel is for you. But recurrent loss can involve both partners, your partner can take the Men’s Health DNA panel, and the ‘Know Before You Begin’ bundle covers both with a joint counselling session.',
  },
];

export function FaqsSection() {
  return (
    <section id="faqs" className="py-[72px] lg:py-[88px]">
      <Container>
        <div className="mx-auto max-w-[860px]">
          <div className="reveal">
            <Eyebrow icon={<FigIcon src="/landing/_icons/eb-sparkles.svg" className="size-[19px]" />}>FAQs</Eyebrow>
            <h2 className="mt-[24px] text-[34px] font-semibold leading-[1.08] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
              Questions about pregnancy loss and genetic testing.
            </h2>
          </div>

          <div className="reveal mt-[40px] border-y border-[rgba(31,26,20,0.08)]">
            {FAQS.map((item, i) => (
              <details key={item.q} className={`faq group ${i > 0 ? 'border-t border-[rgba(31,26,20,0.08)]' : ''}`}>
                <summary className="flex items-center justify-between gap-[20px] py-[24px]">
                  <span className="text-[18px] font-semibold leading-[27px] tracking-[-0.025em] text-[#1F1A14]">
                    {item.q}
                  </span>
                  <span className="faq-plus grid size-[36px] shrink-0 place-items-center rounded-full bg-[rgba(14,77,75,0.08)] text-[#0E4D4B]">
                    <FigIcon src="/landing/_icons/plus.svg" className="size-[18px]" />
                  </span>
                </summary>
                <div className="faq-answer">
                  <div>
                    <p className="pb-[24px] pr-[56px] text-[15.5px] leading-[25px] text-[#2D2A24]">{item.a}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ============== 15 · ALSO PART OF THIS REPORT ============== */

const PANELS = [
  { icon: 'panel-pcos', gene: 'THADA gene', title: 'PCOS Risk', desc: '1 in 5 Indian women has PCOS. Know if yours is genetic.' },
  {
    icon: 'panel-depression',
    gene: 'COMT gene',
    title: 'Post-Pregnancy Depression',
    desc: '50% of episodes start before delivery. Know your vulnerability.',
  },
  {
    icon: 'panel-bone',
    gene: 'AKAP11 · LRP5 · ZBTB40',
    title: 'Osteoporosis & Bone Health',
    desc: 'Bone loss starts in your 30s. Silently.',
  },
  {
    icon: 'panel-arthritis',
    gene: 'HLA-DRB1 gene',
    title: 'Rheumatoid Arthritis Risk',
    desc: 'RA affects 3 times more women than men in India.',
  },
];

export function AlsoPartSection() {
  return (
    <section className="py-[72px] lg:py-[88px]">
      <Container>
        <div className="reveal max-w-[760px]">
          <Eyebrow icon={<FigIcon src="/landing/_icons/eb-sparkles.svg" className="size-[19px]" />}>One sample, five answers</Eyebrow>
          <h2 className="mt-[20px] text-[34px] font-semibold leading-[1.07] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            The pregnancy panel is Panel 02 of 5.{' '}
            <span className="font-medium text-[#6B6358]">Your report also covers:</span>
          </h2>
        </div>

        <div className="mt-[20px] grid gap-[16px] sm:grid-cols-2 lg:grid-cols-4">
          {PANELS.map(({ icon, gene, title, desc }) => (
            <a
              key={title}
              href="#"
              className="reveal group flex flex-col rounded-[24px] border border-[rgba(31,26,20,0.08)] bg-white/75 p-[28px] transition-colors hover:border-[rgba(14,77,75,0.25)] hover:bg-white"
            >
              <span className="grid size-[48px] place-items-center rounded-[14px] bg-[rgba(14,77,75,0.08)] text-[#0E4D4B]">
                <FigIcon src={`/landing/_icons/${icon}.svg`} className="size-[24px]" />
              </span>
              <div className="mt-[18px] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B6358]">
                {gene}
              </div>
              <h3 className="mt-[6px] text-[16.5px] font-semibold leading-[22.69px] tracking-[-0.024em] text-[#1F1A14]">
                {title}
              </h3>
              <p className="mt-[8px] grow text-[13.5px] leading-[21.94px] text-[#6B6358]">{desc}</p>
              <span className="mt-[16px] inline-flex items-center gap-[6px] text-[13px] font-semibold text-[#0E4D4B]">
                Explore panel
                <FigIcon src="/landing/_icons/arrow-ur.svg" className="size-[16px] transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
              </span>
            </a>
          ))}
        </div>

        <a
          href="#check"
          className="reveal group mt-[20px] flex items-center justify-between gap-[20px] rounded-[24px] bg-[#1F1A14] px-[28px] py-[24px] sm:px-[36px]"
        >
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(243,213,178,0.8)]">
              Or see the full picture
            </div>
            <h3 className="mt-[4px] text-[20px] font-semibold leading-[1.4] tracking-[-0.025em] text-[#FAF6EF] sm:text-[22px]">
              Women’s Health DNA, Full Overview
            </h3>
            <p className="mt-[2px] text-[14px] leading-[21px] text-[rgba(250,246,239,0.7)]">
              All 5 panels · who this test is for · at every age
            </p>
          </div>
          <span className="grid size-[48px] shrink-0 place-items-center rounded-full bg-white/15 text-[#FAF6EF] transition-colors group-hover:bg-white/25">
            <FigIcon src="/landing/_icons/arrow-ur.svg" className="size-[24px]" />
          </span>
        </a>
      </Container>
    </section>
  );
}

/* ==================== 16 · FINAL CTA ==================== */

const META = ['At-home saliva kit', 'Neotech World Lab', 'NABL accredited', '7-day results', 'Free counselling'];

export function FinalCtaSection() {
  return (
    <section id="check" className="py-[40px] lg:py-[64px]">
      <Container>
        <div
          className="reveal relative overflow-hidden rounded-[40px] px-6 py-[64px] text-center sm:px-12 lg:px-[120px] lg:py-[80px]"
          style={{ background: 'linear-gradient(141deg, #0E4D4B 0%, #082F2D 100%)' }}
        >
          <FigIcon src="/landing/_icons/helix-accent.svg" className="pointer-events-none absolute -left-6 top-1/2 hidden h-[360px] w-[120px] -translate-y-1/2 text-white/[0.06] lg:block" />
          <FigIcon src="/landing/_icons/helix-accent.svg" className="pointer-events-none absolute -right-6 top-1/2 hidden h-[360px] w-[120px] -translate-y-1/2 scale-x-[-1] text-white/[0.06] lg:block" />

          <div className="relative mx-auto flex max-w-[760px] flex-col items-center">
            <Eyebrow tone="dark" icon={<FigIcon src="/landing/_icons/eb-sparkles.svg" className="size-[19px]" />}>
              One sample, five answers
            </Eyebrow>
            <h2 className="mt-[8px] text-[36px] font-semibold leading-[1.06] tracking-[-0.025em] text-[#FAF6EF] sm:text-[46px] lg:text-[58px] lg:leading-[61.48px]">
              Know your risk before you begin.
              <span className="block text-[#F3D5B2]">Or finally understand what happened.</span>
            </h2>
            <p className="mt-[24px] max-w-[640px] text-[17px] leading-[27.63px] text-[rgba(250,246,239,0.8)]">
              Pregnancy loss panel, plus PCOS, depression, bone health and arthritis. All from one saliva kit. All in 7
              days. With a genetic counsellor to walk you through every result.
            </p>

            <div className="mt-[28px]">
              <SheenButton href="#check" tone="light" className="text-[16px]">
                Know my pregnancy risk
              </SheenButton>
            </div>

            <div className="mt-[24px] flex flex-wrap items-center justify-center gap-x-[10px] gap-y-[6px] text-[13px] font-medium">
              {META.map((m, i) => (
                <span key={m} className="inline-flex items-center gap-[10px]">
                  {i > 0 && <span className="text-[rgba(243,213,178,0.5)]">·</span>}
                  <span className="text-[rgba(250,246,239,0.65)]">{m}</span>
                </span>
              ))}
            </div>

            {/* couples bundle nudge */}
            <div className="mt-[36px] flex w-full flex-col items-start gap-[20px] rounded-[24px] border border-[#E5E7EB]/15 bg-white/[0.07] px-[24px] py-[24px] text-left sm:flex-row sm:items-center sm:px-[32px]">
              <span className="grid size-[56px] shrink-0 place-items-center rounded-[16px] bg-[rgba(243,213,178,0.2)] text-[#F3D5B2]">
                <FigIcon src="/landing/_icons/users.svg" className="size-[28px]" />
              </span>
              <div className="flex-1">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(243,213,178,0.8)]">
                  Planning a family together?
                </div>
                <p className="mt-[4px] text-[14.5px] leading-[23.56px] text-[rgba(250,246,239,0.85)]">
                  The <strong className="font-semibold text-[#FAF6EF]">‘Know Before You Begin’ bundle</strong> covers
                  both partners, Women’s Health plus Men’s Health plus a joint counselling session. The most complete
                  pre-conception genetic picture a couple can have.
                </p>
              </div>
              <a
                href="#"
                className="inline-flex shrink-0 items-center gap-[8px] rounded-full border border-[rgba(243,213,178,0.4)] py-[9.5px] pl-[20px] pr-[16px] text-[13.5px] font-semibold text-[#F3D5B2] transition-colors hover:bg-[rgba(243,213,178,0.1)]"
              >
                Explore bundle
                <FigIcon src="/landing/_icons/arrow.svg" className="size-[18px]" />
              </a>
            </div>

            <figure className="mt-[40px] flex flex-col items-center gap-[16px] border-t border-white/10 pt-[40px]">
              <blockquote className="max-w-[640px] text-[20px] italic leading-[1.6] text-[rgba(250,246,239,0.9)] sm:text-[22px]">
                “Your genes don’t change, and knowing what is in your genes can help you take better care of your
                health.”
              </blockquote>
              <figcaption className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[rgba(243,213,178,0.8)]">
                Neotech World Lab · Women’s Health DNA Report
              </figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </section>
  );
}
