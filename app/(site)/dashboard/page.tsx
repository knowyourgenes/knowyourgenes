import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, FileText, Sparkles, Calendar, ArrowRight, Microscope } from 'lucide-react';

export const dynamic = 'force-dynamic';

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  BOOKED: 'secondary',
  AGENT_ASSIGNED: 'outline',
  AGENT_EN_ROUTE: 'outline',
  SAMPLE_COLLECTED: 'outline',
  AT_LAB: 'outline',
  REPORT_READY: 'default',
  CANCELLED: 'destructive',
  REFUNDED: 'destructive',
};

export default async function DashboardOverviewPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [orders, reports, upcoming] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        slotDate: true,
        slotWindow: true,
        createdAt: true,
        package: { select: { name: true } },
      },
    }),
    prisma.report.findMany({
      where: { userId, deliveredAt: { not: null } },
      orderBy: { deliveredAt: 'desc' },
      take: 3,
      select: {
        id: true,
        reportNumber: true,
        packageName: true,
        deliveredAt: true,
      },
    }),
    prisma.order.findFirst({
      where: {
        userId,
        status: { in: ['BOOKED', 'AGENT_ASSIGNED', 'AGENT_EN_ROUTE'] },
        slotDate: { gte: new Date() },
      },
      orderBy: { slotDate: 'asc' },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        slotDate: true,
        slotWindow: true,
        package: { select: { name: true } },
        agent: { select: { user: { select: { name: true } } } },
      },
    }),
  ]);

  const activeOrders = orders.filter((o) => !['REPORT_READY', 'CANCELLED', 'REFUNDED'].includes(o.status)).length;

  const name = session!.user.name?.split(' ')[0] ?? 'there';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Hi {name} 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here's what's happening with your tests.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Active orders</CardDescription>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{activeOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Reports delivered</CardDescription>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{reports.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Loyalty points</CardDescription>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-primary">0</div>
          </CardContent>
        </Card>
      </div>

      {upcoming && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Upcoming collection</CardTitle>
            </div>
            <CardDescription>Your phlebotomist will arrive in the chosen window.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Test</p>
                <p className="mt-1 font-medium">{upcoming.package.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Slot</p>
                <p className="mt-1 font-medium">
                  {new Date(upcoming.slotDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </p>
                <p className="text-xs text-muted-foreground">{upcoming.slotWindow}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Agent</p>
                <p className="mt-1 font-medium">{upcoming.agent?.user.name ?? 'Assigning soon…'}</p>
              </div>
            </div>
            <div className="mt-4">
              <Badge variant={statusVariant[upcoming.status] ?? 'secondary'}>{upcoming.status}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>Your last 5 bookings.</CardDescription>
          </div>
          <Link href="/dashboard/orders" className="text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Microscope className="h-5 w-5" />
              </div>
              <p className="mt-4 font-medium">No orders yet</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Book your first DNA test and a phlebotomist will visit you within your chosen slot.
              </p>
              <Button className="mt-4" disabled>
                Browse tests <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <ul className="divide-y">
              {orders.map((o) => (
                <li key={o.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{o.package.name}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-mono">{o.orderNumber}</span> ·{' '}
                      {new Date(o.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={statusVariant[o.status] ?? 'secondary'}>{o.status}</Badge>
                    <span className="text-sm font-medium">₹{Math.floor(o.total / 100).toLocaleString('en-IN')}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Recent reports</CardTitle>
            <CardDescription>Your latest delivered results.</CardDescription>
          </div>
          <Link href="/dashboard/reports" className="text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No reports yet. They'll appear here 7–14 days after sample collection.
            </p>
          ) : (
            <ul className="divide-y">
              {reports.map((r) => (
                <li key={r.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{r.packageName}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-mono">{r.reportNumber}</span> · Delivered{' '}
                      {r.deliveredAt
                        ? new Date(r.deliveredAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })
                        : '-'}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/reports/${r.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
