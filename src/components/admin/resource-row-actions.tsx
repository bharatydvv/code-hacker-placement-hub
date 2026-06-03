'use client';
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { setPublished, deleteResource } from '@/app/(admin)/actions/resources';

export function ResourceRowActions({ id, published }: { id: string; published: boolean }) {
  const [isPub, setIsPub] = useState(published);
  const [pending, startTransition] = useTransition();

  function togglePublish() {
    startTransition(async () => {
      const next = !isPub;
      setIsPub(next);
      await setPublished(id, next);
    });
  }
  function onDelete() {
    if (!confirm('Delete this resource? This cannot be undone.')) return;
    startTransition(async () => { await deleteResource(id); });
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button size="sm" variant="ghost" onClick={togglePublish} disabled={pending} title={isPub ? 'Unpublish' : 'Publish'}>
        {isPub ? <Eye className="h-4 w-4 text-accent" /> : <EyeOff className="h-4 w-4" />}
      </Button>
      <Button size="sm" variant="ghost" asChild title="Edit"><Link href={`/admin/resources/${id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
      <Button size="sm" variant="ghost" onClick={onDelete} disabled={pending} title="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
    </div>
  );
}
