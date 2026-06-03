'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, Download, Bookmark } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ResourceWithRelations } from '@/types/database';
import { useState } from 'react';
import { toggleBookmark } from '@/app/actions/bookmarks';

export function ResourceCard({ resource, bookmarked = false }: { resource: ResourceWithRelations; bookmarked?: boolean }) {
  const [saved, setSaved] = useState(bookmarked);
  const [pending, setPending] = useState(false);

  async function onBookmark() {
    setPending(true);
    const prev = saved;
    setSaved(!prev);
    const res = await toggleBookmark(resource.id);
    if (res?.error) setSaved(prev);
    setPending(false);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
      <div className="glass-card overflow-hidden h-full flex flex-col transition-colors hover:border-white/20">
        <div className="relative h-36 w-full bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/10">
          {resource.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resource.thumbnail_url} alt={resource.title} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center text-3xl font-bold text-white/20">{resource.resource_type[0]}</div>
          )}
          <div className="absolute left-3 top-3"><Badge>{resource.resource_type}</Badge></div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex flex-wrap gap-2">
            {resource.subject?.name && <Badge className="bg-primary/15">{resource.subject.name}</Badge>}
            {resource.company?.name && <Badge className="bg-secondary/15">{resource.company.name}</Badge>}
          </div>
          <Link href={`/resources/${resource.slug}`} className="font-semibold leading-snug hover:text-accent">{resource.title}</Link>
          {resource.description && <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{resource.description}</p>}
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{resource.view_count}</span>
            <span className="inline-flex items-center gap-1"><Download className="h-3.5 w-3.5" />{resource.download_count}</span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Button asChild size="sm" className="flex-1"><Link href={`/resources/${resource.slug}`}>View</Link></Button>
            <Button size="sm" variant="outline" onClick={onBookmark} disabled={pending} aria-label="Bookmark">
              <Bookmark className={saved ? 'h-4 w-4 fill-accent text-accent' : 'h-4 w-4'} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
