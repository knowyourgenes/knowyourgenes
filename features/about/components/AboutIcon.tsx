// =============================================================================
// features/about — the design's own icons
// -----------------------------------------------------------------------------
// Rebuilt from the Figma frame's vector geometry (same pipeline as the tests and
// contact pages, including the verified vertical-flip correction), so shapes and
// baked-in fill colours are the design's exactly.
//
// The id is the glyph's "<y>-<x>" position in the frame, which is precisely what
// the extracted section specs report: a spec line '@[x=213 y=298 ...]' inside a
// section that starts at page y=75 maps to id "373-213".
// =============================================================================

import ICONS from './about-icons.json';

const BASE = '/about/icons';

export const ABOUT_ICON_IDS = Object.keys(ICONS as Record<string, string>);

export function AboutIcon({
  id,
  className,
  alt = '',
}: {
  id: string;
  className?: string;
  alt?: string;
}) {
  const file = (ICONS as Record<string, string>)[id];
  if (!file) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[about/AboutIcon] no glyph for id "${id}" — check public/about/icons/`);
    }
    return null;
  }
  return (
    /* Deliberate <img>: tiny static SVGs with baked-in colours. next/image cannot
       optimise vector output, so the image pipeline would add a hop for no gain. */
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

export default AboutIcon;
