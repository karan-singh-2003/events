///api/events/getallprojects?workspaceId=${workspaceId}
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import redis from '../../../../lib/redis';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');

    // Step 1: Validate workspaceId
    if (!workspaceId) {
      return NextResponse.json({ message: 'workspaceId is required' }, { status: 400 });
    }

    const cookieStore = cookies();
    const sessionId = (await cookieStore).get('session_id')?.value;

    if (!sessionId) {
      return NextResponse.json({ message: 'Unauthorized - No session ID' }, { status: 401 });
    }

    const sessionData = await redis.get(`session:${sessionId}`);
    if (!sessionData) {
      return NextResponse.json({ message: 'Unauthorized - No session data' }, { status: 401 });
    }

    const user = JSON.parse(sessionData);
    if (!user?.id) {
      return NextResponse.json({ message: 'Unauthorized - Invalid user data' }, { status: 401 });
    }

    
    // Step 3: Confirm user is a member of the workspace
    const member = await prisma.members.findFirst({
      where: {
        userId: user.id,
        workspaceId,
      },
    });

    if (!member) {
      return NextResponse.json({ message: 'You are not a member of this workspace' }, { status: 403 });
    }

    // Step 4: Try to get from Redis cache
    const cachedEvents = await redis.get(`events:${workspaceId}`);
    if (cachedEvents) {
      return NextResponse.json(JSON.parse(cachedEvents), { status: 200 });
    }

    // Step 5: Fetch from DB
    const events = await prisma.event.findMany({
      where: {
        workspaceId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Step 6: Cache result in Redis for 10 minutes
    await redis.set(`events:${workspaceId}`, JSON.stringify(events), 'EX', 600);

    // Step 7: Return events
    return NextResponse.json(events, { status: 200 });

  } catch (err) {
    console.error('Error fetching events:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
