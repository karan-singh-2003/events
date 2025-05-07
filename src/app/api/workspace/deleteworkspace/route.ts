import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '../../../../lib/prisma'
import redis from '../../../../lib/redis'

export async function POST(req: NextRequest) {
  try {
    const { workspaceId } = await req.json()

    const cookieStore = cookies()
    const sessionId = (await cookieStore).get('session_id')?.value

    if (!sessionId) {
      return NextResponse.json({ message: 'Unauthorized - No session ID' }, { status: 401 })
    }

    const sessionData = await redis.get(`session:${sessionId}`)
    if (!sessionData) {
      return NextResponse.json({ message: 'Unauthorized - No session data' }, { status: 401 })
    }

    const user = JSON.parse(sessionData)
    if (!user?.id) {
      return NextResponse.json({ message: 'Unauthorized - Invalid user data' }, { status: 401 })
    }

    // Step 1: Get member and role
    const member = await prisma.members.findFirst({
      where: {
        userId: user.id,
        workspaceId,
      },
      include: {
        Roles: true,
      },
    })

    if (!member || !member.Roles) {
      return NextResponse.json({ message: 'You are not a member of this workspace' }, { status: 403 })
    }

    // Step 2: Get the "who can delete workspace" permission
    const permission = await prisma.permission.findFirst({
      where: {
        title: 'who can edit delete workspace',
        workspaceId,
      },
    })

    if (!permission) {
      return NextResponse.json({ message: 'Delete permission not found' }, { status: 403 })
    }

    // Step 3: Check if user's role has that permission
    const hasPermission = await prisma.rolePermission.findFirst({
      where: {
        roleId: member.Roles.id,
        permissionId: permission.id,
        workspaceId,
      },
    })

    if (!hasPermission) {
      return NextResponse.json({ message: 'You do not have permission to delete this workspace' }, { status: 403 })
    }

    // Step 4: Delete the workspace
    const deletedWorkspace = await prisma.workspaces.delete({
      where: {
        id: workspaceId
      },
    })

    return NextResponse.json({ message: 'Workspace deleted successfully', workspace: deletedWorkspace }, { status: 200 })
  } catch (error) {
    console.error('Error deleting workspace:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
