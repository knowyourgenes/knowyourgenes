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
  AirVent,
  AlertTriangle,
  Apple,
  ArrowDown,
  ArrowRight,
  Award,
  Baby,
  BadgeCheck,
  Bandage,
  BatteryLow,
  Biohazard,
  Bone,
  Bug,
  Box,
  Brain,
  CakeSlice,
  Calendar,
  ChartNoAxesCombined,
  CheckCircle2,
  Cigarette,
  Circle,
  CircleDot,
  Clock,
  Coffee,
  Cookie,
  Cross,
  Dna,
  Droplet,
  Dumbbell,
  Eye,
  EyeOff,
  FileText,
  Film,
  Fish,
  FlaskConical,
  Flame,
  Frown,
  Gem,
  Glasses,
  Globe,
  Grid2x2,
  HeartCrack,
  HeartPulse,
  Hourglass,
  Leaf,
  Lock,
  type LucideProps,
  Maximize2,
  Microscope,
  MilkOff,
  Moon,
  Network,
  Orbit,
  PersonStanding,
  PiggyBank,
  Pill,
  Ratio,
  Receipt,
  Rocket,
  Salad,
  Scale,
  ScanHeart,
  Scissors,
  Share2,
  ShieldCheck,
  ShieldPlus,
  Smile,
  Sparkles,
  Sprout,
  Star,
  Stethoscope,
  Sun,
  Target,
  Thermometer,
  Trophy,
  Truck,
  Users,
  Waves,
  Wheat,
  Wine,
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

  // ---- added for the Eye / Kidney / Men's / Skin panels -------------------
  acne: CircleDot,
  air: AirVent,
  alcohol: Wine,
  apple: Apple,
  caffeine: Coffee,
  cataract: Circle,
  cellulite: Grid2x2,
  cigarette: Cigarette,
  cyst: Orbit,
  dairy: MilkOff,
  dna: Dna,
  dumbbell: Dumbbell,
  eye: Eye,
  'eye-off': EyeOff,
  fish: Fish,
  flame: Flame,
  gem: Gem,
  glasses: Glasses,
  globe: Globe,
  gluten: Wheat,
  heart: HeartPulse,
  leaf: Leaf,
  omega: Fish,
  pressure: Ratio,
  receipt: Receipt,
  salad: Salad,
  salt: Sparkles,
  scissors: Scissors,
  'shield-plus': ShieldPlus,
  stretch: Maximize2,
  stroller: Baby,
  sugar: Cookie,
  sun: Sun,
  texture: Waves,
  tired: BatteryLow,
  trophy: Trophy,
  wrinkle: CakeSlice,

  // ---- added for the Immunity panel --------------------------------------
  bandage: Bandage,
  biohazard: Biohazard,
  pill: Pill,
  sick: Thermometer,
  stethoscope: Stethoscope,
  virus: Bug,
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
