import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCompanyBySlug, listResourcesByCompanyAndType, getBookmarkedIds } from '@/lib/resource-queries';
import { ResourceSection } from '@/components/resources/resource-section';
import { EmptyState } from '@/components/shared/empty-state';
import { JsonLd, courseSchema, faqSchema } from '@/components/seo/json-ld';

export const revalidate = 120;
const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const COMPANY_SECTIONS = [
  'Technical Questions',
  'HR Questions',
  'Interview Experience',
  'PYQs',
  'Interview Questions',
  'Quick Notes',
] as const;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) return { title: 'Company' };
  return { title: company.name, description: company.description ?? `${company.name} placement preparation.` };
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) notFound();

  const [sections, bookmarkedIds] = await Promise.all([
    Promise.all(
      COMPANY_SECTIONS.map(async (type) => ({
        type,
        resources: await listResourcesByCompanyAndType(company.id, type),
      }))
    ),
    getBookmarkedIds(),
  ]);
  const hasAny = sections.some((s) => s.resources.length > 0);

  const faq = faqSchema([
    { question: `How do I prepare for ${company.name} placements?`, answer: `Use ${company.name}'s technical & HR questions, PYQs, interview experiences and preparation notes available on this page.` },
    { question: `Are ${company.name} previous year questions available?`, answer: `Yes, ${company.name} PYQs are published here and updated regularly.` },
  ]);
  return (
    <div className="container py-16">
      <JsonLd data={[courseSchema({ name: `${company.name} Placement Preparation`, description: company.description, url: `${BASE}/companies/${company.slug}` }), faq]} />
      <div className="glass-card mb-10 flex items-center gap-5 p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 text-2xl font-bold text-accent">
          {company.name[0]}
        </div>
        <div>
          <p className="text-sm text-accent">Company</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{company.name}</h1>
          {company.description && <p className="mt-2 text-muted-foreground">{company.description}</p>}
        </div>
      </div>

      {!hasAny ? (
        <EmptyState title="No material published yet" description={`Resources for ${company.name} will appear here as they are added.`} />
      ) : (
        sections.map((s) => (
          <ResourceSection
            key={s.type}
            title={s.type}
            resources={s.resources}
            bookmarkedIds={bookmarkedIds}
            viewAllHref={`/resources?company=${company.slug}&type=${encodeURIComponent(s.type)}`}
          />
        ))
      )}
    </div>
  );
}
