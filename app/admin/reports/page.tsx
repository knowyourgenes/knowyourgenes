'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Upload, Download, Trash2, FileText, Search, AlertTriangle, CheckCircle2, Eye } from 'lucide-react';

import PageHeader from '@/features/admin/components/PageHeader';
import DataTable from '@/features/admin/components/DataTable';
import DeleteConfirmDialog from '@/features/admin/components/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  const [approveTarget, setApproveTarget] = useState<Report | null>(null);
  const [viewTarget, setViewTarget] = useState<Report | null>(null);
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState('');
  const [critical, setCritical] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    p.set('take', '50');
    const res = await fetch(`/api/admin/reports?${p}`);
    const json = await res.json();
    if (json.ok) setItems(json.data.items);
    else toast.error(json.error ?? 'Failed to load reports');
    setLoading(false);
  }, [q]);

  useEffect(() => {
    // Initial fetch on mount. We intentionally do not depend on `load` here to
    // avoid re-fetching every time `q` changes (search is triggered by the
    // form submit handler instead).
    let cancelled = false;
    (async () => {
      const p = new URLSearchParams();
      p.set('take', '50');
      const res = await fetch(`/api/admin/reports?${p}`);
      const json = await res.json();
      if (cancelled) return;
      if (json.ok) setItems(json.data.items);
      else toast.error(json.error ?? 'Failed to load reports');
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
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

  async function openPreview(r: Report) {
    setViewTarget(r);
    setViewUrl(null);
    setViewLoading(true);
    try {
      const res = await fetch(`/api/admin/reports/${r.id}/download`, { method: 'POST' });
      const json = await res.json();
      if (!json.ok) {
        toast.error(json.error ?? 'Could not open the report');
        setViewTarget(null);
        return;
      }
      setViewUrl(json.data.url);
    } catch {
      toast.error('Could not reach the server');
      setViewTarget(null);
    } finally {
      setViewLoading(false);
    }
  }

  async function approveReport(r: Report) {
    setApprovingId(r.id);
    setApproveTarget(null);
    try {
      const res = await fetch(`/api/admin/reports/${r.id}/approve`, {
        method: 'POST',
        credentials: 'include',
      });
      const json = await res.json();
      if (!json.ok) {
        toast.error(json.error ?? 'Could not approve the report');
        return;
      }
      if (json.data.alreadyDelivered) {
        toast.info(`${r.reportNumber} was already released`);
      } else {
        toast.success(`${r.reportNumber} released to the customer`, {
          description:
            json.data.notified === 'sent'
              ? 'They have been emailed.'
              : 'Email is queued - it will send once SMTP is configured.',
        });
      }
      await load();
    } catch {
      toast.error('Could not reach the server');
    } finally {
      setApprovingId(null);
    }
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
                  <div>{r.user.name ?? '-'}</div>
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
            <div className="flex items-center justify-end gap-1">
              {/* READ IT, then decide. Placed before Approve because that is the
                  order the two are meant to happen in. */}
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => openPreview(r)}
                title="View the PDF without leaving this page"
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
              {/*
                THE REVIEW STEP. A lab uploads; nothing reaches the customer
                until someone here approves. Rendered as a real button rather
                than a ghost icon because it is the one irreversible action on
                this screen - it emails a genetic report to a person.
              */}
              {!r.deliveredAt && (
                <Button
                  size="sm"
                  variant="default"
                  className="h-7 px-2 text-[11px]"
                  disabled={approvingId === r.id}
                  onClick={() => setApproveTarget(r)}
                  title="Review complete - release this report to the customer"
                >
                  {approvingId === r.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  Approve
                </Button>
              )}
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

      {/* The PDF itself, inline. Object storage serves it as
          `Content-Disposition: inline`, so the browser's own viewer renders it
          in the frame - no PDF library, no bundle cost. */}
      <Dialog
        open={!!viewTarget}
        onOpenChange={(o: boolean) => {
          if (!o) {
            setViewTarget(null);
            // Dropped on close so the signed URL is not left sitting in memory
            // after the dialog is gone.
            setViewUrl(null);
          }
        }}
      >
        <DialogContent className="flex h-[92vh] max-h-[92vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
          <DialogHeader className="border-b px-5 py-3">
            <DialogTitle className="flex flex-wrap items-center gap-2 text-base">
              <span className="font-mono text-sm">{viewTarget?.reportNumber}</span>
              <span className="text-muted-foreground">·</span>
              <span className="font-normal">{viewTarget?.packageName}</span>
              {viewTarget?.criticalFinding && (
                <Badge variant="destructive" className="text-[10px]">
                  Critical finding
                </Badge>
              )}
              {viewTarget?.deliveredAt ? (
                <Badge variant="secondary" className="text-[10px]">
                  Already released
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px]">
                  Awaiting review
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="min-h-0 flex-1 bg-muted">
            {viewLoading || !viewUrl ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching the report…
              </div>
            ) : (
              <iframe src={viewUrl} title={`Report ${viewTarget?.reportNumber}`} className="h-full w-full border-0" />
            )}
          </div>

          {/* Approving from inside the preview is the point: read, then decide,
              without hunting for the row again. */}
          {viewTarget && !viewTarget.deliveredAt && (
            <div className="flex items-center justify-between gap-3 border-t px-5 py-3">
              <p className="text-xs text-muted-foreground">Releasing emails the customer and cannot be undone.</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setViewTarget(null)}>
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    const r = viewTarget;
                    setViewTarget(null);
                    setApproveTarget(r);
                  }}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve and send
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!approveTarget} onOpenChange={(o: boolean) => !o && setApproveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Release {approveTarget?.reportNumber} to the customer?</AlertDialogTitle>
            <AlertDialogDescription>
              This emails {approveTarget?.user.name ?? approveTarget?.user.email ?? 'the customer'} and makes the report
              readable in their account. It cannot be taken back.
              {approveTarget?.criticalFinding ? (
                <>
                  {' '}
                  <strong className="text-destructive">
                    This report is flagged as a critical finding - make sure a counsellor is ready to take the call.
                  </strong>
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => approveTarget && approveReport(approveTarget)}>
              Approve and send
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
