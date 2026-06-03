import Link from 'next/link';
import type { Metadata } from 'next';
import { listSubjects } from '@/lib/resource-queries';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';

export const metadata: Metadata = { title: 'Subjects', description: 'Subject-wise placement preparation material.' };
export const revalidate = 120;

export default async function SubjectsPage() {
  const subjects = await listSubjects();
  return (
    <div className="container py-16">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Study by <span className="text-gradient">subject</span></h1>
        <p className="mt-3 text-muted-foreground">Notes, MCQs, PYQs, interview questions and cheat sheets for every core subject.</p>
      </div>
      {subjects.length === 0 ? (
        <EmptyState title="Subjects loading" description="Connect Supabase and run the seed to populate subjects." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => (
            <Link key={s.id} href={`/subjects/${s.slug}`}>
              <Card className="h-full transition-all hover:-translate-y-1 hover:border-white/20">
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 text-accent font-bold">
                  {s.name[0]}
                </div>
                <CardTitle>{s.name}</CardTitle>
                <CardDescription className="mt-1">{s.description}</CardDescription>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
