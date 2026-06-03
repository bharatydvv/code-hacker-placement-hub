import type { Metadata } from 'next';
import { listResources } from '@/lib/resource-queries';
import { ResourceGrid } from '@/components/resources/resource-grid';
import { getBookmarkedIds } from '@/lib/resource-queries';

export const metadata: Metadata = { title: 'Aptitude', description: 'Quantitative, logical and verbal aptitude resources.' };

export default async function AptitudePage() {
  const [result, bookmarkedIds] = await Promise.all([
    listResources({ type: 'Aptitude Resources', page: 1 }),
    getBookmarkedIds(),
  ]);
  return (
    <div className="container py-16">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Aptitude <span className="text-gradient">Practice</span></h1>
        <p className="mt-3 text-muted-foreground">Quantitative, logical and verbal aptitude resources to ace placement aptitude rounds.</p>
      </div>
      <ResourceGrid resources={result.resources} bookmarkedIds={bookmarkedIds} />
    </div>
  );
}
