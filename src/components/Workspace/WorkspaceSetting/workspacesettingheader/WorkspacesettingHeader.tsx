'use client'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useQueryData } from '@/src/hooks/useQueryData'
import { getWorkspaceById } from '@/src/actions/workspace'
import clsx from 'clsx'
import { getColorForString } from '@/src/utils/getColor'
import CustomButton from '@/src/components/global/CustomButton'
import useRenameWorkspace from '@/src/hooks/useRenameWorkspace'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createWorkspaceSchema } from '@/src/schemas/createWorkspaceSchema'

function WorkspacesettingHeader() {
  const { workspaceId } = useParams()
  const {
    data: workspaceData,
    isPending,
    isFetching,
  } = useQueryData(
    ['workspaces', workspaceId],
    () => getWorkspaceById({ workspaceId: workspaceId as string }),
    true
  )

  const {
    mutate: renameWorkspace,
    isPending: isRenaming,
    serverError,
  } = useRenameWorkspace({ workspaceId: workspaceId as string })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(createWorkspaceSchema),
    mode: 'onChange', // To validate on change
  })

  const [isEditing, setIsEditing] = useState(false)

  // Update the form value once workspace data is fetched
  useEffect(() => {
    if (workspaceData?.workspace?.name) {
      setValue('name', workspaceData.workspace.name)
    }
  }, [workspaceData, setValue])

  const bgColor = getColorForString(workspaceData?.workspace?.name || '')

  const handleSave = (data: { name: string }) => {
    if (data.name && data.name.trim() !== workspaceData?.workspace?.name) {
      renameWorkspace({ name: data.name })
    }
    setIsEditing(false) // Exit edit mode
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit(handleSave)() // Submit on Enter key press
  }

  return (
    <div className="flex items-center justify-between p-6 border-b border-[#333] rounded-md shadow-sm">
      {/* Left: Avatar + Name */}
      <div className="flex items-center gap-4">
        <div
          className={clsx(
            'w-14 h-14 rounded-full flex items-center justify-center text-2xl font-semibold text-white shadow-md'
          )}
          style={{ backgroundColor: bgColor }}
        >
          {workspaceData?.workspace?.name.slice(0, 2).toUpperCase()}
        </div>

        <div className="flex flex-col">
          {/* Editable Name */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <input
                {...register('name')} // React Hook Form registers the input
                type="text"
                onBlur={handleSubmit(handleSave)} // Trigger submit on blur
                onKeyDown={handleKeyDown} // Handle key down event for "Enter"
                className="text-2xl font-semibold text-[#F5F5F5] bg-transparent border border-[#555] rounded px-2 py-1 focus:outline-none focus:border-[#888] w-full"
              />
            ) : (
              <span
                className="text-2xl font-semibold text-[#F5F5F5] cursor-pointer hover:underline"
                onClick={() => setIsEditing(true)}
              >
                {isPending || isFetching ? 'Loading...' : workspaceData?.workspace?.name || 'Workspace'}
              </span>
            )}
            <span
              className="cursor-pointer text-[#aaa] hover:text-white text-lg"
              onClick={() => setIsEditing(true)}
              title="Edit name"
            >
              ✏️
            </span>
          </div>

          <span className="text-sm text-[#999999] mt-1">
            {isRenaming ? 'Renaming workspace...' : 'Workspace Settings'}
          </span>
          
          {/* Display Server Error */}
          {serverError && <p className="text-red-500 text-sm mt-2">{serverError}</p>}
          
          {/* Display Validation Error */}
          {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>}
        </div>
      </div>

      {/* Right: Button */}
      <CustomButton className="bg-[#635BFF] hover:bg-[#635BFF]/80 text-white px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200">
        Invite Members
      </CustomButton>
    </div>
  )
}

export default WorkspacesettingHeader
