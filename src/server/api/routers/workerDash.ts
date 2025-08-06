import { getComplainsEmpResponseSchema, getComplainsWorkerResponseSchema } from "~/types/responseTypes/dashReponseTypes";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const workerDashRouter = createTRPCRouter({
  // Define your procedures here

  getWorkerTickets: publicProcedure.query(async ({ ctx }) => {
    const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dash`;
    const res = await fetch(`${BASE_URL}/getComplainsWorker`, { 
        headers: {
            Authorization: `Bearer ${ctx.token}`,
        },
    });

    const data = await res.json();
    console.log("raw response", data);
    const validated = getComplainsWorkerResponseSchema.parse(data);
    return validated;
    }),
});


