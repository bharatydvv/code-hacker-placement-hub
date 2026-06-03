import { Skeleton } from '@/components/shared/skeleton';

export default function Loading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-9 w-72" />
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Skeleton className="h-64" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
    </div>
  );
}
