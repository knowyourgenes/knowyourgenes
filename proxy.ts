import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import authConfig from '@/auth.config';
import {
  ATTRIBUTION_COOKIE,
  ATTRIBUTION_COOKIE_OPTS,
  ATTRIBUTION_MODEL,
  captureFromRequest,
  signAttribution,
} from '@/lib/attribution';

// Proxy runs on the edge for page routes only.
// API routes skip the proxy entirely and do their own auth via requireApiRole()
// inside each handler - this saves ~150ms per API call since NextAuth isn't
// invoked for endpoints that already check the session cookie directly.
export const { auth: proxy } = NextAuth(authConfig);

// Set to true in dev to log attribution-capture decisions to the server terminal.
// Leave false in prod — these logs are noisy.
const DEBUG_ATTRIBUTION = process.env.NODE_ENV !== 'production';

export default proxy((req) => {
  const url = new URL(req.url);

  // ATTRIBUTION CAPTURE (FIRST-TOUCH by default)
  // ------------------------------------------------------------------------
  // On any non-API page request, check if the visitor already has a kyg_attr
  // cookie. If yes (and we're in first-touch mode), leave it alone. If no —
  // or we're in last-touch mode AND new UTM params are present — derive a
  // fresh attribution payload from URL utm_* + referer header, sign it, and
  // attach Set-Cookie to the response.
  //
  // The page render proceeds normally; the cookie is set as a side effect.
  const existing = req.cookies.get(ATTRIBUTION_COOKIE)?.value;

  const hasUtmInUrl =
    url.searchParams.has('utm_source') || url.searchParams.has('utm_campaign') || url.searchParams.has('utm_medium');

  const shouldCapture =
    !existing || (ATTRIBUTION_MODEL === 'last-touch' && hasUtmInUrl) || url.searchParams.has('attr_refresh');

  if (DEBUG_ATTRIBUTION) {
    // eslint-disable-next-line no-console
    console.log(
      `[attr] ${url.pathname}${url.search}`,
      JSON.stringify({
        hasCookie: !!existing,
        hasUtm: hasUtmInUrl,
        shouldCapture,
        referer: req.headers.get('referer'),
      })
    );
  }

  if (shouldCapture) {
    const payload = captureFromRequest({
      searchParams: url.searchParams,
      referer: req.headers.get('referer'),
      pathname: url.pathname,
    });
    if (payload) {
      const res = NextResponse.next();
      res.cookies.set(ATTRIBUTION_COOKIE_OPTS.name, signAttribution(payload), {
        httpOnly: ATTRIBUTION_COOKIE_OPTS.httpOnly,
        secure: ATTRIBUTION_COOKIE_OPTS.secure,
        sameSite: ATTRIBUTION_COOKIE_OPTS.sameSite,
        path: ATTRIBUTION_COOKIE_OPTS.path,
        maxAge: ATTRIBUTION_COOKIE_OPTS.maxAge,
      });
      if (DEBUG_ATTRIBUTION) {
        // eslint-disable-next-line no-console
        console.log(`[attr]   → set cookie:`, JSON.stringify(payload));
      }
      return res;
    }
  }
});

export const config = {
  // Skip:
  //  - /api/*        → handler-level auth (faster)
  //  - /studio/*     → Sanity Studio has its own auth
  //  - /_next/*      → framework internals
  //  - static assets → favicon, images
  matcher: ['/((?!api|studio|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)$).*)'],
};
