import { customAlphabet } from 'nanoid';

const nano = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6);

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['\u2019]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

// Slugified title + short unique suffix, e.g. dbms-normalization-notes-a1b2c3
export function generateSlug(title: string): string {
  const base = slugify(title) || 'resource';
  return `${base}-${nano()}`;
}
