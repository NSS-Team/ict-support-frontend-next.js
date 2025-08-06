import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getTeamWorkersResponseSchema } from "~/types/responseTypes/teamResponses";

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
        console.log("raw TEAM GET response", json);
        return json;
    }),


    // to fetch the worker of a team
    getWorkersWhileAssignment: publicProcedure
        .input(z.object({ complaintId: z.number() }))
        .query(async ({ ctx, input }) => {
            const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/team`;
            const res = await fetch(`${BASE_URL}/getWorkers/${input.complaintId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${ctx.token}`,
                    "Content-Type": "application/json",
                },
            });
            const json = await res.json();
            console.log("raw response workers", json.data.workers);
            // const validated = getTeamWorkersResponseSchema.parse(json);
            // console.log("validated response", validated);
            return json;
        }),



    myTeam: publicProcedure
        .query(async ({ ctx }) => {
            const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/team`;
            const res = await fetch(`${BASE_URL}/myTeam`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${ctx.token}`,
                    "Content-Type": "application/json",
                },
            });
            const json = await res.json();
            console.log("raw response", json);
            console.log("my team workers raw", json.data.workers);
            const validated = getTeamWorkersResponseSchema.parse(json);
            console.log("validated response", validated);
            console.log("my team workers", validated?.data?.workers);
            return validated;
        }),
});