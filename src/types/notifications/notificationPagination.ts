import { z } from "zod";

export const NotificationPaginationSchema = z.object({
  offset: z.number(),
  hasMore: z.boolean(),
});

export type NotificationPagination = z.infer<typeof NotificationPaginationSchema>;