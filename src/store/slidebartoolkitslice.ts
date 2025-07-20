// src/store/slices/sidebarSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SidebarState {
  activeRoute: string;
  activeRouteLabel: string;
}

const initialState: SidebarState = {
  activeRoute: '/',
  activeRouteLabel: 'Home',
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setActiveRoute: (
      state,
      action: PayloadAction<{ path: string; label: string }>
    ) => {
      state.activeRoute = action.payload.path;
      state.activeRouteLabel = action.payload.label;
    },
  },
});

export const { setActiveRoute } = sidebarSlice.actions;
export default sidebarSlice.reducer;
