import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getLocationsResponseSchema } from "~/types/responseTypes/locationResponses";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const locationsRouter = createTRPCRouter({
  getLocations: publicProcedure.query(async ({ ctx }) => {
    const res = await fetch(`${BASE_URL}/api/auth/locations`, {
      headers: {
        Authorization: `Bearer ${ctx.token}`,
      },
    });

    const json = await res.json() as unknown;
    const validated = getLocationsResponseSchema.parse(json);
    console.log('getLocations response:', validated);
    return validated;
  }),
});
