import { z } from 'zod';
import { attachmentRoleEnum } from './enums';

export const attachmentSchema = z.object({
  id: z.number(),
  complaintId: z.number(),
  type: z.string().max(50),
  url: z.string().url(),
  note: z.string().nullable().optional(),
  role: attachmentRoleEnum,
  createdAt: z.date(),
});

export type Attachment = z.infer<typeof attachmentSchema>;