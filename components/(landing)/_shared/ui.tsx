import type { ReactNode } from 'react';

/* Shared primitives + scoped stylesheet for the PCOS landing page.
 * Everything lives under the `.kyg-lx` root class so nothing leaks globally. */

/** Teal "sheen" gradient used for accent words (hero, why-test, before/after). */
export const gTeal = (deg: number) =>
  `linear-gradient(${deg}deg,#0E4D4B 0%,#15605D 0%,#25B5AB 50%,#15605D 100%,#0E4D4B 100%)`;

/** Copper→teal gradient used for "THADA gene" / "managing blindly". */
export const gCopper = (deg: number) =>
  `linear-gradient(${deg}deg,#C76842 0%,#D4895E 0%,#0E4D4B 91%,#25B5AB 100%)`;

/** 1200px content column, centred with a 120px desktop gutter (matches Figma). */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1440px] px-6 sm:px-10 md:px-16 lg:px-[120px] ${className}`}>
      {children}
    </div>
  );
}

/** Pill label above each section heading. */
export function Eyebrow({
  children,
  icon,
  tone = 'light',
  className = '',
}: {
  children: ReactNode;
  icon: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const light = tone === 'light';
  return (
    <span
      className={`inline-flex items-center gap-[9px] rounded-full border py-[7.5px] pl-[13px] pr-[17px] ${
        light
          ? 'border-[rgba(14,77,75,0.12)] bg-[rgba(14,77,75,0.07)]'
          : 'border-[rgba(248,228,204,0.2)] bg-[rgba(248,228,204,0.12)]'
      } ${className}`}
    >
      <span className={`grid size-[19px] shrink-0 place-items-center ${light ? 'text-[#0E4D4B]' : 'text-[#F3D5B2]'}`}>
        {icon}
      </span>
      <span
        className={`text-[13.5px] font-bold uppercase leading-[20.25px] tracking-[0.1em] ${
          light ? 'text-[#0E4D4B]' : 'text-[#F3D5B2]'
        }`}
      >
        {children}
      </span>
    </span>
  );
}

/** Text with a clipped gradient fill. */
export function GradientText({
  children,
  image,
  className = '',
}: {
  children: ReactNode;
  image: string;
  className?: string;
}) {
  return (
    <span className={`bg-clip-text text-transparent ${className}`} style={{ backgroundImage: image }}>
      {children}
    </span>
  );
}

/** Primary pill CTA with the animated sheen sweep. */
export function SheenButton({
  children,
  href = '#check',
  tone = 'dark',
  className = '',
}: {
  children: ReactNode;
  href?: string;
  tone?: 'dark' | 'light' | 'eden';
  className?: string;
}) {
  const tones = {
    dark: 'bg-[#1F1A14] text-[#FAF6EF] shadow-[0_10px_28px_rgba(31,26,20,0.18)]',
    light: 'bg-[#FAF6EF] text-[#1F1A14] shadow-[0_18px_44px_rgba(0,0,0,0.18)]',
    eden: 'bg-[#0E4D4B] text-[#FAF6EF] shadow-[0_12px_30px_rgba(14,77,75,0.28)]',
  };
  return (
    <a
      href={href}
      className={`sheen group relative inline-flex items-center justify-center gap-[10px] overflow-hidden rounded-full px-[28px] py-[16px] text-[15px] font-semibold leading-[22.5px] transition-transform duration-200 hover:-translate-y-[2px] ${tones[tone]} ${className}`}
    >
      <span className="relative z-[1] inline-flex items-center gap-[10px]">
        {children}
        <FigIcon src="/landing/_icons/arrow.svg" className="size-[19px]" />
      </span>
    </a>
  );
}

/** Secondary text link CTA (e.g. "What is PCOS, really?"). */
export function GhostButton({ children, href = '#what' }: { children: ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-[8px] rounded-full px-[8px] py-[8px] text-[15px] font-semibold text-[#1F1A14] transition-colors hover:text-[#0E4D4B]"
    >
      {children}
      <FigIcon src="/landing/_icons/arrow.svg" className="size-[19px] transition-transform group-hover:translate-x-[3px]" />
    </a>
  );
}

/** Renders an exact Figma icon SVG as a CSS mask over `currentColor`, so the
 *  glyph comes from Figma while the colour comes from the surrounding
 *  `text-[…]` class (e.g. `<FigIcon src="/landing/_icons/x.svg" className="size-[19px] text-[#0E4D4B]" />`). */
export function FigIcon({ src, className = '' }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  );
}

/** The page’s scoped stylesheet — tokens, fonts, reveal + sheen + accordion. */
export function LandingStyles() {
  return (
    <style>{`
.kyg-lx{
  font-family: var(--font-figtree), ui-sans-serif, system-ui, -apple-system, sans-serif;
  background:#FAF6EF;
  color:#1F1A14;
  -webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;
}
.kyg-lx .font-hind{ font-family: var(--font-hind), var(--font-figtree), sans-serif; font-feature-settings:"tnum" 1; }
.kyg-lx ::selection{ background:#0E4D4B; color:#FAF6EF; }
.kyg-lx a{ -webkit-tap-highlight-color:transparent; }
.kyg-lx [id]{ scroll-margin-top:96px; }

/* scroll reveal */
.kyg-lx .reveal,.kyg-lx .reveal-r{ opacity:0; transform:translateY(20px); transition:opacity .7s cubic-bezier(.22,.7,.2,1), transform .7s cubic-bezier(.22,.7,.2,1); will-change:opacity,transform; }
.kyg-lx .reveal-r{ transform:translateX(26px); }
.kyg-lx .reveal.is-in,.kyg-lx .reveal-r.is-in{ opacity:1; transform:none; }

/* sheen sweep on primary buttons */
.kyg-lx .sheen::after{ content:""; position:absolute; top:0; bottom:0; left:-65%; width:42%; background:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.28) 50%,rgba(255,255,255,0) 100%); transform:skewX(-14deg); transition:left .65s ease; pointer-events:none; z-index:0; }
.kyg-lx .sheen:hover::after{ left:135%; }

/* FAQ accordion (native <details>) */
.kyg-lx details.faq summary{ list-style:none; cursor:pointer; }
.kyg-lx details.faq summary::-webkit-details-marker{ display:none; }
.kyg-lx details.faq .faq-plus{ transition:transform .3s cubic-bezier(.22,.7,.2,1); }
.kyg-lx details.faq[open] .faq-plus{ transform:rotate(45deg); }
.kyg-lx details.faq .faq-answer{ display:grid; grid-template-rows:0fr; transition:grid-template-rows .32s ease; }
.kyg-lx details.faq[open] .faq-answer{ grid-template-rows:1fr; }
.kyg-lx details.faq .faq-answer>div{ overflow:hidden; }

/* symptom checkbox tick */
.kyg-lx .sx-tick{ opacity:0; transform:scale(.6); transition:opacity .18s ease, transform .18s ease; }
.kyg-lx .sx-row[data-on="true"] .sx-tick{ opacity:1; transform:scale(1); }
.kyg-lx .sx-row[data-on="true"] .sx-box{ background:#0E4D4B; border-color:#0E4D4B; }
.kyg-lx .sx-box{ transition:background .2s ease, border-color .2s ease; }

/* slow drift for decorative blobs */
@keyframes pcos-spin{ to{ transform:rotate(360deg); } }
.kyg-lx .spin-slow{ animation:pcos-spin 36s linear infinite; }
@keyframes pcos-float{ 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-7px); } }
.kyg-lx .float-slow{ animation:pcos-float 6s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce){
  .kyg-lx .reveal,.kyg-lx .reveal-r{ opacity:1 !important; transform:none !important; transition:none; }
  .kyg-lx .sheen::after{ display:none; }
  .kyg-lx .spin-slow,.kyg-lx .float-slow{ animation:none; }
}
`}</style>
  );
}
