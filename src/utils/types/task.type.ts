import { SubtaskForBoard } from './subtask.type'
import { DeleterReponse } from './user.type'

export type JoinedTaskResponse = {
  id: string
  name: string
  isCompleted?: boolean
  priority?: string
  isMarkedNeedHelp?: boolean
  listId: string
  listName: string
  dueDate?: number
  assignedAt: number
  assignmentCount: number
}

export type TaskDetailForBoard = {
  id: string
  name: string
  isMarkedNeedHelp?: boolean
  priority: string
  description?: string
  listId: string
  listName: string
  dueDate?: number
  lastListUpdatedAt?: number
  attachmentsCount: number
  creatorId?: string // assignment id
  taskAssignmentIds?: string[]
  subTasks?: SubtaskForBoard[]
  isCompleted?: boolean
  isReOpened?: boolean
  startedAt?: number
}

export type MarkedTaskResponse = {
  id: string
  listId: string
  isCompleted?: boolean
  isReOpened?: boolean
  isMarkedNeedHelp?: boolean
}

export type ChangeTaskOrderModel = {
  oldListId: string
  newListId: string
  newTaskOrder: string
  oldTaskOrder: string
}

export type TaskResponseForBoard = {
  id: string
  name: string
  description?: string
  isCompleted?: boolean
  createdAt: number
  dueDate?: number
  priority?: string
  listId: string
  isReOpened?: boolean
  lastListUpdatedAt?: number
  taskAssignmentIds: string[]
  commentCount: number
  completedSubTaskCount?: number
  subTaskCount?: number
  isMarkedNeedHelp?: boolean
  startedAt?: number
  dependencyIds?: string[]
}

export type DeletedTaskResponse = {
  id: string
  listId: string
}

export interface TaskResponseForTable extends TaskResponseForBoard {
  listName: string
}

export type CreateTaskResponse = {
  createdTask: TaskResponseForBoard
  taskOrder?: string
}

export type UpdatedTaskResponse = {
  id: string
  listId: string
  name?: string
  description?: string
  dueDate?: number
  priority?: string
  startedAt?: number
}

export type InTrashTaskResponse = {
  id: string
  name: string
  description?: string
  deletedAt: number
  deleter?: DeleterReponse
}

export type AssignByTaskModel = {
  assignmentIds: string[]
}

export type AssignByTaskResponse = {
  taskId: string
  assignerId: string
} & AssignByTaskModel

export type MarkTaskModel = {
  isCompleted?: boolean
  isMarkedNeedHelp?: boolean
  isReOpened?: boolean
}

export type UpdateTaskModel = {
  name?: string
  dueDate?: number
  priority?: string
  description?: string
  startedAt?: number
}

export type ResetTaskModel = {
  resetPriority?: boolean
  resetDueDate?: boolean
  resetStartDate?: boolean
  resetDescription?: boolean
}

export type RelatedTaskResponse = {
  id: string
  name: string
  listId: string
  createdAt: number
  startedAt?: number
  dueDate?: number
  priority?: string
  isCompleted?: boolean
  isReOpened?: boolean
  isMarkedNeedHelp?: boolean
}

export type ReferenceTasks = {
  dependencies: RelatedTaskResponse[]
  childTasks: RelatedTaskResponse[]
}

export type DeletedRelationshipResponse = {
  taskId: string
  relationshipType: string
  relationshipId: string
}

export type DispatchRelatedTaskResponse = {
  taskId: string
  relatedTasks: RelatedTaskResponse[]
}

export type DuplicateTaskModel = {
  inheritPriority?: boolean
  inheritDescription?: boolean
  inheritDueDate?: boolean
  duplicateTaskCount: number
  listId: string
}

export type ChangeTaskOrderResponse = {
  updatedOldListId: string
  updatedNewListId: string
  updatedNewTaskOrder: string
  updatedOldTaskOrder: string
}

export type CreateTaskModel = {
  name: string
  listId: string
}