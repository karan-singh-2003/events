'use client'
import React, { useState } from 'react'
import CustomButton from '@/src/components/global/CustomButton'
import InvitePeople from '@/src/components/Workspace/Invitepeople'
import { useParams } from 'next/navigation'

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const { workspaceId } = useParams()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
      <h1 className="text-3xl mb-4">Let`s Add People in Workspace</h1>
      <CustomButton
        onClick={() => setIsModalOpen(true)}
        className="bg-gray-700 px-4 py-2 rounded text-white"
      >
        Add People
      </CustomButton>

      <InvitePeople isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} workspaceId={workspaceId} />
    </div>
  )
}

export default Page
