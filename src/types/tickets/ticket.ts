import {z} from "zod";
import {submissionPreferenceEnum, complaintStatusEnum, priorityEnum, workerComplaintStatusEnum} from "../enums";


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
  createdAt: z.string(),
  categoryName: z.string(),
  subCategoryName: z.string(),
  
});

export const workerTicketSchema = ticketSchema.extend({
  currentWorkerStatus: workerComplaintStatusEnum,
});

export default ticketSchema;

export type ticket = z.infer<typeof ticketSchema>;
