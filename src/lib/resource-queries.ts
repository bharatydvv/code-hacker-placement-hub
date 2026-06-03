import { createClient } from '@/lib/supabase/server';
import type { ResourceWithRelations } from '@/types/database';

const SELECT =
  'id, slug, title, description, resource_type, subject_id, company_id, drive_link, thumbnail_url, published, view_count, download_count, created_at, updated_at, subject:subjects(id, slug, name), company:companies(id, slug, name)';

export const PAGE_SIZE = 12;

export interface ResourceFilters {
  q?: string;
  subject?: string; // subject slug
  company?: string; // company slug
  type?: string; // resource_type value
  page?: number;
}

export interface ResourceListResult {
  resources: ResourceWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Resolve a subject/company slug to its id (small, cached-friendly lookups).
async function slugToSubjectId(slug?: string) {
  if (!slug) return undefined;
  const supabase = await createClient();
  const { data } = await supabase.from('subjects').select('id').eq('slug', slug).single();
  return data?.id as string | undefined;
}
async function slugToCompanyId(slug?: string) {
  if (!slug) return undefined;
  const supabase = await createClient();
  const { data } = await supabase.from('companies').select('id').eq('slug', slug).single();
  return data?.id as string | undefined;
}

export async function listResources(filters: ResourceFilters): Promise<ResourceListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  try {
    const supabase = await createClient();
    let query = supabase
      .from('resources')
      .select(SELECT, { count: 'exact' })
      .eq('published', true)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (filters.q) {
      query = query.or(`title.ilike.%${filters.q}%,description.ilike.%${filters.q}%`);
    }
    if (filters.type) query = query.eq('resource_type', filters.type);
    const subjectId = await slugToSubjectId(filters.subject);
    if (subjectId) query = query.eq('subject_id', subjectId);
    const companyId = await slugToCompanyId(filters.company);
    if (companyId) query = query.eq('company_id', companyId);

    const { data, count } = await query;
    const total = count ?? 0;
    return {
      resources: (data as unknown as ResourceWithRelations[]) ?? [],
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    };
  } catch {
    return { resources: [], total: 0, page, pageSize: PAGE_SIZE, totalPages: 1 };
  }
}

export async function getResourceBySlug(slug: string): Promise<ResourceWithRelations | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('resources').select(SELECT).eq('slug', slug).eq('published', true).single();
    return (data as unknown as ResourceWithRelations) ?? null;
  } catch {
    return null;
  }
}

export async function getRelatedResources(resource: ResourceWithRelations, limit = 4): Promise<ResourceWithRelations[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from('resources').select(SELECT).eq('published', true).neq('id', resource.id).limit(limit);
    if (resource.subject_id) query = query.eq('subject_id', resource.subject_id);
    else if (resource.company_id) query = query.eq('company_id', resource.company_id);
    else query = query.eq('resource_type', resource.resource_type);
    const { data } = await query;
    return (data as unknown as ResourceWithRelations[]) ?? [];
  } catch {
    return [];
  }
}

export async function getSubjectBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('subjects').select('*').eq('slug', slug).single();
    return data;
  } catch {
    return null;
  }
}

export async function getCompanyBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('companies').select('*').eq('slug', slug).single();
    return data;
  } catch {
    return null;
  }
}

export async function listSubjects() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('subjects').select('*').order('name');
    return data ?? [];
  } catch {
    return [];
  }
}

export async function listCompanies() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('companies').select('*').order('name');
    return data ?? [];
  } catch {
    return [];
  }
}

// Resources for a subject/company grouped by resource type (for section pages).
export async function listResourcesBySubjectAndType(subjectId: string, type: string, limit = 8): Promise<ResourceWithRelations[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('resources')
      .select(SELECT)
      .eq('published', true)
      .eq('subject_id', subjectId)
      .eq('resource_type', type)
      .order('created_at', { ascending: false })
      .limit(limit);
    return (data as unknown as ResourceWithRelations[]) ?? [];
  } catch {
    return [];
  }
}

export async function listResourcesByCompanyAndType(companyId: string, type: string, limit = 8): Promise<ResourceWithRelations[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('resources')
      .select(SELECT)
      .eq('published', true)
      .eq('company_id', companyId)
      .eq('resource_type', type)
      .order('created_at', { ascending: false })
      .limit(limit);
    return (data as unknown as ResourceWithRelations[]) ?? [];
  } catch {
    return [];
  }
}

export async function getRecentlyViewed(limit = 4): Promise<ResourceWithRelations[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase
      .from('resource_views')
      .select('resource_id, created_at, resource:resources(' + SELECT + ')')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit * 3);
    const seen = new Set<string>();
    const out: ResourceWithRelations[] = [];
    for (const row of (data as unknown as { resource_id: string; resource: ResourceWithRelations }[]) ?? []) {
      if (row.resource && !seen.has(row.resource_id)) {
        seen.add(row.resource_id);
        out.push(row.resource);
      }
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    return [];
  }
}

export async function getBookmarkedIds(): Promise<Set<string>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Set();
    const { data } = await supabase.from('bookmarks').select('resource_id').eq('user_id', user.id);
    return new Set((data ?? []).map((b: { resource_id: string }) => b.resource_id));
  } catch {
    return new Set();
  }
}
