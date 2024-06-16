import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LoginInfo, Workspace } from '@utils/types'
import HttpClient from '@utils/HttpClient'

const http = new HttpClient()

export const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState: {
    workspaceList: [] as Workspace[],
    sharedWorkspaceList: [] as Workspace[]
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchWorkspaces.fulfilled, (state, action) => {
      state.workspaceList = action.payload?.data.data
    })
  }
})

export const fetchWorkspaces = createAsyncThunk('workspaces/fetchWorkspaces', async (loginInfo: LoginInfo) => {
  const res = await http.getAuth(`/u/${loginInfo.accountInfo.id}/workspaces`, loginInfo.accessToken);
  return res
})