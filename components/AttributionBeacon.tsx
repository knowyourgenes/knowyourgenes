'use client';

/**
 * AttributionBeacon — fires once per page load when UTM params are in the URL.
 *
 * Pairs with /api/track/visit to persist a row per click. Independent of the
 * kyg_attr cookie (the middleware handles that for conversion attribution).
 *
 * Why client-side and not in the middleware: Next.js middleware runs on Edge
 * and cannot use Prisma to write to Postgres. A tiny client beacon is the
 * standard pattern (every analytics tool — GA, Plausible, Mixpanel — does this).
 *
 * Dedupe rule: we mark sessionStorage with the URL we beaconed for; the same
 * URL won't fire again until it changes. A page refresh on the same UTM URL
 * still creates *one* visit row because sessionStorage survives the refresh.
 * Open a new tab or new session to re-fire.
 */

import { useEffect } from 'react';

const SESSION_ID_KEY = 'kyg_session';
const LAST_BEACON_KEY = 'kyg_attr_beacon';

function getOrCreateSessionId(): string {
  try {
    let s = sessionStorage.getItem(SESSION_ID_KEY);
    if (!s) {
      s = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(SESSION_ID_KEY, s);
    }
    return s;
  } catch {
    return '';
  }
}

export default function AttributionBeacon() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');
    const utmCampaign = params.get('utm_campaign');

    // Paid click-ids (gclid, fbclid, msclkid, ttclid, gbraid, wbraid, li_fat_id, twclid)
    // imply paid traffic even when marketers forget UTM tags. Derive a source.
    let clickIdSource: string | null = null;
    let clickIdMedium: string | null = null;
    if (params.get('gclid') || params.get('gbraid') || params.get('wbraid')) {
      clickIdSource = 'google';
      clickIdMedium = 'cpc';
    } else if (params.get('fbclid')) {
      clickIdSource = 'facebook';
      clickIdMedium = 'paid_social';
    } else if (params.get('msclkid')) {
      clickIdSource = 'bing';
      clickIdMedium = 'cpc';
    } else if (params.get('ttclid')) {
      clickIdSource = 'tiktok';
      clickIdMedium = 'paid_social';
    } else if (params.get('li_fat_id')) {
      clickIdSource = 'linkedin';
      clickIdMedium = 'paid_social';
    } else if (params.get('twclid')) {
      clickIdSource = 'twitter';
      clickIdMedium = 'paid_social';
    }

    const source = utmSource ?? clickIdSource;
    const medium = params.get('utm_medium') ?? clickIdMedium;

    // Only fire when there's a marketing signal in the URL.
    if (!source && !utmCampaign) return;

    // Dedupe — same URL in same session shouldn't double-count refreshes.
    const url = window.location.href;
    try {
      if (sessionStorage.getItem(LAST_BEACON_KEY) === url) return;
      sessionStorage.setItem(LAST_BEACON_KEY, url);
    } catch {
      // sessionStorage may be unavailable (private mode in some browsers).
      // Continue anyway — at worst we get a few extra rows.
    }

    const body = {
      sessionId: getOrCreateSessionId(),
      source,
      medium,
      campaign: utmCampaign,
      term: params.get('utm_term'),
      content: params.get('utm_content'),
      referrer: document.referrer || null,
      landingPath: window.location.pathname,
    };

    // Use sendBeacon when available — it survives page unload and doesn't
    // block navigation. Fall back to fetch for browsers without it.
    try {
      const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
      if (navigator.sendBeacon?.('/api/track/visit', blob)) return;
    } catch {
      // fall through to fetch
    }

    void fetch('/api/track/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {
      // Swallow errors — analytics failures must never affect page UX.
    });
  }, []);

  return null;
}
