import config from '@confs/app.config'
import { createSlice } from '@reduxjs/toolkit'

export const defaultLayoutSlice = createSlice({
  name: 'sidebar',
  initialState: {
    expand: config.sideBar.expand
  },
  reducers: {
    toggleSidebar: (state) => {
      state.expand =!state.expand
    }
  }
})