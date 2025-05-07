'use client'
import { Button } from '@/src/components/ui/button'
import { Separator } from '@/src/components/ui/separator'
import { useDeleteWorkspace } from '@/src/hooks/useDeleteWorkspace'
import { useQueryData } from '@/src/hooks/useQueryData'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

function Workspacesettingmain() {
  const {workspaceId} = useParams();
  const router = useRouter();

  const {
      data: Workspaces = { data: [] },
      isPending:worspacePending,
      isFetching,
    } = useQueryData(['workspaces'], async () => {
      const res = await fetch('/api/workspace/getworkspaces');
      if (!res.ok) throw new Error('Failed to fetch workspaces');
      return res.json();
    }, true);
  

  const workspaces: any[] = Workspaces?.data ?? []


  const { mutate: deleteWorkspace, isPending:deletepending } = useDeleteWorkspace({workspaceId})
  const handleDelete = () => {
    const confirmed = window.confirm('Are you sure you want to delete this workspace?')
    if (confirmed) {
      deleteWorkspace()
      
      const remainingWorkspaces = workspaces.filter(ws => ws.workspaceId !== workspaceId)
      const fallbackWorkspaceId = remainingWorkspaces[0]?.workspaceId

      if (fallbackWorkspaceId) {
        router.push(`/workspace/${fallbackWorkspaceId}`)
      } else {
        router.push(`/`) // fallback route if no workspaces left
      }

    }
  }
  return (<>
  
    <div className='flex  m-4 mt-8  justify-between'> 
        <div className='text-white/90'>
            Remove your workspace 
        </div>
        <div> <Button className='cursor-pointer px-[8px] py-2 bg-red-700'
         onClick={handleDelete}
         disabled={deletepending}
         >{deletepending ? 'Deleting...' : 'Delete Workspace'} </Button></div>

        </div>
        <div>
          <Separator className='bg-[#333] m-2'/>
        </div>
         </>
  )
}

export default Workspacesettingmain