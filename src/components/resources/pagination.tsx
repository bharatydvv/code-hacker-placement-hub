import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Pagination({ page, totalPages, params }: { page: number; totalPages: number; params: Record<string, string | undefined> }) {
  if (totalPages <= 1) return null;
  const build = (p: number) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) sp.set(k, v); });
    sp.set('page', String(p));
    return `/resources?${sp.toString()}`;
  };
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );
  return (
    <nav className="mt-10 flex items-center justify-center gap-2">
      {page > 1 && <Link href={build(page - 1)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">Prev</Link>}
      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const gap = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {gap && <span className="text-muted-foreground">…</span>}
            <Link href={build(p)} className={cn('rounded-lg border px-3 py-2 text-sm', p === page ? 'border-primary/50 bg-primary/20 text-foreground' : 'border-white/10 bg-white/5 hover:bg-white/10')}>{p}</Link>
          </span>
        );
      })}
      {page < totalPages && <Link href={build(page + 1)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">Next</Link>}
    </nav>
  );
}
