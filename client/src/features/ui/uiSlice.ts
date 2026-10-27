import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  isQueueSidebarOpen: boolean;
}

const initialState: UIState = {
  isQueueSidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openQueueSidebar(state) {
      state.isQueueSidebarOpen = true;
    },
    closeQueueSidebar(state) {
      state.isQueueSidebarOpen = false;
    },
    toggleQueueSidebar(state) {
      state.isQueueSidebarOpen = !state.isQueueSidebarOpen;
    },
  },
});

export const {
  openQueueSidebar,
  closeQueueSidebar,
  toggleQueueSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;
