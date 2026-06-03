import { createClient } from '@/lib/supabase/server';

export interface PlatformStats {
  resources: number;
  subjects: number;
  companies: number;
  downloads: number;
  students: number;
}

// Live platform statistics for the homepage hero. Falls back to safe defaults
// when Supabase is not yet configured (placeholder env), so the build never breaks.
export async function getPlatformStats(): Promise<PlatformStats> {
  try {
    const supabase = await createClient();
    const [resources, subjects, companies, students, downloadsAgg] = await Promise.all([
      supabase.from('resources').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('subjects').select('id', { count: 'exact', head: true }),
      supabase.from('companies').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('resource_downloads').select('id', { count: 'exact', head: true }),
    ]);
    return {
      resources: resources.count ?? 0,
      subjects: subjects.count ?? 0,
      companies: companies.count ?? 0,
      downloads: downloadsAgg.count ?? 0,
      students: students.count ?? 0,
    };
  } catch {
    return { resources: 0, subjects: 10, companies: 11, downloads: 0, students: 0 };
  }
}
