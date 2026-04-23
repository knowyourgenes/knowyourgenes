import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FlaskConical, LayoutDashboard, ClipboardList, FileText, User as UserIcon } from 'lucide-react';
import { auth } from '@/auth';
import UserNav from '@/components/admin/UserNav';
import DashboardNav from '@/components/dashboard/DashboardNav';

export const dynamic = 'force-dynamic';

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/orders', label: 'Orders', icon: ClipboardList, exact: false },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText, exact: false },
  { href: '/dashboard/profile', label: 'Profile', icon: UserIcon, exact: false },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect('/login?from=/dashboard');
  if (!['USER', 'ADMIN'].includes(session.user.role)) redirect('/');

  const name = session.user.name ?? session.user.email ?? 'User';
  const email = session.user.email ?? '';

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
              <FlaskConical className="h-4 w-4" />
            </span>
            <span className="text-base font-semibold tracking-tight">Know Your Genes</span>
          </Link>

          <UserNav name={name} email={email} role={session.user.role} image={session.user.image ?? null} />
        </div>

        <DashboardNav items={NAV} />
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8">{children}</main>
    </div>
  );
}
