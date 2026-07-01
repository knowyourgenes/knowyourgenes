'use client';

import { useRef, useState, type ElementType } from 'react';
import { useRevealOnScroll } from '@/hooks/use-scroll';
import type { Bundle, TestPage } from '@/features/tests/types';
import TestPageStyles from './styles';
import { Arrow, Alert, Check, Dot, TrustIcon } from './icons';

/** Render trusted inline HTML authored in lib/testsdata.ts. */
function H({ html, as: Tag = 'span', className }: { html: string; as?: ElementType; className?: string }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d={dir === 'left' ? 'M10 3L5 8l5 5' : 'M6 3l5 5-5 5'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BundleCard({ b, full }: { b: Bundle; full?: boolean }) {
  if (!full) {
    return (
      <a href={b.href} className="kyg-mh__side-bundle" data-theme={b.theme}>
        {b.badge && <span className="b-badge">{b.badge}</span>}
        <h4>{b.title}</h4>
        <span className="st">{b.subtitle}</span>
        <H html={b.desc} className="ds" />
        <span className="view">
          {b.ctaLabel} <Arrow />
        </span>
      </a>
    );
  }
  return (
    <div className="kyg-mh__bundle" data-theme={b.theme}>
      {b.theme !== 'recommended' && <span className="kyg-mh__bundle-top" />}
      {b.badge && <span className="kyg-mh__bundle-badge">{b.theme === 'recommended' ? 'Recommended' : b.badge}</span>}
      <h4>{b.title}</h4>
      <span className="subtitle">{b.subtitle}</span>
      <H html={b.desc} className="desc" />
      {b.bestFor && <H html={b.bestFor} className="bestfor" />}
      <a href={b.href} className={`btn ${b.theme === 'recommended' ? 'btn--java-sm' : 'btn--eden'}`}>
        {b.ctaLabel} <Arrow />
      </a>
    </div>
  );
}

export default function TestPageView({ test }: { test: TestPage }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useRevealOnScroll(rootRef);
  const [collapsed, setCollapsed] = useState(false);

  const badgeIcon = (tone: string) => (tone === 'poor' ? <Alert /> : <Check />);

  return (
    <div className="kyg-mh" ref={rootRef}>
      <TestPageStyles />

      {/* NAV */}
      <nav className="kyg-mh__nav">
        <a href="#top" className="kyg-mh__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/tests/mens-health/icons/logo-mark.svg" alt="" />
          {test.nav.brand}
        </a>
        <div className="kyg-mh__navlinks">
          {test.nav.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <a href={test.nav.ctaHref} className="btn btn--eden">
          {test.nav.ctaLabel} <Arrow />
        </a>
      </nav>

      <div className="kyg-mh__page" id="top">
        <div className={`kyg-mh__shell${collapsed ? ' is-collapsed' : ''}`}>
          {collapsed && (
            <button
              type="button"
              className="kyg-mh__reopen"
              onClick={() => setCollapsed(false)}
              aria-label="Show bundles"
              title="Show bundles"
            >
              <Chevron dir="right" />
            </button>
          )}
          {/* SIDEBAR (bundles only) */}
          <aside className="kyg-mh__sidebar kyg-scroll">
            <div className="kyg-mh__side-top">
              <span className="eyebrow">{test.sidebar.eyebrow}</span>
              <button
                type="button"
                className="kyg-mh__collapse"
                onClick={() => setCollapsed(true)}
                aria-label="Collapse bundles"
                title="Collapse"
              >
                <Chevron dir="left" />
              </button>
            </div>
            <H html={test.sidebar.introHtml} className="intro" />
            {test.sidebar.bundles.map((b) => (
              <BundleCard key={b.key} b={b} />
            ))}
            <H html={test.sidebar.noteHtml} className="kyg-mh__side-note" />
          </aside>

          <main className="kyg-mh__main">
            {/* 1 · HERO */}
            <section className="kyg-mh__hero" id="order">
              <span className="kyg-mh__hero-blob a" />
              <span className="kyg-mh__hero-blob b" />
              <div className="kyg-mh__hero-grid">
                <div className="kyg-mh__hero-copy reveal">
                  <div className="kyg-mh__badges">
                    {test.hero.badges.map((b, i) => (
                      <span key={i}>
                        {b.img && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={b.img} alt={b.imgAlt ?? ''} />
                        )}
                        {b.label}
                      </span>
                    ))}
                  </div>
                  <H html={test.hero.titleHtml} as="h1" />
                  <div>
                    <div className="kyg-mh__anchor">{test.hero.anchorWord}</div>
                    <span className="kyg-mh__anchor-bar" />
                  </div>
                  <H html={test.hero.bodyHtml} className="kyg-mh__hero-body" />
                  <a href={test.hero.ctaHref} className="btn btn--java">
                    {test.hero.ctaLabel} <Arrow />
                  </a>
                  <div className="kyg-mh__trust">
                    {test.hero.trust.map((t, i) => (
                      <div className="kyg-mh__trust-tile" key={i}>
                        <span className="kyg-mh__trust-ico">
                          <TrustIcon name={t.icon} />
                        </span>
                        <div>
                          <H html={t.line1} className="l1" as="div" />
                          <H html={t.line2} className="l2" as="div" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="kyg-mh__hero-visual reveal-r">
                  <div className="kyg-mh__hero-imgcard">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={test.hero.image} alt={test.hero.imageAlt} />
                    <span className="grad" />
                    <span className="cap">
                      <TrustIcon name="pin" /> {test.hero.imageCaption}
                    </span>
                  </div>
                  <div className="kyg-mh__hero-stats">
                    {test.hero.stats.map((s, i) => (
                      <div key={i}>
                        <H html={s.num} className="num" as="div" />
                        <div className="lab">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 2 · THREE PAINS */}
            <section id="pains">
              <div className="sec-head reveal">
                <span className="eyebrow">{test.pains.eyebrow}</span>
                <H html={test.pains.titleHtml} as="h2" className="sec-h2" />
              </div>
              <div className="kyg-mh__pains" style={{ marginTop: 48 }}>
                {test.pains.items.map((p) => (
                  <article className="kyg-mh__pain reveal" data-acc={p.accent} key={p.key}>
                    <span className="kyg-mh__pain-bar" />
                    <div className="kyg-mh__pain-grid">
                      <div>
                        <div className="kyg-mh__pain-head">
                          <span className="kyg-mh__pain-ico">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.icon} alt="" />
                          </span>
                          <H html={p.label} className="kyg-mh__pain-label" />
                        </div>
                        <H html={p.question} as="h3" />
                        <H html={p.answerHtml} className="kyg-mh__pain-answer" as="p" />
                        <H html={p.calloutHtml} className="kyg-mh__pain-callout" as="div" />
                      </div>
                      <div>
                        <div className="kyg-mh__pain-testcard">
                          <span className={`badge badge--${p.badgeTone}`}>
                            {badgeIcon(p.badgeTone)} {p.badge}
                          </span>
                          <span className="checks-label">{p.checksLabel}</span>
                          <H html={p.checksBodyHtml} className="checks-body" as="p" />
                          <H html={p.sampleHtml} className="sample" as="p" />
                        </div>
                        <div className="kyg-mh__signs">
                          <div className="kyg-mh__signs-title">{p.signsTitle}</div>
                          <ul className="kyg-mh__signs-grid">
                            {p.signs.map((s, i) => (
                              <li key={i}>
                                <Dot /> <H html={s} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* 3 · THE STAT */}
            <section className="kyg-mh__stat">
              <div className="kyg-mh__stat-inner reveal">
                <div className="kyg-mh__stat-grid">
                  <div>
                    <H html={test.stat.quoteHtml} className="kyg-mh__stat-quote" as="div" />
                    <H html={test.stat.subQuoteHtml} className="kyg-mh__stat-sub" as="div" />
                    <H html={test.stat.emphasisHtml} className="kyg-mh__stat-emph" as="div" />
                    <H html={test.stat.bodyHtml} className="kyg-mh__stat-body" as="p" />
                  </div>
                  <div className="kyg-mh__stat-card">
                    <H html={test.stat.bigNum} className="kyg-mh__stat-big" as="div" />
                    <H html={test.stat.bigNumLabel} className="cap" as="div" />
                    <a href={test.stat.ctaHref} className="btn btn--java">
                      {test.stat.ctaLabel} <Arrow />
                    </a>
                    <H html={test.stat.fineprint} className="kyg-mh__stat-fine" as="div" />
                  </div>
                </div>
              </div>
            </section>

            {/* 4 · SAMPLE REPORT */}
            <section className="sec--alt" id="sample">
              <div className="sec-head reveal">
                <span className="eyebrow">{test.sampleReport.eyebrow}</span>
                <H html={test.sampleReport.titleHtml} as="h2" className="sec-h2" />
                <H html={test.sampleReport.introHtml} className="lead" as="p" />
              </div>
              <div className="kyg-mh__report-cards">
                {test.sampleReport.cards.map((c, i) => (
                  <div className="kyg-mh__report-card reveal" data-tone={c.tone} key={i}>
                    <span className="what">{c.whatLabel}</span>
                    <h4>{c.title}</h4>
                    <H html={c.desc} className="desc" as="p" />
                    <div className="kyg-mh__report-result" data-tone={c.tone}>
                      <span className="rl">
                        {badgeIcon(c.tone)} <span className="big">{c.result}</span>
                        <span className="sub">· {c.resultLabel}</span>
                      </span>
                      <H html={c.noteHtml} className="note" as="span" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="kyg-mh__legend">
                <h3>{test.sampleReport.legendTitle}</h3>
                <div className="kyg-mh__legend-grid">
                  {test.sampleReport.legend.map((l, i) => (
                    <div className="kyg-mh__legend-card" data-tone={l.tone} key={i}>
                      <div className="lh">
                        <span className="lab">{l.label}</span>
                        <span className="sub">{l.sub}</span>
                      </div>
                      <H html={l.descHtml} as="p" />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 5 · HOW IT WORKS */}
            <section id="how">
              <div className="sec-head reveal">
                <span className="eyebrow">{test.howItWorks.eyebrow}</span>
                <H html={test.howItWorks.titleHtml} as="h2" className="sec-h2" />
                <H html={test.howItWorks.introHtml} className="lead" as="p" />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="kyg-mh__how-img reveal" src={test.howItWorks.image} alt={test.howItWorks.imageAlt} />
              <div className="kyg-mh__steps">
                {test.howItWorks.steps.map((s) => (
                  <div className="kyg-mh__step reveal" data-dark={s.dark ? 'true' : 'false'} key={s.num}>
                    <div className="kyg-mh__step-num">
                      <span className="n">{s.num}</span>
                      <span className="chip">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.icon} alt="" />
                      </span>
                    </div>
                    <div>
                      <H html={s.title} as="h3" />
                      <H html={s.subHtml} className="sub" as="div" />
                      <H html={s.bodyHtml} className="body" as="div" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="kyg-mh__how-cta">
                <a href={test.howItWorks.ctaHref} className="btn btn--eden">
                  {test.howItWorks.ctaLabel} <Arrow />
                </a>
                <H html={test.howItWorks.fineprint} className="kyg-mh__fine" as="div" />
              </div>
            </section>

            {/* 6 · GENEous CARE */}
            <section className="sec--alt" id="care">
              <div className="kyg-mh__care-grid">
                <div className="reveal">
                  <div className="sec-head">
                    <span className="eyebrow">{test.care.eyebrow}</span>
                    <H html={test.care.titleHtml} as="h2" className="sec-h2" />
                  </div>
                  <H html={test.care.leadHtml} className="kyg-mh__care-lead" as="p" />
                  <H html={test.care.bodyHtml} className="kyg-mh__care-body" as="p" />
                  <div className="kyg-mh__care-minis">
                    {test.care.minis.map((m, i) => (
                      <div className="kyg-mh__care-mini" key={i}>
                        <h4>{m.title}</h4>
                        <H html={m.bodyHtml} as="p" />
                      </div>
                    ))}
                  </div>
                  <H html={test.care.pullQuoteHtml} className="kyg-mh__care-quote" as="div" />
                </div>
                <div className="kyg-mh__chat reveal-r">
                  <div className="kyg-mh__chat-head">
                    <span className="t">{test.care.chatTitle}</span>
                    <span className="s">{test.care.chatStatus}</span>
                  </div>
                  <div className="kyg-mh__chat-body">
                    {test.care.chat.map((c, i) => (
                      <H key={i} html={c.textHtml} className={`kyg-mh__bubble ${c.from}`} as="div" />
                    ))}
                  </div>
                  <div className="kyg-mh__covers">
                    <h4>{test.care.coversTitle}</h4>
                    <ul>
                      {test.care.covers.map((c, i) => (
                        <li key={i}>
                          <span style={{ color: 'var(--eden)' }}>
                            <Check className="" />
                          </span>
                          <H html={c} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 7 · TRUST */}
            <section id="trust">
              <div className="sec-head kyg-mh__trust-head reveal">
                <span className="eyebrow">{test.trust.eyebrow}</span>
                <H html={test.trust.titleHtml} as="h2" className="sec-h2" />
              </div>
              <div className="kyg-mh__cert-strip reveal">
                {test.trust.certs.map((c, i) => (
                  <div className="kyg-mh__cert-tile" key={i}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.img ?? c.svg} alt={c.alt} />
                    <span className="lbl">{c.label}</span>
                  </div>
                ))}
              </div>
              <div className="kyg-mh__cert-table reveal">
                {test.trust.rows.map((r, i) => (
                  <div className="kyg-mh__cert-row" key={i}>
                    <H html={r.label} className="rl" />
                    <H html={r.descHtml} className="rd" />
                  </div>
                ))}
              </div>
              <div className="kyg-mh__expert reveal">
                <span className="vs">{test.trust.expert.initials}</span>
                <div>
                  <div className="name">
                    <H html={test.trust.expert.name} /> <H html={test.trust.expert.role} className="role" />
                  </div>
                  <H html={test.trust.expert.lab} className="lab" as="div" />
                  <H html={test.trust.expert.bodyHtml} className="body" as="div" />
                  <H html={test.trust.expert.accuracyHtml} className="acc" as="div" />
                </div>
              </div>
            </section>

            {/* 8 · FAQ */}
            <section className="sec--alt" id="faq">
              <div className="sec-head reveal">
                <span className="eyebrow">{test.faq.eyebrow}</span>
                <H html={test.faq.titleHtml} as="h2" className="sec-h2" />
              </div>
              <div className="kyg-mh__faqs">
                {test.faq.items.map((f, i) => (
                  <details className="kyg-mh__faq reveal" key={i}>
                    <summary>
                      <span className="kyg-mh__faq-ico">+</span>
                      <H html={f.q} />
                    </summary>
                    <H html={f.aHtml} as="p" />
                  </details>
                ))}
              </div>
            </section>

            {/* 9 · BUNDLES + FINAL CTA */}
            <section id="bundles">
              <div className="sec-head reveal">
                <span className="eyebrow">{test.bundlesSection.eyebrow}</span>
                <H html={test.bundlesSection.titleHtml} as="h2" className="sec-h2" />
              </div>
              <div className="kyg-mh__bundles">
                {test.bundlesSection.items.map((b) => (
                  <BundleCard key={b.key} b={b} full />
                ))}
              </div>

              <div className="kyg-mh__finalcta reveal">
                <H html={test.finalCta.titleHtml} as="h2" />
                <H html={test.finalCta.subHtml} className="sub" as="p" />
                <a href={test.finalCta.ctaHref} className="btn btn--java">
                  {test.finalCta.ctaLabel} <Arrow />
                </a>
                <H html={test.finalCta.fineprint1} className="fine bermuda" as="div" />
                <H html={test.finalCta.fineprint2} className="fine" as="div" />
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
