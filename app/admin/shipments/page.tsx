'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, RefreshCw, X, Search, Truck, ArrowLeftRight } from 'lucide-react';

import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Shipment = {
  id: string;
  orderId: string;
  leg: 'FORWARD' | 'REVERSE';
  courier: 'DELHIVERY';
  status: string;
  awb: string | null;
  refNumber: string;
  pickupName: string;
  pickupCity: string;
  pickupPincode: string;
  dropName: string;
  dropCity: string;
  dropPincode: string;
  weightGrams: number;
  createdAt: string;
  deliveredAt: string | null;
  pickedUpAt: string | null;
  cancelledAt: string | null;
  order: {
    id: string;
    orderNumber: string;
    status: string;
    fulfillmentMode: string;
    user: { name: string | null; email: string | null; phone: string | null };
  };
};

const SHIPMENT_STATUSES = [
  'CREATED',
  'MANIFESTED',
  'PICKUP_SCHEDULED',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'RTO',
  'CANCELLED',
  'FAILED',
];

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  CREATED: 'secondary',
  MANIFESTED: 'outline',
  PICKUP_SCHEDULED: 'outline',
  IN_TRANSIT: 'outline',
  OUT_FOR_DELIVERY: 'outline',
  DELIVERED: 'default',
  RTO: 'destructive',
  CANCELLED: 'destructive',
  FAILED: 'destructive',
};

export default function AdminShipmentsPage() {
  const [items, setItems] = useState<Shipment[]>([]);
  const [q, setQ] = useState('');
  const [leg, setLeg] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (leg !== 'ALL') p.set('leg', leg);
    if (status !== 'ALL') p.set('status', status);
    p.set('take', '100');
    const res = await fetch(`/api/admin/shipments?${p.toString()}`);
    const json = await res.json();
    if (json.ok) setItems(json.data.items);
    else toast.error(json.error ?? 'Failed to load shipments');
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leg, status]);

  async function refresh(id: string) {
    setBusyId(id);
    const res = await fetch(`/api/admin/shipments/${id}/refresh`, { method: 'POST' });
    const json = await res.json();
    setBusyId(null);
    if (!json.ok) {
      toast.error(json.error ?? 'Refresh failed');
      return;
    }
    toast.success('Tracking refreshed');
    load();
  }

  async function cancel(id: string) {
    if (!confirm('Cancel this shipment? This calls Delhivery to revoke the AWB.')) return;
    setBusyId(id);
    const res = await fetch(`/api/admin/shipments/${id}/cancel`, { method: 'POST' });
    const json = await res.json();
    setBusyId(null);
    if (!json.ok) {
      toast.error(json.error ?? 'Cancel failed');
      return;
    }
    toast.success('Shipment cancelled');
    load();
  }

  return (
    <>
      <PageHeader title="Shipments" subtitle="Delhivery forward (kit out) and reverse (sample back) shipments." />

      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load();
          }}
          className="flex gap-2"
        >
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="AWB, ref number, order…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>

        <Select value={leg} onValueChange={(v) => setLeg(v ?? 'ALL')}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All legs</SelectItem>
            <SelectItem value="FORWARD">Forward (kit out)</SelectItem>
            <SelectItem value="REVERSE">Reverse (sample in)</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={(v) => setStatus(v ?? 'ALL')}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            {SHIPMENT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (
        <DataTable
          rows={items}
          columns={[
            {
              key: 'order',
              header: 'Order',
              render: (s) => (
                <div>
                  <div className="font-mono text-xs">{s.order.orderNumber}</div>
                  <div className="text-xs text-muted-foreground">{s.order.user.name ?? s.order.user.email ?? '—'}</div>
                </div>
              ),
            },
            {
              key: 'leg',
              header: 'Leg',
              render: (s) => (
                <Badge variant="outline" className="gap-1">
                  {s.leg === 'FORWARD' ? <Truck className="h-3 w-3" /> : <ArrowLeftRight className="h-3 w-3" />}
                  {s.leg}
                </Badge>
              ),
            },
            {
              key: 'awb',
              header: 'AWB',
              render: (s) => <span className="font-mono text-xs">{s.awb ?? '—'}</span>,
            },
            {
              key: 'route',
              header: 'Route',
              render: (s) => (
                <div className="text-xs">
                  <div>
                    {s.pickupCity} <span className="text-muted-foreground">{s.pickupPincode}</span>
                  </div>
                  <div className="text-muted-foreground">
                    → {s.dropCity} {s.dropPincode}
                  </div>
                </div>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (s) => <Badge variant={statusVariant[s.status] ?? 'outline'}>{s.status}</Badge>,
            },
            {
              key: 'createdAt',
              header: 'Created',
              render: (s) => <span className="text-xs">{new Date(s.createdAt).toLocaleDateString('en-IN')}</span>,
            },
          ]}
          rowAction={(s) => (
            <div className="flex justify-end gap-1">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => refresh(s.id)}
                disabled={!s.awb || busyId === s.id || s.status === 'CANCELLED'}
                title="Refresh tracking"
              >
                {busyId === s.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => cancel(s.id)}
                disabled={busyId === s.id || s.status === 'DELIVERED' || s.status === 'CANCELLED'}
                title="Cancel shipment"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
          empty="No shipments yet. They appear automatically when kit-by-post orders are processed."
        />
      )}
    </>
  );
}
