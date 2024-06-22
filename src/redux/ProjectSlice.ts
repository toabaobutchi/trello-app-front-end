import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import HttpClient from '@utils/HttpClient'
import { ProjectForBoard } from '@utils/types'

const http = new HttpClient()

export const workspaceSlice = createSlice({
  name: 'project',
  initialState: {
    activeProject: {
      board: {} as ProjectForBoard
      // table, chart and calendar
    }
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchProjectsForBoard.fulfilled, (state, action) => {
      state.activeProject.board = action.payload?.data
    })
  }
})

export const fetchProjectsForBoard = createAsyncThunk(
  'projects/fetchProjectsForBoard',
  async (projectId: string) => {
    const res = await http.getAuth(`/projects/${projectId}v/board`)
    return res
  }
)
