import type { Metadata } from 'next';
import { Suspense } from 'react';
import { listResources, listSubjects, listCompanies, getBookmarkedIds } from '@/lib/resource-queries';
import { ResourceGrid } from '@/components/resources/resource-grid';
import { SearchFilters } from '@/components/resources/search-filters';
import { Pagination } from '@/components/resources/pagination';
import { ResourceGridSkeleton } from '@/components/shared/skeleton';

export const metadata: Metadata = { title: 'Resource Library', description: 'Search and filter all placement preparation resources.' };

type SP = { q?: string; subject?: string; company?: string; type?: string; page?: string };

async function Results({ sp }: { sp: SP }) {
  const page = sp.page ? parseInt(sp.page, 10) : 1;
  const [result, bookmarkedIds] = await Promise.all([
    listResources({ q: sp.q, subject: sp.subject, company: sp.company, type: sp.type, page }),
    getBookmarkedIds(),
  ]);
  return (
    <>
      <p className="mb-5 text-sm text-muted-foreground">{result.total} resource{result.total === 1 ? '' : 's'} found</p>
      <ResourceGrid resources={result.resources} bookmarkedIds={bookmarkedIds} />
      <Pagination page={result.page} totalPages={result.totalPages} params={{ q: sp.q, subject: sp.subject, company: sp.company, type: sp.type }} />
    </>
  );
}

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const [subjects, companies] = await Promise.all([listSubjects(), listCompanies()]);
  const key = JSON.stringify(sp);
  return (
    <div className="container py-16">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Resource <span className="text-gradient">Library</span></h1>
        <p className="mt-3 text-muted-foreground">Search across every note, question set, PYQ and cheat sheet.</p>
      </div>
      <SearchFilters subjects={subjects} companies={companies} />
      <Suspense key={key} fallback={<ResourceGridSkeleton count={6} />}>
        <Results sp={sp} />
      </Suspense>
    </div>
  );
}
