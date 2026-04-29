import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';

const COLS = [
  {
    title: 'Tests',
    links: [
      { href: '/tests?category=wellness', label: 'Wellness' },
      { href: '/tests?category=cancer', label: 'Cancer risk' },
      { href: '/tests?category=cardiac', label: 'Cardiac' },
      { href: '/tests?category=reproductive', label: 'Reproductive' },
      { href: '/tests?category=drug-sensitivity', label: 'Drug sensitivity' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/careers', label: 'Careers' },
      { href: '/press', label: 'Press' },
      { href: '/blog', label: 'Blog' },
      { href: '/partners', label: 'For partners' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '/help', label: 'Help center' },
      { href: '/contact', label: 'Contact us' },
      { href: '/faq', label: 'FAQ' },
      { href: '/how-it-works', label: 'How it works' },
      { href: '/counselling', label: 'Counselling' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy policy' },
      { href: '/terms', label: 'Terms of service' },
      { href: '/refunds', label: 'Refund policy' },
      { href: '/consent', label: 'Genetic testing consent' },
    ],
  },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t bg-muted/20">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          {/* Brand block */}
          <div>
            <Link href="/" className="flex items-center">
              <Image
                src="/kyglogo.webp"
                alt="Know Your Genes"
                width={160}
                height={40}
                className="h-10 w-auto object-contain"
                style={{ width: 'auto' }}
              />
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              DNA testing, simplified. At-home collection across Delhi NCR, NABL-certified labs, plain-language reports.
            </p>

            <div className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="mailto:care@kyg.in" className="inline-flex items-center gap-2 hover:text-foreground">
                <Mail className="h-4 w-4" /> care@kyg.in
              </a>
              <a href="tel:+911140000000" className="inline-flex items-center gap-2 hover:text-foreground">
                <Phone className="h-4 w-4" /> +91 11 4000 0000
              </a>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
              <a
                href="https://instagram.com/knowyourgenes"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border px-3 py-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                Instagram
              </a>
              <a
                href="https://twitter.com/knowyourgenes"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border px-3 py-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com/company/knowyourgenes"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border px-3 py-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Link columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground">{col.title}</h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted-foreground transition hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {year} Know Your Genes Pvt. Ltd. All rights reserved.</p>
          <p>
            Serving Delhi NCR · <span className="font-medium text-foreground/80">CDSCO licensed</span> · NABL-accredited
            partner labs
          </p>
        </div>
      </div>
    </footer>
  );
}
