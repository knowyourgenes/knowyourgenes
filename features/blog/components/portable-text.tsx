import type { ReactNode } from 'react';
import { imageUrl } from '@/features/blog';
import type { SanityImage } from '@/features/blog';

/** Props a Portable Text block serializer receives. `value` is the source
 *  block, so `value._key` matches the keys `extractHeadings` records. */
type BlockProps = { children?: ReactNode; value?: { _key?: string } };

// Render map for the Portable Text `body`. Styled with the chrome design tokens
// (the host page provides them via CHROME_VARS) since there's no typography
// plugin. Server-rendered - PortableText needs no client runtime here.
//
// `buildPortableComponents(headingIds)` stamps each h2/h3 with the anchor id
// from `extractHeadings` (keyed by the block's _key) so the sticky quick-nav can
// link to it. `scroll-mt` offsets the anchor jump past the sticky site header.
export function buildPortableComponents(headingIds?: Map<string, string>) {
  const headingId = (value?: { _key?: string }) => (value?._key ? headingIds?.get(value._key) : undefined);
  return {
    types: {
      image: ({ value }: { value: SanityImage }) => {
        const url = imageUrl(value, { width: 1200 });
        if (!url) return null;
        return (
          <figure className="my-9">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={value.alt ?? ''}
              loading="lazy"
              className="w-full rounded-(--r-md) border border-(--ink-line)"
            />
            {value.alt ? (
              <figcaption className="mt-3 text-center text-[13.5px] text-(--ink-3)">{value.alt}</figcaption>
            ) : null}
          </figure>
        );
      },
    },
    block: {
      normal: ({ children }: BlockProps) => (
        <p className="my-5 text-[17px] leading-[1.85] text-(--ink-2)">{children}</p>
      ),
      h2: ({ children, value }: BlockProps) => (
        <h2
          id={headingId(value)}
          className="mt-12 mb-4 scroll-mt-22 text-[26px] font-semibold tracking-[-0.02em] text-(--ink-1)"
        >
          {children}
        </h2>
      ),
      h3: ({ children, value }: BlockProps) => (
        <h3
          id={headingId(value)}
          className="mt-9 mb-3 scroll-mt-22 text-[20px] font-semibold tracking-[-0.015em] text-(--ink-1)"
        >
          {children}
        </h3>
      ),
      blockquote: ({ children }: BlockProps) => (
        <blockquote className="my-7 border-l-[3px] border-(--teal) bg-(--cream-2) py-3 pl-6 pr-4 text-[18px] italic leading-[1.7] text-(--ink-1) rounded-r-(--r-sm)">
          {children}
        </blockquote>
      ),
    },
    marks: {
      strong: ({ children }: { children?: ReactNode }) => (
        <strong className="font-semibold text-(--ink-1)">{children}</strong>
      ),
      em: ({ children }: { children?: ReactNode }) => <em>{children}</em>,
      link: ({ value, children }: { value?: { href?: string }; children?: ReactNode }) => {
        const href = value?.href ?? '#';
        const external = /^https?:\/\//.test(href);
        return (
          <a
            href={href}
            className="text-(--teal) underline decoration-(--teal)/40 underline-offset-[3px] transition-colors hover:text-(--teal-light)"
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {children}
          </a>
        );
      },
    },
    list: {
      bullet: ({ children }: { children?: ReactNode }) => (
        <ul className="my-5 ml-5 list-disc space-y-2 text-[17px] leading-[1.8] text-(--ink-2) marker:text-(--teal)">
          {children}
        </ul>
      ),
      number: ({ children }: { children?: ReactNode }) => (
        <ol className="my-5 ml-5 list-decimal space-y-2 text-[17px] leading-[1.8] text-(--ink-2) marker:text-(--teal)">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }: BlockProps) => <li className="pl-1">{children}</li>,
      number: ({ children }: BlockProps) => <li className="pl-1">{children}</li>,
    },
  };
}

/** Default component map (no heading anchors) for any consumer that doesn't
 *  need the table of contents. */
export const portableComponents = buildPortableComponents();
