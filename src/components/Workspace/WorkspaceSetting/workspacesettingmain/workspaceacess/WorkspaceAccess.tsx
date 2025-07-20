'use client'
import { Button } from '@/src/components/ui/button'
import { Separator } from '@/src/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

function WorkspaceAccess() {
  const {workspaceId} = useParams();
  const router = useRouter()
  return (<>
  
  
    <div className='flex  m-4 justify-between'>
        <div className='text-black'>Role-Permissions Access</div>
        <div><Button className='cursor-pointer  px-[47px] py-2 bg-[#635BFF] ' onClick={()=>{router.push(`/${workspaceId}/roles-permissions`)}}>launch</Button></div>
    </div>
    <div>
          <Separator className='bg-[#333] m-2'/>
        </div>
  </>
  )
}

export default WorkspaceAccess