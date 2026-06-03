'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { Search } from 'lucide-react';
import { RESOURCE_TYPES } from '@/lib/constants';

type Option = { slug: string; name: string };

export function SearchFilters({ subjects, companies }: { subjects: Option[]; companies: Option[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get('q') ?? '');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const push = useCallback(
    (next: URLSearchParams) => {
      next.delete('page');
      startTransition(() => router.push(`/resources?${next.toString()}`));
    },
    [router]
  );

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    push(next);
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (q) next.set('q', q);
      else next.delete('q');
      push(next);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const select = 'rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30';

  return (
    <div className="glass-card mb-8 p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title or description…"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select className={select} defaultValue={params.get('subject') ?? ''} onChange={(e) => setParam('subject', e.target.value)}>
          <option value="">All subjects</option>
          {subjects.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
        </select>
        <select className={select} defaultValue={params.get('company') ?? ''} onChange={(e) => setParam('company', e.target.value)}>
          <option value="">All companies</option>
          {companies.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <select className={select} defaultValue={params.get('type') ?? ''} onChange={(e) => setParam('type', e.target.value)}>
          <option value="">All types</option>
          {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      {isPending && <p className="mt-2 text-xs text-muted-foreground">Updating results…</p>}
    </div>
  );
}
