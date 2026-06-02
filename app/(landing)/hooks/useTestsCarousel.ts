import { useEffect } from 'react';

/**
 * Tests carousel + mobile burger menu.
 *
 * The mobile burger menu logic is intentionally included here because in the
 * original IIFE it was nested inside the `if (testsTrack)` block; pulling it
 * out without preserving that nesting would change runtime behaviour on any
 * page that lacks a `#testsTrack` element. Keeping the structure identical
 * means the extraction is a pure refactor.
 */
export function useTestsCarousel(): void {
  useEffect(() => {
    const testsTrack = document.getElementById('testsTrack') as HTMLDivElement | null;
    if (!testsTrack) return;

    const cards = Array.from(testsTrack.querySelectorAll<HTMLElement>('.test-card'));
    const dots = Array.from(document.querySelectorAll<HTMLElement>('.tests__dot'));
    const prevBtn = document.getElementById('testsPrev') as HTMLButtonElement | null;
    const nextBtn = document.getElementById('testsNext') as HTMLButtonElement | null;
    let currentIndex = 0;
    let isProgrammatic = false;
    let scrollTimer: number | null = null;

    const scrollToCard = (index: number): void => {
      const card = cards[index];
      if (!card) return;
      isProgrammatic = true;
      testsTrack.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
      window.setTimeout(() => {
        isProgrammatic = false;
      }, 600);
    };

    const setActive = (index: number): void => {
      currentIndex = Math.max(0, Math.min(cards.length - 1, index));
      cards.forEach((c, i) => c.classList.toggle('is-current', i === currentIndex));
      dots.forEach((d, i) => {
        const on = i === currentIndex;
        d.classList.toggle('is-active', on);
        d.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex === cards.length - 1;
    };

    const goTo = (index: number): void => {
      setActive(index);
      scrollToCard(currentIndex);
    };

    const findClosestCardIndex = (): number => {
      const trackRect = testsTrack.getBoundingClientRect();
      const centerX = trackRect.left + trackRect.width / 2;
      let closest = 0;
      let minDist = Infinity;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const d = Math.abs(cx - centerX);
        if (d < minDist) {
          minDist = d;
          closest = i;
        }
      });
      return closest;
    };

    const onTrackScroll = (): void => {
      if (isProgrammatic) return;
      if (scrollTimer !== null) window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        const idx = findClosestCardIndex();
        if (idx !== currentIndex) setActive(idx);
      }, 90);
    };
    testsTrack.addEventListener('scroll', onTrackScroll, { passive: true });

    const dotHandlers: Array<{ dot: HTMLElement; onClick: () => void }> = [];
    dots.forEach((dot) => {
      const onClick = (): void => {
        const raw = dot.dataset.index ?? '0';
        goTo(parseInt(raw, 10));
      };
      dot.addEventListener('click', onClick);
      dotHandlers.push({ dot, onClick });
    });

    const onPrev = (): void => goTo(currentIndex - 1);
    const onNext = (): void => goTo(currentIndex + 1);
    if (prevBtn) prevBtn.addEventListener('click', onPrev);
    if (nextBtn) nextBtn.addEventListener('click', onNext);

    const onTrackKeydown = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(currentIndex + 1);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(currentIndex - 1);
      }
    };
    testsTrack.addEventListener('keydown', onTrackKeydown);
    testsTrack.setAttribute('tabindex', '0');

    const equalizeHeights = (): void => {
      cards.forEach((c) => {
        c.style.minHeight = '';
      });
      window.requestAnimationFrame(() => {
        let max = 0;
        cards.forEach((c) => {
          max = Math.max(max, c.scrollHeight);
        });
        cards.forEach((c) => {
          c.style.minHeight = max + 'px';
        });
      });
    };

    setActive(0);
    equalizeHeights();
    const equalizeTimer = window.setTimeout(equalizeHeights, 300);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(equalizeHeights);
    }

    let resizeTimer: number | null = null;
    const onResize = (): void => {
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        equalizeHeights();
        isProgrammatic = true;
        testsTrack.scrollLeft = cards[currentIndex] ? cards[currentIndex].offsetLeft : 0;
        window.setTimeout(() => {
          isProgrammatic = false;
        }, 200);
      }, 120);
    };
    window.addEventListener('resize', onResize);

    // ===== Mobile burger menu =====
    // Nested here to preserve the exact runtime behaviour of the original IIFE
    // (the burger setup only ran when `#testsTrack` was present).
    const burgerBtn = document.getElementById('burger') as HTMLButtonElement | null;
    const navEl = document.getElementById('nav');
    let burgerCleanup: (() => void) | null = null;
    if (burgerBtn && navEl) {
      const setOpen = (open: boolean): void => {
        navEl.classList.toggle('is-menu-open', open);
        burgerBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.documentElement.style.overflow = open ? 'hidden' : '';
      };
      const onBurgerClick = (): void => {
        setOpen(!navEl.classList.contains('is-menu-open'));
      };
      burgerBtn.addEventListener('click', onBurgerClick);

      const closeOnClick = (): void => setOpen(false);
      const navLinks = Array.from(navEl.querySelectorAll<HTMLElement>('.nav__link, .nav__cta a, .megamenu a'));
      navLinks.forEach((el) => el.addEventListener('click', closeOnClick));

      const onEscape = (e: KeyboardEvent): void => {
        if (e.key === 'Escape' && navEl.classList.contains('is-menu-open')) {
          setOpen(false);
        }
      };
      document.addEventListener('keydown', onEscape);

      const onBurgerResize = (): void => {
        if (window.innerWidth > 720 && navEl.classList.contains('is-menu-open')) {
          setOpen(false);
        }
      };
      window.addEventListener('resize', onBurgerResize);

      burgerCleanup = () => {
        burgerBtn.removeEventListener('click', onBurgerClick);
        navLinks.forEach((el) => el.removeEventListener('click', closeOnClick));
        document.removeEventListener('keydown', onEscape);
        window.removeEventListener('resize', onBurgerResize);
      };
    }

    return () => {
      testsTrack.removeEventListener('scroll', onTrackScroll);
      dotHandlers.forEach(({ dot, onClick }) => dot.removeEventListener('click', onClick));
      if (prevBtn) prevBtn.removeEventListener('click', onPrev);
      if (nextBtn) nextBtn.removeEventListener('click', onNext);
      testsTrack.removeEventListener('keydown', onTrackKeydown);
      window.removeEventListener('resize', onResize);
      if (scrollTimer !== null) window.clearTimeout(scrollTimer);
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      window.clearTimeout(equalizeTimer);
      if (burgerCleanup) burgerCleanup();
    };
  }, []);
}
