'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import WorkspaceNavigation from './WorkspaceNavbar/WorkspaceNavigation'
import WorkspaceSwitcher from './WorkspaceNavbar/WorkspaceSwitcher'
import { Button } from '../../ui/button'
import { Separator } from '../../ui/separator'
import EventSwitcher from '../../Event/getallEventSwitcher/EventSwitcher'
import BottomNavigation from './WorkspaceNavbar/BottomNavigation'

function Slider() {
  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15,
      },
    },
  }

  const word = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  const text = 'GNE-EVENTS'

  return (
    <>
      <aside className="h-full bg-[#ffff] border-r border-[#d4d4d4] hidden lg:block p-1 w-[47px]">
        
       
        {/* <Separator className="m-2 bg-[#505152]" /> */}

        {/* <WorkspaceSwitcher /> */}

      
        <WorkspaceNavigation />
        <EventSwitcher/>
      </aside>
      <BottomNavigation />
    </>
  )
}

export default Slider
