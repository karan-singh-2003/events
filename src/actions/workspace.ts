'use server'
import { prisma } from '../lib/prisma'
import redis from '../lib/redis'
import { cookies } from 'next/headers'
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

export const createWorkspace = async (data: { name: string }) => {
  try {
    console.log('Creating workspace:', data.name)

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

    const findWorkspaceInDb = await prisma.workspaces.findFirst({
      where: { name: data.name },
    })

    if (findWorkspaceInDb) {
      return {
        status: 400,
        data: 'This workspace already exists. Try a different name.',
      }
    }

    const newWorkspace = await prisma.workspaces.create({
      data: {
        name: data.name,
        ownerId: user.id,
      },
      include: {
        user: true,
        members: true,
      },
    })
    console.log(
      'new workspace created in create workspace action is ',
      newWorkspace
    )

    return { status: 200, data: 'Workspace created successfully' }
  } catch (error) {
    console.error(' Error creating workspace:', error)
    return { status: 500, data: 'Internal server error' }
  }
}
