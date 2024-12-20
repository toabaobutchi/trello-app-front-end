import { createSlice } from '@reduxjs/toolkit'
import { mapOrder } from '@utils/functions'
import {
  AssignByTaskResponse,
  AssignmentResponse,
  ChangeTaskOrderResponse,
  CreateListResponse,
  CreateTaskResponse,
  DeletedListResponse,
  DeletedTaskResponse,
  DragOverResult,
  ProjectFilterType,
  JoinTaskResponse,
  ListResponseForBoard,
  MarkedTaskResponse,
  ProjectResponseForBoard,
  TaskResponseForBoard,
  UpdatedListResponse,
  UpdatedTaskResponse,
  DeletedTaskAssignmentResponse,
  DispatchRelatedTaskResponse,
  DeletedRelationshipResponse,
  ChangePermissionResonse
} from '@utils/types'

export const projectSlice = createSlice({
  name: 'project',
  initialState: {
    activeProject: {
      changeId: undefined as unknown as number,
      board: {} as ProjectResponseForBoard,
      members: [] as AssignmentResponse[],
      onlineMembers: [] as string[],
      currentFilters: {} as ProjectFilterType,
      table: {}
    }
  },
  reducers: {
    changePermission: (state, action) => {
      const data = action.payload as ChangePermissionResonse
      if (data) {
        const member = state.activeProject.members.find(m => m.id === data.assignmentId)
        if (member) {
          member.permission = data.newPermission
          state.activeProject.changeId = new Date().getTime()
        }
      }
    },
    removeAssignment: (state, action) => {
      const assignmentId = action.payload as string
      if (assignmentId) {
        state.activeProject.members = state.activeProject.members.filter(m => m.id === assignmentId)
        state.activeProject.onlineMembers = state.activeProject.onlineMembers.filter(m => m !== assignmentId)
        state.activeProject.changeId = new Date().getTime()
      }
    },
    removeFromChildren: (state, action) => {
      const data = action.payload as DeletedRelationshipResponse
      if (data) {
        const list = state.activeProject.board?.lists?.find(
          l => (l.tasks?.findIndex(t => t.id === data.relationshipId) ?? -1) >= 0
        )
        if (list) {
          const task = list.tasks?.find(t => t.id === data.relationshipId)
          if (task) {
            task.dependencyIds = task.dependencyIds?.filter(id => id !== data.taskId)
            state.activeProject.changeId = new Date().getTime()
          }
        }
      }
    },
    removeFromDependencies: (state, action) => {
      const data = action.payload as DeletedRelationshipResponse
      if (data) {
        const list = state.activeProject.board?.lists?.find(
          l => (l.tasks?.findIndex(t => t.id === data.taskId) ?? -1) >= 0
        )
        if (list) {
          const task = list.tasks?.find(t => t.id === data.taskId)
          if (task) {
            task.dependencyIds = task.dependencyIds?.filter(id => id !== data.relationshipId)
            state.activeProject.changeId = new Date().getTime()
          }
        }
      }
    },
    addFromChildren: (state, action) => {
      const data = action.payload as DispatchRelatedTaskResponse
      if (data) {
        let isChange = false
        const { taskId, relatedTasks } = data
        relatedTasks.forEach(task => {
          const list = state.activeProject.board?.lists?.find(
            l => (l.tasks?.findIndex(t => t.id === task.id) ?? -1) >= 0
          )
          if (list) {
            const taskToAdd = list.tasks?.find(t => t.id === task.id)
            if (taskToAdd) {
              taskToAdd.dependencyIds?.push(taskId)
              isChange = true
            }
          }
        })

        if (isChange) {
          state.activeProject.changeId = new Date().getTime()
        }
      }
    },
    addFromDependencies: (state, action) => {
      const data = action.payload as DispatchRelatedTaskResponse
      if (data) {
        const { taskId, relatedTasks } = data
        const list = state.activeProject.board?.lists?.find(l => (l.tasks?.findIndex(t => t.id === taskId) ?? -1) >= 0)
        if (list) {
          const task = list.tasks?.find(t => t.id === taskId)
          if (task) {
            task.dependencyIds = task.dependencyIds?.concat(relatedTasks.map(t => t.id))
            state.activeProject.changeId = new Date().getTime()
          }
        }
      }
    },
    removeTaskAssignment: (state, action) => {
      const data = action.payload as DeletedTaskAssignmentResponse
      if (data) {
        const list = state.activeProject.board.lists?.find(
          l => (l.tasks?.findIndex(t => t.id === data.taskId) ?? -1) >= 0
        )
        if (list) {
          const task = list.tasks?.find(t => t.id === data.taskId)
          if (task) {
            task.taskAssignmentIds = task.taskAssignmentIds.filter(id => id !== data.assignmentId)
            state.activeProject.changeId = new Date().getTime()
          }
        }
      }
    },
    addAssignmentToTask: (state, action) => {
      const data = action.payload as AssignByTaskResponse
      if (data) {
        const containList = state.activeProject.board.lists?.find(l => l.tasks?.map(t => t.id).includes(data.taskId))
        if (containList) {
          const task = containList.tasks?.find(t => t.id === data.taskId)
          if (task) {
            task.taskAssignmentIds = task.taskAssignmentIds.concat(data.assignmentIds)
            state.activeProject.changeId = new Date().getTime()
          }
        }
      }
    },
    markTask: (state, action) => {
      const data = action.payload as MarkedTaskResponse
      if (data) {
        const list = state.activeProject.board.lists?.find(l => l.id === data.listId)
        if (list) {
          const task = list.tasks?.find(t => t.id === data.id)
          if (task) {
            task.isCompleted = data.isCompleted
            task.isReOpened = data.isReOpened
            task.isMarkedNeedHelp = data.isMarkedNeedHelp
            state.activeProject.changeId = new Date().getTime()
          }
        }
      }
    },
    deleteList: (state, action) => {
      const data = action.payload as DeletedListResponse
      if (data) {
        console.log('Delete list')
        state.activeProject.board.lists = state.activeProject.board.lists?.filter(l => l.id !== data.id)
        state.activeProject.changeId = new Date().getTime()
      }
    },
    joinTask: (state, action) => {
      const data = action?.payload as JoinTaskResponse
      if (data) {
        const containList = state.activeProject.board.lists?.find(l => l.tasks?.map(t => t.id).includes(data.taskId))
        if (containList) {
          const task = containList.tasks?.find(t => t.id === data.taskId)
          if (task) {
            task.taskAssignmentIds.push(data.assignmentId)
            state.activeProject.changeId = new Date().getTime()
          }
        }
      }
    },
    changeSubtaskStatus: (state, action) => {
      const data = action.payload
      const taskId = data?.taskId as string
      const isCompleted = data?.status as boolean
      if (taskId) {
        const list = state.activeProject.board.lists?.find(l => l.tasks?.map(t => t.id).includes(taskId))
        if (list) {
          const task = list.tasks?.find(t => t.id === taskId)
          if (task) {
            const count = isCompleted ? 1 : -1
            task.completedSubTaskCount = (task.completedSubTaskCount ?? 0) + count
            state.activeProject.changeId = new Date().getTime()
          }
        }
      }
    },
    changeSubtaskCount: (state, action) => {
      const data = action.payload
      const taskId = data?.taskId as string
      const subtaskCount = data?.subtaskCount as number
      if (taskId && subtaskCount) {
        const list = state.activeProject.board.lists?.find(l => l.tasks?.map(t => t.id).includes(taskId))
        if (list) {
          const task = list.tasks?.find(t => t.id === taskId)
          if (task) {
            task.subTaskCount = (task.subTaskCount ?? 0) + subtaskCount
            state.activeProject.changeId = new Date().getTime()
          }
        }
      }
    },
    updateTaskInfo: (state, action) => {
      const data = action.payload as UpdatedTaskResponse
      if (data) {
        const task = state.activeProject.board.lists
          ?.find(l => l.id === data.listId)
          ?.tasks?.find(t => t.id === data.id)
        if (task) {
          task.name = data.name || task.name
          task.description = data.description
          task.dueDate = data.dueDate
          task.priority = data.priority
          task.startedAt = data.startedAt
          state.activeProject.changeId = new Date().getTime()
        }
      }
    },
    updateListInfo: (state, action) => {
      const updatedList = action?.payload as UpdatedListResponse
      if (updatedList) {
        const list = state.activeProject.board.lists?.find(l => l.id === updatedList.id)
        if (list) {
          list.name = updatedList.name || list.name
          list.wipLimit = updatedList.wipLimit
          state.activeProject.changeId = new Date().getTime()
        }
      }
    },
    // payload: deletedTask: DeletedTaskResponse
    deleteTask: (state, action) => {
      const deletedTask = action.payload as DeletedTaskResponse
      if (deletedTask) {
        const list = state.activeProject.board.lists?.find(l => l.id === deletedTask.listId)
        if (list) {
          list.tasks = list.tasks?.filter(t => t.id !== deletedTask.id)
        }
      }
    },
    setActiveProjectBoard: (state, action) => {
      try {
        const project = action.payload as ProjectResponseForBoard
        const listOrder = project?.listOrder?.split(',')
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
    },
    setFilters: (state, action) => {
      const filters = action.payload as ProjectFilterType
      state.activeProject.currentFilters = filters
    }
  }
})
