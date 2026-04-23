'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Loader2, CheckCircle2, XCircle, Pencil, Trash2 } from 'lucide-react';

import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Agent = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  agentProfile: {
    zone: string;
    status: string;
    rating: number;
    onTimeRate: number;
    collectionsThisMonth: number;
    aadhaarVerified: boolean;
    policeVerified: boolean;
  } | null;
};

type Form = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  zone: string;
  aadhaarVerified: boolean;
  policeVerified: boolean;
};

const EMPTY: Form = {
  name: '',
  email: '',
  phone: '',
  password: '',
  zone: '',
  aadhaarVerified: false,
  policeVerified: false,
};

export default function AdminAgentsPage() {
  const [items, setItems] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<Agent | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/agents');
    const json = await res.json();
    if (json.ok) setItems(json.data);
    else toast.error(json.error ?? 'Failed to load agents');
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm(EMPTY);
    setOpen(true);
  }
  function openEdit(a: Agent) {
    setForm({
      id: a.id,
      name: a.name ?? '',
      email: a.email ?? '',
      phone: a.phone ?? '',
      password: '',
      zone: a.agentProfile?.zone ?? '',
      aadhaarVerified: a.agentProfile?.aadhaarVerified ?? false,
      policeVerified: a.agentProfile?.policeVerified ?? false,
    });
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body = form.id
      ? {
          name: form.name,
          phone: form.phone,
          zone: form.zone,
          aadhaarVerified: form.aadhaarVerified,
          policeVerified: form.policeVerified,
        }
      : { ...form };

    const url = form.id ? `/api/admin/agents/${form.id}` : '/api/admin/agents';
    const res = await fetch(url, {
      method: form.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    setSaving(false);
    if (!json.ok) return toast.error(json.error ?? 'Save failed');
    toast.success(form.id ? 'Agent updated' : 'Agent created');
    setOpen(false);
    load();
  }

  async function handleDelete(permanent: boolean) {
    if (!deleteTarget) return;
    const q = permanent ? '?permanent=true' : '';
    const res = await fetch(`/api/admin/agents/${deleteTarget.id}${q}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error ?? 'Delete failed');
      return;
    }
    toast.success(permanent ? 'Agent deleted' : 'Agent deactivated');
    setDeleteTarget(null);
    load();
  }

  async function handleBulkDelete(permanent: boolean) {
    const q = permanent ? '?permanent=true' : '';
    const results = await Promise.allSettled(
      selectedIds.map((id) =>
        fetch(`/api/admin/agents/${id}${q}`, { method: 'DELETE' }).then((r) => r.json())
      )
    );
    const failed = results.filter((r) => r.status === 'rejected' || !r.value?.ok).length;
    const done = results.length - failed;
    const noun = (n: number) => (n === 1 ? 'agent' : 'agents');
    if (failed === 0) toast.success(permanent ? `${done} ${noun(done)} deleted` : `${done} ${noun(done)} deactivated`);
    else if (done === 0) toast.error(`Failed to delete ${failed} ${noun(failed)}`);
    else toast.error(`${done} done, ${failed} failed`);
    setBulkDeleteOpen(false);
    setSelectedIds([]);
    load();
  }

  return (
    <>
      <PageHeader
        title="Collection agents"
        subtitle="Phlebotomists. They log into /agent on mobile."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> New agent
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (
        <DataTable
          rows={items}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          bulkActions={
            <Button variant="destructive" size="sm" onClick={() => setBulkDeleteOpen(true)}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          }
          columns={[
            {
              key: 'name',
              header: 'Agent',
              render: (a) => (
                <div>
                  <div className="font-medium">{a.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.email} · {a.phone}
                  </div>
                </div>
              ),
            },
            { key: 'zone', header: 'Zone', render: (a) => <Badge variant="outline">{a.agentProfile?.zone}</Badge> },
            {
              key: 'rating',
              header: 'Rating',
              render: (a) => (a.agentProfile?.rating ? `${a.agentProfile.rating.toFixed(1)} ★` : '—'),
            },
            {
              key: 'onTime',
              header: 'On-time',
              render: (a) => `${Math.round((a.agentProfile?.onTimeRate ?? 0) * 100)}%`,
            },
            { key: 'thisMonth', header: 'Month', render: (a) => a.agentProfile?.collectionsThisMonth ?? 0 },
            {
              key: 'verif',
              header: 'Verification',
              render: (a) => (
                <div className="flex items-center gap-1 text-xs">
                  {a.agentProfile?.aadhaarVerified ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  )}{' '}
                  Aadhaar
                  <span className="mx-1" />
                  {a.agentProfile?.policeVerified ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  )}{' '}
                  Police
                </div>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (a) => (
                <Badge
                  variant={
                    a.agentProfile?.status === 'ACTIVE'
                      ? 'default'
                      : a.agentProfile?.status === 'ON_LEAVE'
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {a.agentProfile?.status}
                </Badge>
              ),
            },
          ]}
          rowAction={(a) => (
            <div className="flex justify-end gap-2">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => openEdit(a)}
                aria-label="Edit"
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => setDeleteTarget(a)}
                aria-label="Delete"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="shrink-0 border-b p-4 pr-10">
            <DialogTitle>{form.id ? 'Edit agent' : 'New agent'}</DialogTitle>
          </DialogHeader>
          <DialogBody>
          <form id="a-form" onSubmit={save} className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
              {!form.id && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pwd">Temporary password</Label>
                    <Input
                      id="pwd"
                      type="password"
                      minLength={8}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                  </div>
                </>
              )}
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="zone">Zone</Label>
                <Input
                  id="zone"
                  placeholder="Gurgaon / South Delhi / Noida"
                  value={form.zone}
                  onChange={(e) => setForm({ ...form, zone: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.aadhaarVerified}
                  onCheckedChange={(c) => setForm({ ...form, aadhaarVerified: c === true })}
                />
                Aadhaar verified
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.policeVerified}
                  onCheckedChange={(c) => setForm({ ...form, policeVerified: c === true })}
                />
                Police verified
              </label>
            </div>
          </form>
          </DialogBody>
          <DialogFooter className="m-0 shrink-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="a-form" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={deleteTarget ? `Delete "${deleteTarget.name}"?` : 'Delete'}
        itemLabel="This agent"
        onConfirm={handleDelete}
      />

      <DeleteConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selectedIds.length} ${selectedIds.length === 1 ? 'agent' : 'agents'}?`}
        itemLabel={
          selectedIds.length === 1 ? 'This agent' : `These ${selectedIds.length} agents`
        }
        onConfirm={handleBulkDelete}
      />
    </>
  );
}
