import { z } from "zod";
import { NotificationSchema } from "../notifications/Notification";
import { NotificationPaginationSchema } from "../notifications/notificationPagination";
import { responseSchema } from "~/lib/responseSchema";

export const NotificationDataSchema = z.object({
  notifications: z.array(NotificationSchema),
  pagination: NotificationPaginationSchema, 
  totalUnread: z.string(),
});

export const NotificationResponseSchema = responseSchema(NotificationDataSchema);

export type NotificationResponse = z.infer<typeof NotificationResponseSchema>;