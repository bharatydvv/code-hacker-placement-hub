import { createClient } from '@/lib/supabase/server';
import type { ResourceWithRelations } from '@/types/database';

const SELECT =
  'id, slug, title, description, resource_type, subject_id, company_id, drive_link, thumbnail_url, published, view_count, download_count, created_at, updated_at, subject:subjects(id, slug, name), company:companies(id, slug, name)';

export interface AdminAnalytics {
  totalResources: number;
  publishedResources: number;
  totalViews: number;
  totalDownloads: number;
  mostViewed: ResourceWithRelations[];
  mostDownloaded: ResourceWithRelations[];
  trending: ResourceWithRelations[];
}

export async function listAdminResources(page = 1, pageSize = 20): Promise<{ resources: ResourceWithRelations[]; total: number; totalPages: number; page: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  try {
    const supabase = await createClient();
    const { data, count } = await supabase
      .from('resources')
      .select(SELECT, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    const total = count ?? 0;
    return { resources: (data as unknown as ResourceWithRelations[]) ?? [], total, totalPages: Math.max(1, Math.ceil(total / pageSize)), page };
  } catch {
    return { resources: [], total: 0, totalPages: 1, page };
  }
}

export async function getAdminResource(id: string): Promise<ResourceWithRelations | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('resources').select(SELECT).eq('id', id).single();
    return (data as unknown as ResourceWithRelations) ?? null;
  } catch {
    return null;
  }
}

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  try {
    const supabase = await createClient();
    const since = new Date();
    since.setDate(since.getDate() - 7);
    const sinceIso = since.toISOString();

    const [totalRes, publishedRes, viewsHead, downloadsHead, mostViewed, mostDownloaded, recentViews] = await Promise.all([
      supabase.from('resources').select('id', { count: 'exact', head: true }),
      supabase.from('resources').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('resource_views').select('id', { count: 'exact', head: true }),
      supabase.from('resource_downloads').select('id', { count: 'exact', head: true }),
      supabase.from('resources').select(SELECT).eq('published', true).order('view_count', { ascending: false }).limit(5),
      supabase.from('resources').select(SELECT).eq('published', true).order('download_count', { ascending: false }).limit(5),
      supabase.from('resource_views').select('resource_id').gte('created_at', sinceIso).limit(2000),
    ]);

    // Trending = most views in the last 7 days (weighted recent activity).
    const counts = new Map<string, number>();
    for (const row of (recentViews.data as { resource_id: string }[] | null) ?? []) {
      counts.set(row.resource_id, (counts.get(row.resource_id) ?? 0) + 1);
    }
    const topIds = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id]) => id);
    let trending: ResourceWithRelations[] = [];
    if (topIds.length) {
      const { data } = await supabase.from('resources').select(SELECT).in('id', topIds);
      const order = new Map(topIds.map((id, i) => [id, i]));
      trending = ((data as unknown as ResourceWithRelations[]) ?? []).sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    }

    return {
      totalResources: totalRes.count ?? 0,
      publishedResources: publishedRes.count ?? 0,
      totalViews: viewsHead.count ?? 0,
      totalDownloads: downloadsHead.count ?? 0,
      mostViewed: (mostViewed.data as unknown as ResourceWithRelations[]) ?? [],
      mostDownloaded: (mostDownloaded.data as unknown as ResourceWithRelations[]) ?? [],
      trending,
    };
  } catch {
    return { totalResources: 0, publishedResources: 0, totalViews: 0, totalDownloads: 0, mostViewed: [], mostDownloaded: [], trending: [] };
  }
}

export async function adminListSubjects() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('subjects').select('id, slug, name').order('name');
    return data ?? [];
  } catch { return []; }
}
export async function adminListCompanies() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('companies').select('id, slug, name').order('name');
    return data ?? [];
  } catch { return []; }
}
