import Link from 'next/link';
import { SITE } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="container py-12 grid gap-8 md:grid-cols-4">
        <div>
          <p className="font-semibold text-gradient">{SITE.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">{SITE.description}</p>
        </div>
        <div className="text-sm space-y-2">
          <p className="font-medium">Prepare</p>
          <Link href="/subjects" className="block text-muted-foreground hover:text-foreground">Subjects</Link>
          <Link href="/companies" className="block text-muted-foreground hover:text-foreground">Companies</Link>
          <Link href="/resources" className="block text-muted-foreground hover:text-foreground">Resources</Link>
        </div>
        <div className="text-sm space-y-2">
          <p className="font-medium">Account</p>
          <Link href="/login" className="block text-muted-foreground hover:text-foreground">Login</Link>
          <Link href="/signup" className="block text-muted-foreground hover:text-foreground">Sign up</Link>
          <Link href="/dashboard" className="block text-muted-foreground hover:text-foreground">Dashboard</Link>
        </div>
        <div className="text-sm space-y-2">
          <p className="font-medium">Aptitude</p>
          <Link href="/aptitude" className="block text-muted-foreground hover:text-foreground">Aptitude Practice</Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
