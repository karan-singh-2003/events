import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getWorkspaceAllPermissions } from '@/src/actions/permissions'

// Define schema for query parameters
const QuerySchema = z.object({
  workspaceId: z.string().min(1, 'workspaceId is required'),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get('workspaceId')

    // Validate query
    const parsed = QuerySchema.safeParse({ workspaceId })
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.format() },
        { status: 400 }
      )
    }

    // Get permissions data
    const { data: permissionData } = await getWorkspaceAllPermissions(workspaceId!)

    return NextResponse.json({ permission: permissionData })
  } catch (error) {
    console.error('GET /api/workspace/roles error:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
