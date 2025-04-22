'use server'
import { prisma } from '../lib/prisma'
import redis from '../lib/redis'
import { cookies } from 'next/headers'

import { defaultRoles } from '../enums/constantRoles'
import { PermissionsForWorkspace } from '../enums/constants'
import { any } from 'zod'
import { PermissionType } from '@prisma/client'

export const getUserAllWorkspaces = async () => {
  console.log('Fetching workspaces...')
  try {
    const cookieStore = cookies()
    const sessionId = (await cookieStore).get('session_id')?.value

    if (!sessionId) {
      console.error('❌ No session found in cookies.')
      return { status: 401, data: 'Unauthorized' }
    }

    const sessionData = await redis.get(`session:${sessionId}`)
    if (!sessionData) {
      console.error('❌ No session data found in Redis.')
      return { status: 401, data: 'Unauthorized' }
    }

    const user = JSON.parse(sessionData)
    if (!user.id || !user.email) {
      console.error('❌ User info missing in session.')
      return { status: 401, data: 'Unauthorized' }
    }

    const cacheKey = `user:${user.id}:workspaces`
    const cached = await redis.get(cacheKey)
    if (cached) {
      console.log('✅ Returning workspaces from cache')
      return { status: 200, data: JSON.parse(cached) }
    }

    const workspaces = await prisma.$queryRaw`
      WITH owner_workspaces AS (
        SELECT 
            w.id AS "workspaceId",
            w.name AS "workspaceName",
            w."isOnboarded",
            u.id AS "ownerId",
            u.name AS "ownerName",
            u.email AS "ownerEmail",
            COUNT(m.id) AS "membersCount",
            COALESCE(json_agg(
                json_build_object(
                    'id', u2.id,
                    'name', u2.name,
                    'email', u2.email,
                    'isAdmin', u2."isAdmin"
                )
            ) FILTER (WHERE u2.id IS NOT NULL), '[]'::json) AS "members"
        FROM "Workspaces" w
        JOIN "User" u ON w."ownerId" = u.id
        LEFT JOIN "Members" m ON w.id = m."workspaceId"
        LEFT JOIN "User" u2 ON m."userId" = u2.id
        WHERE u.email = ${user.email}
        GROUP BY w.id, u.id
      ),
      member_workspaces AS (
        SELECT 
            w.id AS "workspaceId",
            w.name AS "workspaceName",
            w."isOnboarded",
            u.id AS "ownerId",
            u.name AS "ownerName",
            u.email AS "ownerEmail",
            COUNT(m2.id) AS "membersCount",
            COALESCE(json_agg(
                json_build_object(
                    'id', u3.id,
                    'name', u3.name,
                    'email', u3.email,
                    'isAdmin', u3."isAdmin"
                )
            ) FILTER (WHERE u3.id IS NOT NULL), '[]'::json) AS "members"
        FROM "Members" m1
        JOIN "Workspaces" w ON m1."workspaceId" = w.id
        JOIN "User" u ON w."ownerId" = u.id
        LEFT JOIN "Members" m2 ON w.id = m2."workspaceId"
        LEFT JOIN "User" u3 ON m2."userId" = u3.id
        WHERE m1."userId" = ${user.id}
        GROUP BY w.id, u.id
      )

      SELECT DISTINCT * FROM owner_workspaces
      UNION
      SELECT DISTINCT * FROM member_workspaces;
    `

    console.log('✅ Workspaces fetched from DB')
    await redis.set(cacheKey, JSON.stringify(workspaces), 'EX', 60 * 5) // cache 5 mins

    return { status: 200, data: workspaces ?? [] }
  } catch (error) {
    console.error('❌ Error fetching workspaces:', error)
    return { status: 500, data: 'Internal server error' }
  }
}

export const createWorkspace = async (data: { name: string }) => {
  try {
    console.log('🛠️ Creating workspace:', data.name)

    const cookieStore = cookies()
    const sessionId = (await cookieStore).get('session_id')?.value
    if (!sessionId) {
      console.error('❌ No session ID in cookies.')
      return { status: 401, data: 'Unauthorized' }
    }

    const sessionData = await redis.get(`session:${sessionId}`)
    if (!sessionData) {
      console.error('❌ Session not found in Redis.')
      return { status: 401, data: 'Unauthorized' }
    }

    const user = JSON.parse(sessionData)
    if (!user?.id || !user?.email) {
      console.error('❌ User info missing in session.')
      return { status: 401, data: 'Unauthorized' }
    }

    // Check in DB
    const existingWorkspace = await prisma.workspaces.findFirst({
      where: { name: data.name },
    })

    if (existingWorkspace) {
      return {
        status: 400,
        data: 'This workspace already exists. Try a different name.',
      }
    }

    // Transaction: create workspace + roles + permissions
    const createdWorkspace = await prisma.$transaction(async (tx) => {
      const workspace = await tx.workspaces.create({
        data: {
          name: data.name,
          ownerId: user.id,
        },
      })

      // Create roles
      const roleEntries = Object.values(defaultRoles)
      const roleRecords = await Promise.all(
        roleEntries.map((roleName) =>
          tx.roles.create({
            data: {
              name: roleName,
              workspaceId: workspace.id,
              userId: user.id,
            },
          })
        )
      )

      // Create permissions
      const permissionRecords = await Promise.all(
        PermissionsForWorkspace.map((perm) =>
          tx.permission.create({
            data: {
              title: perm.title,
              type: perm.type as PermissionType,
              workspaceId: workspace.id,
              userId: user.id,
            },
          })
        )
      )

      // Map role-permission relationships
      const rolePermMappings = []
      for (const perm of permissionRecords) {
        const config = PermissionsForWorkspace.find((p) => p.title === perm.title)
        if (!config) continue

        const rolesWithAccess = roleRecords.filter((r) =>
          config.hasPermission.includes(r.name)
        )

        for (const role of rolesWithAccess) {
          rolePermMappings.push(
            tx.rolePermission.create({
              data: {
                roleId: role.id,
                permissionId: perm.id,
                workspaceId: workspace.id,
              },
            })
          )
        }
      }

      await Promise.all(rolePermMappings)

      // Add user as admin member
      const adminRole = roleRecords.find((r) => r.name === defaultRoles.ADMIN)
      await tx.members.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
          rolesId: adminRole?.id,
        },
      })

      return workspace
    })

    console.log('✅ Workspace created:', createdWorkspace.id)
    return { status: 200, data: 'Workspace created successfully' }
  } catch (error) {
    console.error('❌ Error in createWorkspace:', error)
    return { status: 500, data: 'Internal server error' }
  }
}
