import { z } from 'zod';
import { userRoleEnum } from './enums';
import { fi } from 'zod/v4/locales';

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  officeNumber: z.string(),
  department: z.string(),
  designation: z.string(),
  phone: z.string(),
  locationId: z.string(),
  role: userRoleEnum,
  is_approved: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;



