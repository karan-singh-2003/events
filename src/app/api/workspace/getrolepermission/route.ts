
// only for postman 
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'// Update path if needed

// Validate the incoming body

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
 
    const { workspaceId, type }:any = body

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
      roles: perm.rolePermissions.map((rp:any) => rp.role.name),
    }))

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('POST /api/workspace/getrolepermission error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
