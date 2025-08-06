  
import z from 'zod';

export const NotificationSchema = z.object({
  id: z.number(),
    message: z.string(),
    status: z.string().nullable(),
    createdAt: z.string(),
    read: z.boolean(),
});

export type Notification = z.infer<typeof NotificationSchema>;