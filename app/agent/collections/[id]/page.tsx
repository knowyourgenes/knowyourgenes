'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Phone, MessageCircle, MapPin, ArrowLeft, CheckCircle2, Navigation } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type OrderDetail = {
  id: string;
  orderNumber: string;
  status: string;
  slotDate: string;
  slotWindow: string;
  user: { name: string | null; email: string | null; phone: string | null };
  address: {
    line1: string;
    line2: string | null;
    area: string;
    city: string;
    pincode: string;
    landmark: string | null;
  };
  package: { name: string; sampleType: string; biomarkerCount: number };
  events: Array<{ id: string; label: string; createdAt: string }>;
};

export default function AgentCollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch(`/api/agent/orders/${id}`);
    const json = await res.json();
    if (json.ok) setOrder(json.data);
    else toast.error(json.error ?? 'Could not load order');
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function transition(to: 'AGENT_EN_ROUTE' | 'SAMPLE_COLLECTED') {
    if (!order) return;
    setBusy(true);
    const res = await fetch(`/api/agent/orders/${order.id}/transition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to }),
    });
    const json = await res.json();
    setBusy(false);
    if (!json.ok) {
      toast.error(json.error ?? 'Could not update status');
      return;
    }
    toast.success(to === 'AGENT_EN_ROUTE' ? 'Marked en route' : 'Sample collected');
    load();
  }

  if (loading) return <Loader2 className="h-5 w-5 animate-spin" />;
  if (!order) return <div className="text-sm">Not found.</div>;

  const fullAddress = `${order.address.line1}${order.address.line2 ? ', ' + order.address.line2 : ''}, ${order.address.area}, ${order.address.city} ${order.address.pincode}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  return (
    <div className="space-y-4 pb-24">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">{order.orderNumber}</span>
          <Badge variant="outline">{order.status}</Badge>
        </div>
        <h1 className="text-lg font-semibold mt-1">{order.package.name}</h1>
        <div className="text-xs text-muted-foreground">
          {order.package.sampleType} · {order.package.biomarkerCount} markers
        </div>
      </div>

      <div className="rounded-lg border bg-background p-3">
        <div className="text-xs text-muted-foreground mb-1">Customer</div>
        <div className="font-medium">{order.user.name ?? '—'}</div>
        <div className="flex gap-2 mt-2">
          {order.user.phone && (
            <Button variant="outline" size="sm" render={<a href={`tel:${order.user.phone}`} />}>
              <Phone className="h-4 w-4" /> Call
            </Button>
          )}
          {order.user.phone && (
            <Button
              variant="outline"
              size="sm"
              render={
                <a href={`https://wa.me/91${order.user.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" />
              }
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-background p-3">
        <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
          <MapPin className="h-3 w-3" /> Address
        </div>
        <div className="text-sm">{fullAddress}</div>
        {order.address.landmark && (
          <div className="text-xs text-muted-foreground mt-1">Landmark: {order.address.landmark}</div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          render={<a href={mapsUrl} target="_blank" rel="noreferrer" />}
        >
          <Navigation className="h-4 w-4" /> Open in Maps
        </Button>
      </div>

      <div className="rounded-lg border bg-background p-3">
        <div className="text-xs text-muted-foreground mb-1">Slot</div>
        <div className="text-sm">
          {new Date(order.slotDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })} ·{' '}
          {order.slotWindow}
        </div>
      </div>

      {order.events.length > 0 && (
        <div className="rounded-lg border bg-background p-3">
          <div className="text-xs text-muted-foreground mb-2">Timeline</div>
          <ul className="space-y-1">
            {order.events.map((e) => (
              <li key={e.id} className="text-xs">
                <span className="text-muted-foreground">
                  {new Date(e.createdAt).toLocaleString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>{' '}
                - {e.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="fixed bottom-16 inset-x-0 bg-background border-t p-3">
        <div className="max-w-2xl mx-auto flex gap-2">
          {order.status === 'AGENT_ASSIGNED' && (
            <Button className="flex-1" onClick={() => transition('AGENT_EN_ROUTE')} disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Mark en route
            </Button>
          )}
          {order.status === 'AGENT_EN_ROUTE' && (
            <Button className="flex-1" onClick={() => transition('SAMPLE_COLLECTED')} disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              <CheckCircle2 className="h-4 w-4" /> Mark collected
            </Button>
          )}
          {!['AGENT_ASSIGNED', 'AGENT_EN_ROUTE'].includes(order.status) && (
            <Button variant="outline" className="flex-1" render={<Link href="/agent/collections" />}>
              Back to jobs
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
