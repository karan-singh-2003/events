'use client'

import { usegetallmembers } from '@/src/hooks/usegetallmembers';
import { usegetallTasks } from '@/src/hooks/usegetalltasks';
import { useParams } from 'next/navigation';
import React from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListCheckIcon, UserIcon } from 'lucide-react';
import { SelectSeparator } from '@radix-ui/react-select';
import { useTaskfilter } from '@/src/hooks/useTaskfilter';

interface taskfilerProps {
  hideTaskfilter: boolean;
}

const statusOptions = ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'];

function Index({ hideTaskfilter }: taskfilerProps) {
  const { workspaceId, eventId } = useParams();
  const { tasks } = usegetallTasks({ workspaceId, eventId });
  const { members } = usegetallmembers();
  const [{ status, assigneId, projectId, dueDate }, setFilters] = useTaskfilter();

  const projectoption = tasks.map((task: any) => ({
    value: task.id,
    label: task.title
  }));

  const memberOptions = members.map((member: any) => ({
    value: member.id,
    label: member.user.name
  }));

  const onStatusChange = (value: string) => {
    if (value === 'all') {
      setFilters({ status: null });
    } else {
      setFilters({ status: value as any });
    }
  };

  const onAssigneIdChange = (value: string) => {
    if (value === 'all') {
      setFilters({ assigneId: null });
    } else {
      setFilters({ assigneId: value as any });
    }
  };


  const onProjectChange = (value: string) => {
    if (value === 'all') {
      setFilters({ projectId: null });
    } else {
      setFilters({ projectId: value as any });
    }
  };

  return (
    <div>

      <div className='flex gap-1  '>
 <Select defaultValue={status ?? undefined} onValueChange={onStatusChange}>
        <SelectTrigger className='w-full lg:w-auto h-8'>
          <div className='flex items-center pr-2'>
            <ListCheckIcon className='size-4 mr-2 text-white' />
            <SelectValue placeholder='All Statuses' />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All statuses</SelectItem>
          <SelectSeparator />
          {statusOptions.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    
   <Select defaultValue={assigneId ?? undefined} onValueChange={onAssigneIdChange}>
  <SelectTrigger className='w-full lg:w-auto h-8'>
    <div className='flex items-center pr-2'>
      <UserIcon className='size-4 mr-2 text-white' />
      <SelectValue placeholder='All Assignees' />
    </div>
  </SelectTrigger>

  <SelectContent>
    <SelectItem value='all'>All Assignees</SelectItem>
    <SelectSeparator />
    
    {memberOptions.map((member: any) => (
      <SelectItem key={member.value} value={member.value}>
        {member.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>


   <Select defaultValue={projectId ?? undefined} onValueChange={onProjectChange}>
  <SelectTrigger className='w-full lg:w-auto h-8'>
    <div className='flex items-center pr-2'>
      <UserIcon className='size-4 mr-2 text-white'  />
      <SelectValue placeholder='All taks' />
    </div>
  </SelectTrigger>

  <SelectContent>
    <SelectItem value='all'>All Tasks </SelectItem>
    <SelectSeparator />
    
    {projectoption.map((project: any) => (
      <SelectItem key={project.value} value={project.value}>
        {project.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
      </div>
     

    
    
    </div>
  );
}

export default Index;
