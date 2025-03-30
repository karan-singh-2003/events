import { z } from 'zod'

export const RolesArraySchema = z.object({
  roles: z
    .array(
      z.object({
        name: z
          .string()
          .min(2, 'Role must have at least 2 characters')
          .nonempty('Role name is required'),
      })
    )
    .min(1, 'At least one role is required'),
})
