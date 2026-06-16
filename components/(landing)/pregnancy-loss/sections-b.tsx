'use client';

import { useMemo, useState } from 'react';
import { Container, Eyebrow, GradientText, SheenButton, gTeal } from '../_shared/ui';
import { Activity, ArrowRight, Check, Dna, Heart, Scale, ShieldCheck, Sparkles, X } from '../_shared/icons';

/* ==================== 5 · WHAT YOU GET ==================== */

const GET_BULLETS: React.ReactNode[] = [
  <>
    Your <strong className="font-semibold text-[#1F1A14]">MTHFR genotype</strong>, the specific variant you carry
  </>,
  <>
    Your <strong className="font-semibold text-[#1F1A14]">FOXP3 genotype</strong>, your immune regulation status
  </>,
  <>
    Risk grading for each: <strong className="font-semibold text-[#0E4D4B]">Good</strong>,{' '}
    <strong className="font-semibold text-[#C76842]">Average</strong> or{' '}
    <strong className="font-semibold text-[#1F1A14]">Poor</strong>
  </>,
  <>Plain-language interpretation of what each variant means for your pregnancy risk</>,
  <>Specific pre-conception and antenatal recommendations</>,
];

function GeneCard({ gene, value }: { gene: string; value: string }) {
  return (
    <div className="flex flex-col gap-[6px] rounded-[16px] bg-[#E4F1EC] p-[20px]">
      <div className="inline-flex items-center gap-[6px]">
        <Dna className="size-[15px] text-[#0E4D4B]" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[rgba(14,77,75,0.8)]">{gene}</span>
      </div>
      <div className="font-hind text-[30px] font-semibold leading-none tracking-[-0.025em] text-[#1F1A14]">{value}</div>
    </div>
  );
}

function MockReport() {
  return (
    <div className="reveal-r overflow-hidden rounded-[30px] border border-[rgba(31,26,20,0.08)] bg-white shadow-[0_40px_100px_rgba(20,45,40,0.15),0_12px_36px_rgba(20,45,40,0.1)]">
      <div className="relative overflow-hidden px-[32px] pb-[32px] pt-[28px]" style={{ background: 'linear-gradient(177deg, #0E4D4B 0%, #0A3B39 100%)' }}>
        <div className="pointer-events-none absolute -right-6 -top-8 size-[176px] rounded-full bg-[rgba(37,181,171,0.2)] blur-[40px]" />
        <div className="relative flex items-center justify-between">
          <span className="inline-flex items-center gap-[6px] text-[#FAF6EF]">
            <Dna className="size-[16px] text-[#F3D5B2]" />
            <span className="text-[11px] font-bold tracking-[-0.02em]">KnowYourGenes</span>
          </span>
          <span className="rounded-full bg-white/15 px-[12px] py-[6px] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FAF6EF] backdrop-blur-[8px]">
            Panel 02 / 05
          </span>
        </div>
        <div className="relative mt-[24px] text-[12px] font-semibold uppercase leading-[1.4] tracking-[0.13em] text-[rgba(243,213,178,0.8)]">
          Pregnancy Loss &amp; Abnormal Reproductive Function Risk
        </div>
      </div>

      <div className="flex flex-col gap-[16px] px-[32px] py-[28px]">
        <div className="grid grid-cols-2 gap-[16px]">
          <GeneCard gene="MTHFR" value="TT" />
          <GeneCard gene="FOXP3" value="AG" />
        </div>

        <div className="flex flex-col gap-[6px] rounded-[16px] bg-[rgba(14,77,75,0.07)] px-[20px] pb-[20px] pt-[19px]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[rgba(14,77,75,0.8)]">
            Your response
          </div>
          <div className="inline-flex items-center gap-[8px]">
            <span className="size-[10px] rounded-full bg-[#2AC3A2]" />
            <span className="text-[20px] font-semibold leading-[30px] text-[#0E4D4B]">Good</span>
          </div>
          <p className="text-[14px] leading-[22.75px] text-[#2D2A24]">
            Your genotype is associated with <strong className="font-semibold text-[#1F1A14]">normal risk</strong> of
            pregnancy loss. Eat healthy food. Exercise regularly to stay fit and healthy.
          </p>
        </div>

        <div className="flex flex-col gap-[8px] pb-[8px] pt-[4px]">
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
            <span className="absolute left-[6%] top-1/2 size-[14px] -translate-y-1/2 rounded-full border-[3px] border-white bg-[#2AC3A2] shadow-[0_2px_6px_rgba(0,0,0,0.2)]" />
          </div>
        </div>

        <p className="border-t border-[rgba(31,26,20,0.08)] pt-[16px] text-[12.5px] italic leading-[20.31px] text-[#6B6358]">
          Sample shows a <strong className="font-semibold not-italic text-[#1F1A14]">Good</strong> result. Your actual
          result will be unique to your genetic profile. A{' '}
          <strong className="font-semibold not-italic text-[#C76842]">Poor</strong> result is the most actionable, it
          gives your doctor the specific direction they need.
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
            <Eyebrow icon={<Sparkles className="size-[19px]" />}>What you get</Eyebrow>
            <h2 className="mt-[20px] text-[34px] font-semibold leading-[1.05] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
              Your pregnancy risk profile.{' '}
              <span className="font-medium text-[#6B6358]">Clear, specific, actionable.</span>
            </h2>
            <p className="mt-[20px] text-[16px] leading-[26px] text-[#2D2A24]">
              The pregnancy loss panel is <strong className="font-semibold text-[#1F1A14]">Panel 02</strong> of your
              Women’s Health DNA report. You’ll receive:
            </p>
            <ul className="mt-[24px] flex flex-col gap-[14px]">
              {GET_BULLETS.map((b, i) => (
                <li key={i} className="flex items-start gap-[14px]">
                  <span className="mt-[1px] grid size-[22px] shrink-0 place-items-center rounded-full bg-[rgba(14,77,75,0.1)] text-[#0E4D4B]">
                    <Check className="size-[14px]" />
                  </span>
                  <span className="text-[15.5px] leading-[23.25px] text-[#2D2A24]">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-[32px] flex flex-col gap-[8px] rounded-[22px] border border-[rgba(31,26,20,0.08)] bg-white/60 px-[24px] pb-[32px] pt-[36px]">
              <span className="inline-flex items-center gap-[8px] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B6358]">
                <Sparkles className="size-[17px]" />
                And this is just Panel 02 of 5
              </span>
              <p className="text-[15px] leading-[24.38px] text-[#2D2A24]">
                Your report also covers PCOS, post-pregnancy depression, osteoporosis and arthritis risk. All from one
                saliva sample. All in one <strong className="font-semibold text-[#1F1A14]">32-page report.</strong>
              </p>
            </div>

            <div className="mt-[32px]">
              <SheenButton href="#check" tone="eden">
                Know my pregnancy risk
              </SheenButton>
            </div>
          </div>

          <MockReport />
        </div>
      </Container>
    </section>
  );
}

/* ==================== 6 · DATA & STATS ==================== */

const STATS = [
  { n: '10 to 20%', c: '#2AC3A2', label: 'of known pregnancies end in miscarriage' },
  { n: '80%', c: '#F3D5B2', label: 'happen in the first trimester, often before a heartbeat is confirmed' },
  { n: '1 to 2%', c: '#2AC3A2', label: 'of couples experience recurrent loss (3+ miscarriages)' },
  { n: '50%+', c: '#F3D5B2', label: 'of recurrent losses remain ‘unexplained’ by standard testing' },
  { n: 'MTHFR', c: '#2AC3A2', label: 'one of the most common Indian genetic variants, one of the least tested', small: true },
  { n: 'Folate', c: '#F3D5B2', label: 'protocol adjusted pre-conception can significantly improve outcomes for carriers', small: true },
  { n: 'FOXP3', c: '#2AC3A2', label: 'a leading but underdiagnosed cause of unexplained pregnancy loss', small: true },
  { n: '7 days', c: '#F3D5B2', label: 'from saliva sample to your complete 32-page report' },
];

export function DataStatsSection() {
  return (
    <section className="bg-[#15201E] py-[80px] lg:py-[100px]">
      <Container>
        <div className="reveal max-w-[720px]">
          <Eyebrow tone="dark" icon={<Activity className="size-[19px]" />}>By the numbers</Eyebrow>
          <h2 className="mt-[22px] text-[34px] font-semibold leading-[1.06] tracking-[-0.022em] text-[#FAF6EF] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            The numbers behind the silence.
          </h2>
        </div>

        <div className="mt-[48px] grid grid-cols-2 gap-px overflow-hidden rounded-[28px] bg-white/10 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col gap-[12px] bg-[#15201E] p-[28px] sm:p-[32px]">
              <div
                className={`font-hind font-semibold leading-none tracking-[-0.025em] ${s.small ? 'text-[34px] sm:text-[38px]' : 'text-[40px] lg:text-[48px]'}`}
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

/* ==================== 7 · BEFORE / AFTER ==================== */

const BEFORE_AFTER = [
  {
    before: 'First miscarriage at 9 weeks. Told it was ‘one of those things.’ Try again.',
    after: (
      <>
        <strong className="font-semibold text-[#1F1A14]">MTHFR variant identified.</strong>
        <span className="font-normal text-[#2D2A24]">
          {' '}
          Standard folic acid replaced with active methylfolate. Pre-conception protocol changed. Next pregnancy
          ongoing.
        </span>
      </>
    ),
  },
  {
    before: 'Three pregnancy losses. Different doctors. Same answer: unexplained. ‘Your tests are all normal.’',
    after: (
      <>
        <strong className="font-semibold text-[#1F1A14]">FOXP3 variant flagged.</strong>
        <span className="font-normal text-[#2D2A24]">
          {' '}
          Autoimmune cause identified. Fertility specialist adds immune monitoring and progesterone support. She is now
          20 weeks.
        </span>
      </>
    ),
  },
  {
    before: 'Planning first pregnancy. Worried about family history of miscarriage. No one could tell her her own risk.',
    after: (
      <>
        <strong className="font-semibold text-[#1F1A14]">MTHFR and FOXP3 both normal.</strong>
        <span className="font-normal text-[#2D2A24]"> She goes into her first pregnancy informed. Confident. Prepared.</span>
      </>
    ),
  },
  {
    before: 'Spent ₹1.8 lakh on two IVF cycles before anyone mentioned genetics.',
    after: (
      <>
        <strong className="font-semibold text-[#1F1A14]">Genetic panel done first.</strong>
        <span className="font-normal text-[#2D2A24]">
          {' '}
          MTHFR variant found. Protocol adjusted. Third embryo transfer successful. She wishes someone had suggested the
          test before cycle one.
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
          <Eyebrow icon={<Scale className="size-[19px]" />}>Before &amp; after</Eyebrow>
          <h2 className="mt-[20px] text-[34px] font-semibold leading-[1.07] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            The same woman. <span className="font-medium text-[#6B6358]">Before she had the information.</span>
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
                    <X className="size-[16px]" />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B6358]">Before</span>
                </span>
                <p className="text-[15px] italic leading-[24.38px] text-[#6B6358]">{row.before}</p>
              </div>
              <div className="flex flex-col gap-[12px] bg-[rgba(14,77,75,0.06)] p-[32px]">
                <span className="inline-flex items-center gap-[8px]">
                  <span className="grid size-[28px] place-items-center rounded-[8px] text-[#0E4D4B]">
                    <Check className="size-[16px]" />
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

/* ============== 8 · WHO THIS IS FOR (interactive) ============== */

const STATEMENTS = [
  'You are planning your first pregnancy and want to go in fully prepared',
  'You have experienced one or more miscarriages and been told the cause is ‘unknown’',
  'You have a family history of recurrent pregnancy loss or infertility',
  'You are going through IVF and want genetic clarity before your next cycle',
  'You have an MTHFR variant in your family and want to know if you carry it',
  'You have been told your immune system may be affecting your pregnancy',
  'You simply want to know your genetic risk before you begin, because you believe preparation is protection',
];

function ForYouChecklist() {
  const [on, setOn] = useState<boolean[]>(() => Array(STATEMENTS.length).fill(false));
  const count = useMemo(() => on.filter(Boolean).length, [on]);

  const msg =
    count === 0
      ? 'Tap the statements that sound like you.'
      : count <= 2
        ? 'Even one is reason enough to know your genetic baseline before you begin.'
        : count <= 4
          ? 'This test was built for exactly your situation.'
          : `${count} of 7 — few people would gain more from knowing their baseline than you.`;

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
                  <Check className="sx-tick size-[14px] text-[#FAF6EF]" />
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
            <Heart className="size-[28px]" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid size-[24px] place-items-center rounded-full bg-[#F3D5B2] font-hind text-[13px] font-semibold text-[#1F1A14]">
                {count}
              </span>
            )}
          </span>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(243,213,178,0.85)]">
              Where this leads
            </div>
            <p className="mt-[2px] text-[14.5px] leading-[19.94px] text-[rgba(250,246,239,0.9)]">{msg}</p>
          </div>
        </div>
        <a
          href="#check"
          className="sheen group relative mt-[20px] flex items-center justify-center gap-[8px] overflow-hidden rounded-full bg-[#FAF6EF] px-[24px] py-[14px] text-[15px] font-semibold text-[#1F1A14]"
        >
          <span className="relative z-[1] inline-flex items-center gap-[8px]">
            Know my pregnancy risk
            <ArrowRight className="size-[19px]" />
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
            <Eyebrow icon={<Heart className="size-[19px]" />}>Who this is for</Eyebrow>
            <h2 className="mt-[20px] text-[34px] font-semibold leading-[1.05] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
              This test is for you if…
            </h2>
            <p className="mt-[20px] text-[16px] leading-[26px] text-[#2D2A24]">
              Each line speaks to a different woman. Tap the ones that sound like you, and see where it leads.
            </p>
            <div className="mt-[24px] flex items-center gap-[12px] rounded-[20px] border border-[rgba(31,26,20,0.08)] bg-white/60 px-[20px] pb-[20px] pt-[28px]">
              <ShieldCheck className="size-[26px] shrink-0 text-[#0E4D4B]" />
              <p className="text-[14px] leading-[20px] text-[#2D2A24]">
                Whatever you select stays on your device. Nothing is submitted, this is just for you.
              </p>
            </div>
          </div>

          <ForYouChecklist />
        </div>
      </Container>
    </section>
  );
}
