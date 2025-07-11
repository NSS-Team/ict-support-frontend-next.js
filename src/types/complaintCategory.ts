import {z} from "zod";

export const complaintCategorySchema = z.object({
  id: z.number(),
  name: z.string().max(150),
});

export type ComplaintCategory = z.infer<typeof complaintCategorySchema>;