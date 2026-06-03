import type { Metadata } from 'next';
import { getDashboardData } from '@/lib/dashboard-queries';
import { ResourceGrid } from '@/components/resources/resource-grid';
import { EmptyState } from '@/components/shared/empty-state';
import { Bookmark } from 'lucide-react';

export const metadata: Metadata = { title: 'Bookmarks' };

export default async function BookmarksPage() {
  const d = await getDashboardData();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Your Bookmarks</h1>
        <p className="mt-1 text-sm text-muted-foreground">Quick access to everything you’ve saved.</p>
      </div>
      {d.bookmarks.length === 0 ? (
        <EmptyState icon={<Bookmark className="h-6 w-6 text-accent" />} title="No bookmarks yet" description="Save resources from the library to find them here." />
      ) : (
        <ResourceGrid resources={d.bookmarks} bookmarkedIds={d.bookmarkedIds} />
      )}
    </div>
  );
}
