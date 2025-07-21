import { url } from "inspector";
import {z} from "zod";

// now we will extend the complaint schema to include uploads
import ticketSchema from "~/types/tickets/ticket";

// extending the ticket schema to include uploads
export const ticketDetailsSchema = ticketSchema.extend({
  uploads: z.array(
    z.object({
        url: z.string().url(),
    })
  ),
});

// type for the extended ticket schema
export type ticketDetails = z.infer<typeof ticketDetailsSchema>;
