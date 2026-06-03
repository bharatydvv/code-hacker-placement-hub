import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ProfileForm } from '@/components/dashboard/profile-form';
import { Card, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let fullName = '';
  if (user) {
    const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
    fullName = data?.full_name ?? '';
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Profile Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account details.</p>
      </div>
      <Card>
        <CardTitle className="mb-4">Account</CardTitle>
        <ProfileForm fullName={fullName} email={user?.email ?? ''} />
      </Card>
    </div>
  );
}
