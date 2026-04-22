import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { auth } from '@/auth';
import AppSidebar from '@/components/admin/AppSidebar';
import { buttonVariants } from '@/components/ui/button';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect('/login?from=/admin');

  const role = session.user.role;
  if (!['ADMIN', 'COUNSELLOR', 'PARTNER'].includes(role)) redirect('/');

  return (
    <SidebarProvider>
      <AppSidebar
        role={role}
        name={session.user.name ?? session.user.email ?? 'User'}
        email={session.user.email ?? ''}
      />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur md:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between">
            <div className="text-sm text-muted-foreground hidden sm:block">
              Signed in as <span className="font-medium text-foreground">{session.user.email}</span>
            </div>
            <Link href="/api-docs" target="_blank" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
              API docs <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-x-auto p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
