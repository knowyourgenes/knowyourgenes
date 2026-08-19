import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/server/prisma';
import { auth } from '@/features/auth';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatPaise, catalogHref } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

type Params = Promise<{ orderNumber: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { orderNumber } = await params;
  return { title: `Order ${orderNumber}` };
}

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

export default async function OrderDetailPage({ params }: { params: Params }) {
  const { orderNumber } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: { orderBy: { nameSnapshot: 'asc' } },
      package: { select: { name: true, slug: true } },
      address: true,
      events: { orderBy: { createdAt: 'asc' } },
      payments: { orderBy: { createdAt: 'desc' } },
      shipments: { orderBy: { createdAt: 'asc' } },
      report: { select: { reportNumber: true, deliveredAt: true } },
    },
  });

  // 404 rather than 403 for someone else's order - an order number must not be
  // a probe for whether an order exists.
  if (!order || (order.userId !== userId && session!.user.role !== 'ADMIN')) notFound();

  const lines = order.items.length
    ? order.items
    : // Pre-cart orders carry no items; synthesise one line from the primary package.
      [
        {
          id: order.id,
          nameSnapshot: order.package?.name ?? 'Test',
          slugSnapshot: order.package?.slug ?? '',
          quantity: 1,
          unitPrice: order.subtotal,
          lineTotal: order.subtotal,
        },
      ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/dashboard/orders" className="text-sm text-muted-foreground hover:underline">
            ← All orders
          </Link>
          <h1 className="mt-1 font-mono text-2xl font-semibold tracking-tight">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
            {order.paidAt
              ? ` · paid ${new Date(order.paidAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}`
              : ' · payment pending'}
          </p>
        </div>
        <Badge variant={statusVariant[order.status] ?? 'secondary'} className="mt-1">
          {order.status.replaceAll('_', ' ')}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What you ordered</CardTitle>
              <CardDescription>
                One saliva kit, {lines.length} report{lines.length === 1 ? '' : 's'} read from the same sample.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between gap-4 rounded-md border border-dashed bg-muted/40 p-3">
                <div>
                  <p className="text-sm font-medium">Saliva collection kit</p>
                  <p className="text-xs text-muted-foreground">
                    Delivered to you, sample collected at home, couriered back to the lab.
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium text-muted-foreground">Included</span>
              </div>

              <ul className="divide-y">
                {lines.map((item) => {
                  const href = item.slugSnapshot ? catalogHref(item.slugSnapshot) : null;
                  return (
                    <li key={item.id} className="flex items-start justify-between gap-4 py-3">
                      <div className="min-w-0">
                        <p className="font-medium">
                          {href ? (
                            <Link href={href} className="hover:underline">
                              {item.nameSnapshot}
                            </Link>
                          ) : (
                            item.nameSnapshot
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatPaise(item.unitPrice)} × {item.quantity}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-medium tabular-nums">{formatPaise(item.lineTotal)}</span>
                    </li>
                  );
                })}
              </ul>

              <dl className="space-y-1.5 border-t pt-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{formatPaise(order.subtotal)}</dd>
                </div>
                {order.collectionFee > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Kit shipping</dt>
                    <dd className="tabular-nums">{formatPaise(order.collectionFee)}</dd>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <dt>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</dt>
                    <dd className="tabular-nums">−{formatPaise(order.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between border-t pt-1.5 text-base font-semibold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{formatPaise(order.total)}</dd>
                </div>
              </dl>

              {!order.paidAt && order.status === 'BOOKED' && (
                <div className="rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-sm">
                  <p className="font-medium">Payment not completed</p>
                  <p className="mt-0.5 text-muted-foreground">
                    This order is held but not paid for. Add the tests to your cart again to retry payment.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Progress</CardTitle>
              <CardDescription>Every update on this order, newest last.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {order.events.map((e) => (
                  <li key={e.id} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">{e.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(e.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Delivery address</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed">
              <p className="font-medium">{order.address.fullName}</p>
              <p className="text-muted-foreground">
                {order.address.line1}
                {order.address.line2 ? `, ${order.address.line2}` : ''}
                <br />
                {order.address.area}, {order.address.city} {order.address.pincode}
                {order.address.landmark ? (
                  <>
                    <br />
                    Landmark: {order.address.landmark}
                  </>
                ) : null}
                <br />
                {order.address.phone}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Collection</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {order.slotDate ? (
                <>
                  <p className="font-medium">
                    {new Date(order.slotDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                  </p>
                  <p className="text-muted-foreground">{order.slotWindow}</p>
                </>
              ) : (
                <p className="text-muted-foreground">
                  Your kit is couriered to the address above. Post the sample back with the prepaid label inside - no
                  home visit needed.
                </p>
              )}
            </CardContent>
          </Card>

          {order.shipments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shipments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {order.shipments.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">
                      {s.leg === 'FORWARD' ? 'Kit to you' : 'Sample to lab'}
                    </span>
                    <span className="font-mono text-xs">{s.awb ?? s.status}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {order.report?.deliveredAt && (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-base">Your report is ready</CardTitle>
                <CardDescription className="font-mono text-xs">{order.report.reportNumber}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/reports" className={cn(buttonVariants({ size: 'sm' }))}>
                  Open reports
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
