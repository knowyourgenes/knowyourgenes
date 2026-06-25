import type { ReactNode } from 'react';
import { imageUrl } from '@/features/blog';
import type { SanityImage } from '@/features/blog';

// Render map for the Portable Text `body`. Styled with the chrome design tokens
// (the host page provides them via CHROME_VARS) since there's no typography
// plugin. Server-rendered - PortableText needs no client runtime here.
export const portableComponents = {
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
    normal: ({ children }: { children?: ReactNode }) => (
      <p className="my-5 text-[17px] leading-[1.85] text-(--ink-2)">{children}</p>
    ),
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="mt-12 mb-4 text-[26px] font-semibold tracking-[-0.02em] text-(--ink-1)">{children}</h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="mt-9 mb-3 text-[20px] font-semibold tracking-[-0.015em] text-(--ink-1)">{children}</h3>
    ),
    blockquote: ({ children }: { children?: ReactNode }) => (
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
    bullet: ({ children }: { children?: ReactNode }) => <li className="pl-1">{children}</li>,
    number: ({ children }: { children?: ReactNode }) => <li className="pl-1">{children}</li>,
  },
};
