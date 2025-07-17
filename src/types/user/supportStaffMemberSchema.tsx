import {z } from 'zod';
import { baseUserSchema } from './baseUserSchema';
import { supportStaffRolesEnum } from '../enums';

export const supportStaffMemberSchema = baseUserSchema.extend({
    role: supportStaffRolesEnum,
    department: z.string(),
    teamId: z.string(),
});

export type SupportStaffMember = z.infer<typeof supportStaffMemberSchema>;