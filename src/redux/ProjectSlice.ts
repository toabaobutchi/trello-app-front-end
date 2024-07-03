import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import HttpClient from '@utils/HttpClient'
import { mapOrder, sortList } from '@utils/functions'
import {
  AssignmentResponse,
  ChangeTaskOrderResponse,
  CreateListResponse,
  CreateTaskResponse,
  DragOverResult,
  ListResponseForBoard,
  ProjectResponseForBoard,
  TaskResponseForBoard
} from '@utils/types'

const http = new HttpClient()

export const projectSlice = createSlice({
  name: 'project',
  initialState: {
    activeProject: {
      board: {} as ProjectResponseForBoard,
      members: [] as AssignmentResponse[],
      onlineMembers: [] as string[]
      // table, chart and calendar
    }
  },
  reducers: {
    setActiveProjectBoard: (state, action) => {
      const project = action.payload as ProjectResponseForBoard
      const listOrder = project?.listOrder?.split(',')
      // project!.lists = project?.lists?.sort((a, b) => (listOrder?.indexOf(a.id) ?? 0) - (listOrder?.indexOf(b.id) ?? 0))
      project!.lists = mapOrder(project?.lists as ListResponseForBoard[], project?.listOrder?.split(',') as string[], 'id')
      // // TODO: sắp xếp lại danh sách task
      state.activeProject.board = project
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
      let newList = state.activeProject.board.lists?.find(l => l.id === resData.updatedNewListId)
      // cập nhật trên 1 cột
      newList = dragOverResult.overList
      newList!.taskOrder = resData.updatedNewTaskOrder

      // trường hợp thay đổi trên 2 cột khác nhau
      if (resData.updatedNewListId !== resData.updatedOldListId) {
        let oldList = state.activeProject.board.lists?.find(l => l.id === resData.updatedOldListId)
        oldList = dragOverResult.activeList
        oldList!.taskOrder = resData.updatedOldTaskOrder
      }
    },
    setProjectMembers: (state, action) => {
      const members = action.payload as AssignmentResponse[]
      state.activeProject.members = members
    },
    setOnlineMembers: (state, action) => {
      const onlineMembers = action.payload as string[]
      state.activeProject.onlineMembers = onlineMembers
    }
  },
  extraReducers: builder => {
    builder.addCase(changeListOrder.fulfilled, (state, action) => {
      const newListOrder = action?.payload?.data as string
      state.activeProject.board.listOrder = newListOrder
      const updatedListOrder = newListOrder.split(',')
      state.activeProject.board!.lists = state.activeProject.board?.lists?.sort(
        (a, b) => (updatedListOrder?.indexOf(a.id) ?? 0) - (updatedListOrder?.indexOf(b.id) ?? 0)
      )
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
