import { attachmentSchema } from "../attachments";
import { z } from 'zod';
import { ticketDetailsSchema } from "../tickets/ticketDetails";
import { responseSchema } from "~/lib/responseSchema";


// Schema for the data object of the response of 'getComplainInfo' containing ticket details and attachments
export const getComplainInfoDataObjectSchema = z.object({
    complaint: ticketDetailsSchema,
    attachments: attachmentSchema.array(),
});

// Schema for the response of 'getComplainInfo' API
export const getComplainInfoResponseSchema = responseSchema(getComplainInfoDataObjectSchema);