'use client';

import { useEffect, useState } from 'react';
import type { Lab } from '@prisma/client';
import { toast } from 'sonner';
import { Plus, Loader2, Pencil, Trash2, Star } from 'lucide-react';

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

type FormState = {
  id?: string;
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
};

const EMPTY: FormState = {
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
};

export default function AdminLabsPage() {
  const [items, setItems] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<Lab | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/labs');
    const json = await res.json();
    if (json.ok) setItems(json.data);
    else toast.error(json.error);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm(EMPTY);
    setOpen(true);
  }

  function openEdit(l: Lab) {
    setForm({
      id: l.id,
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
    });
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body = {
      name: form.name,
      slug: form.slug,
      addressLine: form.addressLine,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      phone: form.phone,
      contactEmail: form.contactEmail || null,
      pickupLocationName: form.pickupLocationName,
      isDefault: form.isDefault,
      active: form.active,
    };

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
    load();
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
    load();
  }

  return (
    <>
      <PageHeader
        title="Labs"
        subtitle="KYG-owned facilities. Kits ship from these and samples come back here. The default lab is used when none is explicitly chosen."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> New lab
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
            { key: 'phone', header: 'Phone', render: (l) => <span className="text-sm">{l.phone}</span> },
            {
              key: 'active',
              header: 'Status',
              render: (l) => (
                <Badge variant={l.active ? 'default' : 'secondary'}>{l.active ? 'Active' : 'Archived'}</Badge>
              ),
            },
          ]}
          rowAction={(l) => (
            <div className="flex justify-end gap-2">
              <Button size="icon-sm" variant="ghost" onClick={() => openEdit(l)} title="Edit">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
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
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="slug">Slug (kebab-case)</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="kyg-delhi-main"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="addr">Address</Label>
                <Input
                  id="addr"
                  value={form.addressLine}
                  onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
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
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pin">Pincode</Label>
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
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Contact email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pickup">Delhivery pickup-location name</Label>
                <Input
                  id="pickup"
                  className="font-mono text-xs"
                  placeholder="KYG-LAB-DELHI"
                  value={form.pickupLocationName}
                  onChange={(e) => setForm({ ...form, pickupLocationName: e.target.value })}
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
    </>
  );
}
