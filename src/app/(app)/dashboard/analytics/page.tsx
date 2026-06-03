import type { Metadata } from 'next';
import { getDashboardData } from '@/lib/dashboard-queries';
import { LazyActivityChart as ActivityChart } from '@/components/dashboard/lazy-activity-chart';
import { ProgressBar } from '@/components/dashboard/progress-bar';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Analytics' };

export default async function AnalyticsPage() {
  const d = await getDashboardData();
  const weekTotal = d.weekly.reduce((a, b) => a + b.count, 0);
  const monthTotal = d.monthly.reduce((a, b) => a + b.count, 0);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Personal Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your study activity and resource consumption.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardDescription>This week</CardDescription><div className="mt-1 text-3xl font-bold text-gradient">{weekTotal}</div><CardDescription>resources opened</CardDescription></Card>
        <Card><CardDescription>This month</CardDescription><div className="mt-1 text-3xl font-bold text-gradient">{monthTotal}</div><CardDescription>resources opened</CardDescription></Card>
        <Card><CardDescription>Total downloads</CardDescription><div className="mt-1 text-3xl font-bold text-gradient">{d.downloadsCount}</div><CardDescription>materials downloaded</CardDescription></Card>
      </div>

      <Card>
        <CardTitle className="mb-4">Weekly Activity</CardTitle>
        <ActivityChart data={d.weekly} />
      </Card>
      <Card>
        <CardTitle className="mb-4">Monthly Activity</CardTitle>
        <ActivityChart data={d.monthly} />
      </Card>

      <Card>
        <CardTitle className="mb-4">Resource Consumption by Subject</CardTitle>
        {d.studyProgress.filter((s) => s.viewed > 0).length === 0 ? (
          <CardDescription>No data yet — start exploring resources.</CardDescription>
        ) : (
          <div className="space-y-4">
            {d.studyProgress.filter((s) => s.viewed > 0).map((s) => (
              <ProgressBar key={s.subjectId} label={s.name} percent={s.percent} hint={`${s.viewed} viewed`} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
