import { CHROME_VARS } from '@/features/auth/server/tokens';

export default function BlogLoading() {
  return (
    <div style={CHROME_VARS} className="min-h-screen bg-(--cream)">
      <div className="mx-auto max-w-[1600px] px-(--gutter) py-[clamp(40px,6vw,80px)]">
        <div className="h-3 w-32 animate-pulse rounded-sm bg-(--cream-2)" />
        <div className="mt-4 h-12 w-[70%] animate-pulse rounded-sm bg-(--cream-2)" />
        <div className="mt-9 flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-24 animate-pulse rounded-sm bg-(--cream-2)" />
          ))}
        </div>
        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-sm border border-(--ink-line) bg-white">
              <div className="aspect-[16/10] animate-pulse bg-(--cream-2)" />
              <div className="space-y-3 p-6">
                <div className="h-5 w-20 animate-pulse rounded-sm bg-(--cream-2)" />
                <div className="h-5 w-[85%] animate-pulse rounded-sm bg-(--cream-2)" />
                <div className="h-4 w-full animate-pulse rounded-sm bg-(--cream-2)" />
                <div className="h-4 w-[60%] animate-pulse rounded-sm bg-(--cream-2)" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
