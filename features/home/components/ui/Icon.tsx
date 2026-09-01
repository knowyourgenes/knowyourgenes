import { cn } from '@/lib/utils';

/**
 * The homepage icon set, as inline paths.
 *
 * The old build served these as exported SVG <img>s keyed by FRAME-ABSOLUTE
 * Figma ids ('11265-76'), which meant every icon reference broke the moment a
 * section moved on the artboard, and none of them could take currentColor - so
 * a glyph on a teal chip had to be recoloured with a brightness-0/invert hack.
 * Inline paths fix both: they inherit colour, and they are addressed by name.
 */
const PATHS = {
  heart:
    'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
  users:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  dna: 'M4 2v2c0 4 8 5 8 8s-8 4-8 8v2M20 2v2c0 4-8 5-8 8s8 4 8 8v2M6 6h12M6 18h12',
  globe:
    'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z',
  hourglass:
    'M5 22h14M5 2h14M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41A2 2 0 0 0 7 17.83V22M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2',
  crosshair: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM22 12h-4M6 12H2M12 6V2M12 22v-4',
  flask: 'M10 2v7.31M14 9.3V1.99M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0M5.52 16h12.96',
  book: 'M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z',
  lifebuoy:
    'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-6a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.93 4.93l4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24',
  scale:
    'M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1ZM7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2',
  check: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm-3-10 2 2 4-4',
  lock: 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2ZM7 11V7a5 5 0 0 1 10 0v4',
  shield:
    'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1zM9 12l2 2 4-4',
  messages:
    'M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2zM18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1',
  leaf: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10ZM2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12',
  route:
    'M9 19a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM21 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15',
  chat: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5zM10.3 9.4a2.2 2.2 0 0 1 4.3.7c0 1.5-2.2 2.2-2.2 2.2M12.4 15.4h.01',
  quote:
    'M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2zM5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  tube: 'M14.5 2v17.5a3.5 3.5 0 0 1-7 0V2M6 2h10M8 15h6',
  microscope:
    'M6 18h8M3 22h18M14 22a7 7 0 1 0 0-14h-1M9 14h2M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2ZM12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3',
  file: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7ZM14 2v5h6M9 13h6M9 17h6',
  chevron: 'm9 18 6-6-6-6',
  arrow: 'M5 12h14m-6-6 6 6-6 6',

  // The three station glyphs on the life curve (OneLifetimeCurve). Traced from
  // the design's own exports rather than approximated from the set above: the
  // node is a 33px circle, and at that size `crosshair` (a near-full-bleed ring
  // with notches) and `focus` (a small ring with four rays) do NOT read as the
  // same mark. Coordinates are the exported 14.222 grid scaled by 24/14.222.
  focus:
    'M12 16.2C14.32 16.2 16.2 14.32 16.2 12C16.2 9.68 14.32 7.8 12 7.8C9.68 7.8 7.8 9.68 7.8 12C7.8 14.32 9.68 16.2 12 16.2ZM12 3V6M12 18V21M3 12H6M18 12H21',
  /** One person - `users` is two, and station 02 is deliberately one. */
  user: 'M5 20C5 16 8.2 13.6 12 13.6C15.8 13.6 19 16 19 20M12 11.4C13.88 11.4 15.4 9.88 15.4 8C15.4 6.12 13.88 4.6 12 4.6C10.12 4.6 8.6 6.12 8.6 8C8.6 9.88 10.12 11.4 12 11.4Z',
  /** A head over a wide open arc - station 05, "as your body changes". */
  figure:
    'M4 17C7 11 9 9 12 9C15 9 17 11 20 17M12 8.4C13.33 8.4 14.4 7.33 14.4 6C14.4 4.67 13.33 3.6 12 3.6C10.67 3.6 9.6 4.67 9.6 6C9.6 7.33 10.67 8.4 12 8.4Z',
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  className,
  strokeWidth = 1.7,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-[22px] w-[22px] shrink-0', className)}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

/**
 * The 48px tinted well the icons sit in throughout the page - claims, care
 * cards, assurances. One component so the tint, the radius and the box never
 * drift apart across three sections.
 */
export function IconWell({
  name,
  tone = 'light',
  className,
}: {
  name: IconName;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'grid h-12 w-12 shrink-0 place-items-center rounded-sm',
        tone === 'dark' ? 'bg-java2/[0.13] text-ice' : 'bg-eden/[0.08] text-eden',
        className
      )}
    >
      <Icon name={name} className="h-[23px] w-[23px]" />
    </span>
  );
}

export default Icon;
