// Edge-safe config — no Prisma, no bcrypt.
// Used by middleware.ts. Full auth with Credentials provider lives in auth.ts.

import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // Google's standard scopes — email, profile, openid.
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
      //  /dashboard — consumer (users)
      //  /agent     — field ops (mobile-first), agents only
      //  /admin     — desk ops (admins + counsellors + lab partners)
      //               Sidebar tabs are filtered by role inside /admin.
      const gates: { prefix: string; roles: string[] }[] = [
        { prefix: '/admin', roles: ['ADMIN', 'COUNSELLOR', 'PARTNER'] },
        { prefix: '/agent', roles: ['AGENT', 'ADMIN'] },
        { prefix: '/dashboard', roles: ['USER', 'ADMIN'] },
      ];

      for (const g of gates) {
        if (path.startsWith(g.prefix)) {
          if (!isLoggedIn) return false;
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
