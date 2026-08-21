import type { ReactNode } from 'react';
import { Container } from '@/components/shared/Container';
import { EYEBROW, EYEBROW_DASH_TEAL, GRAD_TEXT, HEADING, LEAD, SECTION_PY } from './styles';

/**
 * WhatIsKyg - "Think of it as your body's instruction manual."
 *
 * Static rebuild of the legacy "body silhouette surrounded by cards" section:
 * the wireframe figure sits in the CENTRE, flanked by info cards on both sides
 * (three per side). Collapses to a single column on phones. Pure Tailwind.
 */

type Card = { name: string; icon: ReactNode };

const iconSvg = (children: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-[24px] w-[24px] max-[880px]:h-[20px] max-[880px]:w-[20px]"
  >
    {children}
  </svg>
);

const CARDS: Card[] = [
  {
    name: 'Nutrition',
    icon: iconSvg(
      <path d="M3 6c0-1.7 1.3-3 3-3h12c1.7 0 3 1.3 3 3 0 1.7-1.3 3-3 3H6c-1.7 0-3-1.3-3-3zM5 9l1.5 12h11L19 9" />
    ),
  },
  {
    name: 'Fitness',
    icon: iconSvg(
      <>
        <path d="M6.5 6.5l11 11" />
        <rect x="14" y="2" width="6" height="6" rx="1" />
        <rect x="4" y="16" width="6" height="6" rx="1" />
      </>
    ),
  },
  {
    name: 'Lifestyle',
    icon: iconSvg(
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
    ),
  },
  {
    name: 'Metabolism',
    icon: iconSvg(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </>
    ),
  },
  {
    name: 'Preventive Care',
    icon: iconSvg(
      <>
        <path d="M12 2L4 7v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V7l-8-5z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  { name: 'Recovery', icon: iconSvg(<path d="M3 12h4l3-9 4 18 3-9h4" />) },
];

const leftCards = CARDS.slice(0, 3);
const rightCards = CARDS.slice(3);

const cardClass =
  'flex items-center gap-[14px] rounded-sm border border-white/60 bg-white/[0.82] py-[16px] pr-[26px] pl-[16px] shadow-[0_18px_48px_rgba(45,32,18,0.12),0_4px_12px_rgba(45,32,18,0.06)] backdrop-blur-[14px] transition-[box-shadow,border-color] duration-500 hover:border-[rgba(37,181,171,0.4)] hover:shadow-[0_28px_64px_rgba(45,32,18,0.18),0_6px_16px_rgba(45,32,18,0.08)] max-[880px]:gap-[10px] max-[880px]:py-[12px] max-[880px]:pr-[14px] max-[880px]:pl-[12px]';

function CardItem({ card }: { card: Card }) {
  return (
    <div className={cardClass}>
      <span className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-sm bg-[linear-gradient(135deg,var(--c-peach)_0%,var(--c-peach-2)_100%)] text-(--c-teal) max-[880px]:h-[40px] max-[880px]:w-[40px] max-[880px]:rounded-sm">
        {card.icon}
      </span>
      <span className="text-[17px] font-semibold tracking-[-0.008em] text-(--ink-1) max-[880px]:text-[14px] max-[880px]:leading-[1.2]">
        {card.name}
      </span>
    </div>
  );
}

export default function WhatIsKyg() {
  return (
    <section id="what" className={`relative ${SECTION_PY}`}>
      <Container>
        {/* Section head (centered) - gaps match WhyKyg's rhythm */}
        <div className="mx-auto mb-[clamp(36px,4vw,56px)] max-w-[760px] text-center">
          <div className={`justify-center ${EYEBROW} text-(--c-teal)`}>
            <span className={EYEBROW_DASH_TEAL} />
            What is KYG?
          </div>
          <h2 className={`mt-[16px] ${HEADING} text-(--ink-1)`}>
            Think of it as your body&apos;s <span className={GRAD_TEXT}>instruction manual.</span>
          </h2>
          <p className={`mx-auto mt-[18px] max-w-[640px] ${LEAD} text-(--ink-2)`}>
            KYG combines genetic insights with wellness intelligence to help you understand how your body naturally
            responds.
          </p>
        </div>

        {/* Stage: cards | silhouette (centre) | cards */}
        <div className="mx-auto grid max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-[clamp(24px,3vw,48px)] max-[880px]:grid-cols-2 max-[880px]:gap-[16px] max-[560px]:grid-cols-1">
          {/* Left cards */}
          <div className="flex flex-col gap-[16px] max-[880px]:order-2 max-[880px]:gap-[10px]">
            {leftCards.map((card) => (
              <CardItem key={card.name} card={card} />
            ))}
          </div>

          {/* Silhouette - centre */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kyg/c347b61299d8.png"
            alt="Wireframe human body figure showing the genetic data points across the body"
            className="aspect-[32/62] h-[clamp(400px,40vw,560px)] w-auto justify-self-center object-contain [filter:drop-shadow(0_18px_28px_rgba(14,77,75,0.18))_drop-shadow(0_6px_12px_rgba(45,32,18,0.1))] max-[880px]:order-1 max-[880px]:col-span-2 max-[880px]:h-[360px] max-[560px]:col-span-1 max-[560px]:h-[300px]"
          />

          {/* Right cards */}
          <div className="flex flex-col gap-[16px] max-[880px]:order-3 max-[880px]:gap-[10px]">
            {rightCards.map((card) => (
              <CardItem key={card.name} card={card} />
            ))}
          </div>
        </div>

        {/* Bottom tag */}
        <div className="mt-[clamp(28px,3vw,40px)] text-center">
          <div className="inline-flex items-center gap-[12px] rounded-sm bg-(--ink-1) py-[14px] pr-[22px] pl-[14px] text-[15px] font-semibold tracking-[-0.005em] text-(--c-cream) max-[360px]:text-[13px]">
            <span className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-(--c-teal-light) text-[12px] text-white">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
            Health Without Guesswork.
          </div>
        </div>
      </Container>
    </section>
  );
}
