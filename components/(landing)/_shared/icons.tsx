import type { SVGProps } from 'react';

/* Inline icon set for the Women’s Health (PCOS) landing page.
 * Lucide-style: 24x24 viewBox, stroke = currentColor (inherits text colour),
 * sized via className at each call site (e.g. className="size-[19px]"). */

type P = SVGProps<SVGSVGElement>;

function S({ children, ...p }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: P) => (
  <S {...p}>
    <path d="M5 12h13M12 5l7 7-7 7" />
  </S>
);

export const ArrowUpRight = (p: P) => (
  <S {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </S>
);

export const Check = (p: P) => (
  <S {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </S>
);

export const X = (p: P) => (
  <S {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </S>
);

export const Plus = (p: P) => (
  <S {...p}>
    <path d="M12 5v14M5 12h14" />
  </S>
);

/** Double DNA helix. */
export const Dna = (p: P) => (
  <S {...p}>
    <path d="M7 4c0 6 10 8 10 16M17 4c0 6-10 8-10 16" />
    <path d="M8.5 6.2h7M9.8 9.4h4.4M9.8 14.6h4.4M8.5 17.8h7" />
  </S>
);

/** Saliva / droplet. */
export const Droplet = (p: P) => (
  <S {...p}>
    <path d="M12 3.5c3.2 3.8 5.5 6.6 5.5 9.4A5.5 5.5 0 0 1 6.5 12.9c0-2.8 2.3-5.6 5.5-9.4Z" />
  </S>
);

export const Clock = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M12 7.6V12l3 2" />
  </S>
);

export const Calendar = (p: P) => (
  <S {...p}>
    <rect x="4" y="5.2" width="16" height="15" rx="2.4" />
    <path d="M4 9.4h16M8.4 3.4v3.4M15.6 3.4v3.4" />
  </S>
);

export const Shield = (p: P) => (
  <S {...p}>
    <path d="M12 3.2 5 6v5.4c0 4.3 2.9 7.1 7 8.4 4.1-1.3 7-4.1 7-8.4V6l-7-2.8Z" />
  </S>
);

export const ShieldCheck = (p: P) => (
  <S {...p}>
    <path d="M12 3.2 5 6v5.4c0 4.3 2.9 7.1 7 8.4 4.1-1.3 7-4.1 7-8.4V6l-7-2.8Z" />
    <path d="m9 11.6 2.2 2.2L15.2 10" />
  </S>
);

export const BadgeCheck = (p: P) => (
  <S {...p}>
    <path d="m4.6 12 1.3-2.3-.2-2.6 2.4-1 1.6-2.1L12 4.9l2.3-.9 1.6 2.1 2.4 1-.2 2.6L19.4 12l-1.3 2.3.2 2.6-2.4 1-1.6 2.1L12 19.1l-2.3.9-1.6-2.1-2.4-1 .2-2.6Z" />
    <path d="m9.2 12 2 2 3.6-4" />
  </S>
);

export const Award = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="9.4" r="5.4" />
    <path d="M8.6 13.8 7.2 21l4.8-2.6L16.8 21l-1.4-7.2" />
  </S>
);

export const Heart = (p: P) => (
  <S {...p}>
    <path d="M12 19.5 5.2 13a4.3 4.3 0 0 1 6-6.1l.8.8.8-.8a4.3 4.3 0 0 1 6 6.1Z" />
  </S>
);

export const Sparkles = (p: P) => (
  <S {...p}>
    <path d="M12 4.5 13.4 9 18 10.4 13.4 11.8 12 16.3 10.6 11.8 6 10.4 10.6 9Z" />
    <path d="M18.5 4.2v3M20 5.7h-3M5.5 16.5v2.6M6.8 17.8H4.2" />
  </S>
);

export const Info = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M12 11.2v4.4M12 8.2h.01" />
  </S>
);

/** Tap / pointing finger. */
export const Tap = (p: P) => (
  <S {...p}>
    <path d="M9 11V6.4a1.6 1.6 0 0 1 3.2 0V11" />
    <path d="M12.2 11V9.2a1.5 1.5 0 0 1 3 0V11" />
    <path d="M15.2 11v-.6a1.5 1.5 0 0 1 3 0V15a5 5 0 0 1-5 5h-1.3a4.6 4.6 0 0 1-3.3-1.4L5 15.4a1.6 1.6 0 0 1 2.4-2.1L9 15" />
  </S>
);

export const Package = (p: P) => (
  <S {...p}>
    <path d="M12 3.6 4.8 7.3v9.4L12 20.4l7.2-3.7V7.3Z" />
    <path d="M4.8 7.3 12 11l7.2-3.7M12 11v9.4M8.4 5.45 15.6 9.15" />
  </S>
);

export const Microscope = (p: P) => (
  <S {...p}>
    <path d="M6 20h11" />
    <path d="M9.5 20a5.5 5.5 0 0 0 5.5-5.5" />
    <path d="m9.4 13.6 2.6-2.6M8 12.2 11.8 8.4a1.6 1.6 0 0 0 0-2.3L10.7 5a1.6 1.6 0 0 0-2.3 0L4.6 8.8a1.6 1.6 0 0 0 0 2.3l1.1 1.1a1.6 1.6 0 0 0 2.3 0Z" />
  </S>
);

export const FileText = (p: P) => (
  <S {...p}>
    <path d="M13.4 3.6H7.2A1.8 1.8 0 0 0 5.4 5.4v13.2a1.8 1.8 0 0 0 1.8 1.8h9.6a1.8 1.8 0 0 0 1.8-1.8V8.2Z" />
    <path d="M13.2 3.6v4.8h5M8.6 12.6h6.8M8.6 16.2h6.8" />
  </S>
);

export const UserRound = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="8.4" r="3.8" />
    <path d="M5.6 19.4a6.4 6.4 0 0 1 12.8 0" />
  </S>
);

export const Activity = (p: P) => (
  <S {...p}>
    <path d="M3.6 12h3.2l2.2-6 4 13 2.2-7h4.4" />
  </S>
);

export const TrendingUp = (p: P) => (
  <S {...p}>
    <path d="M3.6 16.5 9.4 10.7l3.4 3.4 7.2-7.2" />
    <path d="M15.6 6.9h4.4v4.4" />
  </S>
);

export const AlertTriangle = (p: P) => (
  <S {...p}>
    <path d="M12 4.4 21 19.2H3Z" />
    <path d="M12 10.2v3.6M12 16.6h.01" />
  </S>
);

export const Flask = (p: P) => (
  <S {...p}>
    <path d="M9.6 3.6h4.8M10.4 3.6v6L5.6 18a1.8 1.8 0 0 0 1.6 2.6h9.6A1.8 1.8 0 0 0 18.4 18l-4.8-8.4v-6" />
    <path d="M7.8 14h8.4" />
  </S>
);

export const Scale = (p: P) => (
  <S {...p}>
    <path d="M12 4v16M7 20h10M4.6 9 7 4l2.4 5a3 3 0 0 1-4.8 0ZM14.6 9 17 4l2.4 5a3 3 0 0 1-4.8 0Z" />
  </S>
);

/** Large decorative quotation mark (filled). */
export const Quote = (p: P) => (
  <S fill="currentColor" stroke="none" {...p}>
    <path d="M9.6 6C6.5 7.3 4.6 10 4.6 13.2c0 2.7 1.6 4.8 4 4.8 2 0 3.5-1.5 3.5-3.5s-1.4-3.4-3.2-3.4c-.4 0-.8.1-1 .2.3-1.6 1.7-3 3.5-3.8L9.6 6Zm8.4 0c-3.1 1.3-5 4-5 7.2 0 2.7 1.6 4.8 4 4.8 2 0 3.5-1.5 3.5-3.5s-1.4-3.4-3.2-3.4c-.4 0-.8.1-1 .2.3-1.6 1.7-3 3.5-3.8L18 6Z" />
  </S>
);

/** Stylised DNA helix used as a faint accent behind the final CTA. */
export const HelixAccent = (p: P) => (
  <svg viewBox="0 0 120 360" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true" {...p}>
    <path d="M30 10c60 40 60 100 0 140s-60 100 0 140M90 10C30 50 30 110 90 150s60 100 0 140" />
    <path d="M38 40h44M30 75h60M30 110h60M38 145h44M38 215h44M30 250h60M30 285h60M38 320h44" />
  </svg>
);
