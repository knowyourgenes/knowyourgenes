import Image from 'next/image';
import { Container, Eyebrow, SheenButton } from '../_shared/ui';
import { FileText, Microscope, Package, Quote, TrendingUp } from '../_shared/icons';

/* ==================== 12 · TESTIMONIALS ==================== */

const TESTIMONIALS = [
  {
    avatar: '/landing/peripartum-depression/avatar-kavya.png',
    name: 'Kavya S., 34',
    role: 'Chennai · Graphic designer',
    quote:
      '“I cried every day from month four of my first pregnancy. My mother said it was hormones. My doctor said first pregnancies are emotional. Nobody said: this might be genetic. Two years later, my COMT result was Poor. It wasn’t my fault. It was my gene. I cried again, but this time from relief.”',
  },
  {
    avatar: '/landing/peripartum-depression/avatar-rohini.png',
    name: 'Rohini M., 31',
    role: 'Hyderabad · Teacher',
    quote:
      '“I took this test before my second pregnancy because I lost 8 months of my first to something I couldn’t name. My result was Poor. I showed my OB-GYN. She referred me to a perinatal psychiatrist immediately. By the time my second baby arrived, I had a support team. A completely different experience.”',
  },
  {
    avatar: '/landing/peripartum-depression/avatar-arjun.png',
    name: 'Arjun K., 35',
    role: 'Bengaluru · Shared by his wife, Neha',
    quote:
      '“My wife had terrible post-pregnancy depression after our first child. We didn’t understand it. Before our second pregnancy, she did the KYG test. The COMT panel explained everything. I finally understood that what happened wasn’t something she could have controlled. And I knew what to watch for. That knowledge probably saved our marriage.”',
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
          <Eyebrow icon={<Quote className="size-[19px]" />}>In their words</Eyebrow>
          <h2 className="mt-[20px] text-[34px] font-semibold leading-[1.06] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            What women discovered.
          </h2>
        </div>

        <div className="mt-[48px] grid gap-[24px] md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="reveal flex flex-col rounded-[28px] border border-[rgba(31,26,20,0.08)] bg-white/80 p-[32px] shadow-[0_4px_14px_rgba(20,45,40,0.05),0_1px_2px_rgba(20,45,40,0.04)]"
            >
              <Quote className="size-[40px] text-[#0E4D4B]/30" />
              <blockquote className="mt-[16px] grow text-[14.5px] leading-[23.56px] text-[#2D2A24]">{t.quote}</blockquote>
              <figcaption className="mt-[24px] flex items-center gap-[14px] border-t border-[rgba(31,26,20,0.08)] pt-[20px]">
                <span className="relative size-[48px] shrink-0 overflow-hidden rounded-full">
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

/* ==================== 13 · FOMO ==================== */

export function FomoSection() {
  return (
    <section className="py-[40px] lg:py-[60px]">
      <Container>
        <div className="reveal relative overflow-hidden rounded-[36px] bg-[#15201E]">
          <div className="absolute right-0 top-0 hidden h-full w-[55%] md:block">
            <Image
              src="/landing/peripartum-depression/fomo.png"
              alt="A woman sitting alone by a window"
              fill
              sizes="(max-width:1024px) 0px, 660px"
              className="object-cover opacity-80"
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
            <Eyebrow tone="dark" icon={<TrendingUp className="size-[19px]" />}>
              The cost of not knowing
            </Eyebrow>
            <h2 className="mt-[16px] text-[32px] font-semibold leading-[1.1] tracking-[-0.022em] sm:text-[38px] lg:text-[42px] lg:leading-[47px]">
              <span className="text-[#FAF6EF]">The loneliest feeling </span>
              <span className="text-[#F3D5B2]">is not knowing why.</span>
            </h2>
            <p className="mt-[24px] text-[15.5px] leading-[25.19px] text-[rgba(250,246,239,0.8)]">
              Women with unidentified COMT variants go into pregnancy without a framework. When the flatness arrives, at
              16 weeks, or 6 weeks postpartum, they have no name for it. And without a name, they have no way to ask for
              help. So they don’t ask.
            </p>
            <p className="mt-[16px] text-[15.5px] leading-[25.19px] text-[rgba(250,246,239,0.8)]">
              The average Indian woman with peripartum depression waits 6 to 9 months before seeking help. Not because
              she doesn’t want it. Because she doesn’t know she needs it, or doesn’t know she deserves it, or doesn’t
              know how to explain what is wrong.
            </p>
            <p className="mt-[24px] text-[17px] font-medium leading-[25.5px]">
              <span className="text-[#FAF6EF]">A COMT result gives her all three: </span>
              <span className="text-[#F3D5B2]">the knowledge, the permission, and the language.</span>
            </p>
            <div className="mt-[28px]">
              <SheenButton href="#check" tone="light">
                Know my genetic vulnerability
              </SheenButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ==================== 14 · HOW IT WORKS ==================== */

const STEPS = [
  {
    n: '01',
    icon: Package,
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
    icon: Microscope,
    dark: false,
    title: 'The lab does the work',
    body: (
      <>
        Neotech World Lab, NABL accredited and ISO certified, using Illumina SNP genotyping. Reviewed by{' '}
        <strong className="font-medium text-[#2D2A24]">Dr. Varun Sharma, Ph.D</strong> before release.
      </>
    ),
  },
  {
    n: '03',
    icon: FileText,
    dark: true,
    title: 'Your report. And someone to explain every part of it.',
    body: (
      <>
        32-page personalised report in 7 days. Peripartum depression panel plus 4 more. Plus a{' '}
        <strong className="font-medium text-[#F3D5B2]">free 30-minute counselling session</strong> that walks through
        what your COMT result means for your specific pregnancy plans, and what practical steps to take.
      </>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section id="how" className="py-[72px] lg:py-[88px]">
      <Container>
        <div className="reveal max-w-[640px]">
          <Eyebrow icon={<Package className="size-[19px]" />}>How it works</Eyebrow>
          <h2 className="mt-[24px] text-[34px] font-semibold leading-[1.06] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            Order. Swab. Know. <span className="font-medium text-[#6B6358]">Three steps.</span>
          </h2>
        </div>

        <div className="relative mt-[56px]">
          <div
            className="pointer-events-none absolute left-[16%] right-[16%] top-[68px] hidden h-[2px] rounded-full lg:block"
            style={{
              background:
                'linear-gradient(90deg, rgba(31,26,20,0.05) 0%, rgba(31,26,20,0) 10%, #25B5AB 34%, #0E4D4B 50%, #25B5AB 66%, rgba(37,181,171,0) 90%, rgba(31,26,20,0.05) 100%)',
              boxShadow: '0 0 10px rgba(37,181,171,0.3)',
            }}
          />
          <div className="grid gap-[24px] lg:grid-cols-3">
            {STEPS.map(({ n, icon: Icon, dark, title, body }) => (
              <div
                key={n}
                className={`reveal relative overflow-hidden rounded-[28px] p-[32px] ${
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
                    className={`grid size-[56px] place-items-center rounded-[16px] ${
                      dark ? 'bg-white/15 text-[#FAF6EF]' : 'bg-[rgba(14,77,75,0.08)] text-[#0E4D4B]'
                    }`}
                  >
                    <Icon className="size-[26px]" />
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
