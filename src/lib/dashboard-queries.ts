import { createClient } from '@/lib/supabase/server';
import type { ResourceWithRelations, Profile } from '@/types/database';

const RESOURCE_SELECT =
  'id, slug, title, description, resource_type, subject_id, company_id, drive_link, thumbnail_url, published, view_count, download_count, created_at, updated_at, subject:subjects(id, slug, name), company:companies(id, slug, name)';

export interface DailyActivity { date: string; count: number }
export interface SubjectProgress { subjectId: string; name: string; viewed: number; percent: number }

export interface DashboardData {
  profile: Profile | null;
  totalSubjects: number;
  viewsCount: number;
  downloadsCount: number;
  bookmarksCount: number;
  subjectsCovered: number;
  readinessScore: number;
  currentStreak: number;
  bestStreak: number;
  studyProgress: SubjectProgress[];
  weekly: DailyActivity[];
  monthly: DailyActivity[];
  recentlyViewed: ResourceWithRelations[];
  bookmarks: ResourceWithRelations[];
  bookmarkedIds: Set<string>;
}

function emptyDashboard(): DashboardData {
  return {
    profile: null, totalSubjects: 0, viewsCount: 0, downloadsCount: 0, bookmarksCount: 0,
    subjectsCovered: 0, readinessScore: 0, currentStreak: 0, bestStreak: 0,
    studyProgress: [], weekly: [], monthly: [], recentlyViewed: [], bookmarks: [], bookmarkedIds: new Set(),
  };
}

function dayKey(d: Date) { return d.toISOString().slice(0, 10); }

// Compute current & best streak from a set of active day-keys.
function computeStreaks(daySet: Set<string>): { current: number; best: number } {
  if (daySet.size === 0) return { current: 0, best: 0 };
  const days = Array.from(daySet).sort();
  let best = 1, run = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const cur = new Date(days[i]);
    const diff = Math.round((cur.getTime() - prev.getTime()) / 86400000);
    if (diff === 1) { run++; best = Math.max(best, run); } else { run = 1; }
  }
  // current streak counts back from today/yesterday
  const today = new Date();
  let current = 0;
  const cursor = new Date(today);
  if (!daySet.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (daySet.has(dayKey(cursor))) {
    current++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { current, best: Math.max(best, current) };
}

// Readiness score 0-100 from coverage, views, downloads, bookmarks, activity frequency.
function computeReadiness(args: {
  subjectsCovered: number; totalSubjects: number; views: number; downloads: number; bookmarks: number; activeDays: number;
}): number {
  const coverage = args.totalSubjects > 0 ? args.subjectsCovered / args.totalSubjects : 0; // 0..1
  const viewScore = Math.min(args.views / 60, 1);
  const downloadScore = Math.min(args.downloads / 30, 1);
  const bookmarkScore = Math.min(args.bookmarks / 20, 1);
  const activityScore = Math.min(args.activeDays / 30, 1);
  const weighted =
    coverage * 0.35 + viewScore * 0.25 + downloadScore * 0.15 + bookmarkScore * 0.1 + activityScore * 0.15;
  return Math.round(weighted * 100);
}

function buildBuckets(rows: { created_at: string }[], days: number): DailyActivity[] {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const k = r.created_at.slice(0, 10);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const out: DailyActivity[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const k = dayKey(d);
    out.push({ date: k, count: counts.get(k) ?? 0 });
  }
  return out;
}

// Single optimized aggregation: a small, fixed set of parallel queries (no per-row N+1).
export async function getDashboardData(): Promise<DashboardData> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return emptyDashboard();

    const since30 = new Date();
    since30.setDate(since30.getDate() - 30);
    const since30Iso = since30.toISOString();

    const [profileRes, subjectsRes, viewsHeadRes, downloadsHeadRes, bookmarksRes, recentViewsRes] =
      await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('subjects').select('id, name'),
        supabase.from('resource_views').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('resource_downloads').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase
          .from('bookmarks')
          .select('resource_id, created_at, resource:resources(' + RESOURCE_SELECT + ')')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('resource_views')
          .select('resource_id, created_at, resource:resources(' + RESOURCE_SELECT + ')')
          .eq('user_id', user.id)
          .gte('created_at', since30Iso)
          .order('created_at', { ascending: false }),
      ]);

    const profile = (profileRes.data as Profile) ?? null;
    const subjects = (subjectsRes.data as { id: string; name: string }[]) ?? [];
    const totalSubjects = subjects.length;
    const viewsCount = viewsHeadRes.count ?? 0;
    const downloadsCount = downloadsHeadRes.count ?? 0;

    const bookmarkRows = (bookmarksRes.data as unknown as { resource_id: string; resource: ResourceWithRelations }[]) ?? [];
    const bookmarks = bookmarkRows.map((b) => b.resource).filter(Boolean);
    const bookmarkedIds = new Set(bookmarkRows.map((b) => b.resource_id));
    const bookmarksCount = bookmarkRows.length;

    const viewRows = (recentViewsRes.data as unknown as { resource_id: string; created_at: string; resource: ResourceWithRelations }[]) ?? [];

    // Recently viewed (distinct, latest 6)
    const seen = new Set<string>();
    const recentlyViewed: ResourceWithRelations[] = [];
    for (const row of viewRows) {
      if (row.resource && !seen.has(row.resource_id)) {
        seen.add(row.resource_id);
        recentlyViewed.push(row.resource);
      }
      if (recentlyViewed.length >= 6) break;
    }

    // Subject-wise progress from viewed resources
    const perSubjectViews = new Map<string, number>();
    for (const row of viewRows) {
      const sid = row.resource?.subject_id;
      if (sid) perSubjectViews.set(sid, (perSubjectViews.get(sid) ?? 0) + 1);
    }
    const studyProgress: SubjectProgress[] = subjects
      .map((s) => {
        const viewed = perSubjectViews.get(s.id) ?? 0;
        return { subjectId: s.id, name: s.name, viewed, percent: Math.min(100, Math.round((viewed / 10) * 100)) };
      })
      .sort((a, b) => b.percent - a.percent);
    const subjectsCovered = studyProgress.filter((s) => s.viewed > 0).length;

    // Streaks + activity buckets from active day-keys (30d window for activity, all for streak proxy)
    const daySet = new Set(viewRows.map((r) => r.created_at.slice(0, 10)));
    const { current, best } = computeStreaks(daySet);
    const weekly = buildBuckets(viewRows, 7);
    const monthly = buildBuckets(viewRows, 30);

    const readinessScore = computeReadiness({
      subjectsCovered, totalSubjects, views: viewsCount, downloads: downloadsCount, bookmarks: bookmarksCount, activeDays: daySet.size,
    });

    return {
      profile, totalSubjects, viewsCount, downloadsCount, bookmarksCount, subjectsCovered,
      readinessScore, currentStreak: current, bestStreak: best,
      studyProgress, weekly, monthly, recentlyViewed, bookmarks, bookmarkedIds,
    };
  } catch {
    return emptyDashboard();
  }
}
