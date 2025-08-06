import { z } from 'zod';
import { notificationStatusEnum } from './enums';

export const notificationSchema = z.object({
  id: z.number(),
  userId: z.string(),
  message: z.string(),
  status: notificationStatusEnum,
  createdAt: z.date(),
});

export type Notification = z.infer<typeof notificationSchema>;
