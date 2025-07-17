import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const teamsRouter = createTRPCRouter({
    // This procedure fetches all teams
    getTeams: publicProcedure.query(async ({ ctx }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/team`;
        const res = await fetch(`${BASE_URL}/getTeams`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${ctx.token}`,
                "Content-Type": "application/json",
            },
        }); 
        const json = await res.json();
        return json;
    }),
});