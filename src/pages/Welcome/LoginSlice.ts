import { createSlice } from '@reduxjs/toolkit'
import HttpClientAuth from '@utils/Axios/HttpClientAuth'
import { AccountType, AuthResponse } from '@utils/types'

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    accountInfo: HttpClientAuth.account
  },
  reducers: {
    setAccessToken: (state, action) => {
      const data = action.payload as AuthResponse
      if (data) {
        state.accountInfo = data.user as AccountType
      }
    }
  }
})
