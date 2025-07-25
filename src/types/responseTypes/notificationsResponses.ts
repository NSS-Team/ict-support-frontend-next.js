import { z } from "zod";
import { NotificationSchema } from "../notifications/Notification";
import { NotificationPaginationSchema } from "../notifications/notificationPagination";

export const NotificationDataSchema = z.object({
  notifications: z.array(NotificationSchema),
  pagination: NotificationPaginationSchema, 
  totalUnread: z.string(),
});

export const NotificationResponseSchema = z.object({
  data: NotificationDataSchema,
    message: z.string(),
    status: z.string(),
});

export type NotificationResponse = z.infer<typeof NotificationResponseSchema>;