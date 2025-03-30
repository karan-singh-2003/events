import React from 'react'
import AddButton from './AddButton'
import {
  getRoleBgColor,
  getRoleTextColor,
  hexToRgba,
} from '@/src/utils/getRoleColor'

interface WorkspacePermissionProps {
  permissionTitle?: string
  roles?: string[]
}

const WorkspacePermissions = ({
  permissionTitle,
  roles = [],
}: WorkspacePermissionProps) => {
  return (
    <div className="flex flex-col mt-2">
      <div className="flex items-center justify-between mb-1 ">
        <h1 className="font-poppins mb-1 font-semibold text-[#A0A0A0] text-[18px]">
          {permissionTitle}
        </h1>
        <AddButton height={24} width={24} className="mr-2 mt-1" />
      </div>
      <div className="flex flex-wrap gap-2 w-[450px] ">
        {roles.map((role, index) => {
          const bgColor = hexToRgba(getRoleBgColor(role), 0.2)
          const textColor = getRoleTextColor(role)

          return (
            <span
              key={index}
              className="px-4 py-1 mt-1 rounded-full text-sm font-medium shadow-md"
              style={{
                backgroundColor: bgColor,
                color: textColor,
              }}
            >
              {role}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default WorkspacePermissions
