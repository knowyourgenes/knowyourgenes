'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lab } from '@prisma/client';
import { toast } from 'sonner';
import { Plus, Loader2, Pencil, Trash2, Star, RotateCcw, RefreshCw } from 'lucide-react';

import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import * as cache from '@/lib/client-cache';

const CK = {
  list: 'labs:list',
  prefixAll: 'labs:',
} as const;

type PartnerOption = { id: string; slug: string; name: string };
type LabRow = Lab & {
  partner?: PartnerOption | null;
  user?: { id: string; email: string | null; name: string | null } | null;
};

type FormState = {
  id?: string;
  partnerId: string;
  name: string;
  slug: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  contactEmail: string;
  pickupLocationName: string;
  isDefault: boolean;
  active: boolean;
  // Per-lab login (create-only)
  createLogin: boolean;
  loginEmail: string;
  loginPassword: string;
  loginName: string;
};

const EMPTY: FormState = {
  partnerId: '',
  name: '',
  slug: '',
  addressLine: '',
  city: '',
  state: 'Delhi',
  pincode: '',
  phone: '',
  contactEmail: '',
  pickupLocationName: '',
  isDefault: false,
  active: true,
  createLogin: false,
  loginEmail: '',
  loginPassword: '',
  loginName: '',
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Pickup-location name follows the partner-slug + location-slug convention so
// it stays stable and matches what's registered in the courier portal.
function toPickupName(partnerSlug: string, citySlug: string) {
  const p = (partnerSlug || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const c = (citySlug || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!p && !c) return '';
  if (!p) return c;
  if (!c) return p;
  return `${p}-${c}`;
}

export default function AdminLabsPage() {
  const [items, setItems] = useState<LabRow[]>([]);
  const [partners, setPartners] = useState<PartnerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [pickupTouched, setPickupTouched] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LabRow | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<LabRow | null>(null);

  const inflight = useRef<Map<string, Promise<unknown>>>(new Map());

  const load = useCallback(async (opts: { force?: boolean } = {}) => {
    const cached = !opts.force ? cache.read<LabRow[]>(CK.list) : null;
    if (cached) {
      setItems(cached);
      setLoading(false);
    }
    if (!opts.force && cached && !cache.isStale(CK.list)) return;

    const key = `list|${opts.force ? 'force' : 'normal'}`;
    if (inflight.current.has(key)) {
      await inflight.current.get(key);
      return;
    }
    const p = (async () => {
      if (!cached) setLoading(true);
      const res = await fetch('/api/admin/labs', { cache: 'no-store' });
      const json = await res.json();
      if (json.ok) {
        cache.write(CK.list, json.data);
        setItems(json.data);
      } else {
        toast.error(json.error ?? 'Failed to load labs');
      }
      setLoading(false);
    })();
    inflight.current.set(key, p);
    try {
      await p;
    } finally {
      inflight.current.delete(key);
    }
  }, []);

  const hardRefresh = useCallback(async () => {
    setRefreshing(true);
    cache.clearPrefix(CK.prefixAll);
    try {
      await load({ force: true });
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  const loadPartners = useCallback(async () => {
    const res = await fetch('/api/admin/partners', { cache: 'no-store' });
    const json = await res.json();
    if (json.ok) {
      setPartners(
        (json.data as Array<{ id: string; slug: string; name: string; active: boolean }>)
          .filter((p) => p.active)
          .map((p) => ({ id: p.id, slug: p.slug, name: p.name }))
      );
    }
  }, []);

  useEffect(() => {
    load();
    loadPartners();
  }, [load, loadPartners]);

  function openCreate() {
    setForm({ ...EMPTY, partnerId: partners[0]?.id ?? '' });
    setSlugTouched(false);
    setPickupTouched(false);
    setOpen(true);
  }

  function openEdit(l: LabRow) {
    setForm({
      id: l.id,
      partnerId: l.partnerId,
      name: l.name,
      slug: l.slug,
      addressLine: l.addressLine,
      city: l.city,
      state: l.state,
      pincode: l.pincode,
      phone: l.phone,
      contactEmail: l.contactEmail ?? '',
      pickupLocationName: l.pickupLocationName,
      isDefault: l.isDefault,
      active: l.active,
      // Login provisioning is create-only. Edits manage the user separately.
      createLogin: false,
      loginEmail: '',
      loginPassword: '',
      loginName: '',
    });
    setSlugTouched(true);
    setPickupTouched(true);
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body: Record<string, unknown> = {
      partnerId: form.partnerId,
      name: form.name,
      slug: form.slug,
      addressLine: form.addressLine,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      phone: form.phone,
      contactEmail: form.contactEmail,
      pickupLocationName: form.pickupLocationName,
      isDefault: form.isDefault,
      active: form.active,
    };

    if (!form.id && form.createLogin) {
      body.login = {
        email: form.loginEmail,
        password: form.loginPassword,
        name: form.loginName || `${form.name} Lab`,
      };
    }

    const url = form.id ? `/api/admin/labs/${form.id}` : '/api/admin/labs';
    const res = await fetch(url, {
      method: form.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    setSaving(false);
    if (!json.ok) {
      toast.error(json.error ?? 'Save failed');
      return;
    }
    toast.success(form.id ? 'Lab updated' : 'Lab created');
    setOpen(false);
    cache.clearPrefix(CK.prefixAll);
    load({ force: true });
  }

  async function handleDeactivate() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/labs/${deleteTarget.id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error ?? 'Deactivate failed');
      return;
    }
    toast.success('Lab deactivated');
    setDeleteTarget(null);
    cache.clearPrefix(CK.prefixAll);
    load({ force: true });
  }

  async function handleRestore() {
    if (!restoreTarget) return;
    const res = await fetch(`/api/admin/labs/${restoreTarget.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: true }),
    });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error ?? 'Restore failed');
      return;
    }
    toast.success('Lab restored');
    setRestoreTarget(null);
    cache.clearPrefix(CK.prefixAll);
    load({ force: true });
  }

  return (
    <>
      <PageHeader
        title="Labs"
        subtitle="KYG-owned facilities. Kits ship from these and samples come back here. The default lab is used when none is explicitly chosen."
        actions={
          <>
            <Button
              variant="outline"
              onClick={hardRefresh}
              disabled={refreshing}
              title="Clear cache and re-fetch from server"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </Button>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" /> New lab
            </Button>
          </>
        }
      />

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (
        <DataTable
          rows={items}
          columns={[
            {
              key: 'name',
              header: 'Name',
              render: (l) => (
                <div className="flex items-center gap-2">
                  <div>
                    <div className="font-medium">{l.name}</div>
                    <div className="text-xs text-muted-foreground">{l.slug}</div>
                  </div>
                  {l.isDefault && (
                    <Badge variant="default" className="gap-1">
                      <Star className="h-3 w-3" /> Default
                    </Badge>
                  )}
                </div>
              ),
            },
            {
              key: 'partner',
              header: 'Partner',
              render: (l) => <span className="text-sm">{l.partner?.name ?? '—'}</span>,
            },
            {
              key: 'address',
              header: 'Address',
              render: (l) => (
                <div className="text-xs">
                  <div>{l.addressLine}</div>
                  <div className="text-muted-foreground">
                    {l.city}, {l.state} {l.pincode}
                  </div>
                </div>
              ),
            },
            {
              key: 'pickup',
              header: 'Courier pickup name',
              render: (l) => <span className="font-mono text-xs">{l.pickupLocationName}</span>,
            },
            {
              key: 'login',
              header: 'Login',
              render: (l) =>
                l.user?.email ? (
                  <span className="text-xs font-mono">{l.user.email}</span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                ),
            },
            {
              key: 'active',
              header: 'Status',
              render: (l) => (
                <Badge variant={l.active ? 'default' : 'secondary'}>{l.active ? 'Active' : 'Inactive'}</Badge>
              ),
            },
          ]}
          rowAction={(l) => (
            <div className="flex justify-end gap-2">
              <Button size="icon-sm" variant="ghost" onClick={() => openEdit(l)} title="Edit">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              {l.active ? (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteTarget(l)}
                  disabled={l.isDefault}
                  title={l.isDefault ? 'Cannot deactivate default lab' : 'Deactivate'}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button size="icon-sm" variant="ghost" onClick={() => setRestoreTarget(l)} title="Restore">
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )}
          empty="No labs yet. Add one before processing kit-by-post orders."
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="shrink-0 border-b p-4 pr-10">
            <DialogTitle>{form.id ? 'Edit lab' : 'New lab'}</DialogTitle>
            <DialogDescription>
              The courier pickup name must match exactly what's registered with Delhivery.
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
            <form id="lab-form" onSubmit={save} className="grid gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="partner">
                  Partner <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.partnerId}
                  onValueChange={(v) => {
                    const partner = partners.find((p) => p.id === v);
                    setForm((f) => ({
                      ...f,
                      partnerId: v ?? '',
                      pickupLocationName: pickupTouched
                        ? f.pickupLocationName
                        : toPickupName(partner?.slug ?? '', f.city),
                    }));
                  }}
                >
                  <SelectTrigger id="partner">
                    <SelectValue placeholder="Select a partner organisation" />
                  </SelectTrigger>
                  <SelectContent>
                    {partners.length === 0 ? (
                      <div className="p-2 text-xs text-muted-foreground">
                        No partners yet — create one under Lab Partners first.
                      </div>
                    ) : (
                      partners.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    placeholder="Neotech Saket"
                    onChange={(e) => {
                      const name = e.target.value;
                      setForm((f) => ({
                        ...f,
                        name,
                        slug: slugTouched ? f.slug : toSlug(name),
                      }));
                    }}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="slug">
                    Slug <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setForm({ ...form, slug: e.target.value });
                    }}
                    placeholder="neotech-saket"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="addr">
                  Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="addr"
                  value={form.addressLine}
                  onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="city">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => {
                      const city = e.target.value;
                      const partner = partners.find((p) => p.id === form.partnerId);
                      setForm((f) => ({
                        ...f,
                        city,
                        pickupLocationName: pickupTouched
                          ? f.pickupLocationName
                          : toPickupName(partner?.slug ?? '', city),
                      }));
                    }}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="state"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pin">
                    Pincode <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pin"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    pattern="\d{6}"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">
                    Contact email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pickup">
                  Delhivery pickup-location name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="pickup"
                  className="font-mono text-xs"
                  placeholder="NEOTECH-SAKET"
                  value={form.pickupLocationName}
                  onChange={(e) => {
                    setPickupTouched(true);
                    setForm({ ...form, pickupLocationName: e.target.value });
                  }}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Must exactly match the warehouse name registered in Delhivery's portal.
                </p>
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={form.isDefault}
                    onCheckedChange={(c) => setForm({ ...form, isDefault: c === true })}
                  />
                  Default lab
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={form.active} onCheckedChange={(c) => setForm({ ...form, active: c === true })} />
                  Active
                </label>
              </div>

              {(() => {
                const currentDefault = items.find((x) => x.isDefault && x.id !== form.id);
                if (!currentDefault) return null;
                if (form.isDefault) {
                  return (
                    <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      Saving will replace <span className="font-semibold">{currentDefault.name}</span> as the default
                      lab. New kit-by-post orders without an explicit lab will start shipping from this one instead.
                    </div>
                  );
                }
                return (
                  <div className="rounded-md border border-muted bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{currentDefault.name}</span> is the current default
                    lab. Tick <span className="font-semibold">Default lab</span> above to replace it.
                  </div>
                );
              })()}

              {!form.id && (
                <div className="space-y-3 rounded-md border bg-muted/30 p-3">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Checkbox
                      checked={form.createLogin}
                      onCheckedChange={(c) => setForm({ ...form, createLogin: c === true })}
                    />
                    Create a login for this lab
                  </label>
                  <p className="text-xs text-muted-foreground">
                    One PARTNER-role account scoped to this lab. The lab's operator uses it to upload reports.
                  </p>
                  {form.createLogin && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="login-email">
                          Login email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="login-email"
                          type="email"
                          value={form.loginEmail}
                          onChange={(e) => setForm({ ...form, loginEmail: e.target.value })}
                          required={form.createLogin}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="login-pwd">
                          Password <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="login-pwd"
                          type="password"
                          value={form.loginPassword}
                          onChange={(e) => setForm({ ...form, loginPassword: e.target.value })}
                          minLength={8}
                          required={form.createLogin}
                        />
                      </div>
                      <div className="space-y-1.5 col-span-2">
                        <Label htmlFor="login-name">Display name (optional)</Label>
                        <Input
                          id="login-name"
                          value={form.loginName}
                          onChange={(e) => setForm({ ...form, loginName: e.target.value })}
                          placeholder={form.name ? `${form.name} Lab` : 'Neotech Saket Lab'}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>
          </DialogBody>

          <DialogFooter className="m-0 shrink-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="lab-form" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={deleteTarget ? `Deactivate "${deleteTarget.name}"?` : 'Deactivate'}
        itemLabel="This lab"
        onConfirm={handleDeactivate}
      />

      <DeleteConfirmDialog
        open={!!restoreTarget}
        onOpenChange={(o) => !o && setRestoreTarget(null)}
        title={restoreTarget ? `Restore "${restoreTarget.name}"?` : 'Restore'}
        description={
          restoreTarget
            ? `"${restoreTarget.name}" will be reactivated and become available again across the app.`
            : undefined
        }
        onConfirm={handleRestore}
        actionLabel="Restore"
        loadingLabel="Restoring…"
        tone="primary"
      />
    </>
  );
}
