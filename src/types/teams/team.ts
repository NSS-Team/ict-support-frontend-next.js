import {z} from 'zod';

export const teamSchema = z.object({
    id : z.number(),
    name : z.string(),
    description : z.string(),
    createdAt : z.string(),
    updatedAt : z.string(),
});

export type Team = z.infer<typeof teamSchema>;