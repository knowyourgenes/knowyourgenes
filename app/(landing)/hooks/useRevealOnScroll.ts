import { useEffect } from 'react';

/**
 * Adds `.is-in` to elements matching `.reveal` or `.reveal-r` once they enter
 * the viewport via IntersectionObserver. Falls back to revealing everything
 * immediately when IntersectionObserver is unavailable.
 */
export function useRevealOnScroll(): void {
  useEffect(() => {
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.reveal, .reveal-r'));
    if (reveals.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.05 }
    );
    reveals.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
    };
  }, []);
}
