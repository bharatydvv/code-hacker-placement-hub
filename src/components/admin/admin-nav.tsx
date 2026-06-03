'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/resources', label: 'Resources' },
  { href: '/admin/resources/new', label: 'Add Resource' },
  { href: '/admin/resources/import', label: 'Bulk Import' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col">
      {LINKS.map((l) => {
        const active = pathname === l.href;

        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              'flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors',
              active
                ? 'bg-white/10 text-foreground'
                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}