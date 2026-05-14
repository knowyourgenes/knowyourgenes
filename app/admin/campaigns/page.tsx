'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Loader2, Pencil, Trash2, Copy, Link2, ExternalLink } from 'lucide-react';

import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CampaignRow = {
  id: string;
  name: string;
  slug: string;
  source: string;
  medium: string;
  term: string | null;
  content: string | null;
  destination: string;
  notes: string | null;
  active: boolean;
  createdAt: string;
  _count: { orders: number };
};

type Form = {
  id?: string;
  name: string;
  slug: string;
  source: string;
  medium: string;
  term: string;
  content: string;
  destination: string;
  notes: string;
  active: boolean;
};

const EMPTY: Form = {
  name: '',
  slug: '',
  source: 'instagram',
  medium: 'social',
  term: '',
  content: '',
  destination: '/',
  notes: '',
  active: true,
};

// Common presets — covers most marketing surfaces. Free-form input still
// allowed; the regex on the validator just enforces lowercase + dash/underscore.
const SOURCE_PRESETS = [
  'instagram',
  'facebook',
  'meta',
  'google',
  'youtube',
  'whatsapp',
  'twitter',
  'linkedin',
  'email',
  'sms',
  'influencer',
  'partner',
];
const MEDIUM_PRESETS = [
  'social',
  'cpc',
  'paid_social',
  'paid_video',
  'organic',
  'email',
  'sms',
  'referral',
  'affiliate',
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

export default function AdminCampaignsPage() {
  const [items, setItems] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CampaignRow | null>(null);
  const [linkTarget, setLinkTarget] = useState<CampaignRow | null>(null);
  const [origin, setOrigin] = useState<string>('https://kyg.in');

  useEffect(() => {
    if (typeof window !== 'undefined') setOrigin(window.location.origin);
  }, []);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/campaigns');
    const json = await res.json();
    if (json.ok) setItems(json.data.items);
    else toast.error(json.error ?? 'Failed to load campaigns');
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm(EMPTY);
    setSlugTouched(false);
    setOpen(true);
  }

  function openEdit(c: CampaignRow) {
    setForm({
      id: c.id,
      name: c.name,
      slug: c.slug,
      source: c.source,
      medium: c.medium,
      term: c.term ?? '',
      content: c.content ?? '',
      destination: c.destination,
      notes: c.notes ?? '',
      active: c.active,
    });
    setSlugTouched(true);
    setOpen(true);
  }

  // Auto-derive slug from name unless the user has typed in the slug field.
  function setName(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: slugTouched ? f.slug : slugify(name),
    }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body = {
      name: form.name,
      slug: form.slug,
      source: form.source,
      medium: form.medium,
      term: form.term || null,
      content: form.content || null,
      destination: form.destination || '/',
      notes: form.notes || null,
      active: form.active,
    };
    const url = form.id ? `/api/admin/campaigns/${form.id}` : '/api/admin/campaigns';
    const res = await fetch(url, {
      method: form.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    setSaving(false);
    if (!json.ok) return toast.error(json.error ?? 'Save failed');
    toast.success(form.id ? 'Campaign updated' : 'Campaign created');
    setOpen(false);
    load();
  }

  async function handleDeactivate() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/campaigns/${deleteTarget.id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error ?? 'Deactivate failed');
      return;
    }
    toast.success('Campaign deactivated');
    setDeleteTarget(null);
    load();
  }

  function buildUrl(c: {
    destination: string;
    source: string;
    medium: string;
    slug: string;
    term: string | null;
    content: string | null;
  }) {
    const dest = c.destination.startsWith('/') ? c.destination : `/${c.destination}`;
    const u = new URL(dest, origin);
    u.searchParams.set('utm_source', c.source);
    u.searchParams.set('utm_medium', c.medium);
    u.searchParams.set('utm_campaign', c.slug);
    if (c.term) u.searchParams.set('utm_term', c.term);
    if (c.content) u.searchParams.set('utm_content', c.content);
    return u.toString();
  }

  async function copyToClipboard(text: string, label = 'Link') {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error('Copy failed — select and copy manually');
    }
  }

  return (
    <>
      <PageHeader
        title="Campaigns"
        subtitle="Generate trackable UTM links. Every order with a matching utm_campaign gets attributed to its campaign automatically."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> New campaign
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
              render: (c) => (
                <div className="flex flex-col">
                  <span className="font-medium">{c.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{c.slug}</span>
                </div>
              ),
            },
            {
              key: 'source',
              header: 'Source / medium',
              render: (c) => (
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline">{c.source}</Badge>
                  <Badge variant="secondary">{c.medium}</Badge>
                </div>
              ),
            },
            {
              key: 'dest',
              header: 'Lands on',
              render: (c) => <span className="font-mono text-xs">{c.destination}</span>,
            },
            {
              key: 'orders',
              header: 'Orders',
              render: (c) => <span className="font-medium tabular-nums">{c._count.orders}</span>,
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
            <div className="flex justify-end gap-1">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => setLinkTarget(c)}
                aria-label="Get link"
                title="Get link"
              >
                <Link2 className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon-sm" variant="ghost" onClick={() => openEdit(c)} aria-label="Edit" title="Edit">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => setDeleteTarget(c)}
                aria-label="Deactivate"
                title="Deactivate"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        />
      )}

      {/* ----------------------------- Create / edit form ----------------------------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="shrink-0 border-b p-4 pr-10">
            <DialogTitle>{form.id ? 'Edit campaign' : 'New campaign'}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <form id="campaign-form" onSubmit={save} className="grid gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Campaign name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q2 Instagram Reels — Wellness"
                  required
                />
                <p className="text-xs text-muted-foreground">Human label only. Not visible to customers.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="slug">Slug (becomes utm_campaign)</Label>
                <Input
                  id="slug"
                  className="font-mono"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') });
                  }}
                  placeholder="q2-ig-reels-wellness"
                  required
                />
                <p className="text-xs text-muted-foreground">Lowercase, dashes, no spaces. Must be unique.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Source (utm_source)</Label>
                  <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v ?? form.source })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SOURCE_PRESETS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Medium (utm_medium)</Label>
                  <Select value={form.medium} onValueChange={(v) => setForm({ ...form, medium: v ?? form.medium })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MEDIUM_PRESETS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="content">Content (utm_content)</Label>
                  <Input
                    id="content"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="variant-a (optional)"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="term">Term (utm_term)</Label>
                  <Input
                    id="term"
                    value={form.term}
                    onChange={(e) => setForm({ ...form, term: e.target.value })}
                    placeholder="wellness-dna-test (optional)"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="destination">Destination path</Label>
                <Input
                  id="destination"
                  className="font-mono"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  placeholder="/packages/wellness-starter"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Path only. The full URL is built with the site origin at render time.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Internal context — when this was launched, which creative, who owns it…"
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.active} onCheckedChange={(c) => setForm({ ...form, active: c === true })} />
                Active
              </label>

              {/* Live preview of the link about to be generated */}
              {form.slug && (
                <div className="rounded border bg-muted/40 p-3">
                  <p className="mb-1 text-xs font-medium text-muted-foreground">Generated link preview</p>
                  <code className="block break-all text-xs">{buildUrl(form as unknown as CampaignRow)}</code>
                </div>
              )}
            </form>
          </DialogBody>
          <DialogFooter className="m-0 shrink-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="campaign-form" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------------------- Get link dialog ----------------------------- */}
      <Dialog open={!!linkTarget} onOpenChange={(o) => !o && setLinkTarget(null)}>
        <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="border-b p-4 pr-10">
            <DialogTitle>{linkTarget?.name}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {linkTarget && (
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Trackable link
                  </p>
                  <div className="flex items-stretch gap-2">
                    <code className="flex-1 break-all rounded border bg-muted/40 p-2 text-xs">
                      {buildUrl(linkTarget)}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(buildUrl(linkTarget), 'Link')}
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Paste this anywhere — Instagram bio, Meta ad, WhatsApp broadcast, email. Every visitor who clicks it
                    gets first-touch attribution to this campaign.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 rounded border p-3 text-sm">
                  <Detail label="Source" value={linkTarget.source} />
                  <Detail label="Medium" value={linkTarget.medium} />
                  <Detail label="Content" value={linkTarget.content ?? '—'} />
                  <Detail label="Term" value={linkTarget.term ?? '—'} />
                  <Detail label="Destination" value={linkTarget.destination} mono />
                  <Detail label="Orders attributed" value={String(linkTarget._count.orders)} />
                </div>

                <a
                  href={buildUrl(linkTarget)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-foreground underline-offset-2 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Open in new tab
                </a>
              </div>
            )}
          </DialogBody>
          <DialogFooter className="m-0">
            <Button variant="outline" onClick={() => setLinkTarget(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={deleteTarget ? `Deactivate campaign "${deleteTarget.name}"?` : 'Deactivate'}
        itemLabel="This campaign"
        onConfirm={handleDeactivate}
      />
    </>
  );
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={mono ? 'font-mono text-sm' : 'text-sm'}>{value}</p>
    </div>
  );
}
