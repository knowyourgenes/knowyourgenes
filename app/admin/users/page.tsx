'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Search, Power, PowerOff } from 'lucide-react';

import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Row = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  createdAt: string;
  deletedAt: string | null;
  _count: { orders: number };
};

const ROLES = ['USER', 'AGENT', 'COUNSELLOR', 'PARTNER', 'ADMIN'];
type ActiveFilter = 'all' | 'active' | 'inactive';

export default function AdminUsersPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState('');
  const [role, setRole] = useState('ALL');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<Row | null>(null);

  async function load() {
    setLoading(true);
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (role && role !== 'ALL') p.set('role', role);
    const res = await fetch(`/api/admin/users?${p.toString()}`);
    const json = await res.json();
    if (json.ok) setRows(json.data.items);
    else toast.error(json.error ?? 'Failed to load users');
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function changeRole(id: string, newRole: string) {
    const res = await fetch(`/api/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error ?? 'Update failed');
      return;
    }
    toast.success('Role updated');
    load();
  }

  async function toggleActive(u: Row, active: boolean) {
    const res = await fetch(`/api/admin/users/${u.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error ?? 'Update failed');
      return;
    }
    toast.success(active ? 'User reactivated' : 'User deactivated');
    load();
  }

  async function handleDeactivate() {
    if (!target) return;
    await toggleActive(target, false);
    setTarget(null);
  }

  const visibleRows =
    activeFilter === 'all'
      ? rows
      : activeFilter === 'active'
        ? rows.filter((r) => r.deletedAt === null)
        : rows.filter((r) => r.deletedAt !== null);

  return (
    <>
      <PageHeader
        title="Users"
        subtitle="Every account. Change roles inline. Deactivate to block sign-in - data is preserved."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search name / email / phone"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select value={role} onValueChange={(v) => setRole(v ?? 'ALL')}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All roles</SelectItem>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={activeFilter} onValueChange={(v) => setActiveFilter((v as ActiveFilter) ?? 'all')}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active only</SelectItem>
            <SelectItem value="inactive">Deactivated only</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={load}>
          Apply
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (
        <DataTable
          rows={visibleRows}
          columns={[
            {
              key: 'name',
              header: 'Name',
              render: (r) => (
                <div>
                  <div className="font-medium">{r.name ?? '-'}</div>
                  <div className="text-xs text-muted-foreground">{r.email}</div>
                </div>
              ),
            },
            { key: 'phone', header: 'Phone' },
            {
              key: 'role',
              header: 'Role',
              render: (r) => (
                <Select value={r.role} onValueChange={(v) => v && changeRole(r.id, v)} disabled={r.deletedAt !== null}>
                  <SelectTrigger className="h-8 w-35">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ),
            },
            { key: 'orders', header: 'Orders', render: (r) => <Badge variant="secondary">{r._count.orders}</Badge> },
            {
              key: 'status',
              header: 'Status',
              render: (r) =>
                r.deletedAt === null ? (
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Active</Badge>
                ) : (
                  <Badge variant="secondary">Deactivated</Badge>
                ),
            },
            {
              key: 'created',
              header: 'Joined',
              render: (r) => (
                <span className="text-sm text-muted-foreground">
                  {new Date(r.createdAt).toLocaleDateString('en-IN')}
                </span>
              ),
            },
          ]}
          rowAction={(r) =>
            r.deletedAt === null ? (
              <div className="flex justify-end">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setTarget(r)}
                  aria-label="Deactivate"
                  title="Deactivate"
                >
                  <PowerOff className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="text-emerald-600 hover:text-emerald-700"
                  onClick={() => toggleActive(r, true)}
                  aria-label="Reactivate"
                  title="Reactivate"
                >
                  <Power className="h-3.5 w-3.5" />
                </Button>
              </div>
            )
          }
          empty="No users match these filters."
        />
      )}

      <DeleteConfirmDialog
        open={!!target}
        onOpenChange={(o) => !o && setTarget(null)}
        title={target ? `Deactivate ${target.name ?? target.email}?` : 'Deactivate'}
        itemLabel="This user"
        description={
          target
            ? `${target.name ?? target.email} will no longer be able to sign in. The account and all history (orders, reports, consultations) are preserved. You can reactivate any time.`
            : undefined
        }
        onConfirm={handleDeactivate}
      />
    </>
  );
}
