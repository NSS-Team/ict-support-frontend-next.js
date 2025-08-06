import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { getAllUsersResponseSchema } from "~/types/user/allUsersSchema";

export const userRouter = createTRPCRouter({
  
    // get all users
    getAllUsers: publicProcedure.query(async ({ ctx }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dash`;
        const res = await fetch(`${BASE_URL}/getAllUsers`, {
            headers: {
                Authorization: `Bearer ${ctx.token}`,
                "Content-Type": "application/json",
            },
        });
        const json = await res.json();
        console.log("raw response of get all users", json);
        
        // Validate the response with our schema
        // return getAllUsersResponseSchema.parse(json);
        return json;
    }),

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
