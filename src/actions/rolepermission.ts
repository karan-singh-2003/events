'use server'
import { cookies } from 'next/headers'
import { prisma } from '../lib/prisma'
import redis from '../lib/redis'

export const getWorkspacePermissionsWithRoles = async (
  workspaceId: string,
  type: any
) => {
  try {
    const cookieStore = cookies()
    const sessionId = (await cookieStore).get('session_id')?.value

    if (!sessionId) {
      console.error('No session found in cookies.')
      return { status: 401, data: 'Unauthorized' }
    }

    const sessionData = await redis.get(`session:${sessionId}`)
    if (!sessionData) {
      console.error('No session data found in Redis.')
      return { status: 401, data: 'Unauthorized' }
    }

    const user = JSON.parse(sessionData)
    if (!user.email) {
      console.error('User email missing from session.')
      return { status: 401, data: 'Unauthorized' }
    }

    // Optional: Cache workspaceId by user.email
    
    const permissions = await prisma.permission.findMany({
      where: {
        workspaceId,
        type,
      },
      select: {
        id: true,
        title: true,
        rolePermissions: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    const result = permissions.map((perm) => ({
      permissionId: perm.id,
      title: perm.title,
      roles: perm.rolePermissions.map((rp: any) => rp.role.name),
    }))

    return { status: 200, data: result }
  } catch (error) {
    console.error('Error fetching workspace permissions with roles:', error)
    return { status: 500, data: 'Internal Server Error' }
  }
}
