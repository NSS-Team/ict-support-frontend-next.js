import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  
    // get my info
    getMyInfo: publicProcedure
    .query(async ({ ctx }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dash`;
        const res = await fetch(`${BASE_URL}/getMyInfo`, {
            headers: {
                Authorization: `Bearer ${ctx.token}`,
            },
        });
        const json = await res.json();
        console.log("raw response", json);
        return json;
    }),

    // get user info by id
    getUserInfo: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dash`;
        const res = await fetch(`${BASE_URL}/getUserInfo/${input.id}`, {
            headers: {
                Authorization: `Bearer ${ctx.token}`,
            },
        });
        const json = await res.json();
        console.log("raw response", json);
        return json;
    }),
});
