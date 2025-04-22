// 



import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  email: string | null
  isAdmin: boolean
}

const initialState: UserState = {
  email: null,
  isAdmin: false, // Default to `false`
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserEmail: (state, action: PayloadAction<string | null>) => {
      state.email = action.payload
    },
    setUserIsAdmin: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload // ✅ Store `isAdmin`
    },
  },
})

export const { setUserEmail, setUserIsAdmin } = userSlice.actions
export default userSlice.reducer
