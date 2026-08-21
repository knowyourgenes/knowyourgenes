import Link from 'next/link';
import { prisma } from '@/server/prisma';
import { auth } from '@/features/auth';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPaise } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  BOOKED: 'secondary',
  KIT_DISPATCHED: 'outline',
  KIT_DELIVERED: 'outline',
  SAMPLE_PICKED_UP: 'outline',
  SAMPLE_IN_TRANSIT: 'outline',
  AGENT_ASSIGNED: 'outline',
  AGENT_EN_ROUTE: 'outline',
  SAMPLE_COLLECTED: 'outline',
  AT_LAB: 'outline',
  REPORT_READY: 'default',
  CANCELLED: 'destructive',
  REFUNDED: 'destructive',
};

export default async function UserOrdersPage() {
  const session = await auth();
  const userId = session!.user.id;

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      total: true,
      slotDate: true,
      slotWindow: true,
      createdAt: true,
      paidAt: true,
      package: { select: { name: true } },
      items: { select: { id: true, nameSnapshot: true, quantity: true, lineTotal: true } },
      agent: { select: { user: { select: { name: true } } } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every test you&apos;ve booked - past and upcoming.</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <ClipboardList className="h-5 w-5" />
            </div>
            <p className="mt-4 font-medium">No orders yet</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Once you book a test, it&apos;ll appear here with live status updates.
            </p>
            <Link href="/categories" className={cn(buttonVariants(), 'mt-4')}>
              Browse tests
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {orders.map((o) => {
            // Pre-cart orders have no items; fall back to the primary package.
            const lines = o.items.length
              ? o.items.map((i) => ({ key: i.id, label: i.nameSnapshot, quantity: i.quantity }))
              : [{ key: o.id, label: o.package?.name ?? 'Test', quantity: 1 }];

            return (
              <Card key={o.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="min-w-0">
                    <CardTitle className="text-base">
                      {lines.map((l) => (l.quantity > 1 ? `${l.label} × ${l.quantity}` : l.label)).join(' + ')}
                    </CardTitle>
                    <CardDescription className="font-mono text-xs">{o.orderNumber}</CardDescription>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {!o.paidAt && o.status === 'BOOKED' && <Badge variant="outline">Payment pending</Badge>}
                    <Badge variant={statusVariant[o.status] ?? 'secondary'}>{o.status.replaceAll('_', ' ')}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Collection</p>
                    <p className="text-sm font-medium">
                      {o.slotDate
                        ? new Date(o.slotDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })
                        : 'Kit by post'}
                    </p>
                    <p className="text-xs text-muted-foreground">{o.slotWindow ?? 'Couriered to your address'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Agent</p>
                    <p className="text-sm font-medium">{o.agent?.user.name ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Booked</p>
                    <p className="text-sm font-medium">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-sm font-medium">{formatPaise(o.total)}</p>
                    <Link
                      href={`/dashboard/orders/${o.orderNumber}`}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      View details →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
