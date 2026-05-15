/**
 * Attribution capture and signing.
 *
 * Flow:
 *   1. Landing — proxy.ts calls captureFromRequest() with URL query + referer.
 *      If a kyg_attr cookie already exists (FIRST-TOUCH wins), we don't
 *      overwrite. Otherwise we derive a payload, sign it, and set the cookie.
 *   2. Checkout — readAttributionCookie() verifies signature and returns the
 *      payload to be denormalised onto the Order row.
 *
 * Cookie format:
 *   <base64url JSON payload>.<base64url hmac-sha256(payload, AUTH_SECRET)>
 *
 * Cookie attributes:
 *   HttpOnly, Secure (in prod), SameSite=Lax, Path=/, Max-Age=30 days.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

export const ATTRIBUTION_COOKIE = 'kyg_attr';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

// First-touch is the default. Set to 'last-touch' if business preference flips.
export const ATTRIBUTION_MODEL: 'first-touch' | 'last-touch' = 'first-touch';

// ---------------------------------------------------------------------------
// Payload shape — kept short to keep cookie under 4 KB
// ---------------------------------------------------------------------------

export type AttributionPayload = {
  s: string; // source     (utm_source OR derived)
  m: string; // medium     (utm_medium OR derived)
  c?: string; // campaign   (utm_campaign)
  t?: string; // term       (utm_term)
  ct?: string; // content   (utm_content)
  r?: string; // referrer  (raw document.referrer header value, truncated)
  lp?: string; // landingPath
  fs: number; // firstSeenAt (unix epoch seconds)
};

// Expanded form used by application code.
export type Attribution = {
  source: string;
  medium: string;
  campaign?: string;
  term?: string;
  content?: string;
  referrer?: string;
  landingPath?: string;
  firstSeenAt: Date;
};

// ---------------------------------------------------------------------------
// Sign / verify
// ---------------------------------------------------------------------------

function getKey(): string {
  const k = process.env.AUTH_SECRET;
  if (!k) throw new Error('AUTH_SECRET missing — required for attribution cookie signing');
  return k;
}

function b64urlEncode(buf: Buffer | string): string {
  const b = typeof buf === 'string' ? Buffer.from(buf, 'utf8') : buf;
  return b.toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function b64urlDecode(s: string): Buffer {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64');
}

function hmac(payload: string): string {
  return b64urlEncode(createHmac('sha256', getKey()).update(payload).digest());
}

export function signAttribution(p: AttributionPayload): string {
  const body = b64urlEncode(JSON.stringify(p));
  return `${body}.${hmac(body)}`;
}

export function verifyAttribution(signed: string): AttributionPayload | null {
  const dot = signed.indexOf('.');
  if (dot < 0) return null;
  const body = signed.slice(0, dot);
  const sig = signed.slice(dot + 1);
  // Constant-time compare to avoid timing leaks. Both buffers must be the same
  // length for timingSafeEqual; if not, the signature is invalid by definition.
  const expected = Buffer.from(hmac(body));
  const got = Buffer.from(sig);
  if (expected.length !== got.length || !timingSafeEqual(expected, got)) return null;
  try {
    return JSON.parse(b64urlDecode(body).toString('utf8')) as AttributionPayload;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Derivation — UTM has priority over referrer; referrer over nothing.
// ---------------------------------------------------------------------------

export function captureFromRequest(opts: {
  searchParams: URLSearchParams;
  referer: string | null;
  pathname: string;
}): AttributionPayload | null {
  const { searchParams, referer, pathname } = opts;

  const utmSource = clean(searchParams.get('utm_source'));
  const utmMedium = clean(searchParams.get('utm_medium'));
  const utmCampaign = clean(searchParams.get('utm_campaign'));
  const utmTerm = clean(searchParams.get('utm_term'));
  const utmContent = clean(searchParams.get('utm_content'));

  // Platform click identifiers — Google Ads (gclid), Meta Ads (fbclid),
  // Microsoft Ads (msclkid), TikTok (ttclid). When these are present without
  // a utm_source, we know it's a paid click even if the marketer forgot to
  // tag the URL — derive the source from the click-id family.
  const clickIdSource = deriveFromClickIds(searchParams);

  const fs = Math.floor(Date.now() / 1000);

  // 1. UTM present — paid / tracked source
  if (utmSource || utmCampaign) {
    const fallback = deriveFromReferrer(referer);
    return strip({
      s: utmSource ?? clickIdSource?.source ?? fallback.source ?? 'direct',
      m: utmMedium ?? clickIdSource?.medium ?? fallback.medium ?? 'none',
      c: utmCampaign,
      t: utmTerm,
      ct: utmContent,
      r: shortenReferrer(referer),
      lp: pathname,
      fs,
    });
  }

  // 2. No UTM but a paid-click-id is present — treat as paid traffic.
  if (clickIdSource) {
    return strip({
      s: clickIdSource.source,
      m: clickIdSource.medium,
      r: shortenReferrer(referer),
      lp: pathname,
      fs,
    });
  }

  // 3. No UTM — derive from referrer
  if (referer) {
    const d = deriveFromReferrer(referer);
    if (d.source) {
      return strip({
        s: d.source,
        m: d.medium,
        r: shortenReferrer(referer),
        lp: pathname,
        fs,
      });
    }
  }

  // 4. Nothing — direct/none
  return strip({
    s: 'direct',
    m: 'none',
    lp: pathname,
    fs,
  });
}

// Paid-click identifiers that ad platforms append automatically.
function deriveFromClickIds(p: URLSearchParams): { source: string; medium: string } | null {
  if (p.get('gclid')) return { source: 'google', medium: 'cpc' };
  if (p.get('gbraid') || p.get('wbraid')) return { source: 'google', medium: 'cpc' };
  if (p.get('fbclid')) return { source: 'facebook', medium: 'paid_social' };
  if (p.get('msclkid')) return { source: 'bing', medium: 'cpc' };
  if (p.get('ttclid')) return { source: 'tiktok', medium: 'paid_social' };
  if (p.get('li_fat_id')) return { source: 'linkedin', medium: 'paid_social' };
  if (p.get('twclid')) return { source: 'twitter', medium: 'paid_social' };
  return null;
}

// Referrer host → { source, medium } derivation.
// Returned medium uses *_organic suffix when not coming from a paid link, so a
// report can cleanly separate paid vs organic from the same source name.
//
// Host-matching strategy: we test against the full hostname. Patterns use
// `(?:^|\.)domain\.tld$` so subdomains (m.facebook.com, lm.instagram.com,
// in.linkedin.com, lite.duckduckgo.com) are captured. Click-tracker subdomains
// like l.facebook.com / lm.instagram.com fall under the same rule.
const REFERRER_RULES: Array<{ test: RegExp; source: string; medium: string }> = [
  // Search engines — match TLD variants (.com, .co.in, .co.uk, etc.) via `google\..+`.
  { test: /(?:^|\.)google\.[a-z.]+$/, source: 'google', medium: 'organic' },
  { test: /(?:^|\.)bing\.com$/, source: 'bing', medium: 'organic' },
  { test: /(?:^|\.)duckduckgo\.com$/, source: 'duckduckgo', medium: 'organic' },
  { test: /(?:^|\.)yahoo\.[a-z.]+$/, source: 'yahoo', medium: 'organic' },
  { test: /(?:^|\.)yandex\.[a-z.]+$/, source: 'yandex', medium: 'organic' },
  { test: /(?:^|\.)baidu\.com$/, source: 'baidu', medium: 'organic' },
  { test: /(?:^|\.)ecosia\.org$/, source: 'ecosia', medium: 'organic' },
  { test: /(?:^|\.)brave\.com$|^search\.brave\.com$/, source: 'brave', medium: 'organic' },

  // Social — subdomains (m.*, lm.*, l.*) get caught by the (?:^|\.) prefix.
  { test: /(?:^|\.)instagram\.com$/, source: 'instagram', medium: 'social_organic' },
  { test: /(?:^|\.)facebook\.com$|^fb\.com$|(?:^|\.)fb\.me$/, source: 'facebook', medium: 'social_organic' },
  { test: /(?:^|\.)twitter\.com$|^t\.co$|(?:^|\.)x\.com$/, source: 'twitter', medium: 'social_organic' },
  { test: /(?:^|\.)linkedin\.com$|^lnkd\.in$/, source: 'linkedin', medium: 'social_organic' },
  { test: /(?:^|\.)youtube\.com$|^youtu\.be$/, source: 'youtube', medium: 'social_organic' },
  { test: /(?:^|\.)reddit\.com$/, source: 'reddit', medium: 'social_organic' },
  { test: /(?:^|\.)pinterest\.[a-z.]+$/, source: 'pinterest', medium: 'social_organic' },
  { test: /(?:^|\.)quora\.com$/, source: 'quora', medium: 'social_organic' },
  { test: /(?:^|\.)tiktok\.com$/, source: 'tiktok', medium: 'social_organic' },
  { test: /(?:^|\.)snapchat\.com$/, source: 'snapchat', medium: 'social_organic' },
  { test: /(?:^|\.)threads\.net$/, source: 'threads', medium: 'social_organic' },

  // Messaging / referral — these usually mean someone shared a link in chat.
  { test: /^wa\.me$|(?:^|\.)whatsapp\.com$/, source: 'whatsapp', medium: 'referral_organic' },
  { test: /^t\.me$|(?:^|\.)telegram\.org$/, source: 'telegram', medium: 'referral_organic' },
  { test: /(?:^|\.)messenger\.com$/, source: 'messenger', medium: 'referral_organic' },

  // Email clients / link wrappers — these signal email traffic.
  { test: /(?:^|\.)mail\.google\.com$/, source: 'gmail', medium: 'email' },
  { test: /(?:^|\.)mail\.yahoo\.com$/, source: 'yahoo_mail', medium: 'email' },
  { test: /(?:^|\.)outlook\.live\.com$|(?:^|\.)outlook\.office\.com$/, source: 'outlook', medium: 'email' },
];

const SAME_SITE_HOSTS = new Set(['kyg.in', 'www.kyg.in', 'localhost', '127.0.0.1']);

export function deriveFromReferrer(referer: string | null): { source: string | null; medium: string } {
  if (!referer) return { source: null, medium: 'none' };
  let host: string;
  try {
    host = new URL(referer).hostname.toLowerCase();
  } catch {
    return { source: null, medium: 'none' };
  }
  // Same-site referrers are not attribution sources.
  if (SAME_SITE_HOSTS.has(host)) return { source: null, medium: 'none' };
  for (const rule of REFERRER_RULES) {
    if (rule.test.test(host)) return { source: rule.source, medium: rule.medium };
  }
  // Unknown external domain — bucket as generic referral. Strip a leading
  // "www." for cleaner reporting (so www.example.com and example.com bucket
  // together).
  const cleanHost = host.replace(/^www\./, '');
  return { source: cleanHost, medium: 'referral' };
}

function clean(v: string | null): string | undefined {
  if (!v) return undefined;
  const s = v.trim().slice(0, 120);
  return s || undefined;
}

function shortenReferrer(r: string | null): string | undefined {
  if (!r) return undefined;
  // Strip query / fragment to keep cookie small; host + path is enough for debugging.
  try {
    const u = new URL(r);
    return (u.origin + u.pathname).slice(0, 200);
  } catch {
    return r.slice(0, 200);
  }
}

function strip(p: AttributionPayload): AttributionPayload {
  // Remove keys whose values are undefined so JSON.stringify keeps the payload tiny.
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(p)) {
    if (v !== undefined && v !== null) out[k] = v;
  }
  return out as unknown as AttributionPayload;
}

// ---------------------------------------------------------------------------
// Conversion helpers — payload <-> Order column shape
// ---------------------------------------------------------------------------

export function payloadToAttribution(p: AttributionPayload): Attribution {
  return {
    source: p.s,
    medium: p.m,
    campaign: p.c,
    term: p.t,
    content: p.ct,
    referrer: p.r,
    landingPath: p.lp,
    firstSeenAt: new Date(p.fs * 1000),
  };
}

// What gets denormalised onto an Order row at create time. Returns null when
// no attribution cookie was present or signature verification failed.
export function attributionToOrderFields(p: AttributionPayload | null): {
  attrSource: string | null;
  attrMedium: string | null;
  attrCampaign: string | null;
  attrTerm: string | null;
  attrContent: string | null;
  attrReferrer: string | null;
  attrLandingPath: string | null;
  attrFirstSeenAt: Date | null;
  attrPayload: AttributionPayload | null;
} {
  if (!p) {
    return {
      attrSource: null,
      attrMedium: null,
      attrCampaign: null,
      attrTerm: null,
      attrContent: null,
      attrReferrer: null,
      attrLandingPath: null,
      attrFirstSeenAt: null,
      attrPayload: null,
    };
  }
  return {
    attrSource: p.s,
    attrMedium: p.m,
    attrCampaign: p.c ?? null,
    attrTerm: p.t ?? null,
    attrContent: p.ct ?? null,
    attrReferrer: p.r ?? null,
    attrLandingPath: p.lp ?? null,
    attrFirstSeenAt: new Date(p.fs * 1000),
    attrPayload: p,
  };
}

// ---------------------------------------------------------------------------
// Cookie options used by the middleware
// ---------------------------------------------------------------------------

export const ATTRIBUTION_COOKIE_OPTS = {
  name: ATTRIBUTION_COOKIE,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: COOKIE_MAX_AGE_SECONDS,
};

// ---------------------------------------------------------------------------
// Server-side cookie reader — used by the checkout endpoint to attach
// attribution to the Order row at create time.
// ---------------------------------------------------------------------------

/**
 * Verifies and returns the attribution payload from a Next.js cookies bag.
 * Returns null when:
 *   - no cookie set,
 *   - signature invalid (tampered or signed under a rotated AUTH_SECRET).
 *
 * Caller should treat null as "direct/unknown" — never throw.
 */
export function readAttributionCookie(
  cookies: { get: (name: string) => { value: string } | undefined } | undefined | null
): AttributionPayload | null {
  if (!cookies) return null;
  const raw = cookies.get(ATTRIBUTION_COOKIE)?.value;
  if (!raw) return null;
  return verifyAttribution(raw);
}

// ---------------------------------------------------------------------------
// UTM link builder — used by the admin campaign builder
// ---------------------------------------------------------------------------

export function buildUtmUrl(opts: {
  origin?: string;
  destination: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string | null;
  content?: string | null;
}): string {
  const origin = opts.origin ?? (process.env.AUTH_URL || 'https://kyg.in');
  // Ensure destination starts with /
  const dest = opts.destination.startsWith('/') ? opts.destination : `/${opts.destination}`;
  const u = new URL(dest, origin);
  u.searchParams.set('utm_source', opts.source);
  u.searchParams.set('utm_medium', opts.medium);
  u.searchParams.set('utm_campaign', opts.campaign);
  if (opts.term) u.searchParams.set('utm_term', opts.term);
  if (opts.content) u.searchParams.set('utm_content', opts.content);
  return u.toString();
}
