'use client'

import WorkspaceNavbar from '@/src/components/Workspace/workspaceFront/WorkspaceNavbar/WorkspaceNavbar'
import WorkspaceSlider from '@/src/components/Workspace/workspaceFront/WorkspaceSlider'

import React from 'react'


import { NuqsAdapter} from 'nuqs/adapters/next'


interface DashboardlayoutProps {
    children:React.ReactNode
}

function layout({children}:DashboardlayoutProps) {
  return (
    <div className='min-h-screen bg-[#121212]'>
        
        <div className='flex w-full h-full'>
            <div className='fixed left-0 top-0 hidden lg:block lg:w-[264px]  h-full overflow-y-auto'>
                <WorkspaceSlider/>
            </div>
            <div className='lg:pl-[264px] w-full'>
<div className='mx-auto max-w-screen-2xl h-full '>
    <WorkspaceNavbar/>
    <main className='  h-full bg-[#121212] py-6 px-6 flex flex-col'>
 <NuqsAdapter>

{children}
 </NuqsAdapter>
    </main>
</div>
            </div>
        </div>
        </div>
  )
}

export default layout