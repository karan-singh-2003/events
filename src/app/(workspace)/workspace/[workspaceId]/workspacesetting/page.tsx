import WorkspacesettingHeader from '@/src/components/Workspace/WorkspaceSetting/workspacesettingheader/WorkspacesettingHeader'
import WorkspaceAccess from '@/src/components/Workspace/WorkspaceSetting/workspacesettingmain/workspaceacess/WorkspaceAccess'
import Workspacesettingmain from '@/src/components/Workspace/WorkspaceSetting/workspacesettingmain/workspacedelete/Workspacesettingdelete'
import React from 'react'

function page() {
  return (
    <>
    <WorkspacesettingHeader/>
    <Workspacesettingmain/>
    <WorkspaceAccess/>
    </>
  )
}

export default page