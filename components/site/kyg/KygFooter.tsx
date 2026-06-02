'use client';

import { CHROME_VARS } from './tokens';
import { KygLogo } from './logo';

const FOOTER_COLS = [
  {
    title: 'Wellness Package',
    links: [
      { label: 'My Diet', href: '#wellness' },
      { label: 'My Weight', href: '#wellness' },
      { label: 'My Fitness', href: '#wellness' },
      { label: 'My Detox', href: '#wellness' },
      { label: 'Senior Care', href: '#senior' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { label: 'Health Decoded', href: '#decoded' },
      { label: 'The Science', href: '#what' },
      { label: 'FAQs', href: '#' },
      { label: 'Help Center', href: '#' },
    ],
  },
  {
    title: 'Care',
    links: [
      { label: 'How It Works', href: '#how' },
      { label: 'GENEous Care', href: '#care' },
      { label: 'Sample Report', href: '#report' },
      { label: 'Privacy & Trust', href: '#privacy' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
];

/** Shared KYG dark footer. Self-contained (tokens applied inline on <footer>). */
export default function KygFooter() {
  return (
    <footer
      style={CHROME_VARS}
      className="relative overflow-hidden bg-[var(--dark-1)] text-[rgba(250,246,239,.7)] pt-[88px] pb-[36px] before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(40%_60%_at_90%_0%,rgba(37,181,171,.12),transparent_60%)]"
    >
      <div className="relative z-[1] w-full max-w-[1280px] mx-auto px-[var(--gutter)]">
        <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-[48px] mb-[64px] max-[1180px]:grid-cols-2 max-[640px]:grid-cols-1">
          {/* Brand */}
          <div className="max-w-[360px] max-[1180px]:col-span-2 max-[640px]:col-span-1 max-[1180px]:max-w-none">
            <div className="mb-[22px]">
              <KygLogo tone="light" className="h-[42px]! w-auto" />
            </div>
            <p className="text-[14.5px] leading-[1.6] text-[rgba(250,246,239,.7)] mb-[22px]">
              A genomics brand built for Indian biology. Your health deserves specificity.
            </p>
            <form className="flex border border-white/[0.12] rounded-full p-[4px] bg-white/[0.04] max-w-[360px]" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email"
                className="flex-1 min-w-0 bg-transparent border-0 outline-none text-white py-[10px] px-[16px] text-[13.5px] placeholder:text-[rgba(250,246,239,.5)]"
              />
              <button type="submit" className="shrink-0 py-[9px] px-[18px] bg-[var(--peach-2)]! text-[var(--ink-1)] rounded-full font-semibold text-[13px] cursor-pointer transition-[background,color] duration-[400ms] ease-[var(--e-out)] hover:bg-[var(--teal-light)]! hover:text-white">
                Subscribe
              </button>
            </form>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] tracking-[0.22em] uppercase font-semibold text-[var(--peach-2)] mb-[18px]">{col.title}</div>
              <ul className="flex flex-col gap-[12px]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[14px] text-[rgba(250,246,239,.72)] transition-colors duration-300 ease-[var(--e-out)] hover:text-[var(--teal-light)]">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-[28px] border-t border-white/10 text-[13px] flex-wrap gap-[14px]">
          <div>© 2026 KnowYourGenes. All rights reserved.</div>
          <div className="font-semibold text-[var(--cream)]">
            KYG <span className="text-[var(--peach-2)] mx-[4px]">·</span> Health Without Guesswork.
          </div>
          <div className="flex gap-[18px]">
            <a href="#" aria-label="Instagram" className="transition-colors duration-300 hover:text-[var(--cream)]">Instagram</a>
            <a href="#" aria-label="LinkedIn" className="transition-colors duration-300 hover:text-[var(--cream)]">LinkedIn</a>
            <a href="#" aria-label="YouTube" className="transition-colors duration-300 hover:text-[var(--cream)]">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
