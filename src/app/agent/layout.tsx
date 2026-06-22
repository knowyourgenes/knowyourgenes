import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import AgentBottomNav from '@/components/agent/AgentBottomNav';

export const dynamic = 'force-dynamic';

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login?from=/agent');
  if (session.user.role !== 'AGENT') redirect('/');

  const name = session.user.name ?? session.user.email ?? 'Agent';

  return (
    <div className="min-h-dvh bg-muted/40 pb-16">
      <header className="sticky top-0 z-20 border-b bg-background px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">KYG Agent</div>
          <div className="text-sm font-semibold truncate max-w-[60vw]">{name}</div>
        </div>
        <Link href="/agent/profile" className="text-xs text-muted-foreground underline-offset-2 hover:underline">
          Profile
        </Link>
      </header>
      <main className="px-4 py-4 max-w-2xl mx-auto">{children}</main>
      <AgentBottomNav />
    </div>
  );
}
