import { Container, Eyebrow, FigIcon, GradientText, SheenButton, gTeal } from '../_shared/ui';

/* ================= 4 · WHY TEST GENETICALLY ================= */

const DISMISSED = [
  'Her irregular periods are “stress.”',
  'Her weight gain is “lifestyle.”',
  'Her facial hair is “hormonal, but not serious.”',
  'Her acne “needs a better cleanser.”',
];

const OUTCOMES = [
  {
    icon: '/landing/_icons/trending-up.svg',
    box: 'bg-[rgba(199,104,66,0.15)] text-[#C76842]',
    lead: 'If your risk is elevated:',
    body: " monitor hormones early, adjust diet to reduce androgen expression, manage weight proactively, and walk into your gynaecologist’s office with data, not just symptoms.",
  },
  {
    icon: '/landing/_icons/shield-check.svg',
    box: 'bg-[rgba(14,77,75,0.08)] text-[#0E4D4B]',
    lead: 'If your risk is normal:',
    body: " you have a clear answer. The PCOS you’ve worried about isn’t in your blueprint. Your irregular cycle has a different explanation worth finding.",
  },
  {
    icon: '/landing/_icons/sparkles.svg',
    box: 'bg-[rgba(243,213,178,0.4)] text-[#9a6a1e]',
    lead: 'Either way, you stop guessing.',
    body: ' That alone changes everything about how you navigate your health.',
  },
];

export function WhyTestSection() {
  return (
    <section id="why" className="py-[72px] lg:py-[88px]">
      <Container>
        <div className="reveal max-w-[760px]">
          <Eyebrow icon={<FigIcon src="/landing/_icons/eb-whytest.svg" className="size-[19px]" />}>Why test genetically</Eyebrow>
          <h2 className="mt-[24px] text-[34px] font-semibold leading-[1.06] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            Why know your PCOS risk genetically?
            <br />
            <GradientText image={gTeal(176)}>Because earlier is always better.</GradientText>
          </h2>
        </div>

        <div className="mt-[40px] grid gap-[24px] lg:grid-cols-2">
          {/* dark card */}
          <div className="reveal rounded-[28px] bg-[#1A2220] p-[40px]">
            <span className="inline-flex items-center gap-[8px] text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgba(243,213,178,0.8)]">
              <FigIcon src="/landing/_icons/alert-triangle.svg" className="size-[18px]" />
              The current PCOS journey in India
            </span>
            <p className="mt-[20px] text-[20px] leading-[32.5px] text-[rgba(250,246,239,0.95)]">
              The average Indian woman sees <span className="font-semibold text-[#F3D5B2]">3 to 4 doctors</span> before a
              definitive diagnosis.
            </p>
            <ul className="mt-[24px] flex flex-col gap-[12px]">
              {DISMISSED.map((d) => (
                <li key={d} className="flex items-center gap-[12px]">
                  <FigIcon src="/landing/_icons/x.svg" className="size-[18px] shrink-0 text-[rgba(250,246,239,0.4)]" />
                  <span className="text-[15px] leading-[22.5px] text-[rgba(250,246,239,0.75)]">{d}</span>
                </li>
              ))}
            </ul>
            <p className="mt-[28px] border-t border-white/10 pt-[28px] text-[15.5px] leading-[25.19px] text-[rgba(250,246,239,0.85)]">
              Meanwhile, PCOS is quietly raising her risk of{' '}
              <span className="font-semibold text-[#FAF6EF]">type 2 diabetes, heart disease, and infertility</span>, all
              significantly more manageable when caught early.
            </p>
          </div>

          {/* light card */}
          <div className="reveal-r rounded-[28px] border border-[rgba(31,26,20,0.08)] bg-white/75 p-[40px] shadow-[0_18px_50px_rgba(45,32,18,0.08),0_4px_16px_rgba(45,32,18,0.06)]">
            <span className="inline-flex items-center gap-[8px] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0E4D4B]">
              <FigIcon src="/landing/_icons/check.svg" className="size-[18px]" />
              What knowing your THADA variant changes
            </span>
            <div className="mt-[20px] flex flex-col gap-[12px]">
              {OUTCOMES.map(({ icon: Icon, box, lead, body }) => (
                <div key={lead} className="flex items-start gap-[16px] rounded-[16px] p-[12px]">
                  <span className={`grid size-[40px] shrink-0 place-items-center rounded-[12px] ${box}`}>
                    <FigIcon src={Icon} className="size-[20px]" />
                  </span>
                  <p className="text-[15.5px] leading-[25.19px]">
                    <span className="font-semibold text-[#1F1A14]">{lead}</span>
                    <span className="font-normal text-[#2D2A24]">{body}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* reactive / preventive split */}
        <div className="reveal mt-[24px] grid overflow-hidden rounded-[28px] border border-[rgba(31,26,20,0.08)] sm:grid-cols-2">
          <div className="flex flex-col gap-[11px] bg-[rgba(245,237,223,0.7)] p-[36px]">
            <span className="inline-flex items-center gap-[8px] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B6358]">
              <FigIcon src="/landing/_icons/droplet.svg" className="size-[18px]" />A blood test
            </span>
            <p className="text-[19px] font-medium leading-[26.13px] text-[#2D2A24]">
              Tells you what’s happening <span className="font-semibold text-[#1F1A14]">right now.</span>
            </p>
            <span className="text-[13px] font-semibold uppercase tracking-[0.025em] text-[#C76842]">Reactive</span>
          </div>
          <div className="relative flex flex-col gap-[11px] overflow-hidden bg-[#0E4D4B] p-[36px]">
            <div className="pointer-events-none absolute -top-8 right-0 size-[160px] rounded-full bg-[rgba(37,181,171,0.2)] blur-[40px]" />
            <span className="relative inline-flex items-center gap-[8px] text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgba(243,213,178,0.85)]">
              <FigIcon src="/landing/_icons/shield-check.svg" className="size-[18px]" />A genetic test
            </span>
            <p className="relative text-[19px] font-medium leading-[26.13px] text-[#FAF6EF]">
              Tells you what your body is <span className="font-semibold text-[#F3D5B2]">predisposed to.</span>
            </p>
            <span className="relative text-[13px] font-semibold uppercase tracking-[0.025em] text-[#2AC3A2]">
              Preventive
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ==================== 5 · WHAT YOU GET ==================== */

const GET_BULLETS: React.ReactNode[] = [
  <>
    Your <strong className="font-semibold text-[#1F1A14]">THADA genotype</strong>, the specific gene variant you carry
  </>,
  <>
    Risk grading: <strong className="font-semibold text-[#0E4D4B]">Good</strong>,{' '}
    <strong className="font-semibold text-[#C76842]">Average</strong> or{' '}
    <strong className="font-semibold text-[#1F1A14]">Poor</strong>
  </>,
  <>
    A plain-language interpretation of what it means{' '}
    <strong className="font-semibold text-[#1F1A14]">for you specifically</strong>
  </>,
  <>Personalised lifestyle, diet and medical recommendations</>,
];

function MockReport() {
  return (
    <div className="reveal-r overflow-hidden rounded-[30px] border border-[rgba(31,26,20,0.08)] bg-white shadow-[0_40px_100px_rgba(45,32,18,0.14),0_12px_36px_rgba(45,32,18,0.1)]">
      {/* dark header */}
      <div className="relative overflow-hidden px-[32px] pb-[32px] pt-[28px]" style={{ background: 'linear-gradient(175deg, #0E4D4B 0%, #0A3B39 100%)' }}>
        <div className="pointer-events-none absolute -right-6 -top-8 size-[176px] rounded-full bg-[rgba(37,181,171,0.2)] blur-[40px]" />
        <div className="relative flex items-center justify-between">
          <span className="inline-flex items-center gap-[6px] text-[#FAF6EF]">
            <FigIcon src="/landing/_icons/kyg-logo-mark.svg" className="size-[16px] text-[#F3D5B2]" />
            <span className="text-[11px] font-bold tracking-[-0.02em]">KnowYourGenes</span>
          </span>
          <span className="rounded-full bg-white/15 px-[12px] py-[6px] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FAF6EF] backdrop-blur-[8px]">
            Panel 01 / 05
          </span>
        </div>
        <div className="relative mt-[20px] text-[12px] font-semibold uppercase tracking-[0.14em] text-[rgba(243,213,178,0.8)]">
          Polycystic Ovary Syndrome (PCOS) Risk
        </div>
        <div className="relative mt-[8px] flex items-center gap-[8px]">
          <FigIcon src="/landing/_icons/dna.svg" className="size-[22px] text-[#FAF6EF]" />
          <span className="text-[22px] font-semibold leading-[33px] tracking-[-0.025em] text-[#FAF6EF]">
            Gene · THADA
          </span>
        </div>
      </div>

      {/* body */}
      <div className="flex flex-col gap-[18px] px-[32px] py-[28px]">
        <div className="grid grid-cols-2 gap-[16px]">
          <div className="rounded-[16px] bg-[rgba(245,237,223,0.7)] p-[20px]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B6358]">Your genotype</div>
            <div className="mt-[6px] font-hind text-[34px] font-semibold leading-none tracking-[-0.025em] text-[#1F1A14]">
              AA
            </div>
          </div>
          <div className="rounded-[16px] bg-[rgba(14,77,75,0.08)] p-[20px]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(14,77,75,0.8)]">
              Your response
            </div>
            <div className="mt-[8px] inline-flex items-center gap-[8px]">
              <span className="size-[10px] rounded-full bg-[#2AC3A2]" />
              <span className="text-[20px] font-semibold leading-[30px] text-[#0E4D4B]">Good</span>
            </div>
          </div>
        </div>

        <p className="text-[14.5px] leading-[23.56px] text-[#2D2A24]">
          Your genotype is associated with <strong className="font-semibold text-[#1F1A14]">normal risk</strong> of
          developing PCOS. Maintain ideal body weight. Exercise regularly to stay fit and healthy.
        </p>

        <div>
          <div className="flex items-center justify-between">
            {['Good', 'Average', 'Poor'].map((l) => (
              <span key={l} className="text-[11px] font-semibold uppercase tracking-[0.025em] text-[#6B6358]">
                {l}
              </span>
            ))}
          </div>
          <div
            className="relative mt-[8px] h-[8px] rounded-full"
            style={{ background: 'linear-gradient(90deg, #2AC3A2 0%, #F3D5B2 50%, #C76842 100%)' }}
          >
            <span className="absolute left-[6%] top-1/2 size-[14px] -translate-y-1/2 rounded-full border-[3px] border-white bg-[#2AC3A2] shadow-[0_2px_6px_rgba(0,0,0,0.2)]" />
          </div>
        </div>

        <p className="border-t border-[rgba(31,26,20,0.08)] pt-[18px] text-[12.5px] italic leading-[20.31px] text-[#6B6358]">
          Sample shows a <strong className="font-semibold not-italic text-[#1F1A14]">Good</strong> result. Your actual
          result depends on your genotype and may differ. A{' '}
          <strong className="font-semibold not-italic text-[#C76842]">Poor</strong> result is equally valuable: it tells
          you exactly where to focus.
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
            'linear-gradient(180deg, rgba(248,228,204,0) 0%, rgba(248,228,204,0.4) 50%, rgba(248,228,204,0) 100%)',
        }}
      />
      <Container>
        <div className="grid items-start gap-[56px] lg:grid-cols-2 lg:gap-[48px]">
          <div className="reveal">
            <Eyebrow icon={<FigIcon src="/landing/_icons/eb-whatyouget.svg" className="size-[19px]" />}>What you get</Eyebrow>
            <h2 className="mt-[20px] text-[34px] font-semibold leading-[1.05] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
              Your PCOS genetic result.{' '}
              <span className="font-medium text-[#6B6358]">In plain language.</span>
            </h2>
            <p className="mt-[20px] text-[16px] leading-[26px] text-[#2D2A24]">
              Your Women’s Health DNA report includes the PCOS panel as{' '}
              <strong className="font-semibold text-[#1F1A14]">Panel 01</strong>, the first and most-searched result.
              You’ll see:
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
                And this is just Panel 01 of 5
              </span>
              <p className="text-[15px] leading-[24.38px] text-[#2D2A24]">
                Your report also covers pregnancy loss, post-pregnancy depression, osteoporosis and arthritis risk. All
                from the same saliva sample. All in one{' '}
                <strong className="font-semibold text-[#1F1A14]">32-page report.</strong>
              </p>
            </div>

            <div className="mt-[32px]">
              <SheenButton href="#check">Check my PCOS genetic risk</SheenButton>
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
  { n: '1 in 5', c: '#F3D5B2', label: 'Indian women has PCOS' },
  { n: '70%', c: '#2AC3A2', label: 'experience hirsutism, unwanted facial or body hair' },
  { n: '80%', c: '#F3D5B2', label: 'of PCOS women are overweight or obese' },
  { n: '< 8', c: '#2AC3A2', label: 'periods per year for many with PCOS' },
  { n: '2 to 3', c: '#F3D5B2', label: 'years the average woman waits for a diagnosis' },
  { n: '2×', c: '#2AC3A2', label: 'higher risk of type 2 diabetes with PCOS' },
  { n: 'THADA', c: '#F3D5B2', label: 'the gene linked to both PCOS and diabetes, tested in your report', small: true },
  { n: '7 days', c: '#2AC3A2', label: 'from lab receipt to your complete report' },
];

export function DataStatsSection() {
  return (
    <section className="bg-[#1A2220] py-[80px] lg:py-[100px]">
      <Container>
        <div className="reveal max-w-[720px]">
          <Eyebrow tone="dark" icon={<FigIcon src="/landing/_icons/eb-data.svg" className="size-[19px]" />}>By the numbers</Eyebrow>
          <h2 className="mt-[22px] text-[34px] font-semibold leading-[1.06] tracking-[-0.022em] text-[#FAF6EF] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            The numbers that explain why you’re reading this.
          </h2>
        </div>

        <div className="mt-[48px] grid grid-cols-2 gap-px overflow-hidden rounded-[28px] bg-white/10 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col gap-[12px] bg-[#1A2220] p-[28px] sm:p-[32px]">
              <div
                className={`font-hind font-semibold leading-none tracking-[-0.025em] ${s.small ? 'text-[40px]' : 'text-[44px] lg:text-[52px]'}`}
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
    before: 'Irregular periods for 4 years. “It’s stress.” “It’ll sort itself out after marriage.”',
    after: (
      <>
        <strong className="font-semibold text-[#1F1A14]">THADA variant flagged.</strong>
        <span className="font-normal text-[#2D2A24]">
          {' '}
          Elevated PCOS risk confirmed. Gynaecologist appointment booked with data in hand, not just symptoms.
        </span>
      </>
    ),
  },
  {
    before: 'Gained 8kg in a year despite eating well. Felt like her body was betraying her.',
    after: (
      <span className="text-[#2D2A24]">
        Genetic link to insulin resistance understood. Diet adjusted to{' '}
        <strong className="font-semibold text-[#1F1A14]">low-glycaemic.</strong> Weight started responding for the first
        time.
      </span>
    ),
  },
  {
    before: 'Trying to conceive for 14 months. No pregnancy. Increasing panic.',
    after: (
      <span className="text-[#2D2A24]">
        The panel helped her doctor understand the hormonal baseline.{' '}
        <strong className="font-semibold text-[#1F1A14]">Targeted fertility support started.</strong> Ovulation induction
        discussed earlier than usual.
      </span>
    ),
  },
  {
    before: 'Facial hair since age 19. Embarrassed. Waxing every 2 weeks. Never connected it to anything.',
    after: (
      <>
        <strong className="font-semibold text-[#1F1A14]">Hirsutism explained</strong>
        <span className="font-normal text-[#2D2A24]">
          {' '}
          by THADA variant and androgen excess. Dermatologist consulted. Medical management options discussed for the
          first time.
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
            The same woman. <span className="font-medium text-[#6B6358]">Before she knew.</span>
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
                <p className="text-[15.5px] italic leading-[25.19px] text-[#6B6358]">{row.before}</p>
              </div>
              <div className="flex flex-col gap-[12px] bg-[rgba(14,77,75,0.06)] p-[32px]">
                <span className="inline-flex items-center gap-[8px]">
                  <span className="grid size-[28px] place-items-center rounded-[8px] text-[#0E4D4B]">
                    <FigIcon src="/landing/_icons/check.svg" className="size-[16px]" />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0E4D4B]">After</span>
                </span>
                <p className="text-[15.5px] leading-[25.19px]">{row.after}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
