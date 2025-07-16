import {z } from 'zod';
import { baseUserSchema } from './baseUserSchema';
import { supportStaffRolesEnum } from '../enums';

export const supportStaffMemberSchema = baseUserSchema.extend({
    team: z.string(),
    role: supportStaffRolesEnum,
    department: z.string(),
});

export type SupportStaffMember = z.infer<typeof supportStaffMemberSchema>;