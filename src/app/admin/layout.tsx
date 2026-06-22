import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import AppSidebar from '@/components/admin/AppSidebar';
import UserNav from '@/components/admin/UserNav';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect('/login?from=/admin');

  const role = session.user.role;
  if (!['ADMIN', 'COUNSELLOR', 'PARTNER'].includes(role)) redirect('/');

  const name = session.user.name ?? session.user.email ?? 'User';
  const email = session.user.email ?? '';

  return (
    <SidebarProvider>
      <AppSidebar role={role} name={name} email={email} />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur md:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-end">
            <UserNav name={name} email={email} role={role} image={session.user.image ?? null} />
          </div>
        </header>
        <main className="flex-1 overflow-x-auto p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
