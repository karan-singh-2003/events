// use for postman not for deployment 

import { NextResponse } from 'next/server'
import { getWorkspaceAllRoles } from '@/src/actions/roles'
import { z } from 'zod'
import { getWorkspaceAllPermissions } from '@/src/actions/permissions'

const QuerySchema = z.object({
  workspaceId: z.string().min(1, 'workspaceId is required'),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get('workspaceId')

    const parsed = QuerySchema.safeParse({ workspaceId })

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.errors[0].message }, { status: 400 })
    }

    const { status, data } = await getWorkspaceAllRoles(parsed.data.workspaceId)
    const {data:permissiondata} = await getWorkspaceAllPermissions(parsed.data.workspaceId);
    return NextResponse.json({ permsission:permissiondata })
  } catch (error) {
    console.error('GET /api/workspace/roles error:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
