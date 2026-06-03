import { Hero } from '@/components/marketing/hero';
import { Features } from '@/components/marketing/features';
import { getPlatformStats } from '@/lib/queries';

export const revalidate = 60;

export default async function HomePage() {
  const stats = await getPlatformStats();
  return (
    <>
      <Hero stats={stats} />
      <Features />
    </>
  );
}
