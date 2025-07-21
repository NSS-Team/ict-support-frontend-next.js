import { responseSchema } from "~/lib/responseSchema";
import ticketSchema from "../tickets/ticket";
import { z } from 'zod';

export const getComplainsEmpResponseSchema = responseSchema(ticketSchema.array());

export const getComplainsWorkerResponseSchema = responseSchema(ticketSchema.array());