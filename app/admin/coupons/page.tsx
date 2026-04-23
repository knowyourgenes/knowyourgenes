'use client';

import { useEffect, useState } from 'react';
import type { Coupon } from '@prisma/client';
import { toast } from 'sonner';
import { Plus, Loader2, Pencil, Trash2 } from 'lucide-react';

import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Form = {
  id?: string;
  code: string;
  type: 'FLAT' | 'PERCENT';
  value: number;
  minOrder?: number | null;
  maxDiscount?: number | null;
  expiresAt: string;
  usageLimit?: number | null;
  active: boolean;
};

const EMPTY: Form = {
  code: '',
  type: 'FLAT',
  value: 100,
  minOrder: null,
  maxDiscount: null,
  expiresAt: '',
  usageLimit: null,
  active: true,
};

export default function AdminCouponsPage() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/coupons');
    const json = await res.json();
    if (json.ok) setItems(json.data);
    else toast.error(json.error ?? 'Failed to load coupons');
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm(EMPTY);
    setOpen(true);
  }
  function openEdit(c: Coupon) {
    setForm({
      id: c.id,
      code: c.code,
      type: c.type,
      value: c.type === 'FLAT' ? c.value / 100 : c.value,
      minOrder: c.minOrder != null ? c.minOrder / 100 : null,
      maxDiscount: c.maxDiscount != null ? c.maxDiscount / 100 : null,
      expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().slice(0, 10) : '',
      usageLimit: c.usageLimit,
      active: c.active,
    });
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body = {
      code: form.code,
      type: form.type,
      value: form.type === 'FLAT' ? Math.round(Number(form.value) * 100) : Number(form.value),
      minOrder: form.minOrder ? Math.round(Number(form.minOrder) * 100) : null,
      maxDiscount: form.maxDiscount ? Math.round(Number(form.maxDiscount) * 100) : null,
      expiresAt: form.expiresAt || null,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      active: form.active,
    };
    const url = form.id ? `/api/admin/coupons/${form.id}` : '/api/admin/coupons';
    const res = await fetch(url, {
      method: form.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    setSaving(false);
    if (!json.ok) return toast.error(json.error ?? 'Save failed');
    toast.success(form.id ? 'Coupon updated' : 'Coupon created');
    setOpen(false);
    load();
  }

  async function handleDelete(permanent: boolean) {
    if (!deleteTarget) return;
    const q = permanent ? '?permanent=true' : '';
    const res = await fetch(`/api/admin/coupons/${deleteTarget.id}${q}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error ?? 'Delete failed');
      return;
    }
    toast.success(permanent ? 'Coupon deleted' : 'Coupon deactivated');
    setDeleteTarget(null);
    load();
  }

  async function handleBulkDelete(permanent: boolean) {
    const q = permanent ? '?permanent=true' : '';
    const results = await Promise.allSettled(
      selectedIds.map((id) =>
        fetch(`/api/admin/coupons/${id}${q}`, { method: 'DELETE' }).then((r) => r.json())
      )
    );
    const failed = results.filter((r) => r.status === 'rejected' || !r.value?.ok).length;
    const done = results.length - failed;
    const noun = (n: number) => (n === 1 ? 'coupon' : 'coupons');
    if (failed === 0) toast.success(permanent ? `${done} ${noun(done)} deleted` : `${done} ${noun(done)} deactivated`);
    else if (done === 0) toast.error(`Failed to delete ${failed} ${noun(failed)}`);
    else toast.error(`${done} done, ${failed} failed`);
    setBulkDeleteOpen(false);
    setSelectedIds([]);
    load();
  }

  const formatValue = (c: Coupon) =>
    c.type === 'FLAT' ? `₹${Math.floor(c.value / 100).toLocaleString('en-IN')}` : `${c.value}%`;

  return (
    <>
      <PageHeader
        title="Coupons"
        subtitle="Promo codes. Enter amounts in rupees (₹) for FLAT, 0–100 for PERCENT."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> New coupon
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
              key: 'code',
              header: 'Code',
              render: (c) => <span className="font-mono text-sm font-medium">{c.code}</span>,
            },
            { key: 'type', header: 'Type', render: (c) => <Badge variant="outline">{c.type}</Badge> },
            { key: 'value', header: 'Value', render: (c) => <span className="font-medium">{formatValue(c)}</span> },
            { key: 'min', header: 'Min order', render: (c) => (c.minOrder ? `₹${Math.floor(c.minOrder / 100)}` : '—') },
            {
              key: 'expires',
              header: 'Expires',
              render: (c) => (c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('en-IN') : '—'),
            },
            {
              key: 'usage',
              header: 'Usage',
              render: (c) => (
                <span className="text-sm">
                  {c.usageCount}
                  {c.usageLimit ? ` / ${c.usageLimit}` : ''}
                </span>
              ),
            },
            {
              key: 'active',
              header: 'Status',
              render: (c) => (
                <Badge variant={c.active ? 'default' : 'secondary'}>{c.active ? 'Active' : 'Inactive'}</Badge>
              ),
            },
          ]}
          rowAction={(c) => (
            <div className="flex justify-end gap-2">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => openEdit(c)}
                aria-label="Edit"
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => setDeleteTarget(c)}
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
        <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="shrink-0 border-b p-4 pr-10">
            <DialogTitle>{form.id ? 'Edit coupon' : 'New coupon'}</DialogTitle>
          </DialogHeader>
          <DialogBody>
          <form id="coupon-form" onSubmit={save} className="grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="code">Code (A–Z, 0–9, _)</Label>
              <Input
                id="code"
                className="font-mono"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm({ ...form, type: (v as 'FLAT' | 'PERCENT') ?? 'FLAT' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FLAT">Flat (₹)</SelectItem>
                    <SelectItem value="PERCENT">Percent (0–100)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="value">Value ({form.type === 'FLAT' ? '₹' : '%'})</Label>
                <Input
                  id="value"
                  type="number"
                  step={form.type === 'FLAT' ? '0.01' : '1'}
                  min="0"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="min">Min order (₹)</Label>
                <Input
                  id="min"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.minOrder ?? ''}
                  onChange={(e) => setForm({ ...form, minOrder: e.target.value ? Number(e.target.value) : null })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="max">Max discount (₹)</Label>
                <Input
                  id="max"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.maxDiscount ?? ''}
                  onChange={(e) => setForm({ ...form, maxDiscount: e.target.value ? Number(e.target.value) : null })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="exp">Expires</Label>
                <Input
                  id="exp"
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="limit">Usage limit</Label>
                <Input
                  id="limit"
                  type="number"
                  value={form.usageLimit ?? ''}
                  onChange={(e) => setForm({ ...form, usageLimit: e.target.value ? Number(e.target.value) : null })}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={form.active} onCheckedChange={(c) => setForm({ ...form, active: c === true })} />
              Active
            </label>
          </form>
          </DialogBody>
          <DialogFooter className="m-0 shrink-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="coupon-form" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={deleteTarget ? `Delete coupon "${deleteTarget.code}"?` : 'Delete'}
        itemLabel="This coupon"
        onConfirm={handleDelete}
      />

      <DeleteConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selectedIds.length} ${selectedIds.length === 1 ? 'coupon' : 'coupons'}?`}
        itemLabel={
          selectedIds.length === 1 ? 'This coupon' : `These ${selectedIds.length} coupons`
        }
        onConfirm={handleBulkDelete}
      />
    </>
  );
}
