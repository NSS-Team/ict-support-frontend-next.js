import { locationsSchema } from "../location"; 
import { responseSchema } from "~/lib/responseSchema"; // base schema for responses
import { z } from "zod";

// schemas
// (get locations) response data schema
export const getLocationsResponseSchema = responseSchema(z.array(locationsSchema));



// types
export type typeGetLocationsResponse = z.infer<typeof getLocationsResponseSchema>;