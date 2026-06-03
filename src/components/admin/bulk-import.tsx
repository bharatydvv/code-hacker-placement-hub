'use client';
import { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Upload, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bulkRowSchema } from '@/lib/resource-schema';
import { bulkCreateResources, type BulkInsertRow } from '@/app/(admin)/actions/resources';

interface ParsedRow extends BulkInsertRow { _valid: boolean; _error?: string }

// Map flexible header names to our fields.
function normalize(raw: Record<string, unknown>): BulkInsertRow {
  const get = (...keys: string[]) => {
    for (const k of Object.keys(raw)) {
      if (keys.includes(k.trim().toLowerCase())) return String(raw[k] ?? '').trim();
    }
    return '';
  };
  return {
    title: get('title'),
    description: get('description'),
    resourceType: get('resource type', 'resourcetype', 'type'),
    subject: get('subject'),
    company: get('company'),
    driveLink: get('drive link', 'drivelink', 'drive', 'link'),
    thumbnailUrl: get('thumbnail', 'thumbnail url', 'thumbnailurl'),
  };
}

function validate(row: BulkInsertRow): ParsedRow {
  const res = bulkRowSchema.safeParse(row);
  return { ...row, _valid: res.success, _error: res.success ? undefined : res.error.errors[0]?.message };
}

export function BulkImport() {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ inserted: number; skipped: number } | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'csv') {
      Papa.parse(file, {
        header: true, skipEmptyLines: true,
        complete: (out) => setRows((out.data as Record<string, unknown>[]).map((r) => validate(normalize(r)))),
      });
    } else {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf);
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
      setRows(json.map((r) => validate(normalize(r))));
    }
  }

  async function onSubmit() {
    setSubmitting(true);
    const valid = rows.filter((r) => r._valid).map(({ _valid, _error, ...rest }) => rest);
    const res = await bulkCreateResources(valid);
    setSubmitting(false);
    if (res && 'inserted' in res) setResult({ inserted: res.inserted, skipped: res.skipped + (rows.length - valid.length) });
  }

  const validCount = rows.filter((r) => r._valid).length;
  const invalidCount = rows.length - validCount;

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center hover:border-white/30">
          <Upload className="h-7 w-7 text-accent" />
          <span className="text-sm font-medium">Click to upload CSV or Excel (.xlsx)</span>
          <span className="text-xs text-muted-foreground">Columns: Title, Description, Resource Type, Subject, Company, Drive Link, Thumbnail</span>
          <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={onFile} />
        </label>
        {fileName && <p className="mt-3 text-sm text-muted-foreground">Loaded: {fileName}</p>}
      </div>

      {rows.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5 text-accent"><CheckCircle2 className="h-4 w-4" />{validCount} valid</span>
              {invalidCount > 0 && <span className="inline-flex items-center gap-1.5 text-destructive"><AlertTriangle className="h-4 w-4" />{invalidCount} invalid</span>}
            </div>
            <Button onClick={onSubmit} disabled={submitting || validCount === 0}>{submitting ? 'Importing…' : `Import ${validCount} resources`}</Button>
          </div>
          <div className="max-h-[420px] overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background/80 text-left text-muted-foreground backdrop-blur">
                <tr><th className="px-4 py-2 font-medium">Status</th><th className="px-4 py-2 font-medium">Title</th><th className="px-4 py-2 font-medium">Type</th><th className="px-4 py-2 font-medium">Subject</th><th className="px-4 py-2 font-medium">Company</th></tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="px-4 py-2">{r._valid ? <span className="text-accent">OK</span> : <span className="text-destructive" title={r._error}>Error</span>}</td>
                    <td className="max-w-xs truncate px-4 py-2">{r.title || <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-4 py-2">{r.resourceType}</td>
                    <td className="px-4 py-2 text-muted-foreground">{r.subject || '—'}</td>
                    <td className="px-4 py-2 text-muted-foreground">{r.company || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result && (
        <div className="glass-card p-5 text-sm">
          <p className="text-accent">Imported {result.inserted} resources.</p>
          {result.skipped > 0 && <p className="text-muted-foreground">Skipped {result.skipped} invalid/duplicate rows.</p>}
        </div>
      )}
    </div>
  );
}
