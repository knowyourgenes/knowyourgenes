'use client';

import { useEffect, useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

/**
 * Generic delete confirmation with a "permanently delete" escape hatch.
 *
 *   - Default (checkbox off) → soft delete (deactivate / archive). Reversible.
 *   - Checkbox on             → hard delete. Destructive, cannot be undone.
 *
 * The component doesn't know about the resource — the caller wires `onConfirm`
 * to the right API call (e.g. DELETE /api/admin/packages/{id}?permanent=true).
 */
export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  title,
  itemLabel,
  description,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Short noun shown in the dynamic description. e.g. "package", "counsellor". */
  itemLabel?: string;
  description?: string;
  onConfirm: (permanent: boolean) => Promise<void> | void;
}) {
  const [permanent, setPermanent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset checkbox every time the dialog opens so it doesn't carry state across items.
  useEffect(() => {
    if (open) setPermanent(false);
  }, [open]);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm(permanent);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(next: boolean) {
    if (loading) return;
    onOpenChange(next);
  }

  const noun = itemLabel ?? 'This item';
  const defaultDescription = permanent
    ? `${noun} will be permanently removed from the database. This cannot be undone.`
    : `${noun} will be deactivated and hidden across the app. You can reactivate it later.`;

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description ?? defaultDescription}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded border border-destructive/30 bg-destructive/5 p-3">
          <div className="flex items-start gap-2">
            <Checkbox
              id="delete-permanent"
              checked={permanent}
              onCheckedChange={(c) => setPermanent(c === true)}
              className="mt-0.5"
              disabled={loading}
            />
            <div className="flex-1">
              <Label htmlFor="delete-permanent" className="cursor-pointer text-sm font-medium text-destructive">
                Permanently delete
              </Label>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Removes the record from the database entirely. Destructive and irreversible.
              </p>
              {permanent && (
                <div className="mt-2 flex items-start gap-1.5 text-xs text-destructive">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>If anything references this record (e.g. orders), deletion will fail.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/40"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading
              ? permanent
                ? 'Deleting…'
                : 'Deactivating…'
              : permanent
                ? 'Delete permanently'
                : 'Deactivate'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
