'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { generateSlug, slugify } from '@/lib/slug';
import { resourceSchema } from '@/lib/resource-schema';
import { RESOURCE_TYPES, type ResourceType } from '@/lib/constants';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, ok: false as const };
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  return { supabase, ok: profile?.role === 'admin', userId: user.id };
}

export async function createResource(_prev: unknown, formData: FormData) {
  const { supabase, ok, userId } = await requireAdmin();
  if (!ok) return { error: 'Admin access required' };

  const parsed = resourceSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') ?? '',
    resourceType: formData.get('resourceType'),
    subjectId: formData.get('subjectId') ?? '',
    companyId: formData.get('companyId') ?? '',
    driveLink: formData.get('driveLink'),
    thumbnailUrl: formData.get('thumbnailUrl') ?? '',
    published: formData.get('published') === 'on',
  });
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? 'Invalid input' };
  const v = parsed.data;

  const { error } = await supabase.from('resources').insert({
    slug: generateSlug(v.title),
    title: v.title,
    description: v.description || null,
    resource_type: v.resourceType,
    subject_id: v.subjectId,
    company_id: v.companyId,
    drive_link: v.driveLink,
    thumbnail_url: v.thumbnailUrl,
    published: v.published,
    created_by: userId,
  });
  if (error) return { error: error.message };
  revalidatePath('/admin/resources');
  redirect('/admin/resources');
}

export async function updateResource(id: string, _prev: unknown, formData: FormData) {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { error: 'Admin access required' };

  const parsed = resourceSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') ?? '',
    resourceType: formData.get('resourceType'),
    subjectId: formData.get('subjectId') ?? '',
    companyId: formData.get('companyId') ?? '',
    driveLink: formData.get('driveLink'),
    thumbnailUrl: formData.get('thumbnailUrl') ?? '',
    published: formData.get('published') === 'on',
  });
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? 'Invalid input' };
  const v = parsed.data;

  const { error } = await supabase.from('resources').update({
    title: v.title,
    description: v.description || null,
    resource_type: v.resourceType,
    subject_id: v.subjectId,
    company_id: v.companyId,
    drive_link: v.driveLink,
    thumbnail_url: v.thumbnailUrl,
    published: v.published,
    updated_at: new Date().toISOString(),
  }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/resources');
  redirect('/admin/resources');
}

export async function setPublished(id: string, published: boolean) {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { error: 'Admin access required' };
  await supabase.from('resources').update({ published }).eq('id', id);
  revalidatePath('/admin/resources');
  return { ok: true };
}

export async function deleteResource(id: string) {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { error: 'Admin access required' };
  await supabase.from('resources').delete().eq('id', id);
  revalidatePath('/admin/resources');
  return { ok: true };
}

export interface BulkInsertRow {
  title: string;
  description?: string;
  resourceType: string;
  subject?: string; // name or slug
  company?: string; // name or slug
  driveLink: string;
  thumbnailUrl?: string;
}

// Chunked bulk insert; resolves subject/company by slug or name. Returns counts.
export async function bulkCreateResources(rows: BulkInsertRow[]) {
  const { supabase, ok, userId } = await requireAdmin();
  if (!ok) return { error: 'Admin access required' };

  const [{ data: subjects }, { data: companies }] = await Promise.all([
    supabase.from('subjects').select('id, slug, name'),
    supabase.from('companies').select('id, slug, name'),
  ]);
  const subjectMap = new Map<string, string>();
  (subjects ?? []).forEach((s: { id: string; slug: string; name: string }) => {
    subjectMap.set(s.slug, s.id); subjectMap.set(s.name.toLowerCase(), s.id);
  });
  const companyMap = new Map<string, string>();
  (companies ?? []).forEach((c: { id: string; slug: string; name: string }) => {
    companyMap.set(c.slug, c.id); companyMap.set(c.name.toLowerCase(), c.id);
  });
  const validTypes = new Set<string>(RESOURCE_TYPES as readonly string[]);

  const records: Record<string, unknown>[] = [];
  let skipped = 0;
  for (const r of rows) {
    if (!r.title || !r.driveLink || !validTypes.has(r.resourceType)) { skipped++; continue; }
    const subjectId = r.subject ? subjectMap.get(r.subject.toLowerCase()) ?? subjectMap.get(slugify(r.subject)) ?? null : null;
    const companyId = r.company ? companyMap.get(r.company.toLowerCase()) ?? companyMap.get(slugify(r.company)) ?? null : null;
    records.push({
      slug: generateSlug(r.title),
      title: r.title,
      description: r.description || null,
      resource_type: r.resourceType as ResourceType,
      subject_id: subjectId,
      company_id: companyId,
      drive_link: r.driveLink,
      thumbnail_url: r.thumbnailUrl || null,
      published: true,
      created_by: userId,
    });
  }

  let inserted = 0;
  const CHUNK = 200;
  for (let i = 0; i < records.length; i += CHUNK) {
    const chunk = records.slice(i, i + CHUNK);
    const { error, count } = await supabase.from('resources').insert(chunk, { count: 'exact' });
    if (!error) inserted += count ?? chunk.length;
  }
  revalidatePath('/admin/resources');
  return { inserted, skipped };
}
