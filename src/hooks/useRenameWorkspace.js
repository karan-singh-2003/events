'use client'
import { useState } from 'react'
import useMutationData from './useMutationData'
import useZodForm from './useZodForm'
import { createWorkspaceSchema } from '../schemas/createWorkspaceSchema'
import axios from 'axios'
import toast from 'react-hot-toast'
  // Import toast for showing success/error messages

const useRenameWorkspace = ({ workspaceId }) => {
  const [serverError, setServerError] = useState(null)

  const { mutate, isPending, data } = useMutationData({
    mutationKey: ['RenameWorkspace'],
    mutationFn: async ({ name }) => {
      const response = await axios.post('/api/workspace/updateworkspace', {
        name,
        workspaceId,
      })
      return response.data
    },
    onError: (error) => {
        console.log('AXIOS ERROR:', error); // ⬅️ Add this
      
        const errorMessage =
          error?.response?.data?.message || // <- this is your API error message
          error?.message ||                 // <- generic Axios error
          'Something went wrong';
      
       
        toast.error(`Error: ${errorMessage}`);
      }
      
      ,
      
    onSuccess: () => {
      // Show success toast
      toast.success('Workspace name changed successfully!')
    },
    queryKey: 'workspaces',
  })

  
  return {
    mutate,
  
    isPending,
    data,
    serverError,
  }
}

export default useRenameWorkspace
