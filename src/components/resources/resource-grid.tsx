import { ResourceCard } from './resource-card';
import { EmptyState } from '@/components/shared/empty-state';
import type { ResourceWithRelations } from '@/types/database';

export function ResourceGrid({ resources, bookmarkedIds }: { resources: ResourceWithRelations[]; bookmarkedIds?: Set<string> }) {
  if (!resources.length) {
    return <EmptyState title="No resources yet" description="Nothing here right now. New material is added regularly — check back soon." />;
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map((r) => (
        <ResourceCard key={r.id} resource={r} bookmarked={bookmarkedIds?.has(r.id)} />
      ))}
    </div>
  );
}
