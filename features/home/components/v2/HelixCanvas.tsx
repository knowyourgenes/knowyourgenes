'use client';

// =============================================================================
// Homepage — PARTICLE HELIX
// -----------------------------------------------------------------------------
// A direct port of `makeHelix` from the designer's build ("New Homepage Build/
// index.html", section 7 of its script). Two instances run on the page:
//
//   hero      #helix   — the large strand behind the hero portrait
//   final cta #helix2  — a smaller, dimmer strand behind the closing panel
//
// The maths is reproduced EXACTLY, constant for constant, because the Figma
// frame was traced from this page: the particle count, the turn count and the
// per-particle depth shading are what give the strand its silhouette, and
// changing any of them changes the picture the designer signed off.
//
// WHY A CANVAS AND NOT AN SVG/CSS EFFECT: every particle is drawn from one
// cached radial-gradient sprite composited with `lighter`, so overlapping
// particles ADD their light. That additive bloom is the whole look and there is
// no CSS equivalent — `mix-blend-mode:screen` on 340 DOM nodes is not viable.
//
// TWO BEHAVIOURS WORTH KNOWING BEFORE EDITING:
//   * The pointer does not push the particles directly. A smoothed cursor (mx,
//     my) chases the real one at 0.14/frame and its influence (`pull`) eases in
//     and out at 0.07/frame, so moving the mouse in never produces a hard kick.
//     The repulsion itself is smoothstepped for the same reason.
//   * Particles are sprung back to their ideal helix position rather than
//     assigned to it, and velocity is clamped at 30px/frame, so the strand
//     recovers its shape without ringing.
//
// prefers-reduced-motion draws ONE static frame and never starts the loop.
// =============================================================================

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

/** Every tunable from the source, with its default. `*N` values apply below 760px. */
export type HelixConfig = {
  /** horizontal axis of the strand, as a fraction of canvas width */
  ax: number;
  /** radius as a fraction of width, capped by radMax */
  rad: number;
  radMax: number;
  /** how many full twists over the canvas height */
  turns: number;
  /** particles per strand (there are two strands) */
  per: number;
  speed: number;
  /** global dimmer, 0..1 */
  dim: number;
  /** pointer repulsion radius in px */
  repel: number;
  /** pointer repulsion strength */
  force: number;
  /** ambient drifting motes */
  motes: number;
  /** draw a base-pair rung every N particles */
  rung: number;
  axN?: number;
  radN?: number;
  radMaxN?: number;
  dimN?: number;
};

const DEFAULTS: HelixConfig = {
  ax: 0.62,
  rad: 0.17,
  radMax: 210,
  turns: 4.4,
  per: 98,
  speed: 0.055,
  dim: 1,
  repel: 165,
  force: 16,
  motes: 34,
  rung: 5,
};

/** Hero strand — tall, tight, bright. */
export const HERO_HELIX: Partial<HelixConfig> = {
  ax: 0.63,
  rad: 0.055,
  radMax: 80,
  turns: 5.0,
  per: 170,
  speed: 0.05,
  dim: 1,
  motes: 14,
  rung: 4,
  repel: 190,
  force: 7.5,
  axN: 0.8,
  radN: 0.1,
  radMaxN: 52,
  dimN: 0.5,
};

/** Closing-panel strand — centred, slower, dimmer so the CTA stays dominant. */
export const FINAL_HELIX: Partial<HelixConfig> = {
  ax: 0.5,
  rad: 0.05,
  radMax: 66,
  turns: 3.4,
  per: 120,
  speed: 0.038,
  dim: 0.62,
  motes: 10,
  rung: 4,
  axN: 0.5,
  radN: 0.1,
  radMaxN: 44,
  dimN: 0.4,
};

type Particle = { s: number; u: number; x: number; y: number; vx: number; vy: number; z: number };
type Mote = { u: number; w: number; ph: number; sp: number };

export function HelixCanvas({
  config,
  className,
}: {
  config: Partial<HelixConfig>;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  // Read ONCE, at mount, via lazy initial state.
  //
  // The two presets are module constants so their identity is already stable,
  // but a caller passing an object literal inline would give a new identity on
  // every parent render. If the effect keyed on that, the whole simulation
  // would tear down and rebuild mid-scroll — every particle's position and
  // velocity discarded, so the strand visibly snaps back to its seed shape.
  // (Writing `config` into a ref during render is the other obvious way to
  // pin it, and is exactly the render-phase ref mutation React forbids.)
  const [initialConfig] = useState(config);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const c: HelixConfig = { ...DEFAULTS, ...initialConfig };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    let W = 0;
    let H = 0;
    let R = 0;
    let AX = 0;
    let DIM = 1;
    let raf = 0;
    let t0 = 0;
    let vis = true;
    let P: Particle[] = [];
    let M: Mote[] = [];

    /* the smoothed pointer, and how much influence it currently has */
    const SR = 26;
    let mx = -1e5;
    let my = -1e5;
    let tx = -1e5;
    let ty = -1e5;
    let pull = 0;

    /* One cached particle sprite, composited additively. Redrawing this
       gradient per particle per frame would cost ~340 gradient allocations a
       frame; drawing one cached canvas is effectively free. */
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = SR * 2;
    {
      const g = sprite.getContext('2d');
      if (!g) return;
      const gr = g.createRadialGradient(SR, SR, 0, SR, SR, SR);
      gr.addColorStop(0, 'rgba(224,255,247,1)');
      gr.addColorStop(0.12, 'rgba(120,236,206,.92)');
      gr.addColorStop(0.3, 'rgba(42,195,162,.42)');
      gr.addColorStop(0.62, 'rgba(37,181,171,.09)');
      gr.addColorStop(1, 'rgba(37,181,171,0)');
      g.fillStyle = gr;
      g.beginPath();
      g.arc(SR, SR, SR, 0, Math.PI * 2);
      g.fill();
    }

    function build() {
      P = [];
      for (let s = 0; s < 2; s++) {
        for (let i = 0; i < c.per; i++) {
          P.push({ s, u: i / (c.per - 1), x: 0, y: 0, vx: 0, vy: 0, z: 0 });
        }
      }
      M = [];
      for (let m = 0; m < c.motes; m++) {
        M.push({
          u: Math.random(),
          w: Math.random(),
          ph: Math.random() * 6.283,
          sp: 0.35 + Math.random() * 0.9,
        });
      }
    }

    function size() {
      const r = cv!.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      cv!.width = Math.round(W * dpr);
      cv!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // below 760 the canvas is narrow and sits UNDER the copy, so the strand
      // moves toward the edge, tightens and dims — that is what *N supplies.
      const narrow = W < 760;
      R = Math.min(
        W * (narrow && c.radN !== undefined ? c.radN : c.rad),
        narrow && c.radMaxN !== undefined ? c.radMaxN : c.radMax,
      );
      AX = W * (narrow && c.axN !== undefined ? c.axN : c.ax);
      DIM = narrow && c.dimN !== undefined ? c.dimN : c.dim;
    }

    function draw(t: number, live: boolean) {
      if (!W || !H) return;
      ctx!.clearRect(0, 0, W, H);
      ctx!.globalCompositeOperation = 'lighter';

      if (live) {
        const over = tx > -1e4 && tx > -c.repel && tx < W + c.repel && ty > -c.repel && ty < H + c.repel;
        if (mx < -1e4 && over) {
          mx = tx;
          my = ty;
        }
        mx += (tx - mx) * 0.14;
        my += (ty - my) * 0.14;
        pull += ((over ? 1 : 0) - pull) * 0.07;
      }

      const TW = c.turns * Math.PI * 2;
      const SPD = t * c.speed * Math.PI * 2;

      for (let i = 0; i < P.length; i++) {
        const p = P[i]!;
        const ang = p.u * TW + SPD + p.s * Math.PI;
        const hx = AX + Math.sin(ang) * R;
        const hy = -0.1 * H + p.u * 1.2 * H;
        p.z = Math.cos(ang);

        if (live) {
          if (pull > 0.001) {
            const dx = p.x - mx;
            const dy = p.y - my;
            const d2 = dx * dx + dy * dy;
            if (d2 < c.repel * c.repel && d2 > 0.05) {
              const d = Math.sqrt(d2);
              let f = 1 - d / c.repel;
              f = f * f * (3 - 2 * f); // smoothstep: no hard kick at the rim
              p.vx += (dx / d) * f * c.force * pull;
              p.vy += (dy / d) * f * c.force * pull;
            }
          }
          p.vx += (hx - p.x) * 0.042; // softer spring home
          p.vy += (hy - p.y) * 0.042;
          p.vx *= 0.9; // more damping, less ringing
          p.vy *= 0.9;
          const sp2 = p.vx * p.vx + p.vy * p.vy;
          if (sp2 > 900) {
            const k2 = 30 / Math.sqrt(sp2); // clamp so nothing snaps
            p.vx *= k2;
            p.vy *= k2;
          }
          p.x += p.vx;
          p.y += p.vy;
        } else {
          p.x = hx;
          p.y = hy;
        }
      }

      /* base pairs — the rungs between the two strands, faded by mean depth */
      ctx!.strokeStyle = 'rgba(42,195,162,1)';
      ctx!.lineWidth = 1;
      for (let i = 0; i < c.per; i += c.rung) {
        const a = P[i];
        const b = P[c.per + i];
        if (!a || !b) continue;
        const k = ((a.z + b.z) / 2 + 1) / 2;
        ctx!.globalAlpha = (0.05 + 0.27 * k) * DIM;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.stroke();
      }

      /* ambient motes drifting up the frame */
      ctx!.globalAlpha = 0.06 * DIM;
      for (let i = 0; i < M.length; i++) {
        const mo = M[i]!;
        const ux = W * (0.05 + mo.w * 0.9) + Math.sin(t * 0.22 * mo.sp + mo.ph) * 26;
        const uy = ((((mo.u + t * 0.012 * mo.sp) % 1) + 1) % 1) * H;
        ctx!.drawImage(sprite, ux - 2.6, uy - 2.6, 5.2, 5.2);
      }

      /* strand particles — alpha and size both track depth, so the far side of
         the twist reads as genuinely behind rather than merely smaller */
      for (let i = 0; i < P.length; i++) {
        const p = P[i]!;
        const k = (p.z + 1) / 2;
        ctx!.globalAlpha = (0.2 + 0.8 * k) * DIM;
        const sz = 2.0 + 4.3 * k;
        ctx!.drawImage(sprite, p.x - sz, p.y - sz, sz * 2, sz * 2);
      }

      ctx!.globalAlpha = 1;
      ctx!.globalCompositeOperation = 'source-over';
    }

    function frame(ts: number) {
      raf = requestAnimationFrame(frame);
      if (!vis) return;
      if (!t0) t0 = ts;
      draw((ts - t0) / 1000, true);
    }

    function onMove(e: PointerEvent) {
      const r = cv!.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    }
    function onLeave() {
      tx = ty = -1e5;
    }

    build();
    size();
    // seed every particle ON its ideal position, so the first frame is already
    // a helix rather than 340 particles flying in from the origin
    for (let q = 0; q < P.length; q++) {
      const pp = P[q]!;
      const aa = pp.u * c.turns * Math.PI * 2 + pp.s * Math.PI;
      pp.x = AX + Math.sin(aa) * R;
      pp.y = -0.1 * H + pp.u * 1.2 * H;
    }

    let io: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;
    let rt: ReturnType<typeof setTimeout> | undefined;

    function resize() {
      size();
      if (reduce.matches) draw(0, false);
    }

    if (reduce.matches) {
      draw(0, false);
    } else {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver((en) => {
          vis = !!en[0]?.isIntersecting;
        }, { threshold: 0 });
        io.observe(cv);
      }
      raf = requestAnimationFrame(frame);
    }

    // The source debounces window resize at 150ms. A ResizeObserver is used in
    // addition because this canvas is laid out by a CSS grid whose track can
    // change without the window doing so (the hero art column collapses at
    // 1000px, and the closing panel reflows when its copy wraps).
    const onWinResize = () => {
      clearTimeout(rt);
      rt = setTimeout(resize, 150);
    };
    window.addEventListener('resize', onWinResize, { passive: true });
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(() => {
        clearTimeout(rt);
        rt = setTimeout(resize, 150);
      });
      ro.observe(cv);
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onWinResize);
      io?.disconnect();
      ro?.disconnect();
    };
  }, [initialConfig]);

  return <canvas ref={ref} aria-hidden="true" className={cn('block', className)} />;
}
