import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import HttpClient from '@utils/HttpClient'
import { mapOrder } from '@utils/functions'
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
      try {
        const project = action.payload as ProjectResponseForBoard
        const listOrder = project?.listOrder?.split(',')
        console.log('project: ', project)
        project!.lists = [...mapOrder(project?.lists as ListResponseForBoard[], listOrder as string[], 'id')]
        state.activeProject.board = project
      } catch {
        console.error('Error setting active project board')
      }
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
      const newListOrder = action?.payload as string
      state.activeProject.board.listOrder = newListOrder
      state.activeProject.board!.lists = mapOrder(state.activeProject.board?.lists, newListOrder?.split(','), 'id')
    },
    changeTaskOrder: (state, action) => {
      const data = action?.payload
      const resData = data.resData as ChangeTaskOrderResponse
      const dragOverResult = data.dragOverResult as DragOverResult

      if (!resData || !dragOverResult) return

      // cập nhật trên cùng 1 cột
      const newListIndex = state.activeProject.board.lists?.findIndex(l => l.id === resData.updatedNewListId)
      // không xét `!nextIndex` vì `nextIndex` vẫn có thể dùng giá trị `0`
      if (newListIndex === undefined || newListIndex < 0) return // nếu list không tồn tại thì bỏ qua
      // cập nhật trên 1 cột
      const newList = dragOverResult.overList
      newList!.taskOrder = dragOverResult.overList?.taskOrder

      state.activeProject.board.lists?.splice(newListIndex, 1, newList as ListResponseForBoard)

      // trường hợp thay đổi trên 2 cột khác nhau
      if (resData.updatedNewListId !== resData.updatedOldListId) {
        const oldListIndex = state.activeProject.board.lists?.findIndex(l => l.id === resData.updatedOldListId)
        if (oldListIndex === undefined || oldListIndex < 0) {
          return
        }
        const oldList = dragOverResult.activeList
        oldList!.taskOrder = dragOverResult.activeList.taskOrder
        state.activeProject.board.lists?.splice(oldListIndex, 1, oldList as ListResponseForBoard)
      }
    },
    setProjectMembers: (state, action) => {
      const members = action.payload as AssignmentResponse[]
      state.activeProject.members = members
    },
    setOnlineMembers: (state, action) => {
      const onlineMembers = action.payload as string[]
      state.activeProject.onlineMembers = onlineMembers
    },
    setDuplicateTasks: (state, action) => {
      const tasks = action.payload as TaskResponseForBoard[]
      if (!tasks || tasks.length <= 0) {
        return
      }
      const listId = tasks[0].listId
      const appendedList = state.activeProject.board.lists?.find(l => l.id === listId)
      if (appendedList) {
        appendedList.tasks = [...(appendedList.tasks as TaskResponseForBoard[]), ...tasks]
        appendedList.taskOrder = appendedList.tasks?.map(t => t.id).join(',') || ''
      }
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
