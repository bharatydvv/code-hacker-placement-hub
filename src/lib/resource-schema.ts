import { z } from 'zod';
import { RESOURCE_TYPES } from '@/lib/constants';

export const resourceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional().default(''),
  resourceType: z.enum(RESOURCE_TYPES, { errorMap: () => ({ message: 'Invalid resource type' }) }),
  subjectId: z.string().uuid().optional().or(z.literal('')).transform((v) => (v ? v : null)),
  companyId: z.string().uuid().optional().or(z.literal('')).transform((v) => (v ? v : null)),
  driveLink: z.string().url('Drive link must be a valid URL'),
  thumbnailUrl: z.string().url('Thumbnail must be a valid URL').optional().or(z.literal('')).transform((v) => (v ? v : null)),
  published: z.boolean().optional().default(false),
});

export type ResourceInput = z.infer<typeof resourceSchema>;

// Row shape for bulk CSV/XLSX import (slugs/names resolved server-side).
export const bulkRowSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional().default(''),
  resourceType: z.enum(RESOURCE_TYPES),
  subject: z.string().optional().default(''),
  company: z.string().optional().default(''),
  driveLink: z.string().url(),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
});
export type BulkRow = z.infer<typeof bulkRowSchema>;
