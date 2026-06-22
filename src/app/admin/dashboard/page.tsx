import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Package as PackageIcon,
  ShoppingCart,
  TrendingUp,
  Users as UsersIcon,
  TruckIcon,
  CalendarClock,
} from 'lucide-react';
import DateRangeFilter from '@/components/admin/DateRangeFilter';

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

const iconMap = {
  orders: ShoppingCart,
  revenue: TrendingUp,
  users: UsersIcon,
  agents: TruckIcon,
  packages: PackageIcon,
  today: CalendarClock,
};

type SearchParams = Promise<{ from?: string; to?: string }>;

export default async function AdminDashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await auth();
  const role = session!.user.role;
  const { from, to } = await searchParams;

  // Parse URL range. If both are present, scope orders + revenue + recent list.
  const rangeFrom = from ? new Date(from) : null;
  const rangeTo = to ? new Date(new Date(to).setHours(23, 59, 59, 999)) : null;
  const hasRange = !!(rangeFrom && rangeTo);

  const orderDateWhere = hasRange ? { createdAt: { gte: rangeFrom!, lte: rangeTo! } } : {};

  const [ordersCount, usersCount, agentsCount, packagesCount, revenue, todayCollections, recent] = await Promise.all([
    prisma.order.count({ where: orderDateWhere }),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.agentProfile.count({ where: { status: 'ACTIVE' } }),
    prisma.package.count({ where: { active: true } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paidAt: { not: null }, ...orderDateWhere },
    }),
    prisma.order.count({
      where: {
        slotDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(24, 0, 0, 0)),
        },
      },
    }),
    prisma.order.findMany({
      where: orderDateWhere,
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        package: { select: { name: true } },
      },
    }),
  ]);

  const rupees = (paise: number | null | undefined) =>
    paise ? `₹${Math.floor(paise / 100).toLocaleString('en-IN')}` : '₹0';

  const kpis = [
    {
      key: 'orders',
      label: hasRange ? 'Orders in range' : 'Total orders',
      value: ordersCount.toString(),
      icon: iconMap.orders,
    },
    {
      key: 'revenue',
      label: hasRange ? 'Revenue in range' : 'Revenue (paid)',
      value: rupees(revenue._sum.total),
      icon: iconMap.revenue,
    },
    { key: 'users', label: 'Active users', value: usersCount.toString(), icon: iconMap.users },
    { key: 'agents', label: 'Active agents', value: agentsCount.toString(), icon: iconMap.agents },
    { key: 'packages', label: 'Active packages', value: packagesCount.toString(), icon: iconMap.packages },
    { key: 'today', label: "Today's collections", value: todayCollections.toString(), icon: iconMap.today },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })} · Role:{' '}
            <Badge variant="outline" className="ml-1 font-mono text-[10px]">
              {role}
            </Badge>
          </p>
        </div>
        <DateRangeFilter />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription>{k.label}</CardDescription>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold tracking-tight">{k.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
          <CardDescription>
            {hasRange ? `Orders in the selected range (${recent.length}).` : 'Last 8 orders across all statuses.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">S.No</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                    No orders yet.
                  </TableCell>
                </TableRow>
              ) : (
                recent.map((o, i) => (
                  <TableRow key={o.id}>
                    <TableCell className="text-center font-mono text-xs text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-mono text-xs">{o.orderNumber}</TableCell>
                    <TableCell>{o.user.name ?? o.user.email}</TableCell>
                    <TableCell>{o.package.name}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[o.status] ?? 'secondary'}>{o.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">₹{Math.floor(o.total / 100).toLocaleString('en-IN')}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
