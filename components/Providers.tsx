'use client';

import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';
import { CartDrawer } from '@/features/cart/components/CartDrawer';
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
      <CartProvider>
        {children}
        {/* One instance for the whole app. It has to live INSIDE CartProvider
            (it reads the basket) and outside any route layout, so that opening
            it never depends on which page the customer happens to be on. */}
        <CartDrawer />
      </CartProvider>
      <Toaster richColors closeButton position="top-right" />
    </SessionProvider>
  );
}
