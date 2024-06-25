import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import HttpClient from '@utils/HttpClient'
import { CreateListResponse, ProjectResponseForBoard, TaskResponseForBoard } from '@utils/types'

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
      const project = action.payload as ProjectResponseForBoard
      const listOrder = project?.listOrder?.split(',')
      project!.lists = project?.lists?.sort((a, b) => (listOrder?.indexOf(a.id) ?? 0) - (listOrder?.indexOf(b.id) ?? 0))
      state.activeProject.board = project
    },
    addNewList: (state, action) => {
      const res = action.payload as CreateListResponse
      state.activeProject.board.lists?.push(res.createdList)
      state.activeProject.board.listOrder = res.listOrder
    },
    addNewTask: (state, action) => {
      const task = action.payload as TaskResponseForBoard
      const list = state.activeProject.board.lists?.find(l => l.id === task.listId)
      if (list) {
        list.tasks?.push(task)
      }
    },
    changeListOrder: (state, action) => {
      const newListOrder = action?.payload?.data as string
      state.activeProject.board.listOrder = newListOrder
      const updatedListOrder = newListOrder.split(',')
      state.activeProject.board!.lists = state.activeProject.board?.lists?.sort((a, b) => (updatedListOrder?.indexOf(a.id) ?? 0) - (updatedListOrder?.indexOf(b.id) ?? 0))
    }

    //TODO - Thêm action cập nhật lại task khi kéo thả
  },
  extraReducers: builder => {
    builder.addCase(changeListOrder.fulfilled, (state, action) => {
      const newListOrder = action?.payload?.data as string
      state.activeProject.board.listOrder = newListOrder
      const updatedListOrder = newListOrder.split(',')
      state.activeProject.board!.lists = state.activeProject.board?.lists?.sort((a, b) => (updatedListOrder?.indexOf(a.id) ?? 0) - (updatedListOrder?.indexOf(b.id) ?? 0))
    })
  }
})

export const fetchProjectsForBoard = createAsyncThunk('projects/fetchProjectsForBoard', async (projectId: string) => {
  const res = await http.getAuth(`/projects/${projectId}v/board`)
  return res
})

export const changeListOrder = createAsyncThunk('projects/changeListOrder', async (newListOrder: string) => {
  const res = await http.putAuth(`/lists/change-order`, { newListOrder })
  return res
})
