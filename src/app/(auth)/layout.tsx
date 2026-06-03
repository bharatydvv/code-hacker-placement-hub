import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { SITE } from '@/lib/constants';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <span className="text-gradient text-lg">{SITE.name}</span>
        </Link>
        <div className="glass-card p-8">{children}</div>
      </div>
    </main>
  );
}
