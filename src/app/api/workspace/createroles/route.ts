import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { cookies } from 'next/headers'
import redis from '@/src/lib/redis'

export async function POST(req: Request) {
  try {
    const cookieStore = cookies()
    const sessionId = (await cookieStore).get('session_id')?.value

    if (!sessionId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const sessionData = await redis.get(`session:${sessionId}`)
    if (!sessionData) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(sessionData)
    if (!user.email || !user.id) {
      return NextResponse.json({ message: 'Unauthorized - user data missing' }, { status: 401 })
    }

    const body = await req.json()
    const { name, workspaceId } = body

    if (!name || !workspaceId) {
      return NextResponse.json({ message: 'Name and Workspace ID are required.' }, { status: 400 })
    }

    const exists = await prisma.roles.findFirst({
      where: {
        name,
        workspaceId,
      },
    })

    if (exists) {
      return NextResponse.json({ message: 'Role already exists.' }, { status: 409 })
    }

    const newRole = await prisma.roles.create({
      data: {
        name,
        workspaceId,
        userId: user.id,
      },
    })

    return NextResponse.json({ role: newRole }, { status: 200 })
  } catch (error) {
    console.error('❌ Error creating role:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
