'use server'
import { prisma } from '../lib/prisma'
import redis from '../lib/redis'
import { cookies } from 'next/headers'

import { defaultRoles } from '../enums/constantRoles'
import { PermissionsForWorkspace } from '../enums/constants'
import { any } from 'zod'
import { PermissionType } from '@prisma/client'


export const getUserAllWorkspaces = async () => {
  console.log('fetching workspaces')
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

    const workspaces = await prisma.$queryRaw`
      SELECT 
          w.id AS "workspaceId",
          w.name AS "workspaceName",
          u.id AS "ownerId",
          w."isOnboarded",
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
      GROUP BY w.id, w.name, w."isOnboarded", u.id, u.name, u.email;
    `

    console.log('fetched workspaces from db')
    return { status: 200, data: workspaces ?? [] }
  } catch (error) {
    console.error(' Error fetching workspaces:', error)
    return { status: 500, data: 'Internal server error' }
  }
}


export async function renameWorkspace({
  name,
  workspaceId,
  
}: {
  name: string
  workspaceId: string
  
}) {

  const cookieStore = cookies()
    const sessionId = (await cookieStore).get('session_id')?.value

  if (!sessionId) {
    return { error: 'Unauthorized - No session ID', status: 401 }
  }

  const sessionData = await redis.get(`session:${sessionId}`)
  if (!sessionData) {
    return { error: 'Unauthorized - No session data', status: 401 }
  }

  const user = JSON.parse(sessionData)
  if (!user?.id) {
    return { error: 'Unauthorized - Invalid user data', status: 401 }
  }

  if (!name || !workspaceId) {
    return { error: 'Missing name or workspace ID', status: 400 }
  }

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
    return { error: 'You are not a member of this workspace', status: 403 }
  }

  const permission = await prisma.permission.findFirst({
    where: {
      title: 'who can rename workspace',
      workspaceId,
    },
  })

  if (!permission) {
    return { error: 'Rename permission not found', status: 403 }
  }

  const hasPermission = await prisma.rolePermission.findFirst({
    where: {
      roleId: member.Roles.id,
      permissionId: permission.id,
      workspaceId,
    },
  })

  if (!hasPermission) {
    return { error: 'You do not have permission to rename this workspace', status: 403 }
  }

  const updatedWorkspace = await prisma.workspaces.update({
    where: {
      id: workspaceId,
    },
    data: {
      name,
    },
  })

  return { workspace: updatedWorkspace }
}
