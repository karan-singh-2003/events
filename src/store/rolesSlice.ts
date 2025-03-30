import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAddRolesModalOpen: false,
}

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    toggleAddRolesModal: (state) => {
      state.isAddRolesModalOpen = !state.isAddRolesModalOpen // Toggle state
    },
  },
})

export const { toggleAddRolesModal } = rolesSlice.actions
export default rolesSlice.reducer
