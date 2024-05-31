import { createSlice } from '@reduxjs/toolkit'

export const defaultLayoutSlice = createSlice({
  name: 'sidebar',
  initialState: {
    expand: true
  },
  reducers: {
    toggleSidebar: (state) => {
      state.expand =!state.expand
    }
  }
})