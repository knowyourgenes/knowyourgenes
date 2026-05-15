'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ServiceArea } from '@prisma/client';
import { toast } from 'sonner';
import {
  Plus,
  Upload,
  Loader2,
  Power,
  PowerOff,
  Trash2,
  MapPin,
  Search,
  CheckCircle2,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  X,
  ArrowUpDown,
} from 'lucide-react';

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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import * as cache from '@/lib/client-cache';

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

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

// Cache namespace keys (prefix-grouped so the Refresh button can wipe by prefix).
const CK = {
  stats: 'sa:stats',
  tree: 'sa:tree',
  // Per-(state, district) area list
  areas: (state: string, district: string) => `sa:areas:${state}|${district}`,
  // Flat list cache keyed by filter hash
  list: (hash: string) => `sa:list:${hash}`,
  prefixAll: 'sa:',
  prefixAreas: 'sa:areas:',
  prefixList: 'sa:list:',
} as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Stats = {
  total: number;
  active: number;
  uniquePincodes: number;
  activePincodes: number;
  states: number;
  districts: number;
};
type ActiveFilter = 'all' | 'active' | 'inactive';
type RegionStatus = 'all' | 'fully-active' | 'partial' | 'inactive';
type RegionSort = 'name' | 'most-areas' | 'most-active' | 'pct-active';
type ListSort = 'state' | 'pincode' | 'area';

type DistrictNode = { district: string; total: number; active: number };
type StateNode = { state: string; total: number; active: number; districts: DistrictNode[] };
type AreaRow = { id: string; pincode: string; area: string; active: boolean };

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminServiceAreaPage() {
  // Shared
  const [stats, setStats] = useState<Stats | null>(null);
  const [tab, setTab] = useState<'region' | 'list'>('region');
  // Single "refreshing" indicator surfaced in the header so the user sees that
  // a background revalidation is happening — without losing the cached data
  // already on screen.
  const [refreshing, setRefreshing] = useState(false);

  // Tree
  const [tree, setTree] = useState<StateNode[]>([]);
  const [treeLoading, setTreeLoading] = useState(true);
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());
  const [expandedDistricts, setExpandedDistricts] = useState<Set<string>>(new Set());
  const [areasByDistrict, setAreasByDistrict] = useState<Record<string, AreaRow[]>>({});
  const [areasLoading, setAreasLoading] = useState<Set<string>>(new Set());
  const [areaBusyId, setAreaBusyId] = useState<string | null>(null);
  const [treeBusyKey, setTreeBusyKey] = useState<string | null>(null);
  // Filters
  const [treeQ, setTreeQ] = useState('');
  const [debouncedTreeQ, setDebouncedTreeQ] = useState('');
  const [regionStatus, setRegionStatus] = useState<RegionStatus>('all');
  const [regionSort, setRegionSort] = useState<RegionSort>('name');

  // Flat list
  const [items, setItems] = useState<ServiceArea[]>([]);
  const [total, setTotal] = useState(0);
  const [listLoading, setListLoading] = useState(true);
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [districtFilter, setDistrictFilter] = useState<string>('ALL');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('active');
  const [listSort, setListSort] = useState<ListSort>('state');
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
  const [confirmRegionToggle, setConfirmRegionToggle] = useState<{
    state: string;
    district?: string;
    total: number;
    active: boolean;
  } | null>(null);

  // In-flight request dedupe — keyed by a logical request name. Prevents the
  // same fetch firing twice when the user mashes a button or filters change
  // back and forth quickly.
  const inflight = useRef<Map<string, Promise<unknown>>>(new Map());

  // -------------------------------------------------------------------------
  // Cache-aware loaders (stale-while-revalidate)
  // -------------------------------------------------------------------------

  const loadStats = useCallback(async (opts: { force?: boolean } = {}) => {
    const cached = !opts.force ? cache.read<Stats>(CK.stats) : null;
    if (cached) setStats(cached);
    if (!opts.force && cached && !cache.isStale(CK.stats)) return;

    const key = `stats|${opts.force ? 'force' : 'normal'}`;
    if (inflight.current.has(key)) return inflight.current.get(key);
    const p = (async () => {
      const res = await fetch('/api/admin/service-area/stats');
      const json = await res.json();
      if (json.ok) {
        cache.write(CK.stats, json.data);
        setStats(json.data);
      }
    })();
    inflight.current.set(key, p);
    try {
      await p;
    } finally {
      inflight.current.delete(key);
    }
  }, []);

  const loadTree = useCallback(async (opts: { force?: boolean } = {}) => {
    const cached = !opts.force ? cache.read<StateNode[]>(CK.tree) : null;
    if (cached) {
      setTree(cached);
      setTreeLoading(false);
    } else {
      setTreeLoading(true);
    }
    if (!opts.force && cached && !cache.isStale(CK.tree)) return;

    const key = `tree|${opts.force ? 'force' : 'normal'}`;
    if (inflight.current.has(key)) return inflight.current.get(key);
    const p = (async () => {
      const res = await fetch('/api/admin/service-area/tree');
      const json = await res.json();
      if (json.ok) {
        cache.write(CK.tree, json.data.states);
        setTree(json.data.states);
      } else {
        toast.error(json.error ?? 'Failed to load region tree');
      }
      setTreeLoading(false);
    })();
    inflight.current.set(key, p);
    try {
      await p;
    } finally {
      inflight.current.delete(key);
    }
  }, []);

  const loadAreas = useCallback(async (state: string, district: string, opts: { force?: boolean } = {}) => {
    const ck = CK.areas(state, district);
    const cached = !opts.force ? cache.read<AreaRow[]>(ck) : null;
    if (cached) {
      setAreasByDistrict((prev) => ({ ...prev, [`${state}|${district}`]: cached }));
    }
    if (!opts.force && cached && !cache.isStale(ck)) return;

    const dedupeKey = `areas|${state}|${district}`;
    if (inflight.current.has(dedupeKey)) return inflight.current.get(dedupeKey);
    if (!cached) {
      setAreasLoading((prev) => new Set([...prev, `${state}|${district}`]));
    }
    const p = (async () => {
      const url = new URL('/api/admin/service-area/tree/areas', window.location.origin);
      url.searchParams.set('state', state);
      url.searchParams.set('district', district);
      const res = await fetch(url.toString());
      const json = await res.json();
      if (json.ok) {
        cache.write(ck, json.data.areas);
        setAreasByDistrict((prev) => ({ ...prev, [`${state}|${district}`]: json.data.areas }));
      } else {
        toast.error(json.error ?? 'Failed to load areas');
      }
    })();
    inflight.current.set(dedupeKey, p);
    try {
      await p;
    } finally {
      inflight.current.delete(dedupeKey);
      setAreasLoading((prev) => {
        const n = new Set(prev);
        n.delete(`${state}|${district}`);
        return n;
      });
    }
  }, []);

  // -------------------------------------------------------------------------
  // Hard refresh — wipes the cache namespace and re-fetches from scratch
  // -------------------------------------------------------------------------

  const hardRefresh = useCallback(async () => {
    setRefreshing(true);
    cache.clearPrefix(CK.prefixAll);
    // Drop the in-memory areas state too so re-expand re-fetches.
    setAreasByDistrict({});
    try {
      await Promise.all([loadStats({ force: true }), loadTree({ force: true })]);
      // Re-fetch any currently-expanded districts in the background.
      const expandedKeys = [...expandedDistricts];
      await Promise.all(
        expandedKeys.map((k) => {
          const [s, d] = k.split('|');
          return loadAreas(s, d, { force: true });
        })
      );
      if (tab === 'list') await loadRows({ force: true });
      toast.success('Refreshed');
    } finally {
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedDistricts, tab, loadStats, loadTree, loadAreas]);

  // -------------------------------------------------------------------------
  // List-tab loader (same SWR shape, keyed by filter hash)
  // -------------------------------------------------------------------------

  // Debounce text searches
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQ(q.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedTreeQ(treeQ.trim()), 200);
    return () => clearTimeout(t);
  }, [treeQ]);

  // Resetting page when filters change
  useEffect(() => {
    setPage(1);
  }, [stateFilter, districtFilter, activeFilter, listSort]);

  // If state filter changes, drop the district filter (districts depend on state).
  useEffect(() => {
    setDistrictFilter('ALL');
  }, [stateFilter]);

  const listFilterHash = useMemo(() => {
    return [debouncedQ, stateFilter, districtFilter, activeFilter, listSort, page, pageSize].join('|');
  }, [debouncedQ, stateFilter, districtFilter, activeFilter, listSort, page, pageSize]);

  const loadRows = useCallback(
    async (opts: { force?: boolean } = {}) => {
      const ck = CK.list(listFilterHash);
      const cached = !opts.force ? cache.read<{ items: ServiceArea[]; total: number }>(ck) : null;
      if (cached) {
        setItems(cached.items);
        setTotal(cached.total);
        setListLoading(false);
      } else {
        setListLoading(true);
      }
      if (!opts.force && cached && !cache.isStale(ck)) return;

      const dedupeKey = `list|${listFilterHash}`;
      if (inflight.current.has(dedupeKey)) return inflight.current.get(dedupeKey);
      const p = (async () => {
        const url = new URL('/api/admin/service-area', window.location.origin);
        if (debouncedQ) url.searchParams.set('q', debouncedQ);
        if (stateFilter !== 'ALL') url.searchParams.set('state', stateFilter);
        if (districtFilter !== 'ALL') url.searchParams.set('district', districtFilter);
        if (activeFilter !== 'all') url.searchParams.set('active', activeFilter === 'active' ? 'true' : 'false');
        url.searchParams.set('skip', String((page - 1) * pageSize));
        url.searchParams.set('take', String(pageSize));

        const res = await fetch(url.toString());
        const json = await res.json();
        if (json.ok) {
          // Client-side sort only — server already sorts by state/district/pincode.
          // We apply a stable sort to honour the user's choice.
          const sortedItems = sortListItems(json.data.items as ServiceArea[], listSort);
          const payload = { items: sortedItems, total: json.data.total };
          cache.write(ck, payload);
          setItems(payload.items);
          setTotal(payload.total);
        } else {
          toast.error(json.error ?? 'Failed to load pincodes');
        }
        setListLoading(false);
      })();
      inflight.current.set(dedupeKey, p);
      try {
        await p;
      } finally {
        inflight.current.delete(dedupeKey);
      }
    },
    [listFilterHash, debouncedQ, stateFilter, districtFilter, activeFilter, listSort, page, pageSize]
  );

  // -------------------------------------------------------------------------
  // Initial + reactive loaders
  // -------------------------------------------------------------------------

  useEffect(() => {
    loadStats();
    loadTree();
  }, [loadStats, loadTree]);

  useEffect(() => {
    if (tab === 'list') loadRows();
  }, [tab, loadRows]);

  // -------------------------------------------------------------------------
  // Invalidation helpers (run after every mutation)
  // -------------------------------------------------------------------------

  /** Drop everything — used after broad changes (state/full-import). */
  function invalidateAll() {
    cache.clearPrefix(CK.prefixAll);
  }

  /** Drop tree + stats + list pages + (optionally) one district's area cache. */
  function invalidateAfterRegionMutation(state?: string, district?: string) {
    cache.remove(CK.tree);
    cache.remove(CK.stats);
    cache.clearPrefix(CK.prefixList);
    if (state && district) {
      cache.remove(CK.areas(state, district));
    } else if (state) {
      cache.clearPrefix(`${CK.prefixAreas}${state}|`);
    } else {
      cache.clearPrefix(CK.prefixAreas);
    }
  }

  // -------------------------------------------------------------------------
  // Mutations
  // -------------------------------------------------------------------------

  async function toggleRegion(opts: { state: string; district?: string; active: boolean }) {
    const key = `${opts.state}|${opts.district ?? ''}`;
    setTreeBusyKey(key);
    const res = await fetch('/api/admin/service-area/bulk-toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(opts),
    });
    const json = await res.json();
    setTreeBusyKey(null);
    if (!json.ok) return toast.error(json.error ?? 'Failed');

    // Optimistic: bump the local tree counts so the UI updates instantly.
    setTree((prev) =>
      prev.map((s) => {
        if (s.state !== opts.state) return s;
        if (opts.district) {
          return {
            ...s,
            districts: s.districts.map((d) =>
              d.district === opts.district ? { ...d, active: opts.active ? d.total : 0 } : d
            ),
            active: s.districts.reduce(
              (sum, d) => sum + (d.district === opts.district ? (opts.active ? d.total : 0) : d.active),
              0
            ),
          };
        }
        // Whole state
        return {
          ...s,
          active: opts.active ? s.total : 0,
          districts: s.districts.map((d) => ({ ...d, active: opts.active ? d.total : 0 })),
        };
      })
    );
    // Optimistic: flip cached area rows under the affected region.
    setAreasByDistrict((prev) => {
      const next: Record<string, AreaRow[]> = {};
      for (const [k, areas] of Object.entries(prev)) {
        const [s, d] = k.split('|');
        if (s !== opts.state) {
          next[k] = areas;
          continue;
        }
        if (opts.district && d !== opts.district) {
          next[k] = areas;
          continue;
        }
        next[k] = areas.map((a) => ({ ...a, active: opts.active }));
      }
      return next;
    });

    invalidateAfterRegionMutation(opts.state, opts.district);
    toast.success(
      `${opts.active ? 'Activated' : 'Deactivated'} ${json.data.updated.toLocaleString('en-IN')} ${
        json.data.updated === 1 ? 'area' : 'areas'
      } in ${opts.district ?? opts.state}`
    );
    // Background revalidate stats so the top cards stay accurate (cheap query).
    loadStats({ force: true });
  }

  async function toggleAreaRow(area: AreaRow, state: string, district: string) {
    setAreaBusyId(area.id);
    // Optimistic local flip before the API call lands.
    const key = `${state}|${district}`;
    const delta = area.active ? -1 : 1;
    setAreasByDistrict((prev) => ({
      ...prev,
      [key]: (prev[key] ?? []).map((a) => (a.id === area.id ? { ...a, active: !area.active } : a)),
    }));
    setTree((prev) =>
      prev.map((s) =>
        s.state !== state
          ? s
          : {
              ...s,
              active: s.active + delta,
              districts: s.districts.map((d) => (d.district === district ? { ...d, active: d.active + delta } : d)),
            }
      )
    );

    const res = await fetch(`/api/admin/service-area/${area.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !area.active }),
    });
    const json = await res.json();
    setAreaBusyId(null);
    if (!json.ok) {
      // Roll back optimistic update
      setAreasByDistrict((prev) => ({
        ...prev,
        [key]: (prev[key] ?? []).map((a) => (a.id === area.id ? { ...a, active: area.active } : a)),
      }));
      setTree((prev) =>
        prev.map((s) =>
          s.state !== state
            ? s
            : {
                ...s,
                active: s.active - delta,
                districts: s.districts.map((d) => (d.district === district ? { ...d, active: d.active - delta } : d)),
              }
        )
      );
      return toast.error(json.error ?? 'Failed');
    }
    invalidateAfterRegionMutation(state, district);
    toast.success(`${area.pincode} (${area.area}) ${area.active ? 'deactivated' : 'activated'}`);
    loadStats({ force: true });
  }

  async function toggleOne(pin: ServiceArea) {
    // Optimistic flip in the flat-list view
    setItems((prev) => prev.map((p) => (p.id === pin.id ? { ...p, active: !pin.active } : p)));
    const res = await fetch(`/api/admin/service-area/${pin.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !pin.active }),
    });
    const json = await res.json();
    if (!json.ok) {
      setItems((prev) => prev.map((p) => (p.id === pin.id ? { ...p, active: pin.active } : p)));
      return toast.error(json.error ?? 'Failed');
    }
    toast.success(`${pin.pincode} (${pin.area}) ${pin.active ? 'deactivated' : 'activated'}`);
    invalidateAfterRegionMutation(pin.state, pin.district);
    loadStats({ force: true });
    loadTree({ force: true });
  }

  async function bulkToggle(active: boolean) {
    if (selectedIds.length === 0) return;
    // Optimistic flip
    const sel = new Set(selectedIds);
    setItems((prev) => prev.map((p) => (sel.has(p.id) ? { ...p, active } : p)));
    const res = await fetch('/api/admin/service-area/bulk-toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds, active }),
    });
    const json = await res.json();
    if (!json.ok) {
      // Roll back
      setItems((prev) => prev.map((p) => (sel.has(p.id) ? { ...p, active: !active } : p)));
      return toast.error(json.error ?? 'Failed');
    }
    toast.success(`${active ? 'Activated' : 'Deactivated'} ${json.data.updated} rows`);
    setSelectedIds([]);
    invalidateAfterRegionMutation();
    loadStats({ force: true });
    loadTree({ force: true });
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
    invalidateAll();
    loadStats({ force: true });
    loadTree({ force: true });
    if (tab === 'list') loadRows({ force: true });
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
    invalidateAll();
    loadStats({ force: true });
    loadTree({ force: true });
    if (tab === 'list') loadRows({ force: true });
  }

  async function handleDeactivate(): Promise<void> {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/service-area/${deleteTarget.id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error ?? 'Deactivate failed');
      return;
    }
    toast.success('Row deactivated');
    setDeleteTarget(null);
    invalidateAfterRegionMutation(deleteTarget.state, deleteTarget.district);
    loadStats({ force: true });
    loadTree({ force: true });
    if (tab === 'list') loadRows({ force: true });
  }

  async function handleBulkDeactivate() {
    const res = await fetch('/api/admin/service-area/bulk-toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds, active: false }),
    });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error ?? 'Failed to deactivate');
    } else {
      toast.success(`Deactivated ${json.data.updated} ${json.data.updated === 1 ? 'row' : 'rows'}`);
    }
    setBulkDeleteOpen(false);
    setSelectedIds([]);
    invalidateAfterRegionMutation();
    loadStats({ force: true });
    loadTree({ force: true });
    if (tab === 'list') loadRows({ force: true });
  }

  // -------------------------------------------------------------------------
  // Filtering + derived data
  // -------------------------------------------------------------------------

  const filteredTree = useMemo(() => {
    const needle = debouncedTreeQ.toLowerCase();
    return tree
      .map((s) => {
        // Apply district-level status filter inside each state
        const districts = s.districts.filter((d) => matchesRegionStatus(d, regionStatus));
        // Apply search to state OR district name
        const stateMatch = !needle || s.state.toLowerCase().includes(needle);
        const matchedDistricts = needle
          ? districts.filter((d) => d.district.toLowerCase().includes(needle))
          : districts;
        const finalDistricts = stateMatch ? districts : matchedDistricts;
        if (finalDistricts.length === 0 && !stateMatch) return null;
        if (!matchesRegionStatus(s, regionStatus) && regionStatus !== 'all') {
          // Even if the state-level rolled-up status doesn't match, keep showing
          // matched districts so the user can drill into a "partial" state and
          // still see only its active districts when filter=active.
          if (finalDistricts.length === 0) return null;
        }
        return { ...s, districts: sortDistricts(finalDistricts, regionSort) };
      })
      .filter(Boolean)
      .sort((a, b) => sortStateNodes(a!, b!, regionSort)) as StateNode[];
  }, [tree, debouncedTreeQ, regionStatus, regionSort]);

  // Districts available in the current state filter — drives the list-tab
  // district dropdown.
  const districtOptionsForState = useMemo(() => {
    if (stateFilter === 'ALL') return [] as string[];
    const node = tree.find((s) => s.state === stateFilter);
    return node ? node.districts.map((d) => d.district) : [];
  }, [tree, stateFilter]);

  const rowsForTable = items;

  const noTreeData = (stats?.total ?? 0) === 0;
  const noListHint = noTreeData
    ? 'No pincodes in the database yet. Run `pnpm db:seed-pincodes` to load all India.'
    : 'No pincodes match these filters. Try clearing search or switching to "All".';

  const filtersActive =
    !!q || stateFilter !== 'ALL' || districtFilter !== 'ALL' || activeFilter !== 'active' || listSort !== 'state';

  const treeFiltersActive = !!treeQ || regionStatus !== 'all' || regionSort !== 'name';

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  function StateRow({ s }: { s: StateNode }) {
    const expanded = expandedStates.has(s.state);
    const allActive = s.total > 0 && s.active === s.total;
    const someActive = s.active > 0 && s.active < s.total;
    const pct = s.total > 0 ? Math.round((s.active / s.total) * 100) : 0;
    const busy = treeBusyKey === `${s.state}|`;
    const toggle = () => {
      const next = new Set(expandedStates);
      if (expanded) next.delete(s.state);
      else next.add(s.state);
      setExpandedStates(next);
    };
    return (
      <div className="rounded border bg-card">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <button
            type="button"
            className="flex flex-1 items-center gap-2 text-left"
            onClick={toggle}
            aria-expanded={expanded}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="font-medium">{s.state}</span>
            <span className="text-xs text-muted-foreground">{s.districts.length} districts</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground tabular-nums">
              <span
                className={allActive ? 'font-medium text-emerald-600' : someActive ? 'font-medium text-amber-600' : ''}
              >
                {s.active.toLocaleString('en-IN')}
              </span>
              {' / '}
              {s.total.toLocaleString('en-IN')} areas
              {someActive && <span className="ml-1 text-muted-foreground/70">({pct}%)</span>}
            </span>
            {someActive && !allActive && (
              <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
                Partial
              </Badge>
            )}
            <Switch
              checked={allActive}
              disabled={busy || s.total === 0}
              onCheckedChange={(target) => setConfirmRegionToggle({ state: s.state, total: s.total, active: target })}
              aria-label={`Toggle all pincodes in ${s.state}`}
            />
            {busy && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
        </div>
        {expanded && (
          <div className="divide-y border-t bg-muted/30">
            {s.districts.map((d) => {
              const dKey = `${s.state}|${d.district}`;
              const dActive = d.total > 0 && d.active === d.total;
              const dSome = d.active > 0 && d.active < d.total;
              const dPct = d.total > 0 ? Math.round((d.active / d.total) * 100) : 0;
              const dBusy = treeBusyKey === dKey;
              const dExpanded = expandedDistricts.has(dKey);
              const dLoadingAreas = areasLoading.has(dKey);
              const areas = areasByDistrict[dKey];
              return (
                <div key={dKey}>
                  <div className="flex items-center gap-3 px-3 py-2 pl-9">
                    <button
                      type="button"
                      className="flex flex-1 items-center gap-2 text-left"
                      onClick={() => {
                        const next = new Set(expandedDistricts);
                        if (dExpanded) next.delete(dKey);
                        else next.add(dKey);
                        setExpandedDistricts(next);
                        if (!dExpanded) loadAreas(s.state, d.district);
                      }}
                      aria-expanded={dExpanded}
                    >
                      {dExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      <span className="text-sm">
                        {d.district || <em className="text-muted-foreground">(no district)</em>}
                      </span>
                    </button>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      <span
                        className={dActive ? 'font-medium text-emerald-600' : dSome ? 'font-medium text-amber-600' : ''}
                      >
                        {d.active.toLocaleString('en-IN')}
                      </span>
                      {' / '}
                      {d.total.toLocaleString('en-IN')}
                      {dSome && <span className="ml-1 text-muted-foreground/70">({dPct}%)</span>}
                    </span>
                    {dSome && !dActive && (
                      <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
                        Partial
                      </Badge>
                    )}
                    <Switch
                      checked={dActive}
                      disabled={dBusy || d.total === 0}
                      onCheckedChange={(target) =>
                        setConfirmRegionToggle({
                          state: s.state,
                          district: d.district,
                          total: d.total,
                          active: target,
                        })
                      }
                      aria-label={`Toggle all pincodes in ${d.district}`}
                    />
                    {dBusy && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  </div>

                  {dExpanded && (
                    <div className="border-t bg-background/60">
                      {dLoadingAreas && !areas ? (
                        <div className="space-y-1 px-3 py-3 pl-16">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-5 animate-pulse rounded bg-muted/60" />
                          ))}
                        </div>
                      ) : !areas || areas.length === 0 ? (
                        <div className="px-3 py-3 pl-16 text-xs text-muted-foreground">No areas in this district.</div>
                      ) : (
                        <div className="divide-y">
                          {areas.map((a) => (
                            <div key={a.id} className="flex items-center gap-3 px-3 py-1.5 pl-16">
                              <span className="w-16 font-mono text-xs tabular-nums text-muted-foreground">
                                {a.pincode}
                              </span>
                              <span className="flex-1 text-sm">{a.area}</span>
                              {a.active ? (
                                <Badge className="gap-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                  <CheckCircle2 className="h-3 w-3" /> Active
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Inactive</Badge>
                              )}
                              <Switch
                                checked={a.active}
                                disabled={areaBusyId === a.id}
                                onCheckedChange={() => toggleAreaRow(a, s.state, d.district)}
                                aria-label={`Toggle ${a.pincode} ${a.area}`}
                              />
                              {areaBusyId === a.id && (
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Service area"
        subtitle="Only pincodes you activate here can place kit orders. Toggle a state, a district, or a single pincode."
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
            <CardDescription>Pincodes accepting orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-emerald-600">
              {stats?.activePincodes.toLocaleString('en-IN') ?? '—'}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              of {stats?.uniquePincodes.toLocaleString('en-IN') ?? '—'} unique pincodes in DB
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Area rows active</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats?.active.toLocaleString('en-IN') ?? '—'}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              of {stats?.total.toLocaleString('en-IN') ?? '—'} total (one per locality)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>States covered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats?.states ?? '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Districts covered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stats?.districts ?? '—'}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as 'region' | 'list')}>
        <TabsList>
          <TabsTrigger value="region">Browse by region</TabsTrigger>
          <TabsTrigger value="list">All pincodes</TabsTrigger>
        </TabsList>

        {/* TAB 1 — region tree */}
        <TabsContent value="region" className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-60 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={treeQ}
                onChange={(e) => setTreeQ(e.target.value)}
                placeholder="Search state or district…"
                className="pl-9"
              />
            </div>
            <Select value={regionStatus} onValueChange={(v) => setRegionStatus((v as RegionStatus) ?? 'all')}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="fully-active">Fully active</SelectItem>
                <SelectItem value="partial">Partially active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionSort} onValueChange={(v) => setRegionSort((v as RegionSort) ?? 'name')}>
              <SelectTrigger className="w-44">
                <ArrowUpDown className="mr-1 h-3.5 w-3.5" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Alphabetical</SelectItem>
                <SelectItem value="most-areas">Most areas first</SelectItem>
                <SelectItem value="most-active">Most active first</SelectItem>
                <SelectItem value="pct-active">% active (high → low)</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedStates(new Set(filteredTree.map((s) => s.state)))}
              disabled={filteredTree.length === 0}
            >
              Expand all
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setExpandedStates(new Set());
                setExpandedDistricts(new Set());
              }}
              disabled={expandedStates.size === 0 && expandedDistricts.size === 0}
            >
              Collapse all
            </Button>
            {treeFiltersActive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTreeQ('');
                  setRegionStatus('all');
                  setRegionSort('name');
                }}
              >
                <X className="h-3.5 w-3.5" />
                Clear filters
              </Button>
            )}
          </div>

          {treeLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded border bg-card" />
              ))}
            </div>
          ) : noTreeData ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                No pincodes in the database yet.
                <div className="mt-2 font-mono text-xs">pnpm db:seed-pincodes</div>
              </CardContent>
            </Card>
          ) : filteredTree.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                No state or district matches the current filters.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredTree.map((s) => (
                <StateRow key={s.state} s={s} />
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Showing {filteredTree.length.toLocaleString('en-IN')} of {tree.length.toLocaleString('en-IN')} states.
          </p>
        </TabsContent>

        {/* TAB 2 — flat pincode list */}
        <TabsContent value="list" className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
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
              <SelectTrigger className="w-44">
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
            <Select
              value={districtFilter}
              onValueChange={(v) => setDistrictFilter(v ?? 'ALL')}
              disabled={stateFilter === 'ALL' || districtOptionsForState.length === 0}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All districts</SelectItem>
                {districtOptionsForState.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={activeFilter} onValueChange={(v) => setActiveFilter((v as ActiveFilter) ?? 'active')}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active only</SelectItem>
                <SelectItem value="inactive">Inactive only</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <Select value={listSort} onValueChange={(v) => setListSort((v as ListSort) ?? 'state')}>
              <SelectTrigger className="w-44">
                <ArrowUpDown className="mr-1 h-3.5 w-3.5" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="state">State → District → Pincode</SelectItem>
                <SelectItem value="pincode">Pincode (asc)</SelectItem>
                <SelectItem value="area">Area name (A–Z)</SelectItem>
              </SelectContent>
            </Select>
            {filtersActive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQ('');
                  setStateFilter('ALL');
                  setDistrictFilter('ALL');
                  setActiveFilter('active');
                  setListSort('state');
                }}
              >
                <X className="h-3.5 w-3.5" />
                Clear filters
              </Button>
            )}
          </div>

          {listLoading && items.length === 0 ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-muted/50" />
              ))}
            </div>
          ) : (
            <DataTable
              rows={rowsForTable}
              empty={noListHint}
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
                { key: 'district', header: 'District', render: (r) => r.district || '—' },
                { key: 'state', header: 'State', render: (r) => <Badge variant="outline">{r.state || '—'}</Badge> },
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
                  <Switch
                    checked={r.active}
                    onCheckedChange={() => toggleOne(r)}
                    aria-label={r.active ? 'Deactivate' : 'Activate'}
                  />
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
        </TabsContent>
      </Tabs>

      {/* Region toggle confirm */}
      <AlertDialog open={!!confirmRegionToggle} onOpenChange={(o) => !o && setConfirmRegionToggle(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmRegionToggle?.active ? 'Activate' : 'Deactivate'}{' '}
              {confirmRegionToggle?.district ?? confirmRegionToggle?.state}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will set <strong>{confirmRegionToggle?.total.toLocaleString('en-IN')}</strong>{' '}
              {confirmRegionToggle?.total === 1 ? 'area' : 'areas'} in{' '}
              <strong>{confirmRegionToggle?.district ?? confirmRegionToggle?.state}</strong> to{' '}
              <strong>{confirmRegionToggle?.active ? 'Active' : 'Inactive'}</strong>.
              {confirmRegionToggle?.active
                ? ' Customers in these areas will be able to order kits.'
                : ' Customers in these areas will no longer be able to order.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmRegionToggle) {
                  toggleRegion({
                    state: confirmRegionToggle.state,
                    district: confirmRegionToggle.district,
                    active: confirmRegionToggle.active,
                  });
                  setConfirmRegionToggle(null);
                }
              }}
            >
              Yes, {confirmRegionToggle?.active ? 'activate' : 'deactivate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={deleteTarget ? `Deactivate ${deleteTarget.pincode} — ${deleteTarget.area}?` : 'Deactivate'}
        itemLabel="This area row"
        onConfirm={handleDeactivate}
      />

      <DeleteConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Deactivate ${selectedIds.length} ${selectedIds.length === 1 ? 'row' : 'rows'}?`}
        itemLabel={selectedIds.length === 1 ? 'This area row' : `These ${selectedIds.length} area rows`}
        onConfirm={handleBulkDeactivate}
      />

      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" />
        Runtime location lookup uses MapMyIndia via <code>/api/location/resolve</code>.
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

function matchesRegionStatus(node: { total: number; active: number }, status: RegionStatus): boolean {
  if (status === 'all') return true;
  if (node.total === 0) return status === 'inactive';
  if (status === 'fully-active') return node.active === node.total;
  if (status === 'inactive') return node.active === 0;
  if (status === 'partial') return node.active > 0 && node.active < node.total;
  return true;
}

function sortDistricts(districts: DistrictNode[], sort: RegionSort): DistrictNode[] {
  const copy = [...districts];
  switch (sort) {
    case 'name':
      return copy.sort((a, b) => a.district.localeCompare(b.district));
    case 'most-areas':
      return copy.sort((a, b) => b.total - a.total || a.district.localeCompare(b.district));
    case 'most-active':
      return copy.sort((a, b) => b.active - a.active || a.district.localeCompare(b.district));
    case 'pct-active':
      return copy.sort((a, b) => pct(b) - pct(a) || a.district.localeCompare(b.district));
  }
}

function sortStateNodes(a: StateNode, b: StateNode, sort: RegionSort): number {
  switch (sort) {
    case 'name':
      return a.state.localeCompare(b.state);
    case 'most-areas':
      return b.total - a.total || a.state.localeCompare(b.state);
    case 'most-active':
      return b.active - a.active || a.state.localeCompare(b.state);
    case 'pct-active':
      return pct(b) - pct(a) || a.state.localeCompare(b.state);
  }
}

function pct(n: { total: number; active: number }): number {
  return n.total === 0 ? 0 : n.active / n.total;
}

function sortListItems(items: ServiceArea[], sort: ListSort): ServiceArea[] {
  const copy = [...items];
  switch (sort) {
    case 'state':
      return copy; // server already sorts state → district → pincode
    case 'pincode':
      return copy.sort((a, b) => a.pincode.localeCompare(b.pincode));
    case 'area':
      return copy.sort((a, b) => a.area.localeCompare(b.area));
  }
}
