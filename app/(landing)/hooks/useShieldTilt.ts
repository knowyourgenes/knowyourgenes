import { useEffect } from 'react';

const MAX_TILT = 14; // degrees

/**
 * Cursor-follow 3D tilt for `.privacy__shield`. Updates the `--rx` and `--ry`
 * CSS custom properties with an eased rAF follow so motion feels buttery.
 */
export function useShieldTilt(): void {
  useEffect(() => {
    const shield = document.querySelector<HTMLElement>('.privacy__shield');
    if (!shield) return;

    let raf: number | null = null;
    let rxTarget = 0;
    let ryTarget = 0;
    let rxCurrent = 0;
    let ryCurrent = 0;

    const animate = (): void => {
      rxCurrent += (rxTarget - rxCurrent) * 0.12;
      ryCurrent += (ryTarget - ryCurrent) * 0.12;
      shield.style.setProperty('--rx', rxCurrent.toFixed(2) + 'deg');
      shield.style.setProperty('--ry', ryCurrent.toFixed(2) + 'deg');
      if (Math.abs(rxTarget - rxCurrent) > 0.01 || Math.abs(ryTarget - ryCurrent) > 0.01) {
        raf = requestAnimationFrame(animate);
      } else {
        raf = null;
      }
    };

    const onMove = (e: MouseEvent): void => {
      const rect = shield.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (window.innerWidth / 2);
      const dy = (e.clientY - cy) / (window.innerHeight / 2);
      const nx = Math.max(-1, Math.min(1, dx));
      const ny = Math.max(-1, Math.min(1, dy));
      ryTarget = nx * MAX_TILT;
      rxTarget = -ny * MAX_TILT;
      if (raf === null) raf = requestAnimationFrame(animate);
    };
    const onEnter = (): void => {
      shield.style.transition = 'none';
    };
    const onLeave = (): void => {
      rxTarget = 0;
      ryTarget = 0;
      if (raf === null) raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    shield.addEventListener('mouseenter', onEnter);
    shield.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      shield.removeEventListener('mouseenter', onEnter);
      shield.removeEventListener('mouseleave', onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);
}
