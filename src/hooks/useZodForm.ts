import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UseMutateFunction } from '@tanstack/react-query'
import { ZodSchema } from 'zod'
const useZodForm = (
  schema: ZodSchema,
  mutation?: UseMutateFunction,
  defaultValues?: Partial<z.infer<typeof schema>>
) => {
  const {
    handleSubmit,
    register,
    watch,
    reset,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues },
    mode: 'onChange',
  })

  const onFormSubmit = mutation
    ? handleSubmit(async (values) => {
        mutation({ ...values })
      })
    : undefined

  return {
    register,
    watch,
    reset,
    isValid,
    errors,
    control,
    setValue,
    handleSubmit,
    ...(onFormSubmit && { onFormSubmit }),
  }
}

export default useZodForm
