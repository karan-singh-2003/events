'use client'

import React, { useEffect, useState } from 'react'
import CustomButton from '@/src/components/global/CustomButton'
import PageLoader from '../components/global/PageLoader'
import { Search, Menu } from 'lucide-react'
import Sidebar from '../components/LandingPage/Sidebar'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSidebar } from '../store/sidebarSlice'
import { RootState } from '../store/store'
import { setUserEmail, setUserRole } from '../store/userSlice'
const LandingPage = () => {
  const dispatch = useDispatch()
  const [Email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session')
        const data = await res.json()
        console.log('sessionData in useEffect Page.tsx:', data)
        if (res.ok) {
          setEmail(data.user?.email)
          dispatch(setUserEmail(data.user?.email))
          console.log('setting role in User Slice', data.user?.name)
          dispatch(setUserRole(data.user?.name))
        } else {
          setUserEmail(null)
        }
      } catch (error) {
        console.error('Error fetching session:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [dispatch])

  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen)
  const handleDisplayLandingPageSidebar = () => {
    dispatch(toggleSidebar())
  }

  if (loading) {
    return <PageLoader />
  }

  return (
    <div className="relative flex flex-col items-center h-screen w-[1200px] mx-auto bg-white">
      {/* 🔹 Navbar Container */}
      <div className="flex items-center justify-between w-full px-6 py-4">
        <div className="flex items-center flex-1">
          <h1 className="boldonse lg:text-2xl sm:text-lg mr-6">events</h1>
          <div className="flex items-center bg-[#F8F8F8] rounded-xs px-4 w-full max-w-[600px] border-[1px] border-[#EEEEEE]">
            <Search className="text-[#929292] w-5 h-5 mr-4" />
            <input
              type="text"
              className="bg-transparent placeholder:text-[#929292] h-10 text-[#929292] outline-none w-full"
              placeholder="Search for events and hackathons"
            />
          </div>
        </div>

        {/* 🔹 Right Side - Buttons & Menu */}
        <div className="flex items-center space-x-4">
          {!Email ? (
            <CustomButton
              className="bg-[#635BFF] rounded-full text-[13px] px-8 hover:bg-[#635BFF]/80"
              onClick={() => {
                window.location.href = '/login'
              }}
            >
              Get Started
            </CustomButton>
          ) : (
            <CustomButton
              className="bg-[#070707] rounded-full text-[13px] px-5 hover:bg-[#575757]"
              onClick={() => {
                window.location.href = '/workspace/choose-workspace'
              }}
            >
              Continue to Workspace
            </CustomButton>
          )}
          {/* ✅ Wrap `<Menu />` in a button */}
          <button onClick={handleDisplayLandingPageSidebar}>
            <Menu className="w-6 h-6 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* 🔹 Sidebar Component */}
      <Sidebar userEmail={Email} />

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-0"
          onClick={() => dispatch(toggleSidebar())}
        ></div>
      )}
    </div>
  )
}

export default LandingPage
