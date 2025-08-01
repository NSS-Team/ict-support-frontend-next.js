import {z} from "zod";
import {submissionPreferenceEnum, complaintStatusEnum, priorityEnum} from "../enums";


export const ticketSchema = z.object({
  id: z.number(),
  title: z.string().max(200),
  employeeId: z.string().min(1),
  employeeName: z.string().max(150),
  categoryId: z.number(),
  subCategoryId: z.number(),
  submissionPreference: submissionPreferenceEnum,
  status: complaintStatusEnum,
  priority: priorityEnum,
  assignedWorkers: z.array(z.object({
    workerId: z.number(),
    workerName: z.string(),
  })),
  createdAt: z.string(),
  categoryName: z.string(),
  subCategoryName: z.string(),
  // issueOptionId: z.number(),
  // customDescription: z.string().optional().nullable(),
  // device: z.string().optional().nullable(),
  // issueOptionName: z.string(),
  // escalationLevel: z.number().min(0).max(3).optional().nullable(),
  // teamId: z.number().min(1),
  
});

export default ticketSchema;

export type ticket = z.infer<typeof ticketSchema>;
