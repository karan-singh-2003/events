'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import WorkspaceNavigation from './WorkspaceNavbar/WorkspaceNavigation'
import WorkspaceSwitcher from './WorkspaceNavbar/WorkspaceSwitcher'
import { Button } from '../../ui/button'
import { Separator } from '../../ui/separator'

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
      <aside className="h-full bg-[#131316] border-r border-[#2c2c2c] p-4 w-full">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/hub.jpeg"
              className="rounded-3xl "
              height={45}
              width={45}
              alt="logo"
            />
            {/* Optional: you can remove <Button /> here if it's empty */}
            {/* <Button /> */}
            
            {/* -- Updated motion text color here -- */}
            <motion.h1
              className="font-extrabold text-2xl text-[#E0E0E0]"
              style={{ fontFamily: 'var(--font-orbitron)' }}
              variants={sentence}
              initial="hidden"
              animate="visible"
            >
              {text.split('').map((char, idx) => (
                <motion.span key={idx} variants={word}>
                  {char}
                </motion.span>
              ))}
            </motion.h1>

            {/* 
            --- OPTIONAL COOL GRADIENT VERSION (instead of plain color) ---
            <motion.h1
              className="font-extrabold text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
              style={{ fontFamily: 'var(--font-orbitron)' }}
              variants={sentence}
              initial="hidden"
              animate="visible"
            >
              {text.split('').map((char, idx) => (
                <motion.span key={idx} variants={word}>
                  {char}
                </motion.span>
              ))}
            </motion.h1>
            */}
          </Link>
        </div>

        <Separator className="m-2 bg-[#505152]" />

        <WorkspaceSwitcher />

        <Separator className="m-2 bg-[#505152] " />

        <WorkspaceNavigation />
      </aside>
    </>
  )
}

export default Slider
