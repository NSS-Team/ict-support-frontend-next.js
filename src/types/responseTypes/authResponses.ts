// this file contains the type decalarations for the auth responses using zod
import { z } from 'zod';
import { responseSchema } from '~/lib/responseSchema';


// login-check response data schema 
export const loginCheckDataSchema = z.object({
  exist: z.boolean(),
  approved: z.boolean(),
});
export const loginCheckResponseSchema = responseSchema(loginCheckDataSchema);
export type LoginCheckData = z.infer<typeof loginCheckDataSchema>;
export type LoginCheckResponse = z.infer<typeof loginCheckResponseSchema>;


// change password repsponse data schema
export const changePasswordDataSchema = z.object({
  message : z.string(),
});
export const changePasswordResponseSchema = responseSchema(changePasswordDataSchema);
export type ChangePasswordData = z.infer<typeof changePasswordDataSchema>;
export type ChangePasswordResponse = z.infer<typeof changePasswordResponseSchema>;


// approve user response data schema
export const approveUserDataSchema = z.object({
  message: z.string(),
});
export type ApproveUserResponse = z.infer<typeof approveUserDataSchema>;
export type approveUserResponse = z.infer<typeof approveUserDataSchema>;

// generate codes response data schema
export const generateCodesDataSchema = z.object({
  codes: z.array(z.string()),
});
export const generateCodesResponseSchema = responseSchema(generateCodesDataSchema);
export type GenerateCodesData = z.infer<typeof generateCodesDataSchema>;
export type GenerateCodesResponse = z.infer<typeof generateCodesResponseSchema>;
