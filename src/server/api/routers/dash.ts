import { createTRPCRouter, publicProcedure } from "../trpc";
import { getComplainsEmpResponseSchema, getComplainsWorkerResponseSchema } from "~/types/responseTypes/dashReponseTypes";

export const dashRouter = createTRPCRouter({


  getComplainsEmp: publicProcedure
    .query(async ({ ctx }) => {
      const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dash`;
    const res = await fetch(`${BASE_URL}/getcomplainsEmp`, {
      headers: {
        Authorization: `Bearer ${ctx.token}`,
      },
    });
        const json = await res.json();
        console.log("raw response", json);
        const validated = getComplainsEmpResponseSchema.parse(json);
        console.log("validated response", validated);
        return validated;
    }),

    getComplainsWorker: publicProcedure
    .query(async ({ ctx }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dash`;
        const res = await fetch(`${BASE_URL}/getcomplainsWorker`, {
            headers: {
                Authorization: `Bearer ${ctx.token}`,
            },
        });
        const json = await res.json();
        console.log("raw response", json);
        const validated = getComplainsWorkerResponseSchema.parse(json);
        console.log("validated response", validated);
        return validated;

    }),

    getUserInfo: publicProcedure
    .query(async ({ ctx }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dash`;
        const res = await fetch(`${BASE_URL}/getUserInfo`, {
            headers: {
                Authorization: `Bearer ${ctx.token}`,
            },
        });
        const json = await res.json();
        console.log("raw response", json);
        return json;
    }),

});

