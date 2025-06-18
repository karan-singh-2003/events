import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import redis from '../../../../lib/redis';

export async function POST(req: Request) {
  try {
    // Step 1: Parse request body
    const { title, description, status, priority, deadline, eventId,assigningMemberId, workspaceId } = await req.json();

    if (!title || !description || !eventId || !workspaceId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

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
      return NextResponse.json({ message: 'Unauthorized - Invalid user' }, { status: 401 });
    }

    // Step 3: Check membership
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
      return NextResponse.json({ message: 'Not a member of this workspace' }, { status: 403 });
    }

    // Step 4: Permission check
    const permission = await prisma.permission.findFirst({
      where: {
        title: 'who can create/edit/delete events',
        workspaceId,
      },
    });

    if (!permission) {
      return NextResponse.json({ message: 'Permission not found' }, { status: 403 });
    }

    const hasPermission = await prisma.rolePermission.findFirst({
      where: {
        roleId: member.Roles.id,
        permissionId: permission.id,
        workspaceId,
      },
    });

    if (!hasPermission) {
      return NextResponse.json({ message: 'You do not have permission to create tasks' }, { status: 403 });
    }

    // Step 5: Create the task
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status: status ,
        priority: priority ,
        deadline: deadline ? new Date(deadline) : null,
        userId: user.id,
        assigningMemberId,
        eventId,
      },
    });

    // Step 6: Optionally cache or invalidate Redis
    await redis.del(`tasks:${workspaceId}`); // optional: clear cache for workspace task list

    return NextResponse.json(
      { message: 'Task created successfully', task: newTask },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error creating task:', err);
    return NextResponse.json({ message: err.message || 'Internal server error' }, { status: 500 });
  }
}
