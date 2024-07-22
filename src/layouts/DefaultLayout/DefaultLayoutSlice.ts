import { createSlice } from '@reduxjs/toolkit'

export const defaultLayoutSlice = createSlice({
  name: 'sidebar',
  initialState: {
    expand: localStorage.getItem('expand') === 'true',
    projectSidebar: false
  },
  reducers: {
    toggleSidebar: state => {
      state.expand = !state.expand
      localStorage.setItem('expand', !state.expand ? 'false' : 'true')
    },
    toggleProjectSidebar: state => {
      state.projectSidebar = !state.projectSidebar
    }
  }
})
