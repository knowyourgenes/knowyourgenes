'use client';

import { useEffect } from 'react';
import Link from 'next/link';

// Boundary for every /pr/* product route, so one bad kit page doesn't blank the app.
// Lives beside the segment - add app/pr/layout.tsx here if products ever need shared chrome.
export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-linenw px-6 text-center">
      <h2 className="text-xl font-medium text-heavy">This kit page could not be loaded</h2>
      <p className="text-sm text-fusc">{error.message || 'Please try again in a moment.'}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-heavy px-5 py-2 text-sm font-medium text-white"
        >
          Try again
        </button>
        <Link href="/" className="text-sm font-medium text-fusc underline underline-offset-4">
          Back to home
        </Link>
      </div>
    </div>
  );
}
