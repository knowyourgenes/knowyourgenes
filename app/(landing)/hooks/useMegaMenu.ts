import { useEffect } from 'react';

/**
 * Wires up the mega menu (`.nav__item[data-mm]`):
 * - Hover open/close with a small close delay so cursor travel feels smooth.
 * - Click on `.nav__link` toggles the panel.
 * - Outside click and the Escape key close every panel.
 */
export function useMegaMenu(): void {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('.nav__item[data-mm]'));
    if (items.length === 0) return;

    let openTimer: ReturnType<typeof setTimeout> | undefined;

    type ItemHandlers = {
      item: HTMLElement;
      link: HTMLElement | null;
      open: () => void;
      close: () => void;
      onLinkClick: (e: Event) => void;
    };

    const closeAll = (): void => {
      items.forEach((i) => i.classList.remove('is-open'));
    };

    const handlers: ItemHandlers[] = items.map((item) => {
      const open = (): void => {
        if (openTimer !== undefined) clearTimeout(openTimer);
        items.forEach((i) => {
          if (i !== item) i.classList.remove('is-open');
        });
        item.classList.add('is-open');
      };
      const close = (): void => {
        openTimer = setTimeout(() => item.classList.remove('is-open'), 140);
      };
      const link = item.querySelector<HTMLElement>('.nav__link');
      const onLinkClick = (e: Event): void => {
        e.preventDefault();
        if (item.classList.contains('is-open')) {
          item.classList.remove('is-open');
        } else {
          items.forEach((i) => i.classList.remove('is-open'));
          item.classList.add('is-open');
        }
      };

      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', close);
      if (link) {
        link.addEventListener('focus', open);
        link.addEventListener('click', onLinkClick);
      }

      return { item, link, open, close, onLinkClick };
    });

    const onDocClick = (e: MouseEvent): void => {
      const target = e.target as Element | null;
      if (!target || !target.closest('.nav__item')) closeAll();
    };
    const onKeydown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') closeAll();
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKeydown);

    return () => {
      if (openTimer !== undefined) clearTimeout(openTimer);
      handlers.forEach(({ item, link, open, close, onLinkClick }) => {
        item.removeEventListener('mouseenter', open);
        item.removeEventListener('mouseleave', close);
        if (link) {
          link.removeEventListener('focus', open);
          link.removeEventListener('click', onLinkClick);
        }
      });
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKeydown);
    };
  }, []);
}
