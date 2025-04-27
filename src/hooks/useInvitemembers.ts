import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import useMutationData from './useMutationData'
import useZodForm from './useZodForm'
import { InviteMemberSchema } from '../schemas/invitememberSchema'

const useInviteMember = (workspaceId: string) => {
  const [serverError, setServerError] = useState<string | null>(null)

  const { mutate, isPending, data } = useMutationData({
    mutationKey: ['inviteMember'],
    mutationFn: async (formData) => {
      try {
        console.log('Inviting member with data:', formData)
  
        const response = await axios.post('/api/workspace/invitemembers', {
          ...formData,
          workspaceId,
        })
  
        // Check for specific success response
        if (response?.data?.success) {
          toast.success('Invitation sent successfully!')
        } else if (response?.data?.message) {
          toast.error(response.data.message) // Error condition
        }
  
        return response
      } catch (error: any) {
        // Handle any errors caught during the request
        if (error.response?.data?.message) {
          toast.error(error.response.data.message) // Display the error from response
        } else {
          toast.error('An unknown error occurred while inviting member.') // Fallback error
        }
      }
    },
    onError: (error: Error) => {
      console.error('Error inviting member:', error)
      setServerError(error.message)
      toast.error(error.message) // Ensure error is shown in case mutation fails
    },
    onSuccess: () => {
      // Don't trigger a success toast here, it's already handled in mutationFn
      reset()
    },
    queryKey: 'workspace-members',
  })
   

  const { register, errors, reset, onFormSubmit, isValid, watch, control, setValue } =
    useZodForm(InviteMemberSchema, mutate)

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

export default useInviteMember
