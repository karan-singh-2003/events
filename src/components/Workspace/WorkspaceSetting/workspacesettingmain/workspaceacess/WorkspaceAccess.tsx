import { Button } from '@/src/components/ui/button'
import React from 'react'

function WorkspaceAccess() {
  return (
    <div className='flex  m-4 justify-between'>
        <div className='text-white/90'>Role-Permissions Access</div>
        <div><Button className='cursor-pointer  px-[47px] py-2 bg-[#635BFF] '>launch</Button></div>
    </div>
  )
}

export default WorkspaceAccess