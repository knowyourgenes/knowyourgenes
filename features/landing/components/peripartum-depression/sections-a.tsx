import Image from 'next/image';
import type { ReactNode } from 'react';
import { Container, Eyebrow, FigIcon, GhostButton, GradientText, SheenButton, gTeal } from '../shared/ui';

/** Mint-gradient takeaway bar reused across the top sections. */
export function MintCallout({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div
      className="flex flex-col items-start gap-[20px] rounded-[28px] border border-[rgba(14,77,75,0.15)] px-[32px] py-[32px] sm:flex-row sm:items-center sm:px-[40px]"
      style={{
        background:
          'linear-gradient(90deg, rgba(228,241,236,1) 0%, rgba(210,232,223,0.7) 50%, rgba(228,241,236,0.6) 100%)',
      }}
    >
      <span className="shrink-0 text-[#0E4D4B]">{icon}</span>
      <p className="text-[20px] font-semibold leading-[1.3] tracking-[-0.012em] text-[#0E4D4B] lg:text-[24px] lg:leading-[31.2px]">
        {children}
      </p>
    </div>
  );
}

/* ============================ 1 · HERO ============================ */

export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden pt-[48px] pb-[80px] lg:pt-[64px]">
      {/* exact Figma decorative background - node 265:213 (peach blob · dashed molecule motif) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 hidden bg-[length:100%_100%] bg-no-repeat lg:block"
        style={{ backgroundImage: 'url(/landing/peripartum-depression/hero-bg.svg)' }}
      />
      {/* mobile: soft mint wash */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 lg:hidden"
        style={{
          background:
            'radial-gradient(54% 44% at 84% 4%, rgba(228,241,236,0.6) 0%, rgba(228,241,236,0) 60%), radial-gradient(48% 40% at 4% 18%, rgba(14,77,75,0.05) 0%, rgba(14,77,75,0) 60%)',
        }}
      />
      <Container>
        <div className="max-w-[860px]">
          <span className="inline-flex items-center gap-[10px] rounded-full bg-[#0E4D4B] py-[8px] pl-[12px] pr-[20px] shadow-[0_14px_32px_-8px_rgba(14,77,75,0.42)]">
            <span className="grid size-[28px] place-items-center rounded-full bg-[rgba(37,181,171,0.25)] text-[#FAF6EF]">
              <FigIcon src="/landing/icons/hero-badge.svg" className="size-[18px]" />
            </span>
            <span className="text-[13.5px] font-semibold leading-[20.25px] text-[#FAF6EF]">
              Peripartum Depression Genetic Risk Test · Saliva kit
            </span>
          </span>

          <h1 className="mt-[24px] text-[40px] font-medium leading-[1.04] tracking-[-0.035em] sm:text-[52px] lg:text-[66px] lg:leading-[68.64px]">
            <span className="block text-[#9A9384]">It’s not weakness.</span>
            <span className="block text-[#9A9384]">It’s not baby blues.</span>
            <span className="block font-semibold text-[#1F1A14]">
              It may be your <GradientText image={gTeal(164)}>COMT gene.</GradientText>
            </span>
          </h1>

          <p className="mt-[22px] max-w-[620px] text-[18px] font-semibold leading-[1.5] text-[#1F1A14] lg:text-[20px] lg:leading-[31px]">
            <span className="text-[#1F1A14]">50% of peripartum depression episodes begin before delivery,</span>
            <span className="font-semibold text-[#2D2A24]">
              {' '}
              not after. Your COMT gene controls your dopamine levels, your pain threshold, and your vulnerability to
              stress. Knowing your variant before pregnancy means you go in{' '}
            </span>
            <span className="font-semibold text-[#0E4D4B]">prepared. Not ambushed.</span>
          </p>

          <div className="mt-[28px] flex flex-wrap items-center gap-x-[6px] gap-y-[14px]">
            <SheenButton href="#check" tone="eden">
              Know my genetic vulnerability
            </SheenButton>
            <GhostButton href="#gene">What the COMT gene does</GhostButton>
          </div>

          <div className="mt-[26px] flex flex-wrap items-center gap-x-[22px] gap-y-[10px]">
            {['No needles', 'Results in 7 days', '30-min free counselling', '100% confidential'].map((t) => (
              <span key={t} className="inline-flex items-center gap-[6px] text-[13.5px] font-medium text-[#6B6358]">
                <FigIcon src="/landing/icons/check.svg" className="size-[16px] text-[#0E4D4B]" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* wide calm image band */}
        <div className="relative mt-[40px] min-h-[340px] overflow-hidden rounded-[34px] bg-[#E4F1EC] shadow-[0_40px_100px_rgba(20,45,40,0.15),0_12px_36px_rgba(20,45,40,0.1)] sm:min-h-0 sm:aspect-[1200/472]">
          <Image
            src="/landing/peripartum-depression/hero.png"
            alt="A woman sitting calmly at sunrise, looking toward the horizon"
            fill
            priority
            sizes="(max-width:1200px) 92vw, 1200px"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(14,77,75,0.62) 0%, rgba(14,77,75,0.28) 40%, rgba(14,77,75,0.05) 70%, rgba(14,77,75,0.2) 100%)',
            }}
          />
          {/* caption */}
          <p className="absolute inset-x-6 bottom-6 max-w-[560px] text-[19px] font-semibold leading-[1.3] tracking-[-0.01em] sm:bottom-8 sm:left-8 sm:text-[22px] lg:text-[24px] lg:leading-[31.2px]">
            <span className="text-[#FAF6EF]">You are not failing at motherhood before it has even begun. </span>
            <span className="text-[#F3D5B2]">You may have a COMT variant.</span>
          </p>
          {/* stat chip */}
          <div className="absolute right-6 top-6 hidden items-center gap-[12px] rounded-[16px] bg-white px-[16px] py-[12px] shadow-[0_14px_34px_rgba(20,45,40,0.2)] sm:flex">
            <span className="grid size-[40px] place-items-center rounded-[12px] bg-[#0E4D4B] text-[#FAF6EF]">
              <FigIcon src="/landing/icons/hero-stat-activity.svg" className="size-[21px]" />
            </span>
            <div className="leading-tight">
              <div className="font-hind text-[19px] font-semibold leading-[23.75px] text-[#1F1A14]">50%</div>
              <div className="text-[11px] text-[#6B6358]">begin before delivery</div>
            </div>
          </div>
        </div>

        {/* social-proof line */}
        <div className="reveal mt-[24px] flex flex-col items-start gap-[16px] rounded-[22px] border border-[rgba(31,26,20,0.08)] bg-white/55 px-[28px] py-[16px] backdrop-blur-[8px] sm:flex-row sm:items-center sm:gap-[20px]">
          <span className="inline-flex shrink-0 items-center gap-[8px]">
            <FigIcon src="/landing/icons/shield-check.svg" className="size-[19px] text-[#0E4D4B]" />
            <span className="text-[12.5px] font-bold uppercase tracking-[0.1em] text-[#0E4D4B]">
              Women’s Health DNA
            </span>
          </span>
          <p className="text-[15px] leading-[24.38px] text-[#2D2A24]">
            Part of the 5-panel report. Also covers PCOS, pregnancy risk, bone health and arthritis. Tested by{' '}
            <span className="font-semibold text-[#1F1A14]">NABL-accredited Neotech World Lab.</span>
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ===================== 2 · WHAT NOBODY TELLS YOU ===================== */

export function WhatNobodySection() {
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
        <div className="mx-auto flex max-w-[860px] flex-col gap-[30px]">
          <div className="reveal max-w-[760px]">
            <Eyebrow icon={<FigIcon src="/landing/icons/eb-whatnobody.svg" className="size-[19px]" />}>
              What nobody tells you
            </Eyebrow>
            <h2 className="mt-[18px] text-[34px] font-semibold leading-[1.08] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[48.4px]">
              The thing nobody tells Indian women about depression in pregnancy.
            </h2>
          </div>

          <p className="reveal max-w-[760px] text-[17px] leading-[27.63px] text-[#2D2A24]">
            When people say “post-pregnancy depression,” they picture a woman struggling after her baby arrives. But
            medical experts changed the name, from postpartum depression to{' '}
            <strong className="font-semibold text-[#1F1A14]">peripartum</strong> depression, because research showed
            something surprising:
          </p>

          {/* dark teal 50% stat card */}
          <div
            className="reveal relative overflow-hidden rounded-[32px] px-[32px] pb-[48px] pt-[44px] shadow-[0_40px_100px_rgba(20,45,40,0.15),0_12px_36px_rgba(20,45,40,0.1)] sm:px-[48px]"
            style={{ background: 'linear-gradient(178deg, #0E4D4B 0%, #0A3B39 100%)' }}
          >
            <div className="pointer-events-none absolute -right-10 -top-12 size-[224px] rounded-full bg-[rgba(37,181,171,0.2)] blur-[64px]" />
            <div className="relative flex flex-col items-start gap-[20px] sm:flex-row sm:items-center sm:gap-[28px]">
              <div className="font-hind text-[72px] font-semibold leading-none text-[#F3D5B2] sm:text-[96px]">50%</div>
              <p className="text-[22px] font-semibold leading-[1.25] tracking-[-0.015em] sm:text-[28px] sm:leading-[35px]">
                <span className="text-[#FAF6EF]">of peripartum depression episodes begin </span>
                <span className="text-[#F3D5B2]">before</span>
                <span className="text-[#FAF6EF]"> delivery. Not after. </span>
                <span className="text-[#F3D5B2]">Before.</span>
              </p>
            </div>
          </div>

          <div className="reveal flex max-w-[760px] flex-col gap-[22px]">
            <p className="text-[17px] leading-[27.63px] text-[#2D2A24]">
              The woman who feels flat, anxious, or unlike herself at 5 months pregnant is not ungrateful. She is not
              weak. She is not failing at motherhood before it has even begun. She may be experiencing a{' '}
              <strong className="font-semibold text-[#1F1A14]">genetically driven vulnerability</strong> that began long
              before her baby was born, and that her doctor, her family, and she herself had no framework to understand.
            </p>
            <p className="text-[17px] leading-[27.63px] text-[#2D2A24]">
              This test gives you that framework. Before your next pregnancy. So you can name what’s happening if it
              happens, and have people around you who are already prepared.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ====================== 3 · THE COMT GENE ====================== */

const CHAIN = [
  { icon: 'dna', title: 'Low COMT activity', sub: 'the enzyme works more slowly' },
  { icon: 'pp-droplet', title: 'Dopamine builds up', sub: 'it is cleared more gradually' },
  { icon: 'pp-bandage', title: 'Lower pain threshold', sub: 'you feel more, more intensely' },
];

export function ComtGeneSection() {
  return (
    <section id="gene" className="py-[72px] lg:py-[88px]">
      <Container>
        <div className="reveal max-w-[820px]">
          <Eyebrow icon={<FigIcon src="/landing/icons/eb-comt.svg" className="size-[19px]" />}>The COMT gene</Eyebrow>
          <h2 className="mt-[20px] text-[34px] font-semibold leading-[1.06] tracking-[-0.022em] text-[#1F1A14] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            What the COMT gene actually does.
          </h2>
          <p className="mt-[7px] text-[24px] font-medium leading-[1.08] tracking-[-0.032em] text-[#6B6358] lg:text-[30px]">
            And why it matters more during pregnancy.
          </p>
        </div>

        <div className="mt-[40px] grid items-start gap-[40px] lg:grid-cols-2">
          {/* left prose */}
          <div className="reveal flex flex-col gap-[18px]">
            <p className="text-[17px] leading-[27.63px] text-[#2D2A24]">
              COMT stands for <strong className="font-semibold text-[#1F1A14]">catechol-O-methyltransferase.</strong> It
              encodes an enzyme that does one critical job: it breaks down dopamine and estrogen byproducts in your
              body.
            </p>
            <p className="text-[17px] leading-[27.63px] text-[#2D2A24]">
              On a normal day, a COMT variant might make you feel things more intensely than others, more sensitive to
              pain, more reactive to stress, more affected by criticism.{' '}
              <strong className="font-semibold text-[#1F1A14]">These are not character flaws.</strong> They are the
              physiological consequences of a gene that processes dopamine more slowly.
            </p>
            <p className="text-[17px] leading-[27.63px] text-[#2D2A24]">
              During pregnancy, estrogen levels rise dramatically, and estrogen is broken down using the same COMT
              enzyme. If your COMT activity is already low, the added burden can push your dopamine regulation
              significantly out of balance, anxiety, emotional flatness, panic, sleep disruption, starting during
              pregnancy, not just after delivery.
            </p>
            <p className="text-[17px] font-medium leading-[27.63px] text-[#1F1A14]">
              This is not a personality issue. This is a metabolic process. And knowing your COMT variant changes how
              you and your doctor approach every pregnancy.
            </p>
          </div>

          {/* right mechanism chain */}
          <div className="reveal-r flex flex-col gap-[20px] rounded-[30px] border border-[rgba(31,26,20,0.08)] bg-white/75 px-[32px] pb-[32px] pt-[31px] shadow-[0_18px_50px_rgba(20,45,40,0.09),0_4px_16px_rgba(20,45,40,0.06)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0E4D4B]">
              What a COMT variant means, in plain language
            </div>
            <div className="flex flex-col gap-[6px]">
              {CHAIN.map(({ icon, title, sub }, i) => (
                <div key={title}>
                  <div className="flex items-center gap-[16px] rounded-[16px] bg-[#E4F1EC] p-[16px]">
                    <span className="grid size-[44px] shrink-0 place-items-center rounded-[12px] bg-[#0E4D4B] text-[#FAF6EF]">
                      <FigIcon src={`/landing/icons/${icon}.svg`} className="size-[22px]" />
                    </span>
                    <div>
                      <div className="text-[15.5px] font-semibold leading-[1.2] text-[#1F1A14]">{title}</div>
                      <div className="text-[13px] leading-[19.5px] text-[#6B6358]">{sub}</div>
                    </div>
                  </div>
                  {i < CHAIN.length && (
                    <div className="flex justify-center py-[2px]">
                      <FigIcon src="/landing/icons/arrow.svg" className="size-[18px] rotate-90 text-[#0E4D4B]/40" />
                    </div>
                  )}
                </div>
              ))}
              {/* inverted final row */}
              <div className="flex items-center gap-[16px] rounded-[16px] bg-[#0E4D4B] p-[16px]">
                <span className="grid size-[44px] shrink-0 place-items-center rounded-[12px] bg-white/15 text-[#FAF6EF]">
                  <FigIcon src="/landing/icons/meditation.svg" className="size-[22px]" />
                </span>
                <div>
                  <div className="text-[15.5px] font-semibold leading-[1.2] text-[#FAF6EF]">
                    Enhanced vulnerability to stress
                  </div>
                  <div className="text-[13px] leading-[19.5px] text-[rgba(250,246,239,0.7)]">
                    manageable, once you know
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="reveal mt-[16px]">
          <MintCallout icon={<FigIcon src="/landing/icons/leaf.svg" className="size-[38px]" />}>
            A woman with a COMT risk variant is not more fragile. She is more sensitive, and with the right support,
            that sensitivity becomes something she can work with, not something that works against her.
          </MintCallout>
        </div>
      </Container>
    </section>
  );
}

/* ====================== 4 · THE INDIA PROBLEM ====================== */

export function IndiaProblemSection() {
  return (
    <section className="py-[72px] lg:py-[88px]">
      <Container>
        <div className="mx-auto max-w-[920px]">
          <div className="reveal max-w-[760px]">
            <Eyebrow icon={<FigIcon src="/landing/icons/eb-india.svg" className="size-[19px]" />}>
              The India problem
            </Eyebrow>
            <h2 className="mt-[18px] text-[34px] font-semibold leading-[1.1] tracking-[-0.022em] sm:text-[40px] lg:text-[44px] lg:leading-[48.4px]">
              <span className="text-[#1F1A14]">In India, new mothers are expected to be joyful.</span>{' '}
              <span className="font-medium text-[#6B6358]">Always.</span>
            </h2>
          </div>

          <div className="reveal mt-[24px] flex max-w-[760px] flex-col gap-[23px]">
            <p className="text-[17px] leading-[27.63px] text-[#2D2A24]">
              There is no cultural script for a pregnant woman who feels nothing. Or a new mother who cannot feel happy
              about the baby she has waited for. The Indian family context, usually deeply involved in pregnancy and new
              motherhood, can make these feelings even harder to name, because naming them feels like betrayal.
            </p>
            <p className="text-[17px] leading-[27.63px] text-[#2D2A24]">
              So women stay silent. They smile. They say they are fine. They wait for it to pass. And sometimes it
              passes. And sometimes it doesn’t. And the window for early intervention closes quietly while everyone
              around them is focused on the baby.
            </p>
          </div>

          {/* stat highlight */}
          <div className="reveal mt-[24px] flex flex-col items-start gap-[16px] rounded-[26px] border border-[rgba(31,26,20,0.08)] bg-white/70 px-[32px] py-[32px] shadow-[0_4px_14px_rgba(20,45,40,0.05),0_1px_2px_rgba(20,45,40,0.04)] sm:flex-row sm:items-center sm:gap-[28px]">
            <div className="shrink-0 whitespace-nowrap font-hind text-[56px] font-semibold leading-none text-[#0E4D4B] sm:text-[64px]">
              3 to 6%
            </div>
            <p className="text-[16px] leading-[26px] text-[#2D2A24]">
              of women experience peripartum depression during or after pregnancy. It is{' '}
              <strong className="font-semibold text-[#1F1A14]">vastly under-diagnosed in India</strong>, not because it
              is rare, but because the cultural environment makes it nearly invisible.
            </p>
          </div>

          <div className="reveal mt-[24px]">
            <MintCallout icon={<FigIcon src="/landing/icons/eye.svg" className="size-[34px]" />}>
              Knowing your COMT variant before pregnancy doesn’t prevent depression. But it tells you, your partner, and
              your doctor to watch for it, so that when the window opens, someone is already looking.
            </MintCallout>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ===================== 5 · YOU ARE NOT ALONE ===================== */

const VOICES = [
  {
    initials: 'DP',
    badge: '#0E4D4B',
    blob: 'rgba(210,232,223,0.6)',
    name: 'Deepika Padukone',
    source: 'India’s mental health advocate',
    quote:
      'She spoke publicly about her depression at the height of her career, and founded The Live Love Laugh Foundation to break the silence around mental health in India. She has said: “Seek help. You are not alone.”',
    takeaway:
      'She changed the national conversation about what it means to feel something you cannot explain, and to have the courage to name it.',
  },
  {
    initials: 'CT',
    badge: '#15605D',
    blob: 'rgba(248,228,204,0.5)',
    name: 'Chrissy Teigen',
    source: 'Wrote openly in Glamour',
    quote:
      'On her post-partum depression: “I had everything I needed to be happy. And I was not happy. That was the most terrifying thing.” She hid her symptoms for months because she was ashamed, because she felt she had no right to feel that way.',
    takeaway: 'She did have a right. And so do you.',
  },
  {
    initials: 'A',
    badge: '#C76842',
    blob: 'rgba(210,232,223,0.6)',
    name: 'Adele',
    source: 'On postnatal depression',
    quote:
      '“I had really bad post-natal depression after I had my son. I thought I had to be all gloomy because I had a newborn. I didn’t talk to anyone about it.” The isolation, the silence, the assumption that it is supposed to feel this way.',
    takeaway: 'That is what the COMT variant does when it goes unnamed and unsupported.',
  },
];

export function NotAloneSection() {
  return (
    <section className="relative overflow-hidden py-[80px] lg:py-[100px]">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(248,228,204,0) 0%, rgba(248,228,204,0.35) 50%, rgba(248,228,204,0) 100%)',
        }}
      />
      <Container>
        <div className="reveal max-w-[760px]">
          <Eyebrow icon={<FigIcon src="/landing/icons/eb-heart.svg" className="size-[19px]" />}>
            You are not alone
          </Eyebrow>
          <h2 className="mt-[18px] text-[34px] font-semibold leading-[1.07] tracking-[-0.022em] sm:text-[40px] lg:text-[44px] lg:leading-[47.52px]">
            <span className="text-[#1F1A14]">The women who spoke.</span>{' '}
            <span className="font-medium text-[#6B6358]">So you wouldn’t have to suffer in silence.</span>
          </h2>
        </div>

        <div className="mt-[32px] grid gap-[24px] md:grid-cols-2 lg:grid-cols-3">
          {VOICES.map((v) => (
            <article
              key={v.name}
              className="reveal relative overflow-hidden rounded-[28px] border border-[rgba(31,26,20,0.08)] bg-white/75 p-[32px] shadow-[0_4px_14px_rgba(20,45,40,0.05),0_1px_2px_rgba(20,45,40,0.04)]"
            >
              <div
                className="pointer-events-none absolute -right-5 -top-5 size-[112px] rounded-full blur-[40px]"
                style={{ background: v.blob }}
              />
              <div className="relative flex items-center gap-[14px]">
                <span
                  className="grid size-[56px] shrink-0 place-items-center rounded-[16px] text-[15px] font-semibold text-[#FAF6EF]"
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

        <div className="reveal mt-[24px]">
          <MintCallout icon={<FigIcon src="/landing/icons/pp-hand-heart.svg" className="size-[40px]" />}>
            These women spoke so that the next woman doesn’t have to figure it out alone. You don’t have to be ambushed
            by something your genes already knew was coming.
          </MintCallout>
        </div>
      </Container>
    </section>
  );
}
