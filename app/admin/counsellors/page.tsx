'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Loader2, Pencil, Trash2 } from 'lucide-react';

import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Counsellor = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  counsellorProfile: {
    credentials: string;
    specialty: string;
    languages: string[];
    experience: string;
    active: boolean;
    photoUrl: string | null;
    bio: string | null;
  } | null;
};

type Form = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  credentials: string;
  specialty: string;
  languages: string;
  experience: string;
  photoUrl: string;
  bio: string;
};

const EMPTY: Form = {
  name: '',
  email: '',
  phone: '',
  password: '',
  credentials: '',
  specialty: '',
  languages: 'English, Hindi',
  experience: '',
  photoUrl: '',
  bio: '',
};

const initialsFrom = (name: string | null) =>
  (name ?? '?')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default function AdminCounsellorsPage() {
  const [items, setItems] = useState<Counsellor[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [deleteTarget, setDeleteTarget] = useState<Counsellor | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/counsellors');
    const json = await res.json();
    if (json.ok) setItems(json.data);
    else toast.error(json.error ?? 'Failed to load counsellors');
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm(EMPTY);
    setOpen(true);
  }
  function openEdit(c: Counsellor) {
    setForm({
      id: c.id,
      name: c.name ?? '',
      email: c.email ?? '',
      phone: c.phone ?? '',
      password: '',
      credentials: c.counsellorProfile?.credentials ?? '',
      specialty: c.counsellorProfile?.specialty ?? '',
      languages: c.counsellorProfile?.languages.join(', ') ?? '',
      experience: c.counsellorProfile?.experience ?? '',
      photoUrl: c.counsellorProfile?.photoUrl ?? '',
      bio: c.counsellorProfile?.bio ?? '',
    });
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const languages = form.languages
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const body = form.id
      ? {
          name: form.name,
          phone: form.phone,
          credentials: form.credentials,
          specialty: form.specialty,
          languages,
          experience: form.experience,
          photoUrl: form.photoUrl || null,
          bio: form.bio || null,
        }
      : {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          credentials: form.credentials,
          specialty: form.specialty,
          languages,
          experience: form.experience,
          photoUrl: form.photoUrl || null,
          bio: form.bio || null,
        };

    const url = form.id ? `/api/admin/counsellors/${form.id}` : '/api/admin/counsellors';
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
    toast.success(form.id ? 'Counsellor updated' : 'Counsellor created');
    setOpen(false);
    load();
  }

  async function handleDelete(permanent: boolean) {
    if (!deleteTarget) return;
    const q = permanent ? '?permanent=true' : '';
    const res = await fetch(`/api/admin/counsellors/${deleteTarget.id}${q}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error ?? 'Delete failed');
      return;
    }
    toast.success(permanent ? 'Counsellor deleted' : 'Counsellor deactivated');
    setDeleteTarget(null);
    load();
  }

  async function handleBulkDelete(permanent: boolean) {
    const q = permanent ? '?permanent=true' : '';
    const results = await Promise.allSettled(
      selectedIds.map((id) =>
        fetch(`/api/admin/counsellors/${id}${q}`, { method: 'DELETE' }).then((r) => r.json())
      )
    );
    const failed = results.filter((r) => r.status === 'rejected' || !r.value?.ok).length;
    const done = results.length - failed;
    const noun = (n: number) => (n === 1 ? 'counsellor' : 'counsellors');
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
        title="Counsellors"
        subtitle="BGCI-certified genetic counsellors — they review reports + run consultations."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> New counsellor
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
              header: 'Counsellor',
              render: (c) => (
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    {c.counsellorProfile?.photoUrl && (
                      <AvatarImage src={c.counsellorProfile.photoUrl} alt={c.name ?? ''} />
                    )}
                    <AvatarFallback className="bg-primary/10 text-xs text-primary">
                      {initialsFrom(c.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.email}</div>
                  </div>
                </div>
              ),
            },
            { key: 'specialty', header: 'Specialty', render: (c) => c.counsellorProfile?.specialty },
            {
              key: 'languages',
              header: 'Languages',
              render: (c) => (
                <div className="flex flex-wrap gap-1">
                  {c.counsellorProfile?.languages.map((l) => (
                    <Badge key={l} variant="secondary" className="text-[10px]">
                      {l}
                    </Badge>
                  ))}
                </div>
              ),
            },
            { key: 'experience', header: 'Experience', render: (c) => c.counsellorProfile?.experience },
            {
              key: 'active',
              header: 'Status',
              render: (c) => (
                <Badge variant={c.counsellorProfile?.active ? 'default' : 'secondary'}>
                  {c.counsellorProfile?.active ? 'Active' : 'Inactive'}
                </Badge>
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="shrink-0 border-b p-4 pr-10">
            <DialogTitle>{form.id ? 'Edit counsellor' : 'New counsellor'}</DialogTitle>
            <DialogDescription>
              {form.id ? 'Update profile details.' : 'Creates a User + CounsellorProfile. They log in with this email.'}
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
          <form id="c-form" onSubmit={save} className="grid gap-4">
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
                <Label htmlFor="email">Email {form.id && '(read-only)'}</Label>
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
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
              {!form.id && (
                <div className="space-y-1.5">
                  <Label htmlFor="password">Temporary password (min 8)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>
              )}
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="creds">Credentials</Label>
                <Input
                  id="creds"
                  placeholder="M.Sc. Genetic Counselling, BGCI certified"
                  value={form.credentials}
                  onChange={(e) => setForm({ ...form, credentials: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="specialty">Specialty</Label>
                <Input
                  id="specialty"
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  placeholder="11 years"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="languages">Languages (comma separated)</Label>
                <Input
                  id="languages"
                  value={form.languages}
                  onChange={(e) => setForm({ ...form, languages: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="photo">Photo URL</Label>
                <Input
                  id="photo"
                  placeholder="https://…"
                  value={form.photoUrl}
                  onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
            </div>
          </form>
          </DialogBody>
          <DialogFooter className="m-0 shrink-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="c-form" disabled={saving}>
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
        itemLabel="This counsellor"
        onConfirm={handleDelete}
      />

      <DeleteConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selectedIds.length} ${selectedIds.length === 1 ? 'counsellor' : 'counsellors'}?`}
        itemLabel={
          selectedIds.length === 1 ? 'This counsellor' : `These ${selectedIds.length} counsellors`
        }
        onConfirm={handleBulkDelete}
      />
    </>
  );
}
