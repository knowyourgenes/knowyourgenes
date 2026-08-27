'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Download, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

/**
 * Fetches a short-lived signed URL and opens the PDF in a new tab.
 *
 * A BUTTON, NOT AN ANCHOR, because there is no URL to put in an href until the
 * server has signed one - they expire in ten minutes, so a link rendered at page
 * load would be stale by the time most people clicked it.
 *
 * OPENED BY CLICKING A SYNTHETIC ANCHOR, not by window.open. That is not
 * fussiness: `window.open(url, '_blank', 'noopener')` returns NULL even when it
 * succeeds, because the browser must not hand the opener a reference to a
 * no-opener window. Testing that return value for a popup blocker therefore
 * reports "blocked" every single time - which is how this ended up opening the
 * report in a new tab AND navigating the current one to it. An anchor click
 * needs no return value, carries the same rel protections, and behaves the way
 * a link does.
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

      const a = document.createElement('a');
      a.href = json.data.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      toast.error('Could not reach the server');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={open} disabled={busy} className={cn(buttonVariants({ variant, size }), className)}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      {label}
    </button>
  );
}
