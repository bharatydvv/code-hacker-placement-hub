'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { updateProfile } from '@/app/(app)/actions/profile';

function Save() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save changes'}</Button>;
}

export function ProfileForm({ fullName, email }: { fullName: string; email: string }) {
 const [state, action] = useActionState(updateProfile, undefined);
  return (
    <form action={action} className="space-y-4 max-w-lg">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-white">
          {(fullName || email || '?')[0]?.toUpperCase()}
        </div>
        <div className="text-sm text-muted-foreground">Profile picture uses your initial. Avatar upload can be added with Supabase Storage.</div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="fullName" className="text-sm font-medium">Full name</label>
        <input id="fullName" name="fullName" defaultValue={fullName} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Email</label>
        <input value={email} disabled className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-sm text-muted-foreground" />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-accent">{state.success}</p>}
      <Save />
    </form>
  );
}
