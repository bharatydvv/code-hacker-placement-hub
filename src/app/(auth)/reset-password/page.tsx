import type { Metadata } from 'next';
import { AuthForm } from '@/components/auth/auth-form';
import { updatePassword } from '../actions';

export const metadata: Metadata = { title: 'Set new password' };

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Set a new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">Choose a strong password for your account.</p>
      </div>
      <AuthForm
        action={updatePassword}
        label="Update password"
        fields={[{ name: 'password', type: 'password', placeholder: 'At least 8 characters', label: 'New password' }]}
      />
    </div>
  );
}
