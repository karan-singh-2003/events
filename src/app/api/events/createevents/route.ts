import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import redis from '../../../../lib/redis';
export async function POST(req: Request) {
  try {
    // Step 1: Parse request body
    const {  name, workspaceId } = await req.json();

    // Step 2: Validate session
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

    // Step 3: Validate task data
    if (!name) {
      return NextResponse.json({ message: 'Missing required event fields' }, { status: 400 });
    }

    // Check if task already exists
    const existingEvent = await prisma.event.findFirst({
      where: {
        name
      },
    });

    if (existingEvent) {
      return NextResponse.json({ message: 'event with this title already exists' }, { status: 400 });
    }

    // Step 4: Check if user is a member of the workspace
    const member = await prisma.members.findFirst({
      where: {
        userId: user.id,
        workspaceId,
      },
      include: {
        Roles: true,
      },
    });

    if (!member || !member.Roles) {
      return NextResponse.json({ message: 'You are not a member of this workspace' }, { status: 403 });
    }

    // Step 5: Check if user has permission to create tasks
    const permission = await prisma.permission.findFirst({
      where: {
        title: "who can create/edit/delete events",
        workspaceId,
      },
    });

    if (!permission) {
      return NextResponse.json({ message: 'Permission to create event not found' }, { status: 403 });
    }

    const hasPermission = await prisma.rolePermission.findFirst({
      where: {
        roleId: member.Roles.id,
        permissionId: permission.id,
        workspaceId,
      },
    });

    if (!hasPermission) {
      return NextResponse.json({ message: 'You do not have permission to create event in this workspace' }, { status: 403 });
    }

    // Step 6: Create the task in the database
    const newEvent = await prisma.event.create({
      data: {
       
        userId: user.id, // Creator of the task
        name,
        workspaceId
      },
    });

    // Step 7: Store the task in Redis
    await redis.set(`event:${newEvent.id}`, JSON.stringify(newEvent), 'EX', 3600); // Store for 1 hour

    // Step 8: Return success response
    return NextResponse.json(
      { message: 'event created successfully', task: newEvent },
      { status: 201 }
    );

  } catch (err) {
    console.error('Error creating task:', err);
    return NextResponse.json({ message: err || 'Internal server error' }, { status: 500 });
  }
}
