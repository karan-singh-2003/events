// schemas/createTaskSchema.ts

import { title } from 'process';
import * as z from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task name is required'),
  description: z.string().min(1, 'Description is required'),
  assigningMemberId: z.string().nonempty('Assigned member is required'),
  status: z.string().min(1, 'Status is required'),
  priority: z.string().min(1, 'Priority is required'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
