import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma'; // adjust path as needed
import { cookies } from 'next/headers'; // for app router; if using pages router, use cookie parser
import redis from '@/src/lib/redis'; // adjust path to your Redis client

export async function GET() {
  try {
    const cookieStore = cookies()
       const sessionId = (await cookieStore).get('session_id')?.value
   
    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized - No session ID' }, { status: 401 });
    }

    const sessionData = await redis.get(`session:${sessionId}`);
    if (!sessionData) {
      return NextResponse.json({ error: 'Unauthorized - No session data' }, { status: 401 });
    }

    const user = JSON.parse(sessionData);
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized - Invalid user data' }, { status: 401 });
    }

    // Get workspace memberships
    const userMemberships = await prisma.members.findMany({
      where: {
        userId: user.id,
      },
      select: {
        workspaceId: true,
      },
    });

    const workspaceIds = userMemberships.map(m => m.workspaceId);

    if (workspaceIds.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    // Fetch workspace name and member count
    const workspacesWithCounts = await Promise.all(
      workspaceIds.map(async (id) => {
        const workspace = await prisma.workspaces.findUnique({
          where: { id },
          select: { name: true },
        });

        const memberCount = await prisma.members.count({
          where: { workspaceId: id },
        });

        return {
          workspaceId: id,
          workspaceName: workspace?.name,
          memberCount,
        };
      })
    );

    return NextResponse.json({ data: workspacesWithCounts }, { status: 200 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
