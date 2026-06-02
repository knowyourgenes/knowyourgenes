import { useEffect } from 'react';

/**
 * rAF-throttled parallax for `.parallax`, `.parallax-cta`, and `#heroImg`.
 * The CTA parallax preserves any existing 3D tilt (read from `--tilt`) so the
 * floating photos in the final CTA keep their angled look.
 */
export function useParallax(): void {
  useEffect(() => {
    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('.parallax'));
    const ctaParallaxEls = Array.from(document.querySelectorAll<HTMLElement>('.parallax-cta'));
    const heroImg = document.getElementById('heroImg');
    let ticking = false;

    const applyParallax = (): void => {
      const sy = window.scrollY;
      const winH = window.innerHeight;
      parallaxEls.forEach((el) => {
        const parent = el.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        if (rect.bottom > -200 && rect.top < winH + 200) {
          const center = rect.top + rect.height / 2;
          const progress = (center - winH / 2) / ((winH + rect.height) / 2);
          const clamped = Math.max(-1, Math.min(1, progress));
          const speed = parseFloat(el.dataset.speed ?? '') || 0.14;
          const offset = -clamped * (48 + speed * 100);
          el.style.transform = `translate3d(0, ${Math.round(offset)}px, 0)`;
        }
      });
      ctaParallaxEls.forEach((el) => {
        const section = el.closest('.finalcta');
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.bottom > -300 && rect.top < winH + 300) {
          const center = rect.top + rect.height / 2;
          const progress = (center - winH / 2) / ((winH + rect.height) / 2);
          const clamped = Math.max(-1, Math.min(1, progress));
          const speed = parseFloat(el.dataset.ctaSpeed ?? '') || 0.12;
          const offset = -clamped * (80 + speed * 200);
          const tilt = getComputedStyle(el).getPropertyValue('--tilt').trim() || '';
          el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0) ${tilt}`;
        }
      });
      if (heroImg) {
        const o = Math.min(sy * 0.32, 180);
        heroImg.style.transform = `translate3d(0, ${Math.round(o)}px, 0) scale(1.04)`;
      }
      ticking = false;
    };

    const onParallaxScroll = (): void => {
      if (!ticking) {
        window.requestAnimationFrame(applyParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onParallaxScroll, { passive: true });
    window.addEventListener('resize', applyParallax);
    applyParallax();

    return () => {
      window.removeEventListener('scroll', onParallaxScroll);
      window.removeEventListener('resize', applyParallax);
    };
  }, []);
}
