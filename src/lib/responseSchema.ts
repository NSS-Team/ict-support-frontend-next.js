import { z } from 'zod';

// This is a generic function that returns a Zod schema for the full response
export const responseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema.optional(), // Optional in case of errors
  });