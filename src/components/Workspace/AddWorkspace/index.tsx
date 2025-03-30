import React from 'react'
import Modal from '../../global/CustomModal'
import CustomButton from '../../global/CustomButton'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../store/store'
import { toggleAddWorkspaceModal } from '@/src/store/workspaceSlice'
import FormElements from '../../global/Form'
import useCreateWorkspace from '../../../hooks/useCreateWorkspace'
const AddWorkspaceModal = () => {
  const dispatch = useDispatch()
  const isAddWorkspaceModalOpen = useSelector(
    (state: RootState) => state.workspace.isAddWorkspaceModalOpen
  )
  const { register, errors, onFormSubmit, isValid, serverError } =
    useCreateWorkspace()

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('Form submitted')
    e.preventDefault()
    if (!onFormSubmit) {
      console.error('onFormSubmit is undefined')
      return
    }
    await onFormSubmit()
  }
  return (
    <Modal
      isOpen={isAddWorkspaceModalOpen}
      onClose={() => dispatch(toggleAddWorkspaceModal())}
      height="600px"
      width="600px"
      className="rounded-none text-black  "
    >
      <div className="flex flex-col h-full">
        <div className="text-[#7E7E7E] justify-center text-center font-semibold text-[17px]">
          What Should We Call Your Workspace
        </div>

        <hr className="border-[#313131] w-full my-3" />

        <div className="text-center text-white mt-3 mb-6 text-[18px] font-semibold">
          Give your workspace a name that represents your team or project
        </div>

        <div className="flex-col">
          {serverError && (
            <div className="bg-[#FFDADA] flex text-[#FF3F3F] text-sm p-3 mb-4 text-center justify-center h-14 items-center">
              <p className="mt-0 ml-2 ">
                {typeof serverError === 'string'
                  ? serverError
                  : JSON.stringify(serverError)}
              </p>
            </div>
          )}
          <form onSubmit={handleFormSubmit} className="flex flex-grow h-[44vh]">
            <div className="flex flex-col flex-grow">
              {/* Input Field */}
              <FormElements
                inputType="input"
                type="text"
                placeholder="Workspace Name"
                register={register}
                errors={errors}
                name="name"
                className="bg-[#282828] text-[#737272] placeholder:text-[#737272] text-[15px] font-semibold rounded-none px-4 outline-none focus:ring-0 border-[#ff0000]
      focus:border-[#635BFF] w-full h-14 focus:border-[1.8px] border-[1px] mb-2 hover:border-[#ffffff]
      hover:placeholder:text-white transition-opacity duration-300 ease-in-out"
              />

              {/* ✅ Button Wrapper (Sticks to Bottom) */}
              <div className="mt-auto w-full flex justify-end pb-4">
                <CustomButton
                  disabled={!isValid}
                  className="bg-[#635BFF] hover:bg-[#635BFF]/80 text-white py-2.5 px-4 w-full h-[50px] rounded-none text-base"
                >
                  Add Workspace
                </CustomButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default AddWorkspaceModal
