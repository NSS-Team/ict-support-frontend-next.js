import { z } from 'zod';
import { responseSchema } from '~/lib/responseSchema';

const issueSchema = z.object({
  id: z.number(),
  subCategoryId: z.number(),
  name: z.string(),
});

const subcategorySchema = z.object({
  id: z.number(),
  categoryId: z.number(),
  name: z.string(),
  issues: z.array(issueSchema),
});

const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  subcategories: z.array(subcategorySchema),
});

// ✅ Wrap it as a single object, not array
export const categoryResponseSchema = responseSchema(categorySchema);

// Types
export type Category = z.infer<typeof categorySchema>;
export type SubCategory = z.infer<typeof subcategorySchema>;
export type Issue = z.infer<typeof issueSchema>;
export type CategoryResponse = z.infer<typeof categoryResponseSchema>;