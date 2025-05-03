import { Button } from '@/src/components/ui/button'
import React from 'react'

function Workspacesettingmain() {
  return (
    <div className='flex  m-4 mt-8 justify-between'> 
        <div className='text-white/90'>
            Remove your workspace 
        </div>
        <div> <Button className='cursor-pointer px-[47px] py-2 bg-red-700'>delete </Button></div>
        </div>
  )
}

export default Workspacesettingmain