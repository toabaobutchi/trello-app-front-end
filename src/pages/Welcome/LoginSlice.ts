import { createSlice } from '@reduxjs/toolkit'
import { AccountType, LoginInfo } from '@utils/types'
import { jwtDecode } from 'jwt-decode'

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    accessToken: localStorage.getItem('access_token') ?? '',
    accountInfo: (localStorage.getItem('access_token')
      ? jwtDecode(localStorage.getItem('access_token') as string)
      : (undefined as unknown)) as AccountType
  } as LoginInfo,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload
      localStorage.setItem('access_token', action.payload)
      state.accountInfo = jwtDecode(action.payload)
    }
  }
})
