// workspace update not on real production function has made on action 

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '../../../../lib/prisma'
import redis from '../../../../lib/redis'


export async function POST(req: Request) {
  try {
    const { name, workspaceId } = await req.json()

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

    if (!name || !workspaceId) {
      return NextResponse.json({ message: 'Missing name or workspace ID' }, { status: 400 })
    }

    // Get member record
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

    const userRoleName = member.Roles.name

    // Get the permission
    const permission = await prisma.permission.findFirst({
      where: {
        title: "who can edit delete workspace",
        workspaceId,
      },
    })

    if (!permission) {
      return NextResponse.json({ message: 'Rename permission not found' }, { status: 403 })
    }

    // Check if the user's role has that permission
    const hasPermission = await prisma.rolePermission.findFirst({
      where: {
          roleId: member.Roles.id,
          permissionId: permission.id,
        workspaceId,
      },
    })

    if (!hasPermission) {
      return NextResponse.json({ message: 'You do not have permission to rename this workspace' }, { status: 403 })
    }

    // Rename the workspace
    const updatedWorkspace = await prisma.workspaces.update({
      where: {
        id: workspaceId,
      },
      data: {
        name,
      },
    })

    return NextResponse.json({ message: 'Workspace renamed successfully', workspace: updatedWorkspace }, { status: 200 })

  } catch (err) {
    console.error('Error updating workspace:', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
