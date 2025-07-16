import { z } from 'zod';

export const baseUserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  is_approved: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});