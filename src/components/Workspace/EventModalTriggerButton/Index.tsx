'use client'

import React, { useState } from 'react'
import EventModal from '../Addevents/Index'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { Plus, PlusCircle } from 'lucide-react'
import { RiAddCircleFill } from 'react-icons/ri'

const EventModalTriggerButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
    const {workspaceId}  = useParams() 
  return (
    <>
      <button
        onClick={openModal}
        
      >
         <RiAddCircleFill
                  className="cursor-pointer text-indigo-400 hover:text-indigo-500 size-5 transition-colors duration-200"
                 />
      </button>

      <EventModal isOpen={isModalOpen} onClose={closeModal} workspaceId={workspaceId} />
    </>
  )
}

export default EventModalTriggerButton
