import { ResourceGridSkeleton } from '@/components/shared/skeleton';

export default function Loading() {
  return (
    <div className="container py-16">
      <div className="mb-8 h-10 w-64 animate-pulse rounded-xl bg-white/5" />
      <div className="mb-8 h-20 w-full animate-pulse rounded-2xl bg-white/5" />
      <ResourceGridSkeleton count={6} />
    </div>
  );
}
