import useMutationData from './useMutationData'
import { logInUser } from '../actions/user'
import useZodForm from './useZodForm'
import { logInSchema } from '../schemas/logInSchema'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
export const useLogInUser = () => {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const { data, isPending, mutate } = useMutationData({
    mutationKey: ['loginUser'],
    mutationFn: async (data: { universityId: string; password: string }) => {
      const response = await logInUser(data)
      if (response.status !== 200) {
        throw new Error(response.data || 'An error occurred while logging in.')
      }
      return response
    },
    onSuccess: () => {
      console.log('Login successful')
      router.push('/')
    },
    onError: (error: Error) => {
      console.error('Error logging in:', error)
      setServerError(error.message)
    },
  })

  const { register, errors, onFormSubmit, watch, isValid } = useZodForm(
    logInSchema,
    mutate
  )
  useEffect(() => {
    const subscription = watch(() => {
      setServerError(null)
    })

    return () => subscription.unsubscribe()
  }, [watch])

  return {
    register,
    errors,
    isValid,
    watch,
    onFormSubmit,
    isPending,
    data,
    mutate,
    serverError,
  }
}
