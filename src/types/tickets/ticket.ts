import {z} from "zod";
import {submissionPreferenceEnum, complaintStatusEnum, priorityEnum} from "../enums";


export const ticketSchema = z.object({
  id: z.number(),
  title: z.string().max(200),
  employeeId: z.string().min(1),
  employeeName: z.string().max(150),
  categoryId: z.number(),
  subCategoryId: z.number(),
  issueOptionId: z.number(),
  customDescription: z.string().optional().nullable(),
  device: z.string().optional().nullable(),
  submissionPreference: submissionPreferenceEnum,
  status: complaintStatusEnum,
  priority: priorityEnum,
  assignedWorker: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export default ticketSchema;

export type ticket = z.infer<typeof ticketSchema>;
