// this file contains the type decalarations for the auth responses using zod
import { z } from 'zod';

export const loginCheckResponseSchema = z.object({
  exist: z.boolean(),
  approved: z.boolean(),
});
export const changePasswordResponseSchema = z.object({
  message : z.string(),
});
export const approveUser = z.object({
  message: z.string(),
});



export type LoginCheckResponse = z.infer<typeof loginCheckResponseSchema>;
export type ChangePasswordResponse = z.infer<typeof changePasswordResponseSchema>;
export type ApproveUserResponse = z.infer<typeof approveUser>;

