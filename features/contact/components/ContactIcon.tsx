// =============================================================================
// features/contact — the design's own icons
// -----------------------------------------------------------------------------
// Rebuilt from the Figma frame's vector geometry, so shapes and fill colours are
// the design's exactly. The id is the glyph's "<y>-<x>" position in the frame,
// which is what the extracted section specs report — unambiguous and rename-proof.
// Served as static files: colours are baked in (intended), the browser caches
// each glyph once, and none of it costs bundle bytes.
// =============================================================================

import ICONS from './contact-icons.json';

const BASE = '/contact/icons';

export const CONTACT_ICON_IDS = Object.keys(ICONS as Record<string, string>);

export function ContactIcon({ id, className, alt = '' }: { id: string; className?: string; alt?: string }) {
  const file = (ICONS as Record<string, string>)[id];
  if (!file) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[contact/ContactIcon] no glyph for id "${id}" — check public/contact/icons/`);
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
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}

/**
 * The contact page's eyebrow pill — a teal-tinted capsule, NOT the white
 * bordered one the test pages use. Figma: r999, eden@8 ground, 1px eden@16,
 * pad 11/22/11/17, gap 10, shadow 0 6 18 rgba(14,77,75,.08),
 * label Figtree 800 14/21 ls 1.12 (0.08em) #0e4d4b.
 *
 * The glyph is the frame's `span.msym`: a 22x22 LAYOUT box holding a 22x26
 * icon, i.e. the artwork overflows 2px top and bottom and contributes only 22px
 * of height. Letting the 26px glyph size the row instead makes the pill 50 tall
 * where all three frames that use this pill (hero 236x46, form 208x46,
 * self-serve 221x46) are 46 — hence the fixed-height flex box below.
 */
export function ContactEyebrow({ label, icon, className }: { label: string; icon?: string; className?: string }) {
  return (
    <span
      className={
        'inline-flex items-center gap-2.5 rounded-full border border-eden/[0.16] bg-eden/[0.08] py-[11px] pl-[17px] pr-[22px] shadow-[0_6px_18px_0_rgba(14,77,75,0.08)] ' +
        (className ?? '')
      }
    >
      {icon ? (
        <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center">
          <ContactIcon id={icon} className="h-[26px] w-[22px] max-w-none shrink-0" />
        </span>
      ) : null}
      <span className="font-kyg text-[14px] font-extrabold uppercase leading-[21px] tracking-[0.08em] text-eden">
        {label}
      </span>
    </span>
  );
}
