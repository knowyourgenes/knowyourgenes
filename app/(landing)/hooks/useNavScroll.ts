import { useEffect } from 'react';

/**
 * Toggles `.is-scrolled` on the sticky nav (`#nav`) once the user has scrolled
 * past 12px. Mirrors the original behaviour from the inlined IIFE in
 * `app/(landing)/page.tsx`.
 */
export function useNavScroll(): void {
  useEffect(() => {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const onScroll = (): void => {
      if (window.scrollY > 12) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
}
