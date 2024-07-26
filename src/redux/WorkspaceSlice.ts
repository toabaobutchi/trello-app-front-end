import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  CreateWorkspaceModel,
  UpdateProjectResponse,
  WorkspaceResponse,
  WorkspaceResponseWithRelatedProjects
} from '@utils/types'
// import { http as httpAuth } from '@utils/Axios/HttpClientAuth'
import { createWorkspace, loadSharedWorkspaces, loadWorkspaces } from '@services/workspace.services'


export const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState: {
    workspaceList: [] as WorkspaceResponse[],
    sharedWorkspaceList: [] as WorkspaceResponse[],
    activeWorkspace: undefined as unknown as WorkspaceResponseWithRelatedProjects
  },
  reducers: {
    // payload: {projectId?: string, isPinned: boolean}
    togglePinProject: (state, action) => {
      const { projectId, isPinned } = action.payload as { projectId?: string; isPinned: boolean }
      if (projectId) {
        const project = state.activeWorkspace.projects.find(list => list.id === projectId)
        if (project) {
          project.assignmentConfig.isPinned = isPinned
        }
      }
    },
    // payload: UpdateProjectResponse
    updateProject: (state, action) => {
      const updatedProject = action.payload as UpdateProjectResponse
      if (!updatedProject) return
      const project = state.activeWorkspace?.projects?.find(project => project.id === updatedProject.id)
      if (project) {
        project.name = updatedProject.name
        project.description = updatedProject.description
        project.dueDate = updatedProject.dueDate
        project.color = updatedProject.color
      }
    },
    setActiveWorkspace: (state, action) => {
      state.activeWorkspace = action?.payload as WorkspaceResponseWithRelatedProjects
    },
    // payload: { workspaceId, workspaceName }
    renameWorkspace: (state, action) => {
      const { workspaceId, workspaceName } = action.payload as { workspaceId: number; workspaceName: string }
      // vì chỉ owner mới cập nhật lại được workspace name nên chỉ tìm trong `workspaceList`
      const workspace = state.workspaceList.find(workspace => workspace.id === workspaceId)
      if (workspace) {
        workspace.name = workspaceName
      }
    },
    // payload: { workspaceId, workspaceName }
    renameActiveWorkspace: (state, action) => {
      const { workspaceId, workspaceName } = action.payload as { workspaceId: number; workspaceName: string }
      const workspace = state.workspaceList.find(workspace => workspace.id === workspaceId)
      if (workspace) {
        workspace.name = workspaceName
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        const res = action.payload
        if (res?.isSuccess) {
          state.workspaceList = res.data
        }
      })
      .addCase(addWorkspace.fulfilled, (state, action) => {
        const res = action.payload
        if (res?.isSuccess) {
          state.workspaceList.push(action.payload?.data)
        }
      })
      .addCase(fetchSharedWorkspaces.fulfilled, (state, action) => {
        const res = action.payload
        if (res?.isSuccess) {
          state.sharedWorkspaceList = res.data
        }
      })
  }
})

export const fetchWorkspaces = createAsyncThunk('workspaces/fetchWorkspaces', async () => {
  const res = await loadWorkspaces()
  return res
})

export const addWorkspace = createAsyncThunk('workspaces/addWorkspace', async (data: CreateWorkspaceModel) => {
  const res = await createWorkspace(data)
  return res
})

export const fetchSharedWorkspaces = createAsyncThunk('workspaces/fetchSharedWorkspaces', async () => {
  const res = await loadSharedWorkspaces()
  return res
})
