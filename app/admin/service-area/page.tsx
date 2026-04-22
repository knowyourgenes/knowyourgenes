'use client';

import { useEffect, useState } from 'react';
import type { ServiceArea } from '@prisma/client';
import { toast } from 'sonner';
import { Plus, Upload, Loader2 } from 'lucide-react';

import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminServiceAreaPage() {
  const [items, setItems] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ pincode: '', area: '', city: '' });

  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkCsv, setBulkCsv] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/service-area');
    const json = await res.json();
    if (json.ok) setItems(json.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

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
    setAddForm({ pincode: '', area: '', city: '' });
    setAddOpen(false);
    load();
  }

  async function addBulk(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const pincodes = bulkCsv
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [pincode, area, city] = line.split(',').map((s) => s.trim());
        return { pincode, area, city, active: true };
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
    setBulkOpen(false);
    load();
  }

  async function toggle(pin: ServiceArea) {
    await fetch(`/api/admin/service-area/${pin.pincode}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !pin.active }),
    });
    toast.success(pin.active ? 'Deactivated' : 'Activated');
    load();
  }

  async function remove(pin: ServiceArea) {
    if (!confirm(`Delete pincode ${pin.pincode}?`)) return;
    await fetch(`/api/admin/service-area/${pin.pincode}`, { method: 'DELETE' });
    toast.success('Deleted');
    load();
  }

  const activeCount = items.filter((i) => i.active).length;
  const cityCount = new Set(items.map((i) => i.city)).size;

  return (
    <>
      <PageHeader
        title="Service area"
        subtitle="Delhi NCR pincodes we accept orders from. Built for city expansion."
        actions={
          <>
            <Button variant="outline" onClick={() => setBulkOpen(true)}>
              <Upload className="h-4 w-4" /> Bulk import
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" /> Add pincode
            </Button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total pincodes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{items.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-emerald-600">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Cities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{cityCount}</div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (
        <DataTable
          rows={items.map((i) => ({ ...i, id: i.pincode }))}
          columns={[
            { key: 'pincode', header: 'Pincode', render: (r) => <span className="font-mono">{r.pincode}</span> },
            { key: 'area', header: 'Area' },
            { key: 'city', header: 'City', render: (r) => <Badge variant="outline">{r.city}</Badge> },
            {
              key: 'active',
              header: 'Status',
              render: (r) => (
                <Badge variant={r.active ? 'default' : 'secondary'}>{r.active ? 'Active' : 'Inactive'}</Badge>
              ),
            },
          ]}
          rowAction={(r) => (
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => toggle(r)}>
                {r.active ? 'Deactivate' : 'Activate'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => remove(r)}
              >
                Delete
              </Button>
            </div>
          )}
        />
      )}

      {/* Add single */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add pincode</DialogTitle>
          </DialogHeader>
          <form id="sa-form" onSubmit={addSingle} className="grid gap-4 py-2">
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
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={addForm.city}
                onChange={(e) => setAddForm({ ...addForm, city: e.target.value })}
                required
              />
            </div>
          </form>
          <DialogFooter>
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
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk import pincodes</DialogTitle>
            <DialogDescription>
              One per line: <code className="rounded bg-muted px-1 font-mono text-xs">pincode,area,city</code>. Existing
              pincodes will be upserted.
            </DialogDescription>
          </DialogHeader>
          <form id="bulk-form" onSubmit={addBulk}>
            <Textarea
              rows={12}
              className="font-mono text-xs"
              placeholder={`110001,Connaught Place,Delhi\n122001,DLF Phase 1-3,Gurgaon\n201301,Sector 62,Noida`}
              value={bulkCsv}
              onChange={(e) => setBulkCsv(e.target.value)}
              required
            />
            <p className="mt-2 text-xs text-muted-foreground">Max 500 rows per import.</p>
          </form>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setBulkOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="bulk-form" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? 'Importing…' : 'Import'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
