// Edge-safe config - no Prisma, no bcrypt.
// Used by middleware.ts. Full auth with Credentials provider lives in auth.ts.

import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

export default {
  // Self-hosted (VPS behind Cloudflare), not Vercel - Auth.js can't auto-detect
  // a trusted host, so it rejects requests in production builds with
  // `UntrustedHost`. We terminate TLS at a trusted proxy that sets the Host
  // header, so trusting it is safe. (Dev auto-trusts localhost regardless.)
  trustHost: true,

  // Cookies are scoped by HOST, not by port, so every Next app on localhost
  // shares one jar. This repo and D:/DN/DNMS/WEBISTE_DNMS both run there with
  // Auth.js defaults, so both write "authjs.session-token" - and whichever you
  // signed into last leaves a cookie the other cannot decrypt:
  //
  //   [auth][error] JWTSessionError
  //   [auth][cause]: Error: no matching decryption secret
  //
  // A project-specific name in DEVELOPMENT keeps the two apart. Production
  // deliberately keeps the default name: renaming it there would sign out every
  // live user once, to fix something that only happens on a dev machine.
  // Auth.js merges this over its defaults, so httpOnly/sameSite/path/secure are
  // untouched (see merge(defaultCookies(...), config.cookies) in @auth/core).
  ...(process.env.NODE_ENV === 'development' ? { cookies: { sessionToken: { name: 'kyg.dev.session-token' } } } : {}),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // Google's standard scopes - email, profile, openid.
      // Phone number is NOT returned by these scopes.
      authorization: {
        params: {
          scope: 'openid email profile',
          prompt: 'select_account',
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;
      const role = (auth?.user as { role?: string } | undefined)?.role;

      // Three shells (see architecture notes):
      //  /dashboard - consumer (users)
      //  /agent     - field ops (mobile-first), agents only
      //  /admin     - desk ops (admins + counsellors + lab partners)
      //               Sidebar tabs are filtered by role inside /admin.
      const gates: { prefix: string; roles: string[] }[] = [
        { prefix: '/admin', roles: ['ADMIN', 'COUNSELLOR', 'PARTNER'] },
        { prefix: '/agent', roles: ['AGENT', 'ADMIN'] },
        { prefix: '/dashboard', roles: ['USER', 'ADMIN'] },
      ];

      for (const g of gates) {
        if (path.startsWith(g.prefix)) {
          if (!isLoggedIn) {
            // Custom redirect: NextAuth's default uses
            // `?callbackUrl=<fully-encoded URL>` (the ugly %3A%2F%2F mess),
            // and our /login page reads `?from` anyway. Build a clean
            // `/login?from=/admin/service-area` ourselves. Slashes inside a
            // query value are legal per RFC 3986, so we skip URLSearchParams
            // (which would percent-encode them) and concatenate directly.
            const target = path + (nextUrl.search || '');
            return Response.redirect(`${nextUrl.origin}/login?from=${target}`);
          }
          if (!role || !g.roles.includes(role)) {
            return Response.redirect(new URL('/', nextUrl));
          }
          return true;
        }
      }

      // Auth pages: redirect to dashboard if already signed in.
      if (['/login', '/signup', '/forgot-password'].includes(path) && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? 'USER';
        token.phone = (user as { phone?: string | null }).phone ?? null;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = (token.role as string) ?? 'USER';
        (session.user as { phone?: string | null }).phone = (token.phone as string | null) ?? null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
