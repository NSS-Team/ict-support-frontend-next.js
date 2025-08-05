import { z } from "zod";
import { teamWorkerStatusEnum } from "../enums";

export const teamWorkerSchema = z.object({
  workerId: z.number(),
  workerUserId: z.string(),
  teamId: z.number(),
  workerName: z.string(),
  status: teamWorkerStatusEnum,
  points: z.number().optional(),
});

export type TeamWorker = z.infer<typeof teamWorkerSchema>;