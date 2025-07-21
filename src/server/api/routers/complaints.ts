import { createTRPCRouter } from "../trpc";
import { publicProcedure } from "../trpc";
import { z } from "zod";
import { categoryResponseSchema } from "~/types/categories/categories";

export const complaintsRouter = createTRPCRouter({

    // getting the categories for the complaints
    // this will be used to populate the dropdown in the complaint form
    getCategories: publicProcedure
        .query(async ({ ctx }) => {
            const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complain`;
            const res = await fetch(`${BASE_URL}/getCategories`, {
                headers: {
                    Authorization: `Bearer ${ctx.token}`,
                },
            });
            const json = await res.json();
            console.log("raw response", json);
            // const validated = categoryResponseSchema.parse(json);
            // console.log("validated", validated);
            return json;
        }),

        
        getcomplainInfo: publicProcedure
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
            console.log("raw response", json);
            return json;
        }),
});

