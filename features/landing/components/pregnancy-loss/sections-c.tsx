import Image from 'next/image';
import { Container, Eyebrow, FigIcon, SheenButton } from '../shared/ui';

/* ==================== 9 · AT EVERY AGE ==================== */

const AGES = [
  {
    age: '22 to 27',
    title: 'Pre-marriage, early planning',
    copper: false,
    body: (
      <>
        You’re not trying yet. But you’re thinking about it. Knowing your MTHFR status now means your supplementation is
        right <strong className="font-medium text-[#2D2A24]">from cycle one</strong>, not adjusted after a heartbreaking
        first trimester.
      </>
    ),
  },
  {
    age: '27 to 33',
    title: 'Actively trying or recently married',
    copper: false,
    body: (
      <>
        The highest-stakes window. If conception is taking longer, or a first pregnancy ended in loss, your genetic
        profile gives your doctor something concrete to act on.{' '}
        <strong className="font-medium text-[#2D2A24]">Not ‘let’s wait and see.’</strong>
      </>
    ),
  },
  {
    age: '33 to 38',
    title: 'Second pregnancy, or trying after loss',
    copper: false,
    body: (
      <>
        Age raises loss risk on its own. Knowing whether you also carry a variant that compounds it changes how your
        doctor manages your next pregnancy.{' '}
        <strong className="font-medium text-[#2D2A24]">Earlier monitoring, immune support if needed.</strong>
      </>
    ),
  },
  {
    age: '38 and up',
    title: 'Advanced maternal age with history of loss',
    copper: true,
    body: (
      <>
        Every cycle matters more. Every piece of information matters more. Your genetic pregnancy profile is{' '}
        <strong className="font-medium text-[#2D2A24]">one of the most valuable tools</strong> available to your
        fertility specialist at this stage.
      </>
    ),
  },
];

export function AtEveryAgeSection() {
  return (
    <section className="py-[72px] lg:py-[88px]">
      <Container>
        <div className="reveal max-w-[780px]">
          <Eyebrow icon={<FigIcon src="/landing/icons/eb-calendar.svg" className="size-[19px]" />}>
            At every age
          </Eyebrow>
          <h2 className="mt-[20px] text-[34px] font-semibold leading-[1.07] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            Whether you’re planning or processing,{' '}
            <span className="font-medium text-[#6B6358]">this information is yours to have.</span>
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

/* ==================== 10 · TESTIMONIALS ==================== */

const TESTIMONIALS = [
  {
    avatar: '/landing/pregnancy-loss/avatar-meera.png',
    name: 'Meera S., 32',
    role: 'Bengaluru · Architect',
    quote:
      '“Two miscarriages. No explanation. My OB-GYN said my tests were all normal. I took the test because I needed more than normal. My MTHFR result showed a variant. My doctor changed my folate supplementation immediately. I am now 24 weeks with my third pregnancy. I am in it with more information than I’ve ever had.”',
  },
  {
    avatar: '/landing/pregnancy-loss/avatar-tanya.png',
    name: 'Tanya K., 28',
    role: 'Delhi · Product manager',
    quote:
      '“I took this test before my first pregnancy because my mother had two miscarriages. I wanted to know before I started trying. My MTHFR came back normal. My FOXP3 came back normal. I cannot describe what it felt like to go into my first pregnancy without the fear I had been carrying. This test gave me that.”',
  },
  {
    avatar: '/landing/pregnancy-loss/avatar-priya.png',
    name: 'Priya R., 35',
    role: 'Mumbai · Entrepreneur',
    quote:
      '“We had done two rounds of IVF. Both failed. Nobody mentioned genetics. My husband found the KYG test. My FOXP3 result showed an immune regulation variant. My fertility doctor called it a ‘missing piece.’ We’re doing a third round now with immunotherapy support added. I feel like we’re finally playing with the full picture.”',
  },
];

export function TestimonialsSection() {
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
        <div className="reveal max-w-[760px]">
          <Eyebrow icon={<FigIcon src="/landing/icons/eb-quote.svg" className="size-[19px]" />}>In their words</Eyebrow>
          <h2 className="mt-[20px] text-[34px] font-semibold leading-[1.06] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            What women discovered.
          </h2>
        </div>

        <div className="mt-[48px] grid gap-[24px] md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="reveal flex flex-col rounded-sm border border-[rgba(31,26,20,0.08)] bg-white/80 p-[32px] shadow-[0_4px_14px_rgba(20,45,40,0.05),0_1px_2px_rgba(20,45,40,0.04)]"
            >
              <FigIcon src="/landing/icons/quote.svg" className="size-[40px] text-[#0E4D4B]/30" />
              <blockquote className="mt-[16px] grow text-[14.5px] leading-[23.56px] text-[#2D2A24]">
                {t.quote}
              </blockquote>
              <figcaption className="mt-[24px] flex items-center gap-[14px] border-t border-[rgba(31,26,20,0.08)] pt-[20px]">
                <span className="relative size-[48px] shrink-0 overflow-hidden rounded-sm">
                  <Image src={t.avatar} alt={t.name} fill sizes="48px" className="object-cover" />
                </span>
                <span>
                  <span className="block text-[15px] font-semibold leading-[18.75px] text-[#1F1A14]">{t.name}</span>
                  <span className="block text-[13px] leading-[19.5px] text-[#6B6358]">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ==================== 11 · FOMO ==================== */

export function FomoSection() {
  return (
    <section className="py-[40px] lg:py-[60px]">
      <Container>
        <div className="reveal relative overflow-hidden rounded-sm bg-[#15201E]">
          <div className="absolute right-0 top-0 hidden h-full w-[55%] md:block">
            <Image
              src="/landing/pregnancy-loss/fomo.png"
              alt="A woman looking thoughtfully out of a window"
              fill
              sizes="(max-width:1024px) 0px, 660px"
              className="object-cover opacity-[0.85]"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, #15201E 0%, #15201E 46%, rgba(21,32,30,0.72) 62%, rgba(21,32,30,0.25) 100%)',
              }}
            />
          </div>

          <div className="relative max-w-[640px] p-8 sm:p-12 lg:p-[64px]">
            <Eyebrow tone="dark" icon={<FigIcon src="/landing/icons/eb-trending-up.svg" className="size-[19px]" />}>
              The cost of not knowing
            </Eyebrow>
            <h2 className="mt-[16px] text-[32px] font-semibold leading-[1.1] tracking-[-0.022em] sm:text-[38px] lg:text-[42px] lg:leading-[47px]">
              <span className="text-[#FAF6EF]">The hardest part is not the test. </span>
              <span className="text-[#F3D5B2]">It’s not knowing you needed it.</span>
            </h2>
            <p className="mt-[24px] text-[15.5px] leading-[25.19px] text-[rgba(250,246,239,0.8)]">
              Most women with an MTHFR variant have been taking standard folic acid during pre-conception and pregnancy.
              Standard folic acid does not work the same way for MTHFR carriers. Methylfolate does. A simple,
              inexpensive switch that most women never make, because no one told them to test.
            </p>
            <p className="mt-[16px] text-[15.5px] leading-[25.19px] text-[rgba(250,246,239,0.8)]">
              Most women whose FOXP3 variant causes immune-related loss are told it is unexplained. Because without the
              genetic context, it is. With it, it has a name, a mechanism, and a treatment pathway.
            </p>
            <p className="mt-[24px] text-[17px] font-medium leading-[25.5px]">
              <span className="text-[#FAF6EF]">You cannot go back. </span>
              <span className="text-[#F3D5B2]">But you can go forward with more than you had.</span>
            </p>
            <div className="mt-[28px]">
              <SheenButton href="#check" tone="light">
                Know my pregnancy risk
              </SheenButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ==================== 12 · HOW IT WORKS ==================== */

const STEPS = [
  {
    n: '01',
    icon: '/landing/icons/step-kit.svg',
    dark: false,
    title: 'We deliver the kit to your door',
    body: (
      <>
        Saliva collection tube, instructions, prepaid return courier. Arrives in 2 to 3 days. Takes 2 minutes. No
        needle. No hospital. No appointment.
      </>
    ),
  },
  {
    n: '02',
    icon: '/landing/icons/step-lab.svg',
    dark: false,
    title: 'The lab does the work',
    body: (
      <>
        Neotech World Lab, NABL accredited, ISO 9001:2015 and ISO 27001:2013 certified, using Illumina SNP genotyping.
        Reviewed by <strong className="font-medium text-[#2D2A24]">Dr. Varun Sharma, Ph.D</strong> before release.
      </>
    ),
  },
  {
    n: '03',
    icon: '/landing/icons/step-report.svg',
    dark: true,
    title: 'Your report. And a counsellor who explains it all.',
    body: (
      <>
        32-page personalised report in 7 days. Pregnancy panel plus 4 more. Plus a{' '}
        <strong className="font-medium text-[#F3D5B2]">free 30-minute counselling session</strong> with a genetic
        counsellor who will answer every question, with specific next steps for your situation.
      </>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section id="how" className="py-[72px] lg:py-[88px]">
      <Container>
        <div className="reveal max-w-[640px]">
          <Eyebrow icon={<FigIcon src="/landing/icons/eb-package.svg" className="size-[19px]" />}>How it works</Eyebrow>
          <h2 className="mt-[24px] text-[34px] font-semibold leading-[1.06] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            Order. Swab. Know. <span className="font-medium text-[#6B6358]">Three steps.</span>
          </h2>
        </div>

        <div className="relative mt-[56px]">
          <div className="grid gap-[24px] lg:grid-cols-3">
            {STEPS.map(({ n, icon, dark, title, body }) => (
              <div
                key={n}
                className={`reveal relative overflow-hidden rounded-sm p-[32px] ${
                  dark
                    ? 'bg-[#0E4D4B] shadow-[0_18px_50px_rgba(20,45,40,0.09),0_4px_16px_rgba(20,45,40,0.06)]'
                    : 'border border-[rgba(31,26,20,0.08)] bg-white/75 shadow-[0_4px_14px_rgba(20,45,40,0.05),0_1px_2px_rgba(20,45,40,0.04)]'
                }`}
              >
                {dark && (
                  <div className="pointer-events-none absolute -bottom-6 -right-6 size-[160px] rounded-full bg-[rgba(37,181,171,0.2)] blur-[40px]" />
                )}
                <div className="relative flex items-center justify-between">
                  <span className="font-hind text-[40px] font-semibold leading-none tracking-[-0.025em] text-[#F3D5B2]">
                    {n}
                  </span>
                  <span
                    className={`grid size-[56px] place-items-center rounded-sm ${
                      dark ? 'bg-white/15 text-[#FAF6EF]' : 'bg-[rgba(14,77,75,0.08)] text-[#0E4D4B]'
                    }`}
                  >
                    <FigIcon src={icon} className="size-[26px]" />
                  </span>
                </div>
                <h3
                  className={`relative mt-[18px] text-[18px] font-semibold leading-[27px] tracking-[-0.025em] ${
                    dark ? 'text-[#FAF6EF]' : 'text-[#1F1A14]'
                  }`}
                >
                  {title}
                </h3>
                <p
                  className={`relative mt-[7px] text-[14.5px] leading-[23.56px] ${
                    dark ? 'text-[rgba(250,246,239,0.85)]' : 'text-[#6B6358]'
                  }`}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
