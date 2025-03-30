'use client'
import React from 'react'
import FormElements from '../global/Form'

import { Button } from '../ui/button'
import { AnimatePresence, motion } from 'motion/react'
import Spinner from '../global/Spinner'
import { useLogInUser } from '../../hooks/useLogInUser'
import useSearchQuery from '../../hooks/useSearchQuery'
const LogInForm = () => {
  const {
    register,
    errors,
    onFormSubmit,
    watch,
    isPending,
    serverError,
    isValid,
  } = useLogInUser()
  const universityId = watch('universityId')
  console.log('universityId', universityId)
  const { data, isLoading } = useSearchQuery<{ isAdmin: boolean }>(
    universityId,
    '/api/check-admin',
    300
  )
  console.log('data', data)
  return (
    <form onSubmit={onFormSubmit} className="flex flex-col w-full  p-6">
      {serverError && (
        <div className="bg-[#FFDADA] flex text-[#FF3F3F] text-sm p-3 mb-4 text-center justify-center h-14 items-center">
          <p className="mt-0 ml-2 ">
            {typeof serverError === 'string'
              ? serverError
              : JSON.stringify(serverError)}
          </p>
        </div>
      )}

      <FormElements
        inputType="input"
        register={register}
        placeholder="University ID"
        name="universityId"
        errors={errors}
        type="text"
      />

      <FormElements
        inputType="input"
        register={register}
        placeholder={'secret password'}
        name="password"
        errors={errors}
        type="password"
      />
      <a
        href="/forgot-password"
        className="hover:underline text-[#3D3A3A] my-1 mb-2 text-xs block text-right"
      >
        Forgot Password?
      </a>
      <Button
        variant="secondary"
        disabled={!isValid || isPending || isLoading}
        className={`h-14 mt-4 w-full rounded-none text-white ${
          !isValid || isPending
            ? 'bg-[#D4D4D4] cursor-not-allowed'
            : 'bg-[#635BFF] hover:bg-[#635BFF]/80'
        }`}
      >
        {isPending ? (
          <div className="flex justify-center items-center space-x-2 text-sm -ml-3">
            <Spinner size={20} />
            <span>Checking</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.span
              key={data?.isAdmin ? 'admin' : 'login'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {data?.isAdmin ? 'Log in as Admin' : 'Log in'}
            </motion.span>
          </AnimatePresence>
        )}
      </Button>
    </form>
  )
}

export default LogInForm
