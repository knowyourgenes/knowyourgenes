'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Category } from '@prisma/client';
import { toast } from 'sonner';
import { Plus, Loader2, Pencil, Trash2, RotateCcw, RefreshCw } from 'lucide-react';

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
import * as cache from '@/lib/client-cache';

const CK = {
  list: 'categories:list',
  prefixAll: 'categories:',
} as const;

type FormState = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  position: number;
  active: boolean;
};

const EMPTY: FormState = {
  slug: '',
  name: '',
  description: '',
  icon: '',
  position: 0,
  active: true,
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<Category | null>(null);

  const inflight = useRef<Map<string, Promise<unknown>>>(new Map());

  const load = useCallback(async (opts: { force?: boolean } = {}) => {
    const cached = !opts.force ? cache.read<Category[]>(CK.list) : null;
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
      const res = await fetch('/api/admin/categories', { cache: 'no-store' });
      const json = await res.json();
      if (json.ok) {
        cache.write(CK.list, json.data);
        setItems(json.data);
      } else {
        toast.error(json.error ?? 'Failed to load categories');
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

  function openEdit(c: Category) {
    setForm({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description ?? '',
      icon: c.icon ?? '',
      position: c.position,
      active: c.active,
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
      description: form.description || null,
      icon: form.icon || null,
      position: form.position,
      active: form.active,
    };
    const url = form.id ? `/api/admin/categories/${form.id}` : '/api/admin/categories';
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
    toast.success(form.id ? 'Category updated' : 'Category created');
    setOpen(false);
    cache.clearPrefix(CK.prefixAll);
    load({ force: true });
  }

  async function handleDeactivate() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error ?? 'Deactivate failed');
      return;
    }
    toast.success('Category deactivated');
    setDeleteTarget(null);
    cache.clearPrefix(CK.prefixAll);
    load({ force: true });
  }

  async function handleRestore() {
    if (!restoreTarget) return;
    const res = await fetch(`/api/admin/categories/${restoreTarget.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: true }),
    });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error ?? 'Restore failed');
      return;
    }
    toast.success('Category restored');
    setRestoreTarget(null);
    cache.clearPrefix(CK.prefixAll);
    load({ force: true });
  }

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="Top-level groupings for the kits you sell — Wellness, Cardiac, Cancer Risk, etc. Each kit belongs to one category."
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
              <Plus className="h-4 w-4" /> New category
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
              render: (c) => (
                <div className="flex items-center gap-2">
                  {c.icon && <span className="text-lg leading-none">{c.icon}</span>}
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.slug}</div>
                  </div>
                </div>
              ),
            },
            {
              key: 'description',
              header: 'Description',
              render: (c) => <span className="line-clamp-2 text-xs text-muted-foreground">{c.description || '—'}</span>,
            },
            {
              key: 'position',
              header: 'Position',
              render: (c) => <span className="text-sm">{c.position}</span>,
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
              <Button size="icon-sm" variant="ghost" onClick={() => openEdit(c)} title="Edit">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              {c.active ? (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteTarget(c)}
                  title="Deactivate"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button size="icon-sm" variant="ghost" onClick={() => setRestoreTarget(c)} title="Restore">
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )}
          empty="No categories yet. Add one before creating kits."
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="shrink-0 border-b p-4 pr-10">
            <DialogTitle>{form.id ? 'Edit category' : 'New category'}</DialogTitle>
            <DialogDescription>
              Categories group kits on the public site. Pick a short emoji icon for the homepage card.
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
            <form id="category-form" onSubmit={save} className="grid gap-3">
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
                    placeholder="wellness"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="icon">Icon (emoji)</Label>
                  <Input
                    id="icon"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="🥗"
                    maxLength={8}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    type="number"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: parseInt(e.target.value || '0', 10) })}
                    min={0}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short blurb shown under the category title on the homepage."
                />
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
            <Button type="submit" form="category-form" disabled={saving}>
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
        itemLabel="This category"
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
