'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ServiceArea } from '@prisma/client';
import { toast } from 'sonner';
import { Plus, Upload, Loader2, Power, PowerOff, Trash2, MapPin, Search, CheckCircle2, Sparkles } from 'lucide-react';

import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

// Indian states + UTs in Title Case to match the seeded `state` column.
const INDIA_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep',
];

// Delhi NCR definition: Delhi (all) + 4 adjacent districts across HR and UP.
const DELHI_NCR_TARGETS = [
  { state: 'Delhi' },
  { state: 'Haryana', district: 'Gurugram' },
  { state: 'Haryana', district: 'Faridabad' },
  { state: 'Uttar Pradesh', district: 'Gautam Buddh Nagar' },
  { state: 'Uttar Pradesh', district: 'Ghaziabad' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Stats = { total: number; active: number; states: number; districts: number };
type ActiveFilter = 'all' | 'active' | 'inactive';

export default function AdminServiceAreaPage() {
  // Data
  const [items, setItems] = useState<ServiceArea[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters + pagination
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('active');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ pincode: '', area: '', district: '', state: '' });
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [bulkCsv, setBulkCsv] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ServiceArea | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [ncrPresetOpen, setNcrPresetOpen] = useState(false);
  const [presetRunning, setPresetRunning] = useState(false);

  // Debounce the search box (300ms) so typing doesn't hit the API every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQ(q.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [stateFilter, activeFilter]);

  const loadRows = useCallback(async () => {
    setLoading(true);
    const url = new URL('/api/admin/service-area', window.location.origin);
    if (debouncedQ) url.searchParams.set('q', debouncedQ);
    if (stateFilter !== 'ALL') url.searchParams.set('state', stateFilter);
    if (activeFilter !== 'all') url.searchParams.set('active', activeFilter === 'active' ? 'true' : 'false');
    url.searchParams.set('skip', String((page - 1) * pageSize));
    url.searchParams.set('take', String(pageSize));

    const res = await fetch(url.toString());
    const json = await res.json();
    if (json.ok) {
      setItems(json.data.items);
      setTotal(json.data.total);
    } else {
      toast.error(json.error ?? 'Failed to load pincodes');
    }
    setLoading(false);
  }, [debouncedQ, stateFilter, activeFilter, page, pageSize]);

  const loadStats = useCallback(async () => {
    const res = await fetch('/api/admin/service-area/stats');
    const json = await res.json();
    if (json.ok) setStats(json.data);
  }, []);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // ---------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------

  async function toggleOne(pin: ServiceArea) {
    const res = await fetch(`/api/admin/service-area/${pin.pincode}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !pin.active }),
    });
    const json = await res.json();
    if (!json.ok) return toast.error(json.error ?? 'Failed');
    toast.success(pin.active ? `${pin.pincode} deactivated` : `${pin.pincode} activated`);
    loadRows();
    loadStats();
  }

  async function bulkToggle(active: boolean) {
    if (selectedIds.length === 0) return;
    const res = await fetch('/api/admin/service-area/bulk-toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pincodes: selectedIds, active }),
    });
    const json = await res.json();
    if (!json.ok) return toast.error(json.error ?? 'Failed');
    toast.success(`${active ? 'Activated' : 'Deactivated'} ${json.data.updated} pincodes`);
    setSelectedIds([]);
    loadRows();
    loadStats();
  }

  async function applyDelhiNcrPreset() {
    setPresetRunning(true);
    const results = await Promise.allSettled(
      DELHI_NCR_TARGETS.map((t) =>
        fetch('/api/admin/service-area/bulk-toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...t, active: true }),
        }).then((r) => r.json())
      )
    );
    const updated = results.reduce(
      (n, r) => (r.status === 'fulfilled' && r.value?.ok ? n + r.value.data.updated : n),
      0
    );
    setPresetRunning(false);
    setNcrPresetOpen(false);
    if (updated === 0) {
      toast.error('No pincodes were updated. Did you run `pnpm db:seed-pincodes`?');
    } else {
      toast.success(`Activated ${updated} pincodes across Delhi NCR`);
    }
    loadRows();
    loadStats();
  }

  async function addSingle(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/admin/service-area', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...addForm, active: true }),
    });
    const json = await res.json();
    setSaving(false);
    if (!json.ok) return toast.error(json.error ?? 'Failed');
    toast.success('Pincode added');
    setAddForm({ pincode: '', area: '', district: '', state: '' });
    setAddOpen(false);
    loadRows();
    loadStats();
  }

  async function addBulk(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const pincodes = bulkCsv
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [pincode, area, district, state] = line.split(',').map((s) => s.trim());
        return {
          pincode,
          area: area ?? '',
          district: district ?? '',
          state: state ?? '',
          city: district ?? '',
          active: true,
        };
      });
    const res = await fetch('/api/admin/service-area', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pincodes }),
    });
    const json = await res.json();
    setSaving(false);
    if (!json.ok) return toast.error(json.error ?? 'Import failed');
    toast.success(`Imported ${json.data.inserted} pincodes`);
    setBulkCsv('');
    setBulkImportOpen(false);
    loadRows();
    loadStats();
  }

  async function handleDeactivate() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/service-area/${deleteTarget.pincode}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error ?? 'Deactivate failed');
      return;
    }
    toast.success('Pincode deactivated');
    setDeleteTarget(null);
    loadRows();
    loadStats();
  }

  async function handleBulkDeactivate() {
    const results = await Promise.allSettled(
      selectedIds.map((pin) => fetch(`/api/admin/service-area/${pin}`, { method: 'DELETE' }).then((r) => r.json()))
    );
    const failed = results.filter((r) => r.status === 'rejected' || !r.value?.ok).length;
    const done = results.length - failed;
    const noun = (n: number) => (n === 1 ? 'pincode' : 'pincodes');
    if (failed === 0) toast.success(`${done} ${noun(done)} deactivated`);
    else if (done === 0) toast.error(`Failed to deactivate ${failed} ${noun(failed)}`);
    else toast.error(`${done} done, ${failed} failed`);
    setBulkDeleteOpen(false);
    setSelectedIds([]);
    loadRows();
    loadStats();
  }

  // ---------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------

  const rowsForTable = useMemo(() => items.map((i) => ({ ...i, id: i.pincode })), [items]);

  const noDataHint =
    (stats?.total ?? 0) === 0
      ? 'No pincodes in the database yet. Run `pnpm db:seed-pincodes` to load all India, then use the "Activate Delhi NCR" preset.'
      : 'No pincodes match these filters. Try clearing search or switching to "All".';

  return (
    <>
      <PageHeader
        title="Service area"
        subtitle="Delhi NCR pincodes accept orders. Toggle any pincode on or off across India."
        actions={
          <>
            <Button variant="outline" onClick={() => setNcrPresetOpen(true)}>
              <Sparkles className="h-4 w-4" /> Activate Delhi NCR
            </Button>
            <Button variant="outline" onClick={() => setBulkImportOpen(true)}>
              <Upload className="h-4 w-4" /> Bulk import
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" /> Add pincode
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total pincodes in DB</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats?.total.toLocaleString('en-IN') ?? '-'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Accepting orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-emerald-600">
              {stats?.active.toLocaleString('en-IN') ?? '-'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>States covered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats?.states ?? '-'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Districts covered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats?.districts ?? '-'}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter bar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-60 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search pincode, area, or district…"
            className="pl-9"
          />
        </div>
        <Select value={stateFilter} onValueChange={(v) => setStateFilter(v ?? 'ALL')}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All states</SelectItem>
            {INDIA_STATES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={activeFilter} onValueChange={(v) => setActiveFilter((v as ActiveFilter) ?? 'active')}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active only</SelectItem>
            <SelectItem value="inactive">Inactive only</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
        {(q || stateFilter !== 'ALL' || activeFilter !== 'active') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQ('');
              setStateFilter('ALL');
              setActiveFilter('active');
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {loading && items.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (
        <DataTable
          rows={rowsForTable}
          empty={noDataHint}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(s) => setPageSize(s)}
          selectable
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          bulkActions={
            <>
              <Button variant="outline" size="sm" onClick={() => bulkToggle(true)}>
                <Power className="h-3.5 w-3.5" /> Activate
              </Button>
              <Button variant="outline" size="sm" onClick={() => bulkToggle(false)}>
                <PowerOff className="h-3.5 w-3.5" /> Deactivate
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setBulkDeleteOpen(true)}>
                <Trash2 className="h-3.5 w-3.5" /> Deactivate
              </Button>
            </>
          }
          columns={[
            {
              key: 'pincode',
              header: 'Pincode',
              render: (r) => <span className="font-mono">{r.pincode}</span>,
            },
            { key: 'area', header: 'Area' },
            { key: 'district', header: 'District', render: (r) => r.district || '-' },
            { key: 'state', header: 'State', render: (r) => <Badge variant="outline">{r.state || '-'}</Badge> },
            {
              key: 'active',
              header: 'Status',
              render: (r) =>
                r.active ? (
                  <Badge className="gap-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                    <CheckCircle2 className="h-3 w-3" /> Active
                  </Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                ),
            },
          ]}
          rowAction={(r) => (
            <div className="flex justify-end gap-2">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => toggleOne(r)}
                aria-label={r.active ? 'Deactivate' : 'Activate'}
                title={r.active ? 'Deactivate' : 'Activate'}
              >
                {r.active ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5 text-emerald-600" />}
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => setDeleteTarget(r)}
                aria-label="Deactivate"
                title="Deactivate"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        />
      )}

      {/* Add single */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="shrink-0 border-b p-4 pr-10">
            <DialogTitle>Add pincode</DialogTitle>
            <DialogDescription>Use this for pincodes missing from the seed data.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <form id="sa-form" onSubmit={addSingle} className="grid gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="pincode">Pincode (6 digits)</Label>
                <Input
                  id="pincode"
                  className="font-mono"
                  maxLength={6}
                  value={addForm.pincode}
                  onChange={(e) => setAddForm({ ...addForm, pincode: e.target.value.replace(/\D/g, '') })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  value={addForm.area}
                  onChange={(e) => setAddForm({ ...addForm, area: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={addForm.district}
                  onChange={(e) => setAddForm({ ...addForm, district: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state">State</Label>
                <Select
                  value={addForm.state || undefined}
                  onValueChange={(v) => setAddForm({ ...addForm, state: v ?? '' })}
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIA_STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </form>
          </DialogBody>
          <DialogFooter className="m-0 shrink-0">
            <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="sa-form" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? 'Saving…' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk import */}
      <Dialog open={bulkImportOpen} onOpenChange={setBulkImportOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="shrink-0 border-b p-4 pr-10">
            <DialogTitle>Bulk import pincodes</DialogTitle>
            <DialogDescription>
              One per line: <code className="rounded bg-muted px-1 font-mono text-xs">pincode,area,district,state</code>
              . Existing pincodes are upserted and set active.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <form id="bulk-form" onSubmit={addBulk}>
              <Textarea
                rows={12}
                className="font-mono text-xs"
                placeholder={`110001,Connaught Place,New Delhi,Delhi\n122001,DLF Phase 1-3,Gurugram,Haryana\n201301,Sector 62,Gautam Buddh Nagar,Uttar Pradesh`}
                value={bulkCsv}
                onChange={(e) => setBulkCsv(e.target.value)}
                required
              />
              <p className="mt-2 text-xs text-muted-foreground">Max 500 rows per import.</p>
            </form>
          </DialogBody>
          <DialogFooter className="m-0 shrink-0">
            <Button type="button" variant="outline" onClick={() => setBulkImportOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="bulk-form" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? 'Importing…' : 'Import'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delhi NCR preset confirm */}
      <AlertDialog open={ncrPresetOpen} onOpenChange={setNcrPresetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate Delhi NCR?</AlertDialogTitle>
            <AlertDialogDescription>
              This will activate every pincode in Delhi (NCT), Gurugram, Faridabad, Gautam Buddh Nagar (Noida), and
              Ghaziabad. Currently-active pincodes stay active; currently-inactive pincodes in those regions become
              active. Pincodes outside these regions are untouched.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={presetRunning}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={applyDelhiNcrPreset} disabled={presetRunning}>
              {presetRunning && <Loader2 className="h-4 w-4 animate-spin" />}
              {presetRunning ? 'Activating…' : 'Activate Delhi NCR'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={deleteTarget ? `Deactivate pincode ${deleteTarget.pincode}?` : 'Deactivate'}
        itemLabel="This pincode"
        onConfirm={handleDeactivate}
      />

      <DeleteConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Deactivate ${selectedIds.length} ${selectedIds.length === 1 ? 'pincode' : 'pincodes'}?`}
        itemLabel={selectedIds.length === 1 ? 'This pincode' : `These ${selectedIds.length} pincodes`}
        onConfirm={handleBulkDeactivate}
      />

      {/* Small footer hint */}
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" />
        Runtime location lookup uses MapMyIndia via <code>/api/location/resolve</code>.
      </div>
    </>
  );
}
