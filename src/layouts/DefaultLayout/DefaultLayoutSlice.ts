import { createSlice } from '@reduxjs/toolkit'

export const defaultLayoutSlice = createSlice({
  name: 'sidebar',
  initialState: {
    expand: localStorage.getItem('expand') === 'true'
  },
  reducers: {
    toggleSidebar: state => {
      state.expand = !state.expand
      localStorage.setItem('expand', !state.expand ? 'false' : 'true')
    }
  }
})
