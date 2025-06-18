import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma'; // Adjust this if your path is different

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const taskId = params.id;
  const body = await request.json();

  const { status, position } = body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status
       
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { message: 'Failed to update task' },
      { status: 500 }
    );
  }
}
