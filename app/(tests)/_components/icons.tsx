// Icon set for the test pages. Plain presentational SVGs (no client state) so
// they can be rendered from server or client components alike. Strokes use
// `currentColor`, so colour comes from the parent's text colour utility.
import type { SVGProps, ReactNode } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

/** Shared stroke-style wrapper used by most line icons. */
function Line({ children, strokeWidth = 2, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <Line {...p}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </Line>
);

export const ArrowUpRight = (p: IconProps) => (
  <Line {...p}>
    <path d="M7 17L17 7M9 7h8v8" />
  </Line>
);

export const BadgeTest = (p: IconProps) => (
  <Line strokeWidth={1.9} {...p}>
    <circle cx="10" cy="14" r="6" />
    <path d="M14.5 9.5 20 4M15 4h5v5" />
  </Line>
);

export const AlertCircle = (p: IconProps) => (
  <Line strokeWidth={1.6} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4M12 16h.01" />
  </Line>
);

export const Check = (p: IconProps) => (
  <Line strokeWidth={2.6} {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Line>
);

export const Plus = (p: IconProps) => (
  <Line strokeWidth={2.4} {...p}>
    <path d="M12 5v14M5 12h14" />
  </Line>
);

export const ChevronLeft = (p: IconProps) => (
  <Line {...p}>
    <path d="M15 18l-6-6 6-6" />
  </Line>
);

// --- Action / avatar icons addressed by string key from data.ts ---------------
const CalendarTasks = (p: IconProps) => (
  <Line strokeWidth={1.8} {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18M8 15h3M8 18h6" />
  </Line>
);

const Partners = (p: IconProps) => (
  <Line strokeWidth={1.8} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <circle cx="17" cy="9" r="2.6" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0M15 20a5 5 0 0 1 6-4.8" />
  </Line>
);

const Nutrition = (p: IconProps) => (
  <Line strokeWidth={1.8} {...p}>
    <path d="M12 3a9 9 0 1 0 9 9c0-1.5-4-2-4-5s2-3 2-3a9 9 0 0 0-7-1Z" />
  </Line>
);

const Shield = (p: IconProps) => (
  <Line strokeWidth={1.8} {...p}>
    <circle cx="12" cy="15" r="5" />
    <path d="M9 7l3-4 3 4" />
  </Line>
);

const Lab = (p: IconProps) => (
  <Line strokeWidth={1.8} {...p}>
    <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
    <path d="M9 9v.01M9 12v.01M9 15v.01" />
  </Line>
);

const CalendarCheck = (p: IconProps) => (
  <Line strokeWidth={1.8} {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" />
  </Line>
);

/** Registry for data-driven icons (action cards, expert avatars). */
const REGISTRY: Record<string, (p: IconProps) => ReactNode> = {
  'calendar-tasks': CalendarTasks,
  partners: Partners,
  nutrition: Nutrition,
  shield: Shield,
  lab: Lab,
  'calendar-check': CalendarCheck,
};

/** Renders a registered icon by key; falls back to a circle alert if unknown. */
export function Icon({ name, ...props }: IconProps & { name: string }) {
  const Cmp = REGISTRY[name] ?? AlertCircle;
  return <Cmp {...props} />;
}
