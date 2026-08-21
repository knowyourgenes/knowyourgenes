'use client';

import { BTN_ICON } from '@/components/shared/button-styles';
import { useCart } from '../hooks/use-cart';

/**
 * Header cart icon with a live count.
 *
 * The ICON is always rendered; the BADGE is what's conditional. This changed
 * when the header grew a fixed three-icon cluster (search / account / cart):
 * a cart that vanished when empty left a hole in that row and made the other
 * two icons jump sideways as items went in and out of the basket.
 *
 * Still no server/client mismatch: the badge needs `hydrated`, which is false
 * during SSR and on the first client paint, so both sides render the bare icon
 * and the count appears on the same tick localStorage is read.
 */
export function CartLink({ className = '' }: { className?: string }) {
  const { itemCount, hydrated, openDrawer } = useCart();
  const count = hydrated ? itemCount : 0;

  // A BUTTON, not a link to /cart: this opens the slide-over so the customer
  // keeps the page they were reading. /cart is still a real page and is still
  // reachable - from inside the drawer, and by anyone who types or shares the
  // URL - it just is not where the header sends you any more.
  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-haspopup="dialog"
      aria-label={count === 0 ? 'Cart, empty' : `Cart, ${count} item${count === 1 ? '' : 's'}`}
      className={`${BTN_ICON} relative bg-[rgba(31,26,20,.06)] transition hover:bg-[rgba(14,77,75,.1)] ${className}`}
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
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-[19px] min-w-[19px] place-items-center rounded-full bg-(--teal) px-1 text-[11px] font-bold leading-none text-white tabular-nums">
          {count}
        </span>
      )}
    </button>
  );
}
