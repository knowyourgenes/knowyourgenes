'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Search } from 'lucide-react';

import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
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
  _count: { orders: number };
};

const ROLES = ['USER', 'AGENT', 'COUNSELLOR', 'PARTNER', 'ADMIN'];

export default function AdminUsersPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState('');
  const [role, setRole] = useState('ALL');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (role && role !== 'ALL') p.set('role', role);
    const res = await fetch(`/api/admin/users?${p.toString()}`);
    const json = await res.json();
    if (json.ok) setRows(json.data.items);
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
    if (!json.ok) return toast.error(json.error ?? 'Update failed');
    toast.success('Role updated');
    load();
  }

  return (
    <>
      <PageHeader title="Users" subtitle="Every account. Change roles inline." />

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
          <SelectTrigger className="w-[180px]">
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
          rows={rows}
          columns={[
            {
              key: 'name',
              header: 'Name',
              render: (r) => (
                <div>
                  <div className="font-medium">{r.name ?? '—'}</div>
                  <div className="text-xs text-muted-foreground">{r.email}</div>
                </div>
              ),
            },
            { key: 'phone', header: 'Phone' },
            {
              key: 'role',
              header: 'Role',
              render: (r) => (
                <Select value={r.role} onValueChange={(v) => v && changeRole(r.id, v)}>
                  <SelectTrigger className="h-8 w-[140px]">
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
              key: 'created',
              header: 'Joined',
              render: (r) => (
                <span className="text-sm text-muted-foreground">
                  {new Date(r.createdAt).toLocaleDateString('en-IN')}
                </span>
              ),
            },
          ]}
          empty="No users match these filters."
        />
      )}
    </>
  );
}
