'use client';

import { useEffect, useState } from 'react';
import type { Coupon } from '@prisma/client';
import { toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';

import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  value: 10000,
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

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/coupons');
    const json = await res.json();
    if (json.ok) setItems(json.data);
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
      value: c.value,
      minOrder: c.minOrder,
      maxDiscount: c.maxDiscount,
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
      value: Number(form.value),
      minOrder: form.minOrder ? Number(form.minOrder) : null,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
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

  async function archive(c: Coupon) {
    if (!confirm(`Deactivate "${c.code}"?`)) return;
    await fetch(`/api/admin/coupons/${c.id}`, { method: 'DELETE' });
    toast.success('Coupon deactivated');
    load();
  }

  const formatValue = (c: Coupon) =>
    c.type === 'FLAT' ? `₹${Math.floor(c.value / 100).toLocaleString('en-IN')}` : `${c.value}%`;

  return (
    <>
      <PageHeader
        title="Coupons"
        subtitle="Promo codes. Values in paise for FLAT, 0–100 for PERCENT."
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
              <Button size="sm" variant="ghost" onClick={() => openEdit(c)}>
                Edit
              </Button>
              {c.active && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => archive(c)}
                >
                  Archive
                </Button>
              )}
            </div>
          )}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{form.id ? 'Edit coupon' : 'New coupon'}</DialogTitle>
          </DialogHeader>
          <form id="coupon-form" onSubmit={save} className="grid gap-4 py-2">
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
                    <SelectItem value="FLAT">Flat (paise)</SelectItem>
                    <SelectItem value="PERCENT">Percent (0–100)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                  required
                />
                {form.type === 'FLAT' && (
                  <p className="text-xs text-muted-foreground">= ₹{Math.floor(form.value / 100)}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="min">Min order (paise)</Label>
                <Input
                  id="min"
                  type="number"
                  value={form.minOrder ?? ''}
                  onChange={(e) => setForm({ ...form, minOrder: e.target.value ? Number(e.target.value) : null })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="max">Max discount (paise)</Label>
                <Input
                  id="max"
                  type="number"
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
          <DialogFooter>
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
    </>
  );
}
