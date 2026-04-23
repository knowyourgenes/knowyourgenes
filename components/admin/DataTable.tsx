'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

const PAGE_SIZES = [5, 10, 20, 50, 100] as const;

export default function DataTable<T extends { id?: string }>({
  rows,
  columns,
  empty = 'No records.',
  rowAction,
  showSerial = true,
  paginate = true,
  defaultPageSize = 10,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  bulkActions,
}: {
  rows: T[];
  columns: Column<T>[];
  empty?: string;
  rowAction?: (row: T) => React.ReactNode;
  /** Auto-numbered S.No column as the first column. Default: true. */
  showSerial?: boolean;
  /** Pagination + page-size selector footer. Default: true. */
  paginate?: boolean;
  defaultPageSize?: (typeof PAGE_SIZES)[number];
  /** Adds a checkbox column + bulk-action bar. Default: false. */
  selectable?: boolean;
  /** Controlled selection (row ids). Only used when selectable=true. */
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Rendered in the bulk-action bar when selection > 0. */
  bulkActions?: React.ReactNode;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);

  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);

  const pageRows = useMemo(() => {
    if (!paginate) return rows;
    const start = (currentPage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, currentPage, pageSize, paginate]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectablePageRows = pageRows.filter((r) => r.id !== undefined);
  const allOnPageSelected =
    selectablePageRows.length > 0 &&
    selectablePageRows.every((r) => selectedSet.has(r.id as string));
  const someOnPageSelected =
    selectablePageRows.some((r) => selectedSet.has(r.id as string)) && !allOnPageSelected;

  function toggleRow(id: string) {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange?.([...next]);
  }

  function toggleAllOnPage() {
    const next = new Set(selectedSet);
    if (allOnPageSelected) {
      selectablePageRows.forEach((r) => next.delete(r.id as string));
    } else {
      selectablePageRows.forEach((r) => next.add(r.id as string));
    }
    onSelectionChange?.([...next]);
  }

  function clearSelection() {
    onSelectionChange?.([]);
  }

  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);
  const colSpan =
    columns.length + (showSerial ? 1 : 0) + (selectable ? 1 : 0) + (rowAction ? 1 : 0);

  function go(next: number) {
    setPage(Math.min(Math.max(1, next), pageCount));
  }

  const selectedCount = selectedIds.length;

  return (
    <div className="space-y-3">
      {selectable && selectedCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">{selectedCount} selected</span>
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              Clear
            </Button>
          </div>
          {bulkActions && <div className="flex items-center gap-2">{bulkActions}</div>}
        </div>
      )}

      <div className="rounded border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {selectable && (
                <TableHead className="w-10 text-center">
                  <Checkbox
                    checked={allOnPageSelected}
                    indeterminate={someOnPageSelected}
                    onCheckedChange={() => toggleAllOnPage()}
                    aria-label="Select all on page"
                    disabled={selectablePageRows.length === 0}
                  />
                </TableHead>
              )}
              {showSerial && <TableHead className="w-12 text-center">S.No</TableHead>}
              {columns.map((c) => (
                <TableHead key={c.key} className={c.className}>
                  {c.header}
                </TableHead>
              ))}
              {rowAction && <TableHead className="w-[1%] text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="h-32 text-center text-sm text-muted-foreground">
                  {empty}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row, i) => {
                const rowId = row.id as string | undefined;
                const isSelected = rowId !== undefined && selectedSet.has(rowId);
                return (
                  <TableRow
                    key={rowId ?? i}
                    data-state={isSelected ? 'selected' : undefined}
                    className={isSelected ? 'bg-primary/5 hover:bg-primary/10' : undefined}
                  >
                    {selectable && (
                      <TableCell className="text-center">
                        {rowId !== undefined && (
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleRow(rowId)}
                            aria-label="Select row"
                          />
                        )}
                      </TableCell>
                    )}
                    {showSerial && (
                      <TableCell className="text-center font-mono text-xs text-muted-foreground">
                        {(currentPage - 1) * pageSize + i + 1}
                      </TableCell>
                    )}
                    {columns.map((c) => (
                      <TableCell key={c.key} className={c.className}>
                        {c.render ? c.render(row) : ((row as Record<string, unknown>)[c.key] as React.ReactNode)}
                      </TableCell>
                    ))}
                    {rowAction && <TableCell className="text-right">{rowAction(row)}</TableCell>}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {paginate && (
        <div className="flex flex-col-reverse items-start justify-between gap-3 px-1 sm:flex-row sm:items-center">
          <div className="text-xs text-muted-foreground">
            {total === 0 ? 'No records' : `Showing ${from}–${to} of ${total}`}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Rows per page</span>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => {
                  if (!v) return;
                  setPageSize(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[72px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZES.map((s) => (
                    <SelectItem key={s} value={String(s)}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-xs text-muted-foreground">
              Page {currentPage} of {pageCount}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => go(1)}
                disabled={currentPage === 1}
                aria-label="First page"
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => go(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => go(currentPage + 1)}
                disabled={currentPage === pageCount}
                aria-label="Next page"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => go(pageCount)}
                disabled={currentPage === pageCount}
                aria-label="Last page"
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
