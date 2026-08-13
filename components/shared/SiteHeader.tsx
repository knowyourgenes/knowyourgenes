'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import UserNav from '@/features/admin/components/UserNav';
import { CHROME_VARS } from '@/features/auth/server/tokens';
import { NAV_LINKS, NAV_MENUS } from '@/lib/nav-data';
import { Container } from './Container';
import { KygLogo } from './Logo';

// The home page keeps the nav order/checkout CTAs hidden for now ("CTA-HIDDEN"
// in the original). Flip to true to show the auth-aware Order Kit / Sign in CTA.
const SHOW_NAV_CTA = false;

const ArrowRight = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);
const ArrowUpRight = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

const NAV_LINK =
  'inline-flex items-center gap-[6px] py-[11px] px-[18px] font-medium text-[14.5px] text-(--ink-1) rounded-full ' +
  'tracking-[-0.005em] transition-[color,background] duration-200 ease-(--e-out) hover:text-(--teal) hover:bg-[rgba(14,77,75,.07)] cursor-pointer';

const BTN_BASE =
  'inline-flex items-center justify-center gap-[10px] rounded-full font-semibold leading-none border-[1.5px] border-transparent cursor-pointer ' +
  'transition-[transform,background,box-shadow,color] duration-300 ease-(--e-out) py-[11px] px-[20px] text-[13.5px] [&_svg]:w-4 [&_svg]:h-4';

/**
 * Shared KYG warm-modern site header (mega-menu nav). Self-contained: design
 * tokens are applied inline on the <header> via CHROME_VARS, so it renders
 * identically in any route scope. Used on every public user page.
 *
 * `overlay` makes the bar `fixed` (floats over the page, reserves no space) -
 * used on the home page so it sits over the full-bleed hero. Every other page
 * leaves it `sticky` (reserves its own row) so content is never hidden beneath.
 */
export default function SiteHeader({ overlay = false }: { overlay?: boolean } = {}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;

  const [scrolled, setScrolled] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const linksRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (linksRef.current && !linksRef.current.contains(e.target as Node)) setOpenKey(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenKey(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const open = (k: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenKey(k);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenKey(null), 140);
  };

  return (
    <>
      <header
        style={CHROME_VARS}
        className={cn(
          'top-0 inset-x-0 z-[1000] backdrop-blur-[22px] backdrop-saturate-[1.4] border-b transition-[background,border-color] duration-[400ms] ease-(--e-out)',
          overlay ? 'fixed' : 'sticky',
          scrolled ? 'bg-[rgba(250,246,239,.88)] border-(--ink-line)' : 'bg-[rgba(250,246,239,.65)] border-transparent'
        )}
      >
        <Container className="flex items-center justify-between h-16 gap-[32px]">
          <Link href="/" className="flex items-center shrink-0" aria-label="KYG, Know Your Genes">
            <KygLogo tone="dark" className="h-9! w-auto" />
          </Link>

          {/* Desktop mega-menu nav */}
          <nav ref={linksRef} className="flex items-center gap-[2px] ml-auto max-[980px]:hidden" aria-label="Main">
            {NAV_MENUS.map((menu) => {
              const isOpen = openKey === menu.key;
              return (
                <div key={menu.key} className="static" onMouseEnter={() => open(menu.key)} onMouseLeave={scheduleClose}>
                  <button
                    type="button"
                    className={NAV_LINK}
                    aria-expanded={isOpen}
                    onClick={() => setOpenKey(isOpen ? null : menu.key)}
                    onFocus={() => open(menu.key)}
                  >
                    {menu.label}
                    <span
                      className={cn(
                        'w-[7px] h-[7px] border-r-[1.5px] border-b-[1.5px] border-current transition-transform duration-300 ease-(--e-out)',
                        isOpen ? 'rotate-[-135deg] mt-[3px] ml-[2px]' : 'rotate-45 -mt-[3px] ml-[2px]'
                      )}
                    />
                  </button>

                  <div
                    className={cn(
                      'absolute left-0 right-0 top-full bg-[rgba(250,246,239,.98)] backdrop-blur-[22px] border-t border-(--ink-line)',
                      'shadow-[0_36px_80px_rgba(45,32,18,.10)] transition-[opacity,transform,visibility] duration-[450ms] ease-(--e-out)',
                      isOpen
                        ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                        : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                    )}
                  >
                    <Container className="pt-[44px] pb-[56px]">
                      <div className="flex items-end justify-between pb-[18px] mb-[8px] border-b border-(--ink-line)">
                        <div className="text-[13px] tracking-[0.22em] uppercase font-semibold text-(--ink-3)">
                          {menu.title}
                        </div>
                        <div className="text-[14px] text-(--ink-3) max-w-[380px] max-[680px]:hidden">
                          {menu.subtitle}
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center gap-[22px]">
                        {menu.cards.map((card) => (
                          <Link
                            key={card.title}
                            href={card.href}
                            className="group relative block w-[calc((100%-66px)/4)] min-w-[220px] max-[1180px]:w-[calc((100%-22px)/2)] rounded-(--r-md) overflow-hidden bg-(--cream-2) aspect-[4/5] isolate transition-[transform,box-shadow] duration-700 ease-(--e-out) hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(45,32,18,.18)]"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={card.image}
                              alt={card.imageAlt}
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover transition-[transform,filter] duration-[1200ms] ease-(--e-out) group-hover:scale-[1.08] group-hover:brightness-[.92]"
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,26,20,0)_35%,rgba(31,26,20,.78)_100%)]" />
                            <div className="absolute right-[18px] top-[18px] w-[34px] h-[34px] rounded-full bg-white/90 flex items-center justify-center text-(--ink-1) transition-[transform,background] duration-[600ms] ease-(--e-out) group-hover:bg-(--teal-light) group-hover:text-white group-hover:-rotate-45 [&_svg]:w-[14px] [&_svg]:h-[14px]">
                              <ArrowUpRight />
                            </div>
                            <div className="absolute left-[18px] right-[18px] bottom-[18px] text-white">
                              <div className="text-[10.5px] tracking-[0.22em] uppercase opacity-85 font-semibold inline-flex items-center gap-2 py-[5px] px-[10px] bg-white/[0.16] backdrop-blur-[10px] rounded-full">
                                {card.kicker}
                              </div>
                              <div className="text-[21px] font-semibold leading-[1.12] mt-[12px] tracking-[-0.015em]">
                                {card.title}
                              </div>
                              <div className="text-[13px] leading-[1.45] mt-[6px] max-h-0 overflow-hidden opacity-0 transition-[opacity,max-height,margin-top] duration-500 ease-(--e-out) group-hover:opacity-[.92] group-hover:max-h-[80px] group-hover:mt-[8px]">
                                {card.desc}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </Container>
                  </div>
                </div>
              );
            })}

            {NAV_LINKS.map((link) => (
              <Link key={link.label} className={NAV_LINK} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: CTA (hidden by default) + burger */}
          <div className="flex items-center gap-[10px] shrink-0">
            {SHOW_NAV_CTA &&
              (user ? (
                <>
                  {user.role === 'ADMIN' ? (
                    <Link
                      href="/admin/dashboard"
                      className={cn(BTN_BASE, 'bg-white text-(--ink-1) border-(--ink-line) max-[980px]:hidden')}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  ) : null}
                  <Link
                    href="/#wellness"
                    className={cn(BTN_BASE, 'bg-(--ink-1) text-(--cream) hover:bg-(--teal) hover:-translate-y-[3px]')}
                  >
                    Order Kit <ArrowRight />
                  </Link>
                  <UserNav
                    name={user.name ?? user.email ?? 'User'}
                    email={user.email ?? ''}
                    role={user.role}
                    image={user.image ?? null}
                  />
                </>
              ) : status !== 'loading' ? (
                <>
                  <Link
                    href="/#wellness"
                    className={cn(BTN_BASE, 'bg-(--ink-1) text-(--cream) hover:bg-(--teal) hover:-translate-y-[3px]')}
                  >
                    Order Kit <ArrowRight />
                  </Link>
                  <Link
                    href={`/login?from=${encodeURIComponent(pathname || '/')}`}
                    className={cn(BTN_BASE, 'bg-white text-(--ink-1) border-(--ink-line) max-[980px]:hidden')}
                  >
                    Sign in
                  </Link>
                </>
              ) : null)}

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
              className="hidden max-[980px]:flex w-[42px] h-[42px] rounded-[14px] items-center justify-center bg-[rgba(31,26,20,.06)]! cursor-pointer"
            >
              <span className="relative block w-[18px] h-[1.6px] bg-(--ink-1) before:content-[''] before:absolute before:left-0 before:right-0 before:h-[1.6px] before:bg-(--ink-1) before:-top-[6px] after:content-[''] after:absolute after:left-0 after:right-0 after:h-[1.6px] after:bg-(--ink-1) after:top-[6px]" />
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile menu - rendered OUTSIDE <header> so the header's backdrop-filter
          doesn't become the fixed drawer's containing block (which clipped it).
          The wrapper carries the chrome tokens to the (now viewport-fixed) drawer. */}
      {mobileOpen && (
        <div style={CHROME_VARS}>
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-x-0 top-16 bottom-0 z-[1150] bg-[rgba(20,15,10,.4)]"
          />
          <nav
            aria-label="Mobile"
            className="flex flex-col fixed top-16 right-0 bottom-0 z-[1200] w-[86vw] max-w-[360px] overflow-y-auto bg-(--cream) border-l border-(--ink-line) shadow-[0_0_60px_rgba(0,0,0,.18)] px-[22px] py-[24px] gap-[22px]"
          >
            {NAV_MENUS.map((menu) => (
              <div key={menu.key}>
                <div className="text-[11px] tracking-[0.2em] uppercase font-bold text-(--ink-3) mb-[10px]">
                  {menu.label}
                </div>
                <ul className="flex flex-col gap-[2px]">
                  {menu.cards.map((card) => (
                    <li key={card.title}>
                      <Link
                        href={card.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-[9px] text-[15px] font-medium text-(--ink-1) hover:text-(--teal)"
                      >
                        {card.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {/* The flat links close the drawer, in the same order they close the
                desktop bar: Blog, About Us, Contact. */}
            <div className="border-t border-(--ink-line) pt-[16px] flex flex-col gap-[2px]">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-[9px] text-[15px] font-semibold text-(--ink-1) hover:text-(--teal)"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
