// logs: {
//     id: number
//     complaintId: number
//     comment: string | null
//     status: "waiting_assignment" | "assigned" | "in_progress" | "resolved" | "closed" | "escalated_level_1" | "escalated_level_2"
//     changedByName: unknown
// }

import { z } from "zod";    
import { complaintStatusEnum } from "../enums";
// import { timeStamp } from "console";

export const logSchema = z.object({
    id: z.number(),
    complaintId: z.string(),
    comment: z.string().nullable(),
    status: complaintStatusEnum,
    changedByName: z.string().nullable(),
    timeStamp: z.string(), // Assuming timeStamp is a string, adjust if it's a Date or other type
});

export type log = z.infer<typeof logSchema>;
