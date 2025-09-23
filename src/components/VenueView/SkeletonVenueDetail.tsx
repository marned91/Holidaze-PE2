import { Skeleton } from '../Common/skeleton/Skeleton';

export function SkeletonVenueDetail() {
  return (
    <div role="status" aria-busy="true" className="space-y-6">
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="aspect-[16/9] w-full bg-gray-100 animate-pulse" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <Skeleton className="mb-3 h-6 w-2/3" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-2 h-4 w-5/6" />
          <Skeleton className="mb-2 h-4 w-4/6" />
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <Skeleton className="mb-3 h-6 w-1/2" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
