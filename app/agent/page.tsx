'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, MapPin, Phone, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Me = {
  profile: {
    zone: string;
    status: string;
    rating: number;
    onTimeRate: number;
    collectionsThisMonth: number;
    user: { name: string | null };
  };
  today: { total: number; pending: number; done: number };
  upcoming: Array<{
    id: string;
    orderNumber: string;
    status: string;
    slotDate: string;
    slotWindow: string;
    user: { name: string | null; phone: string | null };
    address: { area: string; pincode: string };
  }>;
};

const windowLabel = (w: string) => (w === 'MORNING' ? '8 AM – 12 PM' : w === 'AFTERNOON' ? '12 – 4 PM' : '4 – 7 PM');

export default function AgentHomePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/agent/me');
      const json = await res.json();
      if (json.ok) setMe(json.data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loader2 className="h-5 w-5 animate-spin" />;
  if (!me)
    return (
      <div className="text-sm text-muted-foreground">Could not load your dashboard. Try logging out and back in.</div>
    );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <KpiCard label="Today" value={me.today.total} />
        <KpiCard label="Pending" value={me.today.pending} highlight={me.today.pending > 0} />
        <KpiCard label="Done" value={me.today.done} />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Upcoming jobs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {me.upcoming.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">No upcoming collections.</div>
          ) : (
            <ul className="divide-y">
              {me.upcoming.map((o) => (
                <li key={o.id}>
                  <Link href={`/agent/collections/${o.id}`} className="flex items-center gap-3 p-3 hover:bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">{o.orderNumber}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {o.status}
                        </Badge>
                      </div>
                      <div className="text-sm truncate">{o.user.name ?? '—'}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {o.address.area} {o.address.pincode}
                        </span>
                        <span>
                          {new Date(o.slotDate).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}{' '}
                          · {windowLabel(o.slotWindow)}
                        </span>
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
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="rounded-lg border bg-background p-3">
          <div>Zone</div>
          <div className="text-foreground font-medium">{me.profile.zone}</div>
        </div>
        <div className="rounded-lg border bg-background p-3">
          <div>On-time</div>
          <div className="text-foreground font-medium">{Math.round(me.profile.onTimeRate * 100)}%</div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border bg-background p-3 ${highlight ? 'border-primary/50' : ''}`}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
