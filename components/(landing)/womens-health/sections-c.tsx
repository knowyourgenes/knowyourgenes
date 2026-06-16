import Image from 'next/image';
import { Container, Eyebrow, FigIcon, GradientText, SheenButton, gCopper } from '../_shared/ui';
import { FileText, Microscope, Package, Quote } from '../_shared/icons';

/* ==================== 8 · TESTIMONIALS ==================== */

const TESTIMONIALS = [
  {
    avatar: '/landing/womens-health/avatar-ananya.png',
    name: 'Ananya K., 27',
    role: 'Delhi · Software engineer',
    quote: (
      <>
        “I was told I ‘might have’ PCOS at 22. Then again at 25. Then 27. Five years of{' '}
        <strong className="font-medium text-[#1F1A14]">might</strong>. My KYG result showed elevated THADA risk. For the
        first time, my gynaecologist and I had something concrete, not a guess. A genetic fact.”
      </>
    ),
  },
  {
    avatar: '/landing/womens-health/avatar-shreya.png',
    name: 'Shreya M., 28',
    role: 'Mumbai · Teacher',
    quote:
      '“I’ve had facial hair since I was 19. I thought it was just me. I never connected it to my weight or my cycle. The test connected all of it. THADA variant. Elevated risk. The counsellor explained the androgen link to every symptom I’d managed separately for 8 years. I wish I’d done this at 19.”',
  },
  {
    avatar: '/landing/womens-health/avatar-pooja.png',
    name: 'Pooja R., 31',
    role: 'Pune · HR professional',
    quote:
      '“We’d been trying for a baby for a year. My PCOS result came back average, not high. But it was the pregnancy panel that changed everything. My doctor had a new direction. Even the panels that aren’t your biggest problem end up being relevant.”',
  },
];

export function TestimonialsSection() {
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
        <div className="reveal max-w-[760px]">
          <Eyebrow icon={<FigIcon src="/landing/_icons/eb-testimonials.svg" className="size-[19px]" />}>In their words</Eyebrow>
          <h2 className="mt-[20px] text-[34px] font-semibold leading-[1.06] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            What women with PCOS discovered.
          </h2>
        </div>

        <div className="mt-[48px] grid gap-[24px] md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="reveal flex flex-col rounded-[28px] border border-[rgba(31,26,20,0.08)] bg-white/80 p-[32px] shadow-[0_4px_14px_rgba(45,32,18,0.04),0_1px_2px_rgba(45,32,18,0.04)]"
            >
              <Quote className="size-[40px] text-[#0E4D4B]/30" />
              <blockquote className="mt-[16px] grow text-[15px] leading-[24.38px] text-[#2D2A24]">{t.quote}</blockquote>
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

/* ==================== 9 · AT EVERY AGE ==================== */

const AGES = [
  {
    age: '18 to 24',
    title: 'First signs, first confusion',
    copper: false,
    body: (
      <>
        Your cycle has never been regular. Your skin is oilier. Weight goes on easily. “Normal teenage hormones,” they
        say. It may not be. Knowing your variant at 20 gives you a{' '}
        <strong className="font-medium text-[#2D2A24]">decade head start.</strong>
      </>
    ),
  },
  {
    age: '24 to 30',
    title: 'Pre-marriage, pre-conception',
    copper: false,
    body: (
      <>
        When PCOS diagnoses peak in India. When “will I be able to get pregnant?” first gets loud. Knowing your risk
        before that conversation means you and your doctor are{' '}
        <strong className="font-medium text-[#2D2A24]">prepared, not reactive.</strong>
      </>
    ),
  },
  {
    age: '30 to 38',
    title: 'Trying, or wondering why it’s slow',
    copper: false,
    body: (
      <>
        PCOS is a leading cause of female infertility. If conception is taking longer than expected, a genetic risk flag
        changes your fertility conversation.{' '}
        <strong className="font-medium text-[#2D2A24]">Earlier intervention. Real answers.</strong>
      </>
    ),
  },
  {
    age: '38 and up',
    title: 'Managing long-term consequences',
    copper: true,
    body: (
      <>
        Unmanaged PCOS raises type 2 diabetes risk significantly. Knowing your genetic profile helps your doctor
        understand the <strong className="font-medium text-[#2D2A24]">long-term monitoring</strong> you need, for your
        metabolic health, not just your cycle.
      </>
    ),
  },
];

export function AtEveryAgeSection() {
  return (
    <section className="py-[72px] lg:py-[88px]">
      <Container>
        <div className="reveal max-w-[760px]">
          <Eyebrow icon={<FigIcon src="/landing/_icons/eb-ateveryage.svg" className="size-[19px]" />}>At every age</Eyebrow>
          <h2 className="mt-[20px] text-[34px] font-semibold leading-[1.07] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            PCOS doesn’t start at one age.{' '}
            <span className="font-medium text-[#6B6358]">And knowing your risk doesn’t either.</span>
          </h2>
        </div>

        <div className="relative mt-[56px]">
          {/* timeline glow line */}
          <div
            className="pointer-events-none absolute left-0 right-0 top-[11px] hidden h-[2px] rounded-full lg:block"
            style={{
              background:
                'linear-gradient(90deg, rgba(31,26,20,0.05) 0%, rgba(31,26,20,0) 10%, #25B5AB 34%, #0E4D4B 50%, #25B5AB 66%, rgba(37,181,171,0) 90%, rgba(31,26,20,0.05) 100%)',
              boxShadow: '0 0 10px rgba(37,181,171,0.3)',
            }}
          />
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

/* ==================== 10 · FOMO ==================== */

export function FomoSection() {
  return (
    <section className="py-[40px] lg:py-[60px]">
      <Container>
        <div className="reveal relative overflow-hidden rounded-[36px] bg-[#1A2220]">
          {/* photo (desktop right half) */}
          <div className="absolute right-0 top-0 hidden h-full w-[55%] md:block">
            <Image
              src="/landing/womens-health/fomo.png"
              alt="A woman looking thoughtfully out of a window"
              fill
              sizes="(max-width:1024px) 0px, 660px"
              className="object-cover opacity-90"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, #1A2220 0%, rgba(26,34,32,0.92) 30%, rgba(26,34,32,0.55) 62%, rgba(26,34,32,0.2) 100%)',
              }}
            />
          </div>

          <div className="relative max-w-[640px] p-8 sm:p-12 lg:p-[64px]">
            <Eyebrow tone="dark" icon={<FigIcon src="/landing/_icons/eb-fomo.svg" className="size-[19px]" />}>
              The cost of not knowing
            </Eyebrow>
            <h2 className="mt-[16px] text-[32px] font-semibold leading-[1.1] tracking-[-0.022em] text-[#FAF6EF] sm:text-[38px] lg:text-[42px] lg:leading-[46.2px]">
              Every year of guessing is a year of{' '}
              <GradientText image={gCopper(169)}>managing blindly.</GradientText>
            </h2>
            <p className="mt-[24px] text-[16px] leading-[26px] text-[rgba(250,246,239,0.8)]">
              PCOS doesn’t pause while you figure it out. The hormonal patterns are already at work. The insulin
              resistance is already building. The long-term risks are already accumulating quietly in the background.
            </p>
            <p className="mt-[16px] text-[16px] leading-[26px] text-[rgba(250,246,239,0.8)]">
              Women who know their risk at 23 can make decisions at 23. Those who find out at 31, often when pregnancy
              isn’t happening, wish they’d known earlier.
            </p>
            <p className="mt-[24px] text-[17px] font-medium leading-[25.5px] text-[#FAF6EF]">
              The test costs the same today as it will in three years.{' '}
              <span className="text-[#F3D5B2]">Your 20s are not replaceable.</span>
            </p>
            <div className="mt-[28px]">
              <SheenButton href="#check" tone="light">
                Check my PCOS genetic risk
              </SheenButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ==================== 11 · HOW IT WORKS ==================== */

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
        Neotech World Lab, NABL accredited and ISO certified, using Illumina SNP genotyping. Every report reviewed by{' '}
        <strong className="font-medium text-[#2D2A24]">Dr. Varun Sharma, Ph.D</strong> before release.
      </>
    ),
  },
  {
    n: '03',
    icon: FileText,
    dark: true,
    title: 'Your report. Your counsellor. Your clarity.',
    body: (
      <>
        32-page report in 7 days. PCOS panel plus 4 more, rated Good, Average or Poor. Plus a{' '}
        <strong className="font-medium text-[#F3D5B2]">free 30-minute counselling session</strong>, plain language,
        clear next steps.
      </>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section id="how" className="py-[72px] lg:py-[88px]">
      <Container>
        <div className="reveal max-w-[640px]">
          <Eyebrow icon={<FigIcon src="/landing/_icons/eb-howitworks.svg" className="size-[19px]" />}>How it works</Eyebrow>
          <h2 className="mt-[24px] text-[34px] font-semibold leading-[1.06] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            Order. Swab. Know. <span className="font-medium text-[#6B6358]">Three steps.</span>
          </h2>
        </div>

        <div className="relative mt-[56px]">
          {/* connector */}
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
                    ? 'bg-[#0E4D4B] shadow-[0_18px_50px_rgba(45,32,18,0.08),0_4px_16px_rgba(45,32,18,0.06)]'
                    : 'border border-[rgba(31,26,20,0.08)] bg-white/75 shadow-[0_4px_14px_rgba(45,32,18,0.04),0_1px_2px_rgba(45,32,18,0.04)]'
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
