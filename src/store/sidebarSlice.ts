import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOpen: false, // Sidebar is closed by default
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen // Toggle state
    },
  },
})

// Export actions
export const { toggleSidebar } = sidebarSlice.actions
export default sidebarSlice.reducer
