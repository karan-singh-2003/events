import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import redis from '../../../../lib/redis';

export async function POST(req: Request) {
  try {
    // Step 1: Parse request body
    const { name, workspaceId, deadline, description, status, priority } = await req.json();

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

    // Step 3: Validate project data
    if (!name || !workspaceId || !deadline || !description || !status || !priority) {
      return NextResponse.json({ message: 'Missing required project fields' }, { status: 400 });
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

    // Step 5: Check if the user has permission to create a project
    const permission = await prisma.permission.findFirst({
      where: {
        title: "who can create/edit/delete events",
        workspaceId,
      },
    });

    if (!permission) {
      return NextResponse.json({ message: 'Permission to create project not found' }, { status: 403 });
    }

    // Check if the user's role has the necessary permission
    const hasPermission = await prisma.rolePermission.findFirst({
      where: {
        roleId: member.Roles.id,
        permissionId: permission.id,
        workspaceId,
      },
    });

    if (!hasPermission) {
      return NextResponse.json({ message: 'You do not have permission to create a project in this workspace' }, { status: 403 });
    }

    // Step 6: Create the project in the database
    const newProject = await prisma.event.create({
      data: {
        name,
        description,
        deadline: new Date(deadline),
        status,
        priority,
        workspaceId,
        userId: user.id, // Assigning user as the creator
      },
    });

    // Step 7: Store the project in Redis
    await redis.set(`project:${newProject.id}`, JSON.stringify(newProject), 'EX', 3600); // Store for 1 hour

    // Step 8: Return the created project details in the response
    return NextResponse.json(
      { message: 'Project created successfully', project: newProject },
      { status: 201 }
    );

  } catch (err) {
    console.error('Error creating project:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
