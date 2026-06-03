import { Hero } from '@/components/marketing/hero';
import { Features } from '@/components/marketing/features';

// Phase 1 uses placeholder stats; Phase 2+ replaces these with live Supabase counts.
async function getStats() {
  return { resources: 1200, subjects: 10, companies: 11, downloads: 8400, students: 3200 };
}

export default async function HomePage() {
  const stats = await getStats();
  return (
    <>
      <Hero stats={stats} />
      <Features />
    </>
  );
}
