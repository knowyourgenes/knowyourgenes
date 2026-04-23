'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Loader2, FlaskConical, Pencil, Trash2 } from 'lucide-react';

import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

type Partner = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  labPartnerProfile: {
    labName: string;
    accreditation: string;
    contactEmail: string;
    contactPhone: string;
    addressLine: string;
    city: string;
    pincode: string;
    active: boolean;
  } | null;
};

type Form = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  labName: string;
  accreditation: string;
  contactEmail: string;
  contactPhone: string;
  addressLine: string;
  city: string;
  pincode: string;
};

const EMPTY: Form = {
  name: '',
  email: '',
  phone: '',
  password: '',
  labName: '',
  accreditation: 'NABL, CAP, ISO 15189',
  contactEmail: '',
  contactPhone: '',
  addressLine: '',
  city: '',
  pincode: '',
};

export default function AdminPartnersPage() {
  const [items, setItems] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/partners');
    const json = await res.json();
    if (json.ok) setItems(json.data);
    else toast.error(json.error ?? 'Failed to load partners');
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm(EMPTY);
    setOpen(true);
  }
  function openEdit(p: Partner) {
    setForm({
      id: p.id,
      name: p.name ?? '',
      email: p.email ?? '',
      phone: p.phone ?? '',
      password: '',
      labName: p.labPartnerProfile?.labName ?? '',
      accreditation: p.labPartnerProfile?.accreditation ?? '',
      contactEmail: p.labPartnerProfile?.contactEmail ?? '',
      contactPhone: p.labPartnerProfile?.contactPhone ?? '',
      addressLine: p.labPartnerProfile?.addressLine ?? '',
      city: p.labPartnerProfile?.city ?? '',
      pincode: p.labPartnerProfile?.pincode ?? '',
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
          labName: form.labName,
          accreditation: form.accreditation,
          contactEmail: form.contactEmail,
          contactPhone: form.contactPhone,
          addressLine: form.addressLine,
          city: form.city,
          pincode: form.pincode,
        }
      : { ...form };

    const url = form.id ? `/api/admin/partners/${form.id}` : '/api/admin/partners';
    const res = await fetch(url, {
      method: form.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    setSaving(false);
    if (!json.ok) return toast.error(json.error ?? 'Save failed');
    toast.success(form.id ? 'Partner updated' : 'Partner created');
    setOpen(false);
    load();
  }

  async function handleDelete(permanent: boolean) {
    if (!deleteTarget) return;
    const q = permanent ? '?permanent=true' : '';
    const res = await fetch(`/api/admin/partners/${deleteTarget.id}${q}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error ?? 'Delete failed');
      return;
    }
    toast.success(permanent ? 'Partner deleted' : 'Partner deactivated');
    setDeleteTarget(null);
    load();
  }

  async function handleBulkDelete(permanent: boolean) {
    const q = permanent ? '?permanent=true' : '';
    const results = await Promise.allSettled(
      selectedIds.map((id) =>
        fetch(`/api/admin/partners/${id}${q}`, { method: 'DELETE' }).then((r) => r.json())
      )
    );
    const failed = results.filter((r) => r.status === 'rejected' || !r.value?.ok).length;
    const done = results.length - failed;
    const noun = (n: number) => (n === 1 ? 'partner' : 'partners');
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
        title="Lab partners"
        subtitle="NABL-accredited labs that process samples and upload reports."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> New partner
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
              key: 'lab',
              header: 'Lab',
              render: (p) => (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded bg-primary/10 text-primary">
                    <FlaskConical className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{p.labPartnerProfile?.labName}</div>
                    <div className="text-xs text-muted-foreground">{p.email}</div>
                  </div>
                </div>
              ),
            },
            {
              key: 'accreditation',
              header: 'Accreditation',
              render: (p) => (
                <div className="flex flex-wrap gap-1">
                  {p.labPartnerProfile?.accreditation.split(',').map((a) => (
                    <Badge key={a} variant="secondary" className="text-[10px]">
                      {a.trim()}
                    </Badge>
                  ))}
                </div>
              ),
            },
            {
              key: 'contact',
              header: 'Contact',
              render: (p) => (
                <div className="text-xs">
                  <div>{p.labPartnerProfile?.contactPhone}</div>
                  <div className="text-muted-foreground">{p.labPartnerProfile?.contactEmail}</div>
                </div>
              ),
            },
            {
              key: 'city',
              header: 'Location',
              render: (p) => (
                <div className="text-xs">
                  <div className="font-medium">{p.labPartnerProfile?.city}</div>
                  <div className="text-muted-foreground font-mono">{p.labPartnerProfile?.pincode}</div>
                </div>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (p) => (
                <Badge variant={p.labPartnerProfile?.active ? 'default' : 'secondary'}>
                  {p.labPartnerProfile?.active ? 'Active' : 'Inactive'}
                </Badge>
              ),
            },
          ]}
          rowAction={(p) => (
            <div className="flex justify-end gap-2">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => openEdit(p)}
                aria-label="Edit"
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => setDeleteTarget(p)}
                aria-label="Delete"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
          empty="No lab partners yet."
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="shrink-0 border-b p-4 pr-10">
            <DialogTitle>{form.id ? 'Edit lab partner' : 'New lab partner'}</DialogTitle>
            <DialogDescription>
              {form.id
                ? 'Update lab contact details.'
                : 'Creates a User with PARTNER role + a LabPartner profile. They log in at /login.'}
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
          <form id="partner-form" onSubmit={save} className="grid gap-4">
            <div className="rounded border bg-muted/30 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Account</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Contact name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Login email {form.id && '(read-only)'}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    disabled={!!form.id}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Login phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
                {!form.id && (
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
                )}
              </div>
            </div>

            <div className="rounded border bg-muted/30 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lab details</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="labName">Lab name</Label>
                  <Input
                    id="labName"
                    value={form.labName}
                    onChange={(e) => setForm({ ...form, labName: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="accr">Accreditation (comma separated)</Label>
                  <Input
                    id="accr"
                    placeholder="NABL, CAP, ISO 15189"
                    value={form.accreditation}
                    onChange={(e) => setForm({ ...form, accreditation: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cEmail">Ops email</Label>
                  <Input
                    id="cEmail"
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cPhone">Ops phone</Label>
                  <Input
                    id="cPhone"
                    value={form.contactPhone}
                    onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="addr">Address</Label>
                  <Input
                    id="addr"
                    value={form.addressLine}
                    onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pin">Pincode</Label>
                  <Input
                    id="pin"
                    className="font-mono"
                    maxLength={6}
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '') })}
                    required
                  />
                </div>
              </div>
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
        title={deleteTarget ? `Delete "${deleteTarget.labPartnerProfile?.labName}"?` : 'Delete'}
        itemLabel="This lab partner"
        onConfirm={handleDelete}
      />

      <DeleteConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selectedIds.length} ${selectedIds.length === 1 ? 'lab partner' : 'lab partners'}?`}
        itemLabel={
          selectedIds.length === 1
            ? 'This lab partner'
            : `These ${selectedIds.length} lab partners`
        }
        onConfirm={handleBulkDelete}
      />
    </>
  );
}
