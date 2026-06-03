import Link from 'next/link';
import type { Metadata } from 'next';
import { listCompanies } from '@/lib/resource-queries';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';

export const metadata: Metadata = { title: 'Companies', description: 'Company-wise placement preparation.' };
export const revalidate = 120;

export default async function CompaniesPage() {
  const companies = await listCompanies();
  return (
    <div className="container py-16">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Prepare by <span className="text-gradient">company</span></h1>
        <p className="mt-3 text-muted-foreground">Technical & HR questions, PYQs, interview experiences and prep notes for top recruiters.</p>
      </div>
      {companies.length === 0 ? (
        <EmptyState title="Companies loading" description="Connect Supabase and run the seed to populate companies." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {companies.map((c) => (
            <Link key={c.id} href={`/companies/${c.slug}`}>
              <Card className="h-full text-center transition-all hover:-translate-y-1 hover:border-white/20">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 text-lg font-bold text-accent">
                  {c.name[0]}
                </div>
                <CardTitle className="text-base">{c.name}</CardTitle>
                <CardDescription className="mt-1 text-xs">{c.description}</CardDescription>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
