'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

type Order = {
  id: string;
  slotDate: string;
  slotWindow: string;
};
type Availability = { id: string; agentId: string; window: 'MORNING' | 'AFTERNOON' | 'EVENING'; active: boolean };

const WINDOWS = ['MORNING', 'AFTERNOON', 'EVENING'] as const;
const windowLabel: Record<string, string> = {
  MORNING: 'Morning (8 AM – 12 PM)',
  AFTERNOON: 'Afternoon (12 – 4 PM)',
  EVENING: 'Evening (4 – 7 PM)',
};

export default function AgentSchedulePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [oRes, aRes] = await Promise.all([fetch('/api/agent/orders?status=ALL'), fetch('/api/agent/availability')]);
    const [oJson, aJson] = await Promise.all([oRes.json(), aRes.json()]);
    if (oJson.ok) setOrders(oJson.data);
    if (aJson.ok) setAvailability(aJson.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(window: 'MORNING' | 'AFTERNOON' | 'EVENING', active: boolean) {
    const res = await fetch('/api/agent/availability', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ window, active }),
    });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error ?? 'Update failed');
      return;
    }
    load();
  }

  if (loading) return <Loader2 className="h-5 w-5 animate-spin" />;

  // 7-day grid
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    return d;
  });

  function countFor(day: Date): number {
    return orders.filter((o) => {
      const od = new Date(o.slotDate);
      return (
        od.getFullYear() === day.getFullYear() && od.getMonth() === day.getMonth() && od.getDate() === day.getDate()
      );
    }).length;
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-sm font-semibold mb-2">Next 7 days</h2>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            const n = countFor(d);
            return (
              <div
                key={i}
                className={`rounded-lg border p-2 text-center ${n > 0 ? 'bg-primary/5 border-primary/30' : 'bg-background'}`}
              >
                <div className="text-[10px] text-muted-foreground">
                  {d.toLocaleDateString('en-IN', { weekday: 'short' })}
                </div>
                <div className="text-sm font-semibold">{d.getDate()}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {n} {n === 1 ? 'job' : 'jobs'}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold mb-2">Availability windows</h2>
        <p className="text-xs text-muted-foreground mb-3">
          Toggle off a window to stop receiving new assignments in that slot. Existing jobs are unaffected.
        </p>
        <div className="rounded-lg border bg-background divide-y">
          {WINDOWS.map((w) => {
            const a = availability.find((x) => x.window === w);
            const active = a?.active ?? false;
            return (
              <div key={w} className="flex items-center justify-between p-3">
                <div className="text-sm">{windowLabel[w]}</div>
                <Switch checked={active} onCheckedChange={(v) => toggle(w, v)} />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
