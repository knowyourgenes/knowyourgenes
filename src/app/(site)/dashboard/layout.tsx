import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import DashboardNav from '@/components/dashboard/DashboardNav';

export const dynamic = 'force-dynamic';

// Auth guard + dashboard sub-nav. Site header/footer come from (site)/layout.tsx.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect('/login?from=/dashboard');
  if (!['USER', 'ADMIN'].includes(session.user.role)) redirect('/');

  return (
    <div className="bg-muted/20">
      <div className="border-b bg-background">
        <DashboardNav />
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">{children}</div>
    </div>
  );
}
