import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSubjectBySlug, listResourcesBySubjectAndType, getBookmarkedIds } from '@/lib/resource-queries';
import { ResourceSection } from '@/components/resources/resource-section';
import { EmptyState } from '@/components/shared/empty-state';
import { typeToSlug } from '@/lib/constants';

const SUBJECT_SECTIONS = [
  'Quick Notes',
  'Detailed Notes',
  'MCQs',
  'PYQs',
  'Interview Questions',
  'Cheat Sheets',
  'Assignments',
] as const;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);
  if (!subject) return { title: 'Subject' };
  return { title: subject.name, description: subject.description ?? `${subject.name} placement preparation.` };
}

export default async function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);
  if (!subject) notFound();

  const [sections, bookmarkedIds] = await Promise.all([
    Promise.all(
      SUBJECT_SECTIONS.map(async (type) => ({
        type,
        resources: await listResourcesBySubjectAndType(subject.id, type),
      }))
    ),
    getBookmarkedIds(),
  ]);

  const hasAny = sections.some((s) => s.resources.length > 0);

  return (
    <div className="container py-16">
      <div className="glass-card mb-10 p-8">
        <p className="text-sm text-accent">Subject</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{subject.name}</h1>
        {subject.description && <p className="mt-3 max-w-2xl text-muted-foreground">{subject.description}</p>}
      </div>

      {!hasAny ? (
        <EmptyState title="No material published yet" description={`Resources for ${subject.name} will appear here as they are added.`} />
      ) : (
        sections.map((s) => (
          <ResourceSection
            key={s.type}
            title={s.type}
            resources={s.resources}
            bookmarkedIds={bookmarkedIds}
            viewAllHref={`/resources?subject=${subject.slug}&type=${encodeURIComponent(s.type)}`}
          />
        ))
      )}
    </div>
  );
}
