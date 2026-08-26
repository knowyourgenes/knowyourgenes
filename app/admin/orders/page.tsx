'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Search } from 'lucide-react';

import PageHeader from '@/features/admin/components/PageHeader';
import DataTable from '@/features/admin/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  slotDate: string;
  slotWindow: string;
  createdAt: string;
  user: { name: string | null; email: string | null; phone: string | null };
  package: { name: string };
  agent: { user: { name: string | null } } | null;
  lab: { id: string; name: string } | null;
};

type Agent = { id: string; name: string | null; agentProfile: { zone: string } | null };
type Lab = { id: string; name: string; active: boolean };

const STATUSES = [
  'BOOKED',
  // Kit-by-post leg
  'KIT_DISPATCHED',
  'KIT_DELIVERED',
  'SAMPLE_PICKED_UP',
  'SAMPLE_IN_TRANSIT',
  // At-home phlebotomist leg
  'AGENT_ASSIGNED',
  'AGENT_EN_ROUTE',
  'SAMPLE_COLLECTED',
  // Common
  'AT_LAB',
  'REPORT_READY',
  'CANCELLED',
  'REFUNDED',
];

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (status && status !== 'ALL') p.set('status', status);
    p.set('take', '50');
    const [ordersRes, agentsRes, labsRes] = await Promise.all([
      fetch(`/api/admin/orders?${p.toString()}`),
      fetch(`/api/admin/agents`),
      fetch(`/api/admin/labs`),
    ]);
    const [ordersJson, agentsJson, labsJson] = await Promise.all([
      ordersRes.json(),
      agentsRes.json(),
      labsRes.json(),
    ]);
    if (ordersJson.ok) setOrders(ordersJson.data.items);
    else toast.error(ordersJson.error ?? 'Failed to load orders');
    if (agentsJson.ok) setAgents(agentsJson.data);
    else toast.error(agentsJson.error ?? 'Failed to load agents');
    // Only active labs can take work, so an inactive one must never appear in
    // the picker - the API would reject it anyway, but offering it is a trap.
    if (labsJson.ok) setLabs((labsJson.data.items ?? labsJson.data ?? []).filter((l: Lab) => l.active));
    else toast.error(labsJson.error ?? 'Failed to load labs');
    setLoading(false);
  }, [q, status]);

  useEffect(() => {
    // Initial load on mount. Subsequent refreshes happen via the explicit "Apply"
    // button so typing in the search box does not refetch on every keystroke.
    // Defer to a microtask so the setState inside `load` does not run synchronously
    // during the effect body (which would trip react-hooks/set-state-in-effect).
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) void load();
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(id: string, newStatus: string) {
    const res = await fetch(`/api/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    const json = await res.json();
    if (!json.ok) return toast.error(json.error ?? 'Update failed');
    toast.success(`Status → ${newStatus}`);
    load();
  }

  async function assignLab(id: string, labId: string, current: string | null) {
    if (!labId || labId === current) return;
    // Re-routing an order that already has a lab is a different act from
    // assigning an unrouted one: the first lab may already have been emailed,
    // and a sample may already be travelling to it. So it is confirmed, never
    // silent.
    if (current) {
      const to = labs.find((l) => l.id === labId)?.name ?? 'another lab';
      if (!window.confirm(`This order is already routed. Re-route it to ${to}?`)) return;
    }
    const res = await fetch(`/api/admin/orders/${id}/assign-lab`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ labId }),
    });
    const json = await res.json();
    if (!json.ok) return toast.error(json.error ?? 'Could not assign the lab');
    toast.success(`Lab → ${json.data?.lab?.name ?? 'assigned'}`, {
      description:
        json.data?.notified?.status === 'notified'
          ? 'The lab has been emailed.'
          : 'Assigned. The lab was not emailed - it had already been notified.',
    });
    load();
  }

  async function assignAgent(id: string, agentId: string) {
    if (!agentId) return;
    const res = await fetch(`/api/admin/orders/${id}/assign-agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId }),
    });
    const json = await res.json();
    if (!json.ok) return toast.error(json.error ?? 'Assign failed');
    toast.success('Agent assigned');
    load();
  }

  return (
    <>
      <PageHeader title="Orders" subtitle="All orders. Update status or assign an agent inline." />

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search order / name / email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v ?? 'ALL')}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={load}>
          Apply
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (
        <DataTable
          rows={orders}
          columns={[
            { key: 'num', header: 'Order', render: (o) => <span className="font-mono text-xs">{o.orderNumber}</span> },
            {
              key: 'customer',
              header: 'Customer',
              render: (o) => (
                <div>
                  <div className="font-medium">{o.user.name ?? '-'}</div>
                  <div className="text-xs text-muted-foreground">{o.user.email}</div>
                </div>
              ),
            },
            { key: 'pkg', header: 'Package', render: (o) => o.package.name },
            {
              key: 'slot',
              header: 'Slot',
              render: (o) => (
                <div className="text-sm">
                  <div>{new Date(o.slotDate).toLocaleDateString('en-IN')}</div>
                  <div className="text-xs text-muted-foreground">{o.slotWindow}</div>
                </div>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (o) => (
                <Select value={o.status} onValueChange={(v) => v && updateStatus(o.id, v)}>
                  <SelectTrigger className="h-8 w-[170px]">
                    <Badge variant={statusVariant[o.status] ?? 'secondary'} className="font-mono text-[10px]">
                      {o.status}
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ),
            },
            {
              key: 'lab',
              header: 'Lab',
              render: (o) => (
                <Select value="" onValueChange={(v) => v && assignLab(o.id, v, o.lab?.id ?? null)}>
                  <SelectTrigger className="h-8 w-[180px]">
                    {o.lab ? (
                      <span className="text-sm">{o.lab.name}</span>
                    ) : (
                      // Unrouted orders are the queue. Marking them rather than
                      // showing an empty cell is the whole point of the column.
                      <Badge variant="destructive" className="font-mono text-[10px]">
                        UNASSIGNED
                      </Badge>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {labs.length === 0 ? (
                      <SelectItem value="__none" disabled>
                        No active labs
                      </SelectItem>
                    ) : (
                      labs.map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              ),
            },
            {
              key: 'agent',
              header: 'Agent',
              render: (o) => (
                <Select value="" onValueChange={(v) => v && assignAgent(o.id, v)}>
                  <SelectTrigger className="h-8 w-[180px]">
                    <span className="text-sm">{o.agent?.user.name ?? '- Assign -'}</span>
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name} ({a.agentProfile?.zone})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ),
            },
            {
              key: 'amt',
              header: 'Amount',
              render: (o) => <span className="font-medium">₹{Math.floor(o.total / 100).toLocaleString('en-IN')}</span>,
            },
          ]}
          empty="No orders match these filters."
        />
      )}
    </>
  );
}
