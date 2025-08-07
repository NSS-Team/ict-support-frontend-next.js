import { createTRPCRouter, publicProcedure } from "../trpc";
import { getComplainsEmpResponseSchema, getComplainsWorkerResponseSchema } from "~/types/responseTypes/dashReponseTypes";

export const dashRouter = createTRPCRouter({


  // get the complains of the employee
  // this will be used by the employee to see all the complaints they have created
  getComplainsEmp: publicProcedure
    .query(async ({ ctx }) => {
      const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dash`;
    const res = await fetch(`${BASE_URL}/getcomplainsEmp`, {
      headers: {
        Authorization: `Bearer ${ctx.token}`,
      },
    });
        const json = await res.json() as unknown;
        console.log("raw response", json);
        const validated = getComplainsEmpResponseSchema.parse(json);
        console.log("validated response", validated);
        return validated;
    }),

    // get the complains of the worker
    // this will be used by the worker to see the complaints assigned to them
    getComplainsWorker: publicProcedure
    .query(async ({ ctx }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dash`;
        const res = await fetch(`${BASE_URL}/getcomplainsWorker`, {
            headers: {
                Authorization: `Bearer ${ctx.token}`,
            },
        });
        const json = await res.json() as unknown;
        console.log("raw response", json);
        const validated = getComplainsWorkerResponseSchema.parse(json);
        console.log("validated response", validated);
        return validated;

    }),

    

});

