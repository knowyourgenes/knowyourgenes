'use client';

// =============================================================================
// /admin/assigned-orders - the lab's work queue
// -----------------------------------------------------------------------------
// The screen a PARTNER (lab operator) logs in to. The sidebar has linked here
// for PARTNER since the panel was built and there was never a page behind it.
//
// SCOPED SERVER-SIDE, NOT HERE. It reads /api/lab/orders, which resolves
// User.id -> Lab.userId -> Order.labId against the database. Nothing on this
// page decides what a lab may see, because a filter in a client component is a
// suggestion.
//
// Deliberately narrower than /admin/orders. A lab needs a name to put on the
// sample, an address to post the kit to, which tests to run, and somewhere to
// file the report. It does not need the customer's email, what they paid, or
// their account - so the API does not send those.
// =============================================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { FileUp, Loader2, RefreshCw } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHeader from '@/features/admin/components/PageHeader';
import DataTable from '@/features/admin/components/DataTable';

type LabOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paidAt: string | null;
  slotDate: string | null;
  slotWindow: string | null;
  fulfillmentMode: string;
  user: { name: string | null };
  address: {
    fullName: string;
    phone: string;
    line1: string;
    line2: string | null;
    area: string;
    city: string;
    pincode: string;
  } | null;
  items: { nameSnapshot: string; slugSnapshot: string }[];
  lab: { id: string; name: string } | null;
  report: { id: string; reportNumber: string; createdAt: string; deliveredAt: string | null } | null;
};

/** What the lab has to do next with this order, in one word. */
function workState(o: LabOrder): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  if (o.report?.deliveredAt) return { label: 'Released to customer', variant: 'secondary' };
  if (o.report) return { label: 'Awaiting KYG review', variant: 'outline' };
  return { label: 'Report needed', variant: 'destructive' };
}

export default function AssignedOrdersPage() {
  const [rows, setRows] = useState<LabOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const pendingOrderRef = useRef<string | null>(null);

  // `reload` is a counter rather than a callback: calling a setState-ing loader
  // from an effect is what react-hooks/set-state-in-effect flags, and bumping a
  // number is the honest way to say "fetch again" without smuggling a state
  // write into the dependency list.
  const [reload, setReload] = useState(0);
  const refresh = useCallback(() => setReload((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Inside the async body, not in the effect itself: a synchronous setState
      // during an effect is a second render before paint, which is what
      // react-hooks/set-state-in-effect exists to stop.
      setLoading(true);
      try {
        const res = await fetch(`/api/lab/orders?take=100${q ? `&q=${encodeURIComponent(q)}` : ''}`, {
          credentials: 'include',
        });
        const json = await res.json();
        if (cancelled) return;
        if (!json.ok) {
          toast.error(json.error ?? 'Could not load your orders');
          setRows([]);
          return;
        }
        setRows(json.data.items ?? []);
      } catch {
        if (!cancelled) toast.error('Could not reach the server');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    // A stale response from a previous search term must not overwrite a newer
    // one - typing is faster than the network.
    return () => {
      cancelled = true;
    };
  }, [q, reload]);

  function pickFile(orderId: string) {
    pendingOrderRef.current = orderId;
    fileRef.current?.click();
  }

  async function onFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const orderId = pendingOrderRef.current;
    // Reset immediately so choosing the same file twice still fires a change.
    e.target.value = '';
    if (!file || !orderId) return;

    if (file.type !== 'application/pdf') {
      toast.error('Reports must be a PDF');
      return;
    }

    setUploadingFor(orderId);
    try {
      const form = new FormData();
      form.append('orderId', orderId);
      form.append('file', file);

      const res = await fetch('/api/admin/reports/upload', {
        method: 'POST',
        credentials: 'include',
        body: form,
      });
      const json = await res.json();
      if (!json.ok) {
        toast.error(json.error ?? 'Upload failed');
        return;
      }
      toast.success(`Report ${json.data.reportNumber} filed`, {
        description: 'KYG will review it before the customer sees it.',
      });
      refresh();
    } catch {
      toast.error('Upload failed - please try again');
    } finally {
      setUploadingFor(null);
      pendingOrderRef.current = null;
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Assigned orders"
        subtitle="Samples routed to your lab. Upload a report and KYG will review it before the customer sees it."
      />

      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search order number or name"
          className="h-9 max-w-xs"
        />
        <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* One hidden input for the whole table - a per-row input would mount a
          file picker for every order on screen. */}
      <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={onFileChosen} />

      {loading ? (
        <div className="rounded-sm border bg-card p-10 text-center text-sm text-muted-foreground">Loading…</div>
      ) : (
        <DataTable<LabOrder>
          rows={rows}
          columns={[
            {
              key: 'order',
              header: 'Order',
              render: (o) => (
                <div>
                  <div className="font-medium">{o.orderNumber}</div>
                  <div className="text-xs text-muted-foreground">{o.lab?.name ?? '—'}</div>
                </div>
              ),
            },
            {
              key: 'patient',
              header: 'Sample for',
              render: (o) => (
                <div className="text-sm">
                  <div className="font-medium">{o.address?.fullName ?? o.user.name ?? '—'}</div>
                  <div className="text-xs text-muted-foreground">{o.address?.phone ?? ''}</div>
                </div>
              ),
            },
            {
              key: 'address',
              header: 'Deliver kit to',
              render: (o) =>
                o.address ? (
                  <div className="max-w-[260px] text-xs leading-relaxed text-muted-foreground">
                    {o.address.line1}
                    {o.address.line2 ? `, ${o.address.line2}` : ''}, {o.address.area}
                    <br />
                    {o.address.city} {o.address.pincode}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                ),
            },
            {
              key: 'tests',
              header: 'Tests',
              render: (o) => (
                <div className="max-w-[220px] text-sm">
                  {o.items.map((i) => (
                    <div key={i.slugSnapshot}>{i.nameSnapshot}</div>
                  ))}
                </div>
              ),
            },
            {
              key: 'state',
              header: 'Report',
              render: (o) => {
                const w = workState(o);
                return (
                  <div className="space-y-1">
                    <Badge variant={w.variant} className="text-[10px]">
                      {w.label}
                    </Badge>
                    {o.report && (
                      <div className="font-mono text-[11px] text-muted-foreground">{o.report.reportNumber}</div>
                    )}
                  </div>
                );
              },
            },
            {
              key: 'action',
              header: '',
              render: (o) =>
                o.report ? (
                  <span className="text-xs text-muted-foreground">Filed</span>
                ) : (
                  <Button size="sm" variant="outline" disabled={uploadingFor === o.id} onClick={() => pickFile(o.id)}>
                    {uploadingFor === o.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileUp className="h-4 w-4" />
                    )}
                    Upload report
                  </Button>
                ),
            },
          ]}
          empty="No orders have been routed to your lab yet."
        />
      )}
    </div>
  );
}
