import type { Metadata } from 'next';
import Link from 'next/link';
import { FilePlus2 } from 'lucide-react';
import { listAdminResources } from '@/lib/admin-queries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResourceRowActions } from '@/components/admin/resource-row-actions';
import { EmptyState } from '@/components/shared/empty-state';

export const metadata: Metadata = { title: 'Manage Resources' };

export default async function AdminResourcesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const { resources, total, totalPages } = await listAdminResources(page);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Resources</h1>
          <p className="mt-1 text-sm text-muted-foreground">{total} total</p>
        </div>
        <Button asChild><Link href="/admin/resources/new"><FilePlus2 className="h-4 w-4" /> Add</Link></Button>
      </div>

      {resources.length === 0 ? (
        <EmptyState title="No resources yet" description="Add your first resource or bulk import a CSV/XLSX." />
      ) : (
        <div className="glass-card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Subject / Company</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id} className="border-b border-white/5 last:border-0">
                  <td className="max-w-xs truncate px-4 py-3"><Link href={`/resources/${r.slug}`} className="hover:text-accent">{r.title}</Link></td>
                  <td className="px-4 py-3"><Badge>{r.resource_type}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{r.subject?.name ?? r.company?.name ?? '—'}</td>
                  <td className="px-4 py-3">{r.published ? <span className="text-accent">Published</span> : <span className="text-muted-foreground">Draft</span>}</td>
                  <td className="px-4 py-3"><ResourceRowActions id={r.id} published={r.published} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && <Link href={`/admin/resources?page=${page - 1}`} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">Prev</Link>}
          <span className="px-2 text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          {page < totalPages && <Link href={`/admin/resources?page=${page + 1}`} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">Next</Link>}
        </div>
      )}
    </div>
  );
}
