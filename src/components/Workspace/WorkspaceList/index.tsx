'use client'
import React from 'react'
import WorkspaceCard from '@/src/components/Workspace/WorkspaceCard'
import { useQueryData } from '@/src/hooks/useQueryData'
import { getUserAllWorkspaces } from '@/src/actions/workspace'
import Spinner from '../../global/Spinner'

const WorkspaceList: React.FC = () => {
  const {
    data: Workspaces = { data: [] },
    isPending,
    isFetching,
    isFetched,
  } = useQueryData(['workspaces'], getUserAllWorkspaces, true)

  const workspaces = Workspaces?.data ?? []
  console.log('Workspaces in Workspace List:', workspaces)
  if (isPending || isFetching) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-[350px]">
        <Spinner color="#FFFFFF" size={14} />
        <h1 className="text-white mt-2 text-sm">Fetching Workspaces...</h1>
      </div>
    )
  }

  if (!isFetched) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full">
        <h1 className="text-red-500 mt-2 text-sm">Error Fetching Workspaces</h1>
      </div>
    )
  }
  return (
    <div className="relative mt-8">
      <div className="absolute -top-4 left-0 w-full h-8 bg-gradient-to-b from-[#000000] to-transparent z-10 pointer-events-none"></div>

      {Array.isArray(workspaces) && workspaces.length > 0 ? (
        <div className="max-h-[400px] overflow-y-auto space-y-2 scrollbar-hide dark-scrollbar relative w-[470px]">
          {workspaces.map((workspace, index) =>
            workspace ? (
              <WorkspaceCard
                key={index}
                workspaceName={workspace.workspaceName ?? ''}
                members={workspace.membersCount ?? 0}
                url={workspace.workspaceId ?? ''}
                isOnboarding={workspace.isOnboarded ?? false}
                className="h-12 w-12 rounded-full text-2xl font-extrabold text-[#313131]"
              />
            ) : null
          )}
        </div>
      ) : (
        <p className="text-white text-center text-[18px] mt-6 max-w-[470px] font-semibold font-poppins">
          Looks like you are new here! Set up your first workspace and get
          started.
        </p>
      )}

      <div className="absolute -bottom-5 left-0 w-full h-8 bg-gradient-to-t from-[#020202] to-transparent z-10 pointer-events-none"></div>
    </div>
  )
}

export default WorkspaceList
