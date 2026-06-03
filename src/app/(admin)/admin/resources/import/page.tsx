import type { Metadata } from 'next';
import { BulkImport } from '@/components/admin/bulk-import';

export const metadata: Metadata = { title: 'Bulk Import' };

export default function ImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Bulk Import</h1>
        <p className="mt-1 text-sm text-muted-foreground">Upload thousands of resources at once from CSV or Excel. Rows are validated and inserted in chunks.</p>
      </div>
      <BulkImport />
    </div>
  );
}
