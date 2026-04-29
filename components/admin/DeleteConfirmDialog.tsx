'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
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

/**
 * Generic "deactivate" confirmation.
 *
 * KYG policy: nothing is ever hard-deleted - data is our key asset. Every
 * "remove" across the admin soft-deletes (sets `active=false` or flips a
 * status flag). The record stays queryable and the admin can reactivate it
 * any time.
 *
 * Filename is kept as DeleteConfirmDialog for import stability; the UX is
 * deactivate-only.
 */
export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  title,
  itemLabel,
  description,
  onConfirm,
  actionLabel = 'Deactivate',
  loadingLabel = 'Deactivating…',
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Short noun shown in the default description. e.g. "This package". */
  itemLabel?: string;
  description?: string;
  onConfirm: () => Promise<void> | void;
  actionLabel?: string;
  loadingLabel?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(next: boolean) {
    if (loading) return;
    onOpenChange(next);
  }

  const noun = itemLabel ?? 'This item';
  const defaultDescription = `${noun} will be deactivated and hidden across the app. The data is preserved and you can reactivate it any time.`;

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description ?? defaultDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/40"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? loadingLabel : actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
