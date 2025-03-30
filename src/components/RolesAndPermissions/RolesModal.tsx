'use client'
import React from 'react'
import Modal from '../global/CustomModal'
import CustomButton from '../global/CustomButton'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import { toggleAddRolesModal } from '../../store/rolesSlice'
import BadgeInput from '../global/BadgeInput'
import useCreateRole from '@/src/hooks/useCreateRole'
import { ErrorMessage } from '@hookform/error-message'
const RolesModal = () => {
  const dispatch = useDispatch()
  const isAddRolesModalOpen = useSelector(
    (state: RootState) => state.roles.isAddRolesModalOpen
  )
  const { errors, onFormSubmit, isValid, watch, control } = useCreateRole()
  const roles = watch('roles')
  console.log('Roles:', roles)
  console.log('Form Errors:', errors)

  console.log('Is Form Valid?', isValid)

  return (
    <Modal
      isOpen={isAddRolesModalOpen}
      onClose={() => dispatch(toggleAddRolesModal())}
      height="450px"
      width="450px"
      className="rounded-none text-black  "
    >
      <div className="flex flex-col h-full">
        <div className="text-[#7E7E7E] justify-center text-center font-semibold text-[17px]">
          Add Roles
        </div>

        <hr className="border-[#313131] w-full my-3" />

        <div className="text-center text-white mt-3 mb-6 text-[18px] font-semibold">
          Add your own custom roles
        </div>

        <form className="flex flex-grow h-[44vh]" onSubmit={onFormSubmit}>
          <div className="flex flex-col flex-grow">
            <BadgeInput
              type="role"
              name="roles"
              control={control}
              placeholder="Add roles (e.g., admin, moderator)"
              maxItems={5}
            />
            <ErrorMessage
              errors={errors}
              name="roles"
              render={({ message }) => (
                <p className="text-red-400 mt-2.5 ml-0  text-sm">
                  {message === 'Required' ? '' : message}
                </p>
              )}
            />
            {/* ✅ Button Wrapper (Sticks to Bottom) */}
            <div className="mt-auto w-full flex justify-end pb-4">
              <CustomButton
                disabled={!isValid}
                className="bg-[#635BFF] hover:bg-[#635BFF]/80 text-white py-2.5 px-4 w-full h-[50px] rounded-none text-base"
              >
                Add Role to Workspace
              </CustomButton>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default RolesModal
