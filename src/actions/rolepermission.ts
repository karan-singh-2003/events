'use server'
import { cookies } from 'next/headers'
import { prisma } from '../lib/prisma'
import redis from '../lib/redis'


export const getWorkspaceRolePermissions = async (workspaceId: string) => {
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
  
      const rolePermissionMap = await prisma.$queryRaw`
        SELECT 
          "Permission".id AS permission_id,
          "Permission".title AS permission_title,
          "Permission".type AS permission_type,
          "Roles".id AS role_id,
          "Roles".name AS role_name
        FROM "RolePermission"
        JOIN "Permission" ON "RolePermission"."permissionId" = "Permission".id
        JOIN "Roles" ON "RolePermission"."roleId" = "Roles".id
        WHERE "RolePermission"."workspaceId" = ${workspaceId}::text
        ORDER BY "Permission".title, "Roles".name;
      `
  
      return { status: 200, data: rolePermissionMap }
    } catch (error) {
      console.error('Error fetching role-permission mapping:', error)
      return { status: 500, data: 'Internal Server Error' }
    }
  }
  