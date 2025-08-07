import z from "zod";
import { responseSchema } from "~/lib/responseSchema";
import { userRolesEnum } from "~/types/enums";

const getMyInfoDataSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    picUrl: z.string().url(),
    officeNumber: z.string().optional(),
    department: z.string(),
    designation: z.string(),
    phone: z.string(),
    role: userRolesEnum,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    locationName: z.string().max(100)
});

const getUserInfoDataSchema = z.object({
    userId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    picUrl: z.string().url().nullable(),
    phone: z.string(),
    role: userRolesEnum,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const getMyInfoResponseSchema = responseSchema(getMyInfoDataSchema);
export const getUserInfoResponseSchema = responseSchema(getUserInfoDataSchema);
