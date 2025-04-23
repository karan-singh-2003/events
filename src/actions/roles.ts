'use server'
import { cookies } from 'next/headers'
import { prisma } from '../lib/prisma'
import redis from '../lib/redis'
import { defaultRoles } from '../enums/constantRoles'


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

export const createRole = async (
  data: { roles: { name: string }[]; workspaceId: string }
) => {
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
    if (!user.email || !user.id) {
      return { status: 401, data: 'Unauthorized - missing user data' }
    }

    if (!Array.isArray(data.roles) || data.roles.length === 0) {
      return { status: 400, data: 'Roles array is required.' }
    }

    if (!data.workspaceId) {
      return { status: 400, data: 'Workspace ID is required.' }
    }

    const createdRoles = []

    for (const role of data.roles) {
      // 🔍 Check if role with same name already exists in the workspace
      const existingRole = await prisma.roles.findFirst({
        where: {
          name: role.name,
          workspaceId: data.workspaceId,
        },
      })

      if (existingRole) {
        console.log(`⚠️ Role "${role.name}" already exists in this workspace.`)
        continue // Skip this role creation
      }

      console.log('✅ Creating new role:', role.name)

      const newRole = await prisma.roles.create({
        data: {
          name: role.name,
          workspaceId: data.workspaceId,
          userId: user.id,
        },
      })

      createdRoles.push(newRole)
    }

    if (createdRoles.length === 0) {
      return {
        status: 409,
        data: 'No new roles created. All role names already exist.',
      }
    }

    return { status: 200, data: createdRoles }
  } catch (error) {
    console.error('❌ Error creating role:', error)
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

    // ❌ Prevent deleting ADMIN role
    if (role.name === defaultRoles.ADMIN) {
      console.warn('⛔ Attempt to delete protected ADMIN role:', roleId)
      return { status: 403, data: 'Cannot delete the ADMIN role' }
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
