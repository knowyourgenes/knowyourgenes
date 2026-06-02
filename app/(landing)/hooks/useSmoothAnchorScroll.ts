import { useEffect } from 'react';

const HEADER_OFFSET = 80;

/**
 * Intercepts clicks on in-page anchor links (`a[href^="#"]`) and scrolls the
 * target into view with an 80px header offset. Also closes any open mega menu
 * panels so the destination is not covered by a flyout.
 */
export function useSmoothAnchorScroll(): void {
  useEffect(() => {
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    if (links.length === 0) return;

    const handlers: Array<{
      link: HTMLAnchorElement;
      onClick: (e: MouseEvent) => void;
    }> = [];

    links.forEach((link) => {
      const onClick = (e: MouseEvent): void => {
        const id = link.getAttribute('href');
        if (!id || id.length <= 1) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
        // Close any open mega menu panels (mirrors original IIFE behaviour).
        document.querySelectorAll<HTMLElement>('.nav__item[data-mm]').forEach((i) => i.classList.remove('is-open'));
      };
      link.addEventListener('click', onClick);
      handlers.push({ link, onClick });
    });

    return () => {
      handlers.forEach(({ link, onClick }) => {
        link.removeEventListener('click', onClick);
      });
    };
  }, []);
}
