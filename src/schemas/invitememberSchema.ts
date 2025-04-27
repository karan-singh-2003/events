import { z } from 'zod'

export const InviteMemberSchema = z.object({
  receiverEmail: z.string().email({ message: 'Invalid email address' }),
  receiverMemberId: z.string().min(1, { message: 'Member ID is required' }),
  role: z.string().min(1, { message: 'Role is required' }),
  message: z.string().optional(),
})

export type InviteMemberInput = z.infer<typeof InviteMemberSchema>
