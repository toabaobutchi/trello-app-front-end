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
  extraReducers: builder => {
    builder.addCase(fetchWorkspaces.fulfilled, (state, action) => {
      state.workspaceList = action.payload?.data.data
    }).addCase(addWorkspace.fulfilled, (state, action) => {
      state.workspaceList.push(action.payload?.data.data)
    })
  }
})

export const fetchWorkspaces = createAsyncThunk('workspaces/fetchWorkspaces', async (loginInfo: LoginInfo) => {
  const res = await http.getAuth(`/workspaces`, loginInfo.accessToken)
  return res
})

export const addWorkspace = createAsyncThunk(
  'workspaces/addWorkspace',
  async ({ data, loginInfo }: { data: Workspace; loginInfo: LoginInfo }) => {
    const res = await http.postAuth(`/workspaces`, data, loginInfo.accessToken)
    return res
  }
)

export const fetchSharedWorkspaces = createAsyncThunk('workspaces/fetchSharedWorkspaces', async (loginInfo: LoginInfo) => {
  const res = await http.getAuth(`/shared-workspace`, loginInfo.accessToken)
  return res
})