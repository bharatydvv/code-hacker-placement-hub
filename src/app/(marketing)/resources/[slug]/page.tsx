import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getResourceBySlug, getRelatedResources, getRecentlyViewed, getBookmarkedIds } from '@/lib/resource-queries';
import { Badge } from '@/components/ui/badge';
import { ResourceActions } from '@/components/resources/resource-actions';
import { ResourceSection } from '@/components/resources/resource-section';
import { JsonLd, articleSchema } from '@/components/seo/json-ld';
import { Eye, Download } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) return { title: 'Resource' };
  return {
    title: resource.title,
    description: resource.description ?? `${resource.resource_type} resource`,
    openGraph: { title: resource.title, description: resource.description ?? undefined, images: resource.thumbnail_url ? [resource.thumbnail_url] : undefined },
  };
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) notFound();

  const [related, recentlyViewed, bookmarkedIds] = await Promise.all([
    getRelatedResources(resource),
    getRecentlyViewed(),
    getBookmarkedIds(),
  ]);

  return (
    <div className="container py-16">
      <JsonLd data={articleSchema({ title: resource.title, description: resource.description, url: `${BASE}/resources/${resource.slug}`, datePublished: resource.created_at, image: resource.thumbnail_url })} />
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge>{resource.resource_type}</Badge>
            {resource.subject?.name && <Badge className="bg-primary/15">{resource.subject.name}</Badge>}
            {resource.company?.name && <Badge className="bg-secondary/15">{resource.company.name}</Badge>}
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">{resource.title}</h1>
          <div className="mt-3 flex items-center gap-5 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Eye className="h-4 w-4" />{resource.view_count} views</span>
            <span className="inline-flex items-center gap-1.5"><Download className="h-4 w-4" />{resource.download_count} downloads</span>
          </div>
          {resource.description && <p className="mt-6 whitespace-pre-line leading-relaxed text-foreground/90">{resource.description}</p>}
          <div className="mt-8">
            <ResourceActions resourceId={resource.id} driveLink={resource.drive_link} bookmarked={bookmarkedIds.has(resource.id)} />
          </div>
        </div>
        <aside>
          <div className="glass-card overflow-hidden">
            <div className="h-44 w-full bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/10">
              {resource.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resource.thumbnail_url} alt={resource.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-5xl font-bold text-white/20">{resource.resource_type[0]}</div>
              )}
            </div>
            <div className="p-5 text-sm text-muted-foreground">
              Material is hosted on Google Drive. Use the buttons to open or download.
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <ResourceSection title="Related Resources" resources={related} bookmarkedIds={bookmarkedIds} />
        </div>
      )}
      {recentlyViewed.length > 0 && (
        <div className="mt-4">
          <ResourceSection title="Recently Viewed" resources={recentlyViewed} bookmarkedIds={bookmarkedIds} />
        </div>
      )}
    </div>
  );
}
