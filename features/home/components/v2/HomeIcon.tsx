// =============================================================================
// features/home/v2 - the homepage design's own icons
// -----------------------------------------------------------------------------
// Exported from the Figma frame "Homepage - New UI" (node 1058:5544) using
// Figma's OWN SVG renderer rather than rebuilt from fillGeometry.
//
// That choice is deliberate. Local reconstruction was tried first and this file
// broke it three different ways at once:
//   1. the vertical flip the other Figma files need is NOT needed here;
//   2. these glyphs are strokes, so the paint sits in `strokes` while `fills` is
//      empty - reading `fills` renders them black on a dark ground;
//   3. GROUP-rooted icons composed their transform ~8.5px out.
// Only 1 of 3 sampled icons matched Figma's export by bounding box, so the
// renderer is the source of truth. Five icons the renderer refused to return
// were rebuilt locally under the verified rules and checked separately.
//
// The id is the glyph's "<y>-<x>" position in the frame, which is exactly what
// the extracted section specs report: a spec line '@[x=228 y=12 ...]' inside a
// section beginning at page y=0 maps to id "12-228".
// =============================================================================

import ICONS from './home-icons.json';

const BASE = '/home/icons';

export const HOME_ICON_IDS = Object.keys(ICONS as Record<string, string>);

export function HomeIcon({ id, className, alt = '' }: { id: string; className?: string; alt?: string }) {
  const file = (ICONS as Record<string, string>)[id];
  if (!file) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[home/v2 HomeIcon] no glyph for id "${id}" - check public/home/icons/`);
    }
    return null;
  }
  return (
    /* Deliberate <img>: tiny static SVGs with the design's colours baked in.
       next/image cannot optimise vector output, so routing them through the
       image pipeline would add a request hop for no gain. */
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${BASE}/${file}`}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}

export default HomeIcon;
