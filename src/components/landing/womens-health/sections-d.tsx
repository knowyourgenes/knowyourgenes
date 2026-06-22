import Image from 'next/image';
import { Container, Eyebrow, FigIcon, SheenButton } from '../shared/ui';

/* ==================== 12 · TRUST ==================== */

const CERTS = [
  { icon: '/landing/icons/cert-nabl.svg', label: 'NABL · MC-6400' },
  { icon: '/landing/icons/cert-iso9001.svg', label: 'ISO 9001:2015' },
  { icon: '/landing/icons/cert-iso27001.svg', label: 'ISO 27001:2013' },
  { icon: '/landing/icons/cert-acmg.svg', label: 'ACMG · CPIC' },
  { icon: '/landing/icons/cert-hipaa.svg', label: 'HIPAA · FDA' },
];

export function TrustSection() {
  return (
    <section className="relative overflow-hidden py-[80px] lg:py-[100px]">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(248,228,204,0) 0%, rgba(248,228,204,0.4) 50%, rgba(248,228,204,0) 100%)',
        }}
      />
      <Container>
        <div className="grid items-center gap-[48px] lg:grid-cols-2">
          {/* image card */}
          <div className="reveal relative overflow-hidden rounded-[30px] shadow-[0_40px_100px_rgba(45,32,18,0.14),0_12px_36px_rgba(45,32,18,0.1)]">
            <div className="relative aspect-[568/483] w-full">
              <Image
                src="/landing/womens-health/trust.png"
                alt="A genetic counsellor in teal scrubs"
                fill
                sizes="(max-width:1024px) 90vw, 568px"
                className="object-cover object-[50%_28%]"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(0deg, rgba(31,26,20,0.55) 0%, rgba(31,26,20,0) 50%)' }}
              />
            </div>
            <div className="absolute inset-x-5 bottom-5 flex items-center gap-[14px] rounded-[16px] border border-white/60 bg-white/85 px-[20px] py-[16px] backdrop-blur-[12px]">
              <span className="grid size-[40px] shrink-0 place-items-center rounded-[12px] bg-[rgba(14,77,75,0.1)] text-[#0E4D4B]">
                <FigIcon src="/landing/icons/user-round.svg" className="size-[22px]" />
              </span>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B6358]">
                  Expert review
                </div>
                <p className="text-[14px] leading-[21px] text-[#2D2A24]">
                  Every report manually reviewed by{' '}
                  <strong className="font-semibold text-[#1F1A14]">Dr. Varun Sharma, Ph.D</strong>, Scientist, Human
                  Genetics.
                </p>
              </div>
            </div>
          </div>

          {/* content */}
          <div className="reveal-r flex flex-col gap-[16px]">
            <Eyebrow icon={<FigIcon src="/landing/icons/eb-trust.svg" className="size-[19px]" />}>Trust</Eyebrow>
            <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.022em] text-[#1F1A14] sm:text-[36px] lg:text-[40px] lg:leading-[44px]">
              The science is real. <span className="font-medium text-[#6B6358]">The lab is certified.</span>
            </h2>
            <p className="text-[15.5px] leading-[23.25px] text-[#2D2A24]">
              Tested by <strong className="font-semibold text-[#1F1A14]">Neotech World Lab Pvt. Ltd.</strong>, MG Road,
              Gurugram.
            </p>

            <div className="mt-[12px] flex flex-wrap gap-[10px]">
              {CERTS.map(({ icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-[8px] rounded-full border border-[rgba(31,26,20,0.08)] bg-white/70 px-[16px] py-[8px] text-[13px] font-medium text-[#2D2A24]"
                >
                  <FigIcon src={icon} className="size-[16px] text-[#0E4D4B]" />
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-[12px] flex flex-col">
              <div className="flex items-start gap-[16px] border-t border-[rgba(31,26,20,0.08)] py-[16px]">
                <FigIcon src="/landing/icons/activity.svg" className="mt-[1px] size-[22px] shrink-0 text-[#0E4D4B]" />
                <p className="text-[14.5px] font-semibold leading-[21.75px]">
                  <span className="text-[#1F1A14]">Technology:</span>
                  <span className="font-normal text-[#2D2A24]">
                    {' '}
                    Illumina Infinium SNP array · 99%+ reproducibility · &gt;98% call rate.
                  </span>
                </p>
              </div>
              <div className="flex items-start gap-[16px] border-t border-[rgba(31,26,20,0.08)] py-[16px]">
                <FigIcon src="/landing/icons/shield.svg" className="mt-[1px] size-[22px] shrink-0 text-[#0E4D4B]" />
                <p className="text-[14.5px] font-semibold leading-[21.75px]">
                  <span className="text-[#1F1A14]">Your data is yours.</span>
                  <span className="font-normal text-[#2D2A24]">
                    {' '}
                    Never sold or shared. Sample destroyed after processing.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ==================== 13 · FAQs ==================== */

const FAQS = [
  {
    q: 'I’ve already been diagnosed with PCOS. Is this test still useful?',
    a: 'Yes. A diagnosis tells you that you have PCOS; your THADA result helps explain the genetic “why” behind it. That tells your doctor how closely to watch related risks like type 2 diabetes, and turns long-term management into something proactive rather than reactive.',
  },
  {
    q: 'What if my PCOS risk comes back as Good (low risk)?',
    a: 'That’s genuinely good news, and still useful. A Good result means PCOS isn’t written into your THADA blueprint, so persistent symptoms likely have a different cause worth investigating rather than dismissing. You also still receive your other four panels in the same report.',
  },
  {
    q: 'Will this tell me if I’m infertile?',
    a: 'No, it doesn’t diagnose infertility. It tells you your genetic predisposition to PCOS, a leading cause of female infertility, so you and your doctor can start the right conversations earlier instead of after months of trying.',
  },
  {
    q: 'Is this a replacement for seeing a gynaecologist?',
    a: 'Not at all, it makes that visit better. You arrive with genetic data instead of a list of dismissed symptoms. Your gynaecologist stays your decision-maker; the report and your free counselling session simply give them more to work with.',
  },
];

export function FaqsSection() {
  return (
    <section id="faqs" className="py-[72px] lg:py-[88px]">
      <Container>
        <div className="mx-auto max-w-[860px]">
          <div className="reveal">
            <Eyebrow icon={<FigIcon src="/landing/icons/eb-faqs.svg" className="size-[19px]" />}>FAQs</Eyebrow>
            <h2 className="mt-[24px] text-[34px] font-semibold leading-[1.08] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
              Questions about PCOS and genetic testing.
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
                    <FigIcon src="/landing/icons/plus.svg" className="size-[18px]" />
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

/* ============== 14 · ALSO PART OF THIS REPORT ============== */

const PANELS = [
  {
    icon: '/landing/icons/panel-pregnancy.svg',
    gene: 'MTHFR + FOXP3',
    title: 'Pregnancy Loss Risk',
    desc: 'Know your risk before you begin trying.',
  },
  {
    icon: '/landing/icons/panel-depression.svg',
    gene: 'COMT gene',
    title: 'Post-Pregnancy Depression',
    desc: '50% of episodes start before delivery. Know your vulnerability.',
  },
  {
    icon: '/landing/icons/panel-bone.svg',
    gene: 'AKAP11 · LRP5 · ZBTB40',
    title: 'Osteoporosis & Bone Health',
    desc: 'Bone loss starts in your 30s. Silently.',
  },
  {
    icon: '/landing/icons/panel-arthritis.svg',
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
          <Eyebrow icon={<FigIcon src="/landing/icons/eb-alsopart.svg" className="size-[19px]" />}>
            One sample, five answers
          </Eyebrow>
          <h2 className="mt-[20px] text-[34px] font-semibold leading-[1.07] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            The PCOS panel is Panel 01 of 5.{' '}
            <span className="font-medium text-[#6B6358]">Your report also covers:</span>
          </h2>
        </div>

        <div className="mt-[20px] grid gap-[16px] sm:grid-cols-2">
          {PANELS.map(({ icon, gene, title, desc }) => (
            <a
              key={title}
              href="#"
              className="reveal group flex flex-col rounded-[24px] border border-[rgba(31,26,20,0.08)] bg-white/75 p-[28px] transition-colors hover:border-[rgba(14,77,75,0.25)] hover:bg-white"
            >
              <span className="grid size-[48px] place-items-center rounded-[14px] bg-[rgba(14,77,75,0.08)] text-[#0E4D4B]">
                <FigIcon src={icon} className="size-[24px]" />
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
                <FigIcon
                  src="/landing/icons/arrow-ur.svg"
                  className="size-[16px] transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
                />
              </span>
            </a>
          ))}
        </div>

        {/* CTA banner */}
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
              All 5 panels explained · who this test is for · at every age
            </p>
          </div>
          <span className="grid size-[48px] shrink-0 place-items-center rounded-full bg-white/15 text-[#FAF6EF] transition-colors group-hover:bg-white/25">
            <FigIcon src="/landing/icons/arrow-ur.svg" className="size-[24px]" />
          </span>
        </a>
      </Container>
    </section>
  );
}

/* ==================== 15 · FINAL CTA ==================== */

const META = ['At-home saliva kit', 'Neotech World Lab', 'NABL accredited', '7-day results', 'Free counselling'];

export function FinalCtaSection() {
  return (
    <section id="check" className="py-[40px] lg:py-[64px]">
      <Container>
        <div
          className="reveal relative overflow-hidden rounded-[40px] px-6 py-[64px] text-center sm:px-12 lg:px-[120px] lg:py-[80px]"
          style={{ background: 'linear-gradient(149deg, #0E4D4B 0%, #082F2D 100%)' }}
        >
          {/* helix accents */}
          <FigIcon
            src="/landing/icons/helix-accent.svg"
            className="pointer-events-none absolute -left-6 top-1/2 hidden h-[360px] w-[120px] -translate-y-1/2 text-white/[0.06] lg:block"
          />
          <FigIcon
            src="/landing/icons/helix-accent.svg"
            className="pointer-events-none absolute -right-6 top-1/2 hidden h-[360px] w-[120px] -translate-y-1/2 scale-x-[-1] text-white/[0.06] lg:block"
          />

          <div className="relative mx-auto flex max-w-[760px] flex-col items-center">
            <Eyebrow tone="dark" icon={<FigIcon src="/landing/icons/eb-finalcta.svg" className="size-[19px]" />}>
              Is your PCOS genetic?
            </Eyebrow>
            <h2 className="mt-[8px] text-[36px] font-semibold leading-[1.04] tracking-[-0.025em] text-[#FAF6EF] sm:text-[48px] lg:text-[60px] lg:leading-[62.4px]">
              One saliva sample answers that.
              <span className="block text-[#F3D5B2]">And four other questions you didn’t know to ask.</span>
            </h2>
            <p className="mt-[24px] max-w-[640px] text-[17px] leading-[27.63px] text-[rgba(250,246,239,0.8)]">
              PCOS panel, plus pregnancy risk, depression risk, bone health and arthritis risk. All from one kit. All in
              7 days.
            </p>

            <div className="mt-[28px]">
              <SheenButton href="#check" tone="light" className="text-[16px]">
                Check my PCOS genetic risk
              </SheenButton>
            </div>

            <div className="mt-[28px] flex flex-wrap items-center justify-center gap-x-[10px] gap-y-[6px] text-[13px] font-medium">
              {META.map((m, i) => (
                <span key={m} className="inline-flex items-center gap-[10px]">
                  {i > 0 && <span className="text-[rgba(243,213,178,0.5)]">·</span>}
                  <span className="text-[rgba(250,246,239,0.65)]">{m}</span>
                </span>
              ))}
            </div>

            <figure className="mt-[44px] flex flex-col items-center gap-[16px] border-t border-white/10 pt-[40px]">
              <blockquote className="max-w-[640px] text-[20px] italic leading-[1.6] text-[rgba(250,246,239,0.9)] sm:text-[22px]">
                “Your genes don’t change; they are what they are. And knowing what is in your genes can help you take
                better care of your health.”
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
