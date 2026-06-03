'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { RESOURCE_TYPES } from '@/lib/constants';
import type { ResourceWithRelations } from '@/types/database';

type Option = { id: string; name: string };
type State = { error?: string } | undefined;
type Action = (prev: State, formData: FormData) => Promise<State>;

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? 'Saving…' : label}</Button>;
}

const field = 'w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30';

export function ResourceForm({ action, subjects, companies, resource, submitLabel }: {
  action: Action; subjects: Option[]; companies: Option[]; resource?: ResourceWithRelations; submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, undefined);
  return (
    <form action={formAction} className="space-y-5 max-w-2xl">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Title</label>
        <input name="title" defaultValue={resource?.title} required className={field} placeholder="e.g. DBMS Normalization Notes" />
        <p className="text-xs text-muted-foreground">A unique SEO slug is generated automatically from the title.</p>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Description</label>
        <textarea name="description" defaultValue={resource?.description ?? ''} rows={4} className={field} placeholder="Short summary of the material" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Resource Type</label>
          <select name="resourceType" defaultValue={resource?.resource_type ?? ''} required className={field}>
            <option value="" disabled>Select type</option>
            {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Subject (optional)</label>
          <select name="subjectId" defaultValue={resource?.subject_id ?? ''} className={field}>
            <option value="">None</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Company (optional)</label>
          <select name="companyId" defaultValue={resource?.company_id ?? ''} className={field}>
            <option value="">None</option>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Thumbnail URL (optional)</label>
          <input name="thumbnailUrl" defaultValue={resource?.thumbnail_url ?? ''} className={field} placeholder="https://…" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Google Drive Link</label>
        <input name="driveLink" defaultValue={resource?.drive_link} required className={field} placeholder="https://drive.google.com/…" />
        <p className="text-xs text-muted-foreground">Only the Drive link is stored. The PDF itself stays in Google Drive.</p>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={resource?.published ?? true} className="h-4 w-4 rounded border-white/20 bg-white/5" />
        Publish immediately
      </label>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Submit label={submitLabel} />
    </form>
  );
}
