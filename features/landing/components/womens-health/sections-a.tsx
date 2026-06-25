'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Container, Eyebrow, FigIcon, GhostButton, GradientText, SheenButton, gTeal } from '../shared/ui';

/* ============================ 1 · HERO ============================ */

export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden pt-[44px] pb-[80px] sm:pt-[56px] lg:pb-[96px]">
      {/* exact Figma decorative background - node 195:142 (peach blobs · dashed DNA-helix motif · accent dots) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 hidden bg-[length:100%_100%] bg-no-repeat lg:block"
        style={{ backgroundImage: 'url(/landing/womens-health/hero-bg.svg)' }}
      />
      {/* mobile: soft peach wash */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 lg:hidden"
        style={{
          background:
            'radial-gradient(42% 54% at 0% -6%, rgba(248,228,204,0.9) 0%, rgba(248,228,204,0) 56%), radial-gradient(34% 44% at 36% 104%, rgba(248,228,204,0.72) 0%, rgba(248,228,204,0) 58%)',
        }}
      />
      <Container>
        <div className="grid items-center gap-[56px] lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-[40px]">
          {/* -- copy -- */}
          <div className="max-w-[600px]">
            <span className="inline-flex items-center gap-[10px] rounded-full bg-[#0E4D4B] py-[8px] pl-[12px] pr-[20px] shadow-[0_14px_32px_-8px_rgba(14,77,75,0.42)]">
              <span className="grid size-[28px] place-items-center rounded-full bg-[rgba(37,181,171,0.25)] text-[#FAF6EF]">
                <FigIcon src="/landing/icons/hero-badge.svg" className="size-[18px]" />
              </span>
              <span className="text-[13.5px] font-semibold leading-[20.25px] text-[#FAF6EF]">
                PCOS Genetic Risk Test · At-home saliva kit
              </span>
            </span>

            <h1 className="mt-[22px]">
              <span className="block text-[44px] font-semibold leading-[0.96] tracking-[-0.038em] text-[#1F1A14] sm:text-[58px] lg:text-[80px]">
                Is your PCOS genetic?
              </span>
              <span className="mt-[10px] block text-[26px] font-medium leading-[1.06] tracking-[-0.02em] text-[#2D2A24] sm:text-[34px] lg:text-[45px]">
                Now you can{' '}
                <GradientText image={gTeal(169)} className="font-semibold">
                  actually find out.
                </GradientText>
              </span>
            </h1>

            <p className="mt-[26px] max-w-[560px] text-[18px] leading-[1.55] lg:text-[20px] lg:leading-[31px]">
              <span className="font-semibold text-[#1F1A14]">1 in 5 Indian women has PCOS.</span>
              <span className="font-normal text-[#2D2A24]">
                {' '}
                Most spend 2 to 3 years getting a diagnosis while their symptoms are dismissed as stress, lifestyle, or
                “just irregular cycles.” Your{' '}
              </span>
              <span className="font-semibold text-[#0E4D4B]">THADA gene variant</span>
              <span className="font-normal text-[#2D2A24]">
                {' '}
                tells you your genetic predisposition, so you can stop guessing and start managing.
              </span>
            </p>

            <div className="mt-[30px] flex flex-wrap items-center gap-x-[6px] gap-y-[14px]">
              <SheenButton href="#check">Check my PCOS genetic risk</SheenButton>
              <GhostButton href="#what">What is PCOS, really?</GhostButton>
            </div>

            <div className="mt-[26px] flex flex-wrap items-center gap-x-[22px] gap-y-[10px]">
              {['No needles', 'Results in 7 days', '30-min free counselling'].map((t) => (
                <span key={t} className="inline-flex items-center gap-[6px] text-[13.5px] font-medium text-[#6B6358]">
                  <FigIcon src="/landing/icons/check.svg" className="size-[16px] text-[#0E4D4B]" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* -- asset -- */}
          <div className="relative mx-auto w-full max-w-[460px]">
            {/* soft cream halo to lift the card off the teal */}
            <div
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[80px] blur-[44px]"
              style={{
                background: 'radial-gradient(60% 60% at 50% 45%, rgba(250,246,239,0.55) 0%, rgba(250,246,239,0) 72%)',
              }}
            />
            {/* DNA double-helix motif - exact Figma asset (node 195:142), sits behind the photo and to its right */}
            <div
              className="pointer-events-none absolute left-[82%] top-1/2 aspect-[173/556] h-[88%] -translate-y-1/2 bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: 'url(/landing/womens-health/hero-helix.svg)' }}
            />

            {/* photo card */}
            <div className="relative aspect-[460/575] w-full overflow-hidden rounded-t-[150px] rounded-b-[38px] bg-[#F5EDDF] shadow-[0_40px_100px_rgba(45,32,18,0.14),0_12px_36px_rgba(45,32,18,0.1)]">
              <Image
                src="/landing/womens-health/hero.png"
                alt="A young woman sitting calmly at home"
                fill
                priority
                sizes="(max-width:1024px) 90vw, 460px"
                className="object-cover object-top"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(0deg, rgba(31,26,20,0.4) 0%, rgba(31,26,20,0) 50%)' }}
              />
            </div>

            {/* 1 in 5 badge */}
            <div className="float-slow absolute -top-4 right-3 grid size-[88px] place-items-center rounded-full bg-[#0E4D4B] text-center shadow-[0_16px_40px_-8px_rgba(14,77,75,0.5)]">
              <div>
                <div className="font-hind text-[26px] font-semibold leading-none text-[#FAF6EF]">1 in 5</div>
                <div className="mt-[4px] text-[9.5px] font-normal uppercase leading-none tracking-[0.12em] text-[rgba(243,213,178,0.9)]">
                  has PCOS
                </div>
              </div>
            </div>

            {/* gene chip */}
            <div className="absolute -top-5 left-6 flex items-center gap-[10px] rounded-[16px] border border-white/60 bg-white/85 py-[10px] pl-[12px] pr-[14px] shadow-[0_18px_50px_rgba(45,32,18,0.08),0_4px_16px_rgba(45,32,18,0.06)] backdrop-blur-[12px]">
              <span className="grid size-[36px] place-items-center rounded-[12px] bg-[rgba(14,77,75,0.1)] text-[#0E4D4B]">
                <FigIcon src="/landing/icons/hero-gene.svg" className="size-[20px]" />
              </span>
              <div className="leading-tight">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B6358]">Gene tested</div>
                <div className="text-[15px] font-semibold text-[#1F1A14]">THADA</div>
              </div>
            </div>

            {/* 7-day chip */}
            <div className="absolute -bottom-5 left-12 flex items-center gap-[12px] rounded-[16px] border border-white/60 bg-white/90 py-[12px] pl-[14px] pr-[16px] shadow-[0_18px_50px_rgba(45,32,18,0.08),0_4px_16px_rgba(45,32,18,0.06)] backdrop-blur-[12px]">
              <span
                className="grid size-[40px] place-items-center rounded-[12px] text-[#1F1A14]"
                style={{ background: 'linear-gradient(135deg, #F3D5B2 0%, #F8E4CC 100%)' }}
              >
                <FigIcon src="/landing/icons/hero-clock.svg" className="size-[21px]" />
              </span>
              <div className="leading-tight">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B6358]">
                  Lab to report
                </div>
                <div className="text-[19px] font-semibold text-[#1F1A14]">7 days</div>
              </div>
            </div>
          </div>
        </div>

        {/* social-proof line */}
        <div className="reveal mt-[64px] flex flex-col items-start gap-[16px] rounded-[22px] border border-[rgba(31,26,20,0.08)] bg-white/55 px-[28px] py-[16px] backdrop-blur-[8px] sm:flex-row sm:items-center sm:gap-[20px]">
          <span className="inline-flex shrink-0 items-center gap-[8px]">
            <FigIcon src="/landing/icons/shield-check.svg" className="size-[19px] text-[#0E4D4B]" />
            <span className="text-[12.5px] font-bold uppercase tracking-[0.1em] text-[#0E4D4B]">
              Women’s Health DNA
            </span>
          </span>
          <p className="text-[15px] leading-[24px] text-[#2D2A24]">
            Part of the 5-panel report. Tested by{' '}
            <span className="font-semibold text-[#1F1A14]">NABL-accredited Neotech World Lab</span>. Also covers
            pregnancy, depression, bone health and arthritis risk.
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ========================= TRUST BAND ========================= */

const TRUST_BADGES = [
  { icon: '/landing/icons/cert-nabl.svg', title: 'NABL Accredited', sub: 'Cert. MC-6400' },
  { icon: '/landing/icons/cert-iso.svg', title: 'ISO Certified', sub: '9001 & 27001' },
  { icon: '/landing/icons/cert-illumina.svg', title: 'Illumina SNP', sub: 'Genotyping array' },
  { icon: '/landing/icons/cert-accuracy.svg', title: '99%+ Accuracy', sub: 'Reproducibility' },
  { icon: '/landing/icons/cert-expert.svg', title: 'Expert-reviewed', sub: 'Human geneticist' },
];

export function TrustBand() {
  return (
    <section
      className="relative overflow-hidden py-[64px]"
      style={{
        background: 'linear-gradient(180deg, #0E4D4B 0%, #082F2D 100%)',
        boxShadow: 'inset 0 -18px 30px -22px rgba(0,0,0,0.55), inset 0 18px 30px -22px rgba(0,0,0,0.55)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
        style={{
          background:
            'linear-gradient(90deg, rgba(31,26,20,0.05) 0%, rgba(31,26,20,0) 10%, #25B5AB 34%, #0E4D4B 50%, #25B5AB 66%, rgba(37,181,171,0) 90%, rgba(31,26,20,0.05) 100%)',
          boxShadow: '0 0 10px rgba(37,181,171,0.3)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 12% 0%, rgba(37,181,171,0.22) 0%, rgba(37,181,171,0) 60%), radial-gradient(circle at 88% 100%, rgba(248,228,204,0.1) 0%, rgba(248,228,204,0) 60%)',
        }}
      />
      <Container className="relative">
        <div className="flex flex-col items-center text-center">
          <Eyebrow tone="dark" icon={<FigIcon src="/landing/icons/eb-trustband.svg" className="size-[19px]" />}>
            Certified &amp; trusted
          </Eyebrow>
          <h2 className="mt-[16px] max-w-[680px] text-[26px] font-semibold leading-[1.28] tracking-[-0.018em] text-[rgba(250,246,239,0.95)] sm:text-[28px] sm:leading-[42px]">
            Real lab. Real science. Real accreditation.
          </h2>
        </div>

        <div className="mt-[36px] grid grid-cols-2 gap-[16px] sm:grid-cols-3 lg:grid-cols-5">
          {TRUST_BADGES.map(({ icon, title, sub }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-[12px] rounded-[24px] border border-white/10 bg-white/5 p-[20px] text-center"
            >
              <span className="grid size-[48px] place-items-center rounded-[16px] bg-[rgba(37,181,171,0.15)] text-[#25B5AB]">
                <FigIcon src={icon} className="size-[26px]" />
              </span>
              <div>
                <div className="text-[14.5px] font-semibold leading-[18px] text-[#FAF6EF]">{title}</div>
                <div className="mt-[2px] text-[12px] leading-[18px] text-[rgba(250,246,239,0.55)]">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ===================== 2 · YOU’RE NOT ALONE ===================== */

function CelebCard({
  initials,
  initialsBg,
  name,
  role,
  quote,
  footer,
  glow,
}: {
  initials: string;
  initialsBg: string;
  name: string;
  role: string;
  quote: string;
  footer: React.ReactNode;
  glow: string;
}) {
  return (
    <article className="reveal relative overflow-hidden rounded-[28px] border border-[rgba(31,26,20,0.08)] bg-white/70 p-[36px] shadow-[0_4px_14px_rgba(45,32,18,0.04),0_1px_2px_rgba(45,32,18,0.04)]">
      <div
        className="pointer-events-none absolute -right-6 -top-6 size-[128px] rounded-full blur-[40px]"
        style={{ background: glow }}
      />
      <div className="relative flex items-center gap-[16px]">
        <div
          className="grid size-[56px] shrink-0 place-items-center rounded-[16px] text-[18px] font-semibold tracking-[-0.025em] text-[#FAF6EF]"
          style={{ background: initialsBg }}
        >
          {initials}
        </div>
        <div>
          <div className="text-[18px] font-semibold leading-[22.5px] text-[#1F1A14]">{name}</div>
          <div className="text-[13px] leading-[19.5px] text-[#6B6358]">{role}</div>
        </div>
      </div>
      <p className="relative mt-[16px] text-[17px] leading-[27.63px] text-[#2D2A24]">{quote}</p>
      <p className="relative mt-[16px] border-t border-[rgba(31,26,20,0.08)] pt-[16px] text-[15px] leading-[22.5px]">
        {footer}
      </p>
    </article>
  );
}

export function NotAloneSection() {
  return (
    <section className="py-[72px] lg:py-[88px]">
      <Container>
        <div className="reveal max-w-[760px]">
          <Eyebrow icon={<FigIcon src="/landing/icons/eb-notalone.svg" className="size-[19px]" />}>
            You’re not alone
          </Eyebrow>
          <h2 className="mt-[18px] text-[34px] font-semibold leading-[1.08] tracking-[-0.022em] text-[#1F1A14] sm:text-[42px] lg:text-[46px] lg:leading-[49.68px]">
            You’re not the only woman asking this question.
          </h2>
          <p className="mt-[20px] max-w-[620px] text-[17px] leading-[28px] text-[#2D2A24] lg:text-[18.7px] lg:leading-[30.42px]">
            Women you recognise have lived this exact uncertainty: irregular cycles, dismissed symptoms, years without
            an answer.
          </p>
        </div>

        <div className="mt-[40px] grid gap-[24px] lg:grid-cols-2">
          <CelebCard
            initials="SK"
            initialsBg="#0E4D4B"
            name="Sonam Kapoor Ahuja"
            role="Has spoken publicly about living with PCOS"
            glow="rgba(248,228,204,0.4)"
            quote="Irregular periods. Hormonal challenges. Years of managing what her body was doing without fully understanding why. One of the most recognisable faces in India, and she has PCOS."
            footer={
              <>
                <span className="font-medium text-[#1F1A14]">
                  So does 1 in 5 Indian women. The difference: most don’t know it’s genetic.{' '}
                </span>
                <span className="font-semibold text-[#0E4D4B]">Yet.</span>
              </>
            }
          />
          <CelebCard
            initials="SK"
            initialsBg="#C76842"
            name="Sara Ali Khan"
            role="Diagnosed with PCOS before acting"
            glow="rgba(240,213,192,0.4)"
            quote="She managed it through diet and exercise. But the turning point was knowing what she was managing. That knowledge is what changed everything."
            footer={
              <span className="font-medium text-[#1F1A14]">
                Managing what you can name is a different game than managing in the dark.
              </span>
            }
          />
        </div>

        <div
          className="reveal mt-[24px] flex flex-col items-start gap-[20px] rounded-[28px] border border-[rgba(199,104,66,0.2)] px-[40px] py-[36px] sm:flex-row sm:items-center"
          style={{
            background:
              'linear-gradient(90deg, rgba(240,213,192,0.6) 0%, rgba(248,228,204,0.5) 50%, rgba(243,213,178,0.4) 100%)',
          }}
        >
          <FigIcon src="/landing/icons/sparkles.svg" className="size-[40px] shrink-0 text-[#C76842]" />
          <p className="text-[20px] font-semibold leading-[1.25] tracking-[-0.015em] text-[#1F1A14] sm:text-[24px] lg:text-[27px] lg:leading-[33.75px]">
            PCOS is not a lifestyle failure. It’s a genetic predisposition. Your{' '}
            <GradientText
              image="linear-gradient(165deg,#C76842 0%,#D4895E 0%,#0E4D4B 91%,#25B5AB 100%)"
              className="font-semibold"
            >
              THADA gene
            </GradientText>{' '}
            is where it starts.
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ====================== 3 · WHAT IS PCOS ====================== */

const SYMPTOMS: React.ReactNode[] = [
  <>
    Fewer than <strong className="font-semibold text-[#1F1A14]">8 periods a year</strong>, or no period for months at a
    time
  </>,
  <>
    Periods that are <strong className="font-semibold text-[#1F1A14]">heavier than normal</strong> when they do arrive
  </>,
  <>
    Unwanted hair growth on the face, chest, belly or back{' '}
    <span className="text-[#6B6358]">
      (hirsutism, affects <strong className="font-semibold text-[#C76842]">70%</strong>)
    </span>
  </>,
  <>
    Acne that <strong className="font-semibold text-[#1F1A14]">doesn’t respond</strong> to typical skincare
  </>,
  <>
    Weight gain that’s hard to explain and harder to reverse{' '}
    <span className="text-[#6B6358]">
      (affects <strong className="font-semibold text-[#C76842]">80%</strong>)
    </span>
  </>,
  <>Hair thinning on the scalp, or darkening of skin in body creases</>,
  <>Headaches triggered by hormonal shifts</>,
];

function SymptomChecklist() {
  const [on, setOn] = useState<boolean[]>(() => Array(SYMPTOMS.length).fill(false));
  const count = useMemo(() => on.filter(Boolean).length, [on]);
  const total = SYMPTOMS.length;

  const r = 30;
  const circ = 2 * Math.PI * r;

  const msg =
    count === 0
      ? 'Tap the signs you recognise to personalise your result.'
      : count <= 3
        ? `${count} sign${count > 1 ? 's' : ''} noted. Worth understanding the genetic "why".`
        : `${count} of ${total} - your genes can tell you if PCOS is the cause.`;

  return (
    <div className="flex flex-col gap-[20px] rounded-[30px] border border-[rgba(31,26,20,0.08)] bg-white/75 p-[28px] shadow-[0_18px_50px_rgba(45,32,18,0.08),0_4px_16px_rgba(45,32,18,0.06)] sm:p-[32px]">
      <div className="flex items-center justify-between gap-[12px]">
        <h3 className="text-[19px] font-semibold leading-[28.5px] tracking-[-0.025em] text-[#1F1A14]">
          Symptoms most women recognise
        </h3>
        <span className="inline-flex shrink-0 items-end gap-[6px] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0E4D4B]">
          <FigIcon src="/landing/icons/tap.svg" className="size-[16px]" />
          Tap what fits
        </span>
      </div>

      <ul>
        {SYMPTOMS.map((label, i) => (
          <li key={i}>
            <button
              type="button"
              data-on={on[i]}
              onClick={() => setOn((prev) => prev.map((v, j) => (j === i ? !v : v)))}
              className={`sx-row flex w-full items-start gap-[16px] py-[14px] text-left ${
                i > 0 ? 'border-t border-[rgba(31,26,20,0.08)]' : ''
              }`}
            >
              <span className="mt-[1px] grid size-[24px] shrink-0 place-items-center">
                <span className="sx-box grid size-[24px] place-items-center rounded-[8px] border-2 border-[rgba(14,77,75,0.3)]">
                  <FigIcon src="/landing/icons/check.svg" className="sx-tick size-[14px] text-[#FAF6EF]" />
                </span>
              </span>
              <span className="text-[15.5px] leading-[21.31px] text-[#2D2A24]">{label}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* dynamic CTA panel */}
      <div
        className="relative overflow-hidden rounded-[22px] px-[24px] pb-[24px] pt-[28px]"
        style={{ background: 'linear-gradient(173deg, #0E4D4B 0%, #0B3D3B 100%)' }}
      >
        <div className="pointer-events-none absolute -top-9 right-0 size-[144px] rounded-full bg-[rgba(37,181,171,0.15)] blur-[40px]" />
        <div className="relative flex items-center gap-[20px]">
          <div className="relative grid size-[68px] shrink-0 place-items-center">
            <svg viewBox="0 0 68 68" className="size-[68px] -rotate-90">
              <circle cx="34" cy="34" r={r} fill="none" stroke="rgba(250,246,239,0.18)" strokeWidth="5" />
              <circle
                cx="34"
                cy="34"
                r={r}
                fill="none"
                stroke="#F3D5B2"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - count / total)}
                style={{ transition: 'stroke-dashoffset .4s cubic-bezier(.22,.7,.2,1)' }}
              />
            </svg>
            <span className="absolute font-hind text-[18px] font-semibold leading-none text-[#FAF6EF]">
              {count}
              <span className="text-[13px] text-[rgba(250,246,239,0.5)]">/{total}</span>
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(243,213,178,0.85)]">
              Your symptom check
            </div>
            <p className="mt-[2px] text-[14.5px] leading-[19.94px] text-[rgba(250,246,239,0.9)]">{msg}</p>
          </div>
        </div>
        <a
          href="#check"
          className="sheen group relative mt-[20px] flex items-center justify-center gap-[8px] overflow-hidden rounded-full bg-[#FAF6EF] px-[24px] py-[14px] text-[15px] font-semibold text-[#1F1A14]"
        >
          <span className="relative z-[1] inline-flex items-center gap-[8px]">
            Check my PCOS genetic risk
            <FigIcon src="/landing/icons/arrow.svg" className="size-[19px]" />
          </span>
        </a>
      </div>
    </div>
  );
}

export function WhatIsPCOSSection() {
  return (
    <section id="what" className="relative overflow-hidden py-[80px] lg:py-[100px]">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(248,228,204,0) 0%, rgba(248,228,204,0.4) 50%, rgba(248,228,204,0) 100%)',
        }}
      />
      <Container>
        <div className="grid items-start gap-[48px] lg:grid-cols-2">
          {/* prose */}
          <div className="reveal">
            <Eyebrow icon={<FigIcon src="/landing/icons/eb-whatis.svg" className="size-[19px]" />}>
              What PCOS actually is
            </Eyebrow>
            <h2 className="mt-[24px] text-[34px] font-semibold leading-[1.05] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
              What PCOS actually is.
            </h2>
            <p className="mt-[6px] text-[24px] font-medium leading-[1.08] tracking-[-0.032em] text-[#6B6358] lg:text-[30px]">
              And why your genes matter more than your diet.
            </p>

            <div className="mt-[28px] flex flex-col gap-[19px]">
              <p className="text-[17px] leading-[27.63px]">
                <span className="font-semibold text-[#1F1A14]">PCOS, or Polycystic Ovary Syndrome,</span>
                <span className="font-normal text-[#2D2A24]">
                  {' '}
                  is a condition where your ovaries produce higher-than-normal amounts of male hormones (androgens).
                  This imbalance disrupts your menstrual cycle, affects fertility, and triggers a cascade of symptoms
                  most women spend years trying to connect.
                </span>
              </p>
              <p className="text-[17px] leading-[27.63px] text-[#2D2A24]">
                What most women don’t know: PCOS is strongly linked to genetics. The{' '}
                <strong className="font-semibold text-[#0E4D4B]">THADA gene</strong>, which encodes a protein involved
                in cell signalling and apoptosis, carries variants associated with both PCOS and type 2 diabetes risk.
                If your variant is present, your body has a higher genetic tendency toward the hormonal patterns that
                cause PCOS.
              </p>
            </div>

            <div className="mt-[24px] rounded-[22px] border-l-[3px] border-[#0E4D4B] bg-[rgba(245,237,223,0.6)] px-[24px] py-[20px] backdrop-blur-[8px]">
              <p className="text-[15.5px] leading-[25.19px] text-[#2D2A24]">
                This doesn’t mean you <strong className="font-semibold text-[#1F1A14]">will</strong> have PCOS. It means
                your doctor has something specific to monitor and act on, rather than waiting for your symptoms to get
                loud enough to be undeniable.
              </p>
            </div>
          </div>

          {/* interactive checklist */}
          <div className="reveal-r">
            <SymptomChecklist />
          </div>
        </div>
      </Container>
    </section>
  );
}
