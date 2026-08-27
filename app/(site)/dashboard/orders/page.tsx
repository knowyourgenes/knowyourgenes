import Link from 'next/link';
import { ArrowRight, ClipboardList, FileText, Package, Truck, User2 } from 'lucide-react';

import { prisma } from '@/server/prisma';
import { auth } from '@/features/auth';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatPaise } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

/**
 * Where an order is, in the customer's words rather than the enum's.
 *
 * The raw status is an internal vocabulary - SAMPLE_IN_TRANSIT, AT_LAB - and
 * printing it with the underscores swapped for spaces was leaking our pipeline
 * into someone's account page. Each stage gets a plain-English label and a tone,
 * so the row reads as progress rather than as a database value.
 */
const STAGE: Record<string, { label: string; tone: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  BOOKED: { label: 'Confirmed', tone: 'secondary' },
  KIT_DISPATCHED: { label: 'Kit on its way', tone: 'outline' },
  KIT_DELIVERED: { label: 'Kit delivered', tone: 'outline' },
  SAMPLE_PICKED_UP: { label: 'Sample collected', tone: 'outline' },
  SAMPLE_IN_TRANSIT: { label: 'On its way to the lab', tone: 'outline' },
  AGENT_ASSIGNED: { label: 'Collection scheduled', tone: 'outline' },
  AGENT_EN_ROUTE: { label: 'Collector on the way', tone: 'outline' },
  SAMPLE_COLLECTED: { label: 'Sample collected', tone: 'outline' },
  AT_LAB: { label: 'At the lab', tone: 'outline' },
  REPORT_READY: { label: 'Report ready', tone: 'default' },
  CANCELLED: { label: 'Cancelled', tone: 'destructive' },
  REFUNDED: { label: 'Refunded', tone: 'destructive' },
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
      // So a finished order can offer the one thing the customer actually wants
      // from it, instead of making them go via the order detail page to find it.
      report: { select: { id: true, deliveredAt: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {orders.length === 0
            ? "Every test you've booked will appear here."
            : `${orders.length} order${orders.length === 1 ? '' : 's'}, past and upcoming.`}
        </p>
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

            const stage = STAGE[o.status] ?? { label: o.status, tone: 'secondary' as const };
            const readyReport = o.report?.deliveredAt ? o.report : null;
            const atHome = Boolean(o.slotDate);

            return (
              <Card key={o.id} className="group relative overflow-hidden transition hover:border-primary/40 hover:shadow-sm">
                <CardContent className="space-y-3 py-4">
                  {/* ---- title row ---- */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      {/* Stretched, so the whole card opens the order. Only genuinely
                          interactive things below get lifted above it - see the
                          reports list for what happens when a decorative span is. */}
                      <Link
                        href={`/dashboard/orders/${o.orderNumber}`}
                        className="font-medium leading-snug after:absolute after:inset-0"
                      >
                        {lines.map((l) => (l.quantity > 1 ? `${l.label} × ${l.quantity}` : l.label)).join(' + ')}
                      </Link>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">{o.orderNumber}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {!o.paidAt && o.status === 'BOOKED' && (
                        <Badge variant="destructive" className="text-[10px]">
                          Payment pending
                        </Badge>
                      )}
                      <Badge variant={stage.tone} className="text-[10px]">
                        {stage.label}
                      </Badge>
                    </div>
                  </div>

                  {/* ---- one meta line, not a four-column grid ----
                      The old layout gave a quarter of every row to "Agent",
                      which reads "-" on every kit-by-post order - which is all
                      of them. Facts now sit inline and the ones that do not
                      apply simply are not there. */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      {atHome ? <User2 className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
                      {atHome
                        ? `${new Date(o.slotDate!).toLocaleDateString('en-IN', { dateStyle: 'medium' })}${
                            o.slotWindow ? ` · ${o.slotWindow.toLowerCase()}` : ''
                          }`
                        : 'Kit by post'}
                    </span>

                    {/* Only when there IS one. */}
                    {o.agent?.user.name && (
                      <span className="inline-flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5" />
                        {o.agent.user.name}
                      </span>
                    )}

                    <span>Booked {new Date(o.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                    <span className="font-medium text-foreground tabular-nums">{formatPaise(o.total)}</span>
                  </div>

                  {/* ---- the action ---- */}
                  <div className="flex items-center justify-between gap-3 border-t pt-3">
                    {readyReport ? (
                      // The whole point of the order, so it gets to be a button.
                      // z-10 lifts it above the stretched link; it goes somewhere
                      // different, so it has to win the click.
                      <Link
                        href={`/dashboard/reports/${readyReport.id}`}
                        className={cn(buttonVariants({ size: 'sm' }), 'relative z-10 gap-1.5')}
                      >
                        <FileText className="h-4 w-4" />
                        Read your report
                      </Link>
                    ) : !o.paidAt && o.status === 'BOOKED' ? (
                      <p className="text-xs text-muted-foreground">
                        This order is held but not paid for. Add the tests to your cart again to retry payment.
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        We&apos;ll email you the moment there is news.
                      </p>
                    )}

                    {/* Not lifted, so the stretched link underneath takes the click. */}
                    <span
                      aria-hidden="true"
                      className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary transition group-hover:gap-1.5"
                    >
                      View details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
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
