import { z } from 'zod';
import { complaintStatusEnum } from '../enums';

export const complaintLogSchema = z.object({
  id: z.number(),
  complaintId: z.number(),
  status: complaintStatusEnum,
  changedBy: z.string(),
  comment: z.string().optional().nullable(),
  timestamp: z.date(),
});

export type ComplaintLog = z.infer<typeof complaintLogSchema>;
