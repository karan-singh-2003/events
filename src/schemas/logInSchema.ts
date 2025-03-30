import { z } from 'zod'

export const logInSchema = z.object({
  universityId: z
    .string()
    .min(7, 'ID is required')
    .regex(/^\d+$/, 'Id must be a numeric value'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
