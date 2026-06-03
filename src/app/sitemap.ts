import type { MetadataRoute } from 'next';
import { listSubjects, listCompanies } from '@/lib/resource-queries';
import { createClient } from '@/lib/supabase/server';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function publishedResourceSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('resources')
      .select('slug, updated_at')
      .eq('published', true)
      .order('updated_at', { ascending: false })
      .limit(5000);
    return (data as { slug: string; updated_at: string }[]) ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [subjects, companies, resources] = await Promise.all([
    listSubjects(),
    listCompanies(),
    publishedResourceSlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    '', '/subjects', '/companies', '/resources', '/aptitude', '/login', '/signup',
  ].map((p) => ({ url: `${BASE}${p}`, lastModified: new Date(), changeFrequency: 'weekly', priority: p === '' ? 1 : 0.7 }));

  const subjectRoutes: MetadataRoute.Sitemap = subjects.map((s) => ({
    url: `${BASE}/subjects/${s.slug}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8,
  }));
  const companyRoutes: MetadataRoute.Sitemap = companies.map((c) => ({
    url: `${BASE}/companies/${c.slug}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8,
  }));
  const resourceRoutes: MetadataRoute.Sitemap = resources.map((r) => ({
    url: `${BASE}/resources/${r.slug}`, lastModified: new Date(r.updated_at), changeFrequency: 'monthly', priority: 0.6,
  }));

  return [...staticRoutes, ...subjectRoutes, ...companyRoutes, ...resourceRoutes];
}
