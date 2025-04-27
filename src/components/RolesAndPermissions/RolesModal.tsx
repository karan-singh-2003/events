'use client'
import React from 'react'
import Modal from '../global/CustomModal'
import CustomButton from '../global/CustomButton'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import { toggleAddRolesModal } from '../../store/rolesSlice'
import { ErrorMessage } from '@hookform/error-message'
import useCreateRole from '@/src/hooks/useCreateRole'

const RolesModal = ({ workspaceId }: any) => {
  const dispatch = useDispatch()
  const isAddRolesModalOpen = useSelector(
    (state: RootState) => state.roles.isAddRolesModalOpen
  )

  // ✅ Use your custom hook
  const {
    register,
    errors,
    onFormSubmit,
    isValid,
    isPending,
  } = useCreateRole(workspaceId)

  return (
    <Modal
      isOpen={isAddRolesModalOpen}
      onClose={() => dispatch(toggleAddRolesModal())}
      height="450px"
      width="450px"
      className="rounded-none text-black"
    >
      <div className="flex flex-col h-full">
        <div className="text-[#7E7E7E] justify-center text-center font-semibold text-[17px]">
          Add Roles
        </div>

        <hr className="border-[#313131] w-full my-3" />

        <div className="text-center text-white mt-3 mb-6 text-[18px] font-semibold">
          Add your own custom role
        </div>

        <form className="flex flex-grow h-[44vh] flex-col" onSubmit={onFormSubmit}>
          <div className="flex flex-col flex-grow">
            <input
              {...register('name')} // ✅ important: Zod schema expects "name"
              placeholder="Enter role (e.g., admin)"
              className="bg-[#2D2D2D] text-white px-3 py-2 rounded-md focus:outline-none"
            />
            <ErrorMessage
              errors={errors} 
              name="name"
              render={({ message }) => (
                <p className="text-red-400 mt-2.5 ml-0 text-sm">{message}</p>
              )}
            />

            <div className="mt-auto w-full flex justify-end pb-4">
              <CustomButton
                
                disabled={!isValid || isPending}
                className="bg-[#635BFF] hover:bg-[#635BFF]/80 text-white py-2.5 px-4 w-full h-[50px] rounded-none text-base"
              >
                {isPending ? 'Adding...' : 'Add Role to Workspace'}
              </CustomButton>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default RolesModal
