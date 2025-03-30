import {
  useMutation,
  useQueryClient,
  MutationKey,
  MutationFunction,
} from '@tanstack/react-query'

interface UseMutationDataProps {
  mutationKey: MutationKey
  mutationFn: MutationFunction<any, any>
  queryKey?: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

const useMutationData = ({
  mutationKey,
  mutationFn,
  queryKey,
  onSuccess,
  onError,
}: UseMutationDataProps) => {
  const queryClient = useQueryClient()

  const { mutate, isPending, data } = useMutation({
    mutationKey,
    mutationFn,
    onSuccess: () => {
      if (onSuccess) onSuccess()
    },
    onError: (error) => {
      console.error('Error:', error)

      if (onError) {
        onError(error)
      }
    },
    onSettled: async () => {
      if (queryKey) {
        await queryClient.invalidateQueries({ queryKey: [queryKey] })
      }
    },
  })

  return { mutate, isPending, data }
}

export default useMutationData
