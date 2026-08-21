import Image from 'next/image';
import { Container, Eyebrow, FigIcon, GhostButton, GradientText, SheenButton, gTeal } from '../shared/ui';

/* ============================ 1 · HERO ============================ */

export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden pt-[40px] pb-[80px] sm:pt-[48px] lg:pb-[96px]">
      {/* exact Figma decorative background - node 258:307 (peach + mint blobs · dashed path) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 hidden bg-[length:100%_100%] bg-no-repeat lg:block"
        style={{ backgroundImage: 'url(/landing/pregnancy-loss/hero-bg.svg)' }}
      />
      {/* mobile: soft mint wash */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 lg:hidden"
        style={{
          background:
            'radial-gradient(56% 46% at 86% 6%, rgba(228,241,236,0.7) 0%, rgba(228,241,236,0) 60%), radial-gradient(46% 40% at 2% 18%, rgba(14,77,75,0.06) 0%, rgba(14,77,75,0) 60%)',
        }}
      />
      <Container>
        <div className="lg:grid lg:grid-cols-[minmax(0,600px)_minmax(0,1fr)] lg:items-center">
          {/* glass copy card */}
          <div className="relative z-10 rounded-sm border border-white/70 bg-[rgba(250,246,239,0.85)] p-7 shadow-[0_24px_70px_-30px_rgba(20,45,40,0.4)] backdrop-blur-[24px] sm:p-10 lg:py-[44px] lg:pl-[40px] lg:pr-[64px] lg:mr-[-72px]">
            <span className="inline-flex items-center gap-[10px] rounded-sm bg-[#0E4D4B] py-[8px] pl-[12px] pr-[20px] shadow-[0_14px_32px_-8px_rgba(14,77,75,0.42)]">
              <span className="grid size-[28px] place-items-center rounded-sm bg-[rgba(37,181,171,0.25)] text-[#FAF6EF]">
                <FigIcon src="/landing/icons/hero-badge.svg" className="size-[18px]" />
              </span>
              <span className="text-[13.5px] font-semibold leading-[20.25px] text-[#FAF6EF]">
                Pregnancy Loss Genetic Risk Test · Saliva kit
              </span>
            </span>

            <h1 className="mt-[22px] text-[40px] font-semibold leading-[1.0] tracking-[-0.035em] text-[#1F1A14] sm:text-[52px] lg:text-[60px] lg:leading-[60px]">
              Know your risk <span className="font-medium text-[#2D2A24]">before you begin.</span>
              <br />
              Or finally <GradientText image={gTeal(164)}>understand why.</GradientText>
            </h1>

            <div className="mt-[20px] flex flex-wrap gap-[8px]">
              <span className="inline-flex items-center gap-[6px] rounded-sm border border-[rgba(14,77,75,0.15)] bg-white/80 px-[14px] py-[8px] text-[13px] font-medium text-[#2D2A24]">
                <FigIcon src="/landing/icons/calendar.svg" className="size-[15px] text-[#0E4D4B]" />
                Planning a pregnancy
              </span>
              <span className="inline-flex items-center gap-[6px] rounded-sm border border-[rgba(14,77,75,0.15)] bg-white/80 px-[14px] py-[8px] text-[13px] font-medium text-[#2D2A24]">
                <FigIcon src="/landing/icons/pl-hand-heart.svg" className="size-[15px] text-[#0E4D4B]" />
                After a loss
              </span>
            </div>

            <p className="mt-[20px] max-w-[520px] text-[16px] leading-[1.5] text-[#2D2A24] lg:text-[18px] lg:leading-[27.9px]">
              Miscarriage occurs in{' '}
              <strong className="font-semibold text-[#1F1A14]">10 to 20% of known pregnancies.</strong> Most are called
              unexplained. But your <strong className="font-semibold text-[#0E4D4B]">MTHFR and FOXP3</strong> gene
              variants may hold the explanation your doctors couldn’t give you, and the information you need to protect
              your next pregnancy.
            </p>

            <div className="mt-[28px] flex flex-wrap items-center gap-x-[6px] gap-y-[14px]">
              <SheenButton href="#check" tone="eden">
                Know my pregnancy risk
              </SheenButton>
              <GhostButton href="#covers">What the test covers</GhostButton>
            </div>

            <div className="mt-[24px] flex flex-wrap items-center gap-x-[22px] gap-y-[10px]">
              {['No needles', 'Results in 7 days', '30-min free counselling'].map((t) => (
                <span key={t} className="inline-flex items-center gap-[6px] text-[13.5px] font-medium text-[#6B6358]">
                  <FigIcon src="/landing/icons/check.svg" className="size-[16px] text-[#0E4D4B]" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* image block */}
          <div className="mt-10 lg:mt-0 z-10">
            <div className="relative mx-auto aspect-[589/600] w-full max-w-[589px] overflow-hidden rounded-sm bg-[#E4F1EC] shadow-[0_40px_100px_rgba(20,45,40,0.15),0_12px_36px_rgba(20,45,40,0.1)]">
              <Image
                src="/landing/pregnancy-loss/hero.png"
                alt="Two people holding hands in support across a table"
                fill
                priority
                sizes="(max-width:1024px) 90vw, 589px"
                className="object-cover object-center"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(161deg, rgba(14,77,75,0.04) 0%, rgba(14,77,75,0.1) 50%, rgba(14,77,75,0.5) 100%)',
                }}
              />
              {/* stat chip */}
              <div className="absolute right-4 top-4 flex items-center gap-[12px] rounded-sm bg-[rgba(14,77,75,0.95)] px-[16px] py-[12px] backdrop-blur-[8px]">
                <FigIcon src="/landing/icons/pl-activity-monitor.svg" className="size-[22px] text-[#F3D5B2]" />
                <div className="leading-tight">
                  <div className="font-hind text-[18px] font-semibold leading-[22.5px] text-[#FAF6EF]">10 to 20%</div>
                  <div className="text-[10.5px] font-normal uppercase tracking-[0.06em] text-[rgba(243,213,178,0.85)]">
                    of pregnancies
                  </div>
                </div>
              </div>
              {/* caption card */}
              <div className="absolute inset-x-4 bottom-4 flex items-center gap-[14px] rounded-sm bg-white px-[16px] py-[14px] shadow-[0_12px_30px_rgba(20,45,40,0.18)]">
                <span className="grid size-[40px] shrink-0 place-items-center rounded-sm bg-[rgba(14,77,75,0.1)] text-[#0E4D4B]">
                  <FigIcon src="/landing/icons/users.svg" className="size-[21px]" />
                </span>
                <p className="text-[13.5px] leading-[18.56px]">
                  <span className="font-semibold text-[#1F1A14]">You are not alone.</span>
                  <span className="font-normal text-[#2D2A24]"> More women have been here than you know.</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* trust bar */}
        <div className="reveal mt-[40px] flex flex-col items-start gap-[16px] rounded-sm border border-[rgba(31,26,20,0.08)] bg-white/55 px-[28px] py-[16px] backdrop-blur-[8px] sm:flex-row sm:items-center sm:gap-[20px]">
          <span className="inline-flex shrink-0 items-center gap-[8px]">
            <FigIcon src="/landing/icons/pl-flower.svg" className="size-[19px] text-[#0E4D4B]" />
            <span className="text-[12.5px] font-bold uppercase tracking-[0.1em] text-[#0E4D4B]">
              Women’s Health DNA
            </span>
          </span>
          <p className="text-[15px] leading-[24.38px] text-[#2D2A24]">
            Part of the 5-panel report. Also covers PCOS, depression, bone health and arthritis risk. Tested by{' '}
            <span className="font-semibold text-[#1F1A14]">NABL-accredited Neotech World Lab.</span>
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ===================== 2 · YOU ARE NOT ALONE ===================== */

const VOICES = [
  {
    initials: 'PC',
    badge: '#0E4D4B',
    blob: 'rgba(210,232,223,0.6)',
    name: 'Priyanka Chopra Jonas',
    source: 'In her memoir, ‘Unfinished’',
    quote:
      'She spoke about pregnancy loss not to generate sympathy, but because silence makes grief heavier, and because women who have been here deserve to know they are not alone, and that what happened to them is not their fault.',
    takeaway:
      'Pregnancy loss is not a failure of the woman. Often it is a convergence of genetic factors no amount of rest or willpower could change.',
  },
  {
    initials: 'MO',
    badge: '#15605D',
    blob: 'rgba(248,228,204,0.5)',
    name: 'Michelle Obama',
    source: 'In her book, ‘Becoming’',
    quote:
      'She wrote about two miscarriages: “I felt like I failed, because I didn’t know how common miscarriages were.” One of the most high-achieving, health-conscious women in the world. And she didn’t know.',
    takeaway:
      'Miscarriage is common, is often genetic, and with the right information is sometimes preventable. This test gives you that information.',
  },
  {
    initials: 'CT',
    badge: '#C76842',
    blob: 'rgba(210,232,223,0.6)',
    name: 'Chrissy Teigen',
    source: 'Spoke publicly and vulnerably',
    quote:
      'Her public sharing changed the conversation globally. Women who had been suffering in silence suddenly saw their experience reflected back at them, and felt less alone, less ashamed, less broken.',
    takeaway: 'You are not broken. You may have a genetic variant. And that is something science can work with.',
  },
];

export function NotAloneSection() {
  return (
    <section className="relative overflow-hidden pb-[100px] pt-[64px] lg:pb-[100px]">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(228,241,236,0) 0%, rgba(228,241,236,0.5) 50%, rgba(228,241,236,0) 100%)',
        }}
      />
      <Container>
        <div className="reveal max-w-[760px]">
          <Eyebrow icon={<FigIcon src="/landing/icons/eb-heart.svg" className="size-[19px]" />}>
            You are not alone
          </Eyebrow>
          <h2 className="mt-[18px] text-[34px] font-semibold leading-[1.08] tracking-[-0.022em] text-[#1F1A14] sm:text-[42px] lg:text-[46px] lg:leading-[49.68px]">
            More women have been here than you know.
          </h2>
          <p className="mt-[20px] max-w-[620px] text-[17px] leading-[28px] text-[#2D2A24] lg:text-[18.7px] lg:leading-[30.42px]">
            Real women, telling real stories, so the woman reading this knows that what happened to her is common, is
            not her fault, and is not always unexplainable.
          </p>
        </div>

        <div className="mt-[32px] grid gap-[24px] md:grid-cols-2 lg:grid-cols-3">
          {VOICES.map((v) => (
            <article
              key={v.name}
              className="reveal relative overflow-hidden rounded-sm border border-[rgba(31,26,20,0.08)] bg-white/75 p-[32px] shadow-[0_4px_14px_rgba(20,45,40,0.05),0_1px_2px_rgba(20,45,40,0.04)]"
            >
              <div
                className="pointer-events-none absolute -right-5 -top-5 size-[112px] rounded-full blur-[40px]"
                style={{ background: v.blob }}
              />
              <div className="relative flex items-center gap-[14px]">
                <span
                  className="grid size-[56px] shrink-0 place-items-center rounded-sm text-[15px] font-semibold text-[#FAF6EF]"
                  style={{ background: v.badge }}
                >
                  {v.initials}
                </span>
                <div>
                  <div className="text-[16px] font-semibold leading-[20px] text-[#1F1A14]">{v.name}</div>
                  <div className="text-[12.5px] leading-[18.75px] text-[#6B6358]">{v.source}</div>
                </div>
              </div>
              <p className="relative mt-[18px] text-[14.5px] leading-[23.56px] text-[#2D2A24]">{v.quote}</p>
              <p className="relative mt-[18px] border-t border-[rgba(31,26,20,0.08)] pt-[18px] text-[13.5px] font-medium leading-[20.25px] text-[#1F1A14]">
                {v.takeaway}
              </p>
            </article>
          ))}
        </div>

        {/* thesis callout */}
        <div
          className="reveal relative mt-[24px] overflow-hidden rounded-sm px-[40px] py-[48px] shadow-[0_40px_100px_rgba(20,45,40,0.15),0_12px_36px_rgba(20,45,40,0.1)] sm:px-[48px] sm:py-[56px]"
          style={{ background: 'linear-gradient(178deg, #0E4D4B 0%, #0A3B39 100%)' }}
        >
          <div className="pointer-events-none absolute -right-10 -top-16 size-[224px] rounded-full bg-[rgba(37,181,171,0.2)] blur-[64px]" />
          <div className="pointer-events-none absolute -bottom-16 left-1/3 size-[192px] rounded-full bg-[rgba(243,213,178,0.1)] blur-[64px]" />
          <div className="relative flex flex-col items-start gap-[20px]">
            <span className="grid size-[56px] place-items-center rounded-sm bg-white/10 text-[#F3D5B2] backdrop-blur-[8px]">
              <FigIcon src="/landing/icons/quote.svg" className="size-[28px]" />
            </span>
            <p className="max-w-[900px] text-[24px] font-semibold leading-[1.28] tracking-[-0.018em] sm:text-[28px] lg:text-[30px] lg:leading-[38.4px]">
              <span className="text-[#FAF6EF]">
                Pregnancy loss is not rare. It is not your fault. And in many cases, it is not unexplainable.{' '}
              </span>
              <span className="text-[#F3D5B2]">
                Your genes may hold the answer that your doctors couldn’t give you.
              </span>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ==================== 3 · WHAT THE TEST COVERS ==================== */

const GENES = [
  {
    n: 'Gene 1',
    gene: 'MTHFR',
    icon: 'pl-apple',
    sub: 'Your folate metabolism gene',
    paras: [
      'The MTHFR gene controls an enzyme that converts folate into the active form your body can use. Folate is essential for foetal neural tube development, the early formation of the brain and spine that happens in the first weeks of pregnancy, often before a woman even knows she is pregnant.',
      'A variant can impair this conversion, leading to elevated homocysteine levels, which is associated with recurrent pregnancy loss. It is particularly common and particularly underdiagnosed. Women with an MTHFR variant often need a different form of folate (methylfolate, not folic acid), a small change with a potentially significant impact.',
    ],
  },
  {
    n: 'Gene 2',
    gene: 'FOXP3',
    icon: 'pl-shield-heart',
    sub: 'Your immune regulation gene',
    paras: [
      'The FOXP3 gene is involved in immune regulation, specifically the T-regulatory cells that prevent the immune system from attacking the body’s own tissues. During pregnancy, the mother’s immune system must tolerate the foetus, which carries paternal DNA it would otherwise recognise as foreign.',
      'Defects in FOXP3 are associated with autoimmune dysfunction, and autoimmune causes are one of the leading explanations for otherwise unexplained recurrent pregnancy loss. Knowing your FOXP3 variant gives your doctor a critical piece of the immunological picture.',
    ],
  },
];

export function WhatTheTestCoversSection() {
  return (
    <section id="covers" className="py-[72px] lg:py-[88px]">
      <Container>
        <div className="reveal max-w-[820px]">
          <Eyebrow icon={<FigIcon src="/landing/icons/eb-dna.svg" className="size-[19px]" />}>
            What the test covers
          </Eyebrow>
          <h2 className="mt-[20px] text-[34px] font-semibold leading-[1.06] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            Two genes. Two critical pregnancy functions.
          </h2>
          <p className="mt-[8px] text-[24px] font-medium leading-[1.08] tracking-[-0.032em] text-[#6B6358] lg:text-[30px]">
            Now readable from a saliva sample.
          </p>
        </div>

        <div className="mt-[40px] grid gap-[16px] lg:grid-cols-2">
          {GENES.map((g) => (
            <div
              key={g.gene}
              className="reveal flex flex-col rounded-sm border border-[rgba(31,26,20,0.08)] bg-white/75 p-[36px] shadow-[0_4px_14px_rgba(20,45,40,0.05),0_1px_2px_rgba(20,45,40,0.04)]"
            >
              <div className="flex items-center gap-[16px]">
                <span className="grid size-[56px] shrink-0 place-items-center rounded-sm bg-[rgba(14,77,75,0.08)] text-[#0E4D4B]">
                  <FigIcon src={`/landing/icons/${g.icon}.svg`} className="size-[28px]" />
                </span>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0E4D4B]">{g.n}</div>
                  <div className="text-[22px] font-semibold leading-[1] tracking-[-0.025em] text-[#1F1A14]">
                    {g.gene}
                  </div>
                </div>
              </div>
              <div className="mt-[14px] text-[14px] font-semibold leading-[21px] text-[#2D2A24]">{g.sub}</div>
              <div className="mt-[14px] flex flex-col gap-[15px]">
                {g.paras.map((p, i) => (
                  <p key={i} className="text-[14.5px] leading-[23.56px] text-[#2D2A24]">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* takeaway banner */}
        <div
          className="reveal mt-[16px] flex flex-col items-start gap-[20px] rounded-sm border border-[rgba(14,77,75,0.15)] px-[40px] py-[32px] sm:flex-row sm:items-center"
          style={{
            background:
              'linear-gradient(90deg, rgba(228,241,236,1) 0%, rgba(210,232,223,0.7) 50%, rgba(228,241,236,0.6) 100%)',
          }}
        >
          <FigIcon src="/landing/icons/pl-lightbulb.svg" className="size-[36px] shrink-0 text-[#0E4D4B]" />
          <p className="text-[19px] font-semibold leading-[1.32] tracking-[-0.012em] text-[#0E4D4B] sm:text-[21px] lg:text-[23px] lg:leading-[30.36px]">
            Most women with recurrent pregnancy loss are told it is bad luck. For many, it is actually a folate
            metabolism issue or an immune regulation variant, both identifiable, and both manageable with the right
            medical support.
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ==================== 4 · THE PREVENTIVE CASE ==================== */

export function PreventiveCaseSection() {
  return (
    <section id="why" className="relative overflow-hidden py-[80px] lg:py-[100px]">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(248,228,204,0) 0%, rgba(248,228,204,0.35) 50%, rgba(248,228,204,0) 100%)',
        }}
      />
      <Container>
        <div className="grid items-start gap-[48px] lg:grid-cols-2 lg:gap-[60px]">
          {/* argument column */}
          <div className="reveal">
            <Eyebrow icon={<FigIcon src="/landing/icons/eb-clock.svg" className="size-[19px]" />}>
              The preventive case
            </Eyebrow>
            <h2 className="mt-[20px] text-[32px] font-semibold leading-[1.08] tracking-[-0.022em] sm:text-[38px] lg:text-[42px] lg:leading-[46.2px]">
              <span className="text-[#1F1A14]">This is not a test you take after loss.</span>
              <br />
              <GradientText image={gTeal(176)}>It’s a test you take so you go in prepared.</GradientText>
            </h2>
            <div className="mt-[24px] flex flex-col gap-[20px]">
              <p className="text-[16px] leading-[26px] text-[#2D2A24]">
                The best time to take this test is{' '}
                <strong className="font-semibold text-[#1F1A14]">before you start trying.</strong> Before the emotional
                investment. Before the first positive test. Before the first appointment.
              </p>
              <p className="text-[16px] leading-[26px] text-[#2D2A24]">
                Because if your MTHFR variant is present, your pre-conception supplementation protocol should change.
                Standard folic acid may not be enough, you may need active methylfolate. That is a conversation your
                doctor can have with you before your first cycle of trying, not after your third loss.
              </p>
              <p className="text-[16px] leading-[26px] text-[#2D2A24]">
                And if your FOXP3 variant shows autoimmune risk, your fertility specialist can factor that in from the
                beginning, monitoring immune markers, considering progesterone support, and preparing for the pregnancy
                rather than reacting to it.
              </p>
            </div>
            <div className="mt-[24px] rounded-sm border border-[rgba(31,26,20,0.08)] bg-white/70 px-[24px] pb-[24px] pt-[28px]">
              <span className="inline-flex items-center gap-[8px] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0E4D4B]">
                <FigIcon src="/landing/icons/pl-hand-heart.svg" className="size-[18px]" />
                For women who have already experienced loss
              </span>
              <p className="mt-[10px] text-[14.5px] leading-[23.56px] text-[#2D2A24]">
                This test is not about looking back. It’s about looking forward with better information. It will not
                undo what happened. But it may explain it, and it may make everything that comes next more possible.
              </p>
            </div>
          </div>

          {/* image + floating quote column */}
          <div className="reveal-r flex flex-col gap-[20px] lg:pt-[40px]">
            <div className="relative aspect-[539/486] w-full overflow-hidden rounded-sm bg-[#E4F1EC] shadow-[0_40px_100px_rgba(20,45,40,0.15),0_12px_36px_rgba(20,45,40,0.1)]">
              <Image
                src="/landing/pregnancy-loss/preventive.png"
                alt="A mother holding her newborn tenderly"
                fill
                sizes="(max-width:1024px) 90vw, 540px"
                className="object-cover object-[50%_30%]"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, rgba(14,77,75,0) 40%, rgba(14,77,75,0.55) 100%)' }}
              />
            </div>
            <div className="relative overflow-hidden rounded-sm bg-[#0E4D4B] p-[28px]">
              <div className="pointer-events-none absolute -right-8 -top-8 size-[144px] rounded-full bg-[rgba(37,181,171,0.2)] blur-[40px]" />
              <p className="relative text-[20px] font-semibold leading-[28px] text-[#FAF6EF]">
                Pre-conception genetic testing is not paranoia. It is the most rational, loving thing you can do for a
                pregnancy that <span className="text-[#F3D5B2]">hasn’t happened yet.</span>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
