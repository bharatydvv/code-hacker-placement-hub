import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { SignOutButton } from '@/components/dashboard/sign-out-button';
import { SITE } from '@/lib/constants';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/60 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary"><Sparkles className="h-4 w-4 text-white" /></span>
            <span className="hidden sm:inline text-gradient">{SITE.name}</span>
          </Link>
          <SignOutButton />
        </div>
      </header>
      <div className="container grid gap-8 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit"><DashboardSidebar /></aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
