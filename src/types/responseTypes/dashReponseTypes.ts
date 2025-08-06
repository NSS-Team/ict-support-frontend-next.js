import { responseSchema } from "~/lib/responseSchema";
import ticketSchema, { EmployeeTicketSchema, workerTicketSchema } from "../tickets/ticket";



// Schema for the response of 'getComplainsEmp' API
export const getComplainsEmpResponseSchema = responseSchema(EmployeeTicketSchema.array());

// get team complaints response schema
export const getTeamComplaintsResponseSchema = responseSchema(ticketSchema.array());

// schema for the response of 'getComplainsWorker' API
export const getComplainsWorkerResponseSchema = responseSchema(workerTicketSchema.array());