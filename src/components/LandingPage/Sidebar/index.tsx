'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import CustomButton from '@/src/components/global/CustomButton'

interface SidebarProps {
  userEmail: string | null
}

const Sidebar = ({ userEmail }: SidebarProps) => {
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/login'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <motion.div
      initial={{ width: 350, opacity: 0 }}
      animate={{ x: isOpen ? 0 : 350, opacity: isOpen ? 1 : 0 }}
      transition={{
        duration: 0.3,
        ease: [0.3, 0.0, 0.2, 1],
      }}
      className="fixed right-0 h-screen bg-[#FFFFFF] text-black shadow-lg flex flex-col py-4 overflow-hidden z-10"
    >
      <div className="text-3xl font-poppins font-bold ml-5">
        Hey {userEmail ? userEmail.split('@')[0] : 'Guest'}!
      </div>
      <hr className="border-t border-[#E6E6E6] my-2" />

      {/* 🔹 Smooth Button Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
          delay: isOpen ? 0.1 : 0,
        }}
      >
        {userEmail ? (
          <CustomButton
            className="bg-black text-[13px] hover:bg-[#575757] mx-4 mt-4 w-[330px] h-10 rounded-none"
            onClick={handleLogout}
          >
            Log out
          </CustomButton>
        ) : (
          <CustomButton
            className="bg-[#635BFF] text-[13px] hover:bg-[#635BFF]/80 mx-4 mt-3 w-[330px] h-10 rounded-none"
            onClick={() => (window.location.href = '/login')}
          >
            Get Started
          </CustomButton>
        )}
      </motion.div>
    </motion.div>
  )
}

export default Sidebar
