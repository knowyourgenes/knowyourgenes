'use client';

import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/features/cart/hooks/use-cart';

export default function Providers({ children, session }: { children: React.ReactNode; session: Session | null }) {
  return (
    <SessionProvider
      session={session}
      // Skip the initial client-side fetch - the server already gave us the session.
      // Avoids the dev-mode "ClientFetchError: Failed to fetch" when /api/auth/session
      // is still compiling on first request.
      refetchOnWindowFocus={false}
      refetchInterval={0}
    >
      {/* Inside SessionProvider so the cart can read auth state later, but the
          basket itself is anonymous - it lives in localStorage, not on the user. */}
      <CartProvider>{children}</CartProvider>
      <Toaster richColors closeButton position="top-right" />
    </SessionProvider>
  );
}
