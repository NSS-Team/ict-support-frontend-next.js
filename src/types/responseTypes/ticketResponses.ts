import { attachmentSchema } from "../attachments";
import { z } from 'zod';
import { ticketDetailsSchema } from "../tickets/ticketDetails";
import { responseSchema } from "~/lib/responseSchema";


// Schema for the data object of the response of 'getComplainInfo' containing ticket details and attachments
export const getComplainInfoDataObjectSchema = z.object({
    complaint: ticketDetailsSchema,
    formattedAttachments: z.object({
        employeeAttachments: z.array(attachmentSchema),
        workerAttachments: z.array(attachmentSchema),
    }),
});

// Schema for the response of 'getComplainInfo' API
export const getComplainInfoResponseSchema = responseSchema(getComplainInfoDataObjectSchema);

export const generateComplainDataSchema = z.object({
    complainId: z.number(),
});

export const generateComplainResponseSchema = responseSchema(generateComplainDataSchema);