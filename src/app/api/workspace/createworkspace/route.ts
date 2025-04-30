import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '../../../../lib/prisma'
import redis from '../../../../lib/redis'

export enum PermissionType {
  WORKSPACE = 'WORKSPACE',
  EVENT = 'EVENT',
  TASK = 'TASK',
}

export enum Role {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  SUBADMIN = 'subadmin',
  MANAGER = 'manager',
  COORDINATOR = 'coordinator',
  POSTER_ADMIN = 'poster admin',
  EVENTS_ADMIN = 'events admin',
  MEDIA_ADMIN = 'media admin',
  DATA_ENTRY = 'data entry',
  TEAM_MEMBER = 'team member',
}


export const PermissionsForWorkspace = [
  // Workspace Permissions
 
  {
    id: 1,
    type: 'WORKSPACE',
    title: 'who can edit delete workspace',
    hasPermission: ['admin', 'moderator', 'subadmin'],
  },
  {
    id: 2,
    type: 'WORKSPACE',
    title: 'who can send invite link to workspace',
    hasPermission: ['admin', 'manager', 'subadmin'],
  },
  {
    id: 3,
    type: 'WORKSPACE',
    title: 'who can approve invite members to workspace',
    hasPermission: ['admin', 'moderator', 'media admin', 'data entry', 'team member'],
  },
  {
    id: 4,
    type: 'WORKSPACE',
    title: 'who can remove members from workspace',
    hasPermission: ['admin', 'coordinator', 'poster admin'],
  },
  {
    id: 5,
    type: 'WORKSPACE',
    title: 'who can delete workspace',
    hasPermission: ['admin', 'moderator', 'events admin'],
  },

  // Event Permissions
  {
    id: 6,
    type: 'EVENT',
    title: 'who can create/edit/delete events',
    hasPermission: ['admin', 'moderator', 'subadmin'],
  },
  {
    id: 7,
    type: 'EVENT',
    title: 'who can approve/reject event proposals',
    hasPermission: ['admin', 'moderator', 'media admin', 'data entry', 'team member'],
  },
  {
    id: 8,
    type: 'EVENT',
    title: 'who can view event analytics',
    hasPermission: ['admin', 'coordinator', 'poster admin'],
  },

  // Task Permissions
  {
    id: 9,
    type: 'TASK',
    title: 'who can create/assign tasks',
    hasPermission: ['admin', 'moderator', 'media admin', 'data entry', 'team member'],
  },
  {
    id: 10,
    type: 'TASK',
    title: 'Who can mark tasks as done',
    hasPermission: ['admin', 'coordinator', 'poster admin'],
  },
  {
    id: 11,
    type: 'TASK',
    title: 'who can edit/delete tasks',
    hasPermission: ['admin', 'moderator', 'subadmin'],
  },
]


export async function POST(req: Request) {
  try {
    const { name } = await req.json()

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
    if (!user?.id || !user?.email) {
      return NextResponse.json({ message: 'Unauthorized - Invalid user data' }, { status: 401 })
    }

    const existing = await prisma.workspaces.findFirst({ where: { name } })
    if (existing) {
      return NextResponse.json(
        { message: 'This workspace already exists. Try a different name.' },
        { status: 400 }
      )
    }

    const createdWorkspace = await prisma.$transaction(async (tx) => {
      const workspace = await tx.workspaces.create({
        data: {
          name,
          ownerId: user.id,
        },
      })

      const roleRecords = await Promise.all(
        Object.values(Role).map((roleName) =>
          tx.roles.create({
            data: {
              name: roleName,
              workspaceId: workspace.id,
              userId: user.id,
            },
          })
        )
      )

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

      const mappings = []
      for (const perm of permissionRecords) {
        const config = PermissionsForWorkspace.find((p) => p.title === perm.title)
        if (!config) continue

        const rolesWithAccess = roleRecords.filter((r:any) => config.hasPermission.includes(r.name))
        for (const role of rolesWithAccess) {
          mappings.push(
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

      await Promise.all(mappings)

      const adminRole = roleRecords.find((r) => r.name === Role.ADMIN)
      await tx.members.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
          rolesId: adminRole?.id,
        },
      })

      return workspace
    })

    return NextResponse.json({ message: 'Workspace created successfully', workspace: createdWorkspace }, { status: 200 })
  } catch (err) {
    console.error('Error creating workspace:', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
