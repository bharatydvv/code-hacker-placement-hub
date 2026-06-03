'use client';
import { useState } from 'react';
import { ExternalLink, Download, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toggleBookmark } from '@/app/actions/bookmarks';

export function ResourceActions({ resourceId, driveLink, bookmarked = false }: { resourceId: string; driveLink: string; bookmarked?: boolean }) {
  const [saved, setSaved] = useState(bookmarked);
  const [pending, setPending] = useState(false);

  async function track(kind: 'view' | 'download') {
    try {
      await fetch(`/api/track/${kind}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId }),
        keepalive: true,
      });
    } catch { /* non-blocking */ }
  }

  function open(kind: 'view' | 'download') {
    track(kind);
    window.open(driveLink, '_blank', 'noopener,noreferrer');
  }

  async function onBookmark() {
    setPending(true);
    const prev = saved;
    setSaved(!prev);
    const res = await toggleBookmark(resourceId);
    if (res?.error) setSaved(prev);
    setPending(false);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => open('view')}><ExternalLink className="h-4 w-4" /> View Material</Button>
      <Button variant="accent" onClick={() => open('download')}><Download className="h-4 w-4" /> Download Material</Button>
      <Button variant="outline" onClick={onBookmark} disabled={pending}>
        <Bookmark className={saved ? 'h-4 w-4 fill-accent text-accent' : 'h-4 w-4'} /> {saved ? 'Bookmarked' : 'Bookmark'}
      </Button>
    </div>
  );
}
