'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RiAddCircleFill } from 'react-icons/ri';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from '@/src/components/global/Spinner';
import { useQueryData } from '@/src/hooks/useQueryData';

function WorkspacesSwitcher() {
  const {
    data: workspaces = { data: [] },
    isPending,
    isFetching,
  } = useQueryData(['workspaces'], async () => {
    const res = await fetch('/api/workspace/getworkspaces');
    if (!res.ok) throw new Error('Failed to fetch workspaces');
    return res.json();
  }, true);

  const router = useRouter();
  const { workspaceId } = useParams();
  const currentWorkspaceId = workspaceId;

  const currentWorkspace = workspaces.data.find(
    (w: any) => w.workspaceId === currentWorkspaceId
  );

  const onSelect = (id: string) => {
    router.push(`/workspace/${id}`);
  };

  if (isPending || isFetching) {
    return (
      <div className="flex justify-center items-center h-[50px]">
        <Spinner color='#aaaa' size={14} />
      </div>
    );
  }

  return (
    <div className="flex flex gap-y-2">
      <Select onValueChange={onSelect} value={currentWorkspaceId}>
        <SelectTrigger className="ml-1 h-[12px] w-[12px] p-[15px] bg-white shadow-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-300 border-[0.8px] border-[#a1a1a1 flex items-center justify-center">
          <div className="text-sm font-sans text-gray-900">
            {currentWorkspace?.workspaceName?.[0]?.toUpperCase() || 'W'}
          </div>
        </SelectTrigger>

        <SelectContent className="bg-white text-gray-800 border border-gray-300 ">
          {Array.isArray(workspaces?.data) &&
            workspaces.data.map((workspace: any) => (
              <SelectItem
                key={workspace.workspaceId}
                value={workspace.workspaceId}
                className="flex items-center gap-3 px-3 py-2 hover:bg-indigo-100 rounded-md transition-colors"
              >
               
                <span className="text-sm font-medium text-gray-900">
                  {workspace.workspaceName}
                </span>
              </SelectItem>
              
            ))}
        </SelectContent>
      </Select>
      <div className="text-xs font-sans flex uppercase font-[500]  text-[#363636] m-2">
            {currentWorkspace?.workspaceName|| 'select workspace'}
          </div>
    </div>
  );
}

export default WorkspacesSwitcher;
