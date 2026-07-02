// Inline icons for the test pages. These use `currentColor` so they adapt to the
// surrounding text colour - unlike the exported Figma SVGs, which have a fixed
// fill baked in (fine for photos/logos, wrong for an arrow reused on both dark
// and light buttons). The arrow path is the exact one exported from Figma.

import type { ReactElement } from 'react';

export function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 17 21" fill="none" aria-hidden>
      <path
        d="M11.4579 11.2087H2.83398V9.79199H11.4579L7.49128 5.82533L8.50065 4.83366L14.1673 10.5003L8.50065 16.167L7.49128 15.1753L11.4579 11.2087Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Check({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M13.5 4.5L6.5 11.5L3 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Alert({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 5.5V8.5M8 10.8V11M8 1.5L15 14H1L8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Dot({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

/** Small "bundle" glyph used in the collapsed sidebar rail. */
export function Package({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 22 24" fill="none" aria-hidden>
      <path d="M11 1.5 20 6v12l-9 4.5L2 18V6l9-4.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M2 6l9 4.5L20 6M11 10.5V22.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

const trustIcons: Record<string, ReactElement> = {
  saliva: (
    <path
      d="M8 2.5C8 2.5 3.5 8 3.5 11a4.5 4.5 0 009 0C12.5 8 8 2.5 8 2.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinejoin="round"
    />
  ),
  needle: (
    <>
      <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M4 12L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  clock: (
    <>
      <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path
        d="M8 4.5V8L10.5 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  chat: (
    <path
      d="M2.5 4.5a1.5 1.5 0 011.5-1.5h8a1.5 1.5 0 011.5 1.5v5A1.5 1.5 0 0112 11H6l-3 2.5V4.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinejoin="round"
    />
  ),
  pin: (
    <path
      d="M8 14s5-4.2 5-8A5 5 0 003 6c0 3.8 5 8 5 8Zm0-6.2a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6Z"
      stroke="currentColor"
      strokeWidth="1.4"
      fill="none"
      strokeLinejoin="round"
    />
  ),
  eye: (
    <>
      <path
        d="M1.4 8S4 3.6 8 3.6 14.6 8 14.6 8 12 12.4 8 12.4 1.4 8 1.4 8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </>
  ),
};

export function TrustIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      {trustIcons[name] ?? trustIcons.clock}
    </svg>
  );
}
