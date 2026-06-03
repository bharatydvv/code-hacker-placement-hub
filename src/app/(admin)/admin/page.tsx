import type { Metadata } from 'next';
import Link from 'next/link';

import { getAdminAnalytics } from '@/lib/admin-queries';

import { Card, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
export const metadata: Metadata = { title: 'Admin Overview' };

function MiniList({ title, items, metric }: { title: string; items: { id: string; slug: string; title: string; view_count: number; download_count: number }[]; metric: 'view_count' | 'download_count' | 'trend' }) {
  return (
    <Card>
      <CardTitle className="mb-4 flex items-center gap-2">{metric === 'trend' && <TrendingUp className="h-4 w-4 text-accent" />}{title}</CardTitle>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No data yet.</p>
      ) : (
        <ol className="space-y-3">
          {items.map((r, i) => (
            <li key={r.id} className="flex items-center gap-3 text-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 text-xs text-muted-foreground">{i + 1}</span>
              <Link href={`/resources/${r.slug}`} className="flex-1 truncate hover:text-accent">{r.title}</Link>
              {metric !== 'trend' && <span className="text-muted-foreground">{metric === 'view_count' ? r.view_count : r.download_count}</span>}
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

export default async function AdminOverview() {
  const a = await getAdminAnalytics();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Content & Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Platform-wide resource performance.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div>Total Resources: {a.totalResources}</div>
        <div>Published: {a.publishedResources}</div>
        <div>Total Views: {a.totalViews}</div>
        <div>Total Downloads: {a.totalDownloads}</div>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <MiniList title="Most Viewed" items={a.mostViewed} metric="view_count" />
        <MiniList title="Most Downloaded" items={a.mostDownloaded} metric="download_count" />
        <MiniList title="Trending (7d)" items={a.trending} metric="trend" />
      </div>
    </div>
  );
}
