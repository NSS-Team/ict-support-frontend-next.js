import {z} from 'zod';
import { responseSchema } from '~/lib/responseSchema';

// Schema for individual unapproved registration
export const unapprovedRegistrationSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  picUrl: z.string().url().nullable(),
  phone: z.string().nullable(),
  role: z.string(),
  department: z.string(),
  officeNumber: z.string().nullable(),
  designation: z.string().nullable(),
  locationId: z.number(),
  location: z.string(),
  createdAt: z.string().datetime(),
  teamName: z.string().nullable(),
});

// Schema for the array of unapproved registrations
export const unapprovedRegistrationsDataSchema = z.object({
    unapprovedUsers: z.array(unapprovedRegistrationSchema),
});
export const unapprovedRegistrationsResponseSchema = responseSchema(unapprovedRegistrationsDataSchema);
