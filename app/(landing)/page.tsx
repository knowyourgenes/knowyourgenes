// @ts-nocheck
// Generated from kyg.html by scripts/convert-kyg.py. Re-run the script to
// regenerate; the auth-aware NavAuthCta is part of the template so it survives.
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LayoutDashboard } from 'lucide-react';
import UserNav from '@/components/admin/UserNav';
import './landing.css';

function NavAuthCta() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const user = session?.user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="nav__cta">
      {loading ? null : user ? (
        <>
          {isAdmin ? (
            <Link href="/admin/dashboard" className="btn btn--ghost">
              <LayoutDashboard className="ico" />
              Dashboard
            </Link>
          ) : (
            <Link href="/dashboard/profile" className="btn btn--ghost">
              My profile
            </Link>
          )}

          <Link href="#wellness" className="btn btn--primary">
            Order Kit
            <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <UserNav
            name={user.name ?? user.email ?? 'User'}
            email={user.email ?? ''}
            role={user.role}
            image={user.image ?? null}
          />
        </>
      ) : (
        <>
          <Link href="#wellness" className="btn btn--primary">
            Order Kit
            <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link href={`/login?from=${encodeURIComponent(pathname || '/')}`} className="btn btn--ghost">
            Sign in
          </Link>
        </>
      )}
      <button className="nav__burger" aria-label="Open menu" id="burger">
        <span></span>
      </button>
    </div>
  );
}

export default function HomePage() {
  useEffect(() => {
    (function () {
      // ===== Sticky nav state =====
      const nav = document.getElementById('nav');
      const onScroll = () => {
        if (window.scrollY > 12) nav.classList.add('is-scrolled');
        else nav.classList.remove('is-scrolled');
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      // ===== Mega menu (hover + click + keyboard) =====
      const items = document.querySelectorAll('.nav__item[data-mm]');
      let openTimer;
      items.forEach((item) => {
        const open = () => {
          clearTimeout(openTimer);
          items.forEach((i) => i !== item && i.classList.remove('is-open'));
          item.classList.add('is-open');
        };
        const close = () => {
          openTimer = setTimeout(() => item.classList.remove('is-open'), 140);
        };
        item.addEventListener('mouseenter', open);
        item.addEventListener('mouseleave', close);
        item.querySelector('.nav__link').addEventListener('focus', open);
        item.querySelector('.nav__link').addEventListener('click', (e) => {
          e.preventDefault();
          if (item.classList.contains('is-open')) {
            item.classList.remove('is-open');
          } else {
            items.forEach((i) => i.classList.remove('is-open'));
            item.classList.add('is-open');
          }
        });
      });
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav__item')) items.forEach((i) => i.classList.remove('is-open'));
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') items.forEach((i) => i.classList.remove('is-open'));
      });

      // ===== Reveal on scroll =====
      const reveals = document.querySelectorAll('.reveal, .reveal-r');
      if ('IntersectionObserver' in window) {
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
      } else {
        reveals.forEach((el) => el.classList.add('is-in'));
      }

      // ===== Parallax (rAF, transform translate3d, clamped to keep images inside rounded frames) =====
      const parallaxEls = Array.from(document.querySelectorAll('.parallax'));
      const ctaParallaxEls = Array.from(document.querySelectorAll('.parallax-cta'));
      const heroImg = document.getElementById('heroImg');
      let ticking = false;

      function applyParallax() {
        const sy = window.scrollY;
        const winH = window.innerHeight;
        parallaxEls.forEach((el) => {
          const parent = el.parentElement;
          const rect = parent.getBoundingClientRect();
          if (rect.bottom > -200 && rect.top < winH + 200) {
            // Progress: -1 (entering bottom) → 0 (centered) → +1 (leaving top)
            const center = rect.top + rect.height / 2;
            const progress = (center - winH / 2) / ((winH + rect.height) / 2);
            const clamped = Math.max(-1, Math.min(1, progress));
            // ±48px range — clearly visible movement, sits inside the 12% buffer
            const speed = parseFloat(el.dataset.speed) || 0.14;
            const offset = -clamped * (48 + speed * 100);
            el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
          }
        });
        // CTA floating photos: drift upward as user scrolls toward footer, with 3D tilt preserved
        ctaParallaxEls.forEach((el) => {
          const section = el.closest('.finalcta');
          if (!section) return;
          const rect = section.getBoundingClientRect();
          if (rect.bottom > -300 && rect.top < winH + 300) {
            const center = rect.top + rect.height / 2;
            const progress = (center - winH / 2) / ((winH + rect.height) / 2);
            const clamped = Math.max(-1, Math.min(1, progress));
            const speed = parseFloat(el.dataset.ctaSpeed) || 0.12;
            const offset = -clamped * (80 + speed * 200);
            const tilt = getComputedStyle(el).getPropertyValue('--tilt').trim() || '';
            el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0) ${tilt}`;
          }
        });
        if (heroImg) {
          // Hero gets the strongest effect, capped at 180px
          const o = Math.min(sy * 0.32, 180);
          heroImg.style.transform = `translate3d(0, ${o.toFixed(2)}px, 0) scale(1.04)`;
        }
        ticking = false;
      }
      function onParallaxScroll() {
        if (!ticking) {
          window.requestAnimationFrame(applyParallax);
          ticking = true;
        }
      }
      window.addEventListener('scroll', onParallaxScroll, { passive: true });
      window.addEventListener('resize', applyParallax);
      applyParallax();

      // ===== Cursor-follow 3D tilt on the Trust shield =====
      const shield = document.querySelector('.privacy__shield');
      if (shield) {
        let raf = null;
        let rxTarget = 0,
          ryTarget = 0;
        let rxCurrent = 0,
          ryCurrent = 0;
        const MAX_TILT = 14; // degrees

        const animate = () => {
          // Eased follow for buttery motion
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

        // Listen on whole window so it follows from anywhere on the page (subtle effect)
        window.addEventListener(
          'mousemove',
          (e) => {
            const rect = shield.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (window.innerWidth / 2);
            const dy = (e.clientY - cy) / (window.innerHeight / 2);
            // Clamp + nonlinearity for natural feel
            const nx = Math.max(-1, Math.min(1, dx));
            const ny = Math.max(-1, Math.min(1, dy));
            ryTarget = nx * MAX_TILT;
            rxTarget = -ny * MAX_TILT;
            if (!raf) raf = requestAnimationFrame(animate);
          },
          { passive: true }
        );

        // Stronger response on direct hover
        shield.addEventListener('mouseenter', () => {
          shield.style.transition = 'none';
        });
        shield.addEventListener('mouseleave', () => {
          rxTarget = 0;
          ryTarget = 0;
          if (!raf) raf = requestAnimationFrame(animate);
        });
      }

      // ===== Smooth scroll for in-page anchors =====
      document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', function (e) {
          const id = this.getAttribute('href');
          if (id.length > 1) {
            const target = document.querySelector(id);
            if (target) {
              e.preventDefault();
              const offset = 80;
              const top = target.getBoundingClientRect().top + window.scrollY - offset;
              window.scrollTo({ top, behavior: 'smooth' });
              items.forEach((i) => i.classList.remove('is-open'));
            }
          }
        });
      });
    })();
  }, []);

  return (
    <div className="kyg-page">
      {/* ============================================================
     NAVIGATION
     ============================================================ */}
      <header className="nav" id="nav">
        <div className="container container--wide nav__inner">
          <a href="#" className="nav__logo" aria-label="KYG, Know Your Genes">
            <svg viewBox="0 0 729.85 318.67" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" stroke="#0E4D4B" strokeWidth="19.02" strokeLinecap="round" strokeMiterlimit="10">
                <line x1="50.72" y1="9.51" x2="50.72" y2="189.61" />
                <line x1="52" y1="149.3" x2="189.75" y2="11.55" />
                <path
                  d="M498.81,134.54c5.95,5.16,8.39,7.43,12.15,11.07,34.34,33.36,54.01,44.25,88.7,44.25s79.48-22.74,79.48-79.38h-67.62"
                  strokeLinejoin="round"
                />
                <path d="M108.12,93.18s71.37,96.68,125.89,96.42c73.12,6.82,108.45-122.98,167.32-118.02,0,0,18.34-.86,39.63,14.94" />
                <line x1="311.72" y1="87.39" x2="240.72" y2="17.42" />
                <path d="M667.76,55.12c-20.55-36.18-55.34-43.57-75.17-43.57s-57.14.73-100.21,66.89c-43.07,66.16-62.99,79.76-90.19,79.76-22.09,0-37.94-19.14-37.94-19.14" />
              </g>
              <g stroke="#25B5AB" strokeLinecap="round" strokeMiterlimit="10" fill="none">
                <line x1="402.82" y1="139.05" x2="402.82" y2="93.36" strokeWidth="9.44" />
                <line x1="423.01" y1="129.68" x2="423.01" y2="102.73" strokeWidth="7.55" />
                <line x1="382.29" y1="129.68" x2="382.29" y2="102.73" strokeWidth="7.55" />
              </g>
              <text
                fill="#0E4D4B"
                fontSize="96.98"
                fontFamily="Figtree, sans-serif"
                fontWeight="700"
                transform="translate(0 297.34)"
              >
                <tspan x="0" y="0">
                  K
                </tspan>
                <tspan x="63.91" y="0">
                  n
                </tspan>
                <tspan x="118.99" y="0" fontWeight="400">
                  o
                </tspan>
                <tspan x="173.2" y="0">
                  w
                </tspan>
                <tspan x="254.18" y="0" fontWeight="400">
                  Y
                </tspan>
                <tspan x="306.94" y="0" fontWeight="400">
                  our
                </tspan>
                <tspan x="450.07" y="0">
                  Genes
                </tspan>
              </text>
            </svg>
          </a>

          <nav className="nav__links" aria-label="Main">
            <div className="nav__item" data-mm="wellness">
              <button className="nav__link">
                Wellness Package <span className="nav__caret"></span>
              </button>
              <div className="megamenu" data-mm-panel="wellness">
                <div className="megamenu__inner">
                  <div className="megamenu__head">
                    <div className="megamenu__title">The Wellness Package</div>
                    <div className="megamenu__sub">
                      4 personalized wellness reports from a single saliva sample, built for Indian biology.
                    </div>
                  </div>
                  <a className="mm-card" href="#wellness">
                    <img
                      className="mm-card__img"
                      src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                      alt="My Diet"
                      loading="lazy"
                    />
                    <div className="mm-card__shade"></div>
                    <div className="mm-card__arrow">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </div>
                    <div className="mm-card__body">
                      <div className="mm-card__k">Report 01</div>
                      <div className="mm-card__title">My Diet</div>
                      <div className="mm-card__desc">
                        Nutrition insights personalized for your body. What works, what doesn't.
                      </div>
                    </div>
                  </a>
                  <a className="mm-card" href="#wellness">
                    <img
                      className="mm-card__img"
                      src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                      alt="My Weight"
                      loading="lazy"
                    />
                    <div className="mm-card__shade"></div>
                    <div className="mm-card__arrow">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </div>
                    <div className="mm-card__body">
                      <div className="mm-card__k">Report 02</div>
                      <div className="mm-card__title">My Weight</div>
                      <div className="mm-card__desc">Understand your metabolism and weight tendencies.</div>
                    </div>
                  </a>
                  <a className="mm-card" href="#wellness">
                    <img
                      className="mm-card__img"
                      src="https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                      alt="My Fitness"
                      loading="lazy"
                    />
                    <div className="mm-card__shade"></div>
                    <div className="mm-card__arrow">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </div>
                    <div className="mm-card__body">
                      <div className="mm-card__k">Report 03</div>
                      <div className="mm-card__title">My Fitness</div>
                      <div className="mm-card__desc">Train smarter. Strength, endurance and recovery insights.</div>
                    </div>
                  </a>
                  <a className="mm-card" href="#wellness">
                    <img
                      className="mm-card__img"
                      src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                      alt="My Detox"
                      loading="lazy"
                    />
                    <div className="mm-card__shade"></div>
                    <div className="mm-card__arrow">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </div>
                    <div className="mm-card__body">
                      <div className="mm-card__k">Report 04</div>
                      <div className="mm-card__title">My Detox</div>
                      <div className="mm-card__desc">Stress response and detoxification pathways.</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <div className="nav__item" data-mm="howitworks">
              <button className="nav__link">
                How It Works <span className="nav__caret"></span>
              </button>
              <div className="megamenu" data-mm-panel="howitworks">
                <div className="megamenu__inner">
                  <div className="megamenu__head">
                    <div className="megamenu__title">From Order to Insight</div>
                    <div className="megamenu__sub">
                      Five gentle steps. Simple, private, personalized, and supported by humans, not just algorithms.
                    </div>
                  </div>
                  <a className="mm-card" href="#how">
                    <img
                      className="mm-card__img"
                      src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                      alt="Order kit"
                      loading="lazy"
                    />
                    <div className="mm-card__shade"></div>
                    <div className="mm-card__arrow">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </div>
                    <div className="mm-card__body">
                      <div className="mm-card__k">Step 01</div>
                      <div className="mm-card__title">Order Your Kit</div>
                      <div className="mm-card__desc">Choose your personalized wellness journey.</div>
                    </div>
                  </a>
                  <a className="mm-card" href="#how">
                    <img
                      className="mm-card__img"
                      src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                      alt="Saliva collection"
                      loading="lazy"
                    />
                    <div className="mm-card__shade"></div>
                    <div className="mm-card__arrow">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </div>
                    <div className="mm-card__body">
                      <div className="mm-card__k">Step 02 & 03</div>
                      <div className="mm-card__title">Collect & Send</div>
                      <div className="mm-card__desc">Simple, non-invasive saliva collection.</div>
                    </div>
                  </a>
                  <a className="mm-card" href="#report">
                    <img
                      className="mm-card__img"
                      src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                      alt="Reports"
                      loading="lazy"
                    />
                    <div className="mm-card__shade"></div>
                    <div className="mm-card__arrow">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </div>
                    <div className="mm-card__body">
                      <div className="mm-card__k">Step 04</div>
                      <div className="mm-card__title">Receive Reports</div>
                      <div className="mm-card__desc">Plain-English wellness insights.</div>
                    </div>
                  </a>
                  <a className="mm-card" href="#care">
                    <img
                      className="mm-card__img"
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                      alt="Care expert"
                      loading="lazy"
                    />
                    <div className="mm-card__shade"></div>
                    <div className="mm-card__arrow">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </div>
                    <div className="mm-card__body">
                      <div className="mm-card__k">Step 05</div>
                      <div className="mm-card__title">Talk to an Expert</div>
                      <div className="mm-card__desc">GENEous Care helps you make sense of it.</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <div className="nav__item" data-mm="learn">
              <button className="nav__link">
                Learn <span className="nav__caret"></span>
              </button>
              <div className="megamenu" data-mm-panel="learn">
                <div className="megamenu__inner">
                  <div className="megamenu__head">
                    <div className="megamenu__title">Health, Decoded</div>
                    <div className="megamenu__sub">
                      Short, science-grounded reads. Plus the why behind KYG, our trust principles and family-focused
                      care.
                    </div>
                  </div>
                  <a className="mm-card" href="#decoded">
                    <img
                      className="mm-card__img"
                      src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                      alt="Health Decoded"
                      loading="lazy"
                    />
                    <div className="mm-card__shade"></div>
                    <div className="mm-card__arrow">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </div>
                    <div className="mm-card__body">
                      <div className="mm-card__k">Articles</div>
                      <div className="mm-card__title">Health Decoded</div>
                      <div className="mm-card__desc">Breaking everyday wellness myths.</div>
                    </div>
                  </a>
                  <a className="mm-card" href="#what">
                    <img
                      className="mm-card__img"
                      src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                      alt="Science"
                      loading="lazy"
                    />
                    <div className="mm-card__shade"></div>
                    <div className="mm-card__arrow">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </div>
                    <div className="mm-card__body">
                      <div className="mm-card__k">Science</div>
                      <div className="mm-card__title">The Science of KYG</div>
                      <div className="mm-card__desc">Genetics, simplified for real life.</div>
                    </div>
                  </a>
                  <a className="mm-card" href="#senior">
                    <img className="mm-card__img" src="/kyg/a42282e02776.jpg" alt="Senior Care" loading="lazy" />
                    <div className="mm-card__shade"></div>
                    <div className="mm-card__arrow">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </div>
                    <div className="mm-card__body">
                      <div className="mm-card__k">Family</div>
                      <div className="mm-card__title">Senior Care</div>
                      <div className="mm-card__desc">Preventive wellness for parents.</div>
                    </div>
                  </a>
                  <a className="mm-card" href="#privacy">
                    <img
                      className="mm-card__img"
                      src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                      alt="Trust & Privacy"
                      loading="lazy"
                    />
                    <div className="mm-card__shade"></div>
                    <div className="mm-card__arrow">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </div>
                    <div className="mm-card__body">
                      <div className="mm-card__k">Trust</div>
                      <div className="mm-card__title">Privacy &amp; Data</div>
                      <div className="mm-card__desc">How we keep your data yours.</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <div className="nav__item">
              <a className="nav__link" href="#care">
                GENEous Care
              </a>
            </div>
          </nav>

          <NavAuthCta />
        </div>
      </header>

      {/* ============================================================
     HERO — Full-width photographic with editorial overlay
     ============================================================ */}
      <section className="hero">
        <div className="hero__media">
          <img
            className="hero__media-img"
            id="heroImg"
            src="/kyg/950448a92b6b.jpg"
            alt="An Indian family at home, a father and son share a moment at a laptop while the mother and daughter cook together in the kitchen"
          />
          <div className="hero__media-veil"></div>
          <div className="hero__media-grain"></div>
        </div>

        <div className="container container--wide">
          <div className="hero__inner">
            <div className="hero__copy reveal">
              <div className="hero__pill">
                <span className="hero__pill-dot">✦</span>
                <span>India's first wellness-led DNA experience</span>
              </div>
              <h1 className="hero__h">
                <span className="hero__h-line">Your body already carries</span>
                <span className="hero__h-line grad-text">clues about your future.</span>
              </h1>
              <p className="hero__sub">
                Understand your body better through personalized wellness and genetic insights designed for modern
                India.
              </p>
              <div className="hero__cta">
                <a href="#wellness" className="btn btn--primary">
                  Start your wellness journey
                  <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a href="#care" className="btn btn--ghost">
                  Talk to GENEous Care
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     TRUST MARQUEE
     ============================================================ */}
      <section className="trust" aria-label="Why people trust KYG">
        <div className="trust__label">
          <span className="trust__label-dot"></span>
          <span>Trusted by India's wellness seekers</span>
        </div>
        <div className="trust__track" id="trustTrack">
          {/* Duplicated content for seamless marquee */}
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12l2 2 4-4M12 22a10 10 0 110-20 10 10 0 010 20z" />
            </svg>{' '}
            Saliva-Based DNA Wellness Test
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
            </svg>{' '}
            Personalized Wellness Insights
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <path d="M8 8h8M8 12h8M8 16h5" />
            </svg>{' '}
            4 Comprehensive Wellness Reports
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg>{' '}
            GENEous Care Counseling
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>{' '}
            Trusted Certified Labs
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>{' '}
            Built for Indian Biology
          </div>
          <span className="trust__item-dot"></span>
          {/* duplicate */}
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12l2 2 4-4M12 22a10 10 0 110-20 10 10 0 010 20z" />
            </svg>{' '}
            Saliva-Based DNA Wellness Test
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
            </svg>{' '}
            Personalized Wellness Insights
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <path d="M8 8h8M8 12h8M8 16h5" />
            </svg>{' '}
            4 Comprehensive Wellness Reports
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg>{' '}
            GENEous Care Counseling
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>{' '}
            Trusted Certified Labs
          </div>
          <span className="trust__item-dot"></span>
          <div className="trust__item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>{' '}
            Built for Indian Biology
          </div>
          <span className="trust__item-dot"></span>
        </div>
      </section>

      {/* ============================================================
     WHY KYG EXISTS
     ============================================================ */}
      <section className="s why" id="why">
        <div className="container container--wide">
          <div className="why__grid">
            <div className="why__left reveal">
              <div className="eyebrow">Why KYG exists</div>
              <h2 className="h1" style={{ marginTop: '22px' } as React.CSSProperties}>
                Most people know their Aadhaar number better than their <span className="grad-text">health risks.</span>
              </h2>

              <p className="lead" style={{ marginTop: '28px', maxWidth: '540px' } as React.CSSProperties}>
                You track:
              </p>
              <div className="why__track">
                <div className="why__chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 1v22M5 5h11a4 4 0 010 8H8a4 4 0 000 8h12" />
                  </svg>{' '}
                  your money
                </div>
                <div className="why__chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12h4l3-9 4 18 3-9h4" />
                  </svg>{' '}
                  your calories
                </div>
                <div className="why__chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 19V6l11-3v13" />
                    <circle cx="6" cy="19" r="3" />
                    <circle cx="17" cy="16" r="3" />
                  </svg>{' '}
                  your steps
                </div>
                <div className="why__chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>{' '}
                  your sleep
                </div>
                <div className="why__chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 17l6-6 4 4 8-8" />
                    <path d="M14 7h7v7" />
                  </svg>{' '}
                  your investments
                </div>
              </div>

              <p
                style={
                  {
                    fontSize: '19px',
                    fontWeight: '600',
                    color: 'var(--ink-1)',
                    marginBottom: '10px',
                  } as React.CSSProperties
                }
              >
                But do you really understand your own body?
              </p>

              <div className="why__qs">
                <div className="why__qs-lab">Questions worth asking</div>
                <p>Why does the same diet work differently for different people?</p>
                <p>Why do some people recover faster?</p>
                <p>Why do certain health conditions run in families?</p>
                <p>Why do some foods suit one person but not another?</p>
              </div>

              <div className="why__because">Because every body is different.</div>

              <p
                style={
                  {
                    marginTop: '24px',
                    fontSize: '16.5px',
                    lineHeight: '1.65',
                    color: 'var(--ink-2)',
                    maxWidth: '560px',
                  } as React.CSSProperties
                }
              >
                KYG helps you understand your body better through personalized wellness intelligence powered by
                genetics, lifestyle science, and expert guidance.
              </p>
            </div>

            <div className="why__visual reveal-r" style={{ '--rd': '.1s' } as React.CSSProperties}>
              <img
                className="why__visual-img parallax"
                data-speed="0.15"
                src="https://images.unsplash.com/photo-1604881991720-f91add269bed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="A thoughtful Indian woman in warm natural light"
              />
              <div className="why__visual-veil"></div>
              <div className="why__visual-inner">
                <div className="why__visual-num">
                  1<span>in</span>1
                </div>
                <p className="why__visual-cap">
                  There is no one else with your exact genetic blueprint. That's the point. And the opportunity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     WHAT IS KYG  · body silhouette surrounded by floating cards
     ============================================================ */}
      <section className="s what" id="what">
        <div className="container container--wide">
          <div className="s-head reveal">
            <div className="eyebrow">What is KYG?</div>
            <h2 className="h1" style={{ marginTop: '22px' } as React.CSSProperties}>
              Think of it as your body's <span className="grad-text">instruction manual.</span>
            </h2>
            <p className="lead" style={{ marginTop: '24px', maxWidth: '640px' } as React.CSSProperties}>
              KYG combines genetic insights with wellness intelligence to help you understand how your body naturally
              responds.
            </p>
          </div>

          <div className="what__stage reveal" style={{ '--rd': '.15s' } as React.CSSProperties}>
            <div className="what__body">
              <img
                className="what__body-img"
                src="/kyg/c347b61299d8.png"
                alt="Wireframe human body figure showing the genetic data points across the body"
              />
            </div>

            <div className="what__floats">
              <div className="what__float what__float--1">
                <div className="what__float-ico">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6c0-1.7 1.3-3 3-3h12c1.7 0 3 1.3 3 3 0 1.7-1.3 3-3 3H6c-1.7 0-3-1.3-3-3zM5 9l1.5 12h11L19 9" />
                  </svg>
                </div>
                <div className="what__float-name">Nutrition</div>
              </div>
              <div className="what__float what__float--2">
                <div className="what__float-ico">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6.5 6.5l11 11" />
                    <rect x="14" y="2" width="6" height="6" rx="1" />
                    <rect x="4" y="16" width="6" height="6" rx="1" />
                  </svg>
                </div>
                <div className="what__float-name">Fitness</div>
              </div>
              <div className="what__float what__float--3">
                <div className="what__float-ico">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                  </svg>
                </div>
                <div className="what__float-name">Lifestyle</div>
              </div>
              <div className="what__float what__float--4">
                <div className="what__float-ico">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                </div>
                <div className="what__float-name">Metabolism</div>
              </div>
              <div className="what__float what__float--5">
                <div className="what__float-ico">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L4 7v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V7l-8-5z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <div className="what__float-name">Preventive Care</div>
              </div>
              <div className="what__float what__float--6">
                <div className="what__float-ico">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12h4l3-9 4 18 3-9h4" />
                  </svg>
                </div>
                <div className="what__float-name">Recovery</div>
              </div>
            </div>
          </div>

          <div className="what__tag-wrap reveal" style={{ '--rd': '.3s' } as React.CSSProperties}>
            <div className="what__tag">
              <span className="what__tag-dot">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              Health Without Guesswork.
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     WELLNESS PACKAGE — image-first cards, hover reveals details
     ============================================================ */}
      <section className="s s--peach" id="wellness">
        <div className="container container--wide">
          <div className="s-head reveal">
            <div className="eyebrow">The Wellness Package</div>
            <h2 className="h1">
              One test. <span className="grad-text">4 personalized</span> wellness reports.
            </h2>
            <p className="lead" style={{ marginTop: '18px', maxWidth: '680px' } as React.CSSProperties}>
              Your Wellness Package is designed to help you move beyond generic health advice and understand what
              actually works for your body.
            </p>
          </div>

          <div className="pkg__cards">
            <article className="pkg-card reveal" style={{ '--rd': '0s' } as React.CSSProperties}>
              <img
                className="pkg-card__img"
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                alt="A vibrant healthy bowl of fresh produce"
                loading="lazy"
              />
              <div className="pkg-card__veil"></div>
              <div className="pkg-card__num">Report 01</div>
              <div className="pkg-card__corner">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </div>
              <div className="pkg-card__body">
                <h3 className="pkg-card__title">My Diet</h3>
                <p className="pkg-card__sub">Nutrition insights personalized for your body.</p>
                <div className="pkg-card__reveal">
                  <ul className="pkg-card__list">
                    <li>Vitamin &amp; micronutrient tendencies</li>
                    <li>Food sensitivities</li>
                    <li>Macro nutrient response</li>
                    <li>Gluten &amp; lactose response</li>
                    <li>Salt &amp; caffeine sensitivity</li>
                  </ul>
                  <p className="pkg-card__quote">Same diet. Different bodies.</p>
                </div>
              </div>
            </article>

            <article className="pkg-card reveal" style={{ '--rd': '.08s' } as React.CSSProperties}>
              <img
                className="pkg-card__img"
                src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                alt="A person walking outdoors at golden hour"
                loading="lazy"
              />
              <div className="pkg-card__veil"></div>
              <div className="pkg-card__num">Report 02</div>
              <div className="pkg-card__corner">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </div>
              <div className="pkg-card__body">
                <h3 className="pkg-card__title">My Weight</h3>
                <p className="pkg-card__sub">Understand your metabolism and weight-related tendencies.</p>
                <div className="pkg-card__reveal">
                  <ul className="pkg-card__list">
                    <li>Weight management response</li>
                    <li>Fat storage tendencies</li>
                    <li>Eating behavior patterns</li>
                    <li>Sweet cravings &amp; satiety</li>
                    <li>Lipid profile tendencies</li>
                  </ul>
                  <p className="pkg-card__quote">Move beyond generic weight-loss advice.</p>
                </div>
              </div>
            </article>

            <article className="pkg-card reveal" style={{ '--rd': '.16s' } as React.CSSProperties}>
              <img
                className="pkg-card__img"
                src="https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                alt="A person doing yoga at sunrise"
                loading="lazy"
              />
              <div className="pkg-card__veil"></div>
              <div className="pkg-card__num">Report 03</div>
              <div className="pkg-card__corner">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </div>
              <div className="pkg-card__body">
                <h3 className="pkg-card__title">My Fitness</h3>
                <p className="pkg-card__sub">Train smarter with insights into your body's fitness response.</p>
                <div className="pkg-card__reveal">
                  <ul className="pkg-card__list">
                    <li>Exercise response</li>
                    <li>Strength &amp; endurance tendencies</li>
                    <li>Recovery response</li>
                    <li>Injury risk insights</li>
                    <li>Aerobic &amp; anaerobic capacity</li>
                  </ul>
                  <p className="pkg-card__quote">Not every body responds the same way.</p>
                </div>
              </div>
            </article>

            <article className="pkg-card reveal" style={{ '--rd': '.24s' } as React.CSSProperties}>
              <img
                className="pkg-card__img"
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                alt="Soft water and natural calm"
                loading="lazy"
              />
              <div className="pkg-card__veil"></div>
              <div className="pkg-card__num">Report 04</div>
              <div className="pkg-card__corner">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </div>
              <div className="pkg-card__body">
                <h3 className="pkg-card__title">My Detox</h3>
                <p className="pkg-card__sub">Understand how your body responds to stress and detoxification.</p>
                <div className="pkg-card__reveal">
                  <ul className="pkg-card__list">
                    <li>Oxidative stress response</li>
                    <li>Detoxification pathways</li>
                    <li>Water-soluble toxin response</li>
                    <li>Fat-soluble toxin response</li>
                    <li>Lifestyle detox support insights</li>
                  </ul>
                  <p className="pkg-card__quote">Recovery and detox matter too.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ============================================================
     REPORT PREVIEW
     ============================================================ */}
      <section className="s report" id="report">
        <div className="container container--wide">
          <div className="report__grid">
            <div className="report__mock reveal">
              <div
                style={
                  { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' } as React.CSSProperties
                }
              >
                <span
                  style={
                    {
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#E07258',
                      opacity: '.65',
                    } as React.CSSProperties
                  }
                ></span>
                <span
                  style={
                    {
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#E8B14E',
                      opacity: '.65',
                    } as React.CSSProperties
                  }
                ></span>
                <span
                  style={
                    {
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#6BB87B',
                      opacity: '.65',
                    } as React.CSSProperties
                  }
                ></span>
                <span
                  style={
                    {
                      marginLeft: 'auto',
                      fontSize: '11px',
                      letterSpacing: '.18em',
                      textTransform: 'uppercase',
                      fontWeight: '600',
                      color: 'var(--ink-3)',
                    } as React.CSSProperties
                  }
                >
                  your-report · kyg
                </span>
              </div>

              <div className="report__doc">
                <div className="report__doc-head">
                  <div>
                    <div className="report__doc-lab">Report · My Diet</div>
                    <div className="report__doc-title">Nutrition &amp; Sensitivity Profile</div>
                  </div>
                  <div className="report__doc-mark">KYG</div>
                </div>

                <div className="report__metric">
                  <div className="report__metric-name">Vitamin D response</div>
                  <div className="report__metric-bar">
                    <div className="report__metric-fill" style={{ width: '36%' } as React.CSSProperties}></div>
                  </div>
                  <div className="report__metric-status r-stat-1">Below avg</div>
                </div>
                <div className="report__metric">
                  <div className="report__metric-name">Caffeine metabolism</div>
                  <div className="report__metric-bar">
                    <div className="report__metric-fill" style={{ width: '78%' } as React.CSSProperties}></div>
                  </div>
                  <div className="report__metric-status r-stat-2">Fast</div>
                </div>
                <div className="report__metric">
                  <div className="report__metric-name">Lactose tolerance</div>
                  <div className="report__metric-bar">
                    <div className="report__metric-fill" style={{ width: '62%' } as React.CSSProperties}></div>
                  </div>
                  <div className="report__metric-status r-stat-3">Typical</div>
                </div>
                <div className="report__metric">
                  <div className="report__metric-name">Salt sensitivity</div>
                  <div className="report__metric-bar">
                    <div className="report__metric-fill" style={{ width: '84%' } as React.CSSProperties}></div>
                  </div>
                  <div className="report__metric-status r-stat-2">Elevated</div>
                </div>
                <div className="report__metric">
                  <div className="report__metric-name">Omega-3 response</div>
                  <div className="report__metric-bar">
                    <div className="report__metric-fill" style={{ width: '58%' } as React.CSSProperties}></div>
                  </div>
                  <div className="report__metric-status r-stat-4">Balanced</div>
                </div>

                <div className="report__doc-foot">
                  <span>27 markers analyzed</span>
                  <span>Reviewed by GENEous Care</span>
                </div>
              </div>

              <div className="report__float">
                <div className="report__float-ico">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <div className="report__float-text">
                  <b>Plain English</b>
                  Every result, explained.
                </div>
              </div>
            </div>

            <div className="reveal" style={{ '--rd': '.1s' } as React.CSSProperties}>
              <div className="eyebrow">Your Report</div>
              <h2 className="h1" style={{ marginTop: '22px' } as React.CSSProperties}>
                Personalized insights, <span className="grad-text">backed by science.</span>
              </h2>
              <p className="lead" style={{ marginTop: '24px' } as React.CSSProperties}>
                Your report is designed to simplify complex genetic science into practical wellness understanding.
              </p>
              <p
                style={
                  {
                    marginTop: '18px',
                    color: 'var(--ink-2)',
                    fontSize: '16px',
                    lineHeight: '1.6',
                  } as React.CSSProperties
                }
              >
                Each insight includes your genetic response, simplified interpretation, wellness implications, food
                recommendations, lifestyle guidance, and actionable next steps.
              </p>

              <div className="report__feats">
                <div className="report__feat">
                  <div className="report__feat-ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                    </svg>
                  </div>
                  <div className="report__feat-text">Easy-to-understand summaries</div>
                </div>
                <div className="report__feat">
                  <div className="report__feat-ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  </div>
                  <div className="report__feat-text">Color-coded wellness indicators</div>
                </div>
                <div className="report__feat">
                  <div className="report__feat-ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </div>
                  <div className="report__feat-text">Personalized recommendations</div>
                </div>
                <div className="report__feat">
                  <div className="report__feat-ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="report__feat-text">Lifestyle-focused interpretation</div>
                </div>
                <div className="report__feat" style={{ gridColumn: 'span 2' } as React.CSSProperties}>
                  <div className="report__feat-ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div className="report__feat-text">
                    Wellness-oriented guidance. Not clinical jargon, not generic advice.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     GENEous CARE (dark warm break)
     ============================================================ */}
      <section className="s" style={{ paddingTop: '0' } as React.CSSProperties}>
        <div className="care s--dark">
          <div className="care__inner">
            <div className="care__grid">
              <div className="reveal">
                <div className="eyebrow eyebrow--light">GENEous Care</div>
                <h2 className="h1" style={{ marginTop: '22px' } as React.CSSProperties}>
                  Because reports alone are <span className="grad-text">not enough.</span>
                </h2>
                <p className="lead" style={{ marginTop: '24px', maxWidth: '540px' } as React.CSSProperties}>
                  Most people receive health reports and don't know what to do next.
                </p>
                <p className="lead" style={{ marginTop: '14px', maxWidth: '540px' } as React.CSSProperties}>
                  That's where GENEous Care comes in. KYG combines genetic intelligence with human guidance to help you:
                </p>

                <div className="care__items">
                  <div className="care__item">
                    <span className="care__item-num">01</span>
                    understand your wellness report
                  </div>
                  <div className="care__item">
                    <span className="care__item-num">02</span>
                    reduce confusion
                  </div>
                  <div className="care__item">
                    <span className="care__item-num">03</span>
                    make informed lifestyle decisions
                  </div>
                  <div className="care__item">
                    <span className="care__item-num">04</span>
                    take meaningful next steps
                  </div>
                </div>

                <div className="care__pills-lab">What's included</div>
                <div className="care__pills">
                  <span className="care__pill">Pre-Test Guidance</span>
                  <span className="care__pill">Post-Test Counseling</span>
                  <span className="care__pill">Lifestyle Discussions</span>
                  <span className="care__pill">Wellness Guidance</span>
                  <span className="care__pill">Personalized Support</span>
                </div>

                <div className="care__hl">Human understanding meets genetic intelligence.</div>

                <div style={{ marginTop: '36px' } as React.CSSProperties}>
                  <a href="#" className="btn btn--accent">
                    Book a free consultation
                    <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="care__visual reveal-r" style={{ '--rd': '.15s' } as React.CSSProperties}>
                <div className="care__visual-tag">Available 7 days a week</div>
                <img
                  className="parallax"
                  data-speed="0.12"
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="A GENEous Care counselor in a warm, supportive conversation"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     HOW IT WORKS
     ============================================================ */}
      <section className="s how" id="how">
        <div className="container container--wide">
          <div className="how__head reveal">
            <div className="how__head-text">
              <div className="eyebrow">How It Works</div>
              <h2 className="h1" style={{ marginTop: '22px' } as React.CSSProperties}>
                Simple. Private. <span className="grad-text">Personalized.</span>
              </h2>
            </div>
            <div className="how__head-r">
              <p>Five gentle steps from kit-in-box to actionable insight, supported by humans, not just algorithms.</p>
            </div>
          </div>

          <div className="steps">
            <div className="step reveal" style={{ '--rd': '0s' } as React.CSSProperties}>
              <div className="step__circle">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 8h22l-2 18a3 3 0 01-3 3H10a3 3 0 01-3-3L5 8z" />
                  <path d="M11 8V5a5 5 0 0110 0v3" />
                  <path d="M14 16h4M16 14v4" />
                </svg>
                <span className="step__num">1</span>
              </div>
              <div className="step__title">Order Your Wellness Package</div>
              <div className="step__desc">Choose your personalized wellness journey.</div>
            </div>

            <div className="step reveal" style={{ '--rd': '.08s' } as React.CSSProperties}>
              <div className="step__circle">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4h8v22a3 3 0 01-3 3h-2a3 3 0 01-3-3V4z" />
                  <path d="M14 10h4M13 16h6" />
                  <circle cx="16" cy="22" r="2" fill="currentColor" opacity=".3" stroke="none" />
                </svg>
                <span className="step__num">2</span>
              </div>
              <div className="step__title">Collect Your Saliva Sample</div>
              <div className="step__desc">Simple, non-invasive, and convenient.</div>
            </div>

            <div className="step reveal" style={{ '--rd': '.16s' } as React.CSSProperties}>
              <div className="step__circle">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 6 Q16 14 22 6" />
                  <path d="M10 16 Q16 24 22 16" />
                  <path d="M10 26 Q16 18 22 26" />
                  <line x1="13" y1="9" x2="13" y2="13" />
                  <line x1="19" y1="9" x2="19" y2="13" />
                  <line x1="13" y1="19" x2="13" y2="23" />
                  <line x1="19" y1="19" x2="19" y2="23" />
                </svg>
                <span className="step__num">3</span>
              </div>
              <div className="step__title">Advanced Genetic Analysis</div>
              <div className="step__desc">Processed through trusted certified genomics laboratory partners.</div>
            </div>

            <div className="step reveal" style={{ '--rd': '.24s' } as React.CSSProperties}>
              <div className="step__circle">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="7" y="4" width="18" height="24" rx="2" />
                  <line x1="11" y1="11" x2="21" y2="11" />
                  <line x1="11" y1="16" x2="21" y2="16" />
                  <line x1="11" y1="21" x2="17" y2="21" />
                  <circle cx="22" cy="23" r="3" fill="currentColor" opacity=".25" stroke="none" />
                </svg>
                <span className="step__num">4</span>
              </div>
              <div className="step__title">Receive Personalized Reports</div>
              <div className="step__desc">Easy-to-understand wellness insights designed for real-life application.</div>
            </div>

            <div className="step reveal" style={{ '--rd': '.32s' } as React.CSSProperties}>
              <div className="step__circle">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M27 18a3 3 0 01-3 3H10l-5 5V8a3 3 0 013-3h18a3 3 0 013 3z" />
                  <line x1="11" y1="11" x2="21" y2="11" />
                  <line x1="11" y1="15" x2="17" y2="15" />
                </svg>
                <span className="step__num">5</span>
              </div>
              <div className="step__title">Talk to a GENEous Care Expert</div>
              <div className="step__desc">
                Understand what your results actually mean for your lifestyle and wellness goals.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     WHO IS THIS FOR
     ============================================================ */}
      <section className="s who" id="who">
        <div className="container container--wide">
          <div className="who__grid">
            <div className="who__visual reveal">
              <img
                className="parallax"
                data-speed="0.14"
                src="/kyg/4c2cb66bab2c.jpg"
                alt="A focused Indian tennis player on court, representing the active KYG community"
              />
            </div>

            <div className="reveal" style={{ '--rd': '.1s' } as React.CSSProperties}>
              <div className="eyebrow">Who Is This For?</div>
              <h2 className="h1" style={{ marginTop: '22px' } as React.CSSProperties}>
                Built for people who want <span className="grad-text">smarter wellness decisions.</span>
              </h2>
              <p
                style={
                  {
                    marginTop: '24px',
                    fontSize: '17px',
                    color: 'var(--ink-2)',
                    lineHeight: '1.6',
                    maxWidth: '560px',
                  } as React.CSSProperties
                }
              >
                KYG fits into the lives of people who care about understanding their bodies, not just managing them.
              </p>

              <div className="who__chips">
                <span className="who-chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12h4l3-9 4 18 3-9h4" />
                  </svg>
                  Fitness-conscious individuals
                </span>
                <span className="who-chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                  </svg>
                  Wellness seekers
                </span>
                <span className="who-chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                  </svg>
                  Busy professionals
                </span>
                <span className="who-chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Preventive healthcare adopters
                </span>
                <span className="who-chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 14s1 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
                  </svg>
                  Struggling with generic diets
                </span>
                <span className="who-chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 11a4 4 0 018 0" />
                    <path d="M9 16h6" />
                  </svg>
                  Curious about personalized wellness
                </span>
                <span className="who-chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  Adults focused on long-term health
                </span>
                <span className="who-chip">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                  Families prioritizing preventive care
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     KYG SENIOR CARE
     ============================================================ */}
      <section className="s senior" id="senior">
        <div className="container container--wide">
          <div className="senior__grid">
            <div className="reveal">
              <div className="eyebrow">KYG Senior Care</div>
              <h2 className="h1" style={{ marginTop: '22px' } as React.CSSProperties}>
                Your parents deserve <span className="grad-text">informed healthcare too.</span>
              </h2>
              <p className="lead" style={{ marginTop: '24px', maxWidth: '540px' } as React.CSSProperties}>
                As India enters an era of rising lifestyle diseases and chronic health conditions, preventive wellness
                for parents becomes more important than ever.
              </p>

              <p
                style={
                  {
                    fontSize: '11.5px',
                    letterSpacing: '.22em',
                    textTransform: 'uppercase',
                    fontWeight: '600',
                    color: 'var(--c-teal)',
                    marginTop: '36px',
                  } as React.CSSProperties
                }
              >
                KYG Senior Care focuses on:
              </p>
              <div className="senior__pills">
                <div className="senior__pill">
                  <div className="senior__pill-ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </div>
                  <div className="senior__pill-text">Healthy aging &amp; wellness understanding</div>
                </div>
                <div className="senior__pill">
                  <div className="senior__pill-ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="4" y="6" width="16" height="14" rx="2" />
                      <path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2" />
                      <path d="M12 11v6M9 14h6" />
                    </svg>
                  </div>
                  <div className="senior__pill-text">Medication compatibility awareness</div>
                </div>
                <div className="senior__pill">
                  <div className="senior__pill-ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 12h4l3-9 4 18 3-9h4" />
                    </svg>
                  </div>
                  <div className="senior__pill-text">Cardiac &amp; diabetes-related insights</div>
                </div>
                <div className="senior__pill">
                  <div className="senior__pill-ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  </div>
                  <div className="senior__pill-text">Preventive health literacy</div>
                </div>
              </div>

              <div className="senior__hl">
                Better understanding. Better care. <span className="grad-text">Better aging.</span>
              </div>

              <div style={{ marginTop: '32px' } as React.CSSProperties}>
                <a href="#" className="btn btn--ghost">
                  Explore Senior Care
                  <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="senior__visual reveal-r" style={{ '--rd': '.1s' } as React.CSSProperties}>
              <img
                className="parallax"
                data-speed="0.14"
                src="/kyg/a42282e02776.jpg"
                alt="A senior Indian couple reading documents together at home"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     HEALTH DECODED — image-dominant article cards with hover reveal
     ============================================================ */}
      <section className="s decoded" id="decoded">
        <div className="container container--wide">
          <div className="s-head reveal">
            <div className="eyebrow">Health Decoded</div>
            <h2 className="h1">
              Breaking everyday <span className="grad-text">wellness myths.</span>
            </h2>
            <p className="lead" style={{ marginTop: '18px', maxWidth: '680px' } as React.CSSProperties}>
              Bite-sized, science-grounded reads that help you make sense of what works, and what doesn't, for your
              body.
            </p>
          </div>

          <div className="decoded__grid">
            <article className="dcard reveal" style={{ '--rd': '0s' } as React.CSSProperties}>
              <img
                className="dcard__img"
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                alt="A bowl of fresh, colorful food"
                loading="lazy"
              />
              <div className="dcard__veil"></div>
              <div className="dcard__body">
                <div className="dcard__tag">Nutrition</div>
                <h3 className="dcard__title">Why your diet may not be working</h3>
                <p className="dcard__desc">The "perfect" diet is the one that fits your biology. Not someone else's.</p>
                <a className="dcard__link" href="#">
                  Read article
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>

            <article className="dcard reveal" style={{ '--rd': '.08s' } as React.CSSProperties}>
              <img
                className="dcard__img"
                src="https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                alt="Two different healthy meals"
                loading="lazy"
              />
              <div className="dcard__veil"></div>
              <div className="dcard__body">
                <div className="dcard__tag">Food &amp; Body</div>
                <h3 className="dcard__title">Why some foods suit some people better</h3>
                <p className="dcard__desc">Sensitivities, tolerances, and metabolism vary genetically. Here's why.</p>
                <a className="dcard__link" href="#">
                  Read article
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>

            <article className="dcard reveal" style={{ '--rd': '.16s' } as React.CSSProperties}>
              <img
                className="dcard__img"
                src="https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                alt="Person stretching outdoors"
                loading="lazy"
              />
              <div className="dcard__veil"></div>
              <div className="dcard__body">
                <div className="dcard__tag">Fitness</div>
                <h3 className="dcard__title">Why two people respond differently to exercise</h3>
                <p className="dcard__desc">From muscle response to recovery. Your genes write a different program.</p>
                <a className="dcard__link" href="#">
                  Read article
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>

            <article className="dcard reveal" style={{ '--rd': '.24s' } as React.CSSProperties}>
              <img
                className="dcard__img"
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                alt="A calm scene of water"
                loading="lazy"
              />
              <div className="dcard__veil"></div>
              <div className="dcard__body">
                <div className="dcard__tag">Recovery</div>
                <h3 className="dcard__title">Why recovery differs from person to person</h3>
                <p className="dcard__desc">Some bodies bounce back overnight. Others need a different rhythm.</p>
                <a className="dcard__link" href="#">
                  Read article
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>

            <article className="dcard reveal" style={{ '--rd': '.32s' } as React.CSSProperties}>
              <img
                className="dcard__img"
                src="https://images.unsplash.com/photo-1559757175-5700dde675bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                alt="Generic wellness advice"
                loading="lazy"
              />
              <div className="dcard__veil"></div>
              <div className="dcard__body">
                <div className="dcard__tag">Wellness</div>
                <h3 className="dcard__title">Why generic wellness advice fails many people</h3>
                <p className="dcard__desc">When the rules are written for "everyone", nobody really benefits.</p>
                <a className="dcard__link" href="#">
                  Read article
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>

            <article className="dcard dcard--cta reveal" style={{ '--rd': '.40s' } as React.CSSProperties}>
              <div className="dcard__body">
                <div className="dcard__tag">Explore more</div>
                <h3 className="dcard__title">Health Decoded is a growing library.</h3>
                <p className="dcard__desc">
                  New articles every week, written for real people in real life. Subscribe and never miss a beat.
                </p>
                <a className="dcard__link" href="#">
                  Explore Health Decoded
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ============================================================
     TRUST & PRIVACY
     ============================================================ */}
      <section className="s privacy" id="privacy">
        <div className="container container--wide">
          <div className="privacy__grid">
            <div className="reveal">
              <div className="eyebrow">Trust &amp; Privacy</div>
              <h2 className="h1" style={{ marginTop: '22px' } as React.CSSProperties}>
                Your data <span className="grad-text">stays yours.</span>
              </h2>
              <p className="lead" style={{ marginTop: '24px', maxWidth: '540px' } as React.CSSProperties}>
                We understand that health and genetic information is deeply personal.
              </p>
              <p
                style={
                  {
                    marginTop: '14px',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    color: 'var(--ink-2)',
                    maxWidth: '540px',
                  } as React.CSSProperties
                }
              >
                That's why KYG focuses on privacy-focused systems, secure data handling, trusted certified lab
                partnerships, and confidential wellness reporting.
              </p>

              <div className="privacy__items">
                <div className="privacy__item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  Trusted Certified Lab Partners
                </div>
                <div className="privacy__item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  Secure Data Handling
                </div>
                <div className="privacy__item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Privacy-Focused Systems
                </div>
                <div className="privacy__item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  Scientific &amp; Expert-Backed
                </div>
                <div className="privacy__item" style={{ gridColumn: 'span 2' } as React.CSSProperties}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <path d="M14 2v6h6M16 13H8M16 17H8" />
                  </svg>
                  Confidential Wellness Reports, only shared with you
                </div>
              </div>
            </div>

            <div className="privacy__shield reveal-r" style={{ '--rd': '.1s' } as React.CSSProperties}>
              <svg
                viewBox="0 0 280 320"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '82%', height: '82%', position: 'relative', zIndex: '1' } as React.CSSProperties}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="shieldBody" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0E4D4B" />
                    <stop offset="100%" stopColor="#1A2220" />
                  </linearGradient>
                  <linearGradient id="shieldLight" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.28" />
                    <stop offset="55%" stopColor="#fff" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                  </linearGradient>
                  <radialGradient id="shieldGlow" cx="50%" cy="55%" r="55%">
                    <stop offset="0%" stopColor="#25B5AB" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#25B5AB" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Outer halo glow */}
                <circle cx="140" cy="170" r="140" fill="url(#shieldGlow)" />

                {/* Back depth layer */}
                <path
                  d="M 140 22 L 248 56 L 246 168 C 246 230 200 282 140 308 C 80 282 34 230 34 168 L 36 56 Z"
                  fill="#15605D"
                  opacity="0.35"
                  transform="translate(4,5)"
                />

                {/* Main shield */}
                <path
                  d="M 140 22 L 248 56 L 246 168 C 246 230 200 282 140 308 C 80 282 34 230 34 168 L 36 56 Z"
                  fill="url(#shieldBody)"
                />

                {/* Top-light overlay for 3D feel */}
                <path
                  d="M 140 22 L 248 56 L 246 168 C 246 230 200 282 140 308 C 80 282 34 230 34 168 L 36 56 Z"
                  fill="url(#shieldLight)"
                />

                {/* Inner border outline */}
                <path
                  d="M 140 42 L 226 70 L 224 168 C 224 220 188 264 140 286 C 92 264 56 220 56 168 L 58 70 Z"
                  fill="none"
                  stroke="rgba(248,228,204,0.15)"
                  strokeWidth="1.5"
                />

                {/* Big elegant check mark */}
                <path
                  d="M 92 162 L 128 198 L 196 130"
                  fill="none"
                  stroke="#FAF6EF"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Subtle corner accent dots */}
                <circle cx="82" cy="86" r="2.5" fill="#25B5AB" opacity="0.7" />
                <circle cx="198" cy="86" r="2.5" fill="#F3D5B2" opacity="0.7" />
                <circle cx="60" cy="178" r="2" fill="#F3D5B2" opacity="0.5" />
                <circle cx="220" cy="178" r="2" fill="#25B5AB" opacity="0.55" />
                <circle cx="100" cy="246" r="1.8" fill="#25B5AB" opacity="0.45" />
                <circle cx="180" cy="246" r="1.8" fill="#F3D5B2" opacity="0.45" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     THE MOVEMENT (dark warm break)
     ============================================================ */}
      <section className="s" style={{ paddingBottom: '0' } as React.CSSProperties}>
        <div className="movement s--dark">
          <div className="movement__bgfx" aria-hidden="true"></div>
          <div className="movement__waves" aria-hidden="true">
            <svg viewBox="0 0 1200 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="mvWave1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#25B5AB" stopOpacity="0" />
                  <stop offset="50%" stopColor="#25B5AB" stopOpacity="1" />
                  <stop offset="100%" stopColor="#25B5AB" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="mvWave2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F3D5B2" stopOpacity="0" />
                  <stop offset="50%" stopColor="#F3D5B2" stopOpacity="1" />
                  <stop offset="100%" stopColor="#F3D5B2" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path stroke="url(#mvWave1)" strokeWidth="1.4" fill="none">
                <animate
                  attributeName="d"
                  values="M 0 120 Q 300 60 600 120 T 1200 120;M 0 150 Q 300 90 600 150 T 1200 150;M 0 100 Q 300 40 600 100 T 1200 100;M 0 120 Q 300 60 600 120 T 1200 120"
                  dur="16s"
                  repeatCount="indefinite"
                />
              </path>
              <path stroke="url(#mvWave2)" strokeWidth="1.2" fill="none" opacity="0.7">
                <animate
                  attributeName="d"
                  values="M 0 240 Q 300 200 600 260 T 1200 240;M 0 260 Q 300 220 600 280 T 1200 260;M 0 220 Q 300 180 600 240 T 1200 220;M 0 240 Q 300 200 600 260 T 1200 240"
                  dur="20s"
                  repeatCount="indefinite"
                />
              </path>
              <path stroke="url(#mvWave1)" strokeWidth="1" fill="none" opacity="0.6">
                <animate
                  attributeName="d"
                  values="M 0 380 Q 300 320 600 380 T 1200 380;M 0 400 Q 300 340 600 400 T 1200 400;M 0 360 Q 300 300 600 360 T 1200 360;M 0 380 Q 300 320 600 380 T 1200 380"
                  dur="18s"
                  repeatCount="indefinite"
                />
              </path>
              <path stroke="url(#mvWave2)" strokeWidth="0.9" fill="none" opacity="0.55">
                <animate
                  attributeName="d"
                  values="M 0 60 Q 400 20 800 60 T 1200 60;M 0 80 Q 400 40 800 80 T 1200 80;M 0 40 Q 400 0 800 40 T 1200 40;M 0 60 Q 400 20 800 60 T 1200 60"
                  dur="22s"
                  repeatCount="indefinite"
                />
              </path>
              <path stroke="url(#mvWave1)" strokeWidth="1" fill="none" opacity="0.5">
                <animate
                  attributeName="d"
                  values="M 0 440 Q 400 400 800 460 T 1200 440;M 0 460 Q 400 420 800 480 T 1200 460;M 0 420 Q 400 380 800 440 T 1200 420;M 0 440 Q 400 400 800 460 T 1200 440"
                  dur="24s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
          <div className="movement__inner">
            <div className="reveal">
              <div className="eyebrow eyebrow--light">The Movement</div>
              <h2 className="h1" style={{ marginTop: '22px', maxWidth: '680px' } as React.CSSProperties}>
                India's preventive wellness movement <span className="grad-text">starts here.</span>
              </h2>
              <p className="lead" style={{ marginTop: '24px', maxWidth: '640px' } as React.CSSProperties}>
                KYG is more than a wellness test. It's a movement toward:
              </p>
            </div>

            <div className="movement__list">
              <div className="movement__item reveal" style={{ '--rd': '0s' } as React.CSSProperties}>
                <div className="movement__item-num">01</div>
                <div className="movement__item-text">Smarter wellness decisions</div>
              </div>
              <div className="movement__item reveal" style={{ '--rd': '.08s' } as React.CSSProperties}>
                <div className="movement__item-num">02</div>
                <div className="movement__item-text">Preventive health awareness</div>
              </div>
              <div className="movement__item reveal" style={{ '--rd': '.16s' } as React.CSSProperties}>
                <div className="movement__item-num">03</div>
                <div className="movement__item-text">Personalized lifestyle understanding</div>
              </div>
              <div className="movement__item reveal" style={{ '--rd': '.24s' } as React.CSSProperties}>
                <div className="movement__item-num">04</div>
                <div className="movement__item-text">Future-ready healthcare thinking for India</div>
              </div>
            </div>

            <div className="movement__hl reveal" style={{ '--rd': '.3s' } as React.CSSProperties}>
              Future Ready Health. <span>Future Ready Bharat.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     FINAL CTA
     ============================================================ */}
      <section className="finalcta">
        <div className="finalcta__floats" aria-hidden="true">
          <div className="finalcta__photo finalcta__photo--tl parallax-cta" data-cta-speed="0.10">
            <img src="/kyg/8edd2bd58f53.jpg" alt="" />
          </div>
          <div className="finalcta__photo finalcta__photo--bl parallax-cta" data-cta-speed="0.16">
            <img src="/kyg/a4930f51ded1.jpg" alt="" />
          </div>
          <div className="finalcta__photo finalcta__photo--tr parallax-cta" data-cta-speed="0.14">
            <img src="/kyg/91608c2afbf8.jpg" alt="" />
          </div>
          <div className="finalcta__photo finalcta__photo--br parallax-cta" data-cta-speed="0.12">
            <img src="/kyg/07d054d6a059.jpg" alt="" />
          </div>
        </div>

        <div className="container finalcta__inner">
          <div className="reveal">
            <h2 className="finalcta__h">
              Your genes don't define your future.
              <em>
                <span className="grad-text">But they can help you understand your body better.</span>
              </em>
            </h2>
            <p className="finalcta__sub">Start your personalized wellness journey with KYG.</p>
            <div className="finalcta__btns">
              <a href="#wellness" className="btn btn--primary">
                Begin your KYG journey
                <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="#care" className="btn btn--ghost">
                Talk to GENEous Care
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
     FOOTER
     ============================================================ */}
      <footer className="footer">
        <div className="container container--wide footer__inner">
          <div className="footer__grid">
            <div className="footer__brand">
              <div className="footer__logo">
                <svg viewBox="0 0 729.85 318.67" xmlns="http://www.w3.org/2000/svg">
                  <g fill="none" stroke="#FAF6EF" strokeWidth="19.02" strokeLinecap="round" strokeMiterlimit="10">
                    <line x1="50.72" y1="9.51" x2="50.72" y2="189.61" />
                    <line x1="52" y1="149.3" x2="189.75" y2="11.55" />
                    <path
                      d="M498.81,134.54c5.95,5.16,8.39,7.43,12.15,11.07,34.34,33.36,54.01,44.25,88.7,44.25s79.48-22.74,79.48-79.38h-67.62"
                      strokeLinejoin="round"
                    />
                    <path d="M108.12,93.18s71.37,96.68,125.89,96.42c73.12,6.82,108.45-122.98,167.32-118.02,0,0,18.34-.86,39.63,14.94" />
                    <line x1="311.72" y1="87.39" x2="240.72" y2="17.42" />
                    <path d="M667.76,55.12c-20.55-36.18-55.34-43.57-75.17-43.57s-57.14.73-100.21,66.89c-43.07,66.16-62.99,79.76-90.19,79.76-22.09,0-37.94-19.14-37.94-19.14" />
                  </g>
                  <g stroke="#25B5AB" strokeLinecap="round" strokeMiterlimit="10" fill="none">
                    <line x1="402.82" y1="139.05" x2="402.82" y2="93.36" strokeWidth="9.44" />
                    <line x1="423.01" y1="129.68" x2="423.01" y2="102.73" strokeWidth="7.55" />
                    <line x1="382.29" y1="129.68" x2="382.29" y2="102.73" strokeWidth="7.55" />
                  </g>
                  <text
                    fill="#FAF6EF"
                    fontSize="96.98"
                    fontFamily="Figtree, sans-serif"
                    fontWeight="700"
                    transform="translate(0 297.34)"
                  >
                    <tspan x="0" y="0">
                      K
                    </tspan>
                    <tspan x="63.91" y="0">
                      n
                    </tspan>
                    <tspan x="118.99" y="0" fontWeight="400">
                      o
                    </tspan>
                    <tspan x="173.2" y="0">
                      w
                    </tspan>
                    <tspan x="254.18" y="0" fontWeight="400">
                      Y
                    </tspan>
                    <tspan x="306.94" y="0" fontWeight="400">
                      our
                    </tspan>
                    <tspan x="450.07" y="0">
                      Genes
                    </tspan>
                  </text>
                </svg>
              </div>
              <p className="footer__tag">
                A genomics brand built for Indian biology. Your health deserves specificity.
              </p>
              <form className="footer__newsletter" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Your email address" aria-label="Email" />
                <button type="submit">Subscribe</button>
              </form>
            </div>

            <div>
              <div className="footer__col-title">Wellness Package</div>
              <ul className="footer__list">
                <li>
                  <a href="#wellness">My Diet</a>
                </li>
                <li>
                  <a href="#wellness">My Weight</a>
                </li>
                <li>
                  <a href="#wellness">My Fitness</a>
                </li>
                <li>
                  <a href="#wellness">My Detox</a>
                </li>
                <li>
                  <a href="#senior">Senior Care</a>
                </li>
              </ul>
            </div>
            <div>
              <div className="footer__col-title">Care</div>
              <ul className="footer__list">
                <li>
                  <a href="#how">How It Works</a>
                </li>
                <li>
                  <a href="#care">GENEous Care</a>
                </li>
                <li>
                  <a href="#report">Sample Report</a>
                </li>
                <li>
                  <a href="#privacy">Privacy &amp; Trust</a>
                </li>
              </ul>
            </div>
            <div>
              <div className="footer__col-title">Learn</div>
              <ul className="footer__list">
                <li>
                  <a href="#decoded">Health Decoded</a>
                </li>
                <li>
                  <a href="#what">The Science</a>
                </li>
                <li>
                  <a href="#">FAQs</a>
                </li>
                <li>
                  <a href="#">Help Center</a>
                </li>
              </ul>
            </div>
            <div>
              <div className="footer__col-title">Company</div>
              <ul className="footer__list">
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Press</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer__bottom">
            <div>© 2026 KnowYourGenes. All rights reserved.</div>
            <div className="footer__brandline">
              KYG <span>·</span> Health Without Guesswork.
            </div>
            <div className="footer__socials">
              <a href="#" aria-label="Instagram">
                Instagram
              </a>
              <a href="#" aria-label="LinkedIn">
                LinkedIn
              </a>
              <a href="#" aria-label="YouTube">
                YouTube
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ============================================================
     JS — sticky nav, mega menu, reveal animations, parallax
     ============================================================ */}
    </div>
  );
}
