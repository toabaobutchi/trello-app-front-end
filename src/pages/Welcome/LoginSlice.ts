import { createSlice } from '@reduxjs/toolkit'
import { AccountType, AuthResponse, LoginInfo } from '@utils/types'

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    accessToken: localStorage.getItem('access_token') ?? '',
    accountInfo: undefined as unknown as AccountType
  } as LoginInfo,
  reducers: {
    setAccessToken: (state, action) => {
      const data = action.payload as AuthResponse
      if (data) {
        state.accessToken = data.accessToken
        localStorage.setItem('access_token', data.accessToken)
        state.accountInfo = data.user as AccountType
      }
    }
  }
})
