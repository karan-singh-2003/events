import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma'; // Adjust this if your path is different

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const eventId = searchParams.get('eventId');
    const workspaceId = searchParams.get('workspaceId'); // Optional but may be useful
    const assigneId = searchParams.get('assigneId');
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const dueDate = searchParams.get('dueDate');

    // 🔐 Basic validation
    if (!eventId) {
      return NextResponse.json({ message: 'Missing eventId' }, { status: 400 });
    }

    // 🧠 Build where clause dynamically
    const whereClause: any = {
      eventId,
      ...(assigneId && { assigningMemberId: assigneId }),
      ...(projectId && { id: projectId }), // Task ID as projectId from frontend
      ...(status && { status }),
      ...(dueDate && { deadline: new Date(dueDate) }),
    };

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        assigningMember: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedTasks = tasks.map((task) => ({
      ...task,
      assignedMemberName: task.assigningMember?.user?.name || 'Unassigned',
    }));

    return NextResponse.json({ tasks: formattedTasks }, { status: 200 });

  } catch (err: any) {
    console.error('❌ Error fetching tasks:', err);
    return NextResponse.json({ message: 'Failed to fetch tasks' }, { status: 500 });
  }
}
