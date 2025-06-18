

'use client';

import React from 'react';
import { RiAddCircleFill } from 'react-icons/ri';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useParams } from 'next/navigation';
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

  const onSelect = (id: string) => {
    router.push(`/workspace/${id}`);
  };

  if (isPending || isFetching) {
    return (
      <div className="flex justify-center items-center h-[50px]">
        <Spinner color="#FFFFFF" size={14} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm uppercase text-white/70 tracking-wider">Workspaces</p>
        <RiAddCircleFill
          className="cursor-pointer text-indigo-400 hover:text-indigo-500 size-5 transition-colors duration-200"
          onClick={() => router.push('/workspace/choose-workspace')}
        />
      </div>

      <Select onValueChange={onSelect} value={currentWorkspaceId}>
        <SelectTrigger className="w-full font-medium p-2 text-gray-100 bg-[#2C2C2C] border border-[#3a3a3a] rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
          <SelectValue placeholder="Select a workspace" className="text-gray-300" />
        </SelectTrigger>

        <SelectContent className="bg-[#2C2C2C] text-gray-200 border border-[#3a3a3a]">
          {Array.isArray(workspaces?.data) &&
            workspaces.data.map((workspace: any) => (
              <SelectItem
                key={workspace.workspaceId}
                value={workspace.workspaceId}
                className="hover:bg-indigo-500/20 hover:text-indigo-300 cursor-pointer transition-colors duration-150 rounded-md"
              >
                {workspace.workspaceName} 
                {/* {workspace.memberCount} */}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default WorkspacesSwitcher;
