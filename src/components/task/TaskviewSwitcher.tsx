'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Separator } from '../ui/separator';
import TaskModalTriggerButton from '../Workspace/TaskModaltriger/Index';
import { useQueryData } from '@/src/hooks/useQueryData';
import { useParams } from 'next/navigation';
import TaskSkeleton from '../skeleton'; // adjust path as needed
import { usegetallTasks } from '@/src/hooks/usegetalltasks';
import { usegetallmembers } from '@/src/hooks/usegetallmembers';
import Index from '../datafiltertask/Index';
import { useTaskfilter } from '@/src/hooks/useTaskfilter';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DataKanban from '../datakanban/DataKanban';


function TaskviewSwitcher() {
   const [{ status, assigneId, projectId, dueDate }, setFilters] = useTaskfilter();


  const { workspaceId, eventId } = useParams();

  const {tasks, isFetching, isPending, refetch} = usegetallTasks({ workspaceId, eventId});
  return (
    <div className="bg-[#121212] text-white rounded-lg border border-gray-700 ">
      <Tabs className="w-full">
        <div className="h-full flex flex-col overflow-auto p-4">
          <div className="flex flex-col gap-y-4 lg:flex-row justify-between items-center">
            <TabsList className="w-full lg:w-auto bg-[#1c1c24] border border-gray-700">
              <TabsTrigger
                value="table"
                className="h-8 w-full lg:w-auto text-white data-[state=active]:bg-gray-700 data-[state=active]:text-white cursor-pointer hover:border-amber-50"
              >
                Table
              </TabsTrigger>
              <TabsTrigger
                value="kanban"
                className="h-8 w-full lg:w-auto  text-white data-[state=active]:bg-gray-700 data-[state=active]:text-white cursor-pointer hover:border-amber-50"
              >
                Kanban
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="h-8 w-full lg:w-auto text-white data-[state=active]:bg-gray-700 data-[state=active]:text-white cursor-pointer border-2 hover:border-amber-50"
              >
                Calendar
              </TabsTrigger>
            </TabsList>
           <Button
  size="sm"
  className="w-full lg:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold flex items-center gap-2 shadow-lg transition"
>
  New <TaskModalTriggerButton />
</Button>

          </div>
          <Separator className='my-4 bg-gray-500' />
          <Index />
          <Separator className='my-4  bg-gray-500' />

       <TabsContent value="table" >
  {(isPending || isFetching) ? (
    [...Array(4)].map((_, i) => <TaskSkeleton key={i} />)
  ) : (
    <div className="rounded-xl border border-gray-600 overflow-hidden shadow-md shadow-indigo-500/10 ">
      <Table className="text-white">
        <TableHeader className="bg-[#1c1c24] text-white">
          <TableRow>
            <TableHead className="text-white font-semibold text-base">Task</TableHead>
            <TableHead className="text-white font-semibold text-base">Assigned To</TableHead>
            <TableHead className="text-white font-semibold text-base">Due Date</TableHead>
            <TableHead className="text-white font-semibold text-base">Priority</TableHead>
            <TableHead className="text-white font-semibold text-base text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-[#121212]">
          {tasks.map((task: any) => (
            <TableRow
              key={task.id}
              className="hover:bg-[#1e1e2e] transition-all  duration-200 border-gray-600 cursor-pointer"
            >
              <TableCell className="font-medium text-white text-[15px] ">{task.title}</TableCell>
              <TableCell className="text-gray-200 text-[14px]">
                {task.assigningMember?.user?.name || (
                  <span className="italic text-gray-500">Unassigned</span>
                )}
              </TableCell>
              <TableCell className="text-gray-200 text-[14px]">
                {task.deadline ? new Date(task.deadline).toLocaleDateString() : (
                  <span className="italic text-gray-500">No deadline</span>
                )}
              </TableCell>
             <TableCell>
  {task.priority ? (
    <span
      className={`
        text-xs px-2 py-1 rounded-full font-medium shadow-sm
        ${
          task.priority === 'HIGH'
            ? 'bg-red-600/80 text-white shadow-red-900'
            : task.priority === 'MEDIUM'
            ? 'bg-yellow-500/80 text-black shadow-yellow-700'
            : task.priority === 'LOW'
            ? 'bg-green-600/70 text-white shadow-green-900'
            : 'bg-gray-600 text-white'
        }
      `}
    >
      {task.priority}
    </span>
  ) : (
    <span className="text-xs italic text-gray-500">N/A</span>
  )}
</TableCell>

              <TableCell className="text-right">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
                    task.status === 'DONE'
                      ? 'bg-green-700/80 text-white shadow-green-800'
                      : task.status === 'IN_PROGRESS'
                      ? 'bg-yellow-600/80 text-white shadow-yellow-800'
                      : task.status === 'BLOCKED'
                      ? 'bg-red-600/80 text-white shadow-red-800'
                      : 'bg-gray-600/80 text-white shadow-md'
                  }`}
                >
                  {task.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )}
</TabsContent>

          <TabsContent value="kanban"><DataKanban data={tasks}/></TabsContent>
          <TabsContent value="calendar">Calendar View Here</TabsContent>
        
        </div>
      </Tabs>
    </div>
  );
}

export default TaskviewSwitcher;
