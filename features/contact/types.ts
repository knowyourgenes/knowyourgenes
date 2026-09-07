/**
 * Discriminated result the contact API hands back to the form.
 *
 * The three shape types that used to live here - HeroChip, Channel,
 * SelfServeCard - went with the sections that used them. They described a
 * layout the frame no longer draws, and each carried a `ContactIconId`: a
 * glyph keyed by its "<y>-<x>" position on the OLD artboard. Position-keyed
 * ids cannot survive a redraw, which is exactly what happened; the icons are
 * inline paths in the shared `Icon` set now, addressed by name.
 */
export type ContactSubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string> };
