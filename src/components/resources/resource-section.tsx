import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ResourceCard } from './resource-card';
import type { ResourceWithRelations } from '@/types/database';
import { typeToSlug } from '@/lib/constants';

// A horizontal-feeling section of resources for one resource type on subject/company pages.
export function ResourceSection({
  title,
  resources,
  viewAllHref,
  bookmarkedIds,
}: {
  title: string;
  resources: ResourceWithRelations[];
  viewAllHref?: string;
  bookmarkedIds?: Set<string>;
}) {
  if (!resources.length) return null;
  return (
    <section className="py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {resources.map((r) => (
          <ResourceCard key={r.id} resource={r} bookmarked={bookmarkedIds?.has(r.id)} />
        ))}
      </div>
    </section>
  );
}

export { typeToSlug };
