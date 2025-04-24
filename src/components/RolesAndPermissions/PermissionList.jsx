import { useQuery } from '@tanstack/react-query'
import { getWorkspacePermissionsWithRoles } from '@/src/actions/rolepermission'
import AddButton from './AddButton'
import {
  getRoleBgColor,
  getRoleTextColor,
  hexToRgba,
} from '@/src/utils/getRoleColor'

const PermissionList = ({ workspaceId, type }) => {
  const {
    data: WorkspacePermissionsData = { data: [] },
    isPending,
    isFetching,
    isFetched,
    refetch,
  } = useQuery({
    queryKey: ['workspace-permissions', workspaceId, type],
    queryFn: () => getWorkspacePermissionsWithRoles(workspaceId, type),
    enabled: !!workspaceId && !!type, // Only fetch if both are provided
    onError: (error) => {
      console.error('Error fetching permissions:', error)
    }
  })

  // Optional: You can add some loading or error state management
  if (isFetching) return <div>Loading...</div>
  if (isPending) return <div>Pending...</div>
  if (WorkspacePermissionsData?.data?.length === 0) return <div>No permissions available</div>

  return (
    <div className="flex flex-col gap-2">
      {/* Loop through permissions data and render each permission */}
      {WorkspacePermissionsData?.data?.map((permission) => (
        <div key={permission.permissionId} className="flex flex-col mt-2">
          <div className="flex items-center justify-between mb-1 ">
            <h1 className="font-poppins mb-1 font-semibold text-[#A0A0A0] text-[18px]">
              {permission.title}
            </h1>
            <AddButton height={24} width={24} className="mr-2 mt-1" />
          </div>
          <div className="flex flex-wrap gap-2 w-[450px] ">
            {permission.roles.map((role, index) => {
              const bgColor = hexToRgba(getRoleBgColor(role), 0.2)
              const textColor = getRoleTextColor(role)

              return (
                <span
                  key={role} // Use the role as the key
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
      ))}
    </div>
  )
}

export default PermissionList
