// Inline icons for the test pages. These use `currentColor` so they adapt to the
// surrounding text colour - unlike the exported Figma SVGs (used via <img>),
// which have a fixed fill baked in. The arrow path is the exact one from Figma.

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

export function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6.5 10.2 9 12.6 13.6 7.4"
        stroke="currentColor"
        strokeWidth="1.6"
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

/** Ring bullet for the "signs to watch for" list - currentColor so it can be
 *  tinted per pain accent (teal / clay-red). */
export function SignDot({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.6" />
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
