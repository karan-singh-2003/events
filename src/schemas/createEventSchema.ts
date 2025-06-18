// src/schemas/createEventSchema.ts
import { z } from 'zod';

export const createEventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
