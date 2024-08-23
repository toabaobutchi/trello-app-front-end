import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { mapOrder } from '@utils/functions'
import { ProjectFilterType, DragOverResult } from '@utils/types'
import { AssignmentResponse, ChangePermissionResonse } from '@utils/types/assignment.type'
import {
  DeletedListResponse,
  UpdatedListResponse,
  ListResponseForBoard,
  CreateListResponse
} from '@utils/types/list.type'
import { ProjectResponseForBoard } from '@utils/types/project.type'
import { DeletedTaskAssignmentResponse } from '@utils/types/task-assignment.type'
import {
  DeletedRelationshipResponse,
  DispatchRelatedTaskResponse,
  AssignByTaskResponse,
  MarkedTaskResponse,
  UpdatedTaskResponse,
  DeletedTaskResponse,
  CreateTaskResponse,
  TaskResponseForBoard,
  ChangeTaskOrderResponse,
  JoinTaskResponse
} from '@utils/types/task.type'

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
    changePermission: (state, action: PayloadAction<ChangePermissionResonse>) => {
      const data = action.payload
      if (data) {
        const member = state.activeProject.members.find(m => m.id === data.assignmentId)
        if (member) {
          member.permission = data.newPermission
          state.activeProject.changeId = new Date().getTime()
        }
      }
    },
    removeAssignment: (state, action: PayloadAction<string>) => {
      const assignmentId = action.payload
      if (assignmentId) {
        state.activeProject.members = state.activeProject.members.filter(m => m.id === assignmentId)
        state.activeProject.onlineMembers = state.activeProject.onlineMembers.filter(m => m !== assignmentId)
        state.activeProject.changeId = new Date().getTime()
      }
    },
    removeFromChildren: (state, action: PayloadAction<DeletedRelationshipResponse>) => {
      const data = action.payload
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
    removeFromDependencies: (state, action: PayloadAction<DeletedRelationshipResponse>) => {
      const data = action.payload
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
    addFromChildren: (state, action: PayloadAction<DispatchRelatedTaskResponse>) => {
      const data = action.payload
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
    addFromDependencies: (state, action: PayloadAction<DispatchRelatedTaskResponse>) => {
      const data = action.payload
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
    removeTaskAssignment: (state, action: PayloadAction<DeletedTaskAssignmentResponse>) => {
      const data = action.payload
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
    addAssignmentToTask: (state, action: PayloadAction<AssignByTaskResponse>) => {
      const data = action.payload
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
    markTask: (state, action: PayloadAction<MarkedTaskResponse>) => {
      const data = action.payload
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
    deleteList: (state, action: PayloadAction<DeletedListResponse>) => {
      const data = action.payload
      if (data) {
        state.activeProject.board.lists = state.activeProject.board.lists?.filter(l => l.id !== data.id)
        state.activeProject.changeId = new Date().getTime()
      }
    },
    joinTask: (state, action: PayloadAction<JoinTaskResponse>) => {
      const data = action?.payload
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
    changeSubtaskStatus: (state, action: PayloadAction<{ taskId: string; status: boolean }>) => {
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
    changeSubtaskCount: (state, action: PayloadAction<{ taskId: string; subtaskCount: number }>) => {
      const data = action.payload
      const taskId = data?.taskId
      const subtaskCount = data?.subtaskCount
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
    updateTaskInfo: (state, action: PayloadAction<UpdatedTaskResponse>) => {
      const data = action.payload
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
    updateListInfo: (state, action: PayloadAction<UpdatedListResponse>) => {
      const updatedList = action?.payload
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
    deleteTask: (state, action: PayloadAction<DeletedTaskResponse>) => {
      const deletedTask = action.payload
      if (deletedTask) {
        const list = state.activeProject.board.lists?.find(l => l.id === deletedTask.listId)
        if (list) {
          list.tasks = list.tasks?.filter(t => t.id !== deletedTask.id)
        }
      }
    },
    setActiveProjectBoard: (state, action: PayloadAction<ProjectResponseForBoard>) => {
      const project = action.payload
      const listOrder = project?.listOrder?.split(',')
      project!.lists = [...mapOrder(project?.lists as ListResponseForBoard[], listOrder as string[], 'id')]
      state.activeProject.board = project
    },
    addNewList: (state, action: PayloadAction<CreateListResponse>) => {
      const res = action.payload
      state.activeProject.board.lists?.push(res.createdList)
      state.activeProject.board.listOrder = res.listOrder
    },
    addNewTask: (state, action: PayloadAction<CreateTaskResponse>) => {
      const res = action.payload
      const task = res.createdTask
      const list = state.activeProject.board.lists?.find(l => l.id === task.listId)
      if (list) {
        list.tasks?.push(task)
        list.taskOrder = res.taskOrder
      }
    },
    changeListOrder: (state, action: PayloadAction<string>) => {
      const newListOrder = action?.payload
      state.activeProject.board.listOrder = newListOrder
      state.activeProject.board!.lists = mapOrder(state.activeProject.board?.lists, newListOrder?.split(','), 'id')
    },
    changeTaskOrder: (
      state,
      action: PayloadAction<{ resData?: ChangeTaskOrderResponse; dragOverResult?: DragOverResult }>
    ) => {
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
    setProjectMembers: (state, action: PayloadAction<AssignmentResponse[]>) => {
      const members = action.payload
      state.activeProject.members = members
    },
    setOnlineMembers: (state, action: PayloadAction<string[]>) => {
      const onlineMembers = action.payload
      state.activeProject.onlineMembers = onlineMembers
    },
    setDuplicateTasks: (state, action: PayloadAction<TaskResponseForBoard[]>) => {
      const tasks = action.payload
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
    setFilters: (state, action: PayloadAction<ProjectFilterType>) => {
      const filters = action.payload
      state.activeProject.currentFilters = filters
    }
  }
})
