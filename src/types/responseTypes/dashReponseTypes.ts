import { responseSchema } from "~/lib/responseSchema";
import ticketSchema from "../tickets/ticket";



// Schema for the response of 'getComplainsEmp' API
export const getComplainsEmpResponseSchema = responseSchema(ticketSchema.array());
// schema for the response of 'getComplainsWorker' API
export const getComplainsWorkerResponseSchema = responseSchema(ticketSchema.array());