'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, MapPin, Phone, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  slotDate: string;
  slotWindow: string;
  user: { name: string | null; phone: string | null };
  address: { area: string; pincode: string; line1: string };
  package: { name: string; sampleType: string };
};

const TABS = [
  { key: 'PENDING', label: 'Pending' },
  { key: 'EN_ROUTE', label: 'En route' },
  { key: 'COLLECTED', label: 'Collected' },
  { key: 'AT_LAB', label: 'At lab' },
];

const windowLabel = (w: string) => (w === 'MORNING' ? '8 AM – 12 PM' : w === 'AFTERNOON' ? '12 – 4 PM' : '4 – 7 PM');

export default function AgentCollectionsPage() {
  const [tab, setTab] = useState('PENDING');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(`/api/agent/orders?status=${tab}`);
      const json = await res.json();
      setOrders(json.ok ? json.data : []);
      setLoading(false);
    })();
  }, [tab]);

  return (
    <div className="space-y-4">
      <div className="flex gap-1 overflow-x-auto -mx-4 px-4 pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap border ${
              tab === t.key ? 'bg-primary text-primary-foreground border-primary' : 'bg-background'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : orders.length === 0 ? (
        <div className="text-sm text-muted-foreground py-8 text-center">No jobs in this tab.</div>
      ) : (
        <ul className="divide-y rounded-lg border bg-background">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/agent/collections/${o.id}`} className="flex items-center gap-3 p-3 hover:bg-muted/50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">{o.orderNumber}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {o.package.sampleType}
                    </Badge>
                  </div>
                  <div className="text-sm truncate">{o.user.name ?? '—'}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    {o.address.area} {o.address.pincode}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(o.slotDate).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}{' '}
                    · {windowLabel(o.slotWindow)}
                  </div>
                </div>
                {o.user.phone && (
                  <a
                    href={`tel:${o.user.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-full p-2 hover:bg-muted"
                    aria-label="Call"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
