'use client'
import TaskviewSwitcher from '@/src/components/task/TaskviewSwitcher'
import { useParams } from 'next/navigation'
import React from 'react'

function page() {
  const {eventId} = useParams()
  return (
    <div>
    {/* edit and delete work of events  */}
    <TaskviewSwitcher/>
    </div>
  )
}

export default page