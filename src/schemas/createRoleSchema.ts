import { z } from 'zod'

export const SingleRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
})
