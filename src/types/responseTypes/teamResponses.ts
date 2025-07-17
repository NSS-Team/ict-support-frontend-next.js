import {z} from "zod";

export const getTeamDataSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const getTeamResponseSchema = z.object({
    data: getTeamDataSchema,
    message: z.string(),
    success: z.boolean(),
});

export type GetTeamResponse = z.infer<typeof getTeamResponseSchema>;
export type GetTeamData = z.infer<typeof getTeamDataSchema>;