'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Download, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

/**
 * Fetches a short-lived signed URL and opens the PDF.
 *
 * A BUTTON, NOT AN ANCHOR, because there is no URL to put in an href until the
 * server has signed one - they expire in ten minutes, so a link rendered at page
 * load would be stale by the time most people clicked it. This is also why the
 * list page used to carry `href="#"`: nobody had built the exchange.
 *
 * `window.open` on the signed URL rather than a download attribute: object
 * storage serves the PDF with `Content-Disposition: inline`, so the browser's
 * own viewer opens it and the reader can scroll a genetic report rather than
 * being handed a file to find later.
 */
export function ReportDownloadButton({
  reportId,
  label = 'Open PDF',
  variant = 'default',
  size = 'sm',
  className,
}: {
  reportId: string;
  label?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default';
  className?: string;
}) {
  const [busy, setBusy] = useState(false);

  async function open() {
    setBusy(true);
    try {
      const res = await fetch(`/api/reports/${reportId}/download`, {
        method: 'POST',
        credentials: 'include',
      });
      const json = await res.json();
      if (!json.ok || !json.data?.url) {
        toast.error(json.error ?? 'Could not open the report');
        return;
      }
      // Opened after the await, so this is not a user-gesture-initiated open and
      // a popup blocker can stop it. Fall back to navigating this tab rather
      // than leaving the reader with a button that appears to do nothing.
      const win = window.open(json.data.url, '_blank', 'noopener,noreferrer');
      if (!win) window.location.href = json.data.url;
    } catch {
      toast.error('Could not reach the server');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={open}
      disabled={busy}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      {label}
    </button>
  );
}
