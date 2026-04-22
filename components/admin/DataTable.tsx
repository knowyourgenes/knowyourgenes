import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

export default function DataTable<T extends { id?: string }>({
  rows,
  columns,
  empty = 'No records.',
  rowAction,
}: {
  rows: T[];
  columns: Column<T>[];
  empty?: string;
  rowAction?: (row: T) => React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {columns.map((c) => (
              <TableHead key={c.key} className={c.className}>
                {c.header}
              </TableHead>
            ))}
            {rowAction && <TableHead className="w-[1%] text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (rowAction ? 1 : 0)}
                className="h-32 text-center text-sm text-muted-foreground"
              >
                {empty}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, i) => (
              <TableRow key={(row.id as string) ?? i}>
                {columns.map((c) => (
                  <TableCell key={c.key} className={c.className}>
                    {c.render ? c.render(row) : ((row as Record<string, unknown>)[c.key] as React.ReactNode)}
                  </TableCell>
                ))}
                {rowAction && <TableCell className="text-right">{rowAction(row)}</TableCell>}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
