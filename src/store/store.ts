import { configureStore } from '@reduxjs/toolkit'
import sidebarReducer from '../store/sidebarSlice'
import workspaceReducer from './workspaceSlice'
import userReducer from './userSlice'
import rolesReducer from './rolesSlice'
export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    workspace: workspaceReducer,
    user: userReducer,
    roles: rolesReducer,
  },
})

// Infer types for TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
