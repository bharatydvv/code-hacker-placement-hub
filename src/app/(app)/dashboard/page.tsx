import type { Metadata } from 'next';
import Link from 'next/link';
import { Eye, Download, Bookmark, Flame, Trophy, BookOpen } from 'lucide-react';
import { getDashboardData } from '@/lib/dashboard-queries';
import { ReadinessRing } from '@/components/dashboard/readiness-ring';
import { StatCard } from '@/components/dashboard/stat-card';
import { ProgressBar } from '@/components/dashboard/progress-bar';
import { ResourceSection } from '@/components/resources/resource-section';
import { Card, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardHome() {
  const d = await getDashboardData();
  const firstName = d.profile?.full_name?.split(' ')[0] ?? 'there';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Welcome back, <span className="text-gradient">{firstName}</span></h1>
        <p className="mt-1 text-sm text-muted-foreground">Here’s your placement preparation snapshot.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Card className="flex flex-col items-center justify-center">
          <CardTitle className="mb-4">Placement Readiness</CardTitle>
          <ReadinessRing score={d.readinessScore} />
        </Card>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard icon={Eye} label="Resources Viewed" value={d.viewsCount} />
          <StatCard icon={Download} label="Downloads" value={d.downloadsCount} />
          <StatCard icon={Bookmark} label="Bookmarks" value={d.bookmarksCount} />
          <StatCard icon={BookOpen} label="Subjects Covered" value={d.subjectsCovered} />
          <StatCard icon={Flame} label="Current Streak" value={d.currentStreak} suffix="d" />
          <StatCard icon={Trophy} label="Best Streak" value={d.bestStreak} suffix="d" />
        </div>
      </div>

      <Card>
        <CardTitle className="mb-4">Study Progress by Subject</CardTitle>
        {d.studyProgress.filter((s) => s.viewed > 0).length === 0 ? (
          <p className="text-sm text-muted-foreground">Start viewing resources to build your subject progress.</p>
        ) : (
          <div className="space-y-4">
            {d.studyProgress.filter((s) => s.viewed > 0).slice(0, 6).map((s) => (
              <ProgressBar key={s.subjectId} label={s.name} percent={s.percent} hint={`${s.viewed} viewed`} />
            ))}
          </div>
        )}
      </Card>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recently Viewed</h2>
          <Link href="/resources" className="text-sm text-accent hover:underline">Browse library</Link>
        </div>
        {d.recentlyViewed.length === 0 ? (
          <EmptyState title="No activity yet" description="Open a resource to see it appear here." />
        ) : (
          <ResourceSection title="" resources={d.recentlyViewed} bookmarkedIds={d.bookmarkedIds} />
        )}
      </div>
    </div>
  );
}
