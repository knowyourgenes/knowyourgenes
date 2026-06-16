'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from './icons';

export type NavLink = { label: string; href: string };

function Wordmark() {
  return (
    <a
      href="#top"
      aria-label="KnowYourGenes home"
      className="block h-9 w-[82px] shrink-0 bg-contain bg-left bg-no-repeat text-[#0E4D4B]"
      style={{ backgroundImage: 'url(/landing/kyg-logo.svg)' }}
    />
  );
}

function CheckCta({
  label,
  tone,
  onClick,
  className = '',
}: {
  label: string;
  tone: 'dark' | 'eden';
  onClick?: () => void;
  className?: string;
}) {
  const bg =
    tone === 'eden'
      ? 'bg-[#0E4D4B] shadow-[0_10px_28px_rgba(14,77,75,0.25)]'
      : 'bg-[#1F1A14] shadow-[0_10px_28px_rgba(31,26,20,0.18)]';
  return (
    <a
      href="#check"
      onClick={onClick}
      className={`sheen group relative inline-flex items-center gap-[6px] overflow-hidden rounded-full ${bg} py-[9.5px] pl-[20px] pr-[16px] text-[13.5px] font-semibold text-[#FAF6EF] transition-transform duration-200 hover:-translate-y-[1px] ${className}`}
    >
      <span className="relative z-[1] inline-flex items-center gap-[6px]">
        {label}
        <ArrowRight className="size-[18px]" />
      </span>
    </a>
  );
}

export default function LandingNav({
  links,
  cta = { label: 'Check my risk', tone: 'dark' },
}: {
  links: NavLink[];
  cta?: { label: string; tone?: 'dark' | 'eden' };
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-[22px] transition-shadow ${
          scrolled
            ? 'border-[rgba(31,26,20,0.08)] bg-[rgba(250,246,239,0.92)] shadow-[0_8px_30px_rgba(45,32,18,0.08)]'
            : 'border-[rgba(31,26,20,0.06)] bg-[rgba(250,246,239,0.85)] shadow-[0_8px_30px_rgba(45,32,18,0.05)]'
        }`}
      >
        <div className="mx-auto flex h-[78px] w-full max-w-[1440px] items-center justify-between px-6 sm:px-10 md:px-16 lg:px-[120px]">
          <Wordmark />

          <nav className="hidden items-center gap-[4px] lg:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-[18px] py-[10px] text-[14.5px] font-medium text-[#2D2A24] transition-colors hover:bg-[rgba(14,77,75,0.06)] hover:text-[#0E4D4B]"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-[10px]">
            <CheckCta label={cta.label} tone={cta.tone ?? 'dark'} className="hidden sm:inline-flex" />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="grid size-[42px] place-items-center rounded-[12px] border border-[rgba(31,26,20,0.10)] bg-white/60 text-[#1F1A14] lg:hidden"
            >
              <span className="relative block h-[14px] w-[18px]">
                <span
                  className={`absolute left-0 block h-[2px] w-full rounded bg-current transition-all duration-300 ${
                    open ? 'top-[6px] rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 top-[6px] block h-[2px] w-full rounded bg-current transition-opacity duration-200 ${
                    open ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[2px] w-full rounded bg-current transition-all duration-300 ${
                    open ? 'top-[6px] -rotate-45' : 'top-[12px]'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer — rendered OUTSIDE the backdrop-blurred header so the
          blur’s containing block doesn’t clip these fixed children. */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-[rgba(26,34,32,0.45)] backdrop-blur-[2px]"
          />
          <nav className="absolute right-0 top-0 flex h-full w-[min(86vw,360px)] flex-col gap-[6px] overflow-y-auto bg-[#FAF6EF] px-6 pb-10 pt-[26px] shadow-[-20px_0_60px_rgba(26,34,32,0.2)]">
            <div className="mb-4 flex items-center justify-between">
              <Wordmark />
            </div>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-[14px] px-[16px] py-[14px] text-[16px] font-medium text-[#1F1A14] transition-colors hover:bg-[rgba(14,77,75,0.06)]"
              >
                {l.label}
              </a>
            ))}
            <CheckCta
              label={cta.label}
              tone={cta.tone ?? 'dark'}
              onClick={() => setOpen(false)}
              className="mt-4 w-full justify-center !py-[14px] text-[15px]"
            />
          </nav>
        </div>
      )}
    </>
  );
}
