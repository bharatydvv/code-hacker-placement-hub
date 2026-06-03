'use client';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/shared/skeleton';

// Lazy-load Recharts (heavy) only on the client; reduces initial JS for dashboard pages.
export const LazyActivityChart = dynamic(
  () => import('./activity-chart').then((m) => m.ActivityChart),
  { ssr: false, loading: () => <Skeleton className="h-64 w-full" /> }
);
