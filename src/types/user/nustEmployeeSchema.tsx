import { baseUserSchema } from "./baseUserSchema";
import { z } from "zod";

export const nustEmployeeSchema = baseUserSchema.extend({
    officeNumber: z.string().optional(),
    department: z.string().optional(),
    designation: z.string().optional(),
    locationId: z.string(),
    role: z.string(),
});

export type NustEmployee = z.infer<typeof nustEmployeeSchema>;