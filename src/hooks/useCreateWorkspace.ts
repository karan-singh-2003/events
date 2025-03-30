import useMutationData from './useMutationData'
import useZodForm from './useZodForm'
import { createWorkspace } from '../actions/workspace'
import { createWorkspaceSchema } from '../schemas/createWorkspaceSchema'
import { useState } from 'react'
import { toggleAddWorkspaceModal } from '@/src/store/workspaceSlice'
import { useDispatch } from 'react-redux'
const useCreateWorkspace = () => {
  const dispatch = useDispatch()
  const [serverError, setServerError] = useState<string | null>(null)
  const { mutate, isPending, data } = useMutationData({
    mutationKey: ['createWorkspace'],
    mutationFn: async (data: { name: string }) => {
      console.log('Creating workspace with data:', data)
      const response = await createWorkspace(data)
      if (response.status !== 200) {
        throw new Error(
          response.data || 'An error occurred while creating workspace.'
        )
      }
      return response
    },
    onError: (error: Error) => {
      console.error('Error creating workspace:', error)
      setServerError(error.message)
    },
    onSuccess: () => {
      dispatch(toggleAddWorkspaceModal())
    },
    queryKey: 'workspaces',
  })

  const { register, errors, onFormSubmit, isValid } = useZodForm(
    createWorkspaceSchema,
    mutate
  )
  return {
    register,
    errors,
    onFormSubmit,
    isValid,
    isPending,
    data,
    serverError,
  }
}

export default useCreateWorkspace
