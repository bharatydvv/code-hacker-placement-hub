import Link from 'next/link';
import type { Metadata } from 'next';
import { AuthForm, GoogleButton } from '@/components/auth/auth-form';
import { signUp, signInWithGoogle } from '../actions';

export const metadata: Metadata = { title: 'Sign up' };

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Start preparing smarter today.</p>
      </div>
      <AuthForm
        action={signUp}
        label="Create account"
        fields={[
          { name: 'fullName', type: 'text', placeholder: 'Your name', label: 'Full name' },
          { name: 'email', type: 'email', placeholder: 'you@example.com', label: 'Email' },
          { name: 'password', type: 'password', placeholder: 'At least 8 characters', label: 'Password' },
        ]}
        footer={
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-accent hover:underline">Sign in</Link>
          </p>
        }
      />
      <div className="relative text-center text-xs text-muted-foreground"><span className="px-2">or</span></div>
      <GoogleButton action={signInWithGoogle} />
    </div>
  );
}
