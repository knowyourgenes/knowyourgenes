'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import UserNav from '@/features/admin/components/UserNav';
import { CartLink } from '@/features/cart/components/CartLink';
import { CHROME_VARS } from '@/features/auth/server/tokens';
import { NAV_LEAD_LINKS, NAV_LINKS, NAV_MENUS } from '@/lib/nav-data';
import { BTN, BTN_ICON } from './button-styles';
import { Container } from './Container';
import { KygLogo } from './Logo';
import { SearchOverlay } from './SearchOverlay';

// The home page keeps the nav order/checkout CTAs hidden for now ("CTA-HIDDEN"
// in the original). Flip to true to show the auth-aware Order Kit / Sign in CTA.
const SHOW_NAV_CTA = false;

/**
 * The desktop three-column track: equal `1fr` cheeks, auto centre.
 *
 * The cheeks being equal is what centres the nav links on the VIEWPORT rather
 * than in the gap between the logo and the icons. That distinction is load
 * bearing: the right-hand cluster changes width in normal use - the cart badge
 * appears, and the account control swaps between a fixed-size icon and an
 * avatar - and a `flex-1` middle would slide the nav sideways every time it did.
 *
 * The centre is `auto`: it takes exactly what the links need. It no longer has
 * to reserve room for a search box, so there is nothing left to cap.
 */
const CENTRE_TRACK = 'min-[981px]:grid-cols-[1fr_auto_1fr]';

/** The three right-hand icons share one hit area, so the row stays even. */
const ICON_BTN =
  BTN_ICON +
  ' text-(--ink-1) transition-[background,color] duration-200 ease-(--e-out)' +
  ' hover:bg-[rgba(14,77,75,.09)] hover:text-(--teal) cursor-pointer';

const SearchGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.85"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-[19px] w-[19px]"
    aria-hidden
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.6-3.6" />
  </svg>
);

const AccountGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-[20px] w-[20px]"
    aria-hidden
  >
    <circle cx="12" cy="8" r="3.75" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </svg>
);

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

// Tighter than the old single-row bar: the links are now the SECOND row of the
// centre column, so their vertical padding is part of the header's height
// budget rather than the whole of it.
// The nav links ARE the button box (BTN) with nav colouring. Sharing it is the
// point: the hover chip here and a CTA in a hero are the same control at the
// same size, which is what stops the header reading as a different system.
const NAV_LINK =
  BTN +
  ' font-medium text-(--ink-1) tracking-[-0.005em]' +
  ' transition-[color,background] duration-200 ease-(--e-out) hover:text-(--teal) hover:bg-[rgba(14,77,75,.07)] cursor-pointer';

// Size comes from BTN - one button box for the whole UI (components/shared/
// button-styles). Only the chrome's own colour, border and motion live here.
const BTN_BASE =
  BTN +
  ' font-semibold border-[1.5px] border-transparent cursor-pointer' +
  ' transition-[transform,background,box-shadow,color] duration-300 ease-(--e-out) [&_svg]:w-4 [&_svg]:h-4';

/**
 * Shared KYG warm-modern site header. Self-contained: design tokens are applied
 * inline on the <header> via CHROME_VARS, so it renders identically in any route
 * scope. Used on every public user page.
 *
 * LAYOUT - three sections, one CSS grid, one row.
 *
 *   desktop (>=981px)   [ logo ]   [ nav links ]   [ search  account  cart ]
 *
 *   mobile  (<=980px)   [ logo ]   [ search  account  cart  burger ]
 *
 * The right cluster is a fixed three-icon set (see CENTRE_TRACK for why that
 * matters to the centring). Search OPENS AN OVERLAY rather than living in the
 * bar: an always-present input made the header two rows tall on every page to
 * serve an action most visits never take, and it crowded the nav links beneath
 * it. Account is a link to /login when signed out and the profile menu when
 * signed in. Cart always renders; only its badge is conditional.
 *
 * Below 981px the nav links move into the burger drawer; the icons stay put.
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
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const linksRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /**
   * Publish the bar's real height as `--site-header-h` on <html>.
   *
   * Two things have to clear this header and neither is inside it: the mobile
   * drawer (fixed, starts at the bar's bottom edge) and the home hero's top
   * padding (the bar is `overlay` there, so it floats ON the hero). Both used to
   * hardcode 64px. The bar is now two rows and its height moves with the
   * breakpoint, so a literal would be wrong somewhere by construction.
   *
   * Measured rather than declared: a ResizeObserver cannot drift out of sync
   * with the markup the way a constant can. `app/globals.css` carries a static
   * fallback for the server-rendered first frame, before this runs.
   *
   * The property is deliberately NOT cleaned up on unmount. It is a measurement,
   * not state, and routes without a header do not read it - whereas removing it
   * would make the value flash back to the fallback every time the header
   * remounts across a route-group boundary.
   */
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const publish = () => {
      const h = Math.round(el.getBoundingClientRect().height);
      if (h > 0) document.documentElement.style.setProperty('--site-header-h', `${h}px`);
    };
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
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
        ref={headerRef}
        style={CHROME_VARS}
        className={cn(
          'top-0 inset-x-0 z-[1000] backdrop-blur-[22px] backdrop-saturate-[1.4] border-b transition-[background,border-color] duration-[400ms] ease-(--e-out)',
          overlay ? 'fixed' : 'sticky',
          scrolled ? 'bg-[rgba(250,246,239,.88)] border-(--ink-line)' : 'bg-[rgba(250,246,239,.65)] border-transparent'
        )}
      >
        <Container
          className={cn(
            'grid h-16 items-center gap-x-[20px]',
            // Mobile: logo left, icon cluster right. The nav lives in the drawer.
            'grid-cols-[auto_1fr]',
            // Desktop: three columns, centre column centred on the viewport.
            CENTRE_TRACK
          )}
        >
          {/* ---- SECTION 1: logo ------------------------------------------- */}
          <Link
            href="/"
            className="col-start-1 row-start-1 flex items-center shrink-0"
            aria-label="KYG, Know Your Genes"
          >
            <KygLogo tone="dark" className="h-9! w-auto" />
          </Link>

          {/* ---- SECTION 2: nav links -------------------------------------
              Desktop only - below 981px these move into the burger drawer. */}
          <div className="col-start-2 row-start-1 flex min-w-0 justify-center max-[980px]:hidden">
            {/* Desktop mega-menu nav */}
            <nav ref={linksRef} className="flex flex-wrap items-center justify-center gap-[2px]" aria-label="Main">
              {/* Flat links that sit BEFORE the mega menus. Rendered from their
                  own list rather than from NAV_LINKS, which is mapped after the
                  menus - see the note in lib/nav-data.ts. */}
              {NAV_LEAD_LINKS.map((link) => (
                <Link key={link.label} className={NAV_LINK} href={link.href}>
                  {link.label}
                </Link>
              ))}

              {NAV_MENUS.map((menu) => {
                const isOpen = openKey === menu.key;
                return (
                  <div
                    key={menu.key}
                    className="static"
                    onMouseEnter={() => open(menu.key)}
                    onMouseLeave={scheduleClose}
                  >
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

                    {/* `className="static"` on the wrapper above is load-bearing:
                        it keeps this panel positioned against the <header> (the
                        nearest positioned ancestor, via `sticky`/`fixed`) rather
                        than against the menu button, so `top-full` means "below
                        the whole bar" and `left-0 right-0` means "full bleed".
                        That still holds now the bar is two rows tall.

                        NO backdrop-blur here, deliberately.
                        This panel used to carry `backdrop-blur-[22px]`, and it cost
                        more than anything else on the site. Two of these render on
                        EVERY page (one per menu), each ~827,000px, and they are
                        hidden with `opacity-0 invisible` rather than `display:none`
                        - so they stay in layout and keep their compositing layers.
                        backdrop-filter is re-evaluated against everything painted
                        behind it whenever that moves, and scrolling moves all of it,
                        so the page paid for 1.65 million pixels of blur, permanently,
                        while invisible. Measured on /: p95 frame time 16.8ms -> 8.5ms
                        and worst frame 760ms -> 298ms once it was gone.

                        Removing it changes nothing visually because this panel's own
                        background is 98% opaque - at most 2% of the backdrop was ever
                        showing through. Verified, not assumed: the before/after diff
                        (mean 0.006/255) sits inside the panel's own frame-to-frame
                        noise floor from its image transitions (mean 0.002/255).

                        If a future design wants real glass here, drop the background
                        to ~0.7 alpha AND gate the blur on `isOpen`, so a closed menu
                        costs nothing. */}
                    <div
                      className={cn(
                        'absolute left-0 right-0 top-full bg-[rgba(250,246,239,.98)] border-t border-(--ink-line)',
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
                              className="group relative block w-[calc((100%-66px)/4)] min-w-[220px] max-[1180px]:w-[calc((100%-22px)/2)] rounded-sm overflow-hidden bg-(--cream-2) aspect-[4/5] isolate transition-[transform,box-shadow] duration-700 ease-(--e-out) hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(45,32,18,.18)]"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={card.image}
                                alt={card.imageAlt}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover transition-[transform,filter] duration-[1200ms] ease-(--e-out) group-hover:scale-[1.08] group-hover:brightness-[.92]"
                              />
                              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,26,20,0)_35%,rgba(31,26,20,.78)_100%)]" />
                              <div className="absolute right-[18px] top-[18px] w-[34px] h-[34px] rounded-sm bg-white/90 flex items-center justify-center text-(--ink-1) transition-[transform,background] duration-[600ms] ease-(--e-out) group-hover:bg-(--teal-light) group-hover:text-white group-hover:-rotate-45 [&_svg]:w-[14px] [&_svg]:h-[14px]">
                                <ArrowUpRight />
                              </div>
                              <div className="absolute left-[18px] right-[18px] bottom-[18px] text-white">
                                <div className="text-[10.5px] tracking-[0.22em] uppercase opacity-85 font-semibold inline-flex items-center gap-2 py-[5px] px-[10px] bg-white/[0.16] backdrop-blur-[10px] rounded-sm">
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
          </div>

          {/* ---- SECTION 3: search / account / cart (+ burger on mobile) --- */}
          <div
            className={cn(
              'col-start-2 row-start-1 flex items-center justify-end gap-[6px] shrink-0',
              'min-[981px]:col-start-3'
            )}
          >
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
              className={ICON_BTN}
            >
              <SearchGlyph />
            </button>

            {/* Account. Signed out -> straight to /login carrying the page you
                were on, so you land back here rather than on a dashboard you did
                not ask for. Signed in -> the existing profile menu, avatar-only
                so it sits at the same size as the two icons beside it.

                The loading branch renders a same-size spacer rather than nothing:
                showing the signed-out icon while the session is still resolving
                would flash "sign in" at someone who is already signed in on every
                cold load, and collapsing the slot would jog the cart sideways. */}
            {user ? (
              <UserNav
                name={user.name ?? user.email ?? 'User'}
                email={user.email ?? ''}
                role={user.role}
                image={user.image ?? null}
                compact
              />
            ) : status !== 'loading' ? (
              <Link
                href={`/login?from=${encodeURIComponent(pathname || '/')}`}
                aria-label="Sign in"
                className={ICON_BTN}
              >
                <AccountGlyph />
              </Link>
            ) : (
              <span className="h-[42px] w-[42px]" aria-hidden />
            )}

            {/* Always rendered now - only the badge is conditional. */}
            <CartLink />

            {/* The parked "Order Kit" marketing CTA, plus the admin shortcut.
                Sign-in is NOT in this block any more - it is the account icon
                above, which is present whether or not the CTAs are. */}
            {SHOW_NAV_CTA && (
              <>
                {user?.role === 'ADMIN' && (
                  <Link
                    href="/admin/dashboard"
                    className={cn(BTN_BASE, 'bg-white text-(--ink-1) border-(--ink-line) max-[980px]:hidden')}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/#wellness"
                  className={cn(BTN_BASE, 'bg-(--ink-1) text-(--cream) hover:bg-(--teal) hover:-translate-y-[3px]')}
                >
                  Order Kit <ArrowRight />
                </Link>
              </>
            )}

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
              className={cn(BTN_ICON, 'hidden max-[980px]:flex bg-[rgba(31,26,20,.06)]! cursor-pointer')}
            >
              <span className="relative block w-[18px] h-[1.6px] bg-(--ink-1) before:content-[''] before:absolute before:left-0 before:right-0 before:h-[1.6px] before:bg-(--ink-1) before:-top-[6px] after:content-[''] after:absolute after:left-0 after:right-0 after:h-[1.6px] after:bg-(--ink-1) after:top-[6px]" />
            </button>
          </div>
        </Container>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile menu - rendered OUTSIDE <header> so the header's backdrop-filter
          doesn't become the fixed drawer's containing block (which clipped it).
          The wrapper carries the chrome tokens to the (now viewport-fixed) drawer.

          `top`/`bottom` track --site-header-h rather than the old literal 64px:
          the bar is two rows now, and taller on mobile than on desktop. */}
      {mobileOpen && (
        <div style={CHROME_VARS}>
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-x-0 top-[var(--site-header-h)] bottom-0 z-[1150] bg-[rgba(20,15,10,.4)]"
          />
          <nav
            aria-label="Mobile"
            className="flex flex-col fixed top-[var(--site-header-h)] right-0 bottom-0 z-[1200] w-[86vw] max-w-[360px] overflow-y-auto bg-(--cream) border-l border-(--ink-line) shadow-[0_0_60px_rgba(0,0,0,.18)] px-[22px] py-[24px] gap-[22px]"
          >
            {/* Mirrors the desktop bar: the lead links come first, before the
                menus. Without this the drawer would be the only place
                "Categories" is unreachable. */}
            {NAV_LEAD_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-[9px] text-[15px] font-semibold text-(--ink-1) hover:text-(--teal)"
              >
                {link.label}
              </Link>
            ))}

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
