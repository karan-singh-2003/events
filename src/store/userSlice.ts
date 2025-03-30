import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  email: string | null
  role: string | null
}

const initialState: UserState = {
  email: null,
  role: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserEmail: (state, action: PayloadAction<string | null>) => {
      state.email = action.payload
    },
    clearUser: (state) => {
      state.email = null
    },
    setUserRole: (state, action: PayloadAction<string | null>) => {
      state.role = action.payload
    },
  },
})

export const { setUserEmail, clearUser, setUserRole } = userSlice.actions
export default userSlice.reducer
