// =============================================================================
// features/tests - the design's own icons
// -----------------------------------------------------------------------------
// These are NOT a third-party icon set. Every glyph under
// /public/tests/womens-health/icons/ was rebuilt from the Figma frame's own
// vector geometry, so the shapes and their fill colours are the design's, exactly.
//
// The id is the glyph's position in the frame: "<y>-<x>", which is precisely
// what the extracted section specs report. So a spec line reading
//     FRAME 'span.msym' @[x=1023 y=483 ...]
// maps to <FigmaIcon id="483-1023" />. Unambiguous, and it survives renames.
//
// They render as <img> against a static file rather than inline SVG: the colours
// are baked in (which is what we want here), the browser caches each glyph once
// even though several repeat across the page, and none of it costs bundle bytes.
// =============================================================================

import ICONS from './figma-icons.json';

const BASE = '/tests/womens-health/icons';

/** Every id present on disk - exported so a data file can be validated. */
export const FIGMA_ICON_IDS = Object.keys(ICONS as Record<string, string>);

export function FigmaIcon({
  id,
  className,
  size,
  alt = '',
}: {
  /** "<y>-<x>" from the section spec, e.g. "483-1023". */
  id: string;
  className?: string;
  size?: number;
  alt?: string;
}) {
  const file = (ICONS as Record<string, string>)[id];
  if (!file) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[tests/FigmaIcon] no glyph for id "${id}" - check public/tests/womens-health/icons/`);
    }
    return null;
  }
  return (
    /* Deliberate <img>: these are tiny static SVGs with baked-in colours.
       next/image cannot optimise vector output, so routing them through the
       image pipeline would add a request hop and cost for no gain. */
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${BASE}/${file}`}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}

export default FigmaIcon;
