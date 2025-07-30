
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const adminDashRouter = createTRPCRouter({
    // Add your admin dashboard related procedures here

    // fetch all unapproved user registrations
    getUnapprovedRegistrations: publicProcedure.query(async ({ ctx }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dash`;
        const res = await fetch(`${BASE_URL}/getUnapprovedUsers`, {
            headers: {
                Authorization: `Bearer ${ctx.token}`,
                "Content-Type": "application/json",
            },
        });
        const json = await res.json();
        console.log("raw response", json);
        return json;
    }),

    // approve the user 
    approveUser: publicProcedure
        .input(z.object({ USERID: z.string() }))
        .mutation(async ({ ctx, input }) => { 
            const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth`;
            const res = await fetch(`${BASE_URL}/approve-user`, {    
                method: "POST",
                headers: {
                    Authorization: `Bearer ${ctx.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ USERID: input.USERID }),
            });
            const json = await res.json();
            console.log("raw response of approve user", json);
            return json;

        }),


        // reject a user
    rejectUser: publicProcedure
        .input(z.object({ USERID: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth`;
            const res = await fetch(`${BASE_URL}/reject-user`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${ctx.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ USERID: input.USERID }),
            });
            const json = await res.json();
            console.log("raw response of reject user", json);
            return json;

        }),


});

