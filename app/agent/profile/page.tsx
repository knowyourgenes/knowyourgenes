'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, BadgeCheck, X, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

type Me = {
  profile: {
    zone: string;
    status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
    rating: number;
    onTimeRate: number;
    collectionsThisMonth: number;
    collectionsTotal: number;
    aadhaarVerified: boolean;
    policeVerified: boolean;
    dmltCertUrl: string | null;
    profilePhotoUrl: string | null;
    user: { name: string | null; email: string | null; phone: string | null };
  };
};

export default function AgentProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch('/api/agent/me');
    const json = await res.json();
    if (json.ok) setMe(json.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(active: boolean) {
    setBusy(true);
    const res = await fetch('/api/agent/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: active ? 'ACTIVE' : 'ON_LEAVE' }),
    });
    const json = await res.json();
    setBusy(false);
    if (!json.ok) {
      toast.error(json.error ?? 'Update failed');
      return;
    }
    toast.success(active ? 'You are now active' : 'You are on leave');
    load();
  }

  if (loading) return <Loader2 className="h-5 w-5 animate-spin" />;
  if (!me) return <div className="text-sm">Could not load profile.</div>;
  const p = me.profile;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-background p-4">
        <div className="text-lg font-semibold">{p.user.name ?? '—'}</div>
        <div className="text-xs text-muted-foreground">{p.user.email}</div>
        <div className="text-xs text-muted-foreground">{p.user.phone}</div>
        <div className="text-xs text-muted-foreground mt-1">Zone: {p.zone}</div>
      </div>

      <div className="rounded-lg border bg-background p-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Active for assignments</div>
          <div className="text-xs text-muted-foreground">Toggle off when on leave. Admin can also disable you.</div>
        </div>
        <Switch checked={p.status === 'ACTIVE'} onCheckedChange={setStatus} disabled={busy} />
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-2">Verification</h2>
        <div className="rounded-lg border bg-background divide-y">
          <Row label="Aadhaar" verified={p.aadhaarVerified} />
          <Row label="Police verification" verified={p.policeVerified} />
          <Row label="DMLT certificate" verified={!!p.dmltCertUrl} />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-2">Performance</h2>
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Rating" value={p.rating.toFixed(1)} />
          <Stat label="On-time" value={`${Math.round(p.onTimeRate * 100)}%`} />
          <Stat label="This month" value={p.collectionsThisMonth} />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">Lifetime collections: {p.collectionsTotal}</div>
      </div>

      <Button variant="outline" className="w-full" onClick={() => signOut({ callbackUrl: '/login' })}>
        <LogOut className="h-4 w-4" /> Sign out
      </Button>
    </div>
  );
}

function Row({ label, verified }: { label: string; verified: boolean }) {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="text-sm">{label}</div>
      {verified ? (
        <span className="flex items-center gap-1 text-xs text-green-700">
          <BadgeCheck className="h-4 w-4" /> Verified
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <X className="h-4 w-4" /> Not verified
        </span>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  );
}
