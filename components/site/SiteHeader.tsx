'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Menu, LayoutDashboard } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import UserNav from '@/components/admin/UserNav';
import LocationGate from '@/components/site/LocationGate';
import { cn } from '@/lib/utils';

// Edit these to match your final sitemap - any route that doesn't exist yet
// will 404 until you add the page.
const NAV = [
  { href: '/tests', label: 'Tests' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/counselling', label: 'Counselling' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center">
          <Image
            src="/kyglogo.webp"
            alt="Know Your Genes"
            width={160}
            height={40}
            className="h-10 w-auto object-contain"
            style={{ width: 'auto' }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                'rounded px-3 py-2 text-sm font-medium transition',
                isActive(n.href) ? 'text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Location chip - always visible. Works even when Mappls is down
              via the manual pincode path. */}
          <div className="hidden md:block">
            <LocationGate />
          </div>

          {status === 'authenticated' && session?.user ? (
            <>
              {session.user.role === 'ADMIN' && (
                <Link
                  href="/admin/dashboard"
                  className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'hidden sm:inline-flex')}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
              <UserNav
                name={session.user.name ?? session.user.email ?? 'User'}
                email={session.user.email ?? ''}
                role={session.user.role}
                image={session.user.image ?? null}
              />
            </>
          ) : (
            <>
              <Link
                href={`/login?from=${encodeURIComponent(pathname || '/')}`}
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'hidden sm:inline-flex')}
              >
                Sign in
              </Link>
              <Link href="/tests" className={cn(buttonVariants({ size: 'sm' }), 'hidden sm:inline-flex')}>
                Book a test
              </Link>
            </>
          )}

          {/* Mobile menu trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu" />}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col p-0">
              <SheetHeader className="border-b">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="border-b p-3">
                <LocationGate />
              </div>
              <nav className="flex-1 overflow-y-auto p-2">
                <ul className="flex flex-col gap-1">
                  {NAV.map((n) => (
                    <li key={n.href}>
                      <SheetClose
                        render={
                          <Link
                            href={n.href}
                            className={cn(
                              'block rounded px-3 py-2 text-sm font-medium transition',
                              isActive(n.href)
                                ? 'bg-muted text-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                          />
                        }
                      >
                        {n.label}
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="border-t p-4">
                {status === 'authenticated' && session?.user ? (
                  session.user.role === 'ADMIN' ? (
                    <Link
                      href="/admin/dashboard"
                      className={cn(buttonVariants({ size: 'sm' }), 'w-full')}
                      onClick={() => setMobileOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Go to dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard/profile"
                      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full')}
                      onClick={() => setMobileOpen(false)}
                    >
                      My profile
                    </Link>
                  )
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/tests"
                      className={cn(buttonVariants({ size: 'sm' }), 'w-full')}
                      onClick={() => setMobileOpen(false)}
                    >
                      Book a test
                    </Link>
                    <Link
                      href={`/login?from=${encodeURIComponent(pathname || '/')}`}
                      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full')}
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign in
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
