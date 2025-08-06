import z from "zod";
export const securityCodeSchema = z.object({
    id: z.number(),
    code: z.string(),
    userId: z.string(),
});

// an array of the security codes
export type SecurityCode = z.infer<typeof securityCodeSchema>;