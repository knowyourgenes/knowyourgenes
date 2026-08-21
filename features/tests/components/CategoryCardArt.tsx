// =============================================================================
// features/tests - card artwork for the category + product cards
// -----------------------------------------------------------------------------
// One component so a card never has to know whether its test has a photograph.
// Pass the product's `image`, `icon` and `tone`:
//
//   image set     -> the photograph, cropped to the caller's aspect ratio
//   image absent  -> a branded tone tile carrying the test's own glyph
//
// Five of the nine Wellness tests are still on placeholder stubs (see the note
// in lib/categoriesdata.ts), so the tile is a real state the grid ships in - not
// a dev-only stand-in. It is drawn to read as a deliberate mark rather than a
// broken image: full-bleed brand gradient, the glyph in a soft chip dead centre,
// and an oversized ghost copy of the same glyph bleeding out of the corner.
//
// The glyph chip renders on photo cards too, so nine cards scan as one set.
// =============================================================================

import Image from 'next/image';
import type { CardTone } from '@/lib/categoriesdata';
import type { Img } from '../types';
import { Icon } from './icons';

/**
 * Tone gradients. Teal/moss/rose are the brand's own (eden, spring, womens);
 * amber, indigo and night are muted neighbours added so nine cards don't repeat
 * three colours. All are dark enough for white glyphs at AA.
 */
const TONE_WASH: Record<CardTone, string> = {
  teal: 'bg-[linear-gradient(135deg,#0E4D4B_0%,#157C77_100%)]',
  moss: 'bg-[linear-gradient(135deg,#2F8C5C_0%,#25B5AB_100%)]',
  rose: 'bg-[linear-gradient(135deg,#9A2855_0%,#C0432F_100%)]',
  amber: 'bg-[linear-gradient(135deg,#8A5A16_0%,#C08A2E_100%)]',
  indigo: 'bg-[linear-gradient(135deg,#2A3F7A_0%,#4A63A8_100%)]',
  night: 'bg-[linear-gradient(135deg,#1F2E3D_0%,#3C5468_100%)]',
};

export function CardArt({
  image,
  icon,
  tone,
  sizes,
  className = '',
  priority = false,
}: {
  image?: Img;
  icon: string;
  tone: CardTone;
  /** Required when `image` is set - these are 9–11 MB source PNGs. */
  sizes: string;
  /** Caller owns aspect ratio + corner radius. */
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative isolate overflow-hidden ${image ? 'bg-zeus/[0.06]' : TONE_WASH[tone]} ${className}`}>
      {image ? (
        <>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {/* Keeps the white glyph chip legible over a bright crop. */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(15,32,30,0.42),transparent)]"
          />
        </>
      ) : (
        <Icon
          name={icon}
          strokeWidth={1.1}
          className="pointer-events-none absolute -right-7 -bottom-9 h-[152px] w-[152px] text-white/[0.13]"
        />
      )}

      {/* The mark. Centred on a tile, tucked into the corner over a photo. */}
      <span
        className={
          image
            ? 'absolute left-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-white/25 bg-white/20 backdrop-blur-[3px]'
            : 'absolute left-1/2 top-1/2 inline-flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-sm border border-white/25 bg-white/[0.14]'
        }
      >
        <Icon name={icon} className={image ? 'h-[18px] w-[18px] text-white' : 'h-7 w-7 text-white'} />
      </span>
    </div>
  );
}
