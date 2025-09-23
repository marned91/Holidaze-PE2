import { Skeleton } from './Skeleton';

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="aspect-[16/10] w-full bg-gray-200 animate-pulse" />
      <div className="p-4">
        <Skeleton className="mb-2 h-4 w-2/3" />
        <Skeleton className="mb-1 h-3 w-1/3" />
        <Skeleton className="mb-1 h-3 w-5/6" />
        <div className="mt-4 flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="ml-auto h-9 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
