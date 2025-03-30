'use server'
import { cookies } from 'next/headers'
import { prisma } from '../lib/prisma'
import redis from '../lib/redis'

export const getWorkspaceAllRoles = async (workspaceId: string) => {
  try {
    const cookieStore = cookies()
    const sessionId = (await cookieStore).get('session_id')?.value
    if (!sessionId) {
      console.error(' No session found in cookies.')
      return { status: 401, data: 'Unauthorized' }
    }

    const sessionData = await redis.get(`session:${sessionId}`)
    if (!sessionData) {
      console.error(' No session data found in Redis.')
      return { status: 401, data: 'Unauthorized' }
    }

    const user = JSON.parse(sessionData)
    if (!user.email) {
      console.error(' User email missing from session.')
      return { status: 401, data: 'Unauthorized' }
    }

    let cachedWorkspaceId = await redis.get(`workspace:${user.email}`)
    if (!cachedWorkspaceId) {
      await redis.setex(`workspace:${user.email}`, 3600, workspaceId)
      cachedWorkspaceId = workspaceId
    }

    const roles = await prisma.$queryRaw`
    SELECT 
      "Roles".id AS role_id, 
      "Roles".name AS role_name, 
      "Workspaces".id AS workspace_id, 
      "Workspaces".name AS workspace_name
    FROM "Roles"
    JOIN "Workspaces" ON "Roles"."workspaceId" = "Workspaces".id
    WHERE "Workspaces".id = ${workspaceId}::text;
  `

    return { status: 200, data: roles }
  } catch (error) {
    console.error(' Error fetching all roles:', error)
    return { status: 500, data: 'Internal Server Error' }
  }
}

export const createRole = async (data: { roles: { name: string }[] }) => {
  try {
    const cookieStore = cookies()
    const sessionId = (await cookieStore).get('session_id')?.value
    if (!sessionId) {
      return { status: 401, data: 'Unauthorized' }
    }

    const sessionData = await redis.get(`session:${sessionId}`)
    if (!sessionData) {
      return { status: 401, data: 'Unauthorized' }
    }

    const user = JSON.parse(sessionData)
    if (!user.email) {
      return { status: 401, data: 'Unauthorized' }
    }

    const workspaceId = await redis.get(`workspace:${user.email}`)
    if (!workspaceId) {
      return { status: 404, data: 'Workspace not found' }
    }

    if (!Array.isArray(data.roles) || data.roles.length === 0) {
      return { status: 400, data: 'Roles array is required.' }
    }

    const createdRoles = []
    for (const role of data.roles) {
      console.log('🔍 Inserting role:', role.name)

      const newRole = await prisma.roles.create({
        data: {
          name: role.name,
          workspaceId,
        },
      })

      createdRoles.push(newRole)
    }

    await redis.del(`roles:${workspaceId}`)

    return { status: 200, data: createdRoles }
  } catch (error) {
    console.error(' Error creating role:', error)
    return { status: 500, data: 'Internal Server Error' }
  }
}

export const deleteRole = async (roleId: string, workspaceId: string) => {
  try {
    console.log('🛠️ Deleting role:', roleId)

    // ✅ Check if role exists before deleting
    const role = await prisma.roles.findUnique({ where: { id: roleId } })
    if (!role) {
      console.error('❌ Role not found:', roleId)
      return { status: 404, data: 'Role not found' }
    }

    // ✅ Delete role from database
    await prisma.roles.delete({ where: { id: roleId } })
    console.log('✅ Role deleted:', roleId)

    // ✅ Invalidate cache for roles
    await redis.del(`roles:${workspaceId}`)

    return { status: 200, data: 'Role deleted successfully' }
  } catch (error) {
    console.error('❌ Error deleting role:', error)
    return { status: 500, data: 'Internal Server Error' }
  }
}
