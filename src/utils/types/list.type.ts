import { TaskResponseForBoard } from "./task.type"

export type UpdateListModel = {
  name?: string
  description?: string
  wipLimit?: number
}

export type DeletedListResponse = {
  id: string
  name: string
  projectId: string
}

export type UpdatedListResponse = {
  id: string
  name?: string
  description?: string
  wipLimit?: number
}

export type ListResponseForBoard = {
  id: string
  name: string
  createdAt: number
  projectId: string
  taskOrder?: string
  wipLimit?: number
  tasks?: TaskResponseForBoard[]
}

export type CreateListModel = {
  name: string
  projectId: string
}

export type CreateListResponse = {
  createdList: ListResponseForBoard
  listOrder?: string
}