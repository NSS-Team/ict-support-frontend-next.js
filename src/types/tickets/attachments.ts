import z from 'zod';

// export const attachmentSchema = z.object({
//     url: z.string().url(),
// });

export const attachmentSchema = z.object({
    note: z.string().optional(),
    type: z.string(),
    url: z.string().url(),
});
