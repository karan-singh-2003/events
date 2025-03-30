'use client'
import { useParams } from 'next/navigation'

const WorkspacePage = () => {
  const { workspaceId } = useParams()
  console.log('workspaceId in Roles and Permissions', workspaceId)
  return (
    <div className="bg-[#222222] flex flex-col items-center h-screen w-full mx-auto overflow-hidden relative text-white">
      <h1>Workspace ID: {workspaceId}</h1>
    </div>
  )
}

export default WorkspacePage
