import { createSlice } from '@reduxjs/toolkit'

export const defaultLayoutSlice = createSlice({
  name: 'sidebar',
  initialState: {
    expand: Boolean(localStorage.getItem('expand'))
  },
  reducers: {
    toggleSidebar: state => {
      state.expand = !state.expand
      if (!state.expand) {
        localStorage.setItem('expand', 'true')
      } else {
        localStorage.removeItem('expand')
      }
    }
  }
})
