import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LoginInfo, Project, Workspace } from '@utils/types'
import HttpClient from '@utils/HttpClient'

const http = new HttpClient()

export const workspaceSlice = createSlice({
  name: 'project',
  initialState: {
    selectedWorkspace: {} as Workspace,
    selectedProject: ''
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.selectedWorkspace = action.payload?.data.data
    })
  }
})

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async ({ workspaceId, accessToken }: { workspaceId: string; accessToken: string }) => {
    const res = await http.getAuth(`/w/${workspaceId}/projects`, accessToken)
    return res
  }
)
