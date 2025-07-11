import { z } from 'zod';

export const ratingSchema = z.object({
  id: z.number(),
  complaintId: z.number(),
  employeeId: z.string().min(1),
  score: z.number().min(1).max(5), // assume a 1–5 scale
  feedback: z.string().optional().nullable(),
  createdAt: z.date(),
});

export type Rating = z.infer<typeof ratingSchema>;
