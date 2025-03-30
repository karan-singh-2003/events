import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAddWorkspaceModalOpen: false,
}

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    toggleAddWorkspaceModal: (state) => {
      state.isAddWorkspaceModalOpen = !state.isAddWorkspaceModalOpen // Toggle state
    },
  },
})

export const { toggleAddWorkspaceModal } = workspaceSlice.actions
export default workspaceSlice.reducer
