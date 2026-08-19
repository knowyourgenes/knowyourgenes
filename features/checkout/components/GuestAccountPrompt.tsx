'use client';

// =============================================================================
// features/checkout - "your order is saved, sign in to follow it"
// -----------------------------------------------------------------------------
// Shown once, on the confirmation page, to someone who has just paid WITHOUT an
// account. Their order is already attached to the email they typed, so there is
// nothing for them to do here - this exists to tell them that, and to offer the
// one action that is worth taking.
//
// IT DOES NOT SIGN ANYONE IN, and that is the whole design. An email typed into
// a checkout form is not proof that the person owns that mailbox; treating it as
// proof would mean anyone could type a stranger's address, pay a few hundred
// rupees, and be handed that stranger's account - which on this site holds
// genetic reports. So the order is filed against the email and the buyer signs
// in through the normal route, on their own terms, whenever they like.
//
// Dismissible, and dismissing it is final for this page view: the confirmation
// underneath is the thing they came to read, and a modal that will not go away
// is worse than no modal.
// =============================================================================

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export function GuestAccountPrompt({ email, orderNumber }: { email: string; orderNumber: string }) {
  const [open, setOpen] = useState(true);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1400] flex items-end justify-center p-4 sm:items-center">
      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-[rgba(20,15,10,0.45)]"
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-prompt-title"
        tabIndex={-1}
        className="relative w-full max-w-[440px] rounded-[22px] border border-zeus/[0.09] bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)] outline-none"
      >
        <h2 id="guest-prompt-title" className="text-[20px] font-semibold tracking-[-0.02em] text-mine">
          Order {orderNumber} is confirmed
        </h2>

        <p className="mt-2 text-[14.5px] leading-[1.6] text-cape">
          We have saved it against <span className="font-semibold text-mine">{email}</span>. Sign in with that address
          whenever you like to track this order and read your report - your history is already waiting there.
        </p>

        <p className="mt-2 text-[13px] leading-[1.55] text-cord">
          Nothing else is needed now. Your confirmation is on its way by email.
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
          <Link
            href={`/login?from=${encodeURIComponent('/dashboard/orders')}`}
            className="flex h-[46px] flex-1 items-center justify-center rounded-full bg-eden text-[14px] font-bold text-spring transition hover:bg-eden2"
          >
            Sign in to track it
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-[46px] items-center justify-center rounded-full px-5 text-[14px] font-semibold text-cape transition hover:bg-zeus/[0.05] hover:text-mine"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
