import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { workerMetricsResponseSchema } from "~/types/responseTypes/performanceMetrics/workerMetrics";

export const performanceMetricsRouter = createTRPCRouter({
  // Define your API routes here

  getWorkerPerformanceMetrics: publicProcedure
    .input(z.object({ workerId: z.string(), 
        startDate: z.string().optional().nullable(),
        endDate: z.string().optional().nullable() }))
    .query(async ({ ctx, input }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/performance`;
        // now we send the startdate and endDate as query parameters
        const queryParams = new URLSearchParams();
        if (input.startDate && input.startDate !== '') {
            queryParams.append('startDate', input.startDate);
        }
        if (input.endDate && input.endDate !== '') {
            queryParams.append('endDate', input.endDate);
        }
        const url = `${BASE_URL}/worker/${input.workerId}?${queryParams.toString()}`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
            Authorization: `Bearer ${ctx.token}`,
            "Content-Type": "application/json",
            },
        });
    
        if (!res.ok) {
            throw new Error("Failed to fetch worker performance metrics");
        }
    
        const json = await res.json() as unknown;
        console.log("raw response of worker metrics: ", json);
        return workerMetricsResponseSchema.parse(json);
        }),


});
