'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function updateProfile(_prev: unknown, formData: FormData) {
  const fullName = String(formData.get('fullName') ?? '').trim();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  if (fullName.length < 2) return { error: 'Please enter a valid name' };
  const { error } = await supabase.from('profiles').update({ full_name: fullName, updated_at: new Date().toISOString() }).eq('id', user.id);
  if (error) return { error: error.message };
  revalidatePath('/dashboard/settings');
  return { success: 'Profile updated' };
}
