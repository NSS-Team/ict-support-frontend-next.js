import { attachmentSchema } from "../attachments";
import { z } from 'zod';
import { ticketDetailsSchema } from "../tickets/ticketDetails";
import { responseSchema } from "~/lib/responseSchema";
import { complaintStatusEnum } from "../enums";
// import { timeStamp } from "console";


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

export const getComplaintLogsDataSchema = z.object({
    logs: z.array(z.object({
        id: z.number(),
        complaintId: z.number(),
        comment: z.string(),
        status: complaintStatusEnum,
        changedByName: z.string(),
        timeStamp: z.string(),
    })),
});

export const getComplaintLogsResponseSchema = responseSchema(getComplaintLogsDataSchema);
