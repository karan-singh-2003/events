import React from 'react'
import { useForm } from 'react-hook-form'
import Modal from '../../global/CustomModal'
import CustomButton from '../../global/CustomButton'
import { Button } from '../../ui/button'

interface InvitePeopleModalProps {
  isOpen: boolean
  onClose: () => void
}

interface InviteFormInputs {
  email: string
  role: string
  MemberId: string
  message?: string
}

const roles = ['Admin', 'Member', 'Viewer']

const InvitePeopleModal: React.FC<InvitePeopleModalProps> = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<InviteFormInputs>({ mode: 'onChange' })

  const onSubmit = async (data: InviteFormInputs) => {
    try {
      console.log('Invite sent:', data)
      // TODO: Call your invite API here
      onClose()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      height="auto"
      width="600px"
      className="rounded-none text-black max-w-[90vw]"
    >
      <div className="flex flex-col h-full justify-between px-4 py-6 max-h-[90vh] overflow-y-auto">
        <div className="text-center text-white text-lg font-semibold">
          Invite People to Workspace
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-6">
          {/* Email Field */}
          <div className="flex flex-col">
            <label className="text-white mb-1 text-sm font-medium">
              Invite Member Email Address
            </label>
            <input
              type="email"
              placeholder="example@domain.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Enter a valid email address',
                },
              })}
              className="bg-[#383838] text-white placeholder:text-[#737272] px-4 py-3 rounded-md border border-[#444] focus:border-[#635BFF] outline-none"
            />
            {errors.email && (
              <p className="text-[#FF3F3F] text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Member ID Field */}
          <div className="flex flex-col">
            <label className="text-white mb-1 text-sm font-medium">Invite Member ID</label>
            <input
              type="text"
              placeholder="Enter College ID"
              {...register('MemberId', {
                required: 'ID is required',
              })}
              className="bg-[#383838] text-white placeholder:text-[#737272] px-4 py-3 rounded-md border border-[#444] focus:border-[#635BFF] outline-none"
            />
            {errors.MemberId && (
              <p className="text-[#FF3F3F] text-sm mt-1">{errors.MemberId.message}</p>
            )}
          </div>

          {/* Role Dropdown */}
          <div className="flex flex-col">
            <label className="text-white mb-1 text-sm font-medium">Select Role</label>
            <select
              {...register('role', { required: 'Please select a role' })}
              className="bg-[#383838] text-white px-4 py-3 border border-[#444] rounded-md focus:border-[#635BFF] outline-none"
            >
              <option value="">-- Select Role --</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-[#FF3F3F] text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Optional Message */}
          <div className="flex flex-col">
            <label className="text-white mb-1 text-sm font-medium">Optional Message</label>
            <textarea
              {...register('message')}
              placeholder="Add a personal message (optional)"
              rows={3}
              className="bg-[#383838] text-white placeholder:text-[#737272] px-4 py-3 rounded-md border border-[#444] focus:border-[#635BFF] outline-none resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
            <Button
              type="button"
              onClick={onClose}
                className="bg-[#383838] hover:bg-[#333] text-white py-2.5 w-full lg:w-[200px] lg:absolute lg:left-[42px] h-[50px] rounded-none text-base  lg:bottom-4 "
             >
              Cancel
            </Button>
            <CustomButton
              disabled={!isValid}
              className="bg-[#635BFF]  hover:bg-[#635BFF]/80 text-white py-2.5 w-full lg:w-[200px] lg:right-[40px] lg:absolute h-[50px] rounded-none text-base lg:bottom-4"
            >
              Send Invite
            </CustomButton>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default InvitePeopleModal
