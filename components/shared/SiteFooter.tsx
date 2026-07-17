'use client';

import Link from 'next/link';
import { CHROME_VARS } from '@/features/auth/server/tokens';
import { Container } from './Container';
import { KygLogo } from './Logo';

// Brand glyphs kept inline - the project's lucide-react build ships no social icons.
const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/knowyourgenes_?igsh=MWhpb3RzMzlwNzg2MQ==',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/knowyourgenes',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
        <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.64h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9V9Z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@knowyourgenes_official?si=za8meaFEH7PvYP9T',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
        <path d="M23 12s0-3.2-.41-4.73a2.4 2.4 0 0 0-1.69-1.7C19.36 5.15 12 5.15 12 5.15s-7.36 0-8.9.42a2.4 2.4 0 0 0-1.69 1.7C1 8.8 1 12 1 12s0 3.2.41 4.73a2.4 2.4 0 0 0 1.69 1.7c1.54.42 8.9.42 8.9.42s7.36 0 8.9-.42a2.4 2.4 0 0 0 1.69-1.7C23 15.2 23 12 23 12ZM9.75 15.02v-6.04L15.5 12l-5.75 3.02Z" />
      </svg>
    ),
  },
];

// Links point at homepage sections (/#anchor) so they resolve from any page,
// and at the real legal routes where those pages exist.
const FOOTER_COLS = [
  {
    title: 'Tests',
    // The four wellness test pages that exist today (see lib/nav-data.ts).
    links: [
      { label: "Men's Health", href: '/categories/wellness/mens-health' },
      { label: "Women's Health", href: '/categories/wellness/womens-health' },
      { label: 'Ancestry', href: '/categories/wellness/ancestry' },
      { label: 'My Wellness', href: '/categories/wellness/my-wellness' },
    ],
  },
  {
    title: "Women's Health",
    links: [
      { label: "Women's Health", href: '/womens-health' },
      { label: 'Pregnancy Loss', href: '/pregnancy-loss' },
      { label: 'Peripartum Depression', href: '/peripartum-depression' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Refund Policy', href: '/refunds' },
      { label: 'Shipping & Delivery', href: '/shipping' },
      { label: 'Testing Consent', href: '/consent' },
    ],
  },
];

/** Shared KYG dark footer. Self-contained (tokens applied inline on <footer>). */
export default function SiteFooter() {
  return (
    <footer
      style={CHROME_VARS}
      className="relative overflow-hidden bg-(--dark-1) text-[rgba(250,246,239,.7)] pt-[88px] pb-[28px] before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(40%_60%_at_90%_0%,rgba(37,181,171,.12),transparent_60%)]"
    >
      <Container className="relative z-[1]">
        <div className="flex flex-wrap justify-between gap-x-[48px] gap-y-[48px] mb-[64px]">
          {/* Brand */}
          <div className="max-w-[300px] max-[640px]:max-w-none">
            <div className="mb-[22px]">
              <KygLogo tone="light" className="h-[42px]! w-auto" />
            </div>
            <p className="text-[14.5px] leading-[1.6] text-[rgba(250,246,239,.7)] mb-[24px]">
              A genomics brand built for Indian biology. Your health deserves specificity.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-[12px]">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center w-[38px] h-[38px] rounded-full border border-white/[0.12] bg-white/[0.04] text-[rgba(250,246,239,.72)] transition-[background,color,border-color] duration-300 ease-(--e-out) hover:bg-(--peach-2)! hover:text-(--ink-1) hover:border-transparent"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] tracking-[0.22em] uppercase font-semibold text-(--peach-2) mb-[18px]">
                {col.title}
              </div>
              <ul className="flex flex-col gap-[12px]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-[rgba(250,246,239,.72)] transition-colors duration-300 ease-(--e-out) hover:text-(--teal-light)"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter - its own section */}
          <div className="max-w-[300px] max-[640px]:max-w-none">
            <div className="text-[11px] tracking-[0.22em] uppercase font-semibold text-(--peach-2) mb-[18px]">
              Newsletter
            </div>
            <p className="text-[14px] leading-[1.6] text-[rgba(250,246,239,.7)] mb-[16px] max-w-[280px]">
              Genetics, health and the occasional offer - straight to your inbox.
            </p>
            <form className="flex flex-col gap-[10px] max-w-[300px]" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email"
                className="w-full bg-white/[0.04] border border-white/[0.12] rounded-full outline-none text-white py-[11px] px-[18px] text-[13.5px] placeholder:text-[rgba(250,246,239,.5)] transition-colors focus:border-(--peach-2)"
              />
              <button
                type="submit"
                className="py-[11px] px-[18px] bg-(--peach-2)! text-(--ink-1) rounded-full font-semibold text-[13px] cursor-pointer transition-[background,color] duration-[400ms] ease-(--e-out) hover:bg-(--teal-light)! hover:text-white"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-[28px] border-t border-white/10 text-[13px] text-center">
          © 2026 KnowYourGenes. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
