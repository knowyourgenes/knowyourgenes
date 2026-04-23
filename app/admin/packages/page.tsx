'use client';

import { useEffect, useState } from 'react';
import type { Package } from '@prisma/client';
import { toast } from 'sonner';
import { Plus, Loader2, Pencil, Trash2 } from 'lucide-react';

import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FormState = {
  id?: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  tatMinDays: number;
  tatMaxDays: number;
  sampleType: string;
  biomarkerCount: number;
  highlights: string;
  biomarkerList: string;
  popular: boolean;
  recommended: boolean;
  active: boolean;
};

const EMPTY: FormState = {
  slug: '',
  name: '',
  category: 'WELLNESS',
  tagline: '',
  description: '',
  price: 0,
  tatMinDays: 7,
  tatMaxDays: 14,
  sampleType: 'BLOOD',
  biomarkerCount: 0,
  highlights: '',
  biomarkerList: '',
  popular: false,
  recommended: false,
  active: true,
};

const rupees = (p: number) => `₹${Math.floor(p / 100).toLocaleString('en-IN')}`;

export default function AdminPackagesPage() {
  const [items, setItems] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Package | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/packages');
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
  function openEdit(p: Package) {
    setForm({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      tagline: p.tagline,
      description: p.description,
      price: p.price / 100,
      compareAtPrice: p.compareAtPrice != null ? p.compareAtPrice / 100 : null,
      tatMinDays: p.tatMinDays,
      tatMaxDays: p.tatMaxDays,
      sampleType: p.sampleType,
      biomarkerCount: p.biomarkerCount,
      highlights: (p.highlights as string[] | null)?.join('\n') ?? '',
      biomarkerList: (p.biomarkerList as string[] | null)?.join(', ') ?? '',
      popular: p.popular,
      recommended: p.recommended,
      active: p.active,
    });
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body = {
      slug: form.slug,
      name: form.name,
      category: form.category,
      tagline: form.tagline,
      description: form.description,
      price: Math.round(Number(form.price) * 100),
      compareAtPrice: form.compareAtPrice ? Math.round(Number(form.compareAtPrice) * 100) : null,
      tatMinDays: Number(form.tatMinDays),
      tatMaxDays: Number(form.tatMaxDays),
      sampleType: form.sampleType,
      biomarkerCount: Number(form.biomarkerCount),
      highlights: form.highlights
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      biomarkerList: form.biomarkerList
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      faq: [],
      popular: form.popular,
      recommended: form.recommended,
      active: form.active,
    };

    const url = form.id ? `/api/admin/packages/${form.id}` : '/api/admin/packages';
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
    toast.success(form.id ? 'Package updated' : 'Package created');
    setOpen(false);
    load();
  }

  async function handleDelete(permanent: boolean) {
    if (!deleteTarget) return;
    const q = permanent ? '?permanent=true' : '';
    const res = await fetch(`/api/admin/packages/${deleteTarget.id}${q}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error ?? 'Delete failed');
      return;
    }
    toast.success(permanent ? 'Package deleted' : 'Package deactivated');
    setDeleteTarget(null);
    load();
  }

  async function handleBulkDelete(permanent: boolean) {
    const q = permanent ? '?permanent=true' : '';
    const results = await Promise.allSettled(
      selectedIds.map((id) =>
        fetch(`/api/admin/packages/${id}${q}`, { method: 'DELETE' }).then((r) => r.json())
      )
    );
    const failed = results.filter((r) => r.status === 'rejected' || !r.value?.ok).length;
    const done = results.length - failed;
    const noun = (n: number) => (n === 1 ? 'package' : 'packages');
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
        title="Packages"
        subtitle="Test catalog. Enter prices in rupees (₹)."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> New package
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
              header: 'Name',
              render: (p) => (
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.slug}</div>
                </div>
              ),
            },
            { key: 'category', header: 'Category', render: (p) => <Badge variant="outline">{p.category}</Badge> },
            {
              key: 'price',
              header: 'Price',
              render: (p) => (
                <div>
                  <div className="font-medium">{rupees(p.price)}</div>
                  {p.compareAtPrice && (
                    <div className="text-xs text-muted-foreground line-through">{rupees(p.compareAtPrice)}</div>
                  )}
                </div>
              ),
            },
            { key: 'sampleType', header: 'Sample', render: (p) => <Badge variant="secondary">{p.sampleType}</Badge> },
            {
              key: 'tat',
              header: 'TAT',
              render: (p) => (
                <span className="text-sm">
                  {p.tatMinDays}–{p.tatMaxDays}d
                </span>
              ),
            },
            { key: 'biomarkers', header: 'Markers', render: (p) => p.biomarkerCount },
            {
              key: 'flags',
              header: 'Flags',
              render: (p) => (
                <div className="flex gap-1">
                  {p.popular && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Popular</Badge>}
                  {p.recommended && <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Recommended</Badge>}
                </div>
              ),
            },
            {
              key: 'active',
              header: 'Status',
              render: (p) => (
                <Badge variant={p.active ? 'default' : 'secondary'}>{p.active ? 'Active' : 'Archived'}</Badge>
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
          empty="No packages yet. Click + New package."
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="shrink-0 border-b p-4 pr-10">
            <DialogTitle>{form.id ? 'Edit package' : 'New package'}</DialogTitle>
            <DialogDescription>Fields marked by red are required.</DialogDescription>
          </DialogHeader>

          <DialogBody>
          <form id="pkg-form" onSubmit={save} className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="slug">Slug (kebab-case)</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                />
              </div>
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
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v ?? 'WELLNESS' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WELLNESS">Wellness</SelectItem>
                    <SelectItem value="CANCER_RISK">Cancer risk</SelectItem>
                    <SelectItem value="REPRODUCTIVE">Reproductive</SelectItem>
                    <SelectItem value="CARDIAC">Cardiac</SelectItem>
                    <SelectItem value="DRUG_SENSITIVITY">Drug sensitivity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Sample type</Label>
                <Select value={form.sampleType} onValueChange={(v) => setForm({ ...form, sampleType: v ?? 'BLOOD' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BLOOD">Blood</SelectItem>
                    <SelectItem value="SALIVA">Saliva</SelectItem>
                    <SelectItem value="SWAB">Swab</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="compare">Compare-at (₹, optional)</Label>
                <Input
                  id="compare"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.compareAtPrice ?? ''}
                  onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value ? Number(e.target.value) : null })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tat-min">TAT min (days)</Label>
                <Input
                  id="tat-min"
                  type="number"
                  value={form.tatMinDays}
                  onChange={(e) => setForm({ ...form, tatMinDays: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tat-max">TAT max (days)</Label>
                <Input
                  id="tat-max"
                  type="number"
                  value={form.tatMaxDays}
                  onChange={(e) => setForm({ ...form, tatMaxDays: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="bm-count">Biomarker count</Label>
                <Input
                  id="bm-count"
                  type="number"
                  value={form.biomarkerCount}
                  onChange={(e) => setForm({ ...form, biomarkerCount: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="highlights">Highlights (one per line)</Label>
              <Textarea
                id="highlights"
                rows={4}
                className="font-mono text-xs"
                value={form.highlights}
                onChange={(e) => setForm({ ...form, highlights: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bm-list">Biomarker list (comma separated)</Label>
              <Input
                id="bm-list"
                className="font-mono text-xs"
                placeholder="BRCA1, BRCA2, TP53"
                value={form.biomarkerList}
                onChange={(e) => setForm({ ...form, biomarkerList: e.target.value })}
              />
            </div>

            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.popular} onCheckedChange={(c) => setForm({ ...form, popular: c === true })} />
                Popular
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.recommended}
                  onCheckedChange={(c) => setForm({ ...form, recommended: c === true })}
                />
                Recommended
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
            <Button type="submit" form="pkg-form" disabled={saving}>
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
        itemLabel="This package"
        onConfirm={handleDelete}
      />

      <DeleteConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selectedIds.length} ${selectedIds.length === 1 ? 'package' : 'packages'}?`}
        itemLabel={
          selectedIds.length === 1 ? 'This package' : `These ${selectedIds.length} packages`
        }
        onConfirm={handleBulkDelete}
      />
    </>
  );
}
