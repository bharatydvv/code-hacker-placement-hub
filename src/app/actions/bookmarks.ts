'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function toggleBookmark(resourceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be signed in to bookmark.' };

  const { data: existing } = await supabase
    .from('bookmarks')
    .select('resource_id')
    .eq('user_id', user.id)
    .eq('resource_id', resourceId)
    .maybeSingle();

  if (existing) {
    await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('resource_id', resourceId);
    revalidatePath('/dashboard');
    return { bookmarked: false };
  }
  await supabase.from('bookmarks').insert({ user_id: user.id, resource_id: resourceId });
  revalidatePath('/dashboard');
  return { bookmarked: true };
}
