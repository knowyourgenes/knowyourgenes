/** Skeleton for /search while the catalogue read resolves. */
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-[var(--gutter,clamp(18px,3vw,40px))] py-[42px]">
      <div className="mx-auto max-w-[720px]">
        <div className="mx-auto h-[36px] w-[240px] animate-pulse rounded-sm bg-zeus/[0.07]" />
        <div className="mt-[18px] h-[48px] w-full animate-pulse rounded-sm bg-zeus/[0.07]" />
      </div>
      <div className="mt-[34px] grid gap-[34px] min-[900px]:grid-cols-[236px_minmax(0,1fr)]">
        <div className="flex flex-col gap-[18px]">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[120px] animate-pulse rounded-sm bg-zeus/[0.05]" />
          ))}
        </div>
        <div className="grid gap-[22px] min-[560px]:grid-cols-2 min-[1180px]:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-[320px] animate-pulse rounded-sm bg-zeus/[0.05]" />
          ))}
        </div>
      </div>
    </div>
  );
}
