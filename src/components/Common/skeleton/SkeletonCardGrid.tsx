import { SkeletonCard } from './SkeletonCard';

export function SkeletonCardGrid({ count = 6 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-busy="true"
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
