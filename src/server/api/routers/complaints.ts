import { createTRPCRouter } from "../trpc";
import { publicProcedure } from "../trpc";
import { z } from "zod";
import { getCategoryResponseSchema } from "~/types/responseTypes/categories";
import { getComplainInfoResponseSchema } from "~/types/responseTypes/ticketResponses";

export const complaintsRouter = createTRPCRouter({

    // get all categories
    getCategories: publicProcedure.query(async ({ ctx }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints`;
        const res = await fetch(`${BASE_URL}/getCategories`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const json = await res.json();
        console.log("raw response", json);
        const validated = z.array(getCategoryResponseSchema).parse(json);
        console.log("validated response", validated);
        return validated;
    }),

    // get subcategories by category ID
    getSubCategories: publicProcedure
        .input(z.object({ categoryId: z.string() }))
        .query(async ({ ctx, input }) => {
            const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints`;
            const res = await fetch(`${BASE_URL}/getSubCategories/${input.categoryId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const json = await res.json();
            console.log("raw response", json);
            return json;
        }),

    // get issue options by subcategory ID
    getIssueOptions: publicProcedure
        .input(z.object({ subCategoryId: z.string() }))
        .query(async ({ ctx, input }) => {
            const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complaints`;
            const res = await fetch(`${BASE_URL}/getIssueOptions/${input.subCategoryId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const json = await res.json();
            console.log("raw response", json);
            return json;
        }),

    // get complaint info by complaint ID
    getComplainInfo: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
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
});

