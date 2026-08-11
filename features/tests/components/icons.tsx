// =============================================================================
// features/tests — icon registry
// -----------------------------------------------------------------------------
// Data files reference icons by STRING KEY (`IconKey`), never by import, so a
// new test page can pick an icon without touching a component. Everything here
// is a lucide glyph: the Figma frame uses a 1.75px-stroke rounded set, which
// lucide matches at `strokeWidth={1.75}`.
//
// Adding an icon = add one line to REGISTRY. Unknown keys render nothing (and
// warn in dev) rather than crashing the page.
// =============================================================================

import type { ComponentType } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Award,
  Baby,
  BadgeCheck,
  Bone,
  Box,
  Brain,
  Calendar,
  ChartNoAxesCombined,
  CheckCircle2,
  Clock,
  Cross,
  Droplet,
  FileText,
  Film,
  FlaskConical,
  Frown,
  HeartCrack,
  Hourglass,
  Lock,
  type LucideProps,
  Microscope,
  Moon,
  Network,
  PersonStanding,
  PiggyBank,
  Rocket,
  Scale,
  ScanHeart,
  Share2,
  ShieldCheck,
  Smile,
  Sparkles,
  Sprout,
  Star,
  Target,
  Truck,
  Users,
  X,
  Zap,
} from 'lucide-react';

const REGISTRY: Record<string, ComponentType<LucideProps>> = {
  activity: Activity,
  alert: AlertTriangle,
  'arrow-down': ArrowDown,
  'arrow-right': ArrowRight,
  award: Award,
  baby: Baby,
  'badge-check': BadgeCheck,
  bone: Bone,
  box: Box,
  brain: Brain,
  calendar: Calendar,
  chart: ChartNoAxesCombined,
  check: CheckCircle2,
  clock: Clock,
  cross: Cross,
  droplet: Droplet,
  family: Network,
  file: FileText,
  film: Film,
  flask: FlaskConical,
  frown: Frown,
  hourglass: Hourglass,
  lock: Lock,
  microscope: Microscope,
  moon: Moon,
  person: PersonStanding,
  piggy: PiggyBank,
  'pregnancy-loss': HeartCrack,
  rocket: Rocket,
  scale: Scale,
  'scan-heart': ScanHeart,
  share: Share2,
  shield: ShieldCheck,
  smile: Smile,
  sparkles: Sparkles,
  sprout: Sprout,
  star: Star,
  target: Target,
  truck: Truck,
  users: Users,
  x: X,
  zap: Zap,
};

export function Icon({
  name,
  className,
  strokeWidth = 1.75,
}: {
  name?: string;
  className?: string;
  strokeWidth?: number;
}) {
  if (!name) return null;
  const Glyph = REGISTRY[name];
  if (!Glyph) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[tests/icons] unknown icon key "${name}" — add it to REGISTRY in icons.tsx`);
    }
    return null;
  }
  return <Glyph className={className} strokeWidth={strokeWidth} aria-hidden />;
}

export const ICON_KEYS = Object.keys(REGISTRY);

/** Kept as a named export for `Categories.tsx`, which predates the registry. */
export function Arrow({ className }: { className?: string }) {
  return <ArrowRight className={className} strokeWidth={1.75} aria-hidden />;
}
