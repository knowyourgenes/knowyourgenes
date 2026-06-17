'use client';

import { useMemo, useState } from 'react';
import { Container, Eyebrow, FigIcon, GradientText, SheenButton, gTeal } from '../_shared/ui';

/* ==================== 6 · WHAT YOU GET ==================== */

const GET_BULLETS: React.ReactNode[] = [
  <>
    Your <strong className="font-semibold text-[#1F1A14]">COMT genotype</strong>, the specific variant you carry
  </>,
  <>
    Risk grading: <strong className="font-semibold text-[#0E4D4B]">Good</strong> (normal activity),{' '}
    <strong className="font-semibold text-[#C76842]">Average</strong>, or{' '}
    <strong className="font-semibold text-[#1F1A14]">Poor</strong> (low activity, high vulnerability)
  </>,
  <>A plain-language explanation of what your variant means for your dopamine regulation</>,
  <>Specific recommendations for diet, lifestyle, and support planning during pregnancy</>,
];

function MockReport() {
  return (
    <div className="reveal-r overflow-hidden rounded-[30px] border border-[rgba(31,26,20,0.08)] bg-white shadow-[0_40px_100px_rgba(20,45,40,0.15),0_12px_36px_rgba(20,45,40,0.1)]">
      <div className="relative overflow-hidden px-[32px] pb-[32px] pt-[28px]" style={{ background: 'linear-gradient(175deg, #0E4D4B 0%, #0A3B39 100%)' }}>
        <div className="pointer-events-none absolute -right-6 -top-8 size-[224px] rounded-full bg-[rgba(37,181,171,0.2)] blur-[40px]" />
        <div className="relative flex items-center justify-between">
          <span className="inline-flex items-center gap-[6px] text-[#FAF6EF]">
            <FigIcon src="/landing/_icons/kyg-logo-mark.svg" className="size-[16px] text-[#F3D5B2]" />
            <span className="text-[11px] font-bold tracking-[-0.02em]">KnowYourGenes</span>
          </span>
          <span className="rounded-full bg-white/15 px-[12px] py-[6px] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FAF6EF] backdrop-blur-[8px]">
            Panel 03 / 05
          </span>
        </div>
        <div className="relative mt-[20px] text-[12px] font-semibold uppercase tracking-[0.14em] text-[rgba(243,213,178,0.8)]">
          Peripartum Depression Risk
        </div>
        <div className="relative mt-[8px] flex items-center gap-[8px]">
          <FigIcon src="/landing/_icons/report-activity.svg" className="size-[20px] text-[#FAF6EF]" />
          <span className="text-[20px] font-semibold leading-[1.2] tracking-[-0.025em] text-[#FAF6EF]">
            COMT · Catechol-O-methyltransferase
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-[16px] px-[32px] py-[28px]">
        <div className="grid grid-cols-2 gap-[16px]">
          <div className="rounded-[16px] bg-[rgba(245,237,223,0.7)] px-[20px] pb-[20px] pt-[19px]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B6358]">Your genotype</div>
            <div className="mt-[6px] font-hind text-[34px] font-semibold leading-none tracking-[-0.025em] text-[#1F1A14]">
              AA
            </div>
          </div>
          <div className="rounded-[16px] bg-[rgba(199,104,66,0.1)] px-[20px] pb-[24px] pt-[19px]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(199,104,66,0.9)]">
              Your response
            </div>
            <div className="mt-[8px] inline-flex items-center gap-[8px]">
              <span className="size-[10px] rounded-full bg-[#C76842]" />
              <span className="text-[20px] font-semibold leading-[30px] text-[#C76842]">Poor</span>
            </div>
          </div>
        </div>

        <p className="text-[14.5px] leading-[23.56px] text-[#2D2A24]">
          Associated with <strong className="font-semibold text-[#1F1A14]">low COMT enzymatic activity.</strong> Higher
          dopamine levels, a lower pain threshold, and enhanced vulnerability to stress.
        </p>

        <div className="flex flex-col gap-[5px] rounded-[16px] bg-[rgba(14,77,75,0.06)] p-[16px]">
          <div className="inline-flex items-center gap-[8px] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0E4D4B]">
            <FigIcon src="/landing/_icons/sparkles.svg" className="size-[16px] text-[#0E4D4B]" />
            Recommendation
          </div>
          <p className="text-[13.5px] leading-[21.94px] text-[#2D2A24]">
            During pregnancy, eat healthy foods. Refrain from processed foods, caffeine, smoking and alcohol. Meditate 15
            minutes daily. Take adequate rest. Build a mental health support plan with your doctor before delivery.
          </p>
        </div>

        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center justify-between">
            {['Good', 'Average', 'Poor'].map((l) => (
              <span key={l} className="text-[11px] font-semibold uppercase tracking-[0.025em] text-[#6B6358]">
                {l}
              </span>
            ))}
          </div>
          <div
            className="relative h-[8px] rounded-full"
            style={{ background: 'linear-gradient(90deg, #2AC3A2 0%, #F3D5B2 50%, #C76842 100%)' }}
          >
            <span className="absolute right-[4%] top-1/2 size-[14px] -translate-y-1/2 rounded-full border-[3px] border-white bg-[#C76842] shadow-[0_2px_6px_rgba(0,0,0,0.2)]" />
          </div>
        </div>

        <p className="border-t border-[rgba(31,26,20,0.08)] pt-[16px] text-[12.5px] italic leading-[20.31px] text-[#6B6358]">
          For a woman with this result, the most important action is not treatment, it is{' '}
          <strong className="font-semibold not-italic text-[#0E4D4B]">preparation</strong>: a support plan, a named
          vulnerability, and a doctor who is watching.
        </p>
      </div>
    </div>
  );
}

export function WhatYouGetSection() {
  return (
    <section id="report" className="relative overflow-hidden py-[80px] lg:py-[100px]">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(228,241,236,0) 0%, rgba(228,241,236,0.5) 50%, rgba(228,241,236,0) 100%)',
        }}
      />
      <Container>
        <div className="grid items-start gap-[56px] lg:grid-cols-2 lg:gap-[48px]">
          <div className="reveal">
            <Eyebrow icon={<FigIcon src="/landing/_icons/eb-whatyouget.svg" className="size-[19px]" />}>What you get</Eyebrow>
            <h2 className="mt-[20px] text-[34px] font-semibold leading-[1.05] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
              Your COMT result.{' '}
              <span className="font-medium text-[#6B6358]">And a plan that exists before the vulnerability does.</span>
            </h2>
            <p className="mt-[20px] text-[16px] leading-[26px] text-[#2D2A24]">
              The peripartum depression panel is <strong className="font-semibold text-[#1F1A14]">Panel 03</strong> of
              your Women’s Health DNA report. You’ll receive:
            </p>
            <ul className="mt-[24px] flex flex-col gap-[14px]">
              {GET_BULLETS.map((b, i) => (
                <li key={i} className="flex items-start gap-[14px]">
                  <span className="mt-[1px] grid size-[22px] shrink-0 place-items-center rounded-full bg-[rgba(14,77,75,0.1)] text-[#0E4D4B]">
                    <FigIcon src="/landing/_icons/check.svg" className="size-[14px]" />
                  </span>
                  <span className="text-[15.5px] leading-[23.25px] text-[#2D2A24]">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-[32px] flex flex-col gap-[8px] rounded-[22px] border border-[rgba(31,26,20,0.08)] bg-white/60 px-[24px] pb-[32px] pt-[36px]">
              <span className="inline-flex items-center gap-[8px] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B6358]">
                <FigIcon src="/landing/_icons/sparkles.svg" className="size-[17px]" />
                And this is just Panel 03 of 5
              </span>
              <p className="text-[15px] leading-[24.38px] text-[#2D2A24]">
                Your report also covers PCOS, pregnancy loss, osteoporosis and arthritis risk. All from one saliva
                sample. One <strong className="font-semibold text-[#1F1A14]">32-page report.</strong> In 7 days.
              </p>
            </div>

            <div className="mt-[32px]">
              <SheenButton href="#check" tone="eden">
                Know my genetic vulnerability
              </SheenButton>
            </div>
          </div>

          <MockReport />
        </div>
      </Container>
    </section>
  );
}

/* ==================== 7 · WHAT KNOWING CHANGES ==================== */

const CHANGES = [
  {
    icon: '/landing/_icons/user-round.svg',
    title: 'Your partner knows.',
    body: 'Instead of reading your emotional state as personal rejection or moodiness, your partner understands that your nervous system processes stress differently. A profoundly different conversation to have before a baby arrives, versus in the middle of a crisis you can’t name.',
  },
  {
    icon: '/landing/_icons/shield-check.svg',
    title: 'Your doctor knows.',
    body: 'Your OB-GYN or psychiatrist can flag your COMT result in your antenatal record. Mental health check-ins get scheduled during pregnancy, not just after delivery. “How are you feeling emotionally?” becomes part of every appointment, not an afterthought.',
  },
  {
    icon: '/landing/_icons/heart.svg',
    title: 'You know.',
    body: 'If at 18 weeks you feel flat, anxious, or unlike yourself, you have a name for it. You know it can start before the birth, because that’s what the research says for 50% of cases. You know it is not a reflection of how much you love your baby. It has a biological basis. That knowledge is everything.',
  },
  {
    icon: '/landing/_icons/activity.svg',
    title: 'Your lifestyle adjusts.',
    body: 'The recommendation is specific: reduce caffeine, processed foods, alcohol. Meditate daily. Prioritise rest. Manageable changes, far more powerful when they are targeted to a known genetic vulnerability rather than applied generically as “wellness advice.”',
  },
];

export function WhatKnowingChangesSection() {
  return (
    <section id="changes" className="py-[72px] lg:py-[88px]">
      <Container>
        <div className="reveal max-w-[760px]">
          <Eyebrow icon={<FigIcon src="/landing/_icons/eb-knowing.svg" className="size-[19px]" />}>What knowing changes</Eyebrow>
          <h2 className="mt-[18px] text-[34px] font-semibold leading-[1.08] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            What changes when you know your COMT variant.
          </h2>
          <p className="mt-[20px] text-[17px] leading-[28px] text-[#2D2A24] lg:text-[18.7px] lg:leading-[30.42px]">
            Knowing is not the same as worrying. Knowing is the opposite of worrying. Here is exactly what changes.
          </p>
        </div>

        <div className="mt-[40px] grid gap-[24px] lg:grid-cols-2">
          {CHANGES.map(({ icon, title, body }) => (
            <div
              key={title}
              className="reveal flex flex-col gap-[7px] rounded-[28px] border border-[rgba(31,26,20,0.08)] bg-white/75 p-[32px] shadow-[0_4px_14px_rgba(20,45,40,0.05),0_1px_2px_rgba(20,45,40,0.04)]"
            >
              <span className="grid size-[56px] place-items-center rounded-[16px] bg-[rgba(14,77,75,0.08)] text-[#0E4D4B]">
                <FigIcon src={icon} className="size-[28px]" />
              </span>
              <h3 className="mt-[11px] text-[19px] font-semibold leading-[28.5px] tracking-[-0.025em] text-[#1F1A14]">
                {title}
              </h3>
              <p className="text-[14.5px] leading-[23.56px] text-[#6B6358]">{body}</p>
            </div>
          ))}
        </div>

        <div
          className="reveal relative mt-[24px] overflow-hidden rounded-[28px] px-[32px] py-[44px] shadow-[0_40px_100px_rgba(20,45,40,0.15),0_12px_36px_rgba(20,45,40,0.1)] sm:px-[48px]"
          style={{ background: 'linear-gradient(179deg, #0E4D4B 0%, #0A3B39 100%)' }}
        >
          <div className="pointer-events-none absolute -right-10 -top-12 size-[224px] rounded-full bg-[rgba(37,181,171,0.2)] blur-[64px]" />
          <div className="relative flex flex-col items-start gap-[20px] sm:flex-row sm:items-center">
            <span className="grid size-[48px] shrink-0 place-items-center rounded-[16px] bg-white/10 text-[#F3D5B2]">
              <FigIcon src="/landing/_icons/sparkles.svg" className="size-[26px]" />
            </span>
            <p className="text-[22px] font-semibold leading-[1.28] tracking-[-0.015em] sm:text-[25px] lg:text-[27px] lg:leading-[34.56px]">
              <span className="text-[#FAF6EF]">
                A COMT risk variant does not mean you will have peripartum depression. It means you know to prepare.{' '}
              </span>
              <span className="text-[#F3D5B2]">And preparation is the single most effective thing you can do.</span>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ==================== 8 · DATA & STATS ==================== */

const STATS = [
  { n: '50%', c: '#F3D5B2', label: 'of episodes begin before delivery, not after' },
  { n: '3 to 6%', c: '#2AC3A2', label: 'experience major depression during or after pregnancy' },
  { n: 'Millions', c: '#F3D5B2', label: 'of Indian women affected annually, most undiagnosed', small: true },
  { n: 'COMT', c: '#2AC3A2', label: 'controls dopamine breakdown, pain threshold, stress sensitivity', small: true },
  { n: 'Low', c: '#F3D5B2', label: 'COMT activity means dopamine builds up, raising stress vulnerability', small: true },
  { n: 'Caffeine', c: '#2AC3A2', label: 'a primary dietary trigger that worsens low COMT activity', small: true },
  { n: '15 min', c: '#F3D5B2', label: 'of daily meditation specifically recommended for COMT carriers' },
  { n: '7 days', c: '#2AC3A2', label: 'from saliva sample to your complete 32-page report' },
];

export function DataStatsSection() {
  return (
    <section className="bg-[#15201E] py-[80px] lg:py-[100px]">
      <Container>
        <div className="reveal max-w-[720px]">
          <Eyebrow tone="dark" icon={<FigIcon src="/landing/_icons/eb-data.svg" className="size-[19px]" />}>By the numbers</Eyebrow>
          <h2 className="mt-[22px] text-[34px] font-semibold leading-[1.06] tracking-[-0.022em] text-[#FAF6EF] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            The numbers most people have never been told.
          </h2>
        </div>

        <div className="mt-[48px] grid grid-cols-2 gap-px overflow-hidden rounded-[28px] bg-white/10 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col gap-[12px] bg-[#15201E] p-[28px] sm:p-[32px]">
              <div
                className={`font-hind font-semibold leading-none tracking-[-0.025em] ${s.small ? 'text-[32px] sm:text-[38px]' : 'text-[40px] lg:text-[50px]'}`}
                style={{ color: s.c }}
              >
                {s.n}
              </div>
              <p className="text-[14px] leading-[19.25px] text-[rgba(250,246,239,0.7)]">{s.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ==================== 9 · BEFORE / AFTER ==================== */

const BEFORE_AFTER = [
  {
    before: '7 months pregnant, feeling nothing. Smiled for the baby shower. Cried in the bathroom after.',
    after: (
      <>
        <strong className="font-semibold text-[#1F1A14]">COMT Poor result known</strong>
        <span className="font-normal text-[#2D2A24]">
          {' '}
          before second pregnancy. Partner informed. OB-GYN watching from week 8. She is not alone this time.
        </span>
      </>
    ),
  },
  {
    before: 'Panic attacks at 5 months pregnant. Told it was first-time-mother anxiety. Dismissed.',
    after: (
      <>
        <strong className="font-semibold text-[#1F1A14]">COMT variant identified.</strong>
        <span className="font-normal text-[#2D2A24]">
          {' '}
          Anxiety in pregnancy named as biological, not character. Psychiatrist referral at week 12 of second pregnancy.
        </span>
      </>
    ),
  },
  {
    before: '6 weeks after delivery. Couldn’t bond. Felt like a failure. Didn’t tell her mother-in-law.',
    after: (
      <>
        <strong className="font-semibold text-[#1F1A14]">COMT result shared with husband</strong>
        <span className="font-normal text-[#2D2A24]">
          {' '}
          pre-pregnancy. He recognised the signs at week 3 postpartum. She got support 8 weeks earlier than her first
          experience.
        </span>
      </>
    ),
  },
  {
    before: 'Took 14 months to feel like herself again after her first child. No one told her why.',
    after: (
      <>
        <strong className="font-semibold text-[#1F1A14]">The genetic result gave the name.</strong>
        <span className="font-normal text-[#2D2A24]">
          {' '}
          The name gave her the ability to ask for help. The help came early enough.
        </span>
      </>
    ),
  },
];

export function BeforeAfterSection() {
  return (
    <section className="py-[72px] lg:py-[88px]">
      <Container>
        <div className="reveal max-w-[760px]">
          <Eyebrow icon={<FigIcon src="/landing/_icons/eb-beforeafter.svg" className="size-[19px]" />}>Before &amp; after</Eyebrow>
          <h2 className="mt-[20px] text-[34px] font-semibold leading-[1.07] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            The same woman. <span className="font-medium text-[#6B6358]">Before she knew what was happening.</span>
            <br />
            <GradientText image={gTeal(162)}>And after.</GradientText>
          </h2>
        </div>

        <div className="mt-[40px] flex flex-col gap-[16px]">
          {BEFORE_AFTER.map((row, i) => (
            <div
              key={i}
              className="reveal grid overflow-hidden rounded-[24px] border border-[rgba(31,26,20,0.08)] bg-[rgba(31,26,20,0.08)] sm:grid-cols-2"
            >
              <div className="flex flex-col gap-[12px] bg-[rgba(245,237,223,0.6)] p-[32px]">
                <span className="inline-flex items-center gap-[8px]">
                  <span className="grid size-[28px] place-items-center rounded-[8px] bg-[rgba(31,26,20,0.06)] text-[#6B6358]">
                    <FigIcon src="/landing/_icons/x.svg" className="size-[16px]" />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B6358]">Before</span>
                </span>
                <p className="text-[15px] italic leading-[24.38px] text-[#6B6358]">{row.before}</p>
              </div>
              <div className="flex flex-col gap-[12px] bg-[rgba(14,77,75,0.06)] p-[32px]">
                <span className="inline-flex items-center gap-[8px]">
                  <span className="grid size-[28px] place-items-center rounded-[8px] text-[#0E4D4B]">
                    <FigIcon src="/landing/_icons/check.svg" className="size-[16px]" />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0E4D4B]">After</span>
                </span>
                <p className="text-[15px] leading-[24.38px]">{row.after}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ============== 10 · WHO THIS IS FOR (interactive) ============== */

const STATEMENTS = [
  'You are planning a pregnancy and want to know your emotional vulnerability before you’re in it',
  'You felt flat, anxious, or unlike yourself during a previous pregnancy, and didn’t know why',
  'You experienced post-pregnancy depression and want to understand whether it has a genetic component',
  'You have a family history of depression or anxiety and want to know if you carry the COMT variant',
  'You are going into a second pregnancy and want to do things differently this time',
  'Your partner wants to understand what to watch for and how to help',
  'You believe that knowing your genetic vulnerability gives you power over it, not the other way around',
];

function ForYouChecklist() {
  const [on, setOn] = useState<boolean[]>(() => Array(STATEMENTS.length).fill(false));
  const count = useMemo(() => on.filter(Boolean).length, [on]);

  const msg =
    count === 0
      ? 'Tap the lines that feel like you.'
      : count <= 2
        ? 'Even one is reason enough to know your COMT baseline.'
        : count <= 4
          ? 'This test was built for exactly where you are.'
          : `${count} of 7 — knowing your vulnerability is how you take power over it.`;

  return (
    <div className="reveal-r flex flex-col gap-[20px]">
      <ul className="flex flex-col rounded-[30px] border border-[rgba(31,26,20,0.08)] bg-white/75 p-[24px] shadow-[0_18px_50px_rgba(20,45,40,0.09),0_4px_16px_rgba(20,45,40,0.06)]">
        {STATEMENTS.map((label, i) => (
          <li key={i}>
            <button
              type="button"
              data-on={on[i]}
              onClick={() => setOn((prev) => prev.map((v, j) => (j === i ? !v : v)))}
              className={`sx-row flex w-full items-start gap-[16px] px-[8px] py-[16px] text-left ${
                i > 0 ? 'border-t border-[rgba(31,26,20,0.08)]' : ''
              }`}
            >
              <span className="mt-[1px] grid size-[24px] shrink-0 place-items-center">
                <span className="sx-box grid size-[24px] place-items-center rounded-[8px] border-2 border-[rgba(14,77,75,0.3)]">
                  <FigIcon src="/landing/_icons/check.svg" className="sx-tick size-[14px] text-[#FAF6EF]" />
                </span>
              </span>
              <span className="text-[15.5px] leading-[21.31px] text-[#2D2A24]">{label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="relative overflow-hidden rounded-[24px] p-[24px]" style={{ background: 'linear-gradient(175deg, #0E4D4B 0%, #0B3D3B 100%)' }}>
        <div className="pointer-events-none absolute -top-9 right-0 size-[144px] rounded-full bg-[rgba(37,181,171,0.15)] blur-[40px]" />
        <div className="relative flex items-center gap-[20px]">
          <span className="relative grid size-[64px] shrink-0 place-items-center rounded-full bg-white/10 text-[#F3D5B2]">
            <FigIcon src="/landing/_icons/heart.svg" className="size-[28px]" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid size-[24px] place-items-center rounded-full bg-[#F3D5B2] font-hind text-[13px] font-semibold text-[#1F1A14]">
                {count}
              </span>
            )}
          </span>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(243,213,178,0.85)]">
              You deserve to be seen
            </div>
            <p className="mt-[2px] text-[14.5px] leading-[19.94px] text-[rgba(250,246,239,0.9)]">{msg}</p>
          </div>
        </div>
        <a
          href="#check"
          className="sheen group relative mt-[20px] flex items-center justify-center gap-[8px] overflow-hidden rounded-full bg-[#FAF6EF] px-[24px] py-[14px] text-[15px] font-semibold text-[#1F1A14]"
        >
          <span className="relative z-[1] inline-flex items-center gap-[8px]">
            Know my genetic vulnerability
            <FigIcon src="/landing/_icons/arrow.svg" className="size-[19px]" />
          </span>
        </a>
      </div>
    </div>
  );
}

export function WhoThisIsForSection() {
  return (
    <section id="who" className="relative overflow-hidden py-[80px] lg:py-[100px]">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(228,241,236,0) 0%, rgba(228,241,236,0.5) 50%, rgba(228,241,236,0) 100%)',
        }}
      />
      <Container>
        <div className="grid items-start gap-[48px] lg:grid-cols-2">
          <div className="reveal">
            <Eyebrow icon={<FigIcon src="/landing/_icons/eb-heart.svg" className="size-[19px]" />}>Who this is for</Eyebrow>
            <h2 className="mt-[20px] text-[34px] font-semibold leading-[1.05] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
              This test is for you if…
            </h2>
            <p className="mt-[20px] text-[16px] leading-[26px] text-[#2D2A24]">
              Every line is a gentle tap on the shoulder. Tap the ones that feel like you.
            </p>
            <div className="mt-[24px] flex items-center gap-[12px] rounded-[20px] border border-[rgba(31,26,20,0.08)] bg-white/60 px-[20px] pb-[20px] pt-[28px]">
              <FigIcon src="/landing/_icons/shield-check.svg" className="size-[26px] shrink-0 text-[#0E4D4B]" />
              <p className="text-[14px] leading-[20px] text-[#2D2A24]">
                Whatever you select stays on your device. Nothing is submitted. This is just for you.
              </p>
            </div>
          </div>

          <ForYouChecklist />
        </div>
      </Container>
    </section>
  );
}

/* ==================== 11 · AT EVERY AGE ==================== */

const AGES = [
  {
    age: '22 to 27',
    title: 'Before your first pregnancy',
    copper: false,
    body: (
      <>
        You may already notice you feel stress more intensely than people around you. That sensitivity is the COMT
        variant in everyday life. Knowing it now means you build the right support system{' '}
        <strong className="font-medium text-[#2D2A24]">before you need it.</strong>
      </>
    ),
  },
  {
    age: '27 to 34',
    title: 'First pregnancy planning or current first pregnancy',
    copper: false,
    body: (
      <>
        The highest-stakes window. If your variant is a risk, your doctor needs to know now. Not at 6 weeks postpartum.
        Your antenatal care should include{' '}
        <strong className="font-medium text-[#2D2A24]">mental health monitoring from the first trimester.</strong>
      </>
    ),
  },
  {
    age: '34 to 40',
    title: 'Second pregnancy after a previous struggle',
    copper: false,
    body: (
      <>
        If your first pregnancy or postpartum period was hard in ways you never fully explained, your COMT result may
        give you the <strong className="font-medium text-[#2D2A24]">first biological explanation you’ve had.</strong> And
        a different plan for next time.
      </>
    ),
  },
  {
    age: '40 and up',
    title: 'Post-reproductive, processing past experience',
    copper: true,
    body: (
      <>
        Even if your pregnancy years are behind you, your COMT variant explains experiences that may have felt confusing
        or shameful. It is relevant to your ongoing stress sensitivity and emotional regulation{' '}
        <strong className="font-medium text-[#2D2A24]">in everyday life.</strong>
      </>
    ),
  },
];

export function AtEveryAgeSection() {
  return (
    <section className="py-[72px] lg:py-[88px]">
      <Container>
        <div className="reveal max-w-[780px]">
          <Eyebrow icon={<FigIcon src="/landing/_icons/eb-ateveryage.svg" className="size-[19px]" />}>At every age</Eyebrow>
          <h2 className="mt-[20px] text-[34px] font-semibold leading-[1.07] tracking-[-0.022em] sm:text-[40px] lg:text-[44px] lg:leading-[48.4px]">
            <span className="text-[#1F1A14]">Your COMT variant doesn’t only matter</span>{' '}
            <span className="font-medium text-[#6B6358]">during pregnancy.</span>
          </h2>
        </div>

        <div className="relative mt-[56px]">
          
          <div className="grid gap-[40px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-[24px]">
            {AGES.map((a) => (
              <div key={a.age} className="reveal flex flex-col gap-[7px]">
                <div className="flex items-center gap-[12px]">
                  <span
                    className={`grid size-[24px] shrink-0 place-items-center rounded-full ${a.copper ? 'bg-[#C76842]' : 'bg-[#0E4D4B]'}`}
                  >
                    <span className="size-[8px] rounded-full bg-[#FAF6EF]/85" />
                  </span>
                  <span className="font-hind text-[18px] font-semibold leading-[27px] tracking-[-0.025em] text-[#1F1A14]">
                    {a.age}
                  </span>
                </div>
                <h3 className="mt-[12px] text-[17px] font-semibold leading-[25.5px] tracking-[-0.025em] text-[#1F1A14]">
                  {a.title}
                </h3>
                <p className="text-[14.5px] leading-[23.56px] text-[#6B6358]">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
