import Link from 'next/link';
import type { Metadata } from 'next';
import { AuthForm, GoogleButton } from '@/components/auth/auth-form';
import { signInWithPassword, signInWithGoogle } from '../actions';

export const metadata: Metadata = { title: 'Login' };

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to continue your preparation.</p>
      </div>
      <AuthForm
        action={signInWithPassword}
        label="Sign in"
        fields={[
          { name: 'email', type: 'email', placeholder: 'you@example.com', label: 'Email' },
          { name: 'password', type: 'password', placeholder: '••••••••', label: 'Password' },
        ]}
        footer={
          <div className="flex items-center justify-between text-sm">
            <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground">Forgot password?</Link>
            <Link href="/signup" className="text-accent hover:underline">Create account</Link>
          </div>
        }
      />
      <div className="relative text-center text-xs text-muted-foreground">
        <span className="bg-transparent px-2">or</span>
      </div>
      <GoogleButton action={signInWithGoogle} />
    </div>
  );
}
