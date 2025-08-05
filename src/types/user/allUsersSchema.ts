import { z } from 'zod';
import { userRolesEnum } from '../enums';

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  picUrl: z.string().optional(),
  officeNumber: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  phone: z.string(),
  locationName: z.string().optional(),
  role: userRolesEnum,
  is_approved: z.number().transform((val) => val === 1), // Convert 1/0 to boolean
  codesGenerated: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  teamName: z.string().optional(),
  points: z.number().optional().default(0),
});

export const getAllUsersResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z.array(userSchema),
});

export type User = z.infer<typeof userSchema>;
export type GetAllUsersResponse = z.infer<typeof getAllUsersResponseSchema>;
