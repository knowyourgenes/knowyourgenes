'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { Calendar as CalendarIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

const PRESETS = [
  { label: 'Today', days: 0 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
] as const;

export default function DateRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  // "Applied" = what's in the URL right now, the source of truth for the outside world.
  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');
  const applied: DateRange | undefined =
    fromParam && toParam ? { from: new Date(fromParam), to: new Date(toParam) } : undefined;

  // "Staged" = what's selected inside the open popover, not committed yet.
  const [staged, setStaged] = useState<DateRange | undefined>(applied);

  // Sync staged → applied every time the popover opens, so users start from the
  // currently-applied state, never from a half-selection from a previous session.
  useEffect(() => {
    if (open) {
      setStaged(applied);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function commit(next: DateRange | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (next?.from && next?.to) {
      params.set('from', format(next.from, 'yyyy-MM-dd'));
      params.set('to', format(next.to, 'yyyy-MM-dd'));
    } else {
      params.delete('from');
      params.delete('to');
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }

  /**
   * Custom day-click handler that overrides react-day-picker's default range
   * behavior. The default gets confused when a user clicks inside an already-
   * complete range — it sometimes moves the wrong edge. Ours is deterministic:
   *
   *   - No selection yet, OR range already complete → start a new range
   *     (this is the "7–20 picked, click 9 → start fresh from 9" case)
   *   - Only "from" picked, click before it → treat new click as "from", push
   *     old "from" to be "to"
   *   - Only "from" picked, click after it → set "to"
   */
  function handleDayClick(day: Date) {
    const rangeComplete = !!(staged?.from && staged?.to);
    if (!staged?.from || rangeComplete) {
      setStaged({ from: day, to: undefined });
      return;
    }
    const from = staged.from;
    if (day.getTime() < from.getTime()) {
      setStaged({ from: day, to: from });
    } else {
      setStaged({ from, to: day });
    }
  }

  function applyPreset(days: number) {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    setStaged({ from, to });
    commit({ from, to });
    setOpen(false);
  }

  function apply() {
    if (staged?.from && staged?.to) {
      commit(staged);
      setOpen(false);
    }
  }

  function cancel() {
    setStaged(applied);
    setOpen(false);
  }

  function clearFilter() {
    setStaged(undefined);
    commit(undefined);
  }

  const hasApplied = !!(applied?.from && applied?.to);
  const hasStaged = !!(staged?.from && staged?.to);
  const label = hasApplied
    ? `${format(applied!.from!, 'd MMM')} – ${format(applied!.to!, 'd MMM yyyy')}`
    : 'All time';

  const stagedLabel = staged?.from && staged?.to
    ? `${format(staged.from, 'd MMM')} – ${format(staged.to, 'd MMM yyyy')}`
    : staged?.from
      ? `${format(staged.from, 'd MMM')} → pick end date`
      : 'Pick a start date';

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button variant="outline" size="sm" className="justify-start font-normal">
              <CalendarIcon className="h-4 w-4" />
              {label}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0" align="end">
          {/* Preset shortcuts */}
          <div className="flex flex-col gap-0.5 border-b p-2 sm:flex-row">
            {PRESETS.map((p) => (
              <Button
                key={p.label}
                variant="ghost"
                size="sm"
                onClick={() => applyPreset(p.days)}
                className="justify-start"
              >
                {p.label}
              </Button>
            ))}
          </div>

          {/* Calendar — controlled, custom click handler */}
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={staged}
            onDayClick={handleDayClick}
            defaultMonth={staged?.from ?? new Date()}
          />

          <Separator />

          {/* Staged readout + Apply/Cancel */}
          <div className="flex items-center justify-between gap-3 p-2">
            <div className="text-xs text-muted-foreground">{stagedLabel}</div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={cancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={apply} disabled={!hasStaged}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {hasApplied && (
        <Button variant="ghost" size="icon-sm" onClick={clearFilter} aria-label="Clear date filter">
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
