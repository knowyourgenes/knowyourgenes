'use client';

// =============================================================================
// features/cart - the slide-over basket
// -----------------------------------------------------------------------------
// The Shopify-style right-hand drawer. Opened by the header cart button and by
// "Add to cart" on the kit configurator, so the customer never loses the page
// they were reading in order to check what they have picked.
//
// /cart IS KEPT, and not as a fallback nobody sees: it is where a shared link, a
// bookmark, a no-JS visitor and this drawer's own "View full cart" all land. The
// drawer is an accelerator for the common case, not a replacement for the page.
//
// DIALOG SEMANTICS ARE HAND-ROLLED rather than using <dialog>, because the
// native element's ::backdrop cannot be transitioned in step with a transform on
// the panel, and this panel slides. What that costs is that focus handling has
// to be written out, so it is:
//   * the panel takes focus on open and hands it back to the opener on close
//   * Tab is trapped inside the panel while it is open
//   * Escape closes it
//   * the page behind is inert to pointer events and locked from scrolling
// Drop any one of those and this stops being a dialog and becomes a div that
// merely looks like one.
// =============================================================================

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';

import { formatPaise } from '@/lib/catalog';

import { useCart } from '../hooks/use-cart';

/** Everything focusable, in DOM order, for the tab trap. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function CartDrawer() {
  const { priced, hydrated, pricing, itemCount, setQuantity, remove, drawerOpen, closeDrawer } = useCart();

  const panelRef = useRef<HTMLDivElement | null>(null);
  // Whatever had focus when the drawer opened, so it can be given back. Losing
  // this is what dumps a keyboard user back at the top of the document.
  const openerRef = useRef<HTMLElement | null>(null);

  const lines = priced?.lines ?? [];

  useEffect(() => {
    if (!drawerOpen) return;

    openerRef.current = document.activeElement as HTMLElement | null;

    // Lock the page behind. Compensating for the scrollbar's width stops the
    // whole layout jumping sideways the moment the drawer opens.
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = gap + 'px';

    const panel = panelRef.current;
    panel?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeDrawer();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      openerRef.current?.focus?.();
    };
  }, [drawerOpen, closeDrawer]);

  const onOverlay = useCallback(() => closeDrawer(), [closeDrawer]);

  return (
    <div
      // The wrapper stays mounted so the panel can transition OUT as well as in.
      // Unmounting on close would make it vanish rather than slide away.
      aria-hidden={!drawerOpen}
      className={'fixed inset-0 z-[1300] ' + (drawerOpen ? '' : 'pointer-events-none')}
    >
      <div
        onClick={onOverlay}
        className={
          'absolute inset-0 bg-[rgba(20,15,10,0.42)] transition-opacity duration-300 ' +
          (drawerOpen ? 'opacity-100' : 'opacity-0')
        }
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        tabIndex={-1}
        className={
          'absolute inset-y-0 right-0 flex w-[min(92vw,420px)] flex-col bg-spring shadow-[0_0_60px_rgba(0,0,0,0.22)] outline-none transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ' +
          (drawerOpen ? 'translate-x-0' : 'translate-x-full')
        }
      >
        {/* ---- head ---- */}
        <div className="flex items-center justify-between gap-3 border-b border-zeus/[0.09] px-5 py-4">
          <h2 className="text-[16.5px] font-semibold tracking-[-0.015em] text-mine">
            Your cart
            {itemCount > 0 && <span className="ml-2 text-[13.5px] font-medium text-cape">({itemCount})</span>}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-sm text-cape transition hover:bg-zeus/[0.06] hover:text-mine"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-[18px] w-[18px]">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ---- body ---- */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {!hydrated ? (
            // localStorage cannot be read during SSR, so until it has been we do
            // not know whether this basket is empty. Rendering "empty" here is a
            // lie told to someone who has ten thousand rupees of kits in it.
            <div className="space-y-3" aria-busy="true">
              {[0, 1].map((i) => (
                <div key={i} className="h-[92px] animate-pulse rounded-sm bg-white/70" />
              ))}
            </div>
          ) : lines.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-2 py-14 text-center">
              <p className="text-[17px] font-semibold tracking-[-0.01em] text-mine">Your cart is empty</p>
              <p className="max-w-[280px] text-[13.5px] leading-[1.55] text-cape">
                Every KYG test starts with one at-home saliva kit. Pick the answers you actually want.
              </p>
              <Link
                href="/categories"
                onClick={closeDrawer}
                className="mt-1 rounded-sm bg-eden px-5 py-2.5 text-[13.5px] font-bold text-spring transition hover:bg-eden2"
              >
                Browse all tests
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {lines.map((line) => (
                <li key={line.slug} className="flex gap-3 rounded-sm border border-zeus/[0.09] bg-white p-3">
                  <Link
                    href={line.href}
                    onClick={closeDrawer}
                    className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-sm bg-eden/[0.06]"
                  >
                    {line.coverImageUrl ? (
                      <Image src={line.coverImageUrl} alt="" fill sizes="72px" className="object-cover" />
                    ) : (
                      <span className="grid h-full w-full place-items-center text-[10px] font-bold uppercase tracking-[0.08em] text-eden/50">
                        KYG
                      </span>
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={line.href}
                        onClick={closeDrawer}
                        className="min-w-0 text-[14.5px] font-semibold leading-[1.3] tracking-[-0.01em] text-mine hover:text-eden"
                      >
                        {line.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(line.slug)}
                        aria-label={'Remove ' + line.name}
                        className="shrink-0 text-[12px] font-semibold text-cord underline-offset-2 transition hover:text-eden hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                      <div className="inline-flex items-center rounded-sm border border-zeus/[0.12] bg-white">
                        <button
                          type="button"
                          aria-label={'Decrease ' + line.name + ' quantity'}
                          onClick={() => setQuantity(line.slug, line.quantity - 1)}
                          className="grid h-8 w-8 place-items-center rounded-l-sm text-base text-cape transition hover:bg-zeus/[0.05]"
                        >
                          &minus;
                        </button>
                        <span className="w-7 text-center text-[13px] font-bold tabular-nums">{line.quantity}</span>
                        <button
                          type="button"
                          aria-label={'Increase ' + line.name + ' quantity'}
                          disabled={line.quantity >= line.maxQuantity}
                          onClick={() => setQuantity(line.slug, line.quantity + 1)}
                          className="grid h-8 w-8 place-items-center rounded-r-sm text-base text-cape transition hover:bg-zeus/[0.05] disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[14.5px] font-bold tabular-nums text-mine">
                        {formatPaise(line.lineTotal)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ---- foot ----
            Rendered only when there is something to buy, so an empty drawer is
            not a wall of zeroes under a dead checkout button. */}
        {hydrated && lines.length > 0 && (
          <div className="border-t border-zeus/[0.09] bg-white px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[14px] text-cape">Subtotal</span>
              <span className="text-[19px] font-bold tabular-nums text-mine">{formatPaise(priced?.subtotal ?? 0)}</span>
            </div>
            <p className="mt-1 text-[12.5px] leading-[1.5] text-cord">
              One saliva kit covers every report here, so shipping is charged once. Shipping is added at checkout.
            </p>

            <Link
              href="/checkout"
              onClick={closeDrawer}
              aria-disabled={pricing}
              className={
                'mt-3 flex h-[52px] w-full items-center justify-center rounded-sm bg-eden text-[15px] font-bold text-spring transition hover:bg-eden2 ' +
                (pricing ? 'pointer-events-none opacity-60' : '')
              }
            >
              {pricing ? 'Updating…' : 'Checkout'}
            </Link>

            <Link
              href="/cart"
              onClick={closeDrawer}
              className="mt-2 flex h-10 w-full items-center justify-center text-[13.5px] font-semibold text-cape underline-offset-2 transition hover:text-eden hover:underline"
            >
              View full cart
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
