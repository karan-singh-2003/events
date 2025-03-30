'use client'
import React from 'react'
import Link from 'next/link'
import AddButton from '@/src/components/RolesAndPermissions/AddButton'

import RolesModal from '@/src/components/RolesAndPermissions/RolesModal'
import { useDispatch } from 'react-redux'
import { toggleAddRolesModal } from '@/src/store/rolesSlice'
import { useParams } from 'next/navigation'
import RolesList from '@/src/components/RolesAndPermissions/RolesList'
import {
  PermissionsForWorkspace,
  EventPermissions,
  TaskPermissions,
} from '@/src/constants'
import WorkspacePermissions from '@/src/components/RolesAndPermissions/WorkspacePermission'
import CustomButton from '@/src/components/global/CustomButton'
import { RootState } from '@/src/store/store'
import { useSelector } from 'react-redux'

const RolesAndPermissions = () => {
  const dispatch = useDispatch()
  const { workspaceId } = useParams()
  console.log('workspaceId in Roles and Permissions', workspaceId)
  const email = useSelector((state: RootState) => state.user.email)
  return (
    <div className="bg-[#222222] flex flex-col items-center min-h-screen w-full mx-auto  relative">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center px-6 py-4 absolute top-0 left-0 ">
        {/* Events on the Left */}
        <h1 className="boldonse text-[30px] text-white">
          <Link href="/">events</Link>
        </h1>

        <div className="bg-amber-300 rounded-full py-2 px-2.5 text-black font-semibold">
          {email?.slice(0, 2).toUpperCase()}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-[600px] text-center mt-20  ">
        <h4 className="text-[#ffffff] font-poppins font-semibold text-[30px] mb-2 ml-8">
          Set Roles & Permissions
        </h4>
        <h6 className="text-[#919191] text-[20px] font-poppins font-normal mb-6 ml-4 ">
          Define team roles and permissions before sending invites
        </h6>

        {/* Roles Section */}
        <div className="flex items-center justify-between w-full">
          <div className="w-1/3"></div> {/* Empty div for spacing */}
          <div className="flex flex-col items-center w-full">
            <h4 className="text-[#D4D0D0] font-poppins font-semibold text-[30px] mt-4 ">
              Roles
            </h4>
            <h6 className="text-[#919191] text-[16px] font-poppins font-normal">
              Define permissions for each role
            </h6>
          </div>
          <div className="w-1/3 flex justify-end ">
            <AddButton
              onClick={() => dispatch(toggleAddRolesModal())}
              className="mr-7 mt-0.5 "
              width={35}
              height={35}
            />
          </div>
        </div>

        <RolesList />

        {/* Roles Modal */}
        <RolesModal />

        {/* Permissions Section */}
        <h4 className="text-[#D4D0D0] mt-11 font-poppins font-semibold text-[30px]">
          Permissions
        </h4>
        <h6 className="text-[#919191] text-[16px] font-poppins font-normal mb-6">
          Define permissions for each role
        </h6>
      </div>
      <div className="flex flex-col w-[600px]  py-4">
        {/* 🔹 Main Heading */}
        <h1 className="text-white text-2xl font-semibold mb-2 ">
          Workspace Permission
        </h1>

        {/* 🔹 Subheading & Permissions (line-by-line) */}
        <div className="flex flex-col gap-2">
          {PermissionsForWorkspace.map((permission, index) => (
            <WorkspacePermissions
              key={index}
              permissionTitle={permission.title}
              roles={permission.hasPermission}
            />
          ))}
        </div>
      </div>
      <hr className="border-b border-[#555353] my-8 w-[600px] mb-2" />

      <div className="flex flex-col w-[600px]  py-4">
        {/* 🔹 Main Heading */}
        <h1 className="text-white text-2xl font-semibold ">
          Events Permission
        </h1>

        {/* 🔹 Subheading & Permissions (line-by-line) */}
        <div className="flex flex-col gap-2">
          {EventPermissions.map((permission, index) => (
            <WorkspacePermissions
              key={index}
              permissionTitle={permission.title}
              roles={permission.hasPermission}
            />
          ))}
        </div>
      </div>
      <hr className="border-b border-[#555353] my-8 w-[600px] mb-2" />

      <div className="flex flex-col w-[600px]  py-4">
        <h1 className="text-white text-2xl font-semibold ">Tasks Permission</h1>

        <div className="flex flex-col gap-2">
          {TaskPermissions.map((permission, index) => (
            <WorkspacePermissions
              key={index}
              permissionTitle={permission.title}
              roles={permission.hasPermission}
            />
          ))}
        </div>
      </div>
      <CustomButton className="bg-[#635BFF] text-[18px]  hover:bg-[#635BFF]/80 w-full max-w-[620px] h-14 mb-28 mt-10 rounded-none">
        Continue
      </CustomButton>
    </div>
  )
}

export default RolesAndPermissions
