import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAdminResource, adminListSubjects, adminListCompanies } from '@/lib/admin-queries';
import { ResourceForm } from '@/components/admin/resource-form';
import { updateResource } from '@/app/(admin)/actions/resources';
import { Card, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Edit Resource' };

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [resource, subjects, companies] = await Promise.all([
    getAdminResource(id), adminListSubjects(), adminListCompanies(),
  ]);
  if (!resource) notFound();
  const action = updateResource.bind(null, id);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Edit Resource</h1>
      <Card>
        <CardTitle className="mb-5">{resource.title}</CardTitle>
        <ResourceForm action={action} subjects={subjects} companies={companies} resource={resource} submitLabel="Save changes" />
      </Card>
    </div>
  );
}
