'use client'
import React from 'react'
import Link from 'next/link'
import Badge from '@/src/components/global/Badge'
import CustomButton from '@/src/components/global/CustomButton'
import { useDispatch, useSelector } from 'react-redux'
import { toggleAddWorkspaceModal } from '@/src/store/workspaceSlice'
import AddWorkspaceModal from '@/src/components/Workspace/AddWorkspace'
import PageLoader from '@/src/components/global/PageLoader'
import { useEffect, useState } from 'react'
import { RootState } from '@/src/store/store'
import { setUserEmail, setUserRole } from '@/src/store/userSlice'

import { useRouter } from 'next/navigation'
import WorkspaceList from '@/src/components/Workspace/WorkspaceList'

const ChooseWorkspace = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const email = useSelector((state: RootState) => state.user.email)
  console.log('email in ChooseWorkspace:', email)
  const role = useSelector((state: RootState) => state.user.role)
  console.log('role in ChooseWorkspace:', role)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessionAndWorkspaces = async () => {
      try {
        const res = await fetch('/api/auth/session')
        const data = await res.json()
        console.log('Session Data:', data)

        if (res.ok && data.isLoggedIn) {
          dispatch(setUserRole(data.user.name))
          dispatch(setUserEmail(data.user.email))
        } else {
          dispatch(setUserEmail(null))
          router.push('/login')
        }
      } catch (error) {
        console.error('Error fetching session:', error)
        dispatch(setUserEmail(null))
      } finally {
        setLoading(false)
      }
    }

    fetchSessionAndWorkspaces()
  }, [dispatch, router])

  if (loading) return <PageLoader />
  return (
    <div className="bg-[#222222] flex flex-col items-center h-screen relative  w-full mx-auto overflow-hidden">
      {/* 🔹 Header: `events` on the Left & `NC` on the Right */}
      <div className="w-full flex justify-between items-center px-6 py-4">
        <h1 className="text-[30px]  boldonse  text-white">
          <Link href="/">events</Link>
        </h1>
        <div className="bg-amber-300 rounded-full py-2 px-2.5 text-black font-semibold">
          {email?.slice(0, 2).toUpperCase()}
        </div>
      </div>

      <h4 className="text-[#ffffff] font-poppins font-semibold text-[30px] mt-8 mb-2">
        Choose Workspace
      </h4>
      <h6 className="text-[#919191]">
        Manage your events and tasks by selecting a workspace.
      </h6>

      <WorkspaceList />
      {role === 'Admin' && (
        <div className="flex items-center w-[470px] mt-8">
          <hr className="flex-1 border-t border-[#3f3f3f]" />
          <span className="mx-4 text-[#929292] font-medium">OR</span>
          <hr className="flex-1 border-t border-[#3f3f3f]" />
        </div>
      )}

      {role === 'Admin' && (
        <CustomButton
          className="bg-[#635BFF] text-[16px] px-8 mt-8 hover:bg-[#635BFF]/80 w-full max-w-[470px] h-12 rounded-none"
          onClick={() => {
            dispatch(toggleAddWorkspaceModal())
          }}
        >
          Create Workspace
        </CustomButton>
      )}
      <AddWorkspaceModal />
    </div>
  )
}

export default ChooseWorkspace
