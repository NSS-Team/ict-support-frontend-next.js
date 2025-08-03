import { z } from "zod";
import { boolean } from "zod";
import { teamWorkerSchema } from "./teamWorker";

// workerId: number
//     workerUserId: string
//     workerName: unknown
//     teamId: number
//     status: "active" | "busy"
//     near: boolean


export const workerAssignmentSchema = teamWorkerSchema.extend({
    near: boolean().optional(),
    queueCount: z.number().optional(),
    isAssignedToThisComplaint: z.boolean().optional(),
});

export type WorkerAssignment = z.infer<typeof workerAssignmentSchema>;