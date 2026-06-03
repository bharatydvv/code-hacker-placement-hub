import type { Metadata } from 'next';
import { adminListSubjects, adminListCompanies } from '@/lib/admin-queries';
import { ResourceForm } from '@/components/admin/resource-form';
import { createResource } from '@/app/(admin)/actions/resources';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Add Resource' };

export default async function NewResourcePage() {
  const [subjects, companies] = await Promise.all([adminListSubjects(), adminListCompanies()]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Add Resource</h1>
        <p className="mt-1 text-sm text-muted-foreground">Fill the form once — the CMS auto-routes it to the right subject/company sections.</p>
      </div>
      <Card>
        <CardTitle>Resource details</CardTitle>
        <CardDescription className="mb-5">Subject + Type and Company + Type determine where this appears automatically.</CardDescription>
        <ResourceForm action={createResource} subjects={subjects} companies={companies} submitLabel="Create resource" />
      </Card>
    </div>
  );
}
