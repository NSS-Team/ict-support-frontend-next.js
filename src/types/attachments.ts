import { z } from 'zod';
import { attachmentRoleEnum } from './enums';

export const attachmentSchema = z.object({
  type: z.string().max(50),
  url: z.string().url(),
  note: z.string().nullable().optional(),
});

export type Attachment = z.infer<typeof attachmentSchema>;