import { url } from "inspector";
import { z } from "zod";

// now we will extend the complaint schema to include uploads
import ticketSchema from "~/types/tickets/ticket";

// extending the ticket schema to include uploads
export const ticketDetailsSchema = ticketSchema.extend({
  // uploads: z.array(
  //   z.object({
  //       url: z.string().url(),
  //   })
  // ),

  issueOptionId: z.number(),
  customDescription: z.string().optional().nullable(),
  device: z.string().optional().nullable(),
  issueOptionName: z.string(),
  escalationLevel: z.number().min(0).max(3).optional().nullable(),
  teamId: z.number().min(1),
  updatedAt: z.string(),
  location: z.string(),
});

// type for the extended ticket schema
export type ticketDetails = z.infer<typeof ticketDetailsSchema>;
