import {z} from 'zod';

export const locationsSchema = z.object({
    id: z.number(),
    name: z.string(),
});
