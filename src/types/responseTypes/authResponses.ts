// this file contains the type decalarations for the auth responses using zod


import { z } from 'zod';

export const loginCheckResponseSchema = z.object({
  exist: z.boolean(),
  approved: z.boolean(),
});

export type LoginCheckResponse = z.infer<typeof loginCheckResponseSchema>;
