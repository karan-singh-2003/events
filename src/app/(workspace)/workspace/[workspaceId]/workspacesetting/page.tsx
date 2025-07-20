'use client';
import WorkspacesettingHeader from '@/src/components/Workspace/WorkspaceSetting/workspacesettingheader/WorkspacesettingHeader'
import WorkspaceAccess from '@/src/components/Workspace/WorkspaceSetting/workspacesettingmain/workspaceacess/WorkspaceAccess'
import Workspacesettingmain from '@/src/components/Workspace/WorkspaceSetting/workspacesettingmain/workspacedelete/Workspacesettingdelete'
import React from 'react'

// function page() {
//   return (
//     <>
    
//     <WorkspacesettingHeader/>
//     <Workspacesettingmain/>
//     <WorkspaceAccess/>
//     </>
//   )
// }

// export default page


import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Separator } from '@/src/components/ui/separator';
import TaskModalTriggerButton from '@/src/components/Workspace/TaskModaltriger/Index';
import { useQueryData } from '@/src/hooks/useQueryData';
import { useParams } from 'next/navigation';
import TaskSkeleton from '@/src/components/skeleton';
import { usegetallTasks } from '@/src/hooks/usegetalltasks';
import { usegetallmembers } from '@/src/hooks/usegetallmembers';

import { useTaskfilter } from '@/src/hooks/useTaskfilter';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';


function TaskviewSwitcher() {

  const { workspaceId, eventId } = useParams();

  return (
    <div className="bg-[#ffff] text-[#828282] rounded-lg  ">
      <div className='text-black font-bold ml-5 text-[25px] '> Organization Settings</div>
      <Tabs className="w-full">
        <div className="h-full flex flex-col overflow-auto p-4">
          <div className="flex flex-col gap-y-4 lg:flex-row justify-between items-center">
            <TabsList className="w-full lg:w-auto bg-[#ffff gap-3 ">
              <TabsTrigger
                value="workspace profile"
                className="h-8 w-full lg:w-auto text-xs text-[#828282] data-[state=active]:underline decoration-[#5267ee] decoration-2 underline-offset-4   data-[state=active]:text-[#5267ee] cursor-pointer hover:border-amber-50"
              >
                Workspace Profile
              </TabsTrigger>
              <TabsTrigger
                value="Team Management"
                className="h-8 w-full lg:w-auto text-xs text-[#828282] data-[state=active]:underline decoration-[#5267ee] decoration-2 underline-offset-4 data-[state=active]:text-[#5267ee] cursor-pointer hover:border-amber-50"
              >
                Team Management
              </TabsTrigger>
              <TabsTrigger
                value="Roles Management"
                className="h-8 w-full lg:w-auto text-xs text-[#828282] data-[state=active]:underline decoration-[#5267ee] decoration-2 underline-offset-4 data-[state=active]:text-[#5267ee] cursor-pointer border-2 hover:border-amber-50"
              >
                Roles Management
              </TabsTrigger>
            </TabsList>
          

          </div>
        
       <TabsContent value="workspace profile" >
 <>
   <WorkspacesettingHeader/>
   {/* <Workspacesettingmain/>
     <WorkspaceAccess/> */}
 </>
</TabsContent>

          <TabsContent value="Team Management"><h2>Team Management</h2></TabsContent>
          <TabsContent value="Roles Management">Roles Management</TabsContent>
        
        </div>
      </Tabs>
    </div>
  );
}

export default TaskviewSwitcher;
