import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import HttpClient from '@utils/HttpClient'
import { indexComparer } from '@utils/functions'
import { ProjectResponseForBoard } from '@utils/types'

const http = new HttpClient()

export const projectSlice = createSlice({
  name: 'project',
  initialState: {
    activeProject: {
      board: {} as ProjectResponseForBoard
      // table, chart and calendar
    }
  },
  reducers: {
    setActiveProjectBoard: (state, action) => {
      state.activeProject.board = action.payload as ProjectResponseForBoard
    }
    //TODO - thêm action cập nhật lại list khi kéo thả
    //TODO - Thêm action cập nhật lại task khi kéo thả
  },
  extraReducers: builder => {
    builder.addCase(fetchProjectsForBoard.fulfilled, (state, action) => {
      const project = action.payload?.data as ProjectResponseForBoard
      project.lists = project.lists?.sort(indexComparer)

      state.activeProject.board = action.payload?.data
    })
  }
})

export const fetchProjectsForBoard = createAsyncThunk('projects/fetchProjectsForBoard', async (projectId: string) => {
  const res = await http.getAuth(`/projects/${projectId}v/board`)
  return res
})

// (a, b) => {
//   // nếu a.index == b.index thì xét đến thời gian cập nhật hoặc tạo
//   if (a.index !== b.index) {
//     return a.index - b.index
//   } else {
//     // ai cập nhật sau thì có thời gian kéo vào lớn hơn, sẽ được đặt phía trước (được xem là nhỏ hơn)
//     return (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt)
//   }
// }
