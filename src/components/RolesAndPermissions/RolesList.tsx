import React from 'react'

import { useQueryData } from '@/src/hooks/useQueryData'
import { getWorkspaceAllRoles, deleteRole } from '@/src/actions/roles'
import Spinner from '@/src/components/global/Spinner'
import CustomSelectButton from '@/src/components/RolesAndPermissions/CustomSelectButton'
import { useParams } from 'next/navigation'
const RolesList = () => {
  const { workspaceId } = useParams()
  console.log('workspaceId in RolesList:', workspaceId)
  const {
    data: WorkspaceRoles = { data: [] },
    isPending,
    isFetching,
    isFetched,
    refetch,
  } = useQueryData(
    ['workspace-roles', workspaceId],
    () => getWorkspaceAllRoles(workspaceId),
    true
  )

  const roles = WorkspaceRoles?.data ?? []
  console.log(roles)
  if (isPending || isFetching) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-[100px]">
        <Spinner color="#FFFFFF" size={14} />
        <h1 className="text-white mt-2 text-sm">Fetching Roles</h1>
      </div>
    )
  }

  if (!isFetched) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full">
        <h1 className="text-red-500 mt-2 text-sm">Error Fetching Roles</h1>
      </div>
    )
  }

  const handleDeleteRole = async (roleId) => {
    const response = await deleteRole(roleId, workspaceId)
    if (response.status === 200) {
      refetch() // ✅ Re-fetch roles to update UI
    }
  }
  return (
    <div>
      {roles.length > 0 ? (
        <div className="flex flex-wrap gap-2 w-full  mt-5">
          {roles.map((role) => (
            <CustomSelectButton
              key={role.role_id}
              text={role.role_name}
              className="my-1"
              onClose={() => handleDeleteRole(role.role_id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-white text-center text-[18px] mt-6 w-full font-semibold font-poppins ">
          Looks like you are new here! Define roles and permissions to manage
          your workspace effectively
        </p>
      )}
    </div>
  )
}

export default RolesList
