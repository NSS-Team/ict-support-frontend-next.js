// import { get } from "http";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { NotificationResponseSchema } from "~/types/responseTypes/notificationsResponses";
export const notificationRouter = createTRPCRouter({
  // Define your notification-related procedures here

  getNotifications: publicProcedure
  .input(z.object({ offset: z.number().optional() })) // add zod input schema
  .query(async ({ ctx, input }) => {
    const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dash`;
    const offset = input?.offset ?? 0; // default to 0 if not provided

    const res = await fetch(`${BASE_URL}/getNotifications?offset=${offset}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctx.token}`,
      },
    });

    const json = await res.json();
    console.log("notifications: ", json);
    // Validate the response against the NotificationResponseSchema
    // const validated = NotificationResponseSchema.safeParse(json);
    // if (!validated.success) {
    //     console.error("Validation error:", validated.error);
    //     throw new Error("Invalid response format");
    // }
    // console.log("validated response", validated.data);
    return json.data;
  }),

//   mark single notification as read
    markNotificationAsRead: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dash`;
        const res = await fetch(`${BASE_URL}/markAsRead/${input.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ctx.token}`,
          },
        });

        const json = await res.json();
        console.log("raw response", json);
        return json;
      }),

    // mark all notifications as read
    markAllNotificationsAsRead: publicProcedure
    .mutation(async ({ ctx }) => {
        const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dash`;
        const res = await fetch(`${BASE_URL}/markAllAsRead`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ctx.token}`,
          },
        });
        const json = await res.json();
        console.log("raw response", json);
        return json;
        }),
    });
