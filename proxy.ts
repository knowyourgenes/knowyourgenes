import NextAuth from 'next-auth';
import authConfig from '@/auth.config';

// Proxy runs on the edge for page routes only.
// API routes skip the proxy entirely and do their own auth via requireApiRole()
// inside each handler - this saves ~150ms per API call since NextAuth isn't
// invoked for endpoints that already check the session cookie directly.
export const { auth: proxy } = NextAuth(authConfig);

export default proxy((req) => {
  void req;
});

export const config = {
  // Skip:
  //  - /api/*        → handler-level auth (faster)
  //  - /studio/*     → Sanity Studio has its own auth
  //  - /_next/*      → framework internals
  //  - static assets → favicon, images
  matcher: ['/((?!api|studio|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)$).*)'],
};
