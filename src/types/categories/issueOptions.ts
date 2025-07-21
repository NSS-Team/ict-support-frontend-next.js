import z from 'zod';

export const issueOptionSchema = z.object({
    id: z.string(),
    name: z.string(),
});