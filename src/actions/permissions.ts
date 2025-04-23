'use server'
import { cookies } from 'next/headers'
import { prisma } from '../lib/prisma'
import redis from '../lib/redis'


export const getWorkspaceAllPermissions = async (workspaceId: string) => {
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
  
      let cachedWorkspaceId = await redis.get(`workspace:${user.email}`)
      if (!cachedWorkspaceId) {
        await redis.setex(`workspace:${user.email}`, 3600, workspaceId)
        cachedWorkspaceId = workspaceId
      }
  
      const permissions = await prisma.$queryRaw`
        SELECT 
          "Permission".id AS permission_id,
          "Permission".title AS permission_title,
          "Permission".type AS permission_type,
          "Workspaces".id AS workspace_id,
          "Workspaces".name AS workspace_name,
          ARRAY_AGG("Roles".name) AS roles_with_access
        FROM "Permission"
        LEFT JOIN "RolePermission" ON "Permission".id = "RolePermission"."permissionId"
        LEFT JOIN "Roles" ON "Roles".id = "RolePermission"."roleId"
        JOIN "Workspaces" ON "Permission"."workspaceId" = "Workspaces".id
        WHERE "Workspaces".id = ${workspaceId}::text
        GROUP BY "Permission".id, "Workspaces".id;
      `
  
      return { status: 200, data: permissions }
    } catch (error) {
      console.error('Error fetching permissions:', error)
      return { status: 500, data: 'Internal Server Error' }
    }
  }
  