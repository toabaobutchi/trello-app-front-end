import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import HttpClient from '@utils/HttpClient'
import { sortList, sortProject, sortTask } from '@utils/functions'
import { ChangeTaskOrderResponse, CreateListResponse, CreateTaskResponse, DragOverResult, ProjectResponseForBoard, TaskResponseForBoard } from '@utils/types'

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
      // const listOrder = project?.listOrder?.split(',')
      // project!.lists = project?.lists?.sort((a, b) => (listOrder?.indexOf(a.id) ?? 0) - (listOrder?.indexOf(b.id) ?? 0))
      // // TODO: sắp xếp lại danh sách task
      state.activeProject.board = sortProject(project) as ProjectResponseForBoard
    },
    addNewList: (state, action) => {
      const res = action.payload as CreateListResponse
      state.activeProject.board.lists?.push(res.createdList)
      state.activeProject.board.listOrder = res.listOrder
    },
    addNewTask: (state, action) => {
      const res = action.payload as CreateTaskResponse
      const task = res.createdTask as TaskResponseForBoard
      const list = state.activeProject.board.lists?.find(l => l.id === task.listId)
      if (list) {
        list.tasks?.push(task)
        list.taskOrder = res.taskOrder
      }
    },
    changeListOrder: (state, action) => {
      const newListOrder = action?.payload?.data as string
      state.activeProject.board.listOrder = newListOrder
      state.activeProject.board!.lists = sortList(state.activeProject.board?.lists, newListOrder)
    },
    changeTaskOrder: (state, action) => {
      const data = action?.payload
      const resData = data.resData as ChangeTaskOrderResponse
      const dragOverResult = data.dragOverResult as DragOverResult
      // cập nhật trên cùng 1 cột
      const newList = state.activeProject.board.lists?.find(l => l.id === resData.updatedNewListId)
      // cập nhật trên 1 cột
      newList!.tasks = sortTask(dragOverResult.overList.tasks, resData.updatedNewTaskOrder)
      newList!.taskOrder = resData.updatedNewTaskOrder

      // trường hợp thay đổi trên 2 cột khác nhau
      if (resData.updatedNewListId !== resData.updatedOldListId) {
        const oldList = state.activeProject.board.lists?.find(l => l.id === resData.updatedOldListId)
        oldList!.tasks = sortTask(dragOverResult.activeList.tasks, resData.updatedOldTaskOrder)
        oldList!.taskOrder = resData.updatedOldTaskOrder
      }
    }
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
