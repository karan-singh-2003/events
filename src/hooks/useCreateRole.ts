import useMutationData from './useMutationData'
import useZodForm from './useZodForm'
import { SingleRoleSchema } from '../schemas/createRoleSchema'
import { useState } from 'react'
import { toggleAddRolesModal } from '../store/rolesSlice'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-hot-toast' // ✅ for toast messages

const useCreateRole = (workspaceId: string) => { // ✅ Accept workspaceId directly
  const dispatch = useDispatch()
  const [serverError, setServerError] = useState<string | null>(null)

  const { mutate,isPending, data } = useMutationData({
    mutationKey: ['createRole'],
    mutationFn: async (data: { name: string }) => {
      console.log('Creating role with data:', data)

      const response = await axios.post('/api/workspace/createroles', {
        ...data,
        workspaceId, // ✅ attach workspaceId here when sending to backend
      })

      if (response.status !== 200) {
        throw new Error(
          response.data || 'An error occurred while creating Role.'
        )
      }
      return response
    },
    onError: (error: Error) => {
      console.error('Error creating role:', error)
      setServerError(error.message)
      toast.error(error.message) // ✅ show error toast
    },
    onSuccess: () => {
      dispatch(toggleAddRolesModal())
      toast.success('Role created successfully!') // ✅ success toast
    },
    queryKey: 'workspace-roles',
  })

  const { register, errors, onFormSubmit, isValid, watch, control, setValue } =
    useZodForm(SingleRoleSchema, mutate)

  return {
    register,
    errors,
    onFormSubmit,
    isValid,
    isPending,
    data,
    serverError,
    control,
    setValue,
    watch,
  }
}

export default useCreateRole
