import React from 'react'
import WorkspacesSwitcher from './WorkspaceSwitcher'

function WorkspaceNavbar() {
  return (
    <div className="p-2 border-b border-[#dcdcdc] w-full flex items-center justify-between h-[49px]">
      <WorkspacesSwitcher/>
    </div>
  )
}

export default WorkspaceNavbar
