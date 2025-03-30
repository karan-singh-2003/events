import useMutationData from './useMutationData'
import useZodForm from './useZodForm'
import { createRole } from '../actions/roles'
import { RolesArraySchema } from '../schemas/createRoleSchema'
import { useState } from 'react'
import { toggleAddRolesModal } from '../store/rolesSlice'
import { useDispatch } from 'react-redux'
const useCreateRole = () => {
  const dispatch = useDispatch()
  const [serverError, setServerError] = useState<string | null>(null)
  const { mutate, isPending, data } = useMutationData({
    mutationKey: ['createRole'],
    mutationFn: async (data: { roles: { name: string }[] }) => {
      console.log('Creating workspace with data:', data)
      console.log('creating roles', data.roles)
      const response = await createRole(data)
      if (response.status !== 200) {
        throw new Error(
          response.data || 'An error occurred while creating Role.'
        )
      }
      return response
    },
    onError: (error: Error) => {
      console.error('Error creating workspace:', error)
      setServerError(error.message)
    },
    onSuccess: () => {
      dispatch(toggleAddRolesModal())
    },
    queryKey: 'workspace-roles',
  })

  const { register, errors, onFormSubmit, isValid, watch, control, setValue } =
    useZodForm(RolesArraySchema, mutate)

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
