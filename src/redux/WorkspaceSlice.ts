import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CreateWorkspaceModel, LoginInfo, WorkspaceResponse, WorkspaceResponseWithRelatedProjects } from '@utils/types'
import HttpClient from '@utils/HttpClient'

const http = new HttpClient()

export const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState: {
    workspaceList: [] as WorkspaceResponse[],
    sharedWorkspaceList: [] as WorkspaceResponse[],
    activeWorkspace: {} as WorkspaceResponseWithRelatedProjects
  },
  reducers: {
    setActiveWorkspace: (state, action) => {
      state.activeWorkspace = action.payload as WorkspaceResponseWithRelatedProjects
    },
    // payload: { workspaceId, workspaceName }
    renameWorkspace: (state, action) => {
      const {workspaceId, workspaceName} = action.payload as {workspaceId: number, workspaceName: string}
      // vì chỉ owner mới cập nhật lại được workspace name nên chỉ tìm trong `workspaceList`
      const workspace = state.workspaceList.find(workspace => workspace.id === workspaceId)
      if (workspace) {
        workspace.name = workspaceName
      }
    },
    // payload: { workspaceId, workspaceName }
    renameActiveWorkspace: (state, action) => {
      const {workspaceId, workspaceName} = action.payload as {workspaceId: number, workspaceName: string}
      const workspace = state.workspaceList.find(workspace => workspace.id === workspaceId)
      if (workspace) {
        workspace.name = workspaceName
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.workspaceList = action.payload?.data
      })
      .addCase(addWorkspace.fulfilled, (state, action) => {
        state.workspaceList.push(action.payload?.data)
      })
  }
})

export const fetchWorkspaces = createAsyncThunk('workspaces/fetchWorkspaces', async () => {
  const res = await http.getAuth(`/workspaces`)
  return res
})

export const addWorkspace = createAsyncThunk('workspaces/addWorkspace', async (data: CreateWorkspaceModel) => {
  const res = await http.postAuth(`/workspaces`, data)
  return res
})

export const fetchSharedWorkspaces = createAsyncThunk(
  'workspaces/fetchSharedWorkspaces',
  async (loginInfo: LoginInfo) => {
    const res = await http.getAuth(`/shared-workspace`, loginInfo.accessToken)
    return res
  }
)