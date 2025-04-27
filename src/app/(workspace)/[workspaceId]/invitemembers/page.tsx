'use client'
import React, { useState } from 'react'
import CustomButton from '@/src/components/global/CustomButton'
import InvitePeople from '@/src/components/Workspace/Invitepeople'
import { useParams } from 'next/navigation'

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const { workspaceId } = useParams()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl mb-4">Workspace Dashboard</h1>
      <CustomButton
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 px-4 py-2 rounded text-white"
      >
        Add People
      </CustomButton>

      <InvitePeople isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} workspaceId={workspaceId} />
    </div>
  )
}

export default Page
