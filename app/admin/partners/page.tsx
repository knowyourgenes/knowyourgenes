'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { LabPartner } from '@prisma/client';
import { toast } from 'sonner';
import { Plus, Loader2, Pencil, Trash2, RotateCcw, RefreshCw } from 'lucide-react';

import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
  list: 'partners:list',
  prefixAll: 'partners:',
} as const;

type PartnerRow = LabPartner & {
  locations?: Array<{ id: string; slug: string; name: string; city: string; active: boolean }>;
};

type FormState = {
  id?: string;
  slug: string;
  name: string;
  accreditation: string;
  contactEmail: string;
  contactPhone: string;
  active: boolean;
};

const EMPTY: FormState = {
  slug: '',
  name: '',
  accreditation: '',
  contactEmail: '',
  contactPhone: '',
  active: true,
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminPartnersPage() {
  const [items, setItems] = useState<PartnerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PartnerRow | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<PartnerRow | null>(null);

  const inflight = useRef<Map<string, Promise<unknown>>>(new Map());

  const load = useCallback(async (opts: { force?: boolean } = {}) => {
    const cached = !opts.force ? cache.read<PartnerRow[]>(CK.list) : null;
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
      const res = await fetch('/api/admin/partners', { cache: 'no-store' });
      const json = await res.json();
      if (json.ok) {
        cache.write(CK.list, json.data);
        setItems(json.data);
      } else {
        toast.error(json.error ?? 'Failed to load partners');
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

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setForm(EMPTY);
    setSlugTouched(false);
    setOpen(true);
  }

  function openEdit(p: PartnerRow) {
    setForm({
      id: p.id,
      slug: p.slug,
      name: p.name,
      accreditation: p.accreditation,
      contactEmail: p.contactEmail,
      contactPhone: p.contactPhone,
      active: p.active,
    });
    setSlugTouched(true);
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body = {
      slug: form.slug,
      name: form.name,
      accreditation: form.accreditation,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      active: form.active,
    };
    const url = form.id ? `/api/admin/partners/${form.id}` : '/api/admin/partners';
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
    toast.success(form.id ? 'Partner updated' : 'Partner created');
    setOpen(false);
    cache.clearPrefix(CK.prefixAll);
    load({ force: true });
  }

  async function handleDeactivate() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/partners/${deleteTarget.id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error ?? 'Deactivate failed');
      return;
    }
    toast.success('Partner deactivated');
    setDeleteTarget(null);
    cache.clearPrefix(CK.prefixAll);
    load({ force: true });
  }

  async function handleRestore() {
    if (!restoreTarget) return;
    const res = await fetch(`/api/admin/partners/${restoreTarget.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: true }),
    });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error ?? 'Restore failed');
      return;
    }
    toast.success('Partner restored');
    setRestoreTarget(null);
    cache.clearPrefix(CK.prefixAll);
    load({ force: true });
  }

  return (
    <>
      <PageHeader
        title="Lab Partners"
        subtitle="Parent partner organisations (e.g. Neotech). Each partner can run multiple physical Lab locations - manage those under Labs."
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
              <Plus className="h-4 w-4" /> New partner
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
              header: 'Partner',
              render: (p) => (
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.slug}</div>
                </div>
              ),
            },
            {
              key: 'accreditation',
              header: 'Accreditation',
              render: (p) => <span className="text-xs">{p.accreditation}</span>,
            },
            {
              key: 'contact',
              header: 'Contact',
              render: (p) => (
                <div className="text-xs">
                  <div>{p.contactEmail}</div>
                  <div className="text-muted-foreground">{p.contactPhone}</div>
                </div>
              ),
            },
            {
              key: 'locations',
              header: 'Labs',
              render: (p) => {
                const n = p.locations?.length ?? 0;
                return <Badge variant="outline">{n}</Badge>;
              },
            },
            {
              key: 'active',
              header: 'Status',
              render: (p) => (
                <Badge variant={p.active ? 'default' : 'secondary'}>{p.active ? 'Active' : 'Inactive'}</Badge>
              ),
            },
          ]}
          rowAction={(p) => (
            <div className="flex justify-end gap-2">
              <Button size="icon-sm" variant="ghost" onClick={() => openEdit(p)} title="Edit">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              {p.active ? (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteTarget(p)}
                  title="Deactivate"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button size="icon-sm" variant="ghost" onClick={() => setRestoreTarget(p)} title="Restore">
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )}
          empty="No partners yet. Add one before creating lab locations."
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="shrink-0 border-b p-4 pr-10">
            <DialogTitle>{form.id ? 'Edit partner' : 'New lab partner'}</DialogTitle>
            <DialogDescription>
              Parent organisation only. Physical addresses and per-lab logins are managed on each Lab location.
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
            <form id="partner-form" onSubmit={save} className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : toSlug(name) }));
                    }}
                    placeholder="Neotech Diagnostics"
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
                    placeholder="neotech"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="accred">
                  Accreditation <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="accred"
                  value={form.accreditation}
                  onChange={(e) => setForm({ ...form, accreditation: e.target.value })}
                  placeholder="NABL, CAP, ISO 15189"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                <div className="space-y-1.5">
                  <Label htmlFor="phone">
                    Contact phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={form.contactPhone}
                    onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={form.active} onCheckedChange={(c) => setForm({ ...form, active: c === true })} />
                  Active
                </label>
              </div>
            </form>
          </DialogBody>

          <DialogFooter className="m-0 shrink-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="partner-form" disabled={saving}>
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
        itemLabel="This partner"
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
