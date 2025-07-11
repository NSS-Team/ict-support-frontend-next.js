import { z } from "zod";
import { teamWorkerStatusEnum } from "./enums";

export const teamWorkerSchema = z.object({
  id: z.number(),
  userId: z.string(),
  teamId: z.number(),
  status: teamWorkerStatusEnum,
  joinedAt: z.date(),
});

export type TeamWorker = z.infer<typeof teamWorkerSchema>;