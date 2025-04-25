import {
  Enabled,
  QueryFunction,
  QueryKey,
  useQuery,
} from '@tanstack/react-query'

export const useQueryData = (
  queryKey: QueryKey,
  queryFn: QueryFunction,
  enabled: Enabled = true
) => {
  const { data, isPending, isFetched, refetch, isFetching } = useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes — considers cache fresh for this time
    refetchOnWindowFocus: false, // 👈 Don't re-fetch when switching tabs
    
    enabled,
  })

  return { data, isPending, isFetched, refetch, isFetching }
}
