import { authRouter } from "~/server/api/routers/auth";
import { locationsRouter } from "~/server/api/routers/locations";
import { teamsRouter } from "./routers/team";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { dashRouter } from "./routers/dash";
import { complaintsRouter } from "./routers/complaints";
import { managerDashRouter } from "./routers/managerDash";
import { notificationRouter } from "./routers/notification";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  complaints: complaintsRouter,
  locations : locationsRouter,
  teams: teamsRouter,
  dash: dashRouter,
  managerDash: managerDashRouter,
  notifications: notificationRouter

});


// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
