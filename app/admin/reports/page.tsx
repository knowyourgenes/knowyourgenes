'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Upload, Download, Trash2, FileText, Search, AlertTriangle } from 'lucide-react';

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

type Report = {
  id: string;
  reportNumber: string;
  packageName: string;
  pdfKey: string;
  criticalFinding: boolean;
  deliveredAt: string | null;
  emailSentAt: string | null;
  whatsappSentAt: string | null;
  createdAt: string;
  order: { orderNumber: string; status: string };
  user: { name: string | null; email: string | null; phone: string | null };
};

export default function AdminReportsPage() {
  const [items, setItems] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState('');
  const [critical, setCritical] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    p.set('take', '50');
    const res = await fetch(`/api/admin/reports?${p}`);
    const json = await res.json();
    if (json.ok) setItems(json.data.items);
    else toast.error(json.error ?? 'Failed to load reports');
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId.trim() || !file) {
      toast.error('Order ID and PDF file required');
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append('orderId', orderId.trim());
    fd.append('file', file);
    if (summary.trim()) {
      const lines = summary
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      fd.append('summary', JSON.stringify(lines));
    }
    fd.append('criticalFinding', String(critical));

    const res = await fetch('/api/admin/reports/upload', { method: 'POST', body: fd });
    const json = await res.json();
    setUploading(false);
    if (!json.ok) {
      toast.error(json.error ?? 'Upload failed');
      return;
    }
    toast.success(`Uploaded ${json.data.reportNumber}`);
    setUploadOpen(false);
    setOrderId('');
    setFile(null);
    setSummary('');
    setCritical(false);
    load();
  }

  async function downloadReport(r: Report) {
    setBusyId(r.id);
    const res = await fetch(`/api/admin/reports/${r.id}/download`, { method: 'POST' });
    const json = await res.json();
    setBusyId(null);
    if (!json.ok) {
      toast.error(json.error ?? 'Could not get download URL');
      return;
    }
    window.open(json.data.url, '_blank', 'noopener,noreferrer');
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/reports/${deleteTarget.id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error ?? 'Delete failed');
      return;
    }
    toast.success('Report deleted');
    setDeleteTarget(null);
    load();
  }

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Upload report PDFs to Cloudflare R2. Reports are private - downloads use short-lived signed URLs."
        actions={
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className="h-4 w-4" /> Upload report
          </Button>
        }
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
        className="mb-4 flex gap-2"
      >
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Report number, order, package…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-8 w-72"
          />
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (
        <DataTable
          rows={items}
          columns={[
            {
              key: 'report',
              header: 'Report',
              render: (r) => (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-mono text-xs">{r.reportNumber}</div>
                    <div className="text-xs text-muted-foreground">{r.packageName}</div>
                  </div>
                  {r.criticalFinding && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="h-3 w-3" /> Critical
                    </Badge>
                  )}
                </div>
              ),
            },
            {
              key: 'order',
              header: 'Order',
              render: (r) => <span className="font-mono text-xs">{r.order.orderNumber}</span>,
            },
            {
              key: 'user',
              header: 'User',
              render: (r) => (
                <div className="text-sm">
                  <div>{r.user.name ?? '—'}</div>
                  <div className="text-xs text-muted-foreground">{r.user.email ?? r.user.phone ?? ''}</div>
                </div>
              ),
            },
            {
              key: 'sent',
              header: 'Sent',
              render: (r) => (
                <div className="flex gap-1">
                  {r.deliveredAt ? <Badge variant="default">Sent</Badge> : <Badge variant="secondary">Not sent</Badge>}
                </div>
              ),
            },
            {
              key: 'createdAt',
              header: 'Uploaded',
              render: (r) => <span className="text-xs">{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>,
            },
          ]}
          rowAction={(r) => (
            <div className="flex justify-end gap-1">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => downloadReport(r)}
                disabled={busyId === r.id}
                title="Download PDF (signed URL)"
              >
                {busyId === r.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => setDeleteTarget(r)}
                title="Delete report (R2 + DB)"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
          empty="No reports uploaded yet."
        />
      )}

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="shrink-0 border-b p-4 pr-10">
            <DialogTitle>Upload report</DialogTitle>
            <DialogDescription>PDF only, max 25 MB. Stored privately in R2.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <form id="upload-form" onSubmit={handleUpload} className="grid gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="oid">Order ID</Label>
                <Input
                  id="oid"
                  className="font-mono text-xs"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="cuid (from /admin/orders)"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pdf">PDF file</Label>
                <Input
                  id="pdf"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sum">Plain-English summary (one bullet per line, optional)</Label>
                <Textarea
                  id="sum"
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="High vitamin D requirement&#10;Caffeine slow metaboliser…"
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={critical} onCheckedChange={(c) => setCritical(c === true)} />
                Critical finding (counsellor must call user before release)
              </label>
            </form>
          </DialogBody>
          <DialogFooter className="m-0 shrink-0">
            <Button type="button" variant="outline" onClick={() => setUploadOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="upload-form" disabled={uploading}>
              {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
              {uploading ? 'Uploading…' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={deleteTarget ? `Delete ${deleteTarget.reportNumber}?` : 'Delete report'}
        itemLabel="This report (PDF + DB row)"
        onConfirm={handleDelete}
      />
    </>
  );
}
