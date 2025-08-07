import { createTRPCRouter, publicProcedure } from "../trpc";
import { getTeamComplaintsResponseSchema } from "~/types/responseTypes/dashReponseTypes";

export const managerDashRouter = createTRPCRouter({
  // Define your procedures here

  getTeamComplaints: publicProcedure.query(async ({ ctx }) => {
    const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/complain`;
    const res = await fetch(`${BASE_URL}/getTeamComplaints`, {
      headers: {
        Authorization: `Bearer ${ctx.token}`,
      },
    });
    const data = await res.json() as unknown;
    console.log("raw response", data);
    const validated = getTeamComplaintsResponseSchema.parse(data);
    return validated;
  }),


});
