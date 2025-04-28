'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/src/store/store'
import { setUserEmail, setUserIsAdmin } from '@/src/store/userSlice'
import { toggleAddWorkspaceModal } from '@/src/store/workspaceSlice'

import Badge from '@/src/components/global/Badge'
import CustomButton from '@/src/components/global/CustomButton'
import AddWorkspaceModal from '@/src/components/Workspace/AddWorkspace'
import PageLoader from '@/src/components/global/PageLoader'
import WorkspaceList from '@/src/components/Workspace/WorkspaceList'

const ChooseWorkspace = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  // Redux state
  const email = useSelector((state: RootState) => state.user.email)
  const isAdmin = useSelector((state: RootState) => state.user.isAdmin)

  console.log('Email in ChooseWorkspace:', email)
  console.log('Is Admin in ChooseWorkspace:', isAdmin)

  const [loading, setLoading] = useState(true)

  // Fetch session data and check user role
  useEffect(() => {
    const fetchSessionAndWorkspaces = async () => {
      try {
        const res = await fetch('/api/auth/session')
        const data = await res.json()
        console.log('Session Data:', data)

        if (res.ok && data.isLoggedIn) {
          dispatch(setUserEmail(data.user.email))
          dispatch(setUserIsAdmin(data.user.isAdmin)) // ✅ Store `isAdmin` in Redux
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
    <div className="bg-[#222222] flex flex-col items-center h-screen relative w-full mx-auto overflow-hidden">
      {/* 🔹 Header */}
    

      <h4 className="text-[#ffffff] font-semibold text-[30px] mt-8 mb-2">
        Choose Workspace
      </h4>
      <h6 className="text-[#919191]">
        Manage your events and tasks by selecting a workspace.
      </h6>

      <WorkspaceList />

      {/* 🔹 Show "Create Workspace" button only if user is an Admin */}
      {isAdmin && (
        <>
          <div className="flex items-center w-[470px] mt-8">
            <hr className="flex-1 border-t border-[#3f3f3f]" />
            <span className="mx-4 text-[#929292] font-medium">OR</span>
            <hr className="flex-1 border-t border-[#3f3f3f]" />
          </div>

          <CustomButton
            className="bg-[#635BFF] text-[16px] px-8 mt-8 hover:bg-[#635BFF]/80 w-full max-w-[470px] h-12 rounded-none"
            onClick={() => {
              dispatch(toggleAddWorkspaceModal())
            }}
          >
            Create Workspace
          </CustomButton>
        </>
      )}

      <AddWorkspaceModal />
    </div>
  )
}

export default ChooseWorkspace
