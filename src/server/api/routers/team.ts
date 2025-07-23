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
    getTeamWorkers: publicProcedure
        .query(async ({ ctx }) => {
            const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/team`;
            const res = await fetch(`${BASE_URL}/teamWorkers`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${ctx.token}`,
                },
            });
            const json = await res.json();
            console.log("raw response", json);
            const validated = getTeamWorkersResponseSchema.parse(json);
            console.log("validated response", validated);
            return validated;
        }),
});