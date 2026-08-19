'use client';

import { useCart } from '../hooks/use-cart';

/**
 * Header cart icon with a live count.
 *
 * Renders nothing until the cart has hydrated AND has something in it, so an
 * empty basket adds no chrome to the nav - and there is no server/client
 * mismatch, because the first paint on both sides is "no badge".
 */
export function CartLink({ className = '' }: { className?: string }) {
  const { itemCount, hydrated, openDrawer } = useCart();

  if (!hydrated || itemCount === 0) return null;

  // A BUTTON, not a link to /cart: this opens the slide-over so the customer
  // keeps the page they were reading. /cart is still a real page and is still
  // reachable - from inside the drawer, and by anyone who types or shares the
  // URL - it just is not where the header sends you any more.
  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-haspopup="dialog"
      aria-label={`Cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
      className={`relative inline-flex h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[rgba(31,26,20,.06)] transition hover:bg-[rgba(14,77,75,.1)] ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[19px] w-[19px] text-(--ink-1)"
        aria-hidden
      >
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
        <path d="M2.5 3.5h2.2l2.4 11.2a1.8 1.8 0 0 0 1.8 1.4h7.7a1.8 1.8 0 0 0 1.8-1.4L21 6.6H5.6" />
      </svg>
      <span className="absolute -right-1 -top-1 grid h-[19px] min-w-[19px] place-items-center rounded-full bg-(--teal) px-1 text-[11px] font-bold leading-none text-white tabular-nums">
        {itemCount}
      </span>
    </button>
  );
}
