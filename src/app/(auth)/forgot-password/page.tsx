import Link from 'next/link';
import type { Metadata } from 'next';
import { AuthForm } from '@/components/auth/auth-form';
import { requestPasswordReset } from '../actions';

export const metadata: Metadata = { title: 'Forgot password' };

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="mt-1 text-sm text-muted-foreground">We’ll email you a secure reset link.</p>
      </div>
      <AuthForm
        action={requestPasswordReset}
        label="Send reset link"
        fields={[{ name: 'email', type: 'email', placeholder: 'you@example.com', label: 'Email' }]}
        footer={<Link href="/login" className="text-sm text-accent hover:underline">Back to login</Link>}
      />
    </div>
  );
}
