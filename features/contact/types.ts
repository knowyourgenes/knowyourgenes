/** Glyph id — the "<y>-<x>" position of the icon in the Figma contact frame. */
export type ContactIconId = string;

export interface HeroChip {
  label: string;
  icon: ContactIconId;
  /** `sea` tints the glyph green, matching the "Reviewed by…" chip in the frame. */
  tone?: 'eden' | 'sea';
}

export interface Channel {
  kicker: string;
  title: string;
  body: string;
  icon: ContactIconId;
  /** Wraps the whole card in a link when present. */
  href?: string;
  /** `inverted` = the eden card at the bottom of the column. */
  tone?: 'default' | 'inverted';
  /** The lab and response cards run a smaller title than the first two. */
  titleSize?: 'md' | 'sm';
}

export interface SelfServeCard {
  title: string;
  body: string;
  icon: ContactIconId;
  href: string;
}

/** Discriminated result returned by the contact API to the form. */
export type ContactSubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string> };
