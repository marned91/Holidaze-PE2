import { Skeleton } from '../Common/skeleton/Skeleton';

export function SkeletonProfileHeader() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="grid gap-4 md:grid-cols-[160px_1fr] items-center"
    >
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <Skeleton className="h-32 w-32 rounded-xl mx-auto" />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <Skeleton className="mb-2 h-5 w-1/3" />
        <Skeleton className="mb-2 h-4 w-2/3" />
        <Skeleton className="mb-2 h-4 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
