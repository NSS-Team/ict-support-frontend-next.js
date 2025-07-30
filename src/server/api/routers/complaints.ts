
import { createTRPCRouter } from "../trpc";
import { publicProcedure } from "../trpc";
import { z } from "zod";
import { priorityEnum, submissionPreferenceEnum } from "~/types/enums";
import { getCategoryResponseSchema, getIssueOptionResponseSchema, getSubCategoryResponseSchema } from "~/types/responseTypes/categories";
import { getComplainInfoResponseSchema } from "~/types/responseTypes/ticketResponses";
import { attachmentSchema } from "~/types/attachments";
import { generateComplainResponseSchema } from "~/types/responseTypes/ticketResponses";

export const complaintsRouter = createTRPCRouter({

    // get all categories
    // validated response
    getCategories: publicProcedure.query(async ({ ctx }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complain`;
        const res = await fetch(`${BASE_URL}/getCategories`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ctx.token}`,
            },
        });
        const json = await res.json();
        console.log("raw response", json);
        const validated = getCategoryResponseSchema.parse(json);
        console.log("validated response", validated);
        return validated;
    }),

    // get subcategories by category ID
    getSubCategories: publicProcedure.input(z.object({ categoryId: z.string() })).query(async ({ ctx, input }) => {
            const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complain`;
            const res = await fetch(`${BASE_URL}/getSubCategories/${input.categoryId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${ctx.token}`,
                },
            });
            const json = await res.json();
            console.log("raw response", json);
            const validated = getSubCategoryResponseSchema.parse(json);
            console.log("validated response", validated);
            return validated;
        }),

    // get issue options by subcategory ID
    getIssueOptions: publicProcedure.input(z.object({ subCategoryId: z.string() })).query(async ({ ctx, input }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complain`;
        const res = await fetch(`${BASE_URL}/getIssueOption/${input.subCategoryId}`, {
            headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${ctx.token}`,
                },
            });
            const json = await res.json();
            console.log("raw response", json);
            const validated = getIssueOptionResponseSchema.parse(json);
            console.log("validated response", validated);
            return validated;
        }),

    // get complaint info by complaint ID
    // validated response
    getComplainInfo: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complain`;
        const res = await fetch(`${BASE_URL}/getComplainInfo/${input.id}`, {
            headers: {
                Authorization: `Bearer ${ctx.token}`,
                },
                cache: "no-store",
            });
            const json = await res.json();
            console.log("raw response of complaint info", json);
            const validated = getComplainInfoResponseSchema.parse(json);
            console.log("validated response of complaint info", validated);
            return validated;
        }),


    // registrering a new complaint 
    generateComplain: publicProcedure.input(z.object({
        categoryId: z.string(),
        subCategoryId: z.string(),
        issueOptionId: z.string(),
        customDescription: z.string().optional(),
        submissionPreference: submissionPreferenceEnum,
        priority: priorityEnum,
        title: z.string().min(1, "Title is required"),
        device: z.string().min(1, "Device is required"),
        uploads: z.array(attachmentSchema).optional().default([]),
    })).mutation(async ({ ctx, input }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complain`;
        const res = await fetch(`${BASE_URL}/generate`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ctx.token}`,
            },
            body: JSON.stringify(input),
        });
        const json = await res.json();
        console.log("raw response of generate complain", json);
        const validated = generateComplainResponseSchema.parse(json);
        console.log("validated response of generate complain", validated);
        return validated;
    }),

    // assign complaint to a worker 
    assignComplainToWorker: publicProcedure.input(z.object({
        workerId: z.number(),
        complaintId: z.string(),
    })).mutation(async ({ ctx, input }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complain`;
        const res = await fetch(`${BASE_URL}/assignWorker`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ctx.token}`,
            },
            body: JSON.stringify(input),
        });
        const json = await res.json();
        console.log("raw response of assign complain to worker", json);
                    // const validated = assignComplainToWorkerResponseSchema.parse(json);
                    // console.log("validated response of assign complain to worker", validated);
        return json;
    }),


    // forward complaint to a team
    forwardComplainToTeam: publicProcedure.input(z.object({
        teamId: z.number(), 
        complaintId: z.string(),
        comment: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complain`;
        const res = await fetch(`${BASE_URL}/forwardComplaint`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ctx.token}`,
            },
            body: JSON.stringify(input),
        });
        const json = await res.json();
        console.log("raw response of forward complain to team", json);
        // const validated = forwardComplainToTeamResponseSchema.parse(json);
        // console.log("validated response of forward complain to team", validated);
        return json;
    }),

    // get complaint logs
    getComplaintLogs: publicProcedure.input(z.object({ complaintId: z.string() })).query(async ({ ctx, input }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complain`;
        const res = await fetch(`${BASE_URL}/getComplainLogs/${input.complaintId}`, {
            headers: {
                Authorization: `Bearer ${ctx.token}`,
            },
        });
        const json = await res.json();
        console.log("raw response of get complaint logs", json.data);
        return json;
    }
    ),

    // delete a complaint
    deleteComplaint: publicProcedure.input(z.object({ complaintId: z.string() })).mutation(async ({ ctx, input }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complain`;
        const res = await fetch(`${BASE_URL}/deleteComplaint/${input.complaintId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ctx.token}`,
            },
        });
        const json = await res.json();
        console.log("raw response of delete complaint", json);
        return json;
    }),


    // resolve a complaint 
    resolveComplaint: publicProcedure.input(z.object({
        complaintId: z.string(),
        resolvedSummary: z.string().min(1, "Resolution summary is required"),
        uploads: z.array(attachmentSchema).optional().default([]),
    })).mutation(async ({ ctx, input }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complain`;
        const res = await fetch(`${BASE_URL}/resolveComplaint`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ctx.token}`,
            },
            body: JSON.stringify(input),
        });
        const json = await res.json();
        console.log("raw response of resolve complaint", json);
        // const validated = resolveComplaintResponseSchema.parse(json);
        // console.log("validated response of resolve complaint", validated);
        return json;
    }),
});
