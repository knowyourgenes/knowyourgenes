import Image from 'next/image';
import { Container, Eyebrow, FigIcon, SheenButton } from '../shared/ui';

/* ==================== 15 · TRUST ==================== */

const CERTS = [
  { icon: '/landing/icons/cert-nabl.svg', label: 'NABL · MC-6400' },
  { icon: '/landing/icons/cert-iso9001.svg', label: 'ISO 9001:2015' },
  { icon: '/landing/icons/cert-iso27001.svg', label: 'ISO 27001:2013' },
  { icon: '/landing/icons/cert-acmg.svg', label: 'ACMG · CPIC' },
  { icon: '/landing/icons/cert-hipaa.svg', label: 'HIPAA · FDA' },
];

const CRED_ROWS = [
  {
    icon: '/landing/icons/pp-microscope.svg',
    label: 'Technology:',
    body: ' Illumina Infinium SNP array · 99%+ reproducibility · >98% call rate.',
  },
  {
    icon: '/landing/icons/pp-file-user.svg',
    label: 'Expert review:',
    body: ' every report reviewed by Dr. Varun Sharma, Ph.D, Scientist, Human Genetics.',
  },
  {
    icon: '/landing/icons/pp-lock.svg',
    label: 'Your data:',
    body: ' never sold, never shared. Sample destroyed after processing. Request deletion anytime.',
  },
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
          <div className="reveal relative overflow-hidden rounded-sm shadow-[0_40px_100px_rgba(20,45,40,0.15),0_12px_36px_rgba(20,45,40,0.1)]">
            <div className="relative aspect-[568/483] w-full">
              <Image
                src="/landing/peripartum-depression/trust.png"
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
            <div className="absolute inset-x-5 bottom-5 flex items-start gap-[14px] rounded-sm bg-white px-[20px] py-[16px] shadow-[0_14px_34px_rgba(20,45,40,0.22)]">
              <span className="grid size-[40px] shrink-0 place-items-center rounded-sm bg-[#0E4D4B] text-[#FAF6EF]">
                <FigIcon src="/landing/icons/pp-lock.svg" className="size-[22px]" />
              </span>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0E4D4B]">
                  Completely confidential
                </div>
                <p className="text-[13.5px] leading-[18.56px] text-[#2D2A24]">
                  Your result is delivered only to you. Never shared with family or any third party. You can request
                  deletion anytime.
                </p>
              </div>
            </div>
          </div>

          <div className="reveal-r flex flex-col gap-[16px]">
            <Eyebrow icon={<FigIcon src="/landing/icons/eb-shield-check.svg" className="size-[19px]" />}>Trust</Eyebrow>
            <h2 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.022em] sm:text-[36px] lg:text-[40px] lg:leading-[44px]">
              <span className="text-[#1F1A14]">The science is real. The lab is certified. </span>
              <span className="font-medium text-[#6B6358]">Your data is private.</span>
            </h2>
            <p className="text-[15.5px] leading-[23.25px] text-[#2D2A24]">
              Tested by <strong className="font-semibold text-[#1F1A14]">Neotech World Lab Pvt. Ltd.</strong>, MG Road,
              Gurugram, Haryana.
            </p>

            <div className="mt-[12px] flex flex-wrap gap-[10px]">
              {CERTS.map(({ icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-[8px] rounded-sm border border-[rgba(31,26,20,0.08)] bg-white/70 px-[16px] py-[8px] text-[13px] font-medium text-[#2D2A24]"
                >
                  <FigIcon src={icon} className="size-[16px] text-[#0E4D4B]" />
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-[12px] flex flex-col border-t border-[rgba(31,26,20,0.08)]">
              {CRED_ROWS.map(({ icon, label, body }, i) => (
                <div
                  key={label}
                  className={`flex items-start gap-[16px] py-[16px] ${i > 0 ? 'border-t border-[rgba(31,26,20,0.08)]' : ''}`}
                >
                  <FigIcon src={icon} className="mt-[1px] size-[22px] shrink-0 text-[#0E4D4B]" />
                  <p className="text-[15.5px] font-semibold leading-[23.25px]">
                    <span className="text-[#1F1A14]">{label}</span>
                    <span className="font-normal text-[#2D2A24]">{body}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ==================== 16 · FAQs ==================== */

const FAQS = [
  {
    q: 'Does a Poor COMT result mean I will definitely get depression during pregnancy?',
    a: 'No. A Poor result means low COMT enzyme activity, a higher genetic vulnerability, not a diagnosis or a certainty. Many women with this variant never develop depression. What it does is tell you, your partner, and your doctor to watch for it and prepare, so that if symptoms appear, support is already in place.',
  },
  {
    q: 'I had post-pregnancy depression after my first child. Should I take this?',
    a: 'Yes. It can give a biological name to an experience that may have felt confusing or shaming, and a Poor COMT result often explains what happened. More importantly, it lets you and your doctor build a concrete plan before a future pregnancy, instead of facing it unprepared again.',
  },
  {
    q: 'Can I share my COMT result with my psychiatrist or therapist?',
    a: 'Absolutely, and you’re encouraged to. Your report is written in plain language but contains the genotype and clinical context a psychiatrist, therapist, or OB-GYN can act on. Bringing it to them turns a vague conversation into a specific, informed one.',
  },
  {
    q: 'Is this information confidential? I don’t want my family to know.',
    a: 'Completely. Your result is delivered only to you, never to family or any third party, and you can request deletion at any time. What you choose to share, and with whom, is entirely your decision.',
  },
];

export function FaqsSection() {
  return (
    <section id="faqs" className="py-[72px] lg:py-[88px]">
      <Container>
        <div className="mx-auto max-w-[880px]">
          <div className="reveal">
            <Eyebrow icon={<FigIcon src="/landing/icons/eb-sparkles.svg" className="size-[19px]" />}>FAQs</Eyebrow>
            <h2 className="mt-[24px] text-[34px] font-semibold leading-[1.08] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
              Questions about the COMT gene and peripartum depression.
            </h2>
          </div>

          <div className="reveal mt-[40px] border-y border-[rgba(31,26,20,0.08)]">
            {FAQS.map((item, i) => (
              <details key={item.q} className={`faq group ${i > 0 ? 'border-t border-[rgba(31,26,20,0.08)]' : ''}`}>
                <summary className="flex items-center justify-between gap-[20px] py-[24px]">
                  <span className="text-[18px] font-semibold leading-[27px] tracking-[-0.025em] text-[#1F1A14]">
                    {item.q}
                  </span>
                  <span className="faq-plus grid size-[36px] shrink-0 place-items-center rounded-sm bg-[rgba(14,77,75,0.08)] text-[#0E4D4B]">
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

/* ============== 17 · ALSO PART OF THIS REPORT ============== */

const PANELS = [
  {
    icon: '/landing/icons/panel-pcos.svg',
    gene: 'THADA gene',
    title: 'PCOS Risk',
    desc: '1 in 5 Indian women has PCOS. Know if yours is genetic.',
  },
  {
    icon: '/landing/icons/panel-pregloss.svg',
    gene: 'MTHFR + FOXP3',
    title: 'Pregnancy Loss Risk',
    desc: 'Know your risk before you begin trying.',
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
          <Eyebrow icon={<FigIcon src="/landing/icons/eb-sparkles.svg" className="size-[19px]" />}>
            One sample, five answers
          </Eyebrow>
          <h2 className="mt-[20px] text-[34px] font-semibold leading-[1.07] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            The depression panel is Panel 03 of 5.{' '}
            <span className="font-medium text-[#6B6358]">Your report also covers:</span>
          </h2>
        </div>

        <div className="mt-[20px] grid gap-[16px] sm:grid-cols-2 lg:grid-cols-4">
          {PANELS.map(({ icon, gene, title, desc }) => (
            <a
              key={title}
              href="#"
              className="reveal group flex flex-col rounded-sm border border-[rgba(31,26,20,0.08)] bg-white/75 p-[28px] transition-colors hover:border-[rgba(14,77,75,0.25)] hover:bg-white"
            >
              <span className="grid size-[48px] place-items-center rounded-sm bg-[rgba(14,77,75,0.08)] text-[#0E4D4B]">
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

        <a
          href="#check"
          className="reveal group mt-[20px] flex items-center justify-between gap-[20px] rounded-sm bg-[#1F1A14] px-[28px] py-[24px] sm:px-[36px]"
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
          <span className="grid size-[48px] shrink-0 place-items-center rounded-sm bg-white/15 text-[#FAF6EF] transition-colors group-hover:bg-white/25">
            <FigIcon src="/landing/icons/arrow-ur.svg" className="size-[24px]" />
          </span>
        </a>
      </Container>
    </section>
  );
}

/* ==================== 18 · FINAL CTA ==================== */

const META = ['At-home saliva kit', 'Neotech World Lab', 'NABL accredited', '7-day results', 'Free counselling'];

export function FinalCtaSection() {
  return (
    <section id="check" className="py-[40px] lg:py-[64px]">
      <Container>
        <div
          className="reveal relative overflow-hidden rounded-sm px-6 py-[64px] text-center sm:px-12 lg:px-[120px] lg:py-[80px]"
          style={{ background: 'linear-gradient(145deg, #0E4D4B 0%, #082F2D 100%)' }}
        >
          <FigIcon
            src="/landing/icons/helix-accent.svg"
            className="pointer-events-none absolute -left-6 top-1/2 hidden h-[360px] w-[120px] -translate-y-1/2 text-white/[0.06] lg:block"
          />
          <FigIcon
            src="/landing/icons/helix-accent.svg"
            className="pointer-events-none absolute -right-6 top-1/2 hidden h-[360px] w-[120px] -translate-y-1/2 scale-x-[-1] text-white/[0.06] lg:block"
          />

          <div className="relative mx-auto flex max-w-[760px] flex-col items-center">
            <Eyebrow tone="dark" icon={<FigIcon src="/landing/icons/eb-sparkles.svg" className="size-[19px]" />}>
              Close with calm, not fear
            </Eyebrow>
            <h2 className="mt-[8px] text-[34px] font-semibold leading-[1.08] tracking-[-0.025em] text-[#FAF6EF] sm:text-[44px] lg:text-[54px] lg:leading-[58.32px]">
              You deserve to go into pregnancy knowing what to watch for.
              <span className="block text-[#F3D5B2]">Not discovering it in the middle of it.</span>
            </h2>
            <p className="mt-[24px] max-w-[640px] text-[17px] leading-[27.63px] text-[rgba(250,246,239,0.8)]">
              Peripartum depression risk, plus PCOS, pregnancy loss, bone health and arthritis. All from one saliva kit.
              All in 7 days. With a counsellor who speaks to you, not at you.
            </p>

            <div className="mt-[28px]">
              <SheenButton href="#check" tone="light" className="text-[16px]">
                Know my genetic vulnerability
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
            <div className="mt-[36px] flex w-full flex-col items-start gap-[20px] rounded-sm border border-[#E5E7EB]/15 bg-white/[0.07] px-[24px] py-[24px] text-left sm:flex-row sm:items-center sm:px-[32px]">
              <span className="grid size-[56px] shrink-0 place-items-center rounded-sm bg-[rgba(243,213,178,0.2)] text-[#F3D5B2]">
                <FigIcon src="/landing/icons/users.svg" className="size-[28px]" />
              </span>
              <div className="flex-1">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(243,213,178,0.8)]">
                  Planning a family?
                </div>
                <p className="mt-[4px] text-[14.5px] leading-[23.56px] text-[rgba(250,246,239,0.85)]">
                  The <strong className="font-semibold text-[#FAF6EF]">‘Know Before You Begin’ bundle</strong> covers
                  both partners, Women’s Health plus Men’s Health plus joint counselling. The most complete
                  pre-conception picture a couple can have.
                </p>
              </div>
              <a
                href="#"
                className="inline-flex shrink-0 items-center gap-[8px] rounded-sm border border-[rgba(243,213,178,0.4)] py-[9.5px] pl-[20px] pr-[16px] text-[13.5px] font-semibold text-[#F3D5B2] transition-colors hover:bg-[rgba(243,213,178,0.1)]"
              >
                Explore bundle
                <FigIcon src="/landing/icons/arrow.svg" className="size-[18px]" />
              </a>
            </div>

            <figure className="mt-[40px] flex flex-col items-center gap-[16px] border-t border-white/10 pt-[40px]">
              <blockquote className="max-w-[640px] text-[22px] font-semibold italic leading-[1.55] text-[#FAF6EF] sm:text-[26px]">
                “It’s not weakness. It’s not bad luck. It’s a gene. And knowing your gene is the beginning of everything
                that comes next.”
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
