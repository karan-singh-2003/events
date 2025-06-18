'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Task } from '@prisma/client';
import { useTaskUpdateMutation } from '@/src/hooks/useTaskUpdateMutation';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  BLOCKED = 'BLOCKED',
}

const boardOrder: TaskStatus[] = [
  TaskStatus.BLOCKED,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.DONE,
];

type TaskState = {
  [key in TaskStatus]: Task[];
};

type Props = {
  data: Task[];
};

function DataKanban({ data }: Props) {

  const { mutateAsync: updateTask } = useTaskUpdateMutation();

  const [tasks, setTasks] = useState<TaskState>(() => {
    const initial: TaskState = {
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.DONE]: [],
      [TaskStatus.BLOCKED]: [],
    };

    data.forEach((task) => {
      initial[task.status as TaskStatus].push(task);
    });

    Object.values(initial).forEach((list) => {
      list.sort((a, b) => a.position - b.position);
    });

    return initial;
  });

  const onDragEnd = async (result: DropResult) => {
  const { source, destination } = result;
  if (!destination) return;

  const sourceList = [...tasks[source.droppableId as TaskStatus]];
  const destinationList = [...tasks[destination.droppableId as TaskStatus]];

  const [movedTask] = sourceList.splice(source.index, 1);
  destinationList.splice(destination.index, 0, movedTask);

  const updatedTasks = {
    ...tasks,
    [source.droppableId]: sourceList,
    [destination.droppableId]: destinationList,
  };

  setTasks(updatedTasks);

  try {
    await updateTask({
      id: movedTask.id,
      status: destination.droppableId,
      position: destination.index,
    });
  } catch (err) {
    console.error('Failed to update task:', err);
  }
};


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {boardOrder.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-4 shadow-xl shadow-black/30 min-h-[400px] flex flex-col"
              >
                <h2 className="text-lg font-semibold text-white border-b border-gray-600 pb-2 mb-4 uppercase tracking-wide">
                  {status.replace('_', ' ')}
                </h2>

                <div className="space-y-3 flex-1">
                  {tasks[status].map((task, index) => (
                    <Draggable
                      key={`${task.id}-${status}`}
                      draggableId={`${task.id}-${status}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className="bg-gradient-to-br from-[#232323] to-[#2e2e33] border border-gray-600 rounded-xl p-3 shadow-md hover:shadow-indigo-600/40 transition duration-300"
                        >
                          <h4 className="text-white font-semibold text-[15px] mb-1">{task.title}</h4>
                          <p className="text-xs text-gray-400 mb-1">
                            {task.deadline
                              ? `Due: ${new Date(task.deadline).toLocaleDateString()}`
                              : 'No deadline'}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium shadow-sm ${
                              task.priority === 'HIGH'
                                ? 'bg-red-600/90 text-white shadow-red-900'
                                : task.priority === 'MEDIUM'
                                ? 'bg-yellow-400 text-black shadow-yellow-600'
                                : task.priority === 'LOW'
                                ? 'bg-green-600/80 text-white shadow-green-900'
                                : 'bg-gray-600 text-white'
                            }`}
                          >
                            {task.priority || 'N/A'}
                          </span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default DataKanban;
