// src/hooks/useDeleteWorkspace.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'

interface DeleteWorkspaceProps {
  workspaceId: any
}

export const useDeleteWorkspace = ({ workspaceId }: DeleteWorkspaceProps) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['deleteWorkspace', workspaceId],
    mutationFn: async () => {
      const response = await axios.post('/api/workspace/deleteworkspace', {
        workspaceId,
      })
      return response.data
    },
    onSuccess: (data) => {
      toast.success('Workspace deleted successfully ✅')
      console.log('Workspace deleted:', data)
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'Something went wrong. Please try again.'
      alert(errorMessage)
      console.error('Error deleting workspace:', errorMessage)
    },
  })
}
